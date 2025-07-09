/*
  # Initial Schema for FarmForecast

  1. New Tables
    - `profiles` - User profile information
    - `farm_data` - Farm data submissions from users
    - `crop_predictions` - AI-generated crop predictions
    - `warnings` - Early warning system data
    - `districts` - Geographic districts/regions
    - `contributions` - User contribution tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user ownership
*/

-- Create districts table
CREATE TABLE IF NOT EXISTS districts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  province text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  location text,
  district_id uuid REFERENCES districts(id),
  join_date timestamptz DEFAULT now(),
  contributions integer DEFAULT 0,
  rank integer DEFAULT 0,
  accuracy_score numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create farm_data table
CREATE TABLE IF NOT EXISTS farm_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  location text NOT NULL,
  district text NOT NULL,
  soil_type text NOT NULL CHECK (soil_type IN ('clay', 'loam', 'sand', 'silt')),
  land_condition text NOT NULL CHECK (land_condition IN ('wet', 'dry', 'flooded', 'normal')),
  current_crop text NOT NULL,
  last_harvest_quantity numeric NOT NULL,
  last_harvest_condition text NOT NULL CHECK (last_harvest_condition IN ('excellent', 'good', 'fair', 'poor')),
  pest_issues text,
  weather_condition text NOT NULL,
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create crop_predictions table
CREATE TABLE IF NOT EXISTS crop_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  suitability text NOT NULL CHECK (suitability IN ('high', 'medium', 'low')),
  estimated_yield text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  district text,
  season text,
  accuracy_percentage numeric DEFAULT 0,
  based_on_reports integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create warnings table
CREATE TABLE IF NOT EXISTS warnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('pest', 'disease', 'weather', 'market')),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  reported_by integer DEFAULT 1,
  date timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contributions table for tracking user activities
CREATE TABLE IF NOT EXISTS contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('farm_data', 'warning_report', 'prediction_feedback')),
  points integer DEFAULT 10,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read all profiles for leaderboard"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Farm data policies
CREATE POLICY "Users can read all farm data"
  ON farm_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own farm data"
  ON farm_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own farm data"
  ON farm_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Crop predictions policies
CREATE POLICY "Anyone can read crop predictions"
  ON crop_predictions
  FOR SELECT
  TO authenticated
  USING (true);

-- Warnings policies
CREATE POLICY "Anyone can read warnings"
  ON warnings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert warnings"
  ON warnings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Contributions policies
CREATE POLICY "Users can read own contributions"
  ON contributions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read all contributions for stats"
  ON contributions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert contributions"
  ON contributions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Districts policies
CREATE POLICY "Anyone can read districts"
  ON districts
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample districts
INSERT INTO districts (name, province) VALUES
  ('Cianjur', 'Jawa Barat'),
  ('Garut', 'Jawa Barat'),
  ('Bandung', 'Jawa Barat'),
  ('Sumedang', 'Jawa Barat'),
  ('Tasikmalaya', 'Jawa Barat');

-- Insert sample crop predictions
INSERT INTO crop_predictions (name, suitability, estimated_yield, description, icon, district, season, accuracy_percentage, based_on_reports) VALUES
  ('Jagung', 'high', '4-6 ton/ha', 'Sangat cocok untuk musim hujan. Tanah lempung mendukung pertumbuhan optimal.', '🌽', 'Cianjur', 'Musim Hujan', 87, 156),
  ('Kangkung', 'high', '8-12 ton/ha', 'Cocok untuk panen cepat. Membutuhkan air yang cukup dan tahan cuaca basah.', '🥬', 'Cianjur', 'Musim Hujan', 92, 89),
  ('Kedelai', 'medium', '2-3 ton/ha', 'Cukup cocok namun perlu perhatian drainase karena kondisi tanah basah.', '🫘', 'Cianjur', 'Musim Hujan', 78, 67),
  ('Wortel', 'low', '1-2 ton/ha', 'Kurang cocok untuk musim ini. Tanah terlalu basah untuk umbi-umbian.', '🥕', 'Cianjur', 'Musim Hujan', 45, 34);

-- Insert sample warnings
INSERT INTO warnings (type, title, description, location, severity, reported_by) VALUES
  ('pest', 'Serangan Wereng Coklat', 'Peningkatan populasi wereng coklat di area persawahan. Segera lakukan monitoring dan pengendalian.', 'Desa Sukamaju, Kec. Cianjur', 'high', 8),
  ('weather', 'Curah Hujan Tinggi', 'Prediksi curah hujan tinggi selama 3 hari ke depan. Persiapkan drainase dan tunda aktivitas penyemprotan.', 'Kecamatan Garut', 'medium', 15),
  ('disease', 'Penyakit Blas Daun', 'Ditemukan gejala blas daun pada tanaman padi. Aplikasi fungisida preventif direkomendasikan.', 'Desa Makmur, Kec. Bandung', 'medium', 5),
  ('market', 'Harga Jagung Turun', 'Penurunan harga jagung di pasar lokal. Pertimbangkan strategi penjualan atau penyimpanan.', 'Pasar Induk Caringin', 'low', 12);

-- Function to update user rank based on contributions
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS void AS $$
BEGIN
  WITH ranked_users AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY contributions DESC, accuracy_score DESC) as new_rank
    FROM profiles
    WHERE contributions > 0
  )
  UPDATE profiles 
  SET rank = ranked_users.new_rank
  FROM ranked_users
  WHERE profiles.id = ranked_users.id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment user contributions
CREATE OR REPLACE FUNCTION increment_user_contributions(user_uuid uuid, points_to_add integer DEFAULT 10)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET 
    contributions = contributions + 1,
    updated_at = now()
  WHERE id = user_uuid;
  
  INSERT INTO contributions (user_id, type, points, description)
  VALUES (user_uuid, 'farm_data', points_to_add, 'Data submission contribution');
  
  PERFORM update_user_rank();
END;
$$ LANGUAGE plpgsql;