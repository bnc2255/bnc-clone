import { ArrowUpRight } from 'lucide-react'
import './about-founders.css'

const assets = '/about-founders/assets/'
const founders = [
  {
    id: 'gurvinder', name: 'CA Gurvinder Pal Singh', role: 'Co-Founder & Managing Director',
    avatar: 'avatar-gps.png', portrait: 'gurvinder-pal-singh.png', years: '21+', credential: 'SRSB', detail: 'ICAI Special Invitee',
    bio: 'Co-Founder & Managing Director of BNC Global, with 21+ years of experience spanning Big 4 consulting, enterprise risk management, internal audit, governance and business transformation. He has a proven track record of building consulting, outsourcing, GCC and staffing businesses, and of helping organisations improve performance through risk advisory, automation and strategic growth.',
  },
  {
    id: 'summit', name: 'CA Summit Goyal', role: 'Founder, India–Saudi Corridor',
    avatar: 'avatar-sg.png', portrait: 'summit-goyal.png', years: '18+', credential: 'AIR 50', detail: 'CA All India Rank',
    bio: 'Founder and business leader with 18+ years of consulting experience, leading BNC Global’s India–Saudi business corridor and international alliances. A Chartered Accountant and former KPMG consultant, he brings deep expertise in governance, enterprise risk, business transformation and cross-border market expansion.',
  },
]

export default function AboutFounders() {
  return (
    <div className="founders-page">
      <section className="founders-hero" aria-labelledby="founders-title">
        <div className="founders-copy">
          <p className="founders-eyebrow">The founders</p>
          <h1 id="founders-title"><span>Two founders, one proven track record,</span><br />built on <em>Big 4 discipline.</em></h1>
        </div>
        <div className="founders-photo"><img src={`${assets}founders-duo.png`} alt="CA Gurvinder Pal Singh and CA Summit Goyal, founders of BNC Global" fetchPriority="high" width="1015" height="901" /></div>
        <div className="founders-cards">
          {founders.map(founder => (
            <a key={founder.id} href={`#${founder.id}`} className="founder-card" aria-label={`View profile of ${founder.name}`}>
              <div className="founder-card-head">
                <img src={assets + founder.avatar} alt="" width="40" height="40" />
                <div><strong>{founder.name}</strong><span>{founder.role}</span></div>
              </div>
              <div className="founder-stats">
                <div><b>{founder.years}</b><span>Years of experience</span></div>
                <div><b>{founder.credential}</b><span>{founder.detail}</span></div>
                <ArrowUpRight size={28} aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>
      </section>
      {founders.map(founder => (
        <section key={founder.id} id={founder.id} className="founder-profile" aria-labelledby={`${founder.id}-name`}>
          <div className="founder-portrait"><img src={assets + founder.portrait} alt={founder.name} loading="lazy" width="800" height="900" /></div>
          <div className="founder-bio">
            <p className="founders-eyebrow">Meet the founder</p>
            <h2 id={`${founder.id}-name`}>{founder.name}</h2>
            <p className="founder-role">{founder.role}</p>
            <p>{founder.bio}</p>
            <div className="founder-profile-stats"><div><b>{founder.years}</b><span>Years of experience</span></div><div><b>{founder.credential}</b><span>{founder.detail}</span></div></div>
          </div>
        </section>
      ))}
    </div>
  )
}
