'use client';

import { useEffect, useRef } from 'react';
import styles from './About.module.css';

const skills = [
  {
    category: 'UI Automation',
    items: ['Playwright (TS/JS)', 'Selenium WebDriver', 'Cypress', 'Appium'],
  },
  {
    category: 'API & Backend',
    items: ['REST Assured', 'Postman', 'Karate Framework', 'REST / SOAP'],
  },
  {
    category: 'Languages',
    items: ['Java', 'TypeScript', 'JavaScript', 'Python', 'SQL'],
  },
  {
    category: 'CI/CD & DevOps',
    items: ['Jenkins', 'GitHub Actions', 'Azure DevOps', 'AWS'],
  },
  {
    category: 'RPA & Automation',
    items: ['UIPath (Certified)', 'Power Automate', 'n8n', 'Playwright Workers'],
  },
  {
    category: 'AI-Driven QA',
    items: ['GPT Self-Healing Locators', 'GitHub Copilot', 'Claude API', 'AI Test Generation'],
  },
];

const whatIDo = [
  {
    number: '01',
    title: 'QA Automation Leadership',
    desc:
      'I architect and lead end-to-end test automation frameworks from scratch — Playwright, Selenium, Cypress — across web, API, and mobile for enterprise platforms at KeyBank, Deloitte, and healthcare systems.',
  },
  {
    number: '02',
    title: 'AI-Driven Testing',
    desc:
      'I integrate OpenAI/GPT self-healing locators, AI-assisted test generation, and GitHub Copilot into automation pipelines — dramatically reducing flakiness and maintenance overhead.',
  },
  {
    number: '03',
    title: 'RPA & Intelligent Automation',
    desc:
      'As a Certified UIPath Advanced Developer, I deliver zero-touch automation solutions — from internal payroll pipelines to enterprise workflow bots — eliminating manual effort entirely.',
  },
];

const stats = [
  { value: '8+',   label: 'Years Experience' },
  { value: '4',    label: 'Domains Covered' },
  { value: '100%', label: 'Payroll Automation Delivered' },
  { value: '4',    label: 'Certifications' },
];

export default function About() {
  const sectionRef  = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateIn();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const animateIn = async () => {
    const { gsap } = await import('gsap');

    gsap.fromTo(`.${styles.label}`,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
    gsap.fromTo(`.${styles.heading}`,
      { opacity: 0, y: 48 },
      { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', delay: 0.15 }
    );
    gsap.fromTo(`.${styles.bio}`,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.28 }
    );
    gsap.fromTo(`.${styles.statItem}`,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.4 }
    );
    gsap.fromTo(`.${styles.card}`,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.5 }
    );
    gsap.fromTo(`.${styles.skillGroup}`,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.65 }
    );
  };

  return (
    <section ref={sectionRef} id="about" className={styles.section}>

      <div className={styles.glowLeft}  aria-hidden="true" />
      <div className={styles.glowRight} aria-hidden="true" />

      <div className={styles.inner}>

        {/* ── Header — split layout ───────────────────────── */}
        <div className={styles.headerSplit}>
          {/* Left: text */}
          <div className={styles.headerText}>
            <span className={styles.label}>About Me</span>
            <h2 className={styles.heading}>
              Senior QA Automation Lead<br />
              <span className={styles.highlight}>Ex-Deloitte · KeyBank</span>
            </h2>
            <p className={styles.bio}>
              I'm <strong>Raghavendar Midjilla</strong>, a Senior QA Automation Engineer with{' '}
              <strong>8+ years</strong> of experience leading end-to-end test automation for web,
              API, and mobile applications. I've delivered across{' '}
              <strong>Telecom, Healthcare, Financial Services, and Audit</strong> domains —
              building scalable Playwright and Selenium frameworks from scratch in Agile and SAFe
              environments.
              <br /><br />
              At <strong>KeyBank</strong>, I'm currently leading UI and API automation with
              AI-assisted self-healing locators, CI/CD pipeline integration, and cross-browser
              parallel execution. Previously at <strong>Deloitte</strong>, I owned E2E and UAT
              testing on the Omnia global audit platform. I'm a{' '}
              <strong>Certified UIPath Advanced Developer</strong> and hold an{' '}
              <strong>M.S. in Computer &amp; Information Technology</strong> from Youngstown State
              University.
            </p>
          </div>

          {/* Right: portrait */}
          <div className={styles.portraitWrap}>
            <div className={styles.portraitGlow} aria-hidden="true" />
            <img
              src="/images/ragha-desk.jpg"
              alt="Raghavendar Midjilla at his desk"
              className={styles.portrait}
            />
            {/* Floating badge */}
            <div className={styles.portraitBadge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              Available for opportunities
            </div>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────── */}
        <div className={styles.stats}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── What I do ──────────────────────────────────── */}
        <div className={styles.cards}>
          {whatIDo.map((item) => (
            <div key={item.number} className={styles.card}>
              <span className={styles.cardNumber}>{item.number}</span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* ── Skills ─────────────────────────────────────── */}
        <div className={styles.skillsBlock}>
          <span className={styles.skillsLabel}>Tech Stack</span>
          <div className={styles.skillsGrid}>
            {skills.map((group) => (
              <div key={group.category} className={styles.skillGroup}>
                <h4 className={styles.skillCategory}>{group.category}</h4>
                <ul className={styles.skillList}>
                  {group.items.map((s) => (
                    <li key={s} className={styles.skillItem}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────── */}
        <div className={styles.cta}>
          <a href="mailto:raghavmidjilla93@gmail.com" className={styles.ctaBtn}>
            Let's work together →
          </a>
          <a
            href="tel:+13303276328"
            className={`${styles.ctaBtn} ${styles.ctaBtnSecondary}`}
          >
            +1 (330) 327-6328
          </a>
        </div>

      </div>
    </section>
  );
}
