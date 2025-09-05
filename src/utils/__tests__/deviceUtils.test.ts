import { describe, it, expect } from 'vitest'
import {
  getDeviceIcon,
  getStatusColor,
  formatDeviceValue,
  formatBatteryLevel,
  getBatteryColor,
  formatSignalStrength,
  getSignalColor,
  formatUptime,
  formatBytes,
  isDeviceOnline
} from '../deviceUtils'

describe('deviceUtils', () => {
  describe('getDeviceIcon', () => {
    it('should return correct icon for device type', () => {
      const lightIcon = getDeviceIcon('light')
      const tempIcon = getDeviceIcon('temperature')

      expect(lightIcon).toBeDefined()
      expect(tempIcon).toBeDefined()
    })

    it('should return Activity icon for unknown type', () => {
      const unknownIcon = getDeviceIcon('unknown' as any)
      expect(unknownIcon).toBeDefined()
    })
  })

  describe('getStatusColor', () => {
    it('should return correct color for status', () => {
      expect(getStatusColor('online')).toBe('text-green-500')
      expect(getStatusColor('offline')).toBe('text-red-500')
      expect(getStatusColor('unknown')).toBe('text-yellow-500')
    })
  })

  describe('formatDeviceValue', () => {
    it('should format number values with unit', () => {
      expect(formatDeviceValue(22.5, '°C')).toBe('22.5°C')
      expect(formatDeviceValue(65, '%')).toBe('65.0%')
    })

    it('should handle undefined values', () => {
      expect(formatDeviceValue(undefined)).toBe('N/A')
      expect(formatDeviceValue(undefined, '°C')).toBe('N/A')
    })
  })

  describe('formatBatteryLevel', () => {
    it('should return correct battery level description', () => {
      expect(formatBatteryLevel(90)).toBe('High')
      expect(formatBatteryLevel(60)).toBe('Medium')
      expect(formatBatteryLevel(30)).toBe('Low')
      expect(formatBatteryLevel(10)).toBe('Critical')
    })
  })

  describe('getBatteryColor', () => {
    it('should return correct color for battery level', () => {
      expect(getBatteryColor(90)).toBe('text-green-500')
      expect(getBatteryColor(60)).toBe('text-yellow-500')
      expect(getBatteryColor(30)).toBe('text-orange-500')
      expect(getBatteryColor(10)).toBe('text-red-500')
    })
  })

  describe('formatSignalStrength', () => {
    it('should return correct signal strength description', () => {
      expect(formatSignalStrength(-40)).toBe('Excellent')
      expect(formatSignalStrength(-55)).toBe('Good')
      expect(formatSignalStrength(-65)).toBe('Fair')
      expect(formatSignalStrength(-75)).toBe('Poor')
      expect(formatSignalStrength(-85)).toBe('Very Poor')
    })
  })

  describe('formatUptime', () => {
    it('should format uptime correctly', () => {
      expect(formatUptime(3600)).toBe('1h 0m') // 1 hour
      expect(formatUptime(86400)).toBe('1d 0h 0m') // 1 day
      expect(formatUptime(1800)).toBe('30m') // 30 minutes
    })
  })

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(1024)).toBe('1 KB')
      expect(formatBytes(1048576)).toBe('1 MB')
      expect(formatBytes(1073741824)).toBe('1 GB')
      expect(formatBytes(0)).toBe('0 B')
    })
  })

  describe('isDeviceOnline', () => {
    it('should return true for recent timestamps', () => {
      const now = new Date()
      const recent = new Date(now.getTime() - 2 * 60 * 1000) // 2 minutes ago

      expect(isDeviceOnline(recent.toISOString())).toBe(true)
    })

    it('should return false for old timestamps', () => {
      const now = new Date()
      const old = new Date(now.getTime() - 10 * 60 * 1000) // 10 minutes ago

      expect(isDeviceOnline(old.toISOString())).toBe(false)
    })
  })
})
