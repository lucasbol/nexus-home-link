<template>
  <div class="flex flex-wrap items-center gap-1.5 sm:gap-3">
    <!-- Network Pills - Always show on mobile -->
    <StatusPill
      :icon="Wifi"
      label="WAN"
      :value="networkInfo.wanStatus === 'connected' ? '✓' : '✗'"
      :status="networkInfo.wanStatus === 'connected' ? 'normal' : 'critical'"
      :compact="true"
    />
    <StatusPill
      :icon="Users"
      label="Devices"
      :value="networkInfo.connectedDevices"
      :status="'normal'"
      :compact="true"
    />
    
    <!-- System Pills - Show most important on mobile -->
    <StatusPill
      :icon="Cpu"
      label="CPU"
      :value="systemInfo.cpuUsage"
      unit="%"
      :status="systemInfo.cpuUsage > 80 ? 'critical' : systemInfo.cpuUsage > 60 ? 'warning' : 'normal'"
      :compact="true"
    />
    <StatusPill
      :icon="MemoryStick"
      label="RAM"
      :value="systemInfo.memoryUsage"
      unit="%"
      :status="systemInfo.memoryUsage > 85 ? 'critical' : systemInfo.memoryUsage > 70 ? 'warning' : 'normal'"
      :compact="true"
    />
    
    <!-- Additional pills - Hidden on very small screens -->
    <div class="hidden sm:flex items-center gap-1.5 sm:gap-3">
      <StatusPill
        :icon="Activity"
        label="Bandwidth"
        :value="networkInfo.totalBandwidth"
        :status="'normal'"
      />
      <StatusPill
        :icon="HardDrive"
        label="Disk"
        :value="systemInfo.diskUsage"
        unit="%"
        :status="systemInfo.diskUsage > 90 ? 'critical' : systemInfo.diskUsage > 75 ? 'warning' : 'normal'"
      />
      <StatusPill
        :icon="Activity"
        label="Temp"
        :value="systemInfo.temperature"
        unit="°C"
        :status="systemInfo.temperature > 70 ? 'critical' : systemInfo.temperature > 50 ? 'warning' : 'normal'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Wifi, Activity, Users, HardDrive, Cpu, MemoryStick } from 'lucide-vue-next'
import StatusPill from './StatusPill.vue'

interface NetworkInfo {
  controllerStatus: 'online' | 'offline'
  connectedDevices: number
  totalBandwidth: string
  uptime: string
  wanStatus: 'connected' | 'disconnected'
}

interface SystemInfo {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  temperature: number
}

const networkInfo: NetworkInfo = {
  controllerStatus: 'online',
  connectedDevices: 24,
  totalBandwidth: '1.2 Gbps',
  uptime: '12d 4h 32m',
  wanStatus: 'connected'
}

const systemInfo: SystemInfo = {
  cpuUsage: 32,
  memoryUsage: 68,
  diskUsage: 45,
  temperature: 42
}
</script>