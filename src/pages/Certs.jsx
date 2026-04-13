import "../App.css";
import cprCertificationUrl from "../../certs/cpr_certification.pdf?url";
import phlebotomyCertificationUrl from "../../certs/phlebotomy_certification.pdf?url";
import phlebotomyTrainingUrl from "../../certs/phlebotomy _certification.pdf?url";

const CONFIG = {
  businessName: "Salina's Mobile Phlebotomy",
  phone: "(719) 555-0000",
  phoneTel: "tel:+17195550000",
  email: "SalinaPacker@gmail.com",
  founded: "1999",
  yearsExperience: "27+",
};

const AVAILABILITY_MAILTO = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Check Availability")}`;

const certificationCards = [
  {
    label: "Clinical credential",
    title: "Phlebotomy Certification",
    issuer: "Professional training record",
    copy:
      "Supporting documentation for Salina's phlebotomy background and specimen-collection training.",
    fileUrl: phlebotomyCertificationUrl,
  },
  {
    label: "Training record",
    title: "Phlebotomy Education Documentation",
    issuer: "Program completion record",
    copy:
      "Additional phlebotomy training documentation kept on file and available for verification.",
    fileUrl: phlebotomyTrainingUrl,
    rotatePreview: true,
  },
  {
    label: "Current support skill",
    title: "CPR Certification",
    issuer: "Emergency response credential",
    copy:
      "Certification supporting calm, prepared patient care in home, office, and facility settings.",
    fileUrl: cprCertificationUrl,
  },
];

const trustPoints = [
  { value: CONFIG.founded, label: "Professional training background dating back to 1999" },
  { value: `${CONFIG.yearsExperience}`, label: "Years of hands-on phlebotomy experience" },
  { value: "3", label: "Supporting credential documents displayed on this page" },
];

function IconBase({ children }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const Icons = {
  Phone: () => (
    <IconBase>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.1 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7A2 2 0 0 1 22 16.92Z" />
    </IconBase>
  ),
  Mail: () => (
    <IconBase>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </IconBase>
  ),
  Shield: () => (
    <IconBase>
      <path d="M12 3c2 1.7 4.8 3 7 3v6c0 4.97-3.1 7.74-6.54 9.27a1.2 1.2 0 0 1-.92 0C8.1 19.74 5 16.97 5 12V6c2.2 0 5-1.3 7-3Z" />
      <path d="m9.5 12.5 1.8 1.8 3.8-4.3" />
    </IconBase>
  ),
  Home: () => (
    <IconBase>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13v-9.5" />
      <path d="M10 20v-5h4v5" />
    </IconBase>
  ),
  External: () => (
    <IconBase>
      <path d="M14 5h5v5" />
      <path d="M10 14 19 5" />
      <path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" />
    </IconBase>
  ),
};

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
}

function CertificateCard({ copy, fileUrl, issuer, label, rotatePreview = false, title }) {
  return (
    <article className="certificate-card">
      <div className="certificate-copy">
        <span className="service-label">{label}</span>
        <h3>{title}</h3>
        <p className="cert-issuer">{issuer}</p>
        <p>{copy}</p>
      </div>

      <div
        className={`certificate-preview-wrap ${rotatePreview ? "certificate-preview-wrap-rotated" : ""}`}
      >
        <iframe
          className="certificate-preview-frame"
          src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          title={title}
        />
      </div>

      <div className="certificate-actions">
        <a className="button button-secondary" href={fileUrl} target="_blank" rel="noreferrer">
          <Icons.External />
          <span>Open Full Size</span>
        </a>
        <a className="button button-primary" href={fileUrl} download>
          <Icons.Shield />
          <span>Download PDF</span>
        </a>
      </div>
    </article>
  );
}

export default function CertsPage() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="page-frame header-inner">
          <a className="brand" href="./" aria-label={`${CONFIG.businessName} home`}>
            <span className="brand-mark">
              <Icons.Shield />
            </span>
            <span>
              <strong>{CONFIG.businessName}</strong>
              <small>Certifications and credentials</small>
            </span>
          </a>

          <nav className="site-nav" aria-label="Primary">
            <a href="./">Home</a>
            <a href="./certifications.html" aria-current="page">
              Certifications
            </a>
          </nav>

          <div className="header-actions">
            <a className="header-link" href={AVAILABILITY_MAILTO}>
              <Icons.Mail />
              <span>Check Availability</span>
            </a>
            <a className="button button-primary button-compact" href={CONFIG.phoneTel}>
              <Icons.Phone />
              <span>Call to Schedule</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="page-intro-section">
          <div className="page-frame page-intro-card cert-page-hero">
            <div className="page-intro-copy">
              <p className="eyebrow">Certifications</p>
              <h1>Professional certifications and supporting credentials.</h1>
              <p className="hero-copy">
                This page provides direct access to Salina&apos;s certification documents for patients,
                families, providers, and care coordinators who would like to review supporting
                credentials before scheduling service.
              </p>

              <div className="hero-actions">
                <a className="button button-secondary" href="./">
                  <Icons.Home />
                  <span>Back to Main Site</span>
                </a>
                <a className="button button-primary" href={AVAILABILITY_MAILTO}>
                  <Icons.Mail />
                  <span>Check Availability</span>
                </a>
              </div>
            </div>

            <div className="page-intro-aside">
              {trustPoints.map((item) => (
                <article key={item.label} className="trust-card">
                  <p className="trust-value">{item.value}</p>
                  <p className="trust-label">{item.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="page-frame">
            <SectionHeading
              eyebrow="Displayed records"
              title="Supporting certification documents on file."
              copy="Each certificate is available here in a clean read-only display with a direct open and download option."
            />

            <div className="certificate-grid">
              {certificationCards.map((card) => (
                <CertificateCard key={card.title} {...card} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section-wash">
          <div className="page-frame">
            <SectionHeading
              eyebrow="Professional overview"
              title="Credentials available for review before service."
              copy="Patients, families, providers, and care coordinators may review supporting documentation here as part of the scheduling and verification process."
            />

            <ul className="highlight-list">
              <li>
                <span className="highlight-icon">
                  <Icons.Shield />
                </span>
                <span>Certification documents are organized in one place for straightforward review.</span>
              </li>
              <li>
                <span className="highlight-icon">
                  <Icons.Shield />
                </span>
                <span>Supporting credentials may be viewed online or downloaded as PDF files.</span>
              </li>
              <li>
                <span className="highlight-icon">
                  <Icons.Shield />
                </span>
                <span>This page helps confirm training background before home, office, or facility visits.</span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-frame footer-inner">
          <div>
            <p className="footer-title">{CONFIG.businessName}</p>
            <p className="footer-copy">
              Certifications, training records, and supporting documents presented in a clean,
              accessible format for patients, families, and care teams.
            </p>
          </div>

          <div className="footer-links">
            <a href="./">Home</a>
            <a href={CONFIG.phoneTel}>{CONFIG.phone}</a>
            <a href={AVAILABILITY_MAILTO}>Check Availability</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
