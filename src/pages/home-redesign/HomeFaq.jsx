import { useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Reveal, SplitHeading } from '../about/_shared/ui'
import { FAQ_DATA } from './content'

const categories = [{ id: 'setup', name: 'Setting up FAQs' }, { id: 'general', name: 'General' }]

export default function HomeFaq() {
  const [category, setCategory] = useState('setup')
  const [query, setQuery] = useState('')
  const tabs = useRef([])
  const keyDown = event => {
    const current = categories.findIndex(item => item.id === category)
    const next = { ArrowRight: (current + 1) % categories.length, ArrowLeft: (current + categories.length - 1) % categories.length, Home: 0, End: categories.length - 1 }[event.key]
    if (next === undefined) return
    event.preventDefault()
    setCategory(categories[next].id)
    tabs.current[next]?.focus()
  }
  return (
    <section className="hm-section hm-container hm-faq-layout" aria-labelledby="home-faq-title">
      <div className="hm-section-heading"><Reveal><span className="ob-eyebrow">A little more clarity</span></Reveal><SplitHeading className="ob-h2"><span id="home-faq-title">Frequently asked<br /><b>questions.</b></span></SplitHeading><Reveal><p className="ob-lead">Get to know BNC Global and how we can support your business.</p></Reveal></div>
      <Reveal className="hm-faq-content">
        <div className="hm-faq-tools"><div role="tablist" aria-label="FAQ categories" onKeyDown={keyDown} className="hm-faq-tabs">{categories.map((item, index) => <button type="button" role="tab" key={item.id} ref={node => { tabs.current[index] = node }} id={`home-faq-tab-${item.id}`} aria-controls={`home-faq-panel-${item.id}`} aria-selected={category === item.id} tabIndex={category === item.id ? 0 : -1} onClick={() => setCategory(item.id)}>{item.name}</button>)}</div><label className="hm-faq-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search frequently asked questions</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find your question" />{query && <button type="button" aria-label="Clear FAQ search" onClick={() => setQuery('')}><X size={15} aria-hidden="true" /></button>}</label></div>
        {categories.map(item => {
          const filtered = FAQ_DATA[item.id].filter(faq => `${faq.q} ${faq.a}`.toLowerCase().includes(query.trim().toLowerCase()))
          return <div key={item.id} role="tabpanel" id={`home-faq-panel-${item.id}`} aria-labelledby={`home-faq-tab-${item.id}`} hidden={category !== item.id}>{filtered.length ? filtered.map(faq => <details name="home-faq" key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>) : <div className="hm-faq-empty" role="status"><p>No questions match “{query}”.</p><button type="button" onClick={() => setQuery('')}>Clear search</button></div>}</div>
        })}
      </Reveal>
    </section>
  )
}
