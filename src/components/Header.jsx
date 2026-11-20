import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, ExternalLink } from 'lucide-react'
import headerLogo from '../assets/header_logo.png'
import logoWhite from '../assets/logo.png'

export default function Header({ variant = 'default' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()

  const navLinks = [
    { name: 'Virtual CFO Network', path: '/virtual-cfo' },
    { name: 'Services', path: '/bnc-global-services' },
    {
      name: 'Partner Platform',
      path: 'http://partners.bncglobal.in/',
      isExternal: true,
    },
    {
      name: 'Countries we serve',
      path: '#',
      dropdown: [
        { name: 'Australia', path: '/countries-we-serve/australia' },
        { name: 'Canada', path: '/countries-we-serve/canada' },
        { name: 'Saudi Arabia', path: '/countries-we-serve/saudi-arabia' },
        { name: 'UAE', path: '/countries-we-serve/uae' },
      ],
    },
    {
      name: 'Careers',
      path: '#',
      dropdown: [
        { name: 'Careers Home', path: '/careers' },
        { name: 'Elevate', path: '/elevate' },
        { name: 'Transforming Professionals', path: '/transforming-professionals' },
        { name: 'Communities', path: '/communities' },
      ],
    },
    {
      name: 'About',
      path: '#',
      dropdown: [
        { name: 'About us', path: '/about/company' },
        { name: 'About founders', path: '/about/founders' },
      ],
    },
    { name: 'Contact Us', path: '/contact' },
  ]

  const isActive = (path) => {
    if (path === '#') return false
    return location.pathname === path
  }

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(index)
    }
  }

  // --- Landing Variant (Compact Translucent Dark Bar) ---
  if (variant === 'landing') {
    return (
      <header
        className="sticky top-0 z-50 h-[56px] lg:h-[64px] border-b border-white/10 transition-all font-sans"
        style={{
          backgroundColor: 'rgba(29, 29, 31, 0.8)',
          backdropFilter: 'saturate(1.8) blur(20px)',
          WebkitBackdropFilter: 'saturate(1.8) blur(20px)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-full w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center rounded focus-visible:ring-2 focus-visible:ring-[#2997FF] focus-visible:outline-none"
              aria-label="BNC Global Home Page"
            >
              <img
                className="h-[32px] lg:h-[38px] w-auto object-contain"
                src={logoWhite}
                alt="BNC Global Logo"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav aria-label="Main Navigation" className="hidden lg:flex space-x-1 items-center h-full">
            {navLinks.map((link, idx) => {
              if (link.dropdown) {
                const isDropdownOpen = activeDropdown === idx
                return (
                  <div key={link.name} className="relative group h-full flex items-center" onMouseEnter={() => setActiveDropdown(idx)} onMouseLeave={() => setActiveDropdown(null)} onKeyDown={(event) => { if (event.key === 'Escape') setActiveDropdown(null) }}>
                    <button
                      onClick={() => toggleDropdown(idx)}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                      className={`flex items-center gap-1 px-3 py-1.5 text-[13px] font-normal tracking-tight rounded-full transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2997FF] focus-visible:outline-none ${
                        link.dropdown.some((sub) => isActive(sub.path))
                          ? 'text-[#2997FF] font-medium'
                          : 'text-[#FFFFFFCC] hover:text-white'
                      }`}
                    >
                      {link.name}
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 opacity-70" aria-hidden="true" />
                    </button>
                    {/* Dropdown Menu */}
                    <div className={`absolute left-0 top-full pt-1.5 w-60 transition-all duration-200 z-50 ${isDropdownOpen ? 'opacity-100 scale-100' : 'invisible opacity-0 scale-95 pointer-events-none'}`} >
                      <div
                        className="rounded-2xl border border-white/15 p-2 shadow-2xl backdrop-blur-2xl"
                        style={{ backgroundColor: 'rgba(29, 29, 31, 0.95)' }}
                        role="menu"
                      >
                        {link.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            role="menuitem"
                            onClick={() => setActiveDropdown(null)}
                            className={`block px-3.5 py-2 text-[13px] rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-[#2997FF] focus-visible:outline-none ${
                              isActive(subItem.path)
                                ? 'bg-white/15 text-[#2997FF] font-medium'
                                : 'text-[#FFFFFFCC] hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }

              if (link.isExternal) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-normal tracking-tight text-[#FFFFFFCC] hover:text-white rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[#2997FF] focus-visible:outline-none"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
                  </a>
                )
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 text-[13px] font-normal tracking-tight rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[#2997FF] focus-visible:outline-none ${
                    isActive(link.path)
                      ? 'text-[#2997FF] font-medium'
                      : 'text-[#FFFFFFCC] hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close main navigation menu' : 'Open main navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="inline-flex items-center justify-center p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#2997FF] focus:outline-none transition-colors cursor-pointer"
            >
              {isOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden border-t border-white/10 py-4 px-6 space-y-2 absolute top-[56px] left-0 right-0 shadow-2xl z-50 animate-in slide-in-from-top duration-200"
            style={{
              backgroundColor: 'rgba(29, 29, 31, 0.96)',
              backdropFilter: 'saturate(1.8) blur(20px)',
              WebkitBackdropFilter: 'saturate(1.8) blur(20px)',
            }}
          >
            {navLinks.map((link, idx) => {
              if (link.dropdown) {
                return (
                  <div key={link.name} className="space-y-1">
                    <button
                      onClick={() => toggleDropdown(idx)}
                      aria-expanded={activeDropdown === idx}
                      className="w-full flex justify-between items-center px-3 py-2 text-[15px] font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10"
                    >
                      {link.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === idx ? 'rotate-180 text-[#2997FF]' : 'text-white/60'
                        }`}
                      />
                    </button>
                    {activeDropdown === idx && (
                      <div className="pl-4 space-y-1 bg-white/5 rounded-xl py-1 border-l border-white/20">
                        {link.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-1.5 text-[14px] rounded-lg transition-colors ${
                              isActive(subItem.path)
                                ? 'text-[#2997FF] font-medium bg-white/10'
                                : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              if (link.isExternal) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-[15px] font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-4 h-4 text-white/50" />
                  </a>
                )
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 text-[15px] font-medium rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-white/15 text-[#2997FF] font-semibold'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>
        )}
      </header>
    )
  }

  const isPartner = variant === 'partner'

  // The imported About pages use the partner site's 76px overlay header spacing.
  return (
    <header className={`${isPartner ? 'fixed left-0 right-0 top-0 h-[76px] bg-gradient-to-b from-white/25 to-white/10 backdrop-blur-[22px] backdrop-saturate-[1.8] shadow-[inset_0_-1px_0_rgba(255,255,255,0.6),0_1px_0_rgba(0,0,0,0.04)]' : 'sticky top-0 bg-white border-b border-slate-100 shadow-sm h-[115px]'} z-50 font-display flex items-center`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className={`flex justify-between ${isPartner ? 'h-[76px]' : 'h-[115px]'} items-center`}>
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center rounded focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none" aria-label="BNC Global Home Page">
              <img className={`${isPartner ? 'h-[38px] w-auto' : 'h-[63px] w-[137px]'} object-contain`} src={headerLogo} alt="BNC Global Logo" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav aria-label="Main Navigation" className="hidden lg:flex space-x-1 items-center">
            {navLinks.map((link, idx) => {
              if (link.dropdown) {
                const isDropdownOpen = activeDropdown === idx
                return (
                  <div key={link.name} className="relative group" onMouseEnter={() => setActiveDropdown(idx)} onMouseLeave={() => setActiveDropdown(null)} onKeyDown={(event) => { if (event.key === 'Escape') setActiveDropdown(null) }}>
                    <button
                      onClick={() => toggleDropdown(idx)}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                      className={`flex items-center gap-1 px-4 py-2 text-[14px] font-normal leading-[31px] text-black hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded transition-all cursor-pointer ${
                        link.dropdown.some((sub) => isActive(sub.path)) ? 'text-blue-600 font-semibold' : ''
                      }`}
                    >
                      {link.name}
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" aria-hidden="true" />
                    </button>
                    {/* Dropdown menu wrapper to bridge the hover gap */}
                    <div className={`absolute left-0 top-full pt-2 w-56 transition-all duration-200 z-50 ${isDropdownOpen ? 'opacity-100 scale-100' : 'invisible opacity-0 scale-95 pointer-events-none'}`} >
                      <div className="rounded-xl bg-white border border-slate-150 shadow-xl py-2" role="menu">
                        {link.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            role="menuitem"
                            onClick={() => setActiveDropdown(null)}
                            className={`block px-4 py-2.5 text-[14px] text-black hover:text-blue-600 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none transition-colors ${
                              isActive(subItem.path) ? 'bg-blue-50/50 text-blue-600 font-semibold' : ''
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }

              if (link.isExternal) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1 px-4 py-2 text-[14px] font-normal leading-[31px] text-black hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded transition-all"
                  >
                    {link.name}
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 text-[14px] font-normal leading-[31px] focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded transition-all ${
                    isActive(link.path)
                      ? 'text-blue-600 font-normal'
                      : 'text-black hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-600 focus:outline-none transition-colors cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className={`lg:hidden border-t border-slate-100 bg-white py-4 px-4 space-y-2 absolute ${isPartner ? 'top-[76px]' : 'top-[115px]'} left-0 right-0 shadow-lg z-50 animate-in slide-in-from-top duration-200`}>
          {navLinks.map((link, idx) => {
            if (link.dropdown) {
              return (
                <div key={link.name} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(idx)}
                    aria-expanded={activeDropdown === idx}
                    className="w-full flex justify-between items-center px-4 py-2.5 text-base font-medium rounded-lg text-slate-650 hover:text-blue-600 hover:bg-slate-50"
                  >
                    {link.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeDropdown === idx ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {activeDropdown === idx && (
                    <div className="pl-6 space-y-1 bg-slate-50/50 rounded-lg py-1 border-l-2 border-slate-200">
                      {link.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          onClick={() => setIsOpen(false)}
                          className={`block px-4 py-2 text-sm text-slate-500 hover:text-blue-600 transition-colors ${
                            isActive(subItem.path) ? 'text-blue-600 font-semibold' : ''
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            if (link.isExternal) {
              return (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 text-base font-medium rounded-lg text-slate-650 hover:text-blue-600 hover:bg-slate-50"
                >
                  <span>{link.name}</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              )
            }

            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 text-base font-medium rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-50/50 text-blue-600 font-semibold'
                    : 'text-slate-655 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
