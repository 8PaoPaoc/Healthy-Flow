export type ConditionType = 'excellent' | 'good' | 'fair' | 'poor'

export interface HealthRecord {
  id: number
  user_id: number
  measure_date: string
  condition: ConditionType
  temperature: number
  blood_pressure: string
  heart_rate: number
  symptoms?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface HealthStats {
  mean: number
  min: number
  max: number
}

export interface BloodPressureStats {
  systolic_mean: number
  diastolic_mean: number
}

export interface AnalysisStats {
  temperature?: HealthStats
  heart_rate?: HealthStats
  blood_pressure?: BloodPressureStats
  [key: string]: HealthStats | BloodPressureStats | undefined
}

export interface AnalysisData {
  stats: AnalysisStats
  recommendations: string[]
  period: string
  message?: string
} 