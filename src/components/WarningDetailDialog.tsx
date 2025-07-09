import { motion } from 'framer-motion';
import { AlertTriangle, Bug, Cloud, TrendingDown, MapPin, Clock, Users, Shield, Info } from 'lucide-react';
import { Dialog } from './ui/Dialog';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface Warning {
  id: string;
  type: 'pest' | 'disease' | 'weather' | 'market';
  title: string;
  description: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  reported_by: number;
  date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface WarningDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  warning: Warning | null;
}

export function WarningDetailDialog({ isOpen, onClose, warning }: WarningDetailDialogProps) {
  if (!warning) return null;

  const getWarningIcon = (type: string) => {
    switch (type) {
      case 'pest':
        return Bug;
      case 'weather':
        return Cloud;
      case 'disease':
        return AlertTriangle;
      case 'market':
        return TrendingDown;
      default:
        return AlertTriangle;
    }
  };

  const getWarningColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-500/30 bg-red-500/10 text-red-400';
      case 'medium':
        return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      case 'low':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
      default:
        return 'border-gray-500/30 bg-gray-500/10 text-gray-400';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Tinggi';
      case 'medium':
        return 'Sedang';
      case 'low':
        return 'Rendah';
      default:
        return 'Unknown';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'pest':
        return 'Hama';
      case 'weather':
        return 'Cuaca';
      case 'disease':
        return 'Penyakit';
      case 'market':
        return 'Pasar';
      default:
        return 'Unknown';
    }
  };

  const getActionRecommendations = (type: string, severity: string) => {
    const recommendations: Record<string, string[]> = {
      pest: [
        'Lakukan monitoring rutin pada tanaman',
        'Aplikasikan pestisida sesuai dosis anjuran',
        'Gunakan perangkap hama jika diperlukan',
        'Konsultasi dengan penyuluh pertanian',
        'Koordinasi dengan petani sekitar'
      ],
      disease: [
        'Isolasi tanaman yang terinfeksi',
        'Aplikasikan fungisida preventif',
        'Perbaiki drainase lahan',
        'Hindari penyiraman berlebihan',
        'Buang bagian tanaman yang sakit'
      ],
      weather: [
        'Siapkan sistem drainase yang baik',
        'Tunda aktivitas penyemprotan',
        'Lindungi tanaman muda',
        'Monitor kondisi cuaca secara berkala',
        'Siapkan rencana darurat'
      ],
      market: [
        'Evaluasi strategi penjualan',
        'Pertimbangkan penyimpanan hasil',
        'Cari alternatif pasar',
        'Koordinasi dengan kelompok tani',
        'Monitor perkembangan harga'
      ]
    };

    return recommendations[type] || [];
  };

  const IconComponent = getWarningIcon(warning.type);
  const recommendations = getActionRecommendations(warning.type, warning.severity);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Detail Peringatan">
      <div className="max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className={`border-l-4 ${getWarningColor(warning.severity)}`}>
            <div className="flex items-start space-x-4">
              <div className={`p-4 rounded-xl ${getWarningColor(warning.severity)}`}>
                <IconComponent className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{warning.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getWarningColor(warning.severity)}`}>
                    {getSeverityText(warning.severity)}
                  </span>
                  <span className="px-3 py-1 bg-white/10 text-white text-sm rounded-full">
                    {getTypeText(warning.type)}
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{warning.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(warning.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{warning.reported_by} laporan</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <Info className="h-5 w-5 text-[#00FFA3]" />
              <h3 className="text-lg font-semibold text-white">Deskripsi</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{warning.description}</p>
          </Card>
        </motion.div>

        {/* Action Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-[#FF61F6]" />
              <h3 className="text-lg font-semibold text-white">Rekomendasi Tindakan</h3>
            </div>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-6 h-6 bg-[#00FFA3]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#00FFA3] text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-300">{recommendation}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Status and Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-4 mb-6"
        >
          <Card className="text-center">
            <div className={`text-2xl font-bold mb-1 ${
              warning.is_active ? 'text-[#FF61F6]' : 'text-gray-400'
            }`}>
              {warning.is_active ? 'AKTIF' : 'TIDAK AKTIF'}
            </div>
            <div className="text-sm text-gray-400">Status Peringatan</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl font-bold text-[#00FFA3] mb-1">{warning.reported_by}</div>
            <div className="text-sm text-gray-400">Total Laporan</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl font-bold text-[#FF61F6] mb-1">
              {Math.floor((Date.now() - new Date(warning.created_at).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-sm text-gray-400">Hari Yang Lalu</div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex space-x-4"
        >
          <Button variant="secondary" className="flex-1">
            <Users className="h-4 w-4" />
            Konfirmasi Laporan
          </Button>
          <Button variant="ghost" className="flex-1">
            <AlertTriangle className="h-4 w-4" />
            Laporkan Serupa
          </Button>
        </motion.div>

        {/* Emergency Contact */}
        {warning.severity === 'high' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Peringatan Tingkat Tinggi</h3>
                <p className="text-gray-300 mb-4">
                  Segera hubungi penyuluh pertanian atau dinas pertanian setempat untuk penanganan lebih lanjut.
                </p>
                <div className="text-sm text-gray-400">
                  <p>Hotline Darurat: <span className="text-[#00FFA3] font-medium">0800-1234-5678</span></p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </Dialog>
  );
}