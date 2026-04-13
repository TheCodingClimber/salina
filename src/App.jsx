import { Suspense, lazy, useEffect, useId, useState } from "react";
import "./App.css";

const CleanClinicalHeroScene = lazy(() => import("./components/CleanClinicalHeroScene"));

const CONFIG = {
  businessName: "Salina's Mobile Phlebotomy",
  phone: "(719) 555-0000",
  phoneTel: "tel:+17195550000",
  email: "SalinaPacker@gmail.com",
  founded: "1999",
  yearsExperience: "27+",
  blsCertified: false,
};

const AVAILABILITY_MAILTO = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Check Availability")}`;
const CERTIFICATIONS_ROUTE = "./certifications.html";

const trustStats = [
  { value: "27+", label: "Years of hands-on phlebotomy experience" },
  { value: "Home + Office", label: "Care delivered where patients feel most comfortable" },
  { value: "Order Ready", label: "Built around physician requisitions and lab workflows" },
  { value: "Flexible", label: "Scheduling support for routine and arranged priority visits" },
];

const serviceCards = [
  {
    title: "Mobile Blood Draws",
    label: "Core service",
    copy: "Professional specimen collection brought to the home, office, or care setting with a calmer patient experience.",
  },
  {
    title: "Specimen Collection and Transport",
    label: "Coordinated care",
    copy: "Thoughtful handling, labeling, and transport coordination designed to keep the visit organized from draw to handoff.",
  },
  {
    title: "Pediatric and Senior Support",
    label: "Comfort focused",
    copy: "A gentler approach for children, seniors, and homebound patients who benefit from added patience and reassurance.",
  },
  {
    title: "Facility and Office Visits",
    label: "On-site convenience",
    copy: "Support for care teams, employers, concierge practices, and facilities that need reliable mobile collection services.",
  },
  {
    title: "Wellness and Screening Programs",
    label: "Program support",
    copy: "Clean, professional collection support for biometric screenings, wellness events, and planned group visits.",
  },
  {
    title: "Priority Arrangements",
    label: "By request",
    copy: "Responsive scheduling for time-sensitive visits, travel-limited patients, and special appointment needs.",
  },
];

const careHighlights = [
  "Comfortable, professional visits for patients who prefer care in familiar surroundings.",
  "Organized mobile service built around physician orders, specimen handling, and dependable communication.",
  "A reassurance-first approach for homebound, pediatric, senior, and anxious patients.",
];

const processSteps = [
  {
    number: "01",
    title: "Schedule the visit",
    copy: "Reach out with the appointment details, requisition information, and preferred timing so the visit can be coordinated clearly.",
  },
  {
    number: "02",
    title: "Receive care on site",
    copy: "A certified phlebotomist arrives with the required supplies and performs the draw in a familiar, comfortable environment.",
  },
  {
    number: "03",
    title: "Complete the handoff",
    copy: "Specimens are prepared and routed for lab processing with a careful, organized end-to-end collection workflow.",
  },
];

const areaGroups = [
  {
    title: "Primary Service Area",
    accent: "teal",
    areas: ["Colorado Springs", "Fountain", "Monument", "Pueblo"],
  },
  {
    title: "Extended Coverage",
    accent: "sand",
    areas: ["Denver", "Aurora", "Additional communities by arrangement"],
  },
];

const credentialChips = [
  "Certified since 1999",
  "Phlebotomy Learning Center of Denver",
  "St. Joseph Hospital clinical externship",
  "27+ years of experience",
];

if (CONFIG.blsCertified) {
  credentialChips.push("Current BLS/CPR");
}

