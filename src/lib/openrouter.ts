interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCompletion(messages: OpenRouterMessage[]): Promise<string> {
    try {
      console.log('🤖 Sending request to OpenRouter AI...');
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'FarmForecast - Agricultural Prediction Platform',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528:free',
          messages,
          temperature: 0.7,
          max_tokens: 2000
        } as OpenRouterRequest)
      });

      console.log('📡 OpenRouter response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OpenRouter API error:', errorText);
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenRouterResponse = await response.json();
      console.log('✅ OpenRouter response received');
      
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('❌ OpenRouter API error:', error);
      throw error;
    }
  }

  async generateCropPredictions(farmData: any[]): Promise<any[]> {
    console.log(`🌾 Generating AI crop predictions for ${farmData.length} data points`);
    
    if (farmData.length === 0) {
      return [];
    }

    // Analyze farm data to create context
    const dataAnalysis = this.analyzeFarmData(farmData);
    console.log('📊 Data analysis complete:', dataAnalysis);
    
    const systemPrompt = `Anda adalah AI ahli pertanian Indonesia yang menganalisis data komunitas petani untuk memberikan prediksi komoditas yang akurat dan praktis.

PENTING: Respons Anda HARUS dalam format JSON array yang valid. Jangan tambahkan teks lain di luar JSON.

Format respons yang WAJIB:
[
  {
    "name": "Nama Tanaman",
    "suitability": "high|medium|low",
    "estimated_yield": "X-Y ton/ha",
    "description": "Deskripsi detail mengapa tanaman ini cocok berdasarkan data komunitas",
    "icon": "🌱",
    "district": "nama kecamatan",
    "season": "Musim Hujan",
    "accuracy_percentage": 85,
    "based_on_reports": 5
  }
]

Berikan 3-4 prediksi tanaman yang paling relevan untuk kondisi saat ini. Fokus pada tanaman yang realistis untuk petani Indonesia.`;

    const userPrompt = `Analisis data pertanian komunitas berikut dan berikan prediksi komoditas dalam format JSON:

KONDISI SAAT INI:
- Musim: Februari 2025 (Musim Hujan)
- Curah hujan: Tinggi
- Suhu: 24-28°C
- Wilayah: Jawa Barat, Indonesia

DATA KOMUNITAS (${farmData.length} laporan):
- Kecamatan: ${dataAnalysis.districts.join(', ')}
- Tanaman populer: ${dataAnalysis.popularCrops.map(c => `${c.name} (${c.count} laporan)`).join(', ')}
- Jenis tanah: ${dataAnalysis.soilTypes.join(', ')}
- Kondisi lahan: ${dataAnalysis.landConditions.join(', ')}
- Rata-rata hasil panen: ${dataAnalysis.averageYield} kg
- Kondisi panen terakhir: ${dataAnalysis.harvestConditions.join(', ')}
- Masalah hama: ${dataAnalysis.pestIssues.length > 0 ? dataAnalysis.pestIssues.join(', ') : 'Tidak ada laporan'}
- Kondisi cuaca: ${dataAnalysis.weatherConditions.join(', ')}

Berikan prediksi tanaman yang cocok untuk musim hujan dengan mempertimbangkan data komunitas di atas. Pastikan prediksi realistis dan praktis untuk petani Indonesia.`;

    try {
      console.log('🚀 Sending prompt to AI...');
      const response = await this.generateCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      console.log('📝 AI response received, parsing JSON...');

      // Try to extract JSON from response
      let jsonData;
      try {
        // First try to parse the entire response as JSON
        jsonData = JSON.parse(response);
      } catch {
        // If that fails, try to extract JSON array from the response
        const jsonMatch = response.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
          jsonData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      }

      console.log('✅ JSON parsed successfully:', jsonData);

      if (Array.isArray(jsonData) && jsonData.length > 0) {
        const predictions = jsonData.map((pred: any) => ({
          name: pred.name || 'Tanaman',
          suitability: pred.suitability || 'medium',
          estimated_yield: pred.estimated_yield || '1-2 ton/ha',
          description: pred.description || 'Prediksi berdasarkan data komunitas',
          icon: pred.icon || '🌱',
          district: pred.district || dataAnalysis.districts[0] || 'Cianjur',
          season: pred.season || 'Musim Hujan',
          accuracy_percentage: pred.accuracy_percentage || 80,
          based_on_reports: farmData.length
        }));

        console.log('🎯 Final AI predictions:', predictions);
        return predictions;
      }

      throw new Error('Invalid prediction format from AI');
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      throw error; // Let the calling function handle fallback
    }
  }

  private analyzeFarmData(farmData: any[]) {
    const analysis = {
      districts: [...new Set(farmData.map(d => d.district))],
      popularCrops: this.getPopularCrops(farmData),
      soilTypes: [...new Set(farmData.map(d => d.soil_type))],
      landConditions: [...new Set(farmData.map(d => d.land_condition))],
      averageYield: Math.round(farmData.reduce((sum, d) => sum + d.last_harvest_quantity, 0) / farmData.length),
      harvestConditions: [...new Set(farmData.map(d => d.last_harvest_condition))],
      pestIssues: [...new Set(farmData.filter(d => d.pest_issues && d.pest_issues.trim()).map(d => d.pest_issues))],
      weatherConditions: [...new Set(farmData.map(d => d.weather_condition))]
    };

    return analysis;
  }

  private getPopularCrops(farmData: any[]) {
    const cropCounts = farmData.reduce((acc, data) => {
      const crop = data.current_crop.toLowerCase();
      acc[crop] = (acc[crop] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(cropCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}

// Initialize OpenRouter client
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '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';
export const openRouterClient = new OpenRouterClient(apiKey);