import { ref, computed } from 'vue'

// const keywords = [
//   'server room',
//   'data center',
//   'network infrastructure',
//   'homelab setup',
//   'tech workspace',
//   'computer hardware',
//   'network cables',
//   'server rack'
// ]

export function useBackgroundImage() {
  const currentImage = ref('')
  const isLoading = ref(false)

  const backgroundImage = computed(() => {
    return currentImage.value || '/placeholder.svg'
  })

  const fetchBackgroundImage = async () => {
    if (isLoading.value) return

    isLoading.value = true
    try {
      // const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)]
      const width = 3840
      const height = 2160

      // Using Picsum as fallback since Unsplash is blocked
      const response = await fetch(`https://picsum.photos/${width}/${height}?random=${Date.now()}`)

      if (response.ok) {
        currentImage.value = response.url
      }
    } catch (error) {
      console.error('Failed to fetch background image:', error)
      // Use a default gradient background if all else fails
      currentImage.value = ''
    } finally {
      isLoading.value = false
    }
  }

  return {
    backgroundImage,
    isLoading,
    fetchBackgroundImage
  }
}