const faqs = [
  {
    question: "How does mobile phlebotomy work?",
    answer:
      "Once the visit is scheduled, a certified phlebotomist comes to the home, office, or care setting with the needed supplies and performs the draw on site.",
  },
  {
    question: "What should patients have ready before the visit?",
    answer:
      "Please have the laboratory requisition available and follow any fasting or hydration instructions provided by the ordering clinician.",
  },
  {
    question: "Do you work with physician lab orders?",
    answer:
      "Yes. The service is designed to support physician-ordered testing and specimen collection that needs to be coordinated outside a traditional lab visit.",
  },
  {
    question: "Who benefits most from a mobile draw service?",
    answer:
      "Patients who prefer privacy, have mobility limitations, care for children or seniors, or simply want a more convenient and calmer collection experience often benefit most.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "Primary service includes Colorado Springs, Fountain, Monument, and Pueblo, with additional Front Range visits available by arrangement.",
  },
  {
    question: "How is pricing determined?",
    answer:
      "Mobile visits typically start at $50+, with final pricing based on service type, travel, and scheduling needs. Call or email to confirm the visit details.",
  },
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
  Drop: () => (
    <IconBase>
      <path d="M12 3c-.8 2.73-2.22 4.98-3.65 6.55C6.78 11.2 6 13.07 6 15a6 6 0 0 0 12 0c0-1.93-.78-3.8-2.35-5.45C14.22 7.98 12.8 5.73 12 3Z" />
    </IconBase>
  ),
  Calendar: () => (
    <IconBase>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </IconBase>
  ),
  Home: () => (
    <IconBase>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13v-9.5" />
      <path d="M10 20v-5h4v5" />
    </IconBase>
  ),
  Check: () => (
    <IconBase>
      <path d="m5 12 4.2 4.2L19 7.6" />
    </IconBase>
  ),
  MapPin: () => (
    <IconBase>
      <path d="M12 21s-6-5.33-6-11a6 6 0 1 1 12 0c0 5.67-6 11-6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  ),
  Heart: () => (
    <IconBase>
      <path d="M20.4 8.2a4.9 4.9 0 0 0-8.4-3.4 4.9 4.9 0 0 0-8.4 3.4c0 4.1 4.6 7.5 8.4 11 3.8-3.5 8.4-6.9 8.4-11Z" />
    </IconBase>
  ),
  Chevron: () => (
    <IconBase>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  ),
};

function SectionHeading({ eyebrow, title, copy, align = "left" }) {
  return (
    <div className={`section-heading ${align === "center" ? "section-heading-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
}

function FAQItem({ answer, isOpen, onToggle, question }) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <article className={`faq-card ${isOpen ? "faq-card-open" : ""}`}>
      <button
        id={buttonId}
        className="faq-trigger"
        type="button"
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span>{question}</span>
        <span className="faq-icon-wrap">
          <Icons.Chevron />
        </span>
      </button>
      <div
        id={panelId}
        className="faq-panel"
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
      >
        <p>{answer}</p>
      </div>
    </article>
  );
}

export default function App() {
  const [openFaq, setOpenFaq] = useState(0);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowSticky(window.scrollY > 520);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="app-shell">
        <header className="site-header">
          <div className="page-frame header-inner">
            <a className="brand" href="#top" aria-label={`${CONFIG.businessName} home`}>
              <span className="brand-mark">
                <Icons.Drop />
              </span>
              <span>
                <strong>{CONFIG.businessName}</strong>
                <small>Mobile phlebotomy services</small>
              </span>
            </a>

            <nav className="site-nav" aria-label="Primary">
              <a href="#services">Services</a>
              <a href="#process">How It Works</a>
              <a href="#about">About</a>
              <a href={CERTIFICATIONS_ROUTE}>Certifications</a>
              <a href="#faq">FAQ</a>
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

        <main id="top">
          <section className="hero-section">
            <div className="page-frame hero-shell">
              <div className="hero-copy-column">
                <div className="hero-chip-row">
                  <span className="eyebrow">Mobile phlebotomy services</span>
                  <span className="status-chip">Serving Colorado since {CONFIG.founded}</span>
                </div>

                <h1>Professional blood draws with a calmer, more personal care experience.</h1>
                <p className="hero-copy">
                  Convenient mobile specimen collection for home, office, and care settings. Clean,
                  organized, and designed to help patients feel more at ease from arrival to handoff.
                </p>

                <div className="hero-actions">
                  <a className="button button-primary" href={CONFIG.phoneTel}>
                    <Icons.Phone />
                    <span>Call {CONFIG.phone}</span>
                  </a>
                  <a className="button button-secondary" href={AVAILABILITY_MAILTO}>
                    <Icons.Mail />
                    <span>Check Availability</span>
                  </a>
                </div>

                <ul className="hero-support-list" aria-label="Service highlights">
                  <li>
                    <Icons.Shield />
                    <span>Certified mobile care built around physician-ordered testing</span>
                  </li>
                  <li>
                    <Icons.Home />
                    <span>Comfort-first visits for homes, offices, and care environments</span>
                  </li>
                  <li>
                    <Icons.Heart />
                    <span>Especially helpful for anxious, pediatric, geriatric, and homebound patients</span>
                  </li>
                </ul>
              </div>

              <div className="hero-visual-column">
                <div className="hero-visual-card">
                  <div className="hero-visual-glow" />
                  <Suspense fallback={<div className="hero-scene hero-scene-fallback" aria-hidden="true" />}>
                    <CleanClinicalHeroScene />
                  </Suspense>
                </div>
              </div>
            </div>
          </section>

          <section className="trust-section" aria-label="Trust overview">
            <div className="page-frame trust-grid">
              {trustStats.map((item) => (
                <article key={item.label} className="trust-card">
                  <p className="trust-value">{item.value}</p>
                  <p className="trust-label">{item.label}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section" id="services">
            <div className="page-frame">
              <SectionHeading
                eyebrow="Services"
                title="Care designed to feel smooth, coordinated, and genuinely reassuring."
                copy="Mobile phlebotomy services designed to feel organized, reassuring, and easy to arrange."
              />

              <div className="service-grid">
                {serviceCards.map((card) => (
                  <article key={card.title} className="service-card">
                    <span className="service-label">{card.label}</span>
                    <h3>{card.title}</h3>
                    <p>{card.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section section-wash">
            <div className="page-frame care-layout">
              <div className="care-panel">
                <SectionHeading
                  eyebrow="Patient experience"
                  title="Care that feels calmer, more private, and easier to fit into daily life."
                  copy="Mobile visits allow patients to receive professional specimen collection in a familiar setting, with less waiting, less stress, and more convenience."
                />

                <ul className="highlight-list">
                  {careHighlights.map((item) => (
                    <li key={item}>
                      <span className="highlight-icon">
                        <Icons.Check />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="experience-card">
                <p className="eyebrow">Experience</p>
                <h2>Experienced mobile phlebotomy with a comfort-first approach.</h2>
                <p>
                  With decades of hands-on experience, Salina provides organized specimen collection
                  with the professionalism patients, families, and care teams rely on.
                </p>

                <div className="experience-meta">
                  <div>
                    <span>Founded</span>
                    <strong>{CONFIG.founded}</strong>
                  </div>
                  <div>
                    <span>Experience</span>
                    <strong>{CONFIG.yearsExperience} Years</strong>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <section className="section" id="process">
            <div className="page-frame">
              <SectionHeading
                eyebrow="How it works"
                title="A simple process from scheduling to specimen handoff."
                copy="Each visit is coordinated clearly so patients know what to expect and providers can trust the collection workflow."
                align="center"
              />

              <div className="process-grid">
                {processSteps.map((step) => (
                  <article key={step.number} className="process-card">
                    <span className="process-number">{step.number}</span>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section section-wash" id="about">
            <div className="page-frame split-layout">
              <div>
                <SectionHeading
                  eyebrow="Service area"
                  title="Serving Southern Colorado with additional visits by arrangement."
                  copy="Coverage is centered in Colorado Springs and surrounding communities, with extended travel available for select Front Range appointments."
                />

                <div className="area-grid">
                  {areaGroups.map((group) => (
                    <article
                      key={group.title}
                      className={`area-card ${group.accent === "sand" ? "area-card-sand" : ""}`}
                    >
                      <h3>{group.title}</h3>
                      <div className="area-pills">
                        {group.areas.map((area) => (
                          <span key={area}>{area}</span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="bio-card">
                <div className="bio-mark">SP</div>
                <p className="eyebrow">About Salina</p>
                <h2>Experienced, dependable care brought to you.</h2>
                <p>
                  Salina Packer trained at the Phlebotomy Learning Center of Denver in 1999 and
                  completed clinical externship work at St. Joseph Hospital. That background supports
                  a mobile service centered on professionalism, patience, and respectful care.
                </p>

                <div className="chip-row">
                  {credentialChips.map((chip) => (
                    <span key={chip} className="detail-chip">
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="bio-actions">
                  <a className="button button-secondary" href={CERTIFICATIONS_ROUTE}>
                    <Icons.Shield />
                    <span>View Certifications</span>
                  </a>
                </div>
              </aside>
            </div>
          </section>

          <section className="section" id="faq">
            <div className="page-frame faq-layout">
              <SectionHeading
                eyebrow="Frequently asked questions"
                title="Common questions, answered clearly."
                copy="Everything patients, families, and care coordinators need to know before scheduling a mobile draw."
              />

              <div className="faq-list">
                {faqs.map((item, index) => (
                  <FAQItem
                    key={item.question}
                    answer={item.answer}
                    isOpen={openFaq === index}
                    onToggle={() => setOpenFaq(openFaq === index ? -1 : index)}
                    question={item.question}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="section cta-section">
            <div className="page-frame cta-banner">
              <div>
                <p className="eyebrow">Ready to book</p>
                <h2>Convenient, professional care without the clinic waiting room.</h2>
                <p className="cta-copy">
                  Schedule a mobile draw for home, office, or care-setting convenience. Thoughtful,
                  organized service designed to feel calm from the first call forward.
                </p>
              </div>

              <div className="cta-actions">
                <a className="button button-primary" href={CONFIG.phoneTel}>
                  <Icons.Phone />
                  <span>Call to Book</span>
                </a>
                <a className="button button-secondary" href={AVAILABILITY_MAILTO}>
                  <Icons.Mail />
                  <span>Check Availability</span>
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div className="page-frame footer-inner">
            <div>
              <p className="footer-title">{CONFIG.businessName}</p>
              <p className="footer-copy">
                Mobile specimen collection and transport support for patients, providers, families,
                and care teams across Southern Colorado and arranged Front Range visits.
              </p>
            </div>

            <div className="footer-links">
              <a href={CONFIG.phoneTel}>{CONFIG.phone}</a>
              <a href={AVAILABILITY_MAILTO}>Check Availability</a>
              <a href={CERTIFICATIONS_ROUTE}>Certifications</a>
            </div>

            <p className="footer-disclaimer">
              This service provides specimen collection and transport support. Laboratory testing is
              performed by independent certified laboratories, and medical decisions remain with the
              ordering healthcare provider.
            </p>
          </div>
        </footer>
      </div>

      <div className={`mobile-bar ${showSticky ? "mobile-bar-visible" : ""}`}>
        <a className="button button-primary mobile-bar-button" href={CONFIG.phoneTel}>
          <Icons.Phone />
          <span>Call</span>
        </a>
        <a className="button button-secondary mobile-bar-button" href={AVAILABILITY_MAILTO}>
          <Icons.Mail />
          <span>Availability</span>
        </a>
      </div>
    </>
  );
}
