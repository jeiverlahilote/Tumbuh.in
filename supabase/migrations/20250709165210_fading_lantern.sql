/*
  # Fix crop predictions policies

  1. Security Updates
    - Allow authenticated users to insert crop predictions
    - Allow authenticated users to update crop predictions
    - Maintain read access for all authenticated users

  2. Profile Policies
    - Ensure user registration works properly
*/

-- Simple policy updates for crop_predictions
DROP POLICY IF EXISTS "Anyone can read crop predictions" ON crop_predictions;
DROP POLICY IF EXISTS "Authenticated users can insert crop predictions" ON crop_predictions;
DROP POLICY IF EXISTS "Authenticated users can update crop predictions" ON crop_predictions;

-- Create policies for crop_predictions
CREATE POLICY "Anyone can read crop predictions"
  ON crop_predictions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert crop predictions"
  ON crop_predictions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update crop predictions"
  ON crop_predictions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Ensure profiles policy exists
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;

CREATE POLICY "Enable insert for authenticated users only"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);