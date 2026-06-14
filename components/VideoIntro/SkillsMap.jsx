'use client';

import { useEffect, useRef } from 'react';
import styles from './SkillsMap.module.css';

export default function SkillsMap() {
  const sectionRef  = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        const { gsap } = await import('gsap');
        gsap.fromTo(`.${styles.label}`,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
        gsap.fromTo(`.${styles.heading}`,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', delay: 0.15 }
        );
        gsap.fromTo(`.${styles.frame}`,
          { opacity: 0, scale: 0.96, y: 32 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: 0.35 }
        );
        gsap.fromTo(`.${styles.tagItem}`,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', delay: 0.5 }
        );
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const coreTags = [
    'Playwright', 'Selenium WebDriver', 'TypeScript', 'Java',
    'REST Assured', 'Postman', 'CI/CD', 'GitHub Actions',
    'Jenkins', 'AI Self-Healing', 'UIPath RPA', 'Agile / SAFe',
    'Appium', 'JMeter', 'Azure DevOps', 'AWS',
  ];

  return (
    <section ref={sectionRef} id="skills" className={styles.section}>
      <div className={styles.glowLeft}  aria-hidden="true" />
      <div className={styles.glowRight} aria-hidden="true" />

      <div className={styles.inner}>

        {/* ── Header ───────────────────────────────────────── */}
        <div className={styles.header}>
          <span className={styles.label}>Skills Progression</span>
          <h2 className={styles.heading}>
            Mastery &amp; <span className={styles.accent}>Tech Stack</span>
          </h2>
        </div>

        {/* ── Infographic frame ─────────────────────────────── */}
        <div className={styles.frame}>
          {/* Corner accent lines */}
          <div className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
          <div className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
          <div className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
          <div className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />

          <img
            src="/images/skills-map.png"
            alt="Skills Progression & Mastery chart"
            className={styles.mapImg}
          />

          {/* Subtle gradient bleed at bottom to fade into background */}
          <div className={styles.fadeBottom} aria-hidden="true" />
        </div>

        {/* ── Core skill tags ───────────────────────────────── */}
        <div className={styles.tagCloud}>
          {coreTags.map((t) => (
            <span key={t} className={styles.tagItem}>{t}</span>
          ))}
        </div>

      </div>
    </section>
  );
}
