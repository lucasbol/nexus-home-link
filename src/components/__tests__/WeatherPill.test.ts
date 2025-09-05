import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WeatherPill from '../WeatherPill.vue'

describe('WeatherPill', () => {
  it('renders loading state initially', () => {
    const wrapper = mount(WeatherPill)

    expect(wrapper.text()).toContain('Loading...')
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })

  it('renders weather information after loading', async () => {
    const wrapper = mount(WeatherPill)

    // Wait for the setTimeout to complete
    await new Promise(resolve => setTimeout(resolve, 1100))

    expect(wrapper.text()).toContain('22°C')
    expect(wrapper.text()).toContain('65%')
    expect(wrapper.text()).toContain('12 km/h')
    expect(wrapper.text()).toContain('Amsterdam')
  })

  it('shows correct weather icon', async () => {
    const wrapper = mount(WeatherPill)

    // Wait for the setTimeout to complete
    await new Promise(resolve => setTimeout(resolve, 1100))

    // Check that the weather icon is rendered (it's a dynamic component)
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
