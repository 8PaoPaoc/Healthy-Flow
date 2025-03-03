import type { HealthData, HealthAdvice, AnalysisData } from './analysisService'

const CACHE_KEYS = {
  TREND_DATA: 'healthflow_trend_data',
  HEALTH_ADVICE: 'healthflow_health_advice',
  ANALYSIS_DATA: 'healthflow_analysis_data'
} as const

const CACHE_EXPIRY = {
  TREND_DATA: 1000 * 60 * 30, // 30分钟
  HEALTH_ADVICE: 1000 * 60 * 60, // 1小时
  ANALYSIS_DATA: 1000 * 60 * 60 * 2 // 2小时
} as const

interface CacheItem<T> {
  data: T
  timestamp: number
}

class CacheService {
  private storage: Storage

  constructor(storage: Storage = localStorage) {
    this.storage = storage
  }

  private setCache<T>(key: string, data: T, expiryTime: number): void {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now()
    }
    this.storage.setItem(key, JSON.stringify(cacheItem))
  }

  private getCache<T>(key: string, expiryTime: number): T | null {
    const cached = this.storage.getItem(key)
    if (!cached) return null

    const cacheItem: CacheItem<T> = JSON.parse(cached)
    const isExpired = Date.now() - cacheItem.timestamp > expiryTime

    if (isExpired) {
      this.storage.removeItem(key)
      return null
    }

    return cacheItem.data
  }

  // 趋势数据缓存
  setTrendData(data: HealthData[], type: string, period: number): void {
    const key = `${CACHE_KEYS.TREND_DATA}_${type}_${period}`
    this.setCache(key, data, CACHE_EXPIRY.TREND_DATA)
  }

  getTrendData(type: string, period: number): HealthData[] | null {
    const key = `${CACHE_KEYS.TREND_DATA}_${type}_${period}`
    return this.getCache<HealthData[]>(key, CACHE_EXPIRY.TREND_DATA)
  }

  // 健康建议缓存
  setHealthAdvice(data: HealthAdvice[]): void {
    this.setCache(CACHE_KEYS.HEALTH_ADVICE, data, CACHE_EXPIRY.HEALTH_ADVICE)
  }

  getHealthAdvice(): HealthAdvice[] | null {
    return this.getCache<HealthAdvice[]>(CACHE_KEYS.HEALTH_ADVICE, CACHE_EXPIRY.HEALTH_ADVICE)
  }

  // 分析数据缓存
  setAnalysisData(data: AnalysisData): void {
    this.setCache(CACHE_KEYS.ANALYSIS_DATA, data, CACHE_EXPIRY.ANALYSIS_DATA)
  }

  getAnalysisData(): AnalysisData | null {
    return this.getCache<AnalysisData>(CACHE_KEYS.ANALYSIS_DATA, CACHE_EXPIRY.ANALYSIS_DATA)
  }

  // 清除所有缓存
  clearAll(): void {
    Object.values(CACHE_KEYS).forEach(key => {
      this.storage.removeItem(key)
    })
  }
}

export const cacheService = new CacheService() 