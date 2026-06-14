'use client';

import { useEffect, useRef } from 'react';
import styles from './Experience.module.css';

const jobs = [
  {
    role:     'Lead SDET / Senior QA Automation Lead',
    company:  'KeyBank',
    location: 'Boston, MA',
    period:   'May 2024 – Present',
    type:     'current',
    tags:     ['Playwright', 'TypeScript', 'Selenium', 'REST Assured', 'Jenkins', 'AI/GPT', 'AWS'],
    highlights: [
      'Lead end-to-end UI automation with Playwright (TypeScript) — cross-browser parallel execution across Chrome, Firefox, and Safari.',
      'Integrated OpenAI/GPT self-healing locators into Selenium and Playwright frameworks, significantly reducing flakiness and maintenance effort.',
      'Automated API testing with REST Assured and Cucumber BDD; validated REST microservices for payload accuracy, schema compliance, and SQL-level data integrity.',
      'Set up Jenkins CI/CD pipelines and GitHub Actions for nightly batch runs and on-demand execution with real-time reporting.',
    ],
  },
  {
    role:     'Sr. Automation Engineer — Omnia Platform',
    company:  'Deloitte',
    location: 'India',
    period:   'Oct 2021 – Aug 2022',
    type:     'past',
    tags:     ['E2E Testing', 'UAT', 'Azure Boards', 'Azure SQL', 'Manual Testing', 'Agile/Scrum'],
    highlights: [
      'Owned E2E and UAT testing on Deloitte Omnia — a global cloud-based Audit & Assurance platform used across the full engagement lifecycle.',
      'Validated role-based access control (RBAC) across Partner, Manager, Senior Associate, Staff, and IT Auditor roles; enforced engagement isolation and permission boundaries.',
      'Tested review notes workflow end-to-end, archive pod immutability, PCAOB/AICPA compliance, and sign-off chain validation.',
      'Performed SQL validation on Azure SQL, verified data integrity across the entire engagement lifecycle.',
    ],
  },
  {
    role:     'Lead Test Automation Engineer',
    company:  'Vectramind Technologies',
    location: 'India',
    period:   'Jul 2019 – Jul 2021',
    type:     'past',
    tags:     ['Selenium', 'Java', 'Appium', 'UIPath RPA', 'HL7', 'Salesforce', 'Telecom', 'Healthcare'],
    highlights: [
      'Built Selenium WebDriver (Java) automation framework from scratch for Synapse Telecom — billing, service provisioning, and subscriber management.',
      'Led SDET for FirstPass QMS at KFSH & Aldara Hospital (Saudi Arabia) — Salesforce-based healthcare platform managing the full patient journey from appointment to pharmacy.',
      'Automated React Native mobile app (Appium) for patient-facing iOS/Android; integrated with Jenkins CI/CD and Selenium Grid.',
      'Delivered UIPath RPA payroll automation — full zero-touch workflow eliminating 100% of manual processing from data read to payslip dispatch.',
    ],
  },
  {
    role:     'Software Engineer, QA',
    company:  'W3 Softech Private Limited',
    location: 'India',
    period:   'Dec 2015 – Jul 2019',
    type:     'past',
    tags:     ['Selenium', 'Java', 'Postman', 'Jenkins', 'SQL', 'Jira'],
    highlights: [
      'Created and executed manual and automated test cases — functional, regression, smoke, sanity, and GUI testing.',
      'Maintained Selenium WebDriver (Java) scripts; performed API testing via Postman; managed CI/CD with Jenkins.',
      'SQL-level data validation on Oracle DB, MySQL, and DB2 across multiple test environments.',
    ],
  },
];

export default function Experience() {
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
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const animateIn = async () => {
    const { gsap } = await import('gsap');
    gsap.fromTo(`.${styles.sectionLabel}`,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
    gsap.fromTo(`.${styles.sectionHeading}`,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: 0.15 }
    );
    gsap.fromTo(`.${styles.job}`,
      { opacity: 0, x: -24 },
      { opacity: 1, x: 0, duration: 0.85, stagger: 0.18, ease: 'power3.out', delay: 0.3 }
    );
  };

  return (
    <section ref={sectionRef} id="experience" className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.headerRow}>
          <span className={styles.sectionLabel}>Career</span>
          <h2 className={styles.sectionHeading}>
            Work <span className={styles.highlight}>Experience</span>
          </h2>
        </div>

        <div className={styles.timeline}>
          {/* Vertical line */}
          <div className={styles.timelineLine} aria-hidden="true" />

          {jobs.map((job, i) => (
            <div key={i} className={`${styles.job} ${job.type === 'current' ? styles.jobCurrent : ''}`}>

              {/* Dot on the timeline */}
              <div className={styles.dot} aria-hidden="true">
                {job.type === 'current' && <span className={styles.dotPulse} />}
              </div>

              <div className={styles.jobCard}>
                <div className={styles.jobHeader}>
                  <div className={styles.jobMeta}>
                    <span className={styles.jobPeriod}>{job.period}</span>
                    <span className={styles.jobLocation}>{job.location}</span>
                  </div>
                  <div>
                    <h3 className={styles.jobRole}>{job.role}</h3>
                    <p className={styles.jobCompany}>{job.company}</p>
                  </div>
                </div>

                <ul className={styles.highlights}>
                  {job.highlights.map((h, j) => (
                    <li key={j} className={styles.highlight}>{h}</li>
                  ))}
                </ul>

                <div className={styles.tags}>
                  {job.tags.map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
