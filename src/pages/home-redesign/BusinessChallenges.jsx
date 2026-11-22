import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react'
import { Counter, Reveal, SplitHeading } from '../about/_shared/ui'
import reviewImage from '../../assets/reviewing_financial_reports.webp'
import { SLIDES } from './content'

export default function BusinessChallenges({ isCoveredByModal }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(document.hidden)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reduce = useReducedMotion()
  const auto = !reduce && !paused && !hovered && !focused && !hidden && inView && !isCoveredByModal
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])
  useEffect(() => {
    if (!auto) return
    const interval = setInterval(() => setCurrent(value => (value + 1) % SLIDES.length), 8000)
    return () => clearInterval(interval)
  }, [auto])
  const slide = SLIDES[current]
  const percentage = Number(slide.desc.match(/^\d+/)?.[0])
  return (
    <section ref={ref} className="hm-challenges" aria-label="Business challenges" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
      <img className="hm-challenge-background" src={reviewImage} alt="" loading="lazy" />
      <div className="hm-container hm-challenge-layout">
        <div className="hm-challenge-intro"><Reveal><span className="ob-eyebrow">The business landscape</span></Reveal><SplitHeading className="ob-h2">Change is constant.<br /><b>Clarity makes the difference.</b></SplitHeading><Reveal><p>Every stage of growth brings new questions. We help you navigate the financial, operational, and regulatory challenges ahead.</p><div className="hm-challenge-links"><Link to="/about/company">About us <ArrowUpRight size={15} aria-hidden="true" /></Link><Link to="/careers">Careers <ArrowUpRight size={15} aria-hidden="true" /></Link></div></Reveal></div>
        <div className="hm-challenge-content">
          <div className="hm-challenge-slide" aria-live={auto ? 'off' : 'polite'} aria-atomic="true">
            <motion.div key={current} initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.4 }}>
              <div className="hm-challenge-percentage"><Counter to={percentage} suffix="%" /></div>
              <h3>{slide.title}</h3><p>{slide.desc.replace(/^\d+%\s*/, '')}</p>
            </motion.div>
          </div>
          <div className="hm-carousel-controls"><div className="hm-carousel-dots">{SLIDES.map((item, index) => <button type="button" key={item.title} aria-label={`Show challenge: ${item.title}`} aria-pressed={current === index} onClick={() => setCurrent(index)}><span /></button>)}</div><div className="hm-carousel-arrows"><button type="button" aria-label={paused ? 'Resume automatic challenge slides' : 'Pause automatic challenge slides'} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button><button type="button" aria-label="Previous challenge" onClick={() => setCurrent(value => (value + SLIDES.length - 1) % SLIDES.length)}><ArrowLeft size={18} aria-hidden="true" /></button><button type="button" aria-label="Next challenge" onClick={() => setCurrent(value => (value + 1) % SLIDES.length)}><ArrowRight size={18} aria-hidden="true" /></button></div></div>
        </div>
      </div>
    </section>
  )
}
