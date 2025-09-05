<template>
  <Card class="p-6 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <HardDrive class="w-5 h-5 text-primary" />
          <h3 class="text-lg font-semibold text-foreground">Backup Status</h3>
        </div>
        <div class="flex items-center gap-2">
          <Badge class="bg-green-500/20 text-green-500 border-green-500/30">Healthy</Badge>
        </div>
      </div>

      <!-- Backup Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <CheckCircle class="w-4 h-4 text-green-500 mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">Successful</p>
          <p class="text-lg font-semibold text-foreground">24</p>
        </div>
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <AlertTriangle class="w-4 h-4 text-yellow-500 mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">Failed</p>
          <p class="text-lg font-semibold text-foreground">1</p>
        </div>
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <Clock class="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">Last Backup</p>
          <p class="text-lg font-semibold text-foreground">2h ago</p>
        </div>
      </div>

      <!-- Backup Jobs -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-foreground">Backup Jobs</h4>
        <div class="space-y-2">
          <div
            class="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border/30"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-md bg-green-500/20 text-green-500">
                <CheckCircle class="w-4 h-4" />
              </div>
              <div>
                <p class="text-sm font-medium text-foreground">VM Backups</p>
                <p class="text-xs text-muted-foreground">Proxmox • 2 hours ago</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs text-muted-foreground">Size</p>
              <p class="text-sm font-medium text-foreground">45.2 GB</p>
            </div>
          </div>

          <div
            class="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border/30"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-md bg-green-500/20 text-green-500">
                <CheckCircle class="w-4 h-4" />
              </div>
              <div>
                <p class="text-sm font-medium text-foreground">Database Backups</p>
                <p class="text-xs text-muted-foreground">PostgreSQL • 4 hours ago</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs text-muted-foreground">Size</p>
              <p class="text-sm font-medium text-foreground">2.1 GB</p>
            </div>
          </div>

          <div
            class="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border/30"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-md bg-yellow-500/20 text-yellow-500">
                <AlertTriangle class="w-4 h-4" />
              </div>
              <div>
                <p class="text-sm font-medium text-foreground">File Backups</p>
                <p class="text-xs text-muted-foreground">Synology • 1 day ago</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs text-muted-foreground">Size</p>
              <p class="text-sm font-medium text-foreground">128.7 GB</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Storage Usage -->
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Backup Storage</span>
          <span class="text-foreground">2.1 TB / 4.0 TB</span>
        </div>
        <Progress :value="52.5" class="h-2" />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { HardDrive, CheckCircle, AlertTriangle, Clock } from 'lucide-vue-next'
import Card from './ui/card.vue'
import Badge from './ui/badge.vue'
import Progress from './ui/progress.vue'
</script>
