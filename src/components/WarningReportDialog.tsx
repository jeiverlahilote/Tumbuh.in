import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Bug, Cloud, TrendingDown, X } from 'lucide-react';
import { Dialog } from './ui/Dialog';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface WarningReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WarningReportDialog({ isOpen, onClose }: WarningReportDialogProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    location: '',
    severity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const warningTypes = [
    { value: '', label: 'Pilih jenis peringatan' },
    { value: 'pest', label: 'Hama' },
    { value: 'disease', label: 'Penyakit' },
    { value: 'weather', label: 'Cuaca' },
    { value: 'market', label: 'Pasar' }
  ];

  const severityLevels = [
    { value: '', label: 'Pilih tingkat bahaya' },
    { value: 'low', label: 'Rendah' },
    { value: 'medium', label: 'Sedang' },
    { value: 'high', label: 'Tinggi' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pest':
        return Bug;
      case 'disease':
        return AlertTriangle;
      case 'weather':
        return Cloud;
      case 'market':
        return TrendingDown;
      default:
        return AlertTriangle;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Anda harus login terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.type || !formData.title || !formData.description || 
          !formData.location || !formData.severity) {
        throw new Error('Semua field wajib harus diisi');
      }

      const warningPayload = {
        type: formData.type as 'pest' | 'disease' | 'weather' | 'market',
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        severity: formData.severity as 'low' | 'medium' | 'high',
        reported_by: 1
      };

      const { error: insertError } = await supabase
        .from('warnings')
        .insert(warningPayload);

      if (insertError) {
        throw insertError;
      }

      // Update user contributions
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          contributions: user.contributions + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.warn('Failed to update user contributions:', updateError);
      }

      // Insert contribution record
      const { error: contributionError } = await supabase
        .from('contributions')
        .insert({
          user_id: user.id,
          type: 'warning_report',
          points: 15,
          description: `Warning report: ${formData.title}`
        });

      if (contributionError) {
        console.warn('Failed to insert contribution record:', contributionError);
      }

      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          type: '',
          title: '',
          description: '',
          location: '',
          severity: ''
        });
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan peringatan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Dialog isOpen={isOpen} onClose={onClose} title="Peringatan Berhasil Dilaporkan">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 bg-[#00FFA3]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-[#00FFA3]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">
            Peringatan Berhasil Dilaporkan!
          </h3>
          <p className="text-gray-400 mb-6">
            Terima kasih telah membantu komunitas dengan melaporkan peringatan ini.
          </p>
          <div className="bg-[#00FFA3]/10 border border-[#00FFA3]/20 rounded-lg p-4">
            <p className="text-[#00FFA3] font-medium">
              +15 Poin Kontribusi Diterima
            </p>
          </div>
        </motion.div>
      </Dialog>
    );
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Laporkan Peringatan Baru">
      <div className="max-w-2xl">
        <div className="mb-6">
          <p className="text-gray-400">
            Bantu komunitas dengan melaporkan masalah atau kondisi yang berpotensi merugikan petani lain.
          </p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Jenis Peringatan"
              options={warningTypes}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
            
            <Select
              label="Tingkat Bahaya"
              options={severityLevels}
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              required
            />
          </div>

          <Input
            label="Judul Peringatan"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Contoh: Serangan Wereng Coklat"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deskripsi Detail
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan kondisi, gejala, atau situasi yang perlu diwaspadai..."
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFA3]/50 focus:border-[#00FFA3]/50 transition-all duration-300 resize-none"
              required
            />
          </div>

          <Input
            label="Lokasi"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Contoh: Desa Sukamaju, Kec. Cianjur"
            required
          />

          {/* Preview */}
          {formData.type && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gradient-to-r from-[#FF61F6]/10 to-[#00FFA3]/10 border-[#FF61F6]/20">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-[#FF61F6]/20 text-[#FF61F6]">
                    {(() => {
                      const IconComponent = getTypeIcon(formData.type);
                      return <IconComponent className="h-6 w-6" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {formData.title || 'Judul Peringatan'}
                    </h3>
                    <p className="text-gray-300 mb-2">
                      {formData.description || 'Deskripsi peringatan akan muncul di sini...'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{formData.location || 'Lokasi'}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        formData.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                        formData.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        formData.severity === 'low' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {formData.severity === 'high' ? 'Tinggi' :
                         formData.severity === 'medium' ? 'Sedang' :
                         formData.severity === 'low' ? 'Rendah' : 'Tingkat'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                  <span>Mengirim...</span>
                </div>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  <span>Laporkan Peringatan</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}