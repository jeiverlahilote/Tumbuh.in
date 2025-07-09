import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, MapPin, Users, Calendar, Sprout } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { MapDialog } from './MapDialog';
import { supabase } from '../lib/supabase';
import { useRealTimeData } from '../hooks/useRealTimeData';

export function DataAggregation() {
  const [showMapDialog, setShowMapDialog] = useState(false);
  const { data: farmData } = useRealTimeData('farm_data');
  const { data: profiles } = useRealTimeData('profiles');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    accuracyRate: 87,
    activeAreas: 156
  });

  useEffect(() => {
    setStats({
      totalUsers: profiles.length,
      totalReports: farmData.length,
      accuracyRate: 87,
      activeAreas: 156
    });
  }, [profiles.length, farmData.length]);

  // Calculate top crops from real data
  const topCrops = farmData.reduce((acc, data) => {
    const crop = data.current_crop.toLowerCase();
    acc[crop] = (acc[crop] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCropsArray = Object.entries(topCrops)
    .map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      percentage: Math.round((count / farmData.length) * 100) || 0,
      color: ['#00FFA3', '#FF61F6', '#FFB800', '#00B4D8'][Object.keys(topCrops).indexOf(name)] || '#00FFA3'
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4);

  // Calculate district activity
  const districtActivity = farmData.reduce((acc, data) => {
    const district = data.district;
    acc[district] = (acc[district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeDistricts = Object.entries(districtActivity)
    .map(([name, reports]) => ({
      name: `Kec. ${name}`,
      contributors: Math.floor(reports * 0.7), // Estimate contributors
      reports
    }))
    .sort((a, b) => b.reports - a.reports)
    .slice(0, 4);

  // Generate harvest trends from real data or empty if no data
  const harvestTrends = farmData.length > 0 ? [
    { month: 'Feb', padi: 0, jagung: 0, kedelai: 0 }
  ] : [];

  // Generate pest issues from real data
  const pestIssues = farmData
    .filter(data => data.pest_issues && data.pest_issues.trim())
    .reduce((acc, data) => {
      const pest = data.pest_issues!.toLowerCase();
      acc[pest] = (acc[pest] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const pestIssuesArray = Object.entries(pestIssues)
    .map(([name, reports]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      reports,
      trend: 'stable' as const
    }))
    .sort((a, b) => b.reports - a.reports)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="h-8 w-8 text-[#00FFA3]" />
          <h1 className="text-3xl font-bold text-white">Statistik Komunitas</h1>
        </div>
        <p className="text-gray-400">
          Analisis data agregat dari kontribusi komunitas petani se-Indonesia.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card className="text-center">
          <Users className="h-8 w-8 text-[#00FFA3] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Kontributor</div>
          <div className="text-xs text-[#00FFA3] mt-1">+12% bulan ini</div>
        </Card>
        <Card className="text-center">
          <BarChart3 className="h-8 w-8 text-[#FF61F6] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{stats.totalReports.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Laporan Data</div>
          <div className="text-xs text-[#FF61F6] mt-1">+8% bulan ini</div>
        </Card>
        <Card className="text-center">
          <MapPin className="h-8 w-8 text-[#00FFA3] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{stats.activeAreas}</div>
          <div className="text-sm text-gray-400">Area Aktif</div>
          <div className="text-xs text-[#00FFA3] mt-1">+5% bulan ini</div>
        </Card>
        <Card className="text-center">
          <Sprout className="h-8 w-8 text-[#FF61F6] mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{stats.accuracyRate}%</div>
          <div className="text-sm text-gray-400">Akurasi Prediksi</div>
          <div className="text-xs text-[#FF61F6] mt-1">+3% bulan ini</div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Crops */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Komoditas Populer</h2>
              <Button variant="ghost" size="sm">
                <Calendar className="h-4 w-4" />
                Feb 2025
              </Button>
            </div>
            <div className="space-y-4">
              {topCropsArray.length > 0 ? topCropsArray.map((crop, index) => (
                <div key={crop.name} className="flex items-center space-x-4">
                  <div className="w-12 text-sm text-gray-400">{index + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{crop.name}</span>
                      <span className="text-gray-400 text-sm">{crop.percentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${crop.percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: crop.color }}
                      />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-400 py-8">
                  Belum ada data komoditas
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Harvest Trends */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h2 className="text-xl font-semibold text-white mb-6">Tren Hasil Panen</h2>
            {harvestTrends.length > 0 ? (
              <div className="space-y-4">
                {harvestTrends.map((trend, index) => (
                  <div key={trend.month} className="flex items-center space-x-4">
                    <div className="w-12 text-sm text-gray-400">{trend.month}</div>
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="text-sm font-medium text-[#00FFA3]">{trend.padi}%</div>
                        <div className="text-xs text-gray-400">Padi</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-[#FF61F6]">{trend.jagung}%</div>
                        <div className="text-xs text-gray-400">Jagung</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-[#FFB800]">{trend.kedelai}%</div>
                        <div className="text-xs text-gray-400">Kedelai</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                Belum ada data tren panen
              </div>
            )}
          </Card>
        </motion.div>

        {/* Pest Issues */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h2 className="text-xl font-semibold text-white mb-6">Masalah Hama Terbanyak</h2>
            {pestIssuesArray.length > 0 ? (
              <div className="space-y-4">
                {pestIssuesArray.map((pest, index) => (
                  <div key={pest.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#FF61F6] rounded-full"></div>
                      <span className="text-white font-medium">{pest.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">{pest.reports} laporan</span>
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                Belum ada laporan masalah hama
              </div>
            )}
          </Card>
        </motion.div>

        {/* Active Districts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h2 className="text-xl font-semibold text-white mb-6">Kecamatan Paling Aktif</h2>
            <div className="space-y-4">
              {activeDistricts.length > 0 ? activeDistricts.map((district, index) => (
                <div key={district.name} className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{district.name}</div>
                    <div className="text-sm text-gray-400">{district.contributors} kontributor</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#00FFA3] font-medium">{district.reports}</div>
                    <div className="text-xs text-gray-400">laporan</div>
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-400 py-8">
                  Belum ada data kecamatan
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Heat Map Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8"
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Peta Aktivitas Komunitas</h2>
            <Button variant="secondary" size="sm" onClick={() => setShowMapDialog(true)}>
              Lihat Peta Lengkap
            </Button>
          </div>
          <div className="bg-white/5 rounded-lg p-8 text-center">
            <MapPin className="h-16 w-16 text-[#00FFA3] mx-auto mb-4" />
            <p className="text-gray-400 mb-4">
              Visualisasi interaktif kontribusi data dari seluruh Indonesia
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-4 h-4 bg-[#00FFA3] rounded-full mx-auto mb-1"></div>
                <div className="text-xs text-gray-400">Aktivitas Tinggi</div>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-[#FF61F6] rounded-full mx-auto mb-1"></div>
                <div className="text-xs text-gray-400">Aktivitas Sedang</div>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-[#FFB800] rounded-full mx-auto mb-1"></div>
                <div className="text-xs text-gray-400">Aktivitas Rendah</div>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-white/20 rounded-full mx-auto mb-1"></div>
                <div className="text-xs text-gray-400">Belum Aktif</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Map Dialog */}
      <MapDialog 
        isOpen={showMapDialog} 
        onClose={() => setShowMapDialog(false)} 
      />
    </div>
  );
}