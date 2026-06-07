import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";
import headshotWebp from "@assets/headshot-corp_1776959044728.webp";
import headshotAvif from "@assets/headshot-corp_1776959044728.avif";
import headshotWebp1x from "@assets/headshot-corp_1776959044728@1x.webp";
import headshotAvif1x from "@assets/headshot-corp_1776959044728@1x.avif";
import { Changelog } from "../components/Changelog";

const clientIcons = ["barChart", "landmark", "creditCard", "smartphone", "activity", "shoppingCart"];
const clientKeys  = ["financialServices", "banking", "fintech", "telecom", "healthtech", "retail"] as const;
const clientNames = ["Equifax", "Fifth Third Bank", "FISERV", "Verizon / MVNO", "J&J — Medical Devices", "Dollar General"];

const expTags = [
  ["Team Scaling", "SAFe / PI Planning", "Governance", "Global Teams"],
  ["K8s", "Istio", "Apigee", "Spring Boot", "Kafka"],
  ["LangChain", "Python", "React", "Azure OpenAI", "Zilliz", "AWS Bedrock", "Claude Code", "QWEN", "Opus", "Sonnet"],
  ["Middleware", "Portal", "Modernization", "8 Brands"],
  ["OpenBanking", "Event Processing", "Payments", "Solution Architecture"],
  ["AWS", "Microservices", "Event Streaming", "2.4M Users"],
];

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "de", label: "DE" },
];

/* ---- Inline SVG icons (lucide-compatible paths) ---- */

function SvgIcon({ name, className = "wk-icon-md" }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    brain: (
      <path d="M12 4a4 4 0 0 1 3.5 2.1A4 4 0 0 1 16 10a3.5 3.5 0 0 1-2 3.2V14a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-.8a3.5 3.5 0 0 1-2-3.2 4 4 0 0 1 .5-3.9A4 4 0 0 1 12 4z" />
    ),
    cloud: (
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    ),
    code: (
      <>
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </>
    ),
    lock: (
      <>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
    barChart: (
      <>
        <line x1="18" x2="18" y1="20" y2="10" />
        <line x1="12" x2="12" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="14" />
      </>
    ),
    landmark: (
      <>
        <line x1="3" x2="21" y1="22" y2="22" />
        <line x1="6" x2="6" y1="18" y2="11" />
        <line x1="10" x2="10" y1="18" y2="11" />
        <line x1="14" x2="14" y1="18" y2="11" />
        <line x1="18" x2="18" y1="18" y2="11" />
        <polygon points="12 2 20 7 4 7" />
      </>
    ),
    creditCard: (
      <>
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </>
    ),
    smartphone: (
      <>
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <line x1="12" x2="12.01" y1="18" y2="18" />
      </>
    ),
    activity: (
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    ),
    shoppingCart: (
      <>
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </>
    ),
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
}

/* ---- Shared primitives ---- */

/** Editorial double-rule section separator */
function WkRule() {
  return <hr className="wk-rule" />;
}

/** Section header with editorial double-rule, eyebrow label, and Bogart heading */
function SectionHeader({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <FadeInSection>
      <div className="wk-section-header">
        <WkRule />
        <span className="wk-label">{label}</span>
        <h2 className="wk-section-heading">{title}</h2>
        {subtitle && <p className="wk-section-subtitle">{subtitle}</p>}
      </div>
    </FadeInSection>
  );
}

/** Hairline pill tag */
function Tag({
  label,
  accent = false,
}: {
  label: string;
  accent?: boolean;
}) {
  return (
    <span className={`wk-tag${accent ? " wk-tag-accent" : ""}`}>
      {label}
    </span>
  );
}

/* ---- Scroll-reveal wrapper (replaces framer-motion) ---- */

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { rootMargin: "-60px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="wk-reveal"
      style={delay ? { transitionDelay: `${delay}s` } as React.CSSProperties : undefined}
    >
      {children}
    </div>
  );
}

/* ============================================================
   Main page component
   ============================================================ */
