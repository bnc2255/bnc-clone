import AboutCompany from './company/AboutCompany';
import './partner-baseline.css';
import './onboarding-styles.css';

// /about/company: "About the Company", copied from the Universe One onboarding
// module. Its styles are scoped under .ob so they do not affect other pages.
export default function AboutCompanyPage() {
  return (
    <div className="ob relative" style={{ background: '#FFFFFF' }}>
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 pb-24 md:px-8">
        <AboutCompany />
      </div>
    </div>
  );
}
