import iconAccounting from '../../assets/icon_accounting.webp'
import iconTax from '../../assets/icon_tax.webp'
import iconAdvisory from '../../assets/icon_advisory.png'

export const SLIDES = [
    {
      title: 'Resistance to change',
      desc: "95% of CEOs are concerned that resistance to change could hinder our organisation's ability to adapt our business model and core operations as needed.",
      showButtons: true,
      btn1Text: 'About Us',
      btn1Link: '/about/company',
      btn2Text: 'Career',
      btn2Link: '/careers'
    },
    {
      title: 'Security Controls',
      desc: '81% of CEOs find it challenging to manage security controls across remote or hybrid working architectures.',
      showButtons: false
    },
    {
      title: 'Regulatory Challenges',
      desc: '88% of CEOs recognise the need to adapt to changing regulatory frameworks and international tax guidelines.',
      showButtons: false
    },
    {
      title: 'Merger integration',
      desc: '89% of CEOs find merger integration is key to growth, but struggle to align financial operations post-transaction.',
      showButtons: false
    }
  ]

export const FAQ_DATA = {
    setup: [
      {
        q: 'What is BNC Global?',
        a: 'BNC Global is a professional corporate consultation and financial operations group. We deliver boardroom-ready Virtual CFO support, outsourced bookkeeping, payroll, and corporate tax compliance services designed for modern enterprises.'
      },
      {
        q: 'What is start up ecosystem? and how can I benefit from it?',
        a: 'BNC Global is a finance consulting and outsourcing company. We are working with clients in India region as well as in UAE area. We also provide Manpower on temporary and permanent basis to Big 4s and top 15 consulting company, CA firms and corporates in India and UAE.'
      },
      {
        q: 'What is recruitment Ecosystem? How can I gain from it?',
        a: 'The recruitment ecosystem is our pipeline connecting qualified Chartered Accountants, financial analysts, and corporate tax advisors with growing firms. Job seekers get access to prime career-track hybrid roles.'
      },
      {
        q: 'I am working in a company, how can BNC help me?',
        a: 'We serve as an extension of your internal finance department, handling labor-intensive tasks like bank reconciliations, audit schedule preparation, VAT/GST filings, and monthly ledger closings.'
      },
      {
        q: 'What kind of consulting is provided by BNC?',
        a: 'We provide specialized strategic consulting in Virtual CFO support, working capital optimization, cash-flow forecasting, risk mitigation, and corporate restructuring.'
      }
    ],
    general: [
      {
        q: 'What software platforms does BNC support?',
        a: 'We are certified partners and experts in QuickBooks Online, Xero, Zoho Books, NetSuite, Hubdoc, and standard payroll ledgers.'
      },
      {
        q: 'How secure is our financial data?',
        a: 'We implement industry-grade ISO compliance, restricted cloud databases, and enforce strict Non-Disclosure Agreements (NDAs) across all advisory members.'
      }
    ]
  }

export const CHAPTERS = [
  {
    id: 'integrated-expertise',
    icon: iconAccounting,
    title: 'Integrated Expertise Under One Roof',
    subtitle: 'Multidisciplinary Operations',
    desc: 'From accounting and tax to risk, ESG, cybersecurity, and hiring — our multidisciplinary teams work together to provide holistic business support, reducing vendor dependency and operational friction.',
  },
  {
    id: 'practical-implementation',
    icon: iconTax,
    title: 'Business-First, Not Theory-First',
    subtitle: 'Practical Execution',
    desc: 'We focus on practical implementation, not just advice. Every recommendation is designed to fit your business model, industry, and growth stage — ensuring measurable outcomes, not generic reports.',
  },
  {
    id: 'compliance-governance',
    icon: iconAdvisory,
    title: 'Compliance & Governance Focus',
    subtitle: 'Audit & Regulatory Readiness',
    desc: 'Regulatory adherence is built into everything we do. Our services are designed to keep you audit-ready, regulator-ready, and investor-ready at all times.',
  },
]

export const SERVICES = [
  { name: 'Finance & accounting', detail: 'Bookkeeping, reporting, and day-to-day finance operations.', path: '/accounting' },
  { name: 'Virtual CFO', detail: 'Strategic financial leadership for your next stage of growth.', path: '/virtual-cfo' },
  { name: 'Tax & compliance', detail: 'Tax preparation, statutory requirements, and corporate compliance.', path: '/income-tax-outsourcing' },
  { name: 'Risk & advisory', detail: 'Controls, business analysis, and financial decision support.', path: '/finance-advisory' },
  { name: 'Cybersecurity', detail: 'Security expertise to help protect your business and its information.', path: '/cybersecurity' },
  { name: 'Global capability centres', detail: 'Support for building and managing your GCC in India.', path: '/create-or-manage-your-gcc-in-india' },
]
