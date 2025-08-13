/**
 * Emergency script to force refresh categories in production
 * Run this script after deleting categories from admin to immediately clear cache
 */

const forceRefreshCategories = async () => {
  try {
    console.log('🔄 Force refreshing categories...')

    // Multiple requests with different cache-busting parameters
    const timestamp = new Date().getTime()
    const requests = []

    for (let i = 0; i < 5; i++) {
      const random = Math.random().toString(36).substring(7)
      requests.push(
        fetch(`/api/categories?_t=${timestamp}&_r=${random}&_force=${i}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
      )
    }

    await Promise.all(requests)
    console.log('✅ Categories cache cleared successfully!')

    // Reload the page to reflect changes
    if (typeof window !== 'undefined') {
      window.location.reload()
    }

  } catch (error) {
    console.error('❌ Error refreshing categories:', error)
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).forceRefreshCategories = forceRefreshCategories
}

export { forceRefreshCategories }
