<template>
  <Card class="p-6 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Calendar class="w-5 h-5 text-primary" />
          <h3 class="text-lg font-semibold text-foreground">Calendar & Events</h3>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" class="h-8">
            <Plus class="w-4 h-4" />
          </Button>
        </div>
      </div>

      <!-- Today's Events -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-foreground">Today's Events</h4>
        <div class="space-y-2">
          <div class="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/30">
            <div class="p-2 rounded-md bg-blue-500/20 text-blue-500">
              <Calendar class="w-4 h-4" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-foreground">Team Meeting</p>
              <p class="text-xs text-muted-foreground">2:00 PM - 3:00 PM</p>
            </div>
            <Badge class="bg-blue-500/20 text-blue-500 border-blue-500/30">Work</Badge>
          </div>

          <div class="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/30">
            <div class="p-2 rounded-md bg-green-500/20 text-green-500">
              <Calendar class="w-4 h-4" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-foreground">Server Maintenance</p>
              <p class="text-xs text-muted-foreground">8:00 PM - 10:00 PM</p>
            </div>
            <Badge class="bg-green-500/20 text-green-500 border-green-500/30">System</Badge>
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-foreground">Upcoming Events</h4>
        <div class="space-y-2">
          <div class="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/30">
            <div class="p-2 rounded-md bg-purple-500/20 text-purple-500">
              <Calendar class="w-4 h-4" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-foreground">Backup Verification</p>
              <p class="text-xs text-muted-foreground">Tomorrow • 9:00 AM</p>
            </div>
            <Badge class="bg-purple-500/20 text-purple-500 border-purple-500/30">Maintenance</Badge>
          </div>

          <div class="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/30">
            <div class="p-2 rounded-md bg-orange-500/20 text-orange-500">
              <Calendar class="w-4 h-4" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-foreground">Security Audit</p>
              <p class="text-xs text-muted-foreground">Friday • 2:00 PM</p>
            </div>
            <Badge class="bg-orange-500/20 text-orange-500 border-orange-500/30">Security</Badge>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-foreground">Quick Actions</h4>
        <div class="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" class="h-8">
            <Plus class="w-4 h-4 mr-2" />
            Add Event
          </Button>
          <Button variant="outline" size="sm" class="h-8">
            <Calendar class="w-4 h-4 mr-2" />
            View Calendar
          </Button>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Calendar, Plus } from 'lucide-vue-next'
import Card from './ui/card.vue'
import Badge from './ui/badge.vue'
import Button from './ui/button.vue'
</script>
