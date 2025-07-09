import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, MapPin, CheckCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export function UserInput() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    location: '',
    district: '',
    soilType: '',
    landCondition: '',
    currentCrop: '',
    lastHarvestQuantity: '',
    lastHarvestCondition: '',
    pestIssues: '',
    weatherCondition: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const soilTypes = [
    { value: '', label: 'Pilih jenis tanah' },
    { value: 'clay', label: 'Tanah Liat' },
    { value: 'loam', label: 'Tanah Lempung' },
    { value: 'sand', label: 'Tanah Pasir' },
    { value: 'silt', label: 'Tanah Debu' }
  ];

  const landConditions = [
    { value: '', label: 'Pilih kondisi lahan' },
    { value: 'wet', label: 'Basah' },
    { value: 'dry', label: 'Kering' },
    { value: 'flooded', label: 'Tergenang' },
    { value: 'normal', label: 'Normal' }
  ];

  const harvestConditions = [
    { value: '', label: 'Pilih kondisi panen' },
    { value: 'excellent', label: 'Sangat Baik' },
    { value: 'good', label: 'Baik' },
    { value: 'fair', label: 'Cukup' },
    { value: 'poor', label: 'Buruk' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Anda harus login terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.location || !formData.district || !formData.soilType || 
          !formData.landCondition || !formData.currentCrop || 
          !formData.lastHarvestQuantity || !formData.lastHarvestCondition || 
          !formData.weatherCondition) {
        throw new Error('Semua field wajib harus diisi');
      }

      const harvestQuantity = parseFloat(formData.lastHarvestQuantity);
      if (isNaN(harvestQuantity) || harvestQuantity <= 0) {
        throw new Error('Jumlah panen harus berupa angka yang valid');
      }

      // Insert farm data
      const farmDataPayload = {
        user_id: user.id,
        location: formData.location.trim(),
        district: formData.district.trim(),
        soil_type: formData.soilType as 'clay' | 'loam' | 'sand' | 'silt',
        land_condition: formData.landCondition as 'wet' | 'dry' | 'flooded' | 'normal',
        current_crop: formData.currentCrop.trim(),
        last_harvest_quantity: harvestQuantity,
        last_harvest_condition: formData.lastHarvestCondition as 'excellent' | 'good' | 'fair' | 'poor',
        pest_issues: formData.pestIssues.trim() || null,
        weather_condition: formData.weatherCondition.trim()
      };


      const { data: insertedData, error: insertError } = await supabase
        .from('farm_data')
        .insert(farmDataPayload)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }


      // Update user contributions
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          contributions: user.contributions + 1,
          location: `${formData.location}, Kec. ${formData.district}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        // Don't throw here, as the main data was saved successfully
      }

      // Insert contribution record
      const { error: contributionError } = await supabase
        .from('contributions')
        .insert({
          user_id: user.id,
          type: 'farm_data',
          points: 10,
          description: `Data submission for ${formData.currentCrop} in ${formData.location}`
        });

      if (contributionError) {
        // Don't throw here, as the main data was saved successfully
      }

      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          location: '',
          district: '',
          soilType: '',
          landCondition: '',
          currentCrop: '',
          lastHarvestQuantity: '',
          lastHarvestCondition: '',
          pestIssues: '',
          weatherCondition: ''
        });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="text-center">
            <div className="w-16 h-16 bg-[#00FFA3]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-[#00FFA3]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Data Berhasil Disimpan!
            </h2>
            <p className="text-gray-400 mb-6">
              Terima kasih atas kontribusi Anda. Data akan diproses untuk menghasilkan prediksi yang lebih akurat.
            </p>
            <div className="bg-[#00FFA3]/10 border border-[#00FFA3]/20 rounded-lg p-4">
              <p className="text-[#00FFA3] font-medium">
                +10 Poin Kontribusi Diterima
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Upload className="h-8 w-8 text-[#00FFA3]" />
          <h1 className="text-3xl font-bold text-white">Input Data Lahan</h1>
        </div>
        <p className="text-gray-400">
          Bagikan data lahan dan panen Anda untuk membantu komunitas mendapatkan prediksi yang lebih akurat.
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Location Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="flex items-center space-x-2 mb-6">
                <MapPin className="h-5 w-5 text-[#00FFA3]" />
                <h2 className="text-xl font-semibold text-white">Informasi Lokasi</h2>
              </div>
              
              <div className="space-y-4">
                <Input
                  label="Lokasi (Desa/Kecamatan)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Contoh: Desa Sukamaju"
                  required
                />
                
                <Input
                  label="Kecamatan"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Contoh: Cianjur"
                  required
                />
              </div>
            </Card>
          </motion.div>

          {/* Land Condition */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6">Kondisi Lahan</h2>
              
              <div className="space-y-4">
                <Select
                  label="Jenis Tanah"
                  options={soilTypes}
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  required
                />
                
                <Select
                  label="Kondisi Lahan"
                  options={landConditions}
                  value={formData.landCondition}
                  onChange={(e) => setFormData({ ...formData, landCondition: e.target.value })}
                  required
                />
              </div>
            </Card>
          </motion.div>

          {/* Crop Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6">Informasi Tanaman</h2>
              
              <div className="space-y-4">
                <Input
                  label="Komoditas Saat Ini"
                  value={formData.currentCrop}
                  onChange={(e) => setFormData({ ...formData, currentCrop: e.target.value })}
                  placeholder="Contoh: Padi, Jagung, Kedelai"
                  required
                />
                
                <Input
                  label="Jumlah Panen Terakhir (kg)"
                  type="number"
                  value={formData.lastHarvestQuantity}
                  onChange={(e) => setFormData({ ...formData, lastHarvestQuantity: e.target.value })}
                  placeholder="Contoh: 1500"
                  min="0"
                  step="0.1"
                  required
                />
                
                <Select
                  label="Kondisi Panen Terakhir"
                  options={harvestConditions}
                  value={formData.lastHarvestCondition}
                  onChange={(e) => setFormData({ ...formData, lastHarvestCondition: e.target.value })}
                  required
                />
              </div>
            </Card>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6">Informasi Tambahan</h2>
              
              <div className="space-y-4">
                <Input
                  label="Masalah Hama/Penyakit (Opsional)"
                  value={formData.pestIssues}
                  onChange={(e) => setFormData({ ...formData, pestIssues: e.target.value })}
                  placeholder="Contoh: Wereng, Ulat grayak"
                />
                
                <Input
                  label="Kondisi Cuaca Minggu Lalu"
                  value={formData.weatherCondition}
                  onChange={(e) => setFormData({ ...formData, weatherCondition: e.target.value })}
                  placeholder="Contoh: Hujan ringan, Kering, Panas"
                  required
                />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="px-12"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-current border-r-transparent rounded-full animate-spin" />
                <span>Mengirim Data...</span>
              </div>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Kirim Data</span>
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}