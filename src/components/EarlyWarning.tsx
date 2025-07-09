import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bug, Cloud, TrendingDown, MapPin, Clock } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { WarningReportDialog } from './WarningReportDialog';
import { WarningDetailDialog } from './WarningDetailDialog';

export function EarlyWarning() {
  const { data: warnings, isLoading, error } = useRealTimeData('warnings', []);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

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

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-[#FF61F6]" />
            <h1 className="text-3xl font-bold text-white">Peringatan Dini</h1>
          </div>
          <p className="text-gray-400">
            Monitoring risiko dan peringatan dari komunitas petani untuk area sekitar Anda.
          </p>
        </motion.div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#00FFA3] to-[#FF61F6] rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <div className="w-8 h-8 border-2 border-black border-r-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Memuat peringatan dini...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-[#FF61F6]" />
            <h1 className="text-3xl font-bold text-white">Peringatan Dini</h1>
          </div>
          <p className="text-gray-400">
            Monitoring risiko dan peringatan dari komunitas petani untuk area sekitar Anda.
          </p>
        </motion.div>
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-red-400 mb-2">Gagal memuat peringatan dini</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const highWarnings = warnings.filter(w => w.severity === 'high').length;
  const mediumWarnings = warnings.filter(w => w.severity === 'medium').length;
  const lowWarnings = warnings.filter(w => w.severity === 'low').length;

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-[#FF61F6]" />
          <h1 className="text-3xl font-bold text-white">Peringatan Dini</h1>
        </div>
        <p className="text-gray-400">
          Monitoring risiko dan peringatan dari komunitas petani untuk area sekitar Anda.
        </p>
      </motion.div>

      {/* Warning Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-4 gap-4 mb-8"
      >
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-400 mb-1">{highWarnings}</div>
          <div className="text-sm text-gray-400">Peringatan Tinggi</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">{mediumWarnings}</div>
          <div className="text-sm text-gray-400">Peringatan Sedang</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{lowWarnings}</div>
          <div className="text-sm text-gray-400">Peringatan Rendah</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-[#00FFA3] mb-1">156</div>
          <div className="text-sm text-gray-400">Area Terpantau</div>
        </Card>
      </motion.div>

      {/* Warning List */}
      {warnings.length > 0 ? (
        <div className="space-y-4">
          {warnings.map((warning, index) => {
            const IconComponent = getWarningIcon(warning.type);
            return (
              <motion.div
                key={warning.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className={`border-l-4 ${getWarningColor(warning.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${getWarningColor(warning.severity)}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{warning.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWarningColor(warning.severity)}`}>
                            {getSeverityText(warning.severity)}
                          </span>
                          <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
                            {getTypeText(warning.type)}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{warning.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{warning.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(warning.date).toLocaleDateString('id-ID')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>{warning.reported_by} laporan</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedWarning(warning);
                            setShowDetailDialog(true);
                          }}
                        >
                          Detail
                        </Button>
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => setShowReportDialog(true)}
                      >
                        Konfirmasi
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <Card>
            <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Tidak Ada Peringatan</h3>
            <p className="text-gray-400">
              Saat ini tidak ada peringatan aktif di area Anda.
            </p>
          </Card>
        </motion.div>
      )}

      {/* Report New Warning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-[#FF61F6]/10 to-[#00FFA3]/10 border-[#FF61F6]/20">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-[#FF61F6] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Temukan Masalah di Area Anda?
            </h2>
            <p className="text-gray-400 mb-6">
              Bantu komunitas dengan melaporkan hama, penyakit, atau kondisi yang berpotensi merugikan.
            </p>
            <Button className="px-8" onClick={() => setShowReportDialog(true)}>
              <AlertTriangle className="h-4 w-4" />
              Laporkan Peringatan
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Dialogs */}
      <WarningReportDialog 
        isOpen={showReportDialog} 
        onClose={() => setShowReportDialog(false)} 
      />
      
      <WarningDetailDialog 
        isOpen={showDetailDialog} 
        onClose={() => setShowDetailDialog(false)} 
        warning={selectedWarning}
      />
    </div>
  );
}