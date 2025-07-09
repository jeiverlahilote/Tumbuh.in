export interface User {
  id: string;
  email: string;
  name: string;
  location: string;
  joinDate: string;
  contributions: number;
  rank: number;
}

export interface FarmData {
  id: string;
  userId: string;
  location: string;
  district: string;
  soilType: 'clay' | 'loam' | 'sand' | 'silt';
  landCondition: 'wet' | 'dry' | 'flooded' | 'normal';
  currentCrop: string;
  lastHarvestQuantity: number;
  lastHarvestCondition: 'excellent' | 'good' | 'fair' | 'poor';
  pestIssues?: string;
  weatherCondition: string;
  submittedAt: string;
}

export interface CropPrediction {
  name: string;
  suitability: 'high' | 'medium' | 'low';
  estimatedYield: string;
  description: string;
  icon: string;
}

export interface Warning {
  id: string;
  type: 'pest' | 'disease' | 'weather' | 'market';
  title: string;
  description: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  reportedBy: number;
  date: string;
}

export interface CommunityStats {
  totalUsers: number;
  totalReports: number;
  topCrops: { name: string; percentage: number }[];
  activeDistricts: string[];
}