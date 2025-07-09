/*
  # Fix RLS policies for crop predictions and profiles

  1. Policy Updates
    - Allow authenticated users to read all crop predictions
    - Allow authenticated users to insert crop predictions (for AI system)
    - Allow authenticated users to update crop predictions
    - Allow authenticated users to insert profiles (for registration)

  2. Security
    - Maintain RLS on all tables
    - Ensure proper access control
*/

-- First, ensure RLS is enabled on tables
DO $$
BEGIN
  -- Enable RLS if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'crop_predictions' 
    AND n.nspname = 'public' 
    AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE crop_predictions ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'profiles' 
    AND n.nspname = 'public' 
    AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing conflicting policies if they exist
DO $$
BEGIN
  -- Drop crop_predictions policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'crop_predictions' AND policyname = 'Anyone can read crop predictions') THEN
    DROP POLICY "Anyone can read crop predictions" ON crop_predictions;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'crop_predictions' AND policyname = 'Authenticated users can insert crop predictions') THEN
    DROP POLICY "Authenticated users can insert crop predictions" ON crop_predictions;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'crop_predictions' AND policyname = 'Authenticated users can update crop predictions') THEN
    DROP POLICY "Authenticated users can update crop predictions" ON crop_predictions;
  END IF;

  -- Drop profiles policy
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Enable insert for authenticated users only') THEN
    DROP POLICY "Enable insert for authenticated users only" ON profiles;
  END IF;
END $$;

-- Create new policies for crop_predictions
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

-- Create policy for profiles registration
CREATE POLICY "Enable insert for authenticated users only"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON crop_predictions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;