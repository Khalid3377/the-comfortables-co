-- payment.captured finalizes the pending row created at checkout. It never
-- inserts a second order, avoiding duplicate order_number violations.
CREATE OR REPLACE FUNCTION finalize_razorpay_order(
  p_order_number TEXT,
  p_items JSONB,
  p_payment_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
  v_customer_id UUID;
BEGIN
  UPDATE orders
  SET status = 'paid',
      payment_id = p_payment_id,
      payment_method = 'razorpay'
  WHERE order_number = p_order_number
  RETURNING id, customer_id INTO v_order_id, v_customer_id;

  IF v_order_id IS NULL OR v_customer_id IS NULL THEN
    RAISE EXCEPTION 'Pending order not found for Razorpay order %', p_order_number;
  END IF;

  INSERT INTO order_items (
    order_id, customer_id, item_index, product_slug, product_name,
    quantity, unit_price, size, color
  )
  SELECT
    v_order_id, v_customer_id, source.ordinality - 1,
    COALESCE(source.item ->> 'productSlug', ''),
    COALESCE(source.item ->> 'productName', source.item ->> 'productSlug', 'Item'),
    GREATEST(COALESCE(NULLIF(source.item ->> 'quantity', '')::INTEGER, 1), 1),
    GREATEST(COALESCE(NULLIF(source.item ->> 'price', '')::NUMERIC, 0), 0),
    NULLIF(source.item ->> 'size', ''), NULLIF(source.item ->> 'color', '')
  FROM jsonb_array_elements(COALESCE(p_items, '[]'::jsonb)) WITH ORDINALITY AS source(item, ordinality)
  ON CONFLICT (order_id, item_index) DO NOTHING;

  RETURN v_order_id;
END;
$$;

REVOKE ALL ON FUNCTION finalize_razorpay_order(TEXT, JSONB, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION finalize_razorpay_order(TEXT, JSONB, TEXT) TO service_role;
