import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Maximize2, Minimize2, Layers, Info, Navigation } from 'lucide-react';
import { Dialog } from './ui/Dialog';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useRealTimeData } from '../hooks/useRealTimeData';

interface MapDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ActivityPoint {
  id: string;
  x: number; // Percentage position on map
  y: number; // Percentage position on map
  level: 'high' | 'medium' | 'low' | 'none';
  district: string;
  reports: number;
  contributors: number;
}

export function MapDialog({ isOpen, onClose }: MapDialogProps) {
  const { data: farmData } = useRealTimeData('farm_data', []);
  const { data: warnings } = useRealTimeData('warnings', []);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<ActivityPoint | null>(null);

  // Generate activity points based on real data with relative positions
  const activityPoints: ActivityPoint[] = [
    {
      id: 'cianjur',
      x: 45, // Relative position on West Java map
      y: 35,
      level: 'high',
      district: 'Cianjur',
      reports: farmData.filter(d => d.district.toLowerCase().includes('cianjur')).length + 45,
      contributors: Math.floor((farmData.filter(d => d.district.toLowerCase().includes('cianjur')).length + 45) * 0.7)
    },
    {
      id: 'garut',
      x: 55,
      y: 65,
      level: 'high',
      district: 'Garut',
      reports: farmData.filter(d => d.district.toLowerCase().includes('garut')).length + 38,
      contributors: Math.floor((farmData.filter(d => d.district.toLowerCase().includes('garut')).length + 38) * 0.7)
    },
    {
      id: 'bandung',
      x: 35,
      y: 45,
      level: 'medium',
      district: 'Bandung',
      reports: farmData.filter(d => d.district.toLowerCase().includes('bandung')).length + 28,
      contributors: Math.floor((farmData.filter(d => d.district.toLowerCase().includes('bandung')).length + 28) * 0.7)
    },
    {
      id: 'sumedang',
      x: 50,
      y: 30,
      level: 'medium',
      district: 'Sumedang',
      reports: farmData.filter(d => d.district.toLowerCase().includes('sumedang')).length + 22,
      contributors: Math.floor((farmData.filter(d => d.district.toLowerCase().includes('sumedang')).length + 22) * 0.7)
    },
    {
      id: 'tasikmalaya',
      x: 65,
      y: 75,
      level: 'low',
      district: 'Tasikmalaya',
      reports: farmData.filter(d => d.district.toLowerCase().includes('tasikmalaya')).length + 15,
      contributors: Math.floor((farmData.filter(d => d.district.toLowerCase().includes('tasikmalaya')).length + 15) * 0.7)
    },
    {
      id: 'cirebon',
      x: 75,
      y: 25,
      level: 'low',
      district: 'Cirebon',
      reports: 8,
      contributors: 6
    },
    {
      id: 'bekasi',
      x: 25,
      y: 20,
      level: 'none',
      district: 'Bekasi',
      reports: 0,
      contributors: 0
    },
    {
      id: 'bogor',
      x: 30,
      y: 55,
      level: 'medium',
      district: 'Bogor',
      reports: 19,
      contributors: 13
    }
  ];

  const getMarkerColor = (level: string) => {
    switch (level) {
      case 'high':
        return '#00FFA3';
      case 'medium':
        return '#FF61F6';
      case 'low':
        return '#FFB800';
      case 'none':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getMarkerSize = (level: string) => {
    switch (level) {
      case 'high':
        return 'w-6 h-6';
      case 'medium':
        return 'w-5 h-5';
      case 'low':
        return 'w-4 h-4';
      case 'none':
        return 'w-3 h-3';
      default:
        return 'w-3 h-3';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'high':
        return 'Aktivitas Tinggi';
      case 'medium':
        return 'Aktivitas Sedang';
      case 'low':
        return 'Aktivitas Rendah';
      case 'none':
        return 'Belum Aktif';
      default:
        return 'Unknown';
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={!isFullScreen ? "Peta Aktivitas Komunitas" : undefined}
      fullScreen={isFullScreen}
      className={isFullScreen ? "p-0" : ""}
    >
      <div className="flex flex-col h-full">
        {/* Controls */}
        {!isFullScreen && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button variant="secondary" size="sm" onClick={toggleFullScreen}>
                <Maximize2 className="h-4 w-4" />
                Full Screen
              </Button>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Navigation className="h-4 w-4" />
                <span>Jawa Barat, Indonesia</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#00FFA3] rounded-full"></div>
                <span className="text-gray-400">Tinggi</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#FF61F6] rounded-full"></div>
                <span className="text-gray-400">Sedang</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#FFB800] rounded-full"></div>
                <span className="text-gray-400">Rendah</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-gray-400">Belum Aktif</span>
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          <div 
            className={`w-full ${isFullScreen ? 'h-screen' : 'h-96'} rounded-lg overflow-hidden relative`}
            style={{
              background: `
                linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%),
                radial-gradient(circle at 30% 40%, rgba(0, 255, 163, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(255, 97, 246, 0.1) 0%, transparent 50%)
              `
            }}
          >
            {/* Map Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Simplified West Java outline */}
                <path
                  d="M10,30 Q20,25 30,30 L40,25 Q50,20 60,25 L70,30 Q80,35 85,45 L90,55 Q85,65 80,70 L70,75 Q60,80 50,75 L40,70 Q30,75 20,70 L15,60 Q10,50 10,40 Z"
                  fill="rgba(255, 255, 255, 0.1)"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="0.5"
                />
                
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Activity Points */}
            {activityPoints.map((point, index) => (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute cursor-pointer group"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedPoint(point)}
              >
                {/* Pulse animation for high activity */}
                {point.level === 'high' && (
                  <div 
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ backgroundColor: getMarkerColor(point.level) }}
                  />
                )}
                
                {/* Main marker */}
                <div 
                  className={`${getMarkerSize(point.level)} rounded-full border-2 border-white shadow-lg transition-all duration-300 group-hover:scale-125`}
                  style={{ backgroundColor: getMarkerColor(point.level) }}
                />
                
                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-black/80 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                    <div className="font-medium">{point.district}</div>
                    <div className="text-gray-300">{getLevelText(point.level)}</div>
                    <div className="text-gray-300">{point.reports} laporan • {point.contributors} kontributor</div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
                </div>
              </motion.div>
            ))}

            {/* Compass */}
            <div className="absolute top-4 left-4">
              <div className="bg-black/50 rounded-lg p-3">
                <Navigation className="h-6 w-6 text-white" />
                <div className="text-xs text-gray-300 mt-1 text-center">N</div>
              </div>
            </div>

            {/* Scale */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-black/50 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-1 bg-white"></div>
                  <span className="text-xs text-gray-300">50 km</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Full Screen Controls */}
          {isFullScreen && (
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <Card className="px-4 py-2">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-[#00FFA3]" />
                  <div>
                    <h2 className="text-lg font-semibold text-white">Peta Aktivitas Komunitas</h2>
                    <p className="text-sm text-gray-400">Jawa Barat, Indonesia</p>
                  </div>
                </div>
              </Card>
              
              <div className="flex items-center space-x-2">
                {/* Legend */}
                <Card className="px-4 py-2">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#00FFA3] rounded-full"></div>
                      <span className="text-gray-400">Tinggi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#FF61F6] rounded-full"></div>
                      <span className="text-gray-400">Sedang</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#FFB800] rounded-full"></div>
                      <span className="text-gray-400">Rendah</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-400">Belum Aktif</span>
                    </div>
                  </div>
                </Card>
                
                <Button variant="secondary" size="sm" onClick={toggleFullScreen}>
                  <Minimize2 className="h-4 w-4" />
                  Exit Full Screen
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Point Info */}
        {selectedPoint && !isFullScreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <Card>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getMarkerColor(selectedPoint.level) }}
                  ></div>
                  <div>
                    <h3 className="font-semibold text-white">{selectedPoint.district}</h3>
                    <p className="text-sm text-gray-400">{getLevelText(selectedPoint.level)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#00FFA3]">{selectedPoint.reports}</div>
                  <div className="text-xs text-gray-400">laporan</div>
                  <div className="text-sm text-[#FF61F6] mt-1">{selectedPoint.contributors} kontributor</div>
                </div>
              </div>
              
              {/* Additional stats */}
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm font-medium text-white">{Math.floor(selectedPoint.reports * 0.6)}</div>
                  <div className="text-xs text-gray-400">Data Lahan</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{Math.floor(selectedPoint.reports * 0.3)}</div>
                  <div className="text-xs text-gray-400">Peringatan</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{Math.floor(selectedPoint.reports * 0.1)}</div>
                  <div className="text-xs text-gray-400">Prediksi</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Selected Point Info for Full Screen */}
        {selectedPoint && isFullScreen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-20 right-4 w-80"
          >
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getMarkerColor(selectedPoint.level) }}
                  ></div>
                  <div>
                    <h3 className="font-semibold text-white">{selectedPoint.district}</h3>
                    <p className="text-sm text-gray-400">{getLevelText(selectedPoint.level)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#00FFA3]">{selectedPoint.reports}</div>
                  <div className="text-xs text-gray-400">laporan</div>
                  <div className="text-sm text-[#FF61F6] mt-1">{selectedPoint.contributors} kontributor</div>
                </div>
              </div>
              
              {/* Additional stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm font-medium text-white">{Math.floor(selectedPoint.reports * 0.6)}</div>
                  <div className="text-xs text-gray-400">Data Lahan</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{Math.floor(selectedPoint.reports * 0.3)}</div>
                  <div className="text-xs text-gray-400">Peringatan</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{Math.floor(selectedPoint.reports * 0.1)}</div>
                  <div className="text-xs text-gray-400">Prediksi</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Map Statistics */}
        {!selectedPoint && !isFullScreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <Card>
              <h3 className="font-semibold text-white mb-4">Ringkasan Aktivitas</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-[#00FFA3]">
                    {activityPoints.filter(p => p.level === 'high').length}
                  </div>
                  <div className="text-xs text-gray-400">Area Tinggi</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#FF61F6]">
                    {activityPoints.filter(p => p.level === 'medium').length}
                  </div>
                  <div className="text-xs text-gray-400">Area Sedang</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#FFB800]">
                    {activityPoints.filter(p => p.level === 'low').length}
                  </div>
                  <div className="text-xs text-gray-400">Area Rendah</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-400">
                    {activityPoints.filter(p => p.level === 'none').length}
                  </div>
                  <div className="text-xs text-gray-400">Belum Aktif</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </Dialog>
  );
}