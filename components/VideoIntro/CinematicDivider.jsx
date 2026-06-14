'use client';

import { useEffect, useRef } from 'react';
import styles from './CinematicDivider.module.css';

const words = [
  { text: 'PLAYWRIGHT',  sub: 'TypeScript / JavaScript' },
  { text: 'SELENIUM',    sub: 'Java · POM · TestNG' },
  { text: 'AI TESTING',  sub: 'Self-Healing · GPT' },
  { text: 'UIPATH RPA',  sub: 'Certified Advanced Dev' },
];

export default function CinematicDivider() {
  const sectionRef = useRef(null);
  const imgRef     = useRef(null);
  const textRef    = useRef(null);

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      const img     = imgRef.current;
      if (!section || !img) return;

      const rect   = section.getBoundingClientRect();
      const vh     = window.innerHeight;
      // Progress from -1 (above viewport) to 1 (below viewport)
      const progress = (vh / 2 - rect.top - rect.height / 2) / (vh / 2);
      // Subtle parallax: image moves opposite to scroll at 20% speed
      img.style.transform = `translateY(${progress * -60}px) scale(1.12)`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial position
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        const { gsap } = await import('gsap');

        gsap.fromTo(`.${styles.quote}`,
          { opacity: 0, y: 36, letterSpacing: '0.5em' },
          { opacity: 1, y: 0,  letterSpacing: '0.12em', duration: 1.4, ease: 'expo.out', delay: 0.2 }
        );
        gsap.fromTo(`.${styles.pill}`,
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.4)', delay: 0.6 }
        );
        gsap.fromTo(`.${styles.line}`,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: 'power3.inOut', delay: 0.3 }
        );
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-hidden="true">
      {/* ── Background photo with parallax ─────────────────────────── */}
      <div className={styles.imgWrap}>
        <img
          ref={imgRef}
          src="/images/ragha-cinematic.png"
          alt="Raghavendar Midjilla"
          className={styles.img}
        />
      </div>

      {/* ── Overlays ───────────────────────────────────────────────── */}
      <div className={styles.overlayTop}    aria-hidden="true" />
      <div className={styles.overlayBottom} aria-hidden="true" />
      <div className={styles.overlayCenter} aria-hidden="true" />

      {/* ── Text content ───────────────────────────────────────────── */}
      <div ref={textRef} className={styles.content}>
        <div className={styles.line} aria-hidden="true" />

        <p className={styles.quote}>
          8 years. 4 domains. Zero flakiness tolerated.
        </p>

        <div className={styles.pills}>
          {words.map((w) => (
            <div key={w.text} className={styles.pill}>
              <span className={styles.pillTitle}>{w.text}</span>
              <span className={styles.pillSub}>{w.sub}</span>
            </div>
          ))}
        </div>

        <div className={styles.line} aria-hidden="true" />
      </div>
    </section>
  );
}
