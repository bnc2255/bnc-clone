import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import posterImg from '../../assets/reviewing_financial_reports.webp'

const VIDEO_URL = 'https://bvvqyjqokvnttbgyjkrt.supabase.co/storage/v1/object/public/video_bnc.in/file.mp4'

export default function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window === 'undefined') return true
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const [isMuted, setIsMuted] = useState(true)
  const [hasError, setHasError] = useState(false)

  const videoRef = useRef(null)
  const videoWrapperRef = useRef(null)
  const videoTransformRef = useRef(null)
  const isUserPausedRef = useRef(false)

  // Scroll handler: scale video smoothly from 94% to 100% across 70vh without React re-renders
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    if (prefersReducedMotion || isMobile) {
      if (videoTransformRef.current) {
        videoTransformRef.current.style.transform = 'scale(1)'
      }
      return
    }

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (videoTransformRef.current) {
            const scrollY = window.scrollY || window.pageYOffset
            const range = window.innerHeight * 0.7
            const progress = Math.min(1, Math.max(0, scrollY / range))
            const currentScale = 0.94 + progress * 0.06
            videoTransformRef.current.style.transform = `scale(${currentScale})`
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial position

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Video Autoplay & IntersectionObserver to pause when offscreen
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const video = videoRef.current
    if (!video) return

    if (prefersReducedMotion) {
      isUserPausedRef.current = true
      video.pause()
    } else {
      video.play().catch(() => {
        setIsPlaying(false)
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            video.pause()
          } else if (!isUserPausedRef.current && !prefersReducedMotion) {
            video.play().then(() => setIsPlaying(true)).catch(() => {})
          }
        })
      },
      { threshold: 0.1 }
    )

    if (videoWrapperRef.current) {
      observer.observe(videoWrapperRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
      isUserPausedRef.current = true
    } else {
      video.play().then(() => {
        setIsPlaying(true)
        isUserPausedRef.current = false
      }).catch(() => {
        setHasError(true)
      })
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  return (
    <section className="relative w-full bg-[#FFFFFF] pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Hero Copy (Reveals once over 600ms) */}
        <div className="bnc-hero-reveal max-w-4xl mx-auto text-center space-y-6">
          <h1 className="bnc-hero-h1 tracking-tight text-[#1D1D1F]">
            Outsourced Accounting &amp; Virtual CFO Services
          </h1>

          <p className="bnc-body-lead max-w-2xl mx-auto text-[#6E6E73]">
            BNC Global provides outsourced accounting, bookkeeping, payroll, tax support and virtual CFO services. Businesses can engage the team for operational finance support and strategic financial guidance, with scope agreed around their requirements.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/about-us"
              className="bnc-btn-pill-primary focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none"
            >
              About Us
            </Link>
            <Link
              to="/careers"
              className="bnc-btn-pill-secondary focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none"
            >
              Career
            </Link>
          </div>
        </div>

        {/* Brand Video Player Container */}
        <div
          ref={videoWrapperRef}
          className="mt-12 lg:mt-16 relative w-full aspect-video max-w-[1200px] mx-auto overflow-hidden rounded-[18px] bg-[#1D1D1F] shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          style={{ willChange: 'transform' }}
        >
          {hasError ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={posterImg}
                alt="BNC Global Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-sm bg-black/60 px-4 py-2 rounded-full">
                  Video preview unavailable
                </span>
              </div>
            </div>
          ) : (
            <div
              ref={videoTransformRef}
              className="w-full h-full"
              style={{
                transform: 'scale(0.94)',
                transformOrigin: 'center center',
              }}
            >
              <video
                ref={videoRef}
                src={VIDEO_URL}
                poster={posterImg}
                playsInline
                loop
                muted={isMuted}
                onError={() => setHasError(true)}
                className="w-full h-full object-cover"
                aria-label="BNC Global corporate introduction video"
              />
            </div>
          )}

          {/* Video Controls Bar */}
          {!hasError && (
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="p-1.5 text-white/90 hover:text-white transition-colors cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="p-1.5 text-white/90 hover:text-white transition-colors cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
