<template>
  <div class="space-y-6">
    <!-- Settings Tabs -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tab in settingsTabs"
        :key="tab.id"
        @click="selectedTab = tab.id"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          selectedTab === tab.id
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/80'
        ]"
      >
        <component :is="tab.icon" class="h-4 w-4" />
        {{ tab.name }}
      </button>
    </div>

    <!-- Settings Content -->
    <div
      class="bg-gradient-to-br from-card/80 to-card/60 border border-border/50 backdrop-blur-sm rounded-lg p-6"
    >
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <component :is="getCurrentTabIcon()" class="w-5 h-5 text-primary" />
          <h3 class="text-lg font-semibold text-foreground">{{ getCurrentTabName() }}</h3>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="resetSettings"
            class="px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm"
          >
            Reset
          </button>
          <button
            @click="saveSettings"
            class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      <!-- General Settings -->
      <div v-if="selectedTab === 'general'" class="space-y-6">
        <div class="bg-muted/30 rounded-lg p-4">
          <h4 class="text-sm font-medium mb-4">General Configuration</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium">Dashboard Name</label>
                <p class="text-xs text-muted-foreground">Display name for your homelab dashboard</p>
              </div>
              <input
                v-model="settings.general.dashboardName"
                type="text"
                class="w-48 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                placeholder="BOLCAT HOMELAB"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium">Refresh Interval</label>
                <p class="text-xs text-muted-foreground">How often to refresh data (seconds)</p>
              </div>
              <select
                v-model="settings.general.refreshInterval"
                class="w-48 px-3 py-2 rounded-lg border border-border bg-background text-sm"
              >
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium">Auto-refresh Background</label>
                <p class="text-xs text-muted-foreground">
                  Automatically fetch new background images
                </p>
              </div>
              <button
                @click="
                  settings.general.autoRefreshBackground = !settings.general.autoRefreshBackground
                "
                :class="[
                  'w-12 h-6 rounded-full transition-colors',
                  settings.general.autoRefreshBackground ? 'bg-primary' : 'bg-muted'
                ]"
              >
                <div
                  :class="[
                    'w-5 h-5 rounded-full bg-white transition-transform',
                    settings.general.autoRefreshBackground ? 'translate-x-6' : 'translate-x-0.5'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Network Settings -->
      <div v-else-if="selectedTab === 'network'" class="space-y-6">
        <div class="bg-muted/30 rounded-lg p-4">
          <h4 class="text-sm font-medium mb-4">Network Configuration</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium">Docker API Endpoint</label>
                <p class="text-xs text-muted-foreground">Docker daemon connection string</p>
              </div>
              <input
                v-model="settings.network.dockerEndpoint"
                type="text"
                class="w-64 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                placeholder="unix:///var/run/docker.sock"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium">Home Assistant URL</label>
                <p class="text-xs text-muted-foreground">Home Assistant instance URL</p>
              </div>
              <input
                v-model="settings.network.homeAssistantUrl"
                type="text"
                class="w-64 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                placeholder="http://homeassistant.local:8123"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium">UniFi Controller URL</label>
                <p class="text-xs text-muted-foreground">UniFi Network Controller URL</p>
              </div>
              <input
                v-model="settings.network.unifiUrl"
                type="text"
                class="w-64 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                placeholder="https://unifi.local:8443"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div v-else-if="selectedTab === 'security'" class="space-y-6">
        <div class="bg-muted/30 rounded-lg p-4">
          <h4 class="text-sm font-medium mb-4">Security Configuration</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium">Enable Authentication</label>
                <p class="text-xs text-muted-foreground">Require login to access dashboard</p>
              </div>
              <button
                @click="settings.security.enableAuth = !settings.security.enableAuth"
                :class="[
                  'w-12 h-6 rounded-full transition-colors',
                  settings.security.enableAuth ? 'bg-primary' : 'bg-muted'
                ]"
              >
                <div
                  :class="[
                    'w-5 h-5 rounded-full bg-white transition-transform',
                    settings.security.enableAuth ? 'translate-x-6' : 'translate-x-0.5'
                  ]"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium">Session Timeout</label>
                <p class="text-xs text-muted-foreground">Auto-logout after inactivity (minutes)</p>
              </div>
              <input
                v-model="settings.security.sessionTimeout"
                type="number"
                class="w-32 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                placeholder="30"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium">Enable HTTPS</label>
                <p class="text-xs text-muted-foreground">Use secure connection</p>
              </div>
              <button
                @click="settings.security.enableHttps = !settings.security.enableHttps"
                :class="[
                  'w-12 h-6 rounded-full transition-colors',
                  settings.security.enableHttps ? 'bg-primary' : 'bg-muted'
                ]"
              >
                <div
                  :class="[
                    'w-5 h-5 rounded-full bg-white transition-transform',
                    settings.security.enableHttps ? 'translate-x-6' : 'translate-x-0.5'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications Settings -->
      <div v-else-if="selectedTab === 'notifications'" class="space-y-6">
        <div class="bg-muted/30 rounded-lg p-4">
          <h4 class="text-sm font-medium mb-4">Notification Preferences</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium">Email Notifications</label>
                <p class="text-xs text-muted-foreground">Send alerts via email</p>
              </div>
              <button
                @click="settings.notifications.email = !settings.notifications.email"
                :class="[
                  'w-12 h-6 rounded-full transition-colors',
                  settings.notifications.email ? 'bg-primary' : 'bg-muted'
                ]"
              >
                <div
                  :class="[
                    'w-5 h-5 rounded-full bg-white transition-transform',
                    settings.notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                  ]"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium">Push Notifications</label>
                <p class="text-xs text-muted-foreground">Browser push notifications</p>
              </div>
              <button
                @click="settings.notifications.push = !settings.notifications.push"
                :class="[
                  'w-12 h-6 rounded-full transition-colors',
                  settings.notifications.push ? 'bg-primary' : 'bg-muted'
                ]"
              >
                <div
                  :class="[
                    'w-5 h-5 rounded-full bg-white transition-transform',
                    settings.notifications.push ? 'translate-x-6' : 'translate-x-0.5'
                  ]"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium">Discord Webhook</label>
                <p class="text-xs text-muted-foreground">Send alerts to Discord channel</p>
              </div>
              <input
                v-model="settings.notifications.discordWebhook"
                type="text"
                class="w-64 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                placeholder="https://discord.com/api/webhooks/..."
              />
            </div>
          </div>
        </div>
      </div>

      <!-- About Section -->
      <div v-else-if="selectedTab === 'about'" class="space-y-6">
        <div class="bg-muted/30 rounded-lg p-4">
          <h4 class="text-sm font-medium mb-4">About BOLCAT HOMELAB</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-muted-foreground">Version:</span>
              <span class="text-sm font-medium">1.0.0</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-muted-foreground">Build Date:</span>
              <span class="text-sm font-medium">{{ new Date().toLocaleDateString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-muted-foreground">Vue Version:</span>
              <span class="text-sm font-medium">3.4.0</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-muted-foreground">License:</span>
              <span class="text-sm font-medium">MIT</span>
            </div>
          </div>
        </div>

        <div class="bg-muted/30 rounded-lg p-4">
          <h4 class="text-sm font-medium mb-4">System Information</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-muted-foreground">Node.js:</span>
              <span class="text-sm font-medium">{{ systemInfo.nodeVersion }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-muted-foreground">Platform:</span>
              <span class="text-sm font-medium">{{ systemInfo.platform }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-muted-foreground">Uptime:</span>
              <span class="text-sm font-medium">{{ systemInfo.uptime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Settings, Network, Shield, Bell, Info, Save } from 'lucide-vue-next'

const selectedTab = ref('general')

const settingsTabs = [
  { id: 'general', name: 'General', icon: Settings },
  { id: 'network', name: 'Network', icon: Network },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'about', name: 'About', icon: Info }
]

const settings = reactive({
  general: {
    dashboardName: 'BOLCAT HOMELAB',
    refreshInterval: 30,
    autoRefreshBackground: true
  },
  network: {
    dockerEndpoint: 'unix:///var/run/docker.sock',
    homeAssistantUrl: 'http://homeassistant.local:8123',
    unifiUrl: 'https://unifi.local:8443'
  },
  security: {
    enableAuth: false,
    sessionTimeout: 30,
    enableHttps: false
  },
  notifications: {
    email: false,
    push: true,
    discordWebhook: ''
  }
})

const systemInfo = reactive({
  nodeVersion: '18.17.0',
  platform: 'Windows 10',
  uptime: '2 days, 5 hours'
})

const getCurrentTabIcon = () => {
  const tab = settingsTabs.find(t => t.id === selectedTab.value)
  return tab ? tab.icon : Settings
}

const getCurrentTabName = () => {
  const tab = settingsTabs.find(t => t.id === selectedTab.value)
  return tab ? tab.name : 'Settings'
}

const saveSettings = () => {
  // Save settings to localStorage or API
  localStorage.setItem('homelab-settings', JSON.stringify(settings))
  console.log('Settings saved:', settings)
  // Show success message
  alert('Settings saved successfully!')
}

const resetSettings = () => {
  if (confirm('Are you sure you want to reset all settings to default values?')) {
    // Reset to default values
    Object.assign(settings, {
      general: {
        dashboardName: 'BOLCAT HOMELAB',
        refreshInterval: 30,
        autoRefreshBackground: true
      },
      network: {
        dockerEndpoint: 'unix:///var/run/docker.sock',
        homeAssistantUrl: 'http://homeassistant.local:8123',
        unifiUrl: 'https://unifi.local:8443'
      },
      security: {
        enableAuth: false,
        sessionTimeout: 30,
        enableHttps: false
      },
      notifications: {
        email: false,
        push: true,
        discordWebhook: ''
      }
    })
    console.log('Settings reset to defaults')
  }
}
</script>
