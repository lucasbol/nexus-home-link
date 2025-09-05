<template>
  <Card class="p-6 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Shield class="w-5 h-5 text-primary" />
          <h3 class="text-lg font-semibold text-foreground">Security Alerts</h3>
        </div>
        <div class="flex items-center gap-2">
          <component
            :is="stats.criticalAlerts > 0 ? AlertTriangle : CheckCircle"
            class="w-4 h-4"
            :class="stats.criticalAlerts > 0 ? 'text-red-500' : 'text-green-500'"
          />
          <span class="text-sm text-muted-foreground">{{ stats.activeAlerts }} active alerts</span>
        </div>
      </div>

      <!-- Security Stats -->
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <AlertTriangle class="w-4 h-4 text-red-500 mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">Critical</p>
          <p class="text-lg font-semibold text-foreground">{{ stats.criticalAlerts }}</p>
        </div>
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <CheckCircle class="w-4 h-4 text-green-500 mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">Resolved Today</p>
          <p class="text-lg font-semibold text-foreground">{{ stats.resolvedToday }}</p>
        </div>
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <Shield class="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">Firewall Blocks</p>
          <p class="text-lg font-semibold text-foreground">{{ stats.firewallBlocks }}</p>
        </div>
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <Activity class="w-4 h-4 text-orange-500 mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">Intrusion Attempts</p>
          <p class="text-lg font-semibold text-foreground">{{ stats.intrusionAttempts }}</p>
        </div>
      </div>

      <!-- Recent Alerts -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-foreground">Recent Alerts</h4>
        <div class="max-h-64 overflow-y-auto space-y-2">
          <div
            v-for="alert in alerts.slice(0, 5)"
            :key="alert.id"
            class="p-3 bg-muted/10 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-2">
                <component :is="getAlertIcon(alert.type)" class="w-4 h-4" />
                <span class="text-sm font-medium text-foreground">{{ alert.title }}</span>
              </div>
              <div class="flex items-center gap-1">
                <component
                  :is="getStatusIcon(alert.status)"
                  :class="getStatusIconClass(alert.status)"
                />
                <Badge :class="getSeverityColor(alert.severity)">
                  {{ alert.severity }}
                </Badge>
              </div>
            </div>

            <p class="text-xs text-muted-foreground mb-2">{{ alert.description }}</p>

            <div class="flex items-center justify-between text-xs text-muted-foreground">
              <div class="flex items-center gap-2">
                <span>Source: {{ alert.source }}</span>
                <span>•</span>
                <span>{{ formatDate(alert.timestamp) }}</span>
              </div>
              <span v-if="alert.action" class="text-blue-500">{{ alert.action }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Status -->
      <div class="p-3 bg-muted/20 rounded-lg border border-border/30">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-foreground">Overall Security Status</span>
          <div class="flex items-center gap-1">
            <component
              :is="stats.criticalAlerts === 0 ? CheckCircle : AlertTriangle"
              class="w-4 h-4"
              :class="stats.criticalAlerts === 0 ? 'text-green-500' : 'text-red-500'"
            />
            <span class="text-sm font-medium text-foreground">
              {{ stats.criticalAlerts === 0 ? 'Secure' : 'Attention Required' }}
            </span>
          </div>
        </div>
        <div class="text-xs text-muted-foreground">
          {{
            stats.criticalAlerts === 0
              ? 'All systems are secure. No critical alerts detected.'
              : `${stats.criticalAlerts} critical alert(s) require immediate attention.`
          }}
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Wifi,
  Router,
  Clock,
  Activity,
  Zap
} from 'lucide-vue-next'
import Card from './ui/card.vue'
import Badge from './ui/badge.vue'

interface SecurityAlert {
  id: string
  type: 'firewall' | 'intrusion' | 'vulnerability' | 'access' | 'malware' | 'network'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: string
  source: string
  status: 'active' | 'resolved' | 'investigating'
  action?: string
}

interface SecurityStats {
  totalAlerts: number
  activeAlerts: number
  criticalAlerts: number
  resolvedToday: number
  firewallBlocks: number
  intrusionAttempts: number
}

