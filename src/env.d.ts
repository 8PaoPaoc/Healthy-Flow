/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue' {
  export interface GlobalComponents {
    ElButton: typeof import('element-plus')['ElButton']
    ElInput: typeof import('element-plus')['ElInput']
    ElForm: typeof import('element-plus')['ElForm']
    ElFormItem: typeof import('element-plus')['ElFormItem']
    ElSelect: typeof import('element-plus')['ElSelect']
    ElOption: typeof import('element-plus')['ElOption']
    ElDatePicker: typeof import('element-plus')['ElDatePicker']
    ElInputNumber: typeof import('element-plus')['ElInputNumber']
    ElIcon: typeof import('element-plus')['ElIcon']
    ElMessage: typeof import('element-plus')['ElMessage']
    ElTable: typeof import('element-plus')['ElTable']
    ElTableColumn: typeof import('element-plus')['ElTableColumn']
    ElPagination: typeof import('element-plus')['ElPagination']
    ElTabs: typeof import('element-plus')['ElTabs']
    ElTabPane: typeof import('element-plus')['ElTabPane']
    ElCard: typeof import('element-plus')['ElCard']
    ElTooltip: typeof import('element-plus')['ElTooltip']
    ElAlert: typeof import('element-plus')['ElAlert']
    ElDialog: typeof import('element-plus')['ElDialog']
    ElDescriptions: typeof import('element-plus')['ElDescriptions']
    ElDescriptionsItem: typeof import('element-plus')['ElDescriptionsItem']
    ElTag: typeof import('element-plus')['ElTag']
  }
} 