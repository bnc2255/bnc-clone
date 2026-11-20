import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ServiceAnswers from '../seo/ServiceAnswers'

export default function Layout() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const isFounders = location.pathname === '/about/founders'
  const isPartnerAbout = ['/about/company', '/about/founders'].includes(location.pathname)
  const variant = isPartnerAbout ? 'partner' : isLanding ? 'landing' : 'default'

  return (
    <div className={`flex flex-col bg-white text-slate-800 antialiased font-sans selection:bg-[#1D67CD] selection:text-white ${isFounders ? 'h-svh overflow-hidden' : 'min-h-screen'}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Skip to main content
      </a>
      <Header variant={variant} />
      <main id="main-content" tabIndex={-1} className={`outline-none ${isFounders ? 'h-full min-h-0 overflow-hidden' : 'flex-grow'} ${isPartnerAbout ? 'pt-20' : ''}`}>
        <Outlet />
        <ServiceAnswers />
      </main>
      {!isFounders && <Footer variant={variant} />}
    </div>
  )
}
