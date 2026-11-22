import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Pause, Play } from 'lucide-react'
import { Reveal, SplitHeading } from '../about/_shared/ui'
import reviewImage from '../../assets/reviewing_financial_reports.webp'

const videoUrl = 'https://bvvqyjqokvnttbgyjkrt.supabase.co/storage/v1/object/public/video_bnc.in/file.mp4'

export default function HomeHero({ isCoveredByModal }) {
  const videoRef = useRef(null)
  const reduce = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const [userPaused, setUserPaused] = useState(true)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isCoveredByModal || userPaused) video.pause()
    else video.play().catch(() => {})
  }, [isCoveredByModal, userPaused])
  const startVideo = () => {
    setUserPaused(false)
    videoRef.current?.play().catch(() => {})
    videoRef.current?.closest('.hm-video-shell')?.scrollIntoView({ block: 'center', behavior: reduce ? 'instant' : 'smooth' })
  }
  return (
    <section className="hm-hero" aria-labelledby="home-title">
      <div className="hm-hero-grid" aria-hidden="true" />
      <div className="hm-container hm-hero-layout">
        <div className="hm-hero-copy">
          <Reveal><span className="hm-hero-badge"><span aria-hidden="true" />Clarity. Compliance. Confidence.</span></Reveal>
          <h1 id="home-title"><SplitHeading as="span" className="hm-title-light">Expertise for your business.</SplitHeading>{' '}<SplitHeading as="span" className="hm-title-bold"><b className="ob-shine">Confidence for what’s next.</b></SplitHeading></h1>
          <Reveal delay={0.1}><p className="ob-lead">BNC Global provides outsourced accounting, bookkeeping, payroll, tax support and virtual CFO services.</p></Reveal>
          <Reveal delay={0.2} className="hm-actions"><Link to="/bnc-global-services" className="ob-btn ob-btn-primary">Explore our services <ArrowUpRight size={17} aria-hidden="true" /></Link><button type="button" onClick={startVideo} className="hm-hero-secondary"><Play size={15} aria-hidden="true" />Watch our introduction</button></Reveal>
        </div>
        <Reveal delay={0.25} className="hm-hero-media">
          <div className="hm-video-shell">
            <video ref={videoRef} width="1920" height="1080" src={videoUrl} poster={reviewImage} preload="metadata" loop muted playsInline onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="Introduction to BNC Global" />
            <button type="button" className={`hm-video-toggle ${playing ? 'is-playing' : ''}`} aria-label={playing ? 'Pause introduction video' : 'Play introduction video'} onClick={() => { const video = videoRef.current; if (!video) return; if (video.paused) { setUserPaused(false); video.play().catch(() => {}); } else { setUserPaused(true); video.pause(); } }}>{playing ? <Pause size={18} aria-hidden="true" /> : <Play size={30} fill="currentColor" strokeWidth={1.4} aria-hidden="true" />}</button>
          </div>
          <p className="hm-video-caption"><span>A closer look at BNC Global</span><span>Clarity. Compliance. Confidence.</span></p>
        </Reveal>
      </div>
    </section>
  )
}
