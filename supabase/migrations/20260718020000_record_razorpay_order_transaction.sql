-- A webhook may be retried. This unique index and function make each payment
-- idempotent while committing its order and line items in one transaction.
CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_id_key
  ON orders (payment_id) WHERE payment_id IS NOT NULL;

CREATE OR REPLACE FUNCTION record_razorpay_order(
  p_order_number TEXT,
  p_customer_id UUID,
  p_customer_email TEXT,
  p_items JSONB,
  p_subtotal NUMERIC,
  p_total NUMERIC,
  p_shipping_address JSONB,
  p_payment_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
BEGIN
  INSERT INTO orders (
    order_number, customer_id, customer_email, status, items, subtotal,
    discount, total, shipping_address, payment_method, payment_id
  ) VALUES (
    p_order_number, p_customer_id, p_customer_email, 'paid', COALESCE(p_items, '[]'::jsonb),
    p_subtotal, 0, p_total, p_shipping_address, 'razorpay', p_payment_id
  )
  ON CONFLICT (payment_id) WHERE payment_id IS NOT NULL
  DO UPDATE SET payment_id = EXCLUDED.payment_id
  RETURNING id INTO v_order_id;

  INSERT INTO order_items (
    order_id, customer_id, item_index, product_slug, product_name,
    quantity, unit_price, size, color
  )
  SELECT
    v_order_id,
    p_customer_id,
    source.ordinality - 1,
    COALESCE(source.item ->> 'productSlug', ''),
    COALESCE(source.item ->> 'productName', source.item ->> 'productSlug', 'Item'),
    GREATEST(COALESCE(NULLIF(source.item ->> 'quantity', '')::INTEGER, 1), 1),
    GREATEST(COALESCE(NULLIF(source.item ->> 'price', '')::NUMERIC, 0), 0),
    NULLIF(source.item ->> 'size', ''),
    NULLIF(source.item ->> 'color', '')
  FROM jsonb_array_elements(COALESCE(p_items, '[]'::jsonb)) WITH ORDINALITY AS source(item, ordinality)
  ON CONFLICT (order_id, item_index) DO NOTHING;

  RETURN v_order_id;
END;
$$;

REVOKE ALL ON FUNCTION record_razorpay_order(TEXT, UUID, TEXT, JSONB, NUMERIC, NUMERIC, JSONB, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION record_razorpay_order(TEXT, UUID, TEXT, JSONB, NUMERIC, NUMERIC, JSONB, TEXT) TO service_role;
