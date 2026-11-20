import { useState, useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'

const DPDPA_IMAGE_URL =
  'https://static.wixstatic.com/media/93f548_8230aee12f0b4490bfb7a6eb1a6e736e~mv2.jpeg/v1/crop/x_0,y_530,w_1792,h_1206/fill/w_588,h_386,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/create_a_image%2C_white_a_202606171119.jpeg'

export default function DpdpaModal({ onVisibilityChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)

  const closeModal = useCallback(() => {
    sessionStorage.setItem('dpdpa_modal_dismissed', 'true')
    setIsOpen(false)
    onVisibilityChange?.(false)

    // Restore focus to previously active element
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      previousFocusRef.current.focus()
    }
  }, [onVisibilityChange])

  // Check sessionStorage on mount (never show during prerender)
  useEffect(() => {
    if (typeof window === 'undefined' || window.__PRERENDER__) return

    const dismissed = sessionStorage.getItem('dpdpa_modal_dismissed')
    if (!dismissed) {
      previousFocusRef.current = document.activeElement
      // Queue update to avoid synchronous setState cascading render
      const timer = setTimeout(() => {
        setIsOpen(true)
        onVisibilityChange?.(true)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [onVisibilityChange])

  // Background scroll locking & Escape key listener & Focus trapping
  useEffect(() => {
    if (!isOpen) return

    // Lock background scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Escape listener
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeModal()
        return
      }

      // Focus trapping
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Initial focus into modal
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const initialFocusable = modalRef.current.querySelector('input, button')
        initialFocusable?.focus()
      }
    }, 50)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
    }
  }, [isOpen, closeModal])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dpdpa-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[820px] bg-white rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.18)] border border-[#D2D2D7]/60 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Close Button top right */}
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close DPDPA modal"
          className="absolute top-4 right-4 z-20 p-2 text-[#6E6E73] hover:text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-full transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Form Details */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-[#0066CC] font-semibold text-xs tracking-wider uppercase">
              Compliance Alert
            </span>
            <h2
              id="dpdpa-modal-title"
              className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1D1D1F]"
            >
              DPDPA Consulting
            </h2>
            <p className="text-[17px] text-[#6E6E73] leading-relaxed">
              Data Protection Starts Here. Prepare your organization for statutory privacy mandates with our compliance advisory.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              closeModal()
            }}
            className="space-y-4 max-w-sm"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="dpdpa-email"
                className="block text-[13px] font-medium text-[#424245]"
              >
                Enter your email *
              </label>
              <input
                id="dpdpa-email"
                type="email"
                required
                placeholder="name@company.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D2D2D7] bg-[#F5F5F7] text-[#1D1D1F] placeholder-[#86868B] text-[15px] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="bnc-btn-pill-primary focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bnc-btn-pill-secondary focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none"
              >
                Back to site
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Visual Brand Illustration (hidden on mobile) */}
        <div className="hidden md:block w-[320px] relative bg-[#F5F5F7] border-l border-[#D2D2D7]/50">
          <img
            src={DPDPA_IMAGE_URL}
            alt="DPDPA Consulting illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
