import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="bnc-not-found relative isolate flex min-h-[68svh] flex-col justify-center overflow-hidden px-6 py-24 text-center">
      <div className="bnc-not-found-grid" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl space-y-6">
        <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[.24em] text-[#1257c0]">
          <span className="h-px w-6 bg-current opacity-60" /> BNC Global <span className="h-px w-6 bg-current opacity-60" />
        </span>
        <h1 className="mx-auto text-7xl font-bold tracking-tight text-[#0d1b3d] leading-none">
          404 <span className="block text-3xl font-light leading-tight sm:text-5xl">This page isn’t available.</span>
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-[#3f4b66] sm:text-lg">
          The address may have changed, or the page may no longer be here.
        </p>
        <div className="pt-3">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1257c0] px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(18,87,192,.28)] transition-all hover:-translate-y-px hover:bg-[#0e49a3] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1257c0]"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
