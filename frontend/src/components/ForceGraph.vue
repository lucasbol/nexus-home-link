<template>
  <div ref="container" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as d3 from 'd3-force'
import * as d3Select from 'd3-selection'
import * as d3Zoom from 'd3-zoom'

interface Node {
  id: string
  name: string
  type: string
  ip: string
  status: string
  layer: string
  vlan?: number
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

interface Link {
  source: string | Node
  target: string | Node
  strength: number
  type: string
}

interface Props {
  nodes: Node[]
  links: Link[]
  width?: number
  height?: number
  nodeRadius?: number
  linkDistance?: number
  chargeStrength?: number
  onNodeClick?: (node: Node) => void
  onNodeHover?: (node: Node | null) => void
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 400,
  nodeRadius: 8,
  linkDistance: 150,
  chargeStrength: -500
})

const container = ref<HTMLDivElement>()
let svg: any
let simulation: d3.Simulation<Node, Link>
let nodeElements: any
let linkElements: any
let labelElements: any

const emit = defineEmits<{
  nodeClick: [node: Node]
  nodeHover: [node: Node | null]
}>()

const getNodeColor = (node: Node) => {
  if (node.status === 'offline') return '#ef4444'

  switch (node.layer) {
    case 'core':
      return '#3b82f6'
    case 'distribution':
      return '#8b5cf6'
    case 'access':
      return '#f59e0b'
    case 'endpoint':
      return '#10b981'
    default:
      return '#6b7280'
  }
}

const getVlanColor = (vlan?: number) => {
  if (!vlan) return '#6b7280'
  const colors = [
    '#3b82f6',
    '#8b5cf6',
    '#f59e0b',
    '#10b981',
    '#ef4444',
    '#06b6d4',
    '#84cc16',
    '#f97316'
  ]
  return colors[vlan % colors.length]
}

const getLinkColor = (link: Link) => {
  return link.type === 'wireless' ? '#f59e0b' : '#6b7280'
}

const initSimulation = () => {
  if (!container.value) return

  // Clear existing content
  d3Select.select(container.value).selectAll('*').remove()

  // Create SVG
  svg = d3Select
    .select(container.value)
    .append('svg')
    .attr('width', props.width)
    .attr('height', props.height)
    .style('background', 'transparent')

  // Add zoom behavior
  const zoomBehavior = d3Zoom
    .zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event: any) => {
      g.attr('transform', event.transform)
    })

  svg.call(zoomBehavior)

  // Create main group
  const g = svg.append('g')

  // Create links
  linkElements = g
    .append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(props.links)
    .enter()
    .append('line')
    .attr('stroke', d => getLinkColor(d))
    .attr('stroke-width', d => d.strength * 1.5)
    .attr('stroke-opacity', 0.6)

  // Create nodes
  nodeElements = g
    .append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(props.nodes)
    .enter()
    .append('circle')
    .attr('r', props.nodeRadius)
    .attr('fill', d => getNodeColor(d))
    .attr('stroke', d => getNodeColor(d))
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .on('click', (event: any, d: Node) => {
      event.stopPropagation()
      emit('nodeClick', d)
      if (props.onNodeClick) props.onNodeClick(d)
    })
    .on('mouseover', (event: any, d: Node) => {
      emit('nodeHover', d)
      if (props.onNodeHover) props.onNodeHover(d)
    })
    .on('mouseout', () => {
      emit('nodeHover', null)
      if (props.onNodeHover) props.onNodeHover(null)
    })

  // Create labels
  labelElements = g
    .append('g')
    .attr('class', 'labels')
    .selectAll('text')
    .data(props.nodes)
    .enter()
    .append('text')
    .text(d => d.ip)
    .attr('text-anchor', 'middle')
    .attr('dy', 20)
    .style('font-size', '10px')
    .style('fill', '#374151')
    .style('pointer-events', 'none')

  // Create simulation
  simulation = d3
    .forceSimulation(props.nodes)
    .force(
      'link',
      d3
        .forceLink(props.links)
        .id((d: any) => d.id)
        .distance(props.linkDistance)
    )
    .force('charge', d3.forceManyBody().strength(props.chargeStrength))
    .force('center', d3.forceCenter(props.width / 2, props.height / 2))
    .force('collision', d3.forceCollide().radius(props.nodeRadius * 2))

  // Update positions on tick
  simulation.on('tick', () => {
    linkElements
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y)

    nodeElements.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)

    labelElements.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y)
  })
}

const updateSimulation = () => {
  if (!simulation) return

  // Update data
  simulation.nodes(props.nodes)
  simulation.force(
    'link',
    d3
      .forceLink(props.links)
      .id((d: any) => d.id)
      .distance(props.linkDistance)
  )
  simulation.force('charge', d3.forceManyBody().strength(props.chargeStrength))

  // Restart simulation
  simulation.alpha(0.3).restart()
}

watch(
  () => [props.nodes, props.links],
  () => {
    nextTick(() => {
      updateSimulation()
    })
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    initSimulation()
  })
})

onUnmounted(() => {
  if (simulation) {
    simulation.stop()
  }
})
</script>
