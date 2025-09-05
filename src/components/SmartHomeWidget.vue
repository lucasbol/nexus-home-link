<template>
  <Card class="p-6 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm">
    <div v-if="isLoading" class="space-y-6">
      <!-- Header Skeleton -->
      <div class="flex items-center justify-between border-b border-border/20 pb-4">
        <div class="flex items-center gap-3">
          <Skeleton class="h-9 w-9" />
          <div class="space-y-2">
            <Skeleton class="h-6 w-32" />
            <Skeleton class="h-4 w-24" />
          </div>
        </div>
        <Skeleton class="h-8 w-20" />
      </div>
      
      <!-- Stats Grid Skeleton -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="text-center space-y-2">
          <Skeleton class="h-8 w-12 mx-auto" />
          <Skeleton class="h-4 w-16 mx-auto" />
        </div>
      </div>
      
      <!-- Room Tabs Skeleton -->
      <div class="flex gap-2 overflow-x-auto">
        <div v-for="i in 4" :key="i" class="h-10 w-24 flex-shrink-0">
          <Skeleton class="h-full w-full" />
        </div>
      </div>
      
      <!-- Room Content Skeleton -->
      <div class="space-y-4">
        <Skeleton class="h-6 w-32" />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 6" :key="i" class="p-4 space-y-3 bg-card rounded-lg border">
            <!-- Device Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Skeleton class="h-4 w-4" />
                <Skeleton class="h-4 w-20" />
              </div>
              <Skeleton class="h-4 w-4" />
            </div>
            
            <!-- Device Status -->
            <div class="space-y-2">
              <Skeleton class="h-3 w-16" />
              <Skeleton class="h-2 w-full" />
            </div>
            
            <!-- Device Controls -->
            <div class="flex items-center justify-between">
              <Skeleton class="h-6 w-12" />
              <Skeleton class="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-border/20 pb-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-primary/10 rounded-lg">
            <Home class="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-foreground">Smart Home Control</h3>
            <p class="text-sm text-muted-foreground">Manage your connected devices & automations</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Badge variant="outline" class="text-xs px-3 py-1">
            <Activity class="w-3 h-3 mr-1" />
            {{ overallStats.onlineDevices }}/{{ overallStats.totalDevices }} online
          </Badge>
          <Badge variant="outline" class="text-xs px-3 py-1 bg-green-500/10 text-green-600 border-green-500/20">
            <Settings class="w-3 h-3 mr-1" />
            12 automations active
          </Badge>
        </div>
      </div>

      <!-- Main Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Energy & Environment -->
        <div class="space-y-4">
          <!-- Energy Status -->
          <div class="bg-muted/5 rounded-xl p-4 border border-border/20">
            <h4 class="text-sm font-semibold mb-4 flex items-center gap-2">
              <Zap class="w-4 h-4 text-yellow-500" />
              Energy Status
            </h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                <div class="flex items-center gap-2">
                  <Sun class="w-4 h-4 text-yellow-500" />
                  <span class="text-sm font-medium">Solar</span>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold text-yellow-600">{{ overallStats.solarProduction }}kW</div>
                  <div class="text-xs text-muted-foreground">Peak: 4.2kW</div>
                </div>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <div class="flex items-center gap-2">
                  <Battery class="w-4 h-4 text-blue-500" />
                  <span class="text-sm font-medium">Battery</span>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold text-blue-600">{{ overallStats.batteryLevel }}%</div>
                  <Progress :value="overallStats.batteryLevel" class="w-16 mt-1" />
                </div>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                <div class="flex items-center gap-2">
                  <Power class="w-4 h-4 text-red-500" />
                  <span class="text-sm font-medium">Usage</span>
                </div>
                <div class="text-right">
                  <div class="text-lg font-bold text-red-600">{{ overallStats.totalPowerConsumption }}W</div>
                  <div class="text-xs text-muted-foreground">Daily: 12.3kWh</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Temperature Overview -->
          <div class="bg-muted/5 rounded-xl p-4 border border-border/20">
            <h4 class="text-sm font-semibold mb-4 flex items-center gap-2">
              <Thermometer class="w-4 h-4 text-blue-500" />
              Temperature
            </h4>
            <div class="space-y-2">
              <div v-for="(room, index) in rooms.slice(0, 3)" :key="room.name" class="flex items-center justify-between p-2 bg-muted/10 rounded-lg">
                <span class="text-sm font-medium">{{ room.name }}</span>
                <div class="flex items-center gap-2">
                  <div :class="[
                    'w-2 h-2 rounded-full',
                    index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-red-500' : 'bg-green-500'
                  ]" />
                  <span class="text-sm font-semibold">{{ room.temperature?.toFixed(1) }}°C</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Automations -->
          <div class="bg-muted/5 rounded-xl p-4 border border-border/20">
            <h4 class="text-sm font-semibold mb-4 flex items-center gap-2">
              <Settings class="w-4 h-4 text-green-500" />
              Recent Automations
            </h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-2 bg-green-500/5 rounded-lg border border-green-500/20">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-green-500"></div>
                  <span class="text-sm font-medium">Lights Auto-Off</span>
                </div>
                <span class="text-xs text-muted-foreground">2m ago</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span class="text-sm font-medium">Climate Adjust</span>
                </div>
                <span class="text-xs text-muted-foreground">5m ago</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-orange-500/5 rounded-lg border border-orange-500/20">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span class="text-sm font-medium">Motion Detected</span>
                </div>
                <span class="text-xs text-muted-foreground">8m ago</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Center Column - Room Controls -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Room Selection -->
          <div class="bg-muted/5 rounded-xl p-4 border border-border/20">
            <h4 class="text-sm font-semibold mb-4 flex items-center gap-2">
              <Settings class="w-4 h-4 text-primary" />
              Room Controls
            </h4>
            
            <div class="flex gap-2 mb-4 overflow-x-auto">
              <Button
                v-for="room in rooms"
                :key="room.name"
                :variant="selectedRoom === room.name ? 'default' : 'outline'"
                size="sm"
                @click="selectedRoom = room.name"
                class="text-xs whitespace-nowrap"
              >
                {{ room.name }}
              </Button>
            </div>

            <!-- Selected Room Controls -->
            <div v-for="room in rooms.filter(r => r.name === selectedRoom)" :key="room.name" class="space-y-4">
              <!-- Living Room -->
              <div v-if="room.name === 'Living Room'" class="space-y-4">
                <!-- Living Room Header -->
                <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-red-500/10 border border-amber-500/20 p-6">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div class="relative">
                    <div class="flex items-center gap-3 mb-2">
                      <div class="p-2 bg-amber-500/20 rounded-lg">
                        <Home class="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h5 class="text-lg font-semibold text-amber-900 dark:text-amber-100">Living Room</h5>
                        <p class="text-sm text-amber-700 dark:text-amber-300">
                          Cozy relaxation space • {{ room.temperature?.toFixed(1) }}°C • {{ room.lightsOn }}/{{ room.totalLights }} lights on
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Living Room Lights -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="device in room.devices.filter(d => d.type === 'light')" :key="device.id" class="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <div :class="[
                          'p-2 rounded-lg',
                          device.status === 'on' ? 'bg-amber-500/20' : 'bg-gray-200/50 dark:bg-gray-700/50'
                        ]">
                          <Lightbulb :class="[
                            'w-4 h-4',
                            device.status === 'on' ? 'text-amber-600' : 'text-gray-500'
                          ]" />
                        </div>
                        <div>
                          <div class="font-medium text-amber-900 dark:text-amber-100">{{ device.name }}</div>
                          <div v-if="device.color" class="flex items-center gap-1 mt-1">
                            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: device.color }"></div>
                            <span class="text-xs text-amber-700 dark:text-amber-300">Color</span>
                          </div>
                        </div>
                      </div>
                      <Switch
                        :checked="device.status === 'on'"
                        @update:checked="toggleDevice(device.id)"
                      />
                    </div>
                    <div v-if="device.brightness !== undefined" class="space-y-2">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-amber-700 dark:text-amber-300">Brightness</span>
                        <span class="font-semibold text-amber-900 dark:text-amber-100">{{ device.brightness }}%</span>
                      </div>
                      <Slider
                        :model-value="[device.brightness]"
                        @update:model-value="([value]) => adjustBrightness(device.id, value)"
                        :max="100"
                        :step="1"
                        class="w-full"
                      />
                    </div>
                  </div>
                </div>

                <!-- Living Room Environment -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div v-for="device in room.devices.filter(d => !d.controllable)" :key="device.id" class="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50 text-center">
                    <div :class="[getStatusColor(device.status), 'mb-2']">
                      <component :is="getDeviceIcon(device.type)" class="w-4 h-4 mx-auto" />
                    </div>
                    <div class="text-sm font-medium text-blue-900 dark:text-blue-100">{{ device.name }}</div>
                    <div v-if="device.value" class="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {{ device.value }}{{ device.unit }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Kitchen -->
              <div v-else-if="room.name === 'Kitchen'" class="space-y-4">
                <!-- Kitchen Header -->
                <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/10 via-orange-500/5 to-yellow-500/10 border border-red-500/20 p-6">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div class="relative">
                    <div class="flex items-center gap-3 mb-2">
                      <div class="p-2 bg-red-500/20 rounded-lg">
                        <Flame class="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h5 class="text-lg font-semibold text-red-900 dark:text-red-100">Kitchen</h5>
                        <p class="text-sm text-red-700 dark:text-red-300">
                          Cooking & dining hub • {{ room.temperature?.toFixed(1) }}°C • {{ room.lightsOn }}/{{ room.totalLights }} lights on
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Kitchen Appliances -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="device in room.devices.filter(d => d.controllable)" :key="device.id" class="p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-xl border border-red-200/50 dark:border-red-800/50">
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <div :class="[
                          'p-2 rounded-lg',
                          device.status === 'on' ? 'bg-red-500/20' : 'bg-gray-200/50 dark:bg-gray-700/50'
                        ]">
                          <component :is="getDeviceIcon(device.type)" class="w-4 h-4" />
                        </div>
                        <div>
                          <div class="font-medium text-red-900 dark:text-red-100">{{ device.name }}</div>
                          <div v-if="device.power" class="text-xs text-red-700 dark:text-red-300">
                            {{ device.power }}W • {{ device.energy }}kWh today
                          </div>
                        </div>
                      </div>
                      <Switch
                        :checked="device.status === 'on'"
                        @update:checked="toggleDevice(device.id)"
                      />
                    </div>
                    <div v-if="device.type === 'light' && device.brightness !== undefined" class="space-y-2">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-red-700 dark:text-red-300">Brightness</span>
                        <span class="font-semibold text-red-900 dark:text-red-100">{{ device.brightness }}%</span>
                      </div>
                      <Slider
                        :model-value="[device.brightness]"
                        @update:model-value="([value]) => adjustBrightness(device.id, value)"
                        :max="100"
                        :step="1"
                        class="w-full"
                      />
                    </div>
                  </div>
                </div>

                <!-- Kitchen Environment -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div v-for="device in room.devices.filter(d => !d.controllable)" :key="device.id" class="p-3 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-lg border border-orange-200/50 dark:border-orange-800/50 text-center">
                    <div :class="[getStatusColor(device.status), 'mb-2']">
                      <component :is="getDeviceIcon(device.type)" class="w-4 h-4 mx-auto" />
                    </div>
                    <div class="text-sm font-medium text-orange-900 dark:text-orange-100">{{ device.name }}</div>
                    <div v-if="device.value" class="text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">
                      {{ device.value }}{{ device.unit }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bedroom -->
              <div v-else-if="room.name === 'Bedroom'" class="space-y-4">
                <!-- Bedroom Header -->
                <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 border border-purple-500/20 p-6">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div class="relative">
                    <div class="flex items-center gap-3 mb-2">
                      <div class="p-2 bg-purple-500/20 rounded-lg">
                        <Home class="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h5 class="text-lg font-semibold text-purple-900 dark:text-purple-100">Bedroom</h5>
                        <p class="text-sm text-purple-700 dark:text-purple-300">
                          Rest & relaxation • {{ room.temperature?.toFixed(1) }}°C • {{ room.lightsOn }}/{{ room.totalLights }} lights on
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Bedroom Lights -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="device in room.devices.filter(d => d.type === 'light')" :key="device.id" class="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <div :class="[
                          'p-2 rounded-lg',
                          device.status === 'on' ? 'bg-purple-500/20' : 'bg-gray-200/50 dark:bg-gray-700/50'
                        ]">
                          <Lightbulb :class="[
                            'w-4 h-4',
                            device.status === 'on' ? 'text-purple-600' : 'text-gray-500'
                          ]" />
                        </div>
                        <div>
                          <div class="font-medium text-purple-900 dark:text-purple-100">{{ device.name }}</div>
                          <div v-if="device.color" class="flex items-center gap-1 mt-1">
                            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: device.color }"></div>
                            <span class="text-xs text-purple-700 dark:text-purple-300">Warm light</span>
                          </div>
                        </div>
                      </div>
                      <Switch
                        :checked="device.status === 'on'"
                        @update:checked="toggleDevice(device.id)"
                      />
                    </div>
                    <div v-if="device.brightness !== undefined" class="space-y-2">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-purple-700 dark:text-purple-300">Brightness</span>
                        <span class="font-semibold text-purple-900 dark:text-purple-100">{{ device.brightness }}%</span>
                      </div>
                      <Slider
                        :model-value="[device.brightness]"
                        @update:model-value="([value]) => adjustBrightness(device.id, value)"
                        :max="100"
                        :step="1"
                        class="w-full"
                      />
                    </div>
                  </div>
                </div>

                <!-- Bedroom Environment -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div v-for="device in room.devices.filter(d => !d.controllable)" :key="device.id" class="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50 text-center">
                    <div :class="[getStatusColor(device.status), 'mb-2']">
                      <component :is="getDeviceIcon(device.type)" class="w-4 h-4 mx-auto" />
                    </div>
                    <div class="text-sm font-medium text-blue-900 dark:text-blue-100">{{ device.name }}</div>
                    <div v-if="device.value" class="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {{ device.value }}{{ device.unit }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Energy & Security -->
              <div v-else-if="room.name === 'Energy & Security'" class="space-y-4">
                <!-- Energy & Security Header -->
                <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 border border-green-500/20 p-6">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div class="relative">
                    <div class="flex items-center gap-3 mb-2">
                      <div class="p-2 bg-green-500/20 rounded-lg">
                        <Zap class="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h5 class="text-lg font-semibold text-green-900 dark:text-green-100">Energy & Security</h5>
                        <p class="text-sm text-green-700 dark:text-green-300">
                          Power management & monitoring • {{ room.temperature?.toFixed(1) }}°C
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Energy Systems -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="device in room.devices.filter(d => ['solar', 'battery', 'gas'].includes(d.type))" :key="device.id" class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/50 dark:border-green-800/50">
                    <div class="flex items-center gap-3 mb-2">
                      <div :class="[
                        'p-2 rounded-lg',
                        device.status === 'on' ? 'bg-green-500/20' : 'bg-gray-200/50 dark:bg-gray-700/50'
                      ]">
                        <component :is="getDeviceIcon(device.type)" class="w-4 h-4" />
                      </div>
                      <div>
                        <div class="font-medium text-green-900 dark:text-green-100">{{ device.name }}</div>
                        <div v-if="device.value" class="text-lg font-bold text-green-600 dark:text-green-400">
                          {{ device.value }}{{ device.unit }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Security Systems -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div v-for="device in room.devices.filter(d => ['doorbell', 'motion', 'camera'].includes(d.type))" :key="device.id" class="p-3 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-lg border border-teal-200/50 dark:border-teal-800/50 text-center">
                    <div :class="[getStatusColor(device.status), 'mb-2']">
                      <component :is="getDeviceIcon(device.type)" class="w-4 h-4 mx-auto" />
                    </div>
                    <div class="text-sm font-medium text-teal-900 dark:text-teal-100">{{ device.name }}</div>
                    <div :class="[
                      'w-2 h-2 rounded-full mx-auto mt-2',
                      device.status === 'on' ? 'bg-green-500' : 
                      device.status === 'motion' ? 'bg-orange-500' :
                      'bg-gray-500'
                    ]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Home, Lightbulb, Thermometer, Droplets, Lock, 
  Camera, Speaker, Tv, Gamepad2, Wifi, 
  Activity, Settings, Power, Volume2, Zap, 
  Sun, Battery, Plug, Eye, Wind, Bell, 
  TrendingUp, Flame, Gauge, Play, Pause, 
  RotateCcw, AlertTriangle, CheckCircle, 
  Clock, WifiOff, Signal
} from 'lucide-vue-next'
import Card from './ui/card.vue'
import Badge from './ui/badge.vue'
import Button from './ui/button.vue'
import Switch from './ui/switch.vue'
import Slider from './ui/slider.vue'
import Progress from './ui/progress.vue'
import Skeleton from './ui/skeleton.vue'

