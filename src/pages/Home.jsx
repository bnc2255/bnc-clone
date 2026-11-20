import { useState, useEffect, useRef } from 'react'
import HeroSection from './home/HeroSection'
import ChallengesSection from './home/ChallengesSection'
import WhatWeDoSection from './home/WhatWeDoSection'
import FaqSection from './home/FaqSection'
import DpdpaModal from './home/DpdpaModal'
import './home/landing.css'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sectionsRef = useRef([])

  // Enhance section reveal with 500ms opacity / 24px translation and 80ms stagger after hydration
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || typeof window === 'undefined' || window.__PRERENDER__) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    sectionsRef.current.forEach((el, index) => {
      if (!el) return
      // Stagger transition delay by 80ms
      el.style.transitionDelay = `${index * 80}ms`
      el.classList.add('bnc-reveal-pending')
      observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="bnc-landing-container flex flex-col min-h-screen bg-white text-[#1D1D1F] antialiased selection:bg-[#0071E3] selection:text-white">
      {/* 1. Hero Section: Display Headline, Summary, Actions & Scaled Brand Video */}
      <div ref={(el) => (sectionsRef.current[0] = el)}>
        <HeroSection />
      </div>

      {/* 2. Business Challenges: Near-Black Editorial Section with 4-Slide Carousel */}
      <div ref={(el) => (sectionsRef.current[1] = el)}>
        <ChallengesSection isCoveredByModal={isModalOpen} />
      </div>

      {/* 3. What We Do: Light Section with Sticky Corridor Image & 3 Benefit Chapters */}
      <div ref={(el) => (sectionsRef.current[2] = el)}>
        <WhatWeDoSection />
      </div>

      {/* 4. Frequently Asked Questions: White Section with Category Tabs & Search Filter */}
      <div ref={(el) => (sectionsRef.current[3] = el)}>
        <FaqSection />
      </div>

      {/* 5. DPDPA Compliance Lightbox Popup */}
      <DpdpaModal onVisibilityChange={setIsModalOpen} />
    </div>
  )
}
