import { useState } from 'react'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import './saudi-budget.css'

const fiscalYears = [
  { year: 2024, status: 'Actual', revenue: 1259, spending: 1375, balance: -116, gdp: 4649, tax: 381, other: 879, debt: 1216, debtShare: 26.2, deficitShare: 2.5, reserves: 390, capex: 191, sectors: [228, 237, 273, 204, 127, 93, 116, 54, 44] },
  { year: 2025, status: 'Actual', revenue: 1112, spending: 1388, balance: -277, gdp: 4776, tax: 389, other: 723, debt: 1519, debtShare: 31.8, deficitShare: 5.8, reserves: 399, capex: 169, sectors: [236, 249, 279, 212, 127, 92, 92, 58, 42] },
  { year: 2026, status: 'Estimate', revenue: 1191, spending: 1436, balance: -245, gdp: 5026, tax: 397, other: 794, debt: 1733, debtShare: 34.5, deficitShare: 4.9, reserves: 399, capex: 182, sectors: [256, 254, 304, 205, 130, 103, 83, 59, 41] },
  { year: 2027, status: 'Budget', revenue: 1202, spending: 1392, balance: -191, gdp: 5364, tax: 414, other: 787, debt: 1923, debtShare: 35.9, deficitShare: 3.6, reserves: 399, capex: 178, sectors: [272, 263, 256, 195, 118, 98, 93, 58, 38] },
]

const sectorNames = [
  'General items', 'Military', 'Health and social development', 'Education',
  'Security and regional administrations', 'Economic resources', 'Municipal services',
  'Public administration', 'Infrastructure and transportation',
]

const series = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'spending', label: 'Expenditure' },
]
const format = new Intl.NumberFormat('en', { maximumFractionDigits: 1 })
const amount = (value) => format.format(value)
const share = (part, total) => (part / total) * 100
const budgetStatement = 'https://www.mof.gov.sa/documents/d/group-328541/bud-2027-eng-final?download=true'
const performanceReport = 'https://www.mof.gov.sa/documents/328541/438613/END-Bud%2B2024%2BEng%2B290625%2BFINAL.pdf/b00f71b9-3e1b-c121-0813-e9e1d7b92118?t=1792067371272'

