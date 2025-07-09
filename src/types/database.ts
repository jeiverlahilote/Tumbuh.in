export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          location: string | null;
          district_id: string | null;
          join_date: string;
          contributions: number;
          rank: number;
          accuracy_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          location?: string | null;
          district_id?: string | null;
          join_date?: string;
          contributions?: number;
          rank?: number;
          accuracy_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          location?: string | null;
          district_id?: string | null;
          join_date?: string;
          contributions?: number;
          rank?: number;
          accuracy_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      farm_data: {
        Row: {
          id: string;
          user_id: string;
          location: string;
          district: string;
          soil_type: 'clay' | 'loam' | 'sand' | 'silt';
          land_condition: 'wet' | 'dry' | 'flooded' | 'normal';
          current_crop: string;
          last_harvest_quantity: number;
          last_harvest_condition: 'excellent' | 'good' | 'fair' | 'poor';
          pest_issues: string | null;
          weather_condition: string;
          submitted_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          location: string;
          district: string;
          soil_type: 'clay' | 'loam' | 'sand' | 'silt';
          land_condition: 'wet' | 'dry' | 'flooded' | 'normal';
          current_crop: string;
          last_harvest_quantity: number;
          last_harvest_condition: 'excellent' | 'good' | 'fair' | 'poor';
          pest_issues?: string | null;
          weather_condition: string;
          submitted_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          location?: string;
          district?: string;
          soil_type?: 'clay' | 'loam' | 'sand' | 'silt';
          land_condition?: 'wet' | 'dry' | 'flooded' | 'normal';
          current_crop?: string;
          last_harvest_quantity?: number;
          last_harvest_condition?: 'excellent' | 'good' | 'fair' | 'poor';
          pest_issues?: string | null;
          weather_condition?: string;
          submitted_at?: string;
          created_at?: string;
        };
      };
      crop_predictions: {
        Row: {
          id: string;
          name: string;
          suitability: 'high' | 'medium' | 'low';
          estimated_yield: string;
          description: string;
          icon: string;
          district: string | null;
          season: string | null;
          accuracy_percentage: number;
          based_on_reports: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          suitability: 'high' | 'medium' | 'low';
          estimated_yield: string;
          description: string;
          icon: string;
          district?: string | null;
          season?: string | null;
          accuracy_percentage?: number;
          based_on_reports?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          suitability?: 'high' | 'medium' | 'low';
          estimated_yield?: string;
          description?: string;
          icon?: string;
          district?: string | null;
          season?: string | null;
          accuracy_percentage?: number;
          based_on_reports?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      warnings: {
        Row: {
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
        };
        Insert: {
          id?: string;
          type: 'pest' | 'disease' | 'weather' | 'market';
          title: string;
          description: string;
          location: string;
          severity: 'low' | 'medium' | 'high';
          reported_by?: number;
          date?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: 'pest' | 'disease' | 'weather' | 'market';
          title?: string;
          description?: string;
          location?: string;
          severity?: 'low' | 'medium' | 'high';
          reported_by?: number;
          date?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      contributions: {
        Row: {
          id: string;
          user_id: string;
          type: 'farm_data' | 'warning_report' | 'prediction_feedback';
          points: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'farm_data' | 'warning_report' | 'prediction_feedback';
          points?: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'farm_data' | 'warning_report' | 'prediction_feedback';
          points?: number;
          description?: string | null;
          created_at?: string;
        };
      };
      districts: {
        Row: {
          id: string;
          name: string;
          province: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          province: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          province?: string;
          created_at?: string;
        };
      };
    };
  };
}