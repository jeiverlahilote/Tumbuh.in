import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Calendar, 
  Sprout, 
  Droplets,
  Sun,
  Bug,
  Shield,
  BarChart3,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Thermometer,
  CloudRain
} from 'lucide-react';
import { Dialog } from './ui/Dialog';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface Prediction {
  id?: string;
  name: string;
  suitability: 'high' | 'medium' | 'low';
  estimated_yield: string;
  description: string;
  icon: string;
  district?: string;
  season?: string;
  accuracy_percentage: number;
  based_on_reports: number;
}

interface PredictionDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: Prediction | null;
}

export function PredictionDetailDialog({ isOpen, onClose, prediction }: PredictionDetailDialogProps) {
  if (!prediction) return null;

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'high':
        return 'text-[#00FFA3] bg-[#00FFA3]/10 border-[#00FFA3]/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'low':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getSuitabilityText = (suitability: string) => {
    switch (suitability) {
      case 'high':
        return 'Sangat Cocok';
      case 'medium':
        return 'Cukup Cocok';
      case 'low':
        return 'Kurang Cocok';
      default:
        return 'Unknown';
    }
  };

  const getSuitabilityIcon = (suitability: string) => {
    switch (suitability) {
      case 'high':
        return <TrendingUp className="h-5 w-5" />;
      case 'medium':
        return <TrendingUp className="h-5 w-5" />;
      case 'low':
        return <TrendingDown className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  // Generate detailed information based on crop type
  const getCropDetails = (cropName: string, suitability: string) => {
    const cropData: Record<string, any> = {
      padi: {
        plantingTime: '15-20 hari',
        harvestTime: '110-120 hari',
        waterNeed: 'Tinggi (1200-1500mm)',
        soilPH: '5.5-7.0',
        temperature: '22-32°C',
        advantages: [
          'Tahan terhadap curah hujan tinggi',
          'Cocok untuk tanah berlumpur',
          'Hasil panen stabil',
          'Permintaan pasar tinggi'
        ],
        challenges: [
          'Rentan terhadap hama wereng',
          'Membutuhkan sistem irigasi baik',
          'Perlu pengendalian gulma intensif'
        ],
        tips: [
          'Gunakan varietas unggul tahan hama',
          'Lakukan pengairan berselang',
          'Aplikasi pupuk sesuai fase pertumbuhan',
          'Monitor hama dan penyakit rutin'
        ]
      },
      jagung: {
        plantingTime: '7-10 hari',
        harvestTime: '90-110 hari',
        waterNeed: 'Sedang (600-800mm)',
        soilPH: '5.8-7.8',
        temperature: '21-34°C',
        advantages: [
          'Pertumbuhan cepat',
          'Toleran kekeringan',
          'Nilai ekonomi tinggi',
          'Mudah dipasarkan'
        ],
        challenges: [
          'Rentan terhadap ulat tongkol',
          'Membutuhkan drainase baik',
          'Sensitif terhadap genangan air'
        ],
        tips: [
          'Tanam pada bedengan tinggi',
          'Gunakan mulsa untuk konservasi air',
          'Aplikasi insektisida preventif',
          'Panen pada waktu yang tepat'
        ]
      },
      kedelai: {
        plantingTime: '5-7 hari',
        harvestTime: '80-100 hari',
        waterNeed: 'Sedang (450-700mm)',
        soilPH: '6.0-7.5',
        temperature: '23-27°C',
        advantages: [
          'Memperbaiki kesuburan tanah',
          'Siklus tanam pendek',
          'Protein tinggi',
          'Cocok untuk rotasi tanaman'
        ],
        challenges: [
          'Sensitif terhadap genangan',
          'Rentan penyakit karat daun',
          'Membutuhkan inokulasi rhizobium'
        ],
        tips: [
          'Pastikan drainase optimal',
          'Gunakan benih bersertifikat',
          'Aplikasi rhizobium saat tanam',
          'Hindari tanam saat hujan deras'
        ]
      },
      kangkung: {
        plantingTime: '3-5 hari',
        harvestTime: '25-30 hari',
        waterNeed: 'Tinggi (terus menerus)',
        soilPH: '5.0-7.0',
        temperature: '25-30°C',
        advantages: [
          'Panen sangat cepat',
          'Tahan air berlebih',
          'Permintaan pasar stabil',
          'Mudah dibudidayakan'
        ],
        challenges: [
          'Rentan terhadap ulat daun',
          'Membutuhkan air bersih',
          'Mudah layu jika kekurangan air'
        ],
        tips: [
          'Tanam di area yang selalu basah',
          'Panen pagi hari untuk kesegaran',
          'Gunakan pupuk organik',
          'Rotasi dengan tanaman lain'
        ]
      }
    };

    const defaultData = {
      plantingTime: '7-14 hari',
      harvestTime: '60-90 hari',
      waterNeed: 'Sedang',
      soilPH: '6.0-7.0',
      temperature: '20-30°C',
      advantages: [
        'Cocok untuk kondisi lokal',
        'Permintaan pasar baik',
        'Mudah dibudidayakan'
      ],
      challenges: [
        'Perlu monitoring rutin',
        'Sensitif terhadap cuaca ekstrem'
      ],
      tips: [
        'Gunakan benih berkualitas',
        'Lakukan pemupukan teratur',
        'Monitor hama dan penyakit'
      ]
    };

    return cropData[cropName.toLowerCase()] || defaultData;
  };

  const cropDetails = getCropDetails(prediction.name, prediction.suitability);

  // Generate market analysis
  const getMarketAnalysis = (cropName: string) => {
    const marketData: Record<string, any> = {
      padi: {
        currentPrice: 'Rp 6.000-7.000/kg',
        trend: 'Stabil',
        demand: 'Tinggi',
        competition: 'Sedang'
      },
      jagung: {
        currentPrice: 'Rp 4.500-5.500/kg',
        trend: 'Naik',
        demand: 'Tinggi',
        competition: 'Tinggi'
      },
      kedelai: {
        currentPrice: 'Rp 8.000-9.000/kg',
        trend: 'Stabil',
        demand: 'Tinggi',
        competition: 'Rendah'
      },
      kangkung: {
        currentPrice: 'Rp 3.000-4.000/kg',
        trend: 'Stabil',
        demand: 'Sedang',
        competition: 'Tinggi'
      }
    };

    return marketData[cropName.toLowerCase()] || {
      currentPrice: 'Rp 3.000-5.000/kg',
      trend: 'Stabil',
      demand: 'Sedang',
      competition: 'Sedang'
    };
  };

  const marketAnalysis = getMarketAnalysis(prediction.name);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`Detail Prediksi: ${prediction.name}`}>
      <div className="max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className={`border-l-4 ${getSuitabilityColor(prediction.suitability)}`}>
            <div className="flex items-start space-x-4">
              <div className="text-6xl">{prediction.icon}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-3xl font-bold text-white">{prediction.name}</h2>
                  <div className={`px-4 py-2 rounded-full border flex items-center space-x-2 ${getSuitabilityColor(prediction.suitability)}`}>
                    {getSuitabilityIcon(prediction.suitability)}
                    <span className="font-medium">{getSuitabilityText(prediction.suitability)}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-lg mb-4">{prediction.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-[#00FFA3]" />
                    <span className="text-gray-400">Estimasi: <span className="text-white">{prediction.estimated_yield}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-[#FF61F6]" />
                    <span className="text-gray-400">Akurasi: <span className="text-white">{prediction.accuracy_percentage}%</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-[#FFB800]" />
                    <span className="text-gray-400">Data: <span className="text-white">{prediction.based_on_reports} laporan</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-[#00B4D8]" />
                    <span className="text-gray-400">Area: <span className="text-white">{prediction.district || 'Jawa Barat'}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 mb-6"
        >
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <Sprout className="h-5 w-5 text-[#00FFA3]" />
              <h3 className="text-lg font-semibold text-white">Spesifikasi Teknis</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Waktu Tumbuh</span>
                </div>
                <span className="text-white font-medium">{cropDetails.plantingTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Waktu Panen</span>
                </div>
                <span className="text-white font-medium">{cropDetails.harvestTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Kebutuhan Air</span>
                </div>
                <span className="text-white font-medium">{cropDetails.waterNeed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Suhu Optimal</span>
                </div>
                <span className="text-white font-medium">{cropDetails.temperature}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">pH Tanah</span>
                </div>
                <span className="text-white font-medium">{cropDetails.soilPH}</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-[#FF61F6]" />
              <h3 className="text-lg font-semibold text-white">Analisis Pasar</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Harga Saat Ini</span>
                <span className="text-[#00FFA3] font-medium">{marketAnalysis.currentPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tren Harga</span>
                <span className={`font-medium ${
                  marketAnalysis.trend === 'Naik' ? 'text-[#00FFA3]' : 
                  marketAnalysis.trend === 'Turun' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {marketAnalysis.trend}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Permintaan</span>
                <span className="text-white font-medium">{marketAnalysis.demand}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Kompetisi</span>
                <span className="text-white font-medium">{marketAnalysis.competition}</span>
              </div>
              <div className="mt-4 p-3 bg-[#00FFA3]/10 rounded-lg">
                <p className="text-[#00FFA3] text-sm font-medium">
                  💡 Rekomendasi: {marketAnalysis.trend === 'Naik' ? 'Waktu yang tepat untuk menanam' : 'Pertimbangkan strategi pemasaran yang baik'}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Advantages & Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-6"
        >
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-5 w-5 text-[#00FFA3]" />
              <h3 className="text-lg font-semibold text-white">Keunggulan</h3>
            </div>
            <div className="space-y-3">
              {cropDetails.advantages.map((advantage: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-6 h-6 bg-[#00FFA3]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-3 w-3 text-[#00FFA3]" />
                  </div>
                  <p className="text-gray-300">{advantage}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-[#FF61F6]" />
              <h3 className="text-lg font-semibold text-white">Tantangan</h3>
            </div>
            <div className="space-y-3">
              {cropDetails.challenges.map((challenge: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-6 h-6 bg-[#FF61F6]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="h-3 w-3 text-[#FF61F6]" />
                  </div>
                  <p className="text-gray-300">{challenge}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Tips & Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-[#FFB800]" />
              <h3 className="text-lg font-semibold text-white">Tips Budidaya</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {cropDetails.tips.map((tip: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg"
                >
                  <div className="w-6 h-6 bg-[#FFB800]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#FFB800] text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-300">{tip}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Weather Suitability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-500/20">
            <div className="flex items-center space-x-2 mb-4">
              <CloudRain className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Kesesuaian Musim Saat Ini</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CloudRain className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-sm text-gray-400">Musim Hujan</div>
                <div className="text-lg font-bold text-blue-400">Februari 2025</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Thermometer className="h-6 w-6 text-green-400" />
                </div>
                <div className="text-sm text-gray-400">Suhu Rata-rata</div>
                <div className="text-lg font-bold text-green-400">24-28°C</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Droplets className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="text-sm text-gray-400">Curah Hujan</div>
                <div className="text-lg font-bold text-cyan-400">Tinggi</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <p className="text-gray-300 text-center">
                <span className={`font-medium ${
                  prediction.suitability === 'high' ? 'text-[#00FFA3]' :
                  prediction.suitability === 'medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {prediction.name}
                </span> {' '}
                {prediction.suitability === 'high' ? 'sangat cocok' :
                 prediction.suitability === 'medium' ? 'cukup cocok' : 'kurang cocok'} 
                {' '} untuk kondisi cuaca saat ini di {prediction.district || 'Jawa Barat'}.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex space-x-4"
        >
          <Button variant="secondary" className="flex-1">
            <Users className="h-4 w-4" />
            Diskusi dengan Komunitas
          </Button>
          <Button variant="ghost" className="flex-1">
            <BarChart3 className="h-4 w-4" />
            Lihat Data Historis
          </Button>
          <Button className="flex-1">
            <Sprout className="h-4 w-4" />
            Mulai Budidaya
          </Button>
        </motion.div>

        {/* AI Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <div className="bg-gradient-to-r from-[#00FFA3]/10 to-[#FF61F6]/10 rounded-lg p-3">
            <p className="text-xs text-gray-400">
              Prediksi dihasilkan oleh AI berdasarkan {prediction.based_on_reports} laporan komunitas • 
              Akurasi {prediction.accuracy_percentage}% • Update otomatis setiap 5 data baru
            </p>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}