export type ChartDetail = {
  value: string
  time: number
}

export type ChartValues = ChartDetail[]

export type ChartView = 'line' | 'bar'

export type ChartObject = {
  values?: ChartValues
  loading?: boolean
  comingSoon?: boolean
  type?: ChartView
  unit?: string
}

export type ChartData = {
  [key: string]: ChartObject
}

export type ChartTimeFrame = 'allTime' | 'week'
