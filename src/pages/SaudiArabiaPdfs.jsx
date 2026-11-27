import { Download } from 'lucide-react'

const documents = [
  { title: 'Saudi Arabia’s 2027 Budget', slug: 'saudi-arabias-2027-budget' },
  {
    title: 'Company Incorporation and Business Setup in Oman',
    slug: 'company-incorporation-and-business-setup-in-oman',
  },
]

export default function SaudiArabiaPdfs() {
  return (
    <section className="bg-[#F2F3F5] px-6 py-16 text-[#0B2F5B] md:py-24">
      <div className="mx-auto max-w-[1122px]">
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-[44px]">
          Saudi Arabia PDFs
        </h1>
        <ul className="mt-8 space-y-4">
          {documents.map(({ title, slug }) => (
            <li key={slug} className="flex flex-wrap items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white p-6 md:p-8">
              <h2 className="font-display text-xl font-bold md:text-2xl">{title}</h2>
              <a
                href={`/pdfs/${slug}.pdf`}
                download={`${title}.pdf`}
                aria-label={`Download ${title} PDF`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1D67CD] px-5 py-3 font-display font-semibold text-white transition-colors hover:bg-[#0B2F5B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D67CD]"
              >
                <Download size={20} aria-hidden="true" />
                Download PDF
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
