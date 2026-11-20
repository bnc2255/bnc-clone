import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

const FAQ_DATA = {
  setup: [
    {
      q: 'What is BNC Global?',
      a: 'BNC Global is a professional corporate consultation and financial operations group. We deliver boardroom-ready Virtual CFO support, outsourced bookkeeping, payroll, and corporate tax compliance services designed for modern enterprises.',
    },
    {
      q: 'What is start up ecosystem? and how can I benefit from it?',
      a: 'BNC Global is a finance consulting and outsourcing company. We are working with clients in India region as well as in UAE area. We also provide Manpower on temporary and permanent basis to Big 4s and top 15 consulting company, CA firms and corporates in India and UAE.',
    },
    {
      q: 'What is recruitment Ecosystem? How can I gain from it?',
      a: 'The recruitment ecosystem is our pipeline connecting qualified Chartered Accountants, financial analysts, and corporate tax advisors with growing firms. Job seekers get access to prime career-track hybrid roles.',
    },
    {
      q: 'I am working in a company, how can BNC help me?',
      a: 'We serve as an extension of your internal finance department, handling labor-intensive tasks like bank reconciliations, audit schedule preparation, VAT/GST filings, and monthly ledger closings.',
    },
    {
      q: 'What kind of consulting is provided by BNC?',
      a: 'We provide specialized strategic consulting in Virtual CFO support, working capital optimization, cash-flow forecasting, risk mitigation, and corporate restructuring.',
    },
  ],
  general: [
    {
      q: 'What software platforms does BNC support?',
      a: 'We are certified partners and experts in QuickBooks Online, Xero, Zoho Books, NetSuite, Hubdoc, and standard payroll ledgers.',
    },
    {
      q: 'How secure is our financial data?',
      a: 'We implement industry-grade ISO compliance, restricted cloud databases, and enforce strict Non-Disclosure Agreements (NDAs) across all advisory members.',
    },
  ],
}

export default function FaqSection() {
  const [activeTab, setActiveTab] = useState('setup')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleFaq = (idx) => {
    setExpandedFaq((prev) => (prev === idx ? null : idx))
  }

  const currentFaqs = FAQ_DATA[activeTab].filter((item) => {
    const query = searchQuery.toLowerCase()
    return item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query)
  })

  return (
    <section className="w-full bg-[#FFFFFF] py-16 lg:py-28 text-[#1D1D1F] border-t border-[#D2D2D7]">
      <div className="max-w-[1200px] mx-auto px-6 space-y-12">

        {/* Header & Category Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D2D2D7]">
          <div className="space-y-4">
            <span className="text-[#0066CC] font-semibold text-xs tracking-wider uppercase">
              Frequently Asked Questions
            </span>
            <h2 className="bnc-section-heading text-[#1D1D1F]">
              Answers to Common Inquiries
            </h2>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('setup')
                  setExpandedFaq(null)
                }}
                className={`px-4 py-2 text-[14px] font-medium rounded-full transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none ${
                  activeTab === 'setup'
                    ? 'bg-[#0071E3] text-white shadow-xs'
                    : 'bg-[#F5F5F7] text-[#424245] hover:bg-[#E8E8ED]'
                }`}
              >
                Setting up FAQs
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('general')
                  setExpandedFaq(null)
                }}
                className={`px-4 py-2 text-[14px] font-medium rounded-full transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none ${
                  activeTab === 'general'
                    ? 'bg-[#0071E3] text-white shadow-xs'
                    : 'bg-[#F5F5F7] text-[#424245] hover:bg-[#E8E8ED]'
                }`}
              >
                General
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#86868B]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Looking for something?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#D2D2D7] bg-[#F5F5F7] text-[#1D1D1F] placeholder-[#86868B] text-[14px] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Accordion Questions List */}
        <div className="max-w-4xl mx-auto divide-y divide-[#D2D2D7]">
          {currentFaqs.length > 0 ? (
            currentFaqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx
              return (
                <div key={idx} className="py-5">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="flex justify-between items-center w-full text-left font-medium text-[18px] md:text-[20px] text-[#1D1D1F] hover:text-[#0066CC] transition-colors cursor-pointer py-2 focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none rounded-lg"
                  >
                    <span className="pr-4 leading-snug">{faq.q}</span>
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-[#0071E3] text-white' : 'text-[#6E6E73]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {/* 200ms Accordion Expansion */}
                  <div
                    className={`bnc-faq-content transition-all duration-200 ease-out ${
                      isOpen ? 'max-h-96 opacity-100 pt-3 pb-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="bnc-body-text text-[#6E6E73] leading-relaxed pl-1 max-w-3xl">
                      {faq.a}
                    </p>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-12 text-center text-[#6E6E73]">
              <p className="text-[16px]">No FAQ items matched your search query.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
