'use client';

import { useEffect, useRef } from 'react';
import styles from './Certifications.module.css';

const certs = [
  {
    title:  'ISTQB Certified Tester',
    body:   'International Software Testing Qualifications Board',
    icon:   '✦',
  },
  {
    title:  'UIPath Advanced Developer',
    body:   'Certified RPA Developer — UIPath',
    icon:   '⬡',
  },
  {
    title:  'Agile Project Management',
    body:   'Certified Agile PM',
    icon:   '◈',
  },
  {
    title:  'Microsoft Power Automate',
    body:   'Certified — Microsoft',
    icon:   '⬙',
  },
];

const education = [
  {
    degree:  'M.S. in Computer & Information Technology',
    school:  'Youngstown State University',
    location: 'Ohio, USA',
    period:  '2022 – 2023',
  },
  {
    degree:  'B.Tech in Information Technology',
    school:  'Jawaharlal Nehru Technological University',
    location: 'India',
    period:  '2011 – 2015',
  },
];

export default function Certifications() {
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
    gsap.fromTo(`.${styles.certCard}`,
      { opacity: 0, y: 28, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
    gsap.fromTo(`.${styles.eduCard}`,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.4 }
    );
    gsap.fromTo(`.${styles.sectionLabel}, .${styles.sectionHeading}`,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
    );
  };

  return (
    <section ref={sectionRef} id="certifications" className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>

        {/* ── Certifications ─────────────────────────────── */}
        <div className={styles.block}>
          <span className={styles.sectionLabel}>Credentials</span>
          <h2 className={styles.sectionHeading}>
            Certifications &amp; <span className={styles.highlight}>Education</span>
          </h2>

          <div className={styles.certGrid}>
            {certs.map((c) => (
              <div key={c.title} className={styles.certCard}>
                <span className={styles.certIcon} aria-hidden="true">{c.icon}</span>
                <h3 className={styles.certTitle}>{c.title}</h3>
                <p className={styles.certBody}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        {/* ── Education ──────────────────────────────────── */}
        <div className={styles.eduGrid}>
          {education.map((e) => (
            <div key={e.degree} className={styles.eduCard}>
              <div className={styles.eduPeriod}>{e.period}</div>
              <h3 className={styles.eduDegree}>{e.degree}</h3>
              <p className={styles.eduSchool}>{e.school}</p>
              <p className={styles.eduLocation}>{e.location}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
