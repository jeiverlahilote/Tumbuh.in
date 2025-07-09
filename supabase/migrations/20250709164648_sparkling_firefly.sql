/*
  # Fix crop predictions RLS policy

  1. Policy Updates
    - Allow authenticated users to insert crop predictions
    - Keep read access for all authenticated users
    - Add update policy for system-generated predictions

  2. Security
    - Maintain RLS enabled
    - Allow AI system to save predictions
    - Preserve data integrity
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read crop predictions" ON crop_predictions;
DROP POLICY IF EXISTS "System can insert crop predictions" ON crop_predictions;
DROP POLICY IF EXISTS "System can update crop predictions" ON crop_predictions;

-- Create new policies for crop predictions
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

-- Also ensure profiles policy allows insert for new users
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;

CREATE POLICY "Enable insert for authenticated users only"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);