interface SmartHomeDevice {
  id: string
  name: string
  type: 'light' | 'temperature' | 'humidity' | 'window' | 'energy' | 'solar' | 'gas' | 'battery' | 'plug' | 'motion' | 'fan' | 'doorbell' | 'camera'
  room: string
  status: 'on' | 'off' | 'unavailable' | 'open' | 'closed' | 'motion' | 'no_motion'
  value?: string | number
  unit?: string
  lastSeen: string
  battery?: number
  signal?: number
  brightness?: number
  color?: string
  power?: number
  energy?: number
  controllable?: boolean
  history?: Array<{ time: string; value: number }>
}

interface Room {
  name: string
  devices: SmartHomeDevice[]
  temperature?: number
  humidity?: number
  lightsOn: number
  totalLights: number
}

const isLoading = ref(true)
const rooms = ref<Room[]>([])
const selectedRoom = ref('Living Room')
const overallStats = ref({
  totalDevices: 0,
  onlineDevices: 0,
  lightsOn: 0,
  totalLights: 0,
  averageTemperature: 0,
  averageHumidity: 0,
  totalPowerConsumption: 0,
  solarProduction: 0,
  batteryLevel: 0
})

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'light': return Lightbulb
    case 'temperature': return Thermometer
    case 'humidity': return Droplets
    case 'window': return Lock
    case 'energy': return Zap
    case 'solar': return Sun
    case 'gas': return Flame
    case 'battery': return Battery
    case 'plug': return Plug
    case 'motion': return Eye
    case 'fan': return Wind
    case 'doorbell': return Bell
    case 'camera': return Camera
    default: return Activity
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'on': return 'text-green-500'
    case 'off': return 'text-gray-500'
    case 'open': return 'text-yellow-500'
    case 'closed': return 'text-blue-500'
    case 'motion': return 'text-orange-500'
    case 'no_motion': return 'text-gray-500'
    case 'unavailable': return 'text-red-500'
    default: return 'text-gray-500'
  }
}

