import type { Options } from 'csv-parse'

export type AgencyConfig = {
  id: string
  name: string
  timezone: string
  excludeList?: string[]
  url: string
  tripUpdates: string
  vehicleUpdates: string
  alertUpdates?: string
  endTime?: Date
  exclude: string[]
  csvOptions?: Options
}
