import { ArrowUpRight, Check } from 'lucide-react'
import { Reveal } from '../about/_shared/ui'
import { frameworks } from './content'

export default function FrameworkSections() {
  return (
    <div className="vcfo-framework">
      {frameworks.map(current => (
        <section key={current.id} id={`cfo-framework-${current.id}`} aria-labelledby={`cfo-framework-${current.id}-title`} className="vcfo-framework-panel">
          <Reveal y={28} className="vcfo-framework-copy">
            <span className="ob-eyebrow">{current.label}</span>
            <h3 id={`cfo-framework-${current.id}-title`}>{current.title}</h3>
            <p>{current.text}</p>
            <ul>{current.points.map(point => <li key={point}><Check size={17} aria-hidden="true" /><span>{point}</span></li>)}</ul>
            <a className="vcfo-diagram-link" href={current.image} target="_blank" rel="noopener noreferrer">View full-size diagram <ArrowUpRight size={16} aria-hidden="true" /></a>
          </Reveal>
          <Reveal y={32} delay={0.18} className="vcfo-framework-media">
            <figure className="vcfo-framework-image"><img src={current.image} alt={current.alt} width={current.width} height={current.height} loading="lazy" /></figure>
          </Reveal>
        </section>
      ))}
    </div>
  )
}
