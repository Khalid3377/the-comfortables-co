-- A successful retry must be able to promote a previously failed order.
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
  INSERT INTO orders (order_number, customer_id, customer_email, status, items, subtotal, discount, total, shipping_address, payment_method, payment_id)
  VALUES (p_order_number, p_customer_id, p_customer_email, 'paid', COALESCE(p_items, '[]'::jsonb), p_subtotal, 0, p_total, p_shipping_address, 'razorpay', p_payment_id)
  ON CONFLICT (order_number) DO UPDATE SET
    customer_id = EXCLUDED.customer_id,
    customer_email = EXCLUDED.customer_email,
    status = CASE WHEN orders.status IN ('pending', 'failed') THEN 'paid' ELSE orders.status END,
    items = CASE WHEN orders.status IN ('pending', 'failed') THEN EXCLUDED.items ELSE orders.items END,
    subtotal = CASE WHEN orders.status IN ('pending', 'failed') THEN EXCLUDED.subtotal ELSE orders.subtotal END,
    total = CASE WHEN orders.status IN ('pending', 'failed') THEN EXCLUDED.total ELSE orders.total END,
    shipping_address = CASE WHEN orders.status IN ('pending', 'failed') THEN EXCLUDED.shipping_address ELSE orders.shipping_address END,
    payment_method = 'razorpay',
    payment_id = CASE WHEN orders.status IN ('pending', 'failed') THEN EXCLUDED.payment_id ELSE orders.payment_id END
  RETURNING id INTO v_order_id;

  INSERT INTO order_items (order_id, customer_id, item_index, product_slug, product_name, quantity, unit_price, size, color)
  SELECT v_order_id, p_customer_id, source.ordinality - 1,
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
