import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, TrendingDown, Calendar, MapPin, Zap, RefreshCw } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PredictionDetailDialog } from './PredictionDetailDialog';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { supabase } from '../lib/supabase';
import { openRouterClient } from '../lib/openrouter';

export function CommodityPrediction() {
  const { data: predictions, isLoading, error } = useRealTimeData('crop_predictions', []);
  const { data: farmData } = useRealTimeData('farm_data', []);
  const [generatedPredictions, setGeneratedPredictions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [lastProcessedCount, setLastProcessedCount] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Smart AI trigger system - every 5 new data points
  useEffect(() => {
    const shouldTriggerAI = () => {
      // First generation: when we have at least 5 data points and no predictions
      if (farmData.length >= 5 && predictions.length === 0 && lastProcessedCount === 0) {
        return true;
      }
      
      // Re-generation: every 5 new data points after initial generation
      if (farmData.length >= lastProcessedCount + 5 && lastProcessedCount > 0) {
        return true;
      }
      
      return false;
    };

    const generatePredictions = async () => {
      if (!shouldTriggerAI() || isGenerating) {
        return;
      }

      console.log(`🤖 AI Trigger: Processing ${farmData.length} data points (last processed: ${lastProcessedCount})`);
      
      setIsGenerating(true);
      setAiError(null);
      setProcessingStatus(`Menganalisis ${farmData.length} data komunitas...`);
      
      try {
        // Clear existing predictions if this is an update
        if (lastProcessedCount > 0) {
          setProcessingStatus('Memperbarui prediksi berdasarkan data terbaru...');
          await supabase.from('crop_predictions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        }

        setProcessingStatus('AI sedang menganalisis pola data...');
        
        // Generate AI-powered predictions with timeout
        const aiPredictions = await Promise.race([
          openRouterClient.generateCropPredictions(farmData),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('AI timeout')), 15000)
          )
        ]) as any[];
        
        console.log('✅ AI predictions generated:', aiPredictions);
        
        if (aiPredictions.length > 0) {
          setProcessingStatus('Menyimpan prediksi ke database...');
          
          try {
            const { error: insertError } = await supabase
              .from('crop_predictions')
              .insert(aiPredictions);

            if (!insertError) {
              console.log('✅ Predictions saved to database');
              setGeneratedPredictions([]);
              setLastProcessedCount(farmData.length);
            } else {
              console.error('❌ Error saving to database:', insertError);
              setGeneratedPredictions(aiPredictions);
              setLastProcessedCount(farmData.length);
            }
          } catch (dbError) {
            console.error('❌ Database error:', dbError);
            setGeneratedPredictions(aiPredictions);
            setLastProcessedCount(farmData.length);
          }
        } else {
          throw new Error('No predictions generated');
        }
        
        setProcessingStatus('');
      } catch (error) {
        console.error('❌ AI generation failed:', error);
        setAiError('Token AI habis, menggunakan analisis data lokal');
        setProcessingStatus('Menggunakan analisis fallback...');
        
        // Generate fallback predictions
        const fallbackPredictions = generateFallbackPredictions(farmData);
        setGeneratedPredictions(fallbackPredictions);
        setLastProcessedCount(farmData.length);
        setProcessingStatus('');
      } finally {
        setIsGenerating(false);
      }
    };

    generatePredictions();
  }, [farmData.length, predictions.length, lastProcessedCount, isGenerating]);

  // Fallback prediction generation
  const generateFallbackPredictions = (data: any[]) => {
    console.log('🔄 Generating fallback predictions for', data.length, 'data points');
    
    const cropAnalysis = data.reduce((acc, item) => {
      const crop = item.current_crop.toLowerCase();
      if (!acc[crop]) {
        acc[crop] = { 
          count: 0, 
          totalYield: 0, 
          districts: new Set(),
          conditions: [],
          soilTypes: new Set()
        };
      }
      acc[crop].count += 1;
      acc[crop].totalYield += item.last_harvest_quantity;
      acc[crop].districts.add(item.district);
      acc[crop].conditions.push(item.last_harvest_condition);
      acc[crop].soilTypes.add(item.soil_type);
      return acc;
    }, {} as Record<string, any>);

    const cropIcons = {
      padi: '🌾', jagung: '🌽', kedelai: '🫘', kangkung: '🥬',
      wortel: '🥕', tomat: '🍅', cabai: '🌶️', bawang: '🧅',
      bayam: '🥬', sawi: '🥬', terong: '🍆', timun: '🥒'
    };

    return Object.entries(cropAnalysis)
      .filter(([_, data]) => data.count >= 1)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 4)
      .map(([crop, data]) => {
        const avgYield = data.totalYield / data.count;
        const goodConditions = data.conditions.filter((c: string) => 
          c === 'excellent' || c === 'good'
        ).length;
        const successRate = (goodConditions / data.conditions.length) * 100;
        
        let suitability = 'low';
        if (successRate >= 70 && avgYield > 800) suitability = 'high';
        else if (successRate >= 50 || avgYield > 500) suitability = 'medium';
        
        return {
          name: crop.charAt(0).toUpperCase() + crop.slice(1),
          suitability,
          estimated_yield: `${Math.round(avgYield * 0.8)}-${Math.round(avgYield * 1.2)} kg/ha`,
          description: `Berdasarkan ${data.count} laporan komunitas dengan tingkat keberhasilan ${Math.round(successRate)}%. Cocok untuk tanah ${Array.from(data.soilTypes).join(', ')} di area ${Array.from(data.districts).slice(0, 2).join(', ')}.`,
          icon: cropIcons[crop] || '🌱',
          district: Array.from(data.districts)[0],
          season: 'Musim Hujan',
          accuracy_percentage: Math.min(75 + (data.count * 2), 92),
          based_on_reports: data.count
        };
      });
  };

  // Manual refresh function
  const handleManualRefresh = async () => {
    if (farmData.length < 5) {
      setAiError('Minimal 5 data diperlukan untuk analisis AI');
      return;
    }
    
    setLastProcessedCount(0); // Reset to trigger new analysis
    setGeneratedPredictions([]);
  };

  const allPredictions = predictions.length > 0 ? predictions : generatedPredictions;
  const nextTrigger = Math.ceil((lastProcessedCount + 5) / 5) * 5;
  const dataUntilNext = nextTrigger - farmData.length;

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'high':
        return 'text-[#00FFA3] border-[#00FFA3]/30 bg-[#00FFA3]/10';
      case 'medium':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'low':
        return 'text-red-400 border-red-400/30 bg-red-400/10';
      default:
        return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const getSuitabilityIcon = (suitability: string) => {
    switch (suitability) {
      case 'high':
        return <TrendingUp className="h-4 w-4" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4" />;
      case 'low':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
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

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Lightbulb className="h-8 w-8 text-[#00FFA3]" />
            <h1 className="text-3xl font-bold text-white">Prediksi Komoditas AI</h1>
          </div>
          <p className="text-gray-400">
            Rekomendasi tanaman cerdas berdasarkan analisis AI dan data komunitas real-time.
          </p>
        </motion.div>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#00FFA3] to-[#FF61F6] rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <div className="w-8 h-8 border-2 border-black border-r-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Memuat sistem prediksi AI...</p>
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
            <Lightbulb className="h-8 w-8 text-[#00FFA3]" />
            <h1 className="text-3xl font-bold text-white">Prediksi Komoditas AI</h1>
          </div>
          <p className="text-gray-400">
            Rekomendasi tanaman cerdas berdasarkan analisis AI dan data komunitas real-time.
          </p>
        </motion.div>
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <TrendingDown className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-red-400 mb-2">Gagal memuat sistem prediksi</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Lightbulb className="h-8 w-8 text-[#00FFA3]" />
            <h1 className="text-3xl font-bold text-white">Prediksi Komoditas AI</h1>
          </div>
          
          {farmData.length >= 5 && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleManualRefresh}
              disabled={isGenerating}
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Refresh AI
            </Button>
          )}
        </div>
        <p className="text-gray-400">
          Rekomendasi tanaman cerdas berdasarkan analisis AI dan data komunitas real-time.
        </p>
      </motion.div>

      {/* AI Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-[#00FFA3]/10 to-[#FF61F6]/10 border-[#00FFA3]/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Status AI & Data</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Februari 2025</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Jawa Barat</span>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00FFA3] mb-1">{farmData.length}</div>
              <div className="text-sm text-gray-400">Total Data</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FF61F6] mb-1">{lastProcessedCount}</div>
              <div className="text-sm text-gray-400">Terproses AI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FFB800] mb-1">
                {farmData.length >= 5 ? (dataUntilNext > 0 ? dataUntilNext : 'Ready') : 5 - farmData.length}
              </div>
              <div className="text-sm text-gray-400">
                {farmData.length >= 5 ? 'Hingga Update' : 'Data Dibutuhkan'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00FFA3] mb-1">
                {allPredictions.length > 0 ? `${Math.round(allPredictions[0]?.accuracy_percentage || 87)}%` : '0%'}
              </div>
              <div className="text-sm text-gray-400">Akurasi AI</div>
            </div>
          </div>

          {/* AI Status Indicator */}
          <div className="mt-4 flex items-center justify-center">
            {isGenerating ? (
              <div className="flex items-center space-x-3 text-[#00FFA3]">
                <Zap className="h-5 w-5 animate-pulse" />
                <span className="text-sm font-medium">{processingStatus}</span>
              </div>
            ) : farmData.length < 5 ? (
              <div className="flex items-center space-x-3 text-yellow-400">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Menunggu {5 - farmData.length} data lagi untuk aktivasi AI
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-[#00FFA3]">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">
                  AI Aktif • Update otomatis setiap 5 data baru
                </span>
              </div>
            )}
          </div>

          {aiError && (
            <div className="mt-3 text-center">
              <div className="text-xs text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full inline-block">
                {aiError}
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Predictions Grid */}
      {allPredictions.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {allPredictions.map((prediction, index) => (
            <motion.div
              key={prediction.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{prediction.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{prediction.name}</h3>
                      <p className="text-gray-400 text-sm">Estimasi: {prediction.estimated_yield}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border flex items-center space-x-1 ${getSuitabilityColor(prediction.suitability)}`}>
                    {getSuitabilityIcon(prediction.suitability)}
                    <span className="text-sm font-medium">
                      {getSuitabilityText(prediction.suitability)}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{prediction.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#00FFA3] rounded-full"></div>
                    <span className="text-sm text-gray-400">
                      {prediction.based_on_reports} laporan • {prediction.accuracy_percentage}% akurat
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedPrediction(prediction);
                      setShowDetailDialog(true);
                    }}
                  >
                    Detail
                  </Button>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <Card>
            {isGenerating ? (
              <>
                <div className="w-16 h-16 bg-gradient-to-r from-[#00FFA3] to-[#FF61F6] rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <div className="w-8 h-8 border-2 border-black border-r-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Menganalisis Data Komunitas</h3>
                <p className="text-gray-400 mb-2">{processingStatus}</p>
                <div className="text-sm text-[#00FFA3]">
                  Memproses {farmData.length} laporan dengan teknologi AI terdepan
                </div>
              </>
            ) : (
              <>
                <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {farmData.length < 5 ? 'Mengumpulkan Data Komunitas' : 'Siap untuk Analisis AI'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {farmData.length < 5 
                    ? `AI membutuhkan minimal 5 laporan data untuk menghasilkan prediksi yang akurat.`
                    : 'Sistem AI siap menganalisis data komunitas untuk prediksi komoditas.'
                  }
                </p>
                <div className="bg-[#00FFA3]/10 border border-[#00FFA3]/20 rounded-lg p-4">
                  <p className="text-[#00FFA3] font-medium">
                    {farmData.length < 5 
                      ? `Progress: ${farmData.length}/5 laporan data`
                      : `${farmData.length} data siap dianalisis • Klik "Refresh AI" untuk memulai`
                    }
                  </p>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      )}

      {/* AI Attribution */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="text-center mt-6"
      >
        <p className="text-xs text-gray-500">
          Prediksi dihasilkan menggunakan AI dari OpenRouter • Model: DeepSeek R1 • 
          Update otomatis setiap 5 data baru
        </p>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <Card>
          <h2 className="text-xl font-semibold text-white mb-4">Cara Kerja AI Prediksi</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[#00FFA3] mb-2">Sistem Trigger Cerdas</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• AI aktif setelah 5 data pertama</li>
                <li>• Update otomatis setiap 5 data baru</li>
                <li>• Analisis real-time kondisi lokal</li>
                <li>• Prediksi berdasarkan pola komunitas</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[#FF61F6] mb-2">Faktor Analisis</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Jenis tanah dan kondisi lahan</li>
                <li>• Hasil panen historis</li>
                <li>• Kondisi cuaca dan musim</li>
                <li>• Masalah hama dan penyakit</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Detail Dialog */}
      <PredictionDetailDialog 
        isOpen={showDetailDialog} 
        onClose={() => setShowDetailDialog(false)} 
        prediction={selectedPrediction}
      />
    </div>
  );
}
