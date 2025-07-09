/*
  # Clean sample data and preserve essential functions

  1. Data Cleanup
    - Remove sample crop predictions
    - Remove sample warnings
    - Keep districts (insert only if not exists)

  2. Functions
    - Preserve user ranking functions
    - Preserve contribution tracking functions
*/

-- Insert districts only if they don't already exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM districts WHERE name = 'Cianjur' AND province = 'Jawa Barat') THEN
    INSERT INTO districts (name, province) VALUES ('Cianjur', 'Jawa Barat');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM districts WHERE name = 'Garut' AND province = 'Jawa Barat') THEN
    INSERT INTO districts (name, province) VALUES ('Garut', 'Jawa Barat');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM districts WHERE name = 'Bandung' AND province = 'Jawa Barat') THEN
    INSERT INTO districts (name, province) VALUES ('Bandung', 'Jawa Barat');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM districts WHERE name = 'Sumedang' AND province = 'Jawa Barat') THEN
    INSERT INTO districts (name, province) VALUES ('Sumedang', 'Jawa Barat');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM districts WHERE name = 'Tasikmalaya' AND province = 'Jawa Barat') THEN
    INSERT INTO districts (name, province) VALUES ('Tasikmalaya', 'Jawa Barat');
  END IF;
END $$;

-- Remove all sample crop predictions
DELETE FROM crop_predictions WHERE 
  name IN ('Jagung', 'Kangkung', 'Kedelai', 'Wortel', 'Padi')
  AND (
    description LIKE '%Sangat cocok untuk musim hujan%'
    OR description LIKE '%Cocok untuk panen cepat%'
    OR description LIKE '%Cukup cocok namun perlu perhatian%'
    OR description LIKE '%Kurang cocok untuk musim ini%'
    OR description LIKE '%Varietas unggul memberikan hasil optimal%'
  );

-- Remove all sample warnings
DELETE FROM warnings WHERE 
  title IN (
    'Serangan Wereng Coklat',
    'Curah Hujan Tinggi', 
    'Penyakit Blas Daun',
    'Harga Jagung Turun',
    'Ulat Grayak Menyerang'
  );

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