const alerts = ref<SecurityAlert[]>([])
const stats = ref<SecurityStats>({
  totalAlerts: 0,
  activeAlerts: 0,
  criticalAlerts: 0,
  resolvedToday: 0,
  firewallBlocks: 0,
  intrusionAttempts: 0
})

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'firewall':
      return Shield
    case 'intrusion':
      return AlertTriangle
    case 'vulnerability':
      return XCircle
    case 'access':
      return Lock
    case 'malware':
      return Zap
    case 'network':
      return Wifi
    default:
      return Activity
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/20 text-red-500 border-red-500/30'
    case 'high':
      return 'bg-orange-500/20 text-orange-500 border-orange-500/30'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
    case 'low':
      return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
    default:
      return 'bg-gray-500/20 text-gray-500 border-gray-500/30'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return AlertTriangle
    case 'resolved':
      return CheckCircle
    case 'investigating':
      return Clock
    default:
      return Activity
  }
}

const getStatusIconClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'w-3 h-3 text-red-500'
    case 'resolved':
      return 'w-3 h-3 text-green-500'
    case 'investigating':
      return 'w-3 h-3 text-yellow-500'
    default:
      return 'w-3 h-3 text-gray-500'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // Mock data for demo purposes
  const mockAlerts: SecurityAlert[] = [
    {
      id: 'alert-1',
      type: 'firewall',
      severity: 'high',
      title: 'Suspicious SSH Connection Attempt',
      description: 'Multiple failed SSH login attempts from IP 192.168.1.200',
      timestamp: '2024-01-15 14:30:00',
      source: '192.168.1.200',
      status: 'active',
      action: 'IP blocked for 24 hours'
    },
    {
      id: 'alert-2',
      type: 'intrusion',
      severity: 'critical',
      title: 'Potential Brute Force Attack',
      description: 'Detected 50+ failed login attempts in 5 minutes',
      timestamp: '2024-01-15 13:45:00',
      source: 'External IP',
      status: 'investigating',
      action: 'All external access temporarily disabled'
    },
    {
      id: 'alert-3',
      type: 'vulnerability',
      severity: 'medium',
      title: 'Outdated Package Detected',
      description: 'OpenSSL version 1.1.1 has known vulnerabilities',
      timestamp: '2024-01-15 12:00:00',
      source: 'System Scanner',
      status: 'resolved',
      action: 'Package updated to version 3.0.0'
    },
    {
      id: 'alert-4',
      type: 'access',
      severity: 'low',
      title: 'Unusual Login Time',
      description: 'Admin login at 3:00 AM from new device',
      timestamp: '2024-01-15 03:00:00',
      source: '192.168.1.50',
      status: 'resolved',
      action: 'Login verified as legitimate'
    },
    {
      id: 'alert-5',
      type: 'network',
      severity: 'medium',
      title: 'Port Scan Detected',
      description: 'Port scanning activity detected on network',
      timestamp: '2024-01-15 10:15:00',
      source: '192.168.1.100',
      status: 'active',
      action: 'Monitoring increased'
    },
    {
      id: 'alert-6',
      type: 'malware',
      severity: 'high',
      title: 'Suspicious File Detected',
      description: 'Potential malware signature found in downloads folder',
      timestamp: '2024-01-15 09:30:00',
      source: 'Antivirus Scanner',
      status: 'resolved',
      action: 'File quarantined and removed'
    }
  ]

  setTimeout(() => {
    alerts.value = mockAlerts

    const active = mockAlerts.filter(alert => alert.status === 'active').length
    const critical = mockAlerts.filter(alert => alert.severity === 'critical').length
    const resolved = mockAlerts.filter(alert => alert.status === 'resolved').length
    const firewall = mockAlerts.filter(alert => alert.type === 'firewall').length
    const intrusion = mockAlerts.filter(alert => alert.type === 'intrusion').length

    stats.value = {
      totalAlerts: mockAlerts.length,
      activeAlerts: active,
      criticalAlerts: critical,
      resolvedToday: resolved,
      firewallBlocks: firewall,
      intrusionAttempts: intrusion
    }
  }, 2200)
})
</script>
