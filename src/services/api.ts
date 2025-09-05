// API service layer with axios
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { config } from '@/config/env'
import type { ApiResponse, ApiError } from '@/types'

class ApiService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      config => {
        // Add auth token if available
        const token = localStorage.getItem('auth-token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Add request timestamp
        config.metadata = { startTime: Date.now() }

        return config
      },
      error => {
        return Promise.reject(this.handleError(error))
      }
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time in development
        if (import.meta.env.DEV && response.config.metadata) {
          const duration = Date.now() - response.config.metadata.startTime
          console.log(
            `API ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`
          )
        }

        return response
      },
      error => {
        return Promise.reject(this.handleError(error))
      }
    )
  }

  private handleError(error: any): ApiError {
    const apiError: ApiError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      timestamp: new Date().toISOString()
    }

    if (error.response) {
      // Server responded with error status
      apiError.code = error.response.data?.code || `HTTP_${error.response.status}`
      apiError.message = error.response.data?.message || error.response.statusText
      apiError.details = error.response.data?.details
    } else if (error.request) {
      // Request was made but no response received
      apiError.code = 'NETWORK_ERROR'
      apiError.message = 'Network connection failed'
    }

    return apiError
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config)
    return response.data
  }

  // Specific API methods
  async getSystemMetrics() {
    return this.get('/system/metrics')
  }

  async getNetworkTopology() {
    return this.get('/network/topology')
  }

  async getDockerContainers() {
    return this.get('/docker/containers')
  }

  async getSmartHomeDevices() {
    return this.get('/smart-home/devices')
  }

  async getSecurityAlerts() {
    return this.get('/security/alerts')
  }

  async getBackupStatus() {
    return this.get('/backup/status')
  }

  async getWeatherData() {
    return this.get('/weather/current')
  }

  // Docker container actions
  async startContainer(containerId: string) {
    return this.post(`/docker/containers/${containerId}/start`)
  }

  async stopContainer(containerId: string) {
    return this.post(`/docker/containers/${containerId}/stop`)
  }

  async restartContainer(containerId: string) {
    return this.post(`/docker/containers/${containerId}/restart`)
  }

  // Smart home device actions
  async toggleDevice(deviceId: string, state: boolean) {
    return this.post(`/smart-home/devices/${deviceId}/toggle`, { state })
  }

  async setDeviceBrightness(deviceId: string, brightness: number) {
    return this.post(`/smart-home/devices/${deviceId}/brightness`, { brightness })
  }

  async setDeviceColor(deviceId: string, color: string) {
    return this.post(`/smart-home/devices/${deviceId}/color`, { color })
  }

  // Settings
  async getSettings() {
    return this.get('/settings')
  }

  async updateSettings(settings: Record<string, any>) {
    return this.put('/settings', settings)
  }

  // Health check
  async healthCheck() {
    return this.get('/health')
  }
}

// Create singleton instance
export const apiService = new ApiService()

// Export default instance
export default apiService
