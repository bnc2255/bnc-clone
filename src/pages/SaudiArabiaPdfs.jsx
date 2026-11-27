import { Download } from 'lucide-react'

export default function SaudiArabiaPdfs() {
  return (
    <section className="bg-[#F2F3F5] px-6 py-16 text-[#0B2F5B] md:py-24">
      <div className="mx-auto max-w-[1122px]">
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-[44px]">
          Saudi Arabia PDFs
        </h1>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="font-display text-xl font-bold md:text-2xl">Saudi Arabia’s 2027 Budget</h2>
          <a
            href="/pdfs/saudi-arabias-2027-budget.pdf"
            download="Saudi Arabia’s 2027 Budget.pdf"
            aria-label="Download Saudi Arabia’s 2027 Budget PDF"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1D67CD] px-5 py-3 font-display font-semibold text-white transition-colors hover:bg-[#0B2F5B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D67CD]"
          >
            <Download size={20} aria-hidden="true" />
            Download PDF
          </a>
        </div>
      </div>
    </section>
  )
}
