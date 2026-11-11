import { Linkedin } from 'lucide-react'
import imgSummit from '../assets/team_summit_reference.jpeg'
import imgGurvinder from '../assets/team_gurvinder_reference.jpeg'
import imgPraveen from '../assets/team_praveen_reference.jpeg'
import imgKarandeep from '../assets/team_karandeep_reference.jpeg'
import imgAnwar from '../assets/team_anwar_reference.jpeg'
import imgPankhuri from '../assets/team_pankhuri_reference.jpeg'
import imgRaghav from '../assets/team_raghav_reference.jpeg'

const members = [
  {
    name: 'Summit Goyal',
    role: 'Founder & Global Head',
    expertise: ['Internal Audit, ERM', 'SOP, SOX, ICFR', 'IT Audits / Data Analytics'],
    img: imgSummit,
    linkedin: 'https://www.linkedin.com/in/summit-goyal-00457a23/',
  },
  {
    name: 'Gurvinder Singh',
    role: 'Co-Founder',
    expertise: ['Risk Consulting', 'Process Automation', 'Regulatory & Compliance'],
    img: imgGurvinder,
    linkedin: 'https://www.linkedin.com/in/gurvinder-singh-338565a/',
  },
  {
    name: 'Praveen Ladha',
    role: 'KSA Practice Head',
    expertise: ['Retail & Digital Banking', 'Transformation & Strategic Consulting'],
    img: imgPraveen,
    linkedin: 'https://www.linkedin.com/in/praveenladha/',
  },
  {
    name: 'Karandeep Singh',
    role: 'GCC & CFO Practice',
    expertise: ['Consumer Tech: Flipkart, Simplilearn, KPMG CFOs', 'Retail & GCCs: Tesco Business Services CFO', 'Gaming & Esports'],
    img: imgKarandeep,
    linkedin: 'https://www.linkedin.com/in/kdsttb/',
  },
  {
    name: 'Anwar Akhtar',
    role: 'Cybersecurity Practice Head',
    expertise: ['GRC, DPDPA Implementation', 'CISA, CISM, ISO 27001 Lead Auditor', 'GDPR, HIPAA, PCI DSS'],
    img: imgAnwar,
    linkedin: 'https://www.linkedin.com/in/anwarakhtar-62a3b218/',
  },
  {
    name: 'Pankhuri Jain',
    role: 'Climate Change Advisory',
    expertise: ['Cross-Sector Expertise', 'Sustainability Focus', 'Collaborative Approach'],
    img: imgPankhuri,
    linkedin: 'https://www.linkedin.com/in/pankhuri-jain-2b115a159/',
  },
  {
    name: 'Raghav Aggarwal',
    role: 'Direct Tax, Value Tax & Insolvency',
    expertise: ['Foundations of compliance', 'Partners in growth'],
    img: imgRaghav,
  },
]

export default function MeetOurTeam() {
  return (
    <main className="bg-white text-slate-800 antialiased font-sans">
      <section className="bg-gradient-to-br from-[#00305B] to-[#0A2F5B] px-4 py-16 text-center text-white md:py-20">
        <div className="mx-auto max-w-4xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A3D9F6]">Team Profile</p>
          <h1 className="font-display text-3xl font-extrabold md:text-5xl">Meet Our Team</h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#BFD9ED] md:text-lg">
            Experienced leaders across risk, finance, tax, cybersecurity, and sustainability.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member, index) => (
            <article key={member.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
              <div className="aspect-[4/3] overflow-hidden border-b border-[#1D67CD] bg-slate-50">
                <img src={member.img} alt={member.name} className={`h-full w-full object-cover object-top ${index < 3 ? 'origin-top scale-[1.3]' : ''}`} />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl font-extrabold uppercase tracking-wide text-[#00305B]">{member.name}</h2>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      title={`${member.name} on LinkedIn`}
                      className="mt-0.5 shrink-0 rounded-md p-1 text-[#0A66C2] transition-colors hover:bg-blue-50 hover:text-[#004182] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A66C2]"
                    >
                      <Linkedin className="h-5 w-5" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <p className="mt-2 min-h-12 text-base font-medium leading-snug text-[#1D67CD]">{member.role}</p>
                <div className="mt-4 text-sm leading-relaxed text-slate-600">
                  <p className="font-bold text-slate-700">Expertise:</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {member.expertise.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