function FiscalTrend({ selectedYear }) {
  return (
    <section className="budget-panel" aria-labelledby="budget-trend">
      <h2 id="budget-trend">Revenue and expenditure</h2>
      <p className="budget-muted">2024–2027 comparison in SAR billion</p>
      <div className="budget-legend">
        {series.map(({ key, label }) => <span key={key} data-series={key}>{label}</span>)}
      </div>
      <ul className="budget-trend">
        {fiscalYears.map((period) => (
          <li key={period.year} className={period.year === selectedYear ? 'is-current' : ''}>
            <div className="budget-trend-year">
              <strong>{period.year}</strong><small>{period.status}</small>
            </div>
            <div className="budget-trend-pair">
              {series.map(({ key, label }) => (
                <div key={key} className="budget-trend-value" data-series={key}>
                  <span className="sr-only">{label}</span>
                  <span className="budget-bar" aria-hidden="true" style={{ width: `${share(period[key], 1500)}%` }} />
                  <strong>{amount(period[key])}</strong>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function SaudiArabiaPdfs() {
  const [selectedYear, setSelectedYear] = useState(2027)
  const fiscal = fiscalYears.find(({ year }) => year === selectedYear)
  const taxShare = share(fiscal.tax, fiscal.revenue)
  const sectors = sectorNames.map((name, index) => ({ name, value: fiscal.sectors[index] }))
    .sort((first, second) => second.value - first.value)
  const indicators = [
    ['Total revenue', fiscal.revenue],
    ['Total expenditure', fiscal.spending],
    ['Budget balance', fiscal.balance],
    ['Nominal GDP', fiscal.gdp],
  ]
  const ratios = [
    ['Budget deficit / GDP', fiscal.deficitShare, `Deficit of ${amount(-fiscal.balance)} SAR bn`],
    ['Public debt / GDP', fiscal.debtShare, `${amount(fiscal.debt)} SAR bn in public debt`],
    ['Government reserves / GDP', share(fiscal.reserves, fiscal.gdp), `${amount(fiscal.reserves)} SAR bn in reserves`],
    ['Capital expenditure / total spending', share(fiscal.capex, fiscal.spending), `${amount(fiscal.capex)} SAR bn in capital expenditure`],
  ]

  return (
    <div className="saudi-budget">
      <div className="budget-container">
        <header className="budget-hero">
          <div>
            <Link className="budget-back" to="/countries-we-serve/saudi-arabia">
              <ArrowLeft size={17} aria-hidden="true" /> Saudi Arabia
            </Link>
            <h1>Saudi Arabia Budget Dashboard</h1>
            <p>Explore public finances from the 2024 actuals through the 2027 budget.</p>
          </div>
          <a className="budget-download" href="/pdfs/bnc-budget-publication-2027.pdf" download="BNC Budget Publication 2027.pdf">
            <Download size={20} aria-hidden="true" /> Download Complete Brief
          </a>
        </header>

        <fieldset className="budget-years">
          <legend>Fiscal year</legend>
          {[...fiscalYears].reverse().map(({ year, status }) => (
            <label key={year}>
              <input type="radio" name="budget-year" value={year} checked={selectedYear === year} onChange={() => setSelectedYear(year)} />
              <span><strong>{year}</strong> {status}</span>
            </label>
          ))}
        </fieldset>

        <section className="budget-overview" aria-label={`${selectedYear} headline indicators`}>
          <dl>
            {indicators.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{amount(value)} <span>SAR bn</span></dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="budget-grid">
          <FiscalTrend selectedYear={selectedYear} />
          <section className="budget-panel" aria-labelledby="budget-revenue">
            <h2 id="budget-revenue">Revenue composition</h2>
            <p className="budget-muted">Fiscal year {selectedYear}</p>
            <div className="budget-revenue-layout">
              <div className="budget-ring" style={{ '--tax-share': `${taxShare}%` }} aria-hidden="true">
                <div><strong>{amount(fiscal.revenue)}</strong><small>SAR bn total</small></div>
              </div>
              <dl className="budget-breakdown">
                <div><dt data-series="revenue">Tax revenue</dt><dd>{amount(fiscal.tax)} SAR bn</dd></div>
                <div><dt data-series="spending">Other revenue, including oil</dt><dd>{amount(fiscal.other)} SAR bn</dd></div>
                <div><dt>Tax share of revenue</dt><dd>{amount(taxShare)}%</dd></div>
              </dl>
            </div>
          </section>

          <section className="budget-panel budget-sectors" aria-labelledby="budget-sectors">
            <h2 id="budget-sectors">Sector expenditure</h2>
            <p className="budget-muted">Fiscal year {selectedYear} · SAR billion</p>
            <table aria-labelledby="budget-sectors">
              <thead><tr><th scope="col">Sector</th><th scope="col">Amount</th><th scope="col">Share</th></tr></thead>
              <tbody>
                {sectors.map(({ name, value }) => (
                  <tr key={name}>
                    <th scope="row">{name}</th><td>{amount(value)}</td>
                    <td>{amount(share(value, fiscal.spending))}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="budget-panel" aria-labelledby="budget-ratios">
            <h2 id="budget-ratios">Fiscal ratios</h2>
            <p className="budget-muted">Fiscal year {selectedYear}</p>
            <dl className="budget-ratios">
              {ratios.map(([label, value, detail]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd><strong>{amount(value)}%</strong><span>{detail}</span></dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <p className="budget-sources">
          Saudi Ministry of Finance sources. Figures are rounded.
          {' '}<a href={performanceReport}>FY2024 performance report</a> · <a href={budgetStatement}>FY2027 budget statement</a>
        </p>

        <section className="budget-other" aria-labelledby="budget-downloads">
          <h2 id="budget-downloads">Related downloads</h2>
          <a href="/pdfs/company-incorporation-and-business-setup-in-oman.pdf" download="Company Incorporation and Business Setup in Oman.pdf">
            <FileText size={20} aria-hidden="true" />
            <span>Company Incorporation and Business Setup in Oman</span>
            <Download size={20} aria-hidden="true" />
          </a>
        </section>
      </div>
    </div>
  )
}
