import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUpRight, Check, CheckCheck, Compass, ShieldCheck } from 'lucide-react'
import { Glass, Reveal, RevealGroup, RevealItem, SplitHeading } from './about/_shared/ui'
import HeroBackdrop from './about/company/components/HeroBackdrop'
import FrameworkTabs from './virtual-cfo/FrameworkTabs'
import { capabilities, challenges, reasons, risks, value } from './virtual-cfo/content'
import corridorImg from '../assets/india_saudi_corridor.webp'
import cfoChallenges from '../assets/cfo_challenges.png'
import cfoRisks from '../assets/cfo_risks.webp'
import './about/partner-baseline.css'
import './about/onboarding-styles.css'
import './virtual-cfo/virtual-cfo.css'

function SectionHeading({ eyebrow, children, description }) {
  return (
    <div className="vcfo-section-heading">
      <Reveal><span className="ob-eyebrow">{eyebrow}</span></Reveal>
      <SplitHeading className="ob-h2">{children}</SplitHeading>
      {description && <Reveal><p className="ob-lead">{description}</p></Reveal>}
    </div>
  )
}

export default function VirtualCFO() {
  return (
    <div className="ob vcfo-page">
      <section className="vcfo-hero" aria-labelledby="cfo-title">
        <HeroBackdrop />
        <div className="vcfo-container vcfo-hero-layout">
          <div className="vcfo-hero-copy">
            <Reveal><span className="ob-eyebrow">The Virtual CFO network</span></Reveal>
            <h1 id="cfo-title">
              <SplitHeading as="span" className="vcfo-title-light">Virtual CFO services.</SplitHeading>{' '}
              <SplitHeading as="span" className="vcfo-title-bold"><b>Clarity for your <span className="ob-shine">next move.</span></b></SplitHeading>
            </h1>
            <Reveal delay={0.12}><p className="ob-lead vcfo-hero-description">We have a Pan-India network of experienced Virtual CFOs, providing strategic financial leadership without the cost of a full-time, in-house CFO.</p></Reveal>
            <Reveal delay={0.2} className="vcfo-actions">
              <Link to="/contact" className="ob-btn ob-btn-primary">Speak with our team <ArrowUpRight size={17} aria-hidden="true" /></Link>
              <a href="#cfo-capabilities" className="vcfo-explore">Explore our capabilities <ArrowDown size={16} className="ob-arrow-bob" aria-hidden="true" /></a>
            </Reveal>
            <Reveal delay={0.3}><p className="vcfo-hero-note">Financial guidance. Better control. Informed decisions.</p></Reveal>
          </div>
          <Reveal delay={0.15} className="vcfo-hero-visual">
            <div className="vcfo-photo-frame"><img src={corridorImg} alt="Financial professionals reviewing business plans together" width="1200" height="1200" fetchPriority="high" /></div>
            <Glass tint className="ob-diag-l ob-card-shine vcfo-photo-caption"><span className="vcfo-caption-icon"><Compass size={23} aria-hidden="true" /></span><div><strong>Financial leadership.</strong><span>Built around your business.</span></div><span className="vcfo-caption-dot" aria-hidden="true" /></Glass>
            <span className="vcfo-image-label">A partner in every stage of growth</span>
          </Reveal>
        </div>
        <div className="vcfo-container">
          <RevealGroup className="vcfo-hero-rail">
            {[{ icon: Compass, title: 'Strategic direction', text: 'Plan the next chapter.' }, { icon: ShieldCheck, title: 'Financial control', text: 'Build a stronger foundation.' }, { icon: CheckCheck, title: 'Hands-on support', text: 'Turn decisions into action.' }].map(({ icon: Icon, title, text }) => <RevealItem key={title}><div className="vcfo-rail-item"><Icon size={22} aria-hidden="true" /><div><strong>{title}</strong><span>{text}</span></div></div></RevealItem>)}
          </RevealGroup>
        </div>
      </section>

      <section className="vcfo-section vcfo-container" aria-labelledby="cfo-why-title">
        <SectionHeading eyebrow="Why a Virtual CFO" description="Our Virtual CFO services support businesses — especially in early and growth stages — by addressing financial management, reporting frameworks, statutory compliance, and strategic capital allocation."><span id="cfo-why-title">The right expertise.<br /><b>At the stage you need it.</b></span></SectionHeading>
        <RevealGroup className="vcfo-reason-grid">
          {reasons.map((reason, index) => <RevealItem key={reason.title}><Glass tint hover className={`vcfo-reason ob-card-shine ${index % 2 ? 'ob-diag-r' : 'ob-diag-l'}`} style={{ '--shine-delay': `${2 + index * 0.3}s` }}><img src={reason.image} alt="" width="47" height="57" loading="lazy" /><h3>{reason.title}</h3><p>{reason.text}</p></Glass></RevealItem>)}
        </RevealGroup>
      </section>

      <section className="vcfo-section vcfo-challenges" aria-labelledby="cfo-challenges-title">
        <div className="vcfo-container vcfo-challenge-layout">
          <div>
            <SectionHeading eyebrow="The challenges" description="Common organizational challenges in the Indian environment, with some exceptions."><span id="cfo-challenges-title">Growth brings complexity.<br /><b>Give it direction.</b></span></SectionHeading>
            <RevealGroup className="vcfo-challenge-list">{challenges.map(challenge => <RevealItem key={challenge}><div><span className="vcfo-list-mark" aria-hidden="true" /><p>{challenge}</p></div></RevealItem>)}</RevealGroup>
            <Reveal><p className="vcfo-small-note">Without Virtual CFO support, businesses face higher financial and strategic risks.</p></Reveal>
          </div>
          <Reveal className="vcfo-hierarchy"><img src={cfoChallenges} alt="Financial support hierarchy: bookkeeping for day-to-day operations, controllership for reporting, and CFO leadership for strategy, planning, stakeholder management, and fundraising" width="1449" height="975" loading="lazy" /></Reveal>
        </div>
      </section>

      <section className="vcfo-section vcfo-container vcfo-risk-layout" aria-labelledby="cfo-risks-title">
        <Reveal className="vcfo-risk-photo"><img src={cfoRisks} alt="A business leader presenting a strategy to a team" width="1920" height="1280" loading="lazy" /><div><span>Stronger foundations.</span><strong>Better decisions.</strong></div></Reveal>
        <div>
          <SectionHeading eyebrow="The cost of waiting" description="Organizations without a CFO on their board or those needing support for the CFO office are susceptible to significant risks if they do not engage a Virtual CFO at the appropriate stage and moment."><span id="cfo-risks-title">Don’t let financial gaps<br /><b>become business risks.</b></span></SectionHeading>
          <RevealGroup className="vcfo-risk-list">{risks.map(risk => <RevealItem key={risk}><div><Check size={17} aria-hidden="true" /><span>{risk}</span></div></RevealItem>)}</RevealGroup>
          <Reveal><p className="vcfo-small-note">Timely Virtual CFO support helps prevent these challenges.</p></Reveal>
        </div>
      </section>

      <section className="vcfo-value" aria-labelledby="cfo-value-title">
        <div className="vcfo-container vcfo-value-layout">
          <div><Reveal><span className="ob-eyebrow">Enhancing value</span></Reveal><SplitHeading className="ob-h2"><span id="cfo-value-title">More than advice.<br /><b>A partner in execution.</b></span></SplitHeading><Reveal><p>Enhancing value with a Virtual CFO means combining financial leadership with practical, hands-on support for your business.</p></Reveal><Reveal className="vcfo-value-photo"><img src={corridorImg} alt="Business advisors working through financial plans" width="1200" height="1200" loading="lazy" /></Reveal></div>
          <RevealGroup className="vcfo-value-list">{value.map(item => <RevealItem key={item}><div><Check size={18} aria-hidden="true" /><p>{item}</p></div></RevealItem>)}</RevealGroup>
        </div>
      </section>

      <section className="vcfo-section vcfo-container" aria-labelledby="cfo-framework-title">
        <SectionHeading eyebrow="How it comes together" description="Explore the fundamentals, ecosystem, delivery structure, methodology, and breadth of the Virtual CFO role."><span id="cfo-framework-title">One connected finance function.<br /><b>A framework for every stage.</b></span></SectionHeading>
        <Reveal><FrameworkTabs /></Reveal>
      </section>

      <section id="cfo-capabilities" className="vcfo-section vcfo-capabilities" aria-labelledby="cfo-capabilities-title">
        <div className="vcfo-container">
          <SectionHeading eyebrow="Virtual CFO capability checklist" description="Explore specific financial support models tailored for your enterprise growth."><span id="cfo-capabilities-title">Start with what you need.<br /><b>Build from there.</b></span></SectionHeading>
          <RevealGroup className="vcfo-capability-grid">{capabilities.map((service, index) => <RevealItem key={service.name}><Glass hover className={index % 2 ? 'ob-diag-r' : 'ob-diag-l'}><Link to={service.path}><span>{service.name}</span><ArrowUpRight size={20} aria-hidden="true" /></Link></Glass></RevealItem>)}</RevealGroup>
        </div>
      </section>

      <section className="vcfo-section vcfo-container vcfo-faq-layout" aria-labelledby="cfo-faq-title">
        <SectionHeading eyebrow="A little more clarity"><span id="cfo-faq-title">Before we begin.<br /><b>Your questions, answered.</b></span></SectionHeading>
        <Reveal className="vcfo-faq">
          <details><summary>What do Virtual CFO services cover?</summary><p>Our Pan-India network of experienced Virtual CFOs provides strategic financial leadership, financial management, reporting frameworks, statutory compliance, and strategic capital allocation without the cost of a full-time, in-house CFO.</p></details>
          <details><summary>What information should we share before discussing scope?</summary><p>Tell us about your business, operating locations, existing finance systems, and the work you need support with. Share sensitive records only through a channel agreed with the team.</p></details>
          <details><summary>How do we confirm fees and timing?</summary><p><Link to="/contact">Contact BNC Global</Link> to discuss your requirements and agree on scope, deliverables, fees, and timing before an engagement starts.</p></details>
        </Reveal>
      </section>

      <section className="vcfo-contact" aria-labelledby="cfo-contact-title"><div className="vcfo-container"><Reveal><span className="ob-eyebrow">Your next move</span></Reveal><SplitHeading className="ob-h2"><span id="cfo-contact-title">Let’s give your business<br /><b>financial direction.</b></span></SplitHeading><Reveal><p>Get expert financial guidance, better control, and data-driven decision-making — anywhere in India.</p><Link to="/contact" className="ob-btn">Connect with our team <ArrowUpRight size={17} aria-hidden="true" /></Link></Reveal></div></section>
    </div>
  )
}
