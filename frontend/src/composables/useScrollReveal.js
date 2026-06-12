/**
 * 4K Production — useScrollReveal.js
 * Composable that drives the scroll-reveal animations
 * using IntersectionObserver.
 *
 * Usage in any component/page:
 *   import { useScrollReveal } from '@/composables/useScrollReveal.js'
 *   const { initReveal } = useScrollReveal()
 *   onMounted(() => initReveal())
 */

import { onUnmounted } from 'vue'

export function useScrollReveal() {
  let observer = null

  /**
   * Initialise the observer.
   * Call this inside onMounted() after the DOM is ready.
   * @param {string} selector - CSS selector for reveal targets (default: '.reveal')
   */
  function initReveal(selector = '.reveal') {
    // Disconnect any previous observer
    if (observer) observer.disconnect()

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            // Stop watching once revealed (one-shot animation)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold:  0.12,   // trigger when 12% of element is visible
        rootMargin: '0px 0px -40px 0px'  // slight bottom offset
      }
    )

    // Observe all matching elements
    const elements = document.querySelectorAll(selector)
    elements.forEach((el) => observer.observe(el))
  }

  /**
   * Re-run the observer (useful after dynamic content loads).
   * @param {string} selector
   */
  function refresh(selector = '.reveal') {
    if (observer) observer.disconnect()
    initReveal(selector)
  }

  // Clean up when the component unmounts
  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { initReveal, refresh }
}