export default function Home() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("hero");
  const [currentLang, setCurrentLang] = useState(i18n.language.split("-")[0] || "en");

  const changeLanguage = (code: string) => {
    void i18n.changeLanguage(code);
    setCurrentLang(code);
  };

  useEffect(() => {
    const sections = ["hero", "skills", "experience", "clients"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.35 },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { id: "hero",       label: t("nav.about") },
    { id: "skills",     label: t("nav.skills") },
    { id: "experience", label: t("nav.experience") },
    { id: "clients",    label: t("nav.clients") },
  ];

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const skillCategories = [
    { icon: "brain",  key: "ai" },
    { icon: "cloud",  key: "cloud" },
    { icon: "code",   key: "engineering" },
    { icon: "lock",   key: "security" },
    { icon: "users",  key: "leadership" },
    { icon: "globe",  key: "digital" },
  ];

  const heroBullets: string[] = t("hero.bullets", { returnObjects: true }) as string[];
  const experienceEntries: { company: string; highlight: string; description: string }[] =
    t("experience.entries", { returnObjects: true }) as { company: string; highlight: string; description: string }[];
  const skillItems = (key: string): string[] =>
    t(`skills.categories.${key}.items`, { returnObjects: true }) as string[];

  return (
    <div>

      {/* ───────────── STICKY NAV ───────────── */}
      <nav className="wk-nav" data-testid="nav">
        <div className="wk-nav-inner">
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="wk-nav-logo"
            data-testid="nav-logo"
          >
            Bert Bello
          </button>

          {/* Desktop nav links */}
          <div className="wk-nav-links">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="wk-nav-link"
                data-active={activeSection === link.id || undefined}
                data-section={link.id}
                data-testid={`nav-${link.id}`}
              >
                {link.label}
              </button>
            ))}
            <a
              href="/Humberto_Bello_Resume.pdf"
              download="Humberto_Bello_Resume.pdf"
              className="wk-btn-outline wk-btn-uppercase"
              data-testid="nav-resume"
            >
              {t("nav.resume")}
            </a>
          </div>

          {/* Right cluster */}
          <div className="wk-flex-row">
            {/* Language switcher */}
            <div className="wk-lang-switcher">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="wk-lang-btn"
                  data-active={currentLang === lang.code || undefined}
                  data-testid={`lang-${lang.code}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Mobile resume — icon + text pill */}
            <a
              href="/Humberto_Bello_Resume.pdf"
              download="Humberto_Bello_Resume.pdf"
              className="wk-nav-toggle wk-btn-uppercase"
              title={t("nav.resume")}
              data-testid="nav-resume-mobile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {t("nav.resume")}
            </a>

            {/* CTA — filled teal button */}
            <a
              href="mailto:humberto.bello@protonmail.com"
              className="wk-btn-cta"
              data-testid="nav-contact"
              title={t("nav.getInTouch")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span className="wk-btn-text-desktop">{t("nav.getInTouch")}</span>
            </a>
          </div>
        </div>
      </nav>

      <main id="main-content">

      {/* ───────────── HERO ───────────── */}
      <section
        id="hero"
        className="wk-hero"
        data-testid="section-hero"
      >
        <div className="wk-hero-inner wk-container">
          {/* Left — full-bleed photo, desktop only */}
          <div
            className="wk-hero-panel wk-anim-fade-left"
            data-testid="hero-photo-col"
          >
            <picture>
              <source
                srcSet={`${headshotAvif1x} 350w, ${headshotAvif} 700w`}
                type="image/avif"
                media="(min-width: 768px)"
                sizes="(max-width: 1280px) 50vw, 640px"
              />
              <source
                srcSet={`${headshotWebp1x} 350w, ${headshotWebp} 700w`}
                type="image/webp"
                media="(min-width: 768px)"
                sizes="(max-width: 1280px) 50vw, 640px"
              />
              <img
                src={headshotWebp}
                alt="Humberto Bert Bello"
                fetchPriority="high"
                loading="eager"
                width={700}
                height={700}
                sizes="(max-width: 1280px) 50vw, 640px"
                data-testid="hero-headshot"
              />
            </picture>
            {/* Warm vellum fade on right edge */}
            <div className="wk-hero-fade" />
            {/* Subtle warm overlay on photo */}
            <div className="wk-hero-overlay" />
          </div>

          {/* Right — content column */}
          <div className="wk-hero-content" data-testid="hero-content-col">
            {/* Mobile headshot */}
            <div
              className="wk-anim-fade-scale wk-mobile-headshot wk-mobile-hidden"
              data-testid="hero-photo-mobile"
            >
              <div className="wk-mobile-headshot-frame">
                <div className="wk-mobile-headshot-border" />
                <picture>
                  <source
                    srcSet={`${headshotAvif1x} 350w, ${headshotAvif} 700w`}
                    type="image/avif"
                    media="(max-width: 767px)"
                    sizes="336px"
                  />
                  <source
                    srcSet={`${headshotWebp1x} 350w, ${headshotWebp} 700w`}
                    type="image/webp"
                    media="(max-width: 767px)"
                    sizes="336px"
                  />
                  <img
                    src={headshotWebp}
                    alt="Humberto Bert Bello"
                    fetchPriority="high"
                    loading="eager"
                    width={700}
                    height={700}
                    sizes="336px"
                    className="wk-mobile-headshot-img"
                  />
                </picture>
              </div>
            </div>

            {/* Hero content */}
            <div
              className="wk-anim-fade-right"
              style={{ animationDelay: "0.1s" }}
            >
              {/* Name */}
              <h1
                className="wk-hero-heading"
                data-testid="hero-name"
              >
                Humberto{" "}
                <span className="wk-hero-name-accent">
                  &ldquo;Bert&rdquo;
                </span>{" "}
                Bello
              </h1>

              {/* Title / subtitle */}
              <p
                className="wk-hero-subtitle"
                data-testid="hero-title"
              >
                {t("hero.title")}
              </p>

              {/* Stat cards */}
              <div className="wk-stat-grid">
                {[
                  { value: "20+", key: "architecture" },
                  { value: "15+", key: "teams" },
                  { value: "3",   key: "continents" },
                  { value: "19M+",key: "subscribers" },
                ].map((stat, i) => (
                  <div
                    key={stat.key}
                    className="wk-stat-card wk-anim-fade-up"
                    style={{ animationDelay: `${0.3 + i * 0.07}s` }}
                    data-testid={`stat-${stat.key}`}
                  >
                    <div className="wk-stat-value">
                      {stat.value}
                    </div>
                    <div className="wk-stat-label">
                      {t(`hero.stats.${stat.key}`)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bullets */}
              <div className="wk-bullet-list">
                {heroBullets.map((point, i) => (
                  <div
                    key={i}
                    className="wk-bullet-row wk-anim-fade-left-sm"
                    style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                    data-testid={`hero-bullet-${i}`}
                  >
                    <div className="wk-bullet-dot" />
                    <p className="wk-bullet-text">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              {/* Compliance / tech tags */}
              <div className="wk-tag-list">
                {["GDPR", "HIPAA", "SOX", "SOC", "FHIR", "AWS", "GCP", "Azure", "Gen AI"].map((tag) => (
                  <Tag key={tag} label={tag} accent />
                ))}
              </div>

              {/* Credential badge */}
              <div
                className="wk-cred-badge wk-anim-fade-up-sm"
                style={{ animationDelay: "0.85s" }}
                data-testid="hero-credential-badge"
              >
                <svg className="wk-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                {t("hero.badge")}
              </div>

              {/* Scroll hint */}
              <div>
                <button
                  onClick={() => scrollTo("skills")}
                  className="wk-scroll-hint wk-anim-bounce-y"
                  data-testid="hero-scroll-hint"
                >
                  {t("hero.scrollHint")} <svg className="wk-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── SKILLS ───────────── */}
      <section
        id="skills"
        className="wk-section wk-bg-default"
        data-testid="section-skills"
      >
        <div className="wk-container">
          <SectionHeader
            label={t("skills.label")}
            title={t("skills.title")}
            subtitle={t("skills.subtitle")}
          />

          <div className="wk-grid-skills">
            {skillCategories.map((cat, i) => {
              const items = skillItems(cat.key);
              return (
                <FadeInSection key={cat.key} delay={i * 0.07}>
                  <div className="wk-card wk-card-skills" data-testid={`skill-card-${cat.key}`}>
                    <div className="wk-card-header-lg">
                      <div className="wk-icon-box">
                        <SvgIcon name={cat.icon} className="wk-icon-md" />
                      </div>
                      <h3 className="wk-card-title">
                        {t(`skills.categories.${cat.key}.title`)}
                      </h3>
                    </div>

                    <ul className="wk-dot-list">
                      {items.map((item, j) => (
                        <li key={j} className="wk-dot-item">
                          <div className="wk-dot-marker" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── EXPERIENCE ───────────── */}
      <section
        id="experience"
        className="wk-section wk-bg-sunken"
        data-testid="section-experience"
      >
        <div className="wk-container">
          <SectionHeader
            label={t("experience.label")}
            title={t("experience.title")}
            subtitle={t("experience.subtitle")}
          />

          <div className="wk-grid-experience">
            {experienceEntries.map((exp, i) => (
              <FadeInSection key={i} delay={i * 0.07}>
                <div className="wk-card wk-card-experience" data-testid={`exp-card-${i}`}>
                  <div className="wk-card-header-sm">
                    <div className="wk-icon-box-sm">
                      <svg className="wk-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                    </div>
                    <div>
                      <p className="wk-card-eyebrow">
                        {exp.company}
                      </p>
                      <h3 className="wk-card-title">
                        {exp.highlight}
                      </h3>
                    </div>
                  </div>

                  <hr className="wk-card-rule" />

                  <p className="wk-card-text">
                    {exp.description}
                  </p>

                  <div className="wk-tag-list">
                    {expTags[i].map((tag) => (
                      <Tag key={tag} label={tag} />
                    ))}
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── CLIENTS ───────────── */}
      <section
        id="clients"
        className="wk-section wk-bg-default"
        data-testid="section-clients"
      >
        <div className="wk-container">
          <SectionHeader
            label={t("clients.label")}
            title={t("clients.title")}
            subtitle={t("clients.subtitle")}
          />

          <div className="wk-grid-clients">
            {clientNames.map((name, i) => {
              const iconName = clientIcons[i];
              const catKey = clientKeys[i];
              return (
                <FadeInSection key={name} delay={i * 0.06}>
                  <div
                    className="wk-card wk-card-client"
                    data-testid={`client-card-${i}`}
                  >
                    <div className="wk-icon-box-lg">
                      <SvgIcon name={iconName} className="wk-icon-md" />
                    </div>
                    <h3 className="wk-card-client-name">
                      {name}
                    </h3>
                    <p className="wk-card-category">
                      {t(`clients.categories.${catKey}`)}
                    </p>
                  </div>
                </FadeInSection>
              );
            })}
          </div>

          {/* ── CTA Banner ── */}
          <FadeInSection>
            <div
              className="wk-card wk-cta-card"
              data-testid="cta-banner"
            >
              <div className="wk-cta-accent" />

              <div className="wk-cta-pill">
                <svg className="wk-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                {t("cta.badge")}
              </div>

              <h3 className="wk-cta-heading">
                {t("cta.title")}
              </h3>

              <p className="wk-cta-text">
                {t("cta.subtitle")}
              </p>

              <div className="wk-btn-group">
                <a
                  href="mailto:humberto.bello@protonmail.com"
                  className="wk-btn-cta wk-btn-cta-shadow"
                  data-testid="cta-email"
                >
                  {t("cta.email")} <svg className="wk-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wk-btn-outline wk-btn-outline-dark"
                  data-testid="cta-linkedin"
                >
                  {t("cta.linkedin")}
                </a>
                <a
                  href="https://github.com/humbertobellor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wk-btn-outline wk-btn-outline-dark"
                  data-testid="cta-github"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  {t("cta.github")}
                </a>
                <a
                  href="https://substack.com/@humbertobellor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wk-btn-outline wk-btn-outline-dark"
                  data-testid="cta-substack"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>
                  Substack
                </a>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      </main>

      {/* ───────────── FOOTER ───────────── */}
      <footer className="wk-footer" data-testid="footer">
        <div className="wk-container">
          <div className="wk-footer-inner">
            <span className="wk-footer-name">
              Humberto &ldquo;Bert&rdquo; Bello
            </span>
            <span className="wk-footer-sep">|</span>
            <span className="wk-footer-role">
              {t("footer.role")}
            </span>
          </div>
          <div className="wk-footer-location">
            <svg className="wk-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {t("footer.location")}
          </div>
        </div>
        <Changelog />
      </footer>
    </div>
  );
}
