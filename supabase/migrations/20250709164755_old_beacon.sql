/*
  # Fix RLS policies for crop predictions

  1. Policy Updates
    - Allow authenticated users to insert crop predictions
    - Allow authenticated users to update crop predictions
    - Maintain read access for all authenticated users

  2. Security
    - Keep RLS enabled
    - Ensure proper access control
*/

-- Simple approach: Drop and recreate policies without complex checks
DROP POLICY IF EXISTS "Anyone can read crop predictions" ON crop_predictions;
DROP POLICY IF EXISTS "System can insert crop predictions" ON crop_predictions;
DROP POLICY IF EXISTS "System can update crop predictions" ON crop_predictions;
DROP POLICY IF EXISTS "Authenticated users can insert crop predictions" ON crop_predictions;
DROP POLICY IF EXISTS "Authenticated users can update crop predictions" ON crop_predictions;

-- Create comprehensive policies for crop_predictions
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

-- Ensure the profiles policy exists for user registration
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;

CREATE POLICY "Enable insert for authenticated users only"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);