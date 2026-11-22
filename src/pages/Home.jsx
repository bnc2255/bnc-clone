import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem, SplitHeading } from './about/_shared/ui'
import HomeHero from './home-redesign/HomeHero'
import BusinessChallenges from './home-redesign/BusinessChallenges'
import HomeFaq from './home-redesign/HomeFaq'
import DpdpaModal from './home/DpdpaModal'
import { CHAPTERS, SERVICES } from './home-redesign/content'
import corridorImage from '../assets/india_saudi_corridor.webp'
import './about/partner-baseline.css'
import './about/onboarding-styles.css'
import './home-redesign/home.css'

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <div className="ob hm-page">
      <HomeHero isCoveredByModal={modalOpen} />
      <section className="hm-section hm-container" id="home-approach" aria-labelledby="home-approach-title">
        <div className="hm-section-heading"><Reveal><span className="ob-eyebrow">What do we do?</span></Reveal><SplitHeading className="ob-h2"><span id="home-approach-title">Expertise that connects.<br /><b>Solutions that work.</b></span></SplitHeading><Reveal><p className="ob-lead">At BNC Global, we don't just offer services — we deliver structured solutions that work in the real world. Our approach blends domain expertise, compliance-first thinking, and execution discipline to help businesses scale with confidence.</p></Reveal></div>
        <div className="hm-approach-layout">
          <Reveal className="hm-approach-photo"><img src={corridorImage} alt="BNC Global business support: financial professionals reviewing plans" width="1200" height="1200" loading="lazy" /><div><span>Your business comes first.</span><strong>Our expertise comes together.</strong></div></Reveal>
          <div className="hm-approach-chapters">{CHAPTERS.map(chapter => <Reveal key={chapter.id} y={28}><section aria-labelledby={`home-${chapter.id}`}><img src={chapter.icon} alt="" width="48" height="48" loading="lazy" /><div><h3 id={`home-${chapter.id}`}>{chapter.title}</h3><p>{chapter.desc}</p></div></section></Reveal>)}<Reveal><Link className="hm-text-link" to="/bnc-global-services">View all services <ArrowUpRight size={17} aria-hidden="true" /></Link></Reveal></div>
        </div>
      </section>
      <section className="hm-services" aria-labelledby="home-services-title"><div className="hm-container"><div className="hm-section-heading"><Reveal><span className="ob-eyebrow">Our services</span></Reveal><SplitHeading className="ob-h2"><span id="home-services-title">The support you need.<br /><b>One coordinated team.</b></span></SplitHeading><Reveal><p className="ob-lead">Businesses can engage the team for operational finance support and strategic financial guidance, with scope agreed around their requirements.</p></Reveal></div><RevealGroup className="hm-service-list">{SERVICES.map(service => <RevealItem key={service.path}><Link to={service.path}><div><h3>{service.name}</h3><p>{service.detail}</p></div><ArrowUpRight size={22} aria-hidden="true" /></Link></RevealItem>)}</RevealGroup></div></section>
      <BusinessChallenges isCoveredByModal={modalOpen} />
      <HomeFaq />
      <section className="hm-contact" aria-labelledby="home-contact-title"><div className="hm-container"><Reveal><span className="ob-eyebrow">Your next chapter</span></Reveal><SplitHeading className="ob-h2"><span id="home-contact-title">Let’s move your<br /><b>business forward.</b></span></SplitHeading><Reveal><p>Tell us where you are today and what you want to achieve. We’ll help you find the right support.</p><Link to="/contact" className="ob-btn">Speak with our team <ArrowUpRight size={17} aria-hidden="true" /></Link></Reveal></div></section>
      <DpdpaModal onVisibilityChange={setModalOpen} />
    </div>
  )
}
