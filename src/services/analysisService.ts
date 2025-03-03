import type { AxiosResponse } from 'axios'
import api from './api'
import { cacheService } from './cacheService'

// 接口定义
export interface HealthData {
  date: string
  value: number
  type: string
}

export interface HealthAdvice {
  type: 'warning' | 'success' | 'info'
  icon: string
  title: string
  description: string
}

export interface NutritionData {
  category: string
  value: number
  percentage: number
  recommended: number
  unit: string
}

export interface AnalysisData {
  healthScore: number
  scoreDetails: Array<{
    label: string
    value: number
    color: string
  }>
  trendData: HealthData[]
  healthAdvice: HealthAdvice[]
  nutritionData: NutritionData[]
}

// API 服务类
export class AnalysisService {
  // 获取健康数据趋势
  async fetchTrendData(type: string, period: number): Promise<HealthData[]> {
    try {
      // 先尝试从缓存获取数据
      const cachedData = cacheService.getTrendData(type, period)
      if (cachedData) {
        return cachedData
      }

      // 如果缓存中没有数据，则从API获取
      const response: AxiosResponse<HealthData[]> = await api.get('/trends', {
        params: { type, period }
      })
      
      // 将新数据存入缓存
      cacheService.setTrendData(response.data, type, period)
      return response.data
    } catch (error) {
      console.error('获取趋势数据失败:', error)
      return []
    }
  }

  // 获取健康建议
  async fetchHealthAdvice(): Promise<HealthAdvice[]> {
    try {
      // 先尝试从缓存获取数据
      const cachedData = cacheService.getHealthAdvice()
      if (cachedData) {
        return cachedData
      }

      const response: AxiosResponse<HealthAdvice[]> = await api.get('/advice')
      
      // 将新数据存入缓存
      cacheService.setHealthAdvice(response.data)
      return response.data
    } catch (error) {
      console.error('获取健康建议失败:', error)
      return []
    }
  }

  // 获取完整分析数据
  async fetchAnalysisData(): Promise<AnalysisData> {
    try {
      // 先尝试从缓存获取数据
      const cachedData = cacheService.getAnalysisData()
      if (cachedData) {
        return cachedData
      }

      const response: AxiosResponse<AnalysisData> = await api.get('/analysis')
      
      // 将新数据存入缓存
      cacheService.setAnalysisData(response.data)
      return response.data
    } catch (error) {
      console.error('获取分析数据失败:', error)
      throw error
    }
  }

  // 生成健康报告
  async generateReport(): Promise<string> {
    try {
      const response: AxiosResponse<{ url: string }> = await api.post('/report')
      return response.data.url
    } catch (error) {
      console.error('生成报告失败:', error)
      throw error
    }
  }

  // 获取营养分析数据
  async fetchNutritionData(): Promise<NutritionData[]> {
    try {
      const response: AxiosResponse<NutritionData[]> = await api.get('/nutrition')
      return response.data
    } catch (error) {
      console.error('获取营养数据失败:', error)
      return []
    }
  }

  // 清除所有缓存数据
  clearCache(): void {
    cacheService.clearAll()
  }
}

// 导出服务实例
export const analysisService = new AnalysisService() 