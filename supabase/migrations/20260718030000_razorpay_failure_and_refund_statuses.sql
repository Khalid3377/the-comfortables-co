-- Allow webhook-driven terminal payment statuses.
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'shipped', 'delivered', 'cancelled'));

-- Returns a descriptive result instead of throwing for duplicate deliveries.
-- PostgreSQL functions execute atomically, so a failed update cannot leave a
-- partially applied status transition.
CREATE OR REPLACE FUNCTION transition_razorpay_order_status(
  p_payment_id TEXT,
  p_order_number TEXT,
  p_target_status TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
  v_current_status TEXT;
BEGIN
  IF p_target_status NOT IN ('failed', 'refunded') THEN
    RAISE EXCEPTION 'Unsupported Razorpay order status: %', p_target_status;
  END IF;

  SELECT id, status INTO v_order_id, v_current_status
  FROM orders
  WHERE payment_id = p_payment_id
     OR (p_order_number IS NOT NULL AND order_number = p_order_number)
  ORDER BY CASE WHEN payment_id = p_payment_id THEN 0 ELSE 1 END
  LIMIT 1;

  IF v_order_id IS NULL THEN
    RETURN 'not_found';
  END IF;

  IF v_current_status = p_target_status THEN
    RETURN 'already_' || p_target_status;
  END IF;

  -- A failed payment must not downgrade an already-paid order. Refunds may
  -- transition a completed payment from any non-refunded state.
  IF p_target_status = 'failed' AND v_current_status <> 'pending' THEN
    RETURN 'ignored_' || v_current_status;
  END IF;

  UPDATE orders SET status = p_target_status WHERE id = v_order_id;
  RETURN 'updated';
END;
$$;

REVOKE ALL ON FUNCTION transition_razorpay_order_status(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION transition_razorpay_order_status(TEXT, TEXT, TEXT) TO service_role;
