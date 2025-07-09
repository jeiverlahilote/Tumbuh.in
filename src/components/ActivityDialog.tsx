import { motion } from 'framer-motion';
import { Clock, MapPin, User, TrendingUp, AlertTriangle, Upload, Trophy } from 'lucide-react';
import { Dialog } from './ui/Dialog';
import { Card } from './ui/Card';
import { useRealTimeData } from '../hooks/useRealTimeData';

interface ActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityDialog({ isOpen, onClose }: ActivityDialogProps) {
  const { data: farmData } = useRealTimeData('farm_data', []);
  const { data: warnings } = useRealTimeData('warnings', []);
  const { data: profiles } = useRealTimeData('profiles', []);

  // Generate comprehensive activity list
  const allActivities = [
    ...farmData.map(data => ({
      id: `farm-${data.id}`,
      type: 'farm_data',
      icon: Upload,
      title: `Data ${data.current_crop} dilaporkan`,
      description: `${data.location}, ${data.district}`,
      user: profiles.find(p => p.id === data.user_id)?.name || 'Petani',
      time: new Date(data.created_at),
      details: {
        crop: data.current_crop,
        location: data.location,
        district: data.district,
        soilType: data.soil_type,
        landCondition: data.land_condition,
        harvestQuantity: data.last_harvest_quantity,
        harvestCondition: data.last_harvest_condition
      }
    })),
    ...warnings.map(warning => ({
      id: `warning-${warning.id}`,
      type: 'warning',
      icon: AlertTriangle,
      title: warning.title,
      description: warning.location,
      user: `${warning.reported_by} petani`,
      time: new Date(warning.created_at),
      details: {
        type: warning.type,
        severity: warning.severity,
        description: warning.description,
        location: warning.location
      }
    })),
    ...profiles.slice(0, 5).map(profile => ({
      id: `profile-${profile.id}`,
      type: 'new_member',
      icon: User,
      title: 'Petani baru bergabung',
      description: profile.location || 'Unknown location',
      user: profile.name,
      time: new Date(profile.created_at),
      details: {
        name: profile.name,
        location: profile.location,
        contributions: profile.contributions,
        rank: profile.rank
      }
    }))
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 20);

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'farm_data':
        return 'text-[#00FFA3] bg-[#00FFA3]/10';
      case 'warning':
        return 'text-[#FF61F6] bg-[#FF61F6]/10';
      case 'new_member':
        return 'text-[#FFB800] bg-[#FFB800]/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'farm_data':
        return 'Data Lahan';
      case 'warning':
        return 'Peringatan';
      case 'new_member':
        return 'Anggota Baru';
      default:
        return 'Aktivitas';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;
    return date.toLocaleDateString('id-ID');
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Aktivitas Terbaru Komunitas">
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <Upload className="h-6 w-6 text-[#00FFA3] mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{farmData.length}</div>
            <div className="text-xs text-gray-400">Data Lahan</div>
          </Card>
          <Card className="text-center">
            <AlertTriangle className="h-6 w-6 text-[#FF61F6] mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{warnings.length}</div>
            <div className="text-xs text-gray-400">Peringatan</div>
          </Card>
          <Card className="text-center">
            <User className="h-6 w-6 text-[#FFB800] mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{profiles.length}</div>
            <div className="text-xs text-gray-400">Anggota</div>
          </Card>
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {allActivities.length > 0 ? allActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:border-[#00FFA3]/30 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-white truncate">{activity.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getActivityColor(activity.type)}`}>
                        {getTypeText(activity.type)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{activity.description}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{activity.user}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(activity.time)}</span>
                      </div>
                    </div>
                    
                    {/* Activity Details */}
                    {activity.type === 'farm_data' && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-gray-400">
                          Tanah: <span className="text-white">{activity.details.soilType}</span>
                        </div>
                        <div className="text-gray-400">
                          Kondisi: <span className="text-white">{activity.details.landCondition}</span>
                        </div>
                        <div className="text-gray-400">
                          Panen: <span className="text-white">{activity.details.harvestQuantity} kg</span>
                        </div>
                        <div className="text-gray-400">
                          Kualitas: <span className="text-white">{activity.details.harvestCondition}</span>
                        </div>
                      </div>
                    )}
                    
                    {activity.type === 'warning' && (
                      <div className="text-xs text-gray-300">
                        {activity.details.description}
                      </div>
                    )}
                    
                    {activity.type === 'new_member' && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-gray-400">
                          Kontribusi: <span className="text-white">{activity.details.contributions}</span>
                        </div>
                        <div className="text-gray-400">
                          Rank: <span className="text-white">#{activity.details.rank || 'Baru'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )) : (
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Aktivitas</h3>
              <p className="text-gray-400">
                Aktivitas komunitas akan muncul di sini setelah ada kontribusi data.
              </p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}