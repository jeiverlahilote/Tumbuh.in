import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Star, TrendingUp, Users } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useAuth } from '../hooks/useAuth';

export function Leaderboard() {
  const { data: profiles, isLoading, error } = useRealTimeData('profiles', []);
  const { data: farmData } = useRealTimeData('farm_data', []);
  const { user } = useAuth();

  // Sort profiles by contributions and accuracy
  const topContributors = profiles
    .filter(profile => profile.contributions > 0)
    .sort((a, b) => {
      if (b.contributions !== a.contributions) {
        return b.contributions - a.contributions;
      }
      return b.accuracy_score - a.accuracy_score;
    })
    .slice(0, 10)
    .map((profile, index) => ({
      rank: index + 1,
      name: profile.name,
      location: profile.location || 'Unknown',
      contributions: profile.contributions,
      accuracy: Math.round(profile.accuracy_score),
      badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'none',
      avatar: ['👨‍🌾', '👩‍🌾'][index % 2]
    }));

  // Generate top districts from real data
  const districtStats = farmData.reduce((acc, data) => {
    const district = `Kec. ${data.district}`;
    if (!acc[district]) {
      acc[district] = { contributions: 0, members: new Set() };
    }
    acc[district].contributions += 1;
    acc[district].members.add(data.user_id);
    return acc;
  }, {} as Record<string, { contributions: number; members: Set<string> }>);

  const topDistricts = Object.entries(districtStats)
    .map(([name, stats]) => ({
      name,
      contributions: stats.contributions,
      members: stats.members.size
    }))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 4);

  const achievements = [
    { name: 'Kontributor Terbaik', icon: Trophy, description: '100+ kontribusi', color: 'text-[#FFD700]' },
    { name: 'Prediksi Akurat', icon: Star, description: '90%+ akurasi', color: 'text-[#00FFA3]' },
    { name: 'Komunitas Aktif', icon: Users, description: 'Bergabung 6 bulan', color: 'text-[#FF61F6]' },
    { name: 'Mentor Petani', icon: TrendingUp, description: 'Membantu 50+ petani', color: 'text-[#00B4D8]' }
  ];

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'gold':
        return <Crown className="h-5 w-5 text-[#FFD700]" />;
      case 'silver':
        return <Medal className="h-5 w-5 text-[#C0C0C0]" />;
      case 'bronze':
        return <Medal className="h-5 w-5 text-[#CD7F32]" />;
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-[#FFD700] to-[#FFA500]';
      case 2:
        return 'bg-gradient-to-r from-[#C0C0C0] to-[#A0A0A0]';
      case 3:
        return 'bg-gradient-to-r from-[#CD7F32] to-[#B8860B]';
      default:
        return 'bg-white/10';
    }
  };

  // Find current user's rank
  const currentUserRank = topContributors.findIndex(contributor => 
    user && contributor.name === user.name
  ) + 1;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="h-8 w-8 text-[#FFD700]" />
            <h1 className="text-3xl font-bold text-white">Leaderboard Komunitas</h1>
          </div>
          <p className="text-gray-400">
            Penghargaan untuk kontributor terbaik dan komunitas paling aktif.
          </p>
        </motion.div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#00FFA3] to-[#FF61F6] rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <div className="w-8 h-8 border-2 border-black border-r-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Memuat leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="h-8 w-8 text-[#FFD700]" />
            <h1 className="text-3xl font-bold text-white">Leaderboard Komunitas</h1>
          </div>
          <p className="text-gray-400">
            Penghargaan untuk kontributor terbaik dan komunitas paling aktif.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <Card>
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Kontributor</h3>
            <p className="text-gray-400 mb-6">
              Leaderboard akan muncul setelah ada kontribusi data dari komunitas.
            </p>
            <Button className="px-8">
              Mulai Kontribusi
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Trophy className="h-8 w-8 text-[#FFD700]" />
          <h1 className="text-3xl font-bold text-white">Leaderboard Komunitas</h1>
        </div>
        <p className="text-gray-400">
          Penghargaan untuk kontributor terbaik dan komunitas paling aktif.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Top Contributors */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Top Kontributor</h2>
              <Button variant="ghost" size="sm">
                Lihat Semua
              </Button>
            </div>
            <div className="space-y-4">
              {topContributors.length > 0 ? topContributors.map((contributor, index) => (
                <motion.div
                  key={`${contributor.name}-${contributor.rank}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-xl border ${
                    contributor.rank <= 3 
                      ? 'border-[#FFD700]/30 bg-[#FFD700]/5' 
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-black font-bold ${getRankColor(contributor.rank)}`}>
                      {contributor.rank <= 3 ? (
                        <span className="text-lg">{contributor.rank}</span>
                      ) : (
                        <span className="text-white">{contributor.rank}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{contributor.avatar}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-semibold">{contributor.name}</span>
                            {getBadgeIcon(contributor.badge)}
                          </div>
                          <p className="text-sm text-gray-400">{contributor.location}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#00FFA3] font-bold">{contributor.contributions}</div>
                      <div className="text-xs text-gray-400">kontribusi</div>
                      <div className="text-xs text-[#FF61F6]">{contributor.accuracy}% akurasi</div>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center text-gray-400 py-8">
                  Belum ada kontributor
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Achievements & Districts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          {/* Achievements */}
          <Card>
            <h2 className="text-xl font-semibold text-white mb-6">Pencapaian</h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={achievement.name} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                  </div>
                  <div>
                    <div className="text-white font-medium">{achievement.name}</div>
                    <div className="text-xs text-gray-400">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Districts */}
          <Card>
            <h2 className="text-xl font-semibold text-white mb-6">Kecamatan Terbaik</h2>
            {topDistricts.length > 0 ? (
              <div className="space-y-4">
                {topDistricts.map((district, index) => (
                  <div key={district.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#00FFA3] to-[#FF61F6] rounded-lg flex items-center justify-center text-black font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-white font-medium">{district.name}</div>
                        <div className="text-xs text-gray-400">{district.members} anggota</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#00FFA3] font-bold">{district.contributions}</div>
                      <div className="text-xs text-gray-400">kontribusi</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                Belum ada data kecamatan
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Your Rank */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-[#00FFA3]/10 to-[#FF61F6]/10 border-[#00FFA3]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#00FFA3] to-[#FF61F6] rounded-full flex items-center justify-center text-black font-bold">
                  #{currentUserRank || user.rank || '?'}
                </div>
                <div>
                  <div className="text-white font-semibold">Peringkat Anda</div>
                  <div className="text-sm text-gray-400">{user.name} • {user.contributions} kontribusi</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#00FFA3] font-bold">87% akurasi</div>
                <div className="text-xs text-gray-400">
                  {currentUserRank ? 'Naik 2 peringkat minggu ini' : 'Mulai kontribusi untuk masuk ranking'}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <Card>
          <Trophy className="h-16 w-16 text-[#FFD700] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Tingkatkan Kontribusi Anda
          </h2>
          <p className="text-gray-400 mb-6">
            Semakin banyak data yang Anda bagikan, semakin akurat prediksi untuk seluruh komunitas.
          </p>
          <Button className="px-8">
            Mulai Kontribusi
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}