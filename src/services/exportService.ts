import type { HealthData, HealthAdvice, NutritionData } from './analysisService'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

interface ExportData {
  healthData: HealthData[]
  healthAdvice: HealthAdvice[]
  nutritionData: NutritionData[]
}

class ExportService {
  // 导出为CSV
  exportToCSV(data: ExportData, type: string): void {
    const worksheet = XLSX.utils.json_to_sheet(this.formatDataForExport(data, type))
    const csvContent = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `健康数据_${type}_${this.getFormattedDate()}.csv`)
  }

  // 导出为Excel
  exportToExcel(data: ExportData, type: string): void {
    const worksheet = XLSX.utils.json_to_sheet(this.formatDataForExport(data, type))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, type)
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, `健康数据_${type}_${this.getFormattedDate()}.xlsx`)
  }

  // 导出为PDF
  async exportToPDF(data: ExportData): Promise<void> {
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('PDF生成失败')
      }

      const blob = await response.blob()
      saveAs(blob, `健康报告_${this.getFormattedDate()}.pdf`)
    } catch (error) {
      console.error('导出PDF失败:', error)
      throw error
    }
  }

  // 格式化数据用于导出
  private formatDataForExport(data: ExportData, type: string): any[] {
    switch (type) {
      case 'health':
        return data.healthData.map(item => ({
          日期: item.date,
          类型: item.type,
          数值: item.value
        }))
      case 'nutrition':
        return data.nutritionData.map(item => ({
          类别: item.category,
          数值: item.value,
          百分比: item.percentage,
          建议值: item.recommended,
          单位: item.unit
        }))
      case 'advice':
        return data.healthAdvice.map(item => ({
          类型: item.type,
          标题: item.title,
          建议: item.description
        }))
      default:
        return []
    }
  }

  // 获取格式化的日期字符串
  private getFormattedDate(): string {
    const date = new Date()
    return date.toISOString().split('T')[0]
  }
}

export const exportService = new ExportService() 