const toggleDevice = (deviceId: string) => {
  rooms.value = rooms.value.map(room => ({
    ...room,
    devices: room.devices.map(device => 
      device.id === deviceId 
        ? { 
            ...device, 
            status: device.status === 'on' ? 'off' : 'on',
            brightness: device.status === 'off' ? 80 : 0
          }
        : device
    )
  }))
}

const adjustBrightness = (deviceId: string, brightness: number) => {
  rooms.value = rooms.value.map(room => ({
    ...room,
    devices: room.devices.map(device => 
      device.id === deviceId 
        ? { ...device, brightness, status: brightness > 0 ? 'on' : 'off' }
        : device
    )
  }))
}

onMounted(() => {
  // Mock data for demo purposes
  const mockRooms: Room[] = [
    {
      name: 'Living Room',
      temperature: 22.5,
      humidity: 45,
      lightsOn: 2,
      totalLights: 3,
      devices: [
        { id: 'lr-light-1', name: 'Main Light', type: 'light', room: 'Living Room', status: 'on', brightness: 80, color: '#FFD700', lastSeen: 'now', controllable: true },
        { id: 'lr-light-2', name: 'Ambient Light', type: 'light', room: 'Living Room', status: 'on', brightness: 60, color: '#87CEEB', lastSeen: 'now', controllable: true },
        { id: 'lr-light-3', name: 'Reading Light', type: 'light', room: 'Living Room', status: 'off', lastSeen: 'now', controllable: true },
        { id: 'lr-temp', name: 'TADO Temp', type: 'temperature', room: 'Living Room', status: 'on', value: 22.5, unit: '°C', lastSeen: 'now' },
        { id: 'lr-humidity', name: 'TADO Humidity', type: 'humidity', room: 'Living Room', status: 'on', value: 45, unit: '%', lastSeen: 'now' },
        { id: 'lr-window', name: 'Window', type: 'window', room: 'Living Room', status: 'closed', lastSeen: 'now' },
        { id: 'lr-plug-1', name: 'TV Plug', type: 'plug', room: 'Living Room', status: 'on', power: 45, energy: 2.3, lastSeen: 'now', controllable: true },
        { id: 'lr-motion', name: 'Motion Sensor', type: 'motion', room: 'Living Room', status: 'no_motion', lastSeen: '2m ago' }
      ]
    },
    {
      name: 'Kitchen',
      temperature: 24.2,
      humidity: 38,
      lightsOn: 1,
      totalLights: 2,
      devices: [
        { id: 'kit-light-1', name: 'Ceiling Light', type: 'light', room: 'Kitchen', status: 'on', brightness: 100, lastSeen: 'now' },
        { id: 'kit-light-2', name: 'Under Cabinet', type: 'light', room: 'Kitchen', status: 'off', lastSeen: 'now' },
        { id: 'kit-temp', name: 'TADO Temp', type: 'temperature', room: 'Kitchen', status: 'on', value: 24.2, unit: '°C', lastSeen: 'now' },
        { id: 'kit-window', name: 'Window', type: 'window', room: 'Kitchen', status: 'open', lastSeen: 'now' },
        { id: 'kit-plug-1', name: 'Coffee Machine', type: 'plug', room: 'Kitchen', status: 'on', power: 1200, energy: 0.8, lastSeen: 'now' },
        { id: 'kit-fan', name: 'Exhaust Fan', type: 'fan', room: 'Kitchen', status: 'off', lastSeen: 'now' }
      ]
    },
    {
      name: 'Bedroom',
      temperature: 20.8,
      humidity: 42,
      lightsOn: 1,
      totalLights: 2,
      devices: [
        { id: 'bed-light-1', name: 'Bedside Light', type: 'light', room: 'Bedroom', status: 'on', brightness: 30, color: '#FFB6C1', lastSeen: 'now' },
        { id: 'bed-light-2', name: 'Ceiling Light', type: 'light', room: 'Bedroom', status: 'off', lastSeen: 'now' },
        { id: 'bed-temp', name: 'TADO Temp', type: 'temperature', room: 'Bedroom', status: 'on', value: 20.8, unit: '°C', lastSeen: 'now' },
        { id: 'bed-window', name: 'Window', type: 'window', room: 'Bedroom', status: 'closed', lastSeen: 'now' },
        { id: 'bed-plug-1', name: 'Phone Charger', type: 'plug', room: 'Bedroom', status: 'on', power: 15, energy: 0.1, lastSeen: 'now' }
      ]
    },
    {
      name: 'Energy & Security',
      temperature: 21.0,
      humidity: 40,
      lightsOn: 0,
      totalLights: 0,
      devices: [
        { id: 'energy-solar', name: 'Solar Production', type: 'solar', room: 'Energy & Security', status: 'on', value: 3.2, unit: 'kW', lastSeen: 'now' },
        { id: 'energy-battery', name: 'Battery Storage', type: 'battery', room: 'Energy & Security', status: 'on', value: 85, unit: '%', lastSeen: 'now' },
        { id: 'energy-gas', name: 'Gas Usage', type: 'gas', room: 'Energy & Security', status: 'on', value: 12.5, unit: 'm³', lastSeen: 'now' },
        { id: 'doorbell', name: 'Doorbell Camera', type: 'doorbell', room: 'Energy & Security', status: 'on', lastSeen: 'now' },
        { id: 'motion-front', name: 'Front Motion', type: 'motion', room: 'Energy & Security', status: 'no_motion', lastSeen: '5m ago' },
        { id: 'camera-front', name: 'Front Camera', type: 'camera', room: 'Energy & Security', status: 'on', lastSeen: 'now' }
      ]
    }
  ]

  setTimeout(() => {
    rooms.value = mockRooms
    
    const allDevices = mockRooms.flatMap(room => room.devices)
    const onlineDevices = allDevices.filter(device => device.status !== 'unavailable')
    const totalLights = allDevices.filter(device => device.type === 'light').length
    const lightsOn = allDevices.filter(device => device.type === 'light' && device.status === 'on').length
    const avgTemp = mockRooms.reduce((sum, room) => sum + (room.temperature || 0), 0) / mockRooms.length
    const avgHumidity = mockRooms.reduce((sum, room) => sum + (room.humidity || 0), 0) / mockRooms.length
    const powerDevices = allDevices.filter(device => device.type === 'plug' && device.status === 'on')
    const totalPower = powerDevices.reduce((sum, device) => sum + (device.power || 0), 0)
    
    overallStats.value = {
      totalDevices: allDevices.length,
      onlineDevices: onlineDevices.length,
      lightsOn,
      totalLights,
      averageTemperature: avgTemp,
      averageHumidity: avgHumidity,
      totalPowerConsumption: totalPower,
      solarProduction: 3.2,
      batteryLevel: 85
    }
  }, 2000)
  
  // Simulate loading
  const loadingTimer = setTimeout(() => {
    isLoading.value = false
  }, 1500)
})
</script>