/*
  # Fix RLS policies for crop predictions and profiles

  1. Policy Updates
    - Update crop_predictions policies to allow authenticated users to insert/update
    - Ensure profiles policy allows user registration
    - Maintain security while allowing AI predictions

  2. Security
    - Keep RLS enabled
    - Allow authenticated users to perform necessary operations
    - Maintain data integrity
*/

-- Update crop_predictions policies
CREATE POLICY IF NOT EXISTS "Anyone can read crop predictions"
  ON crop_predictions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can insert crop predictions"
  ON crop_predictions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can update crop predictions"
  ON crop_predictions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Ensure profiles policy allows user registration
CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users only"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure RLS is enabled (should already be enabled from initial migration)
ALTER TABLE crop_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;