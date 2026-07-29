CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id)
    ON DELETE CASCADE,
  product_id UUID REFERENCES products(id)
    ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  size TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON cart_items
  FOR ALL
  USING (
    customer_id IN (
      SELECT id FROM customers
      WHERE auth_user_id = auth.uid()
    )
  );
