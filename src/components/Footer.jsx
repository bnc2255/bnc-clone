import { Link } from 'react-router-dom'
import { Linkedin, Instagram, Facebook, Youtube } from 'lucide-react'
import logoWhite from '../assets/logo.png'
import headerLogo from '../assets/header_logo.png'

export default function Footer({ variant = 'default' }) {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/bnc-global-consulteck/',
      icon: <Linkedin className="w-4 h-4" />,
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/bncglobal.in/',
      icon: <Instagram className="w-4 h-4" />,
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/bncglobal.in/',
      icon: <Facebook className="w-4 h-4" />,
    },
    {
      name: 'Youtube',
      url: 'https://www.youtube.com/@bncglobalconsultech',
      icon: <Youtube className="w-4 h-4" />,
    },
    {
      name: 'X',
      url: 'https://twitter.com/GoyalSummit',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ]

  // --- Landing Variant (Parchment Surface, Compact Typography, Clear Link Groups) ---
  if (variant === 'landing') {
    return (
      <footer className="bg-[#F5F5F7] text-[#6E6E73] border-t border-[#D2D2D7] font-sans pt-12 pb-10 text-[12px] leading-[1.4]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Top Row: Logo & Mission Summary */}
          <div className="pb-8 border-b border-[#D2D2D7] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Link to="/" aria-label="BNC Global Home Page" className="rounded focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none">
              <img className="h-[36px] w-auto object-contain" src={headerLogo} alt="BNC Global Logo" />
            </Link>
            <p className="text-[#86868B] max-w-xl text-[12px]">
              Boardroom-ready Virtual CFO support, outsourced accounting, payroll, and corporate compliance for scaling enterprises worldwide.
            </p>
          </div>

          {/* Middle Row: Clear Link Groups */}
          <div className="py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Group 1: Company */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1D1D1F] tracking-tight text-[12px]">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about-us" className="hover:text-[#0066CC] transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/about-us/meet-our-team" className="hover:text-[#0066CC] transition-colors">Meet Our Team</Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-[#0066CC] transition-colors">Careers</Link>
                </li>
                <li>
                  <a href="http://partners.bncglobal.in/" target="_blank" rel="noreferrer noopener" className="hover:text-[#0066CC] transition-colors">
                    Partner Platform &rarr;
                  </a>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#0066CC] transition-colors">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* Group 2: Key Services */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1D1D1F] tracking-tight text-[12px]">Core Services</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/virtual-cfo" className="hover:text-[#0066CC] transition-colors">Virtual CFO Network</Link>
                </li>
                <li>
                  <Link to="/bnc-global-services" className="hover:text-[#0066CC] transition-colors">All Services</Link>
                </li>
                <li>
                  <Link to="/accounting" className="hover:text-[#0066CC] transition-colors">Accounting & Bookkeeping</Link>
                </li>
                <li>
                  <Link to="/audit-support-service" className="hover:text-[#0066CC] transition-colors">Audit Support</Link>
                </li>
                <li>
                  <Link to="/cybersecurity" className="hover:text-[#0066CC] transition-colors">Cybersecurity & Risk</Link>
                </li>
              </ul>
            </div>

            {/* Group 3: Countries We Serve */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1D1D1F] tracking-tight text-[12px]">Global Reach</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/countries-we-serve/australia" className="hover:text-[#0066CC] transition-colors">Australia</Link>
                </li>
                <li>
                  <Link to="/countries-we-serve/canada" className="hover:text-[#0066CC] transition-colors">Canada</Link>
                </li>
                <li>
                  <Link to="/countries-we-serve/saudi-arabia" className="hover:text-[#0066CC] transition-colors">Saudi Arabia</Link>
                </li>
                <li>
                  <Link to="/countries-we-serve/uae" className="hover:text-[#0066CC] transition-colors">United Arab Emirates</Link>
                </li>
                <li>
                  <Link to="/create-or-manage-your-gcc-in-india" className="hover:text-[#0066CC] transition-colors">India GCC Setup</Link>
                </li>
              </ul>
            </div>

            {/* Group 4: Direct Contacts & Socials */}
            <div className="space-y-3">
              <h4 className="font-semibold text-[#1D1D1F] tracking-tight text-[12px]">Direct Contact</h4>
              <div className="space-y-1.5 text-[12px]">
                <div>
                  <a
                    href="mailto:info@bncglobal.in"
                    className="text-[#1D1D1F] hover:text-[#0066CC] font-medium transition-colors block"
                    aria-label="Email BNC Global"
                  >
                    info@bncglobal.in
                  </a>
                </div>
                <div>
                  <a
                    href="tel:+919810575613"
                    className="text-[#1D1D1F] hover:text-[#0066CC] font-medium transition-colors block"
                    aria-label="Call BNC Global"
                  >
                    +91 98105 75613
                  </a>
                </div>
              </div>

              {/* Social destinations */}
              <div className="pt-2">
                <p className="text-[#86868B] text-[11px] mb-2 font-medium">Follow us</p>
                <nav aria-label="Social Media Links" className="flex items-center gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Follow BNC Global on ${social.name}`}
                      className="w-8 h-8 rounded-full bg-white border border-[#D2D2D7] text-[#424245] hover:text-[#0066CC] hover:border-[#0066CC] transition-all flex items-center justify-center shadow-xs"
                    >
                      {social.icon}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright, Privacy & Blog */}
          <div className="pt-6 border-t border-[#D2D2D7] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#86868B]">
            <p>
              Copyright &copy; {currentYear} BNC Global Consultech Pvt. Ltd. All rights reserved.
            </p>
            <nav aria-label="Footer Legal and Content Links" className="flex items-center gap-6">
              <Link
                to="/privacy-policy"
                className="hover:text-[#0066CC] transition-colors focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none rounded"
              >
                Privacy Policy
              </Link>
              <span className="text-[#D2D2D7]">•</span>
              <Link
                to="/blog"
                className="hover:text-[#0066CC] transition-colors focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:outline-none rounded"
              >
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    )
  }

  // --- Default Variant (Original deep blue footer for interior pages) ---
  return (
    <footer className="bg-[#0b2f5b] text-white/80 h-auto py-8 md:h-[219px] flex items-center border-t border-white/10 font-sans leading-[20.8px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Section: Logo & Copyright */}
        <div className="flex flex-col items-start space-y-2">
          <Link to="/" aria-label="BNC Global Home Page" className="rounded focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none">
            <img className="h-[91px] w-[247px] object-contain" src={logoWhite} alt="BNC Global Logo" />
          </Link>
          <p className="text-[16px] text-white font-sans leading-[20.8px]">
            Copyrights &copy; {currentYear} BNC Global Consultech Pvt. Ltd.
          </p>
        </div>

        {/* Center Section: Contacts & Socials */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex flex-col items-center text-[16px] text-white space-y-1 leading-[20.8px]">
            <a href="mailto:info@bncglobal.in" className="hover:text-teal-400 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none rounded transition-colors" aria-label="Email BNC Global">
              info@bncglobal.in
            </a>
            <a href="tel:+919810575613" className="hover:text-teal-400 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none rounded transition-colors" aria-label="Call BNC Global">
              +91 98105 75613
            </a>
          </div>
          {/* Socials */}
          <nav aria-label="Social Media Links" className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Follow BNC Global on ${social.name}`}
                className="w-[22px] h-[22px] text-white hover:text-teal-400 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none rounded transition-all flex items-center justify-center"
              >
                {social.icon}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Section: Privacy & Blog Links */}
        <nav aria-label="Footer Links" className="flex flex-col items-end text-[16px] space-y-2">
          <Link to="/privacy-policy" className="text-[#BFD9ED] hover:text-white focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none rounded transition-colors">
            Privacy Policy
          </Link>
          <Link to="/blog" className="text-[#BFD9ED] hover:text-white focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none rounded transition-colors">
            Blog
          </Link>
        </nav>
      </div>
    </footer>
  )
}
