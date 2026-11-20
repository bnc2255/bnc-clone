import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import corridorImg from '../../assets/india_saudi_corridor.webp'
import iconAccounting from '../../assets/icon_accounting.webp'
import iconTax from '../../assets/icon_tax.webp'
import iconAdvisory from '../../assets/icon_advisory.png'

const CHAPTERS = [
  {
    id: 'integrated-expertise',
    icon: iconAccounting,
    title: 'Integrated Expertise Under One Roof',
    subtitle: 'Multidisciplinary Operations',
    desc: 'From accounting and tax to risk, ESG, cybersecurity, and hiring — our multidisciplinary teams work together to provide holistic business support, reducing vendor dependency and operational friction.',
  },
  {
    id: 'practical-implementation',
    icon: iconTax,
    title: 'Business-First, Not Theory-First',
    subtitle: 'Practical Execution',
    desc: 'We focus on practical implementation, not just advice. Every recommendation is designed to fit your business model, industry, and growth stage — ensuring measurable outcomes, not generic reports.',
  },
  {
    id: 'compliance-governance',
    icon: iconAdvisory,
    title: 'Compliance & Governance Focus',
    subtitle: 'Audit & Regulatory Readiness',
    desc: 'Regulatory adherence is built into everything we do. Our services are designed to keep you audit-ready, regulator-ready, and investor-ready at all times.',
  },
]

export default function WhatWeDoSection() {
  const [activeChapter, setActiveChapter] = useState(0)
  const chapterRefs = useRef([])

  useEffect(() => {
    // Only track active chapter in desktop sticky mode
    if (window.innerWidth < 1024) return

    const observers = []
    chapterRefs.current.forEach((el, index) => {
      if (!el) return
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              setActiveChapter(index)
            }
          })
        },
        {
          threshold: [0.5],
          rootMargin: '-10% 0px -40% 0px',
        }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [])

  return (
    <section className="w-full bg-[#F5F5F7] py-16 lg:py-28 text-[#1D1D1F] border-t border-[#D2D2D7]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20 space-y-4">
          <span className="text-[#0066CC] font-semibold text-xs tracking-wider uppercase">
            Proven Methodologies
          </span>
          <h2 className="bnc-section-heading text-[#1D1D1F]">
            What do we do?
          </h2>
          <p className="bnc-body-lead text-[#6E6E73] max-w-2xl mx-auto">
            At BNC Global, we don't just offer services — we deliver structured solutions that work in the real world. Our approach blends domain expertise, compliance-first thinking, and execution discipline to help businesses scale with confidence.
          </p>
        </div>

        {/* Two-Column Sticky Sequence Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Sticky Left Column: Corridor Image (Sticky on Desktop >= 1024px) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col items-center">
            <div className="w-full max-w-[460px] aspect-square rounded-[18px] overflow-hidden bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-[#D2D2D7]/50 p-3">
              <img
                src={corridorImg}
                alt="India–Saudi Business Corridor"
                loading="lazy"
                width={473}
                height={469}
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            {/* Visual chapter indicator for desktop sticky view */}
            <div className="hidden lg:flex items-center gap-2 mt-6">
              {CHAPTERS.map((ch, idx) => (
                <div
                  key={ch.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeChapter === idx
                      ? 'w-8 bg-[#0071E3]'
                      : 'w-2 bg-[#D2D2D7]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Scrolling Right Column: 3 Benefit Chapters */}
          <div className="lg:col-span-7 space-y-8 lg:space-y-12">
            {CHAPTERS.map((chapter, idx) => {
              const isCurrent = activeChapter === idx
              return (
                <div
                  key={chapter.id}
                  ref={(el) => (chapterRefs.current[idx] = el)}
                  className={`bnc-chapter-card p-8 rounded-[18px] bg-white border transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.06)] ${
                    isCurrent
                      ? 'border-[#0071E3]/40 shadow-[0_8px_24px_rgba(0,0,0,0.08)] opacity-100'
                      : 'border-[#D2D2D7]/60 lg:opacity-65 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F5F5F7] p-2 flex items-center justify-center flex-shrink-0 border border-[#D2D2D7]/40">
                      <img
                        src={chapter.icon}
                        alt=""
                        loading="lazy"
                        width={48}
                        height={48}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[12px] font-semibold text-[#0066CC] uppercase tracking-wide">
                        Chapter 0{idx + 1} • {chapter.subtitle}
                      </span>
                      <h3 className="bnc-title-md text-[#1D1D1F]">
                        {chapter.title}
                      </h3>
                      <p className="bnc-body-text text-[#6E6E73] leading-relaxed pt-1">
                        {chapter.desc}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Action Link: View Services */}
            <div className="pt-4 flex justify-start">
              <Link
                to="/bnc-global-services"
                className="bnc-btn-pill-primary focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none"
              >
                View Services &rarr;
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
