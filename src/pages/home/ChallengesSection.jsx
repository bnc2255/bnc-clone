import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import bgImage from '../../assets/reviewing_financial_reports.webp'

const SLIDES = [
  {
    title: 'Resistance to change',
    desc: "95% of CEOs are concerned that resistance to change could hinder our organisation's ability to adapt our business model and core operations as needed.",
    showButtons: true,
    btn1Text: 'About Us',
    btn1Link: '/about-us',
    btn2Text: 'Career',
    btn2Link: '/careers',
  },
  {
    title: 'Security Controls',
    desc: '81% of CEOs find it challenging to manage security controls across remote or hybrid working architectures.',
    showButtons: false,
  },
  {
    title: 'Regulatory Challenges',
    desc: '88% of CEOs recognise the need to adapt to changing regulatory frameworks and international tax guidelines.',
    showButtons: false,
  },
  {
    title: 'Merger integration',
    desc: '89% of CEOs find merger integration is key to growth, but struggle to align financial operations post-transaction.',
    showButtons: false,
  },
]

export default function ChallengesSection({ isCoveredByModal = false }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isUserPaused, setIsUserPaused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isOnScreen, setIsOnScreen] = useState(true)

  const containerRef = useRef(null)

  // IntersectionObserver to observe if carousel is on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOnScreen(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // Auto-rotation timer (8 seconds) with all pause conditions
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const shouldPause =
      isUserPaused ||
      isHovered ||
      isFocused ||
      !isOnScreen ||
      isCoveredByModal

    if (shouldPause) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [isUserPaused, isHovered, isFocused, isOnScreen, isCoveredByModal])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  const activeSlideData = SLIDES[currentSlide]

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
      aria-roledescription="carousel"
      aria-label="CEO Business Challenges Carousel"
      className="relative w-full bg-[#1D1D1F] text-[#F5F5F7] py-20 lg:py-28 overflow-hidden border-t border-white/10"
    >
      {/* Background with subtle photo texture and dark editorial overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <img
          src={bgImage}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1D1D1F]/90" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">

        {/* Section Header / Tag */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-[#2997FF] font-medium tracking-wide text-xs uppercase letter-spacing-[0.1em]">
            Executive Landscape
          </span>
          <h2 className="bnc-section-heading text-white mt-1">
            Navigating Critical Business Challenges
          </h2>
        </div>

        {/* Carousel Viewport Container */}
        <div className="relative min-h-[320px] md:min-h-[260px] flex items-center justify-between gap-6">

          {/* Previous Slide Button */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous challenge slide"
            className="flex-shrink-0 w-11 h-11 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2997FF] focus-visible:outline-none"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Slide Content Card with 250ms crossfade */}
          <div
            key={currentSlide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${currentSlide + 1} of ${SLIDES.length}`}
            className="flex-1 max-w-3xl mx-auto text-center md:text-left bnc-carousel-slide animate-in fade-in duration-250 py-4"
          >
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-4">
              {activeSlideData.title}
            </h3>

            <p className="bnc-body-lead text-[#E8E8ED] leading-relaxed max-w-2xl">
              {activeSlideData.desc}
            </p>

            {/* Slide Action Buttons */}
            {activeSlideData.showButtons && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                <Link
                  to={activeSlideData.btn1Link}
                  className="bnc-btn-pill-primary focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  {activeSlideData.btn1Text}
                </Link>
                <Link
                  to={activeSlideData.btn2Link}
                  className="bnc-btn-pill-dark-secondary focus-visible:ring-2 focus-visible:ring-[#2997FF] focus-visible:outline-none"
                >
                  {activeSlideData.btn2Text}
                </Link>
              </div>
            )}
          </div>

          {/* Next Slide Button */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next challenge slide"
            className="flex-shrink-0 w-11 h-11 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2997FF] focus-visible:outline-none"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* Carousel Navigation Bottom Controls: Slide Indicators & Pause/Play */}
        <div className="mt-12 flex items-center justify-center gap-6">

          {/* Slide Indicator Dots / Pills */}
          <div className="flex items-center gap-2">
            {SLIDES.map((slide, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                className={`h-2 rounded-full transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2997FF] focus-visible:outline-none ${
                  currentSlide === idx
                    ? 'w-7 bg-[#2997FF]'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Pause / Play Control */}
          <button
            type="button"
            onClick={() => setIsUserPaused(!isUserPaused)}
            aria-label={isUserPaused ? 'Play slide auto-rotation' : 'Pause slide auto-rotation'}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2997FF] focus-visible:outline-none"
          >
            {isUserPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </button>

        </div>

      </div>
    </section>
  )
}
