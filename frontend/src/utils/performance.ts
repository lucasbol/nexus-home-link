// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  const start = performance.now()

  const result = fn()

  if (result instanceof Promise) {
    return result.finally(() => {
      const end = performance.now()
      console.log(`${name} took ${(end - start).toFixed(2)} milliseconds`)
    })
  } else {
    const end = performance.now()
    console.log(`${name} took ${(end - start).toFixed(2)} milliseconds`)
    return result
  }
}

export const measureAsyncPerformance = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now()

  try {
    const result = await fn()
    const end = performance.now()
    console.log(`${name} took ${(end - start).toFixed(2)} milliseconds`)
    return result
  } catch (error) {
    const end = performance.now()
    console.error(`${name} failed after ${(end - start).toFixed(2)} milliseconds:`, error)
    throw error
  }
}

export const createPerformanceTimer = (name: string) => {
  const start = performance.now()

  return {
    end: () => {
      const end = performance.now()
      console.log(`${name} took ${(end - start).toFixed(2)} milliseconds`)
      return end - start
    }
  }
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const requestIdleCallback = (callback: () => void, timeout = 5000) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout })
  } else {
    return setTimeout(callback, 1)
  }
}

export const cancelIdleCallback = (id: number) => {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id)
  } else {
    clearTimeout(id)
  }
}
