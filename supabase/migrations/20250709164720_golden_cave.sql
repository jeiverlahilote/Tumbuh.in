/*
  # Fix RLS Policies for Crop Predictions and Profiles

  1. Policy Updates
    - Allow authenticated users to insert crop predictions
    - Allow authenticated users to update crop predictions
    - Ensure profiles can be created for new users

  2. Security
    - Maintain read access for all authenticated users
    - Enable AI system to save predictions
    - Preserve existing security model
*/

-- Function to safely drop policy if exists
DO $$
BEGIN
  -- Drop crop predictions policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'crop_predictions' 
    AND policyname = 'Anyone can read crop predictions'
  ) THEN
    DROP POLICY "Anyone can read crop predictions" ON crop_predictions;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'crop_predictions' 
    AND policyname = 'System can insert crop predictions'
  ) THEN
    DROP POLICY "System can insert crop predictions" ON crop_predictions;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'crop_predictions' 
    AND policyname = 'System can update crop predictions'
  ) THEN
    DROP POLICY "System can update crop predictions" ON crop_predictions;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'crop_predictions' 
    AND policyname = 'Authenticated users can insert crop predictions'
  ) THEN
    DROP POLICY "Authenticated users can insert crop predictions" ON crop_predictions;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'crop_predictions' 
    AND policyname = 'Authenticated users can update crop predictions'
  ) THEN
    DROP POLICY "Authenticated users can update crop predictions" ON crop_predictions;
  END IF;

  -- Drop profiles policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Enable insert for authenticated users only'
  ) THEN
    DROP POLICY "Enable insert for authenticated users only" ON profiles;
  END IF;
END $$;

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

-- Ensure profiles policy allows insert for new users
CREATE POLICY "Enable insert for authenticated users only"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure RLS is enabled on crop_predictions table
ALTER TABLE crop_predictions ENABLE ROW LEVEL SECURITY;

-- Ensure RLS is enabled on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;