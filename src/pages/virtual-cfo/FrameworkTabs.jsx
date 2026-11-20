import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { Glass } from '../about/_shared/ui'
import { frameworks } from './content'

export default function FrameworkTabs() {
  const [selected, setSelected] = useState(0)
  const tabs = useRef([])
  const reduce = useReducedMotion()
  const select = (index, focus = false) => {
    setSelected(index)
    if (focus) {
      tabs.current[index]?.focus({ preventScroll: true })
      tabs.current[index]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'instant' : 'smooth' })
    }
  }
  const onKeyDown = event => {
    const keys = { ArrowRight: (selected + 1) % frameworks.length, ArrowLeft: (selected + frameworks.length - 1) % frameworks.length, Home: 0, End: frameworks.length - 1 }
    if (keys[event.key] === undefined) return
    event.preventDefault()
    select(keys[event.key], true)
  }
  return (
    <div className="vcfo-framework">
      <div className="vcfo-tabs" role="tablist" aria-label="Virtual CFO service frameworks" onKeyDown={onKeyDown}>
        {frameworks.map((framework, index) => (
          <button key={framework.id} ref={node => { tabs.current[index] = node }} type="button" role="tab" id={`cfo-tab-${framework.id}`} aria-controls={`cfo-panel-${framework.id}`} aria-selected={index === selected} tabIndex={index === selected ? 0 : -1} onClick={() => select(index)}>
            {index === selected && <motion.span className="vcfo-tab-indicator" layoutId="cfo-framework-tab" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }} />}
            <span>{framework.label}</span>
          </button>
        ))}
      </div>
      <Glass className="ob-diag-r vcfo-framework-card">
        {frameworks.map((current, index) => (
          <motion.div key={current.id} role="tabpanel" id={`cfo-panel-${current.id}`} aria-labelledby={`cfo-tab-${current.id}`} tabIndex={index === selected ? 0 : -1} hidden={index !== selected} initial={false} animate={index === selected || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ duration: reduce ? 0 : 0.22 }} className="vcfo-framework-panel">
            <div className="vcfo-framework-copy">
              <span className="ob-eyebrow">The service framework</span>
              <h3>{current.title}</h3>
              <p>{current.text}</p>
              <ul>{current.points.map(point => <li key={point}><Check size={17} aria-hidden="true" /><span>{point}</span></li>)}</ul>
              <a className="vcfo-diagram-link" href={current.image} target="_blank" rel="noopener noreferrer">View full-size diagram <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
            <figure className="vcfo-framework-image"><img src={current.image} alt={current.alt} /></figure>
          </motion.div>
        ))}
      </Glass>
    </div>
  )
}
