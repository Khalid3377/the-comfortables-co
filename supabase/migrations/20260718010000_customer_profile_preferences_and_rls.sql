-- Persist account preferences on the same internal customer record used by
-- addresses, orders, and rewards.
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS size_profile JSONB NOT NULL
    DEFAULT '{"chest":"","waist":"","hips":"","preferredFit":"Regular"}'::jsonb,
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB NOT NULL
    DEFAULT '{"emailAlerts":true,"smsUpdates":true,"orderUpdates":true,"promotions":false,"newArrivals":true}'::jsonb;

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can select their own profile" ON customers;
DROP POLICY IF EXISTS "Customers can update their own profile" ON customers;

CREATE POLICY "Customers can select their own profile"
  ON customers FOR SELECT TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Customers can update their own profile"
  ON customers FOR UPDATE TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);
