import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/legacy-refresh.css'

/** Brings the existing service and information pages into the shared BNC visual system. */
export default function LegacyRefresh({ children }) {
  const root = useRef(null)
  const { pathname } = useLocation()
  const pageVariant = pathname === '/bnc-global-services'
    ? 'services'
    : pathname === '/communities'
      ? 'communities'
      : pathname === '/contact'
        ? 'contact'
        : ''

  useEffect(() => {
    const host = root.current
    if (!host) return

    const hero = host.querySelector(':scope > div > section:first-of-type')
    if (hero) {
      const heroImage = hero.style.backgroundImage
      if (heroImage && heroImage !== 'none') hero.style.setProperty('--bnc-hero-image', heroImage)
    }

    const targets = [...host.querySelectorAll('section > *')].filter((element) => {
      const style = window.getComputedStyle(element)
      return style.position !== 'absolute' && !element.hasAttribute('aria-hidden')
    })

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      targets.forEach((element) => element.classList.add('bnc-revealed'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('bnc-revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })

    targets.forEach((element, index) => {
      element.classList.add('bnc-reveal')
      element.style.setProperty('--bnc-reveal-delay', `${Math.min(index % 4, 3) * 55}ms`)
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [pathname])

  return <div ref={root} className={`bnc-refresh${pageVariant ? ` bnc-refresh--${pageVariant}` : ''}`}>{children}</div>
}
