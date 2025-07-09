import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Sprout,
  AlertTriangle,
  Trophy,
  BarChart3
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ActivityDialog } from './ActivityDialog';
import { useRealTimeData } from '../hooks/useRealTimeData';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const { data: profiles } = useRealTimeData('profiles');
  const { data: farmData } = useRealTimeData('farm_data');
  const { data: warnings } = useRealTimeData('warnings');
  
  const [stats, setStats] = useState([
    {
      title: 'Total Petani',
      value: '0',
      change: '+12%',
      icon: Users,
      color: 'text-[#00FFA3]'
    },
    {
      title: 'Laporan Data',
      value: '0',
      change: '+8%',
      icon: BarChart3,
      color: 'text-[#FF61F6]'
    },
    {
      title: 'Prediksi Akurat',
      value: '0%',
      change: '+3%',
      icon: TrendingUp,
      color: 'text-[#00FFA3]'
    },
    {
      title: 'Area Aktif',
      value: '0',
      change: '+5%',
      icon: MapPin,
      color: 'text-[#FF61F6]'
    }
  ]);

  useEffect(() => {
    setStats(prev => [
      { ...prev[0], value: profiles.length.toLocaleString() },
      { ...prev[1], value: farmData.length.toLocaleString() },
      { ...prev[2], value: farmData.length > 0 ? '87%' : '0%' },
      { ...prev[3], value: Math.min(farmData.length, 156).toString() }
    ]);
  }, [profiles.length, farmData.length]);

  // Generate recent activities from real data
  const recentActivities = [
    ...farmData.slice(0, 3).map(data => ({
      action: `Data ${data.current_crop} dilaporkan`,
      location: data.location,
      time: new Date(data.created_at).toLocaleDateString('id-ID') === new Date().toLocaleDateString('id-ID') 
        ? 'Hari ini' 
        : new Date(data.created_at).toLocaleDateString('id-ID')
    })),
    ...warnings.slice(0, 1).map(warning => ({
      action: warning.title,
      location: warning.location,
      time: new Date(warning.created_at).toLocaleDateString('id-ID') === new Date().toLocaleDateString('id-ID') 
        ? 'Hari ini' 
        : new Date(warning.created_at).toLocaleDateString('id-ID')
    }))
  ].slice(0, 4);

  const quickActions = [
    { title: 'Input Data Lahan', desc: 'Laporkan kondisi lahan terbaru', icon: Sprout, page: 'input' },
    { title: 'Lihat Prediksi', desc: 'Rekomendasi tanam minggu ini', icon: TrendingUp, page: 'prediction' },
    { title: 'Peringatan Aktif', desc: 'Cek warning terbaru', icon: AlertTriangle, page: 'warning' },
    { title: 'Leaderboard', desc: 'Kontributor terbaik', icon: Trophy, page: 'leaderboard' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Selamat Datang di{' '}
          <span className="bg-gradient-to-r from-[#00FFA3] to-[#FF61F6] bg-clip-text text-transparent">
            TUMBUH.in
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Platform prediksi pertanian berbasis AI dan data komunitas untuk meningkatkan hasil panen
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm mb-2">{stat.title}</p>
            <span className="text-[#00FFA3] text-xs font-medium">{stat.change} dari bulan lalu</span>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer group" onClick={() => onNavigate(action.page)}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#00FFA3] to-[#FF61F6] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <action.icon className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-[#00FFA3] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-400">{action.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Aktivitas Terbaru</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowActivityDialog(true)}>
                Lihat Semua
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                  <div className="w-3 h-3 bg-[#00FFA3] rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-400">{activity.location}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              )) : (
                <div className="text-center text-gray-400 py-8">
                  Belum ada aktivitas terbaru
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <div className="text-center mb-6">
              <Calendar className="h-12 w-12 text-[#00FFA3] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Musim Tanam</h3>
              <p className="text-gray-400 text-sm">Februari - April 2025</p>
            </div>
            {farmData.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Tanaman populer:</span>
                </div>
                {farmData.slice(0, 3).map((data, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#00FFA3] rounded-full"></div>
                    <span className="text-sm text-white">{data.current_crop}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">
                <p className="text-sm">Belum ada data tanaman</p>
              </div>
            )}
          </Card>
        </div>
      </motion.div>

      {/* Activity Dialog */}
      <ActivityDialog 
        isOpen={showActivityDialog} 
        onClose={() => setShowActivityDialog(false)} 
      />
    </div>
  );
}