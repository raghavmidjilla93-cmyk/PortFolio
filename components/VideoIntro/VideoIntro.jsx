'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from './VideoIntro.module.css';

// Three.js layer is SSR-incompatible — load only on client
const CinematicLayer = dynamic(() => import('./CinematicLayer'), { ssr: false });

// ── Inline SVG icons ─────────────────────────────────────────────────────────
const IconPlay = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="6,3 20,12 6,21" />
  </svg>
);

const IconPause = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="5"  y="3" width="4" height="18" rx="1" />
    <rect x="15" y="3" width="4" height="18" rx="1" />
  </svg>
);

const IconMuted = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none"/>
    <line x1="23" y1="9"  x2="17" y2="15"/>
    <line x1="17" y1="9"  x2="23" y2="15"/>
  </svg>
);

const IconUnmuted = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
);

const IconChevron = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <polyline points="6,9 12,15 18,9"/>
  </svg>
);

// ── Component ────────────────────────────────────────────────────────────────
/**
 * VideoIntro
 *
 * Props:
 *   videoSrc  — path to the hero video (relative to /public)
 *               default: '/hero-video.mp4'
 *   name      — { first, last } object for the hero headline
 *   tagline   — short uppercase string above the name
 *   role      — subtitle / skills string below the name
 */
export default function VideoIntro({
  videoSrc = '/hero-video.mp4',
  name     = { first: 'RAGHAVENDAR', last: 'MIDJILLA' },
  tagline  = 'Software Developer · Automation & AI Agents',
  role     = 'Building intelligent systems that think, act, and scale.',
}) {
  const sectionRef  = useRef(null);
  const mainVideoRef = useRef(null);
  const bgVideoRef   = useRef(null);
  const gsapCtxRef   = useRef(null);

  const [muted,         setMuted]         = useState(true);
  const [playing,       setPlaying]       = useState(true);
  const [showSoundHint, setShowSoundHint] = useState(true);
  const [loaded,        setLoaded]        = useState(false);
  const playingRef = useRef(true); // mirrors playing state, safe inside observers

  // ── Auto-hide sound hint ─────────────────────────────────────────────────
  useEffect(() => {
    const id = setTimeout(() => setShowSoundHint(false), 5000);
    return () => clearTimeout(id);
  }, []);

  // ── Pause video when scrolled out of view, resume when back ─────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const main = mainVideoRef.current;
        const bg   = bgVideoRef.current;
        if (!main) return;

        if (entries[0].isIntersecting) {
          // Back in view — only resume if user hadn't manually paused
          if (main.paused && playingRef.current) {
            main.play().catch(() => {});
            bg?.play().catch(() => {});
          }
        } else {
          // Scrolled away — always pause
          main.pause();
          bg?.pause();
        }
      },
      { threshold: 0.1 } // pause when 90% of the section is off-screen
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []); // no dependency on playing — uses ref instead

  // ── GSAP entrance animation ──────────────────────────────────────────────
  useEffect(() => {
    let gsapMod, ScrollTriggerMod;

    const initGsap = async () => {
      const [{ gsap }, { default: ST }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ST);
      gsapMod = gsap;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.3 });

        tl.fromTo(
          `.${styles.tagline}`,
          { autoAlpha: 0, y: 28, letterSpacing: '0.4em' },
          { autoAlpha: 1, y: 0,  letterSpacing: '0.18em', duration: 1.1, ease: 'power3.out' }
        )
        .fromTo(
          `.${styles.firstName}`,
          { autoAlpha: 0, y: 80, skewY: 4 },
          { autoAlpha: 1, y: 0,  skewY: 0, duration: 1.3, ease: 'expo.out' },
          '-=0.6'
        )
        .fromTo(
          `.${styles.lastName}`,
          { autoAlpha: 0, y: 80, skewY: 4 },
          { autoAlpha: 1, y: 0,  skewY: 0, duration: 1.3, ease: 'expo.out' },
          '-=1.0'
        )
        .fromTo(
          `.${styles.roleLine}`,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0,  duration: 1,   ease: 'power3.out' },
          '-=0.7'
        )
        .fromTo(
          `.${styles.scrollIndicator}`,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 1, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          `.${styles.controls}`,
          { autoAlpha: 0, x: 20 },
          { autoAlpha: 1, x: 0,  duration: 0.9, ease: 'power3.out' },
          '-=0.9'
        );
      }, sectionRef);

      gsapCtxRef.current = ctx;
    };

    initGsap();

    return () => {
      if (gsapCtxRef.current) gsapCtxRef.current.revert();
    };
  }, []);

  // ── Controls ─────────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    const v = mainVideoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    setShowSoundHint(false);
  }, []);

  const togglePlay = useCallback(() => {
    const v = mainVideoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      bgVideoRef.current?.play();
      setPlaying(true);
      playingRef.current = true;
    } else {
      v.pause();
      bgVideoRef.current?.pause();
      setPlaying(false);
      playingRef.current = false;
    }
  }, []);

  const scrollToNext = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  const onVideoLoaded = useCallback(() => setLoaded(true), []);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} className={styles.hero}>

      {/* ── Blurred ambient background video ─────────────────────────────── */}
      <video
        ref={bgVideoRef}
        className={styles.bgVideo}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* ── Gradient overlays ─────────────────────────────────────────────── */}
      <div className={styles.gradientTop}    aria-hidden="true" />
      <div className={styles.gradientBottom} aria-hidden="true" />
      <div className={styles.gradientLeft}   aria-hidden="true" />
      <div className={styles.gradientRight}  aria-hidden="true" />
      <div className={styles.vignetteRing}   aria-hidden="true" />

      {/* ── Three.js bokeh layer ──────────────────────────────────────────── */}
      <CinematicLayer />

      {/* ── Foreground talking-head video ─────────────────────────────────── */}
      <div className={`${styles.videoWrapper} ${loaded ? styles.videoVisible : ''}`}>
        <video
          ref={mainVideoRef}
          className={styles.mainVideo}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={onVideoLoaded}
        />
        {/* Subtle radial glow beneath the figure */}
        <div className={styles.videoGlow} aria-hidden="true" />
      </div>

      {/* ── Content overlay ───────────────────────────────────────────────── */}
      <div className={styles.content}>
        <p className={styles.tagline}>{tagline}</p>

        <h1 className={styles.nameBlock} aria-label={`${name.first} ${name.last}`}>
          <span className={styles.firstName}>{name.first}</span>
          <span className={styles.lastName}>{name.last}</span>
        </h1>

        <p className={styles.roleLine}>{role}</p>
      </div>

      {/* ── Glassmorphism controls ────────────────────────────────────────── */}
      <div className={styles.controls} role="group" aria-label="Video controls">
        <button
          className={styles.controlBtn}
          onClick={togglePlay}
          aria-label={playing ? 'Pause video' : 'Play video'}
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? <IconPause /> : <IconPlay />}
        </button>

        <button
          className={styles.controlBtn}
          onClick={toggleMute}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <IconMuted /> : <IconUnmuted />}
        </button>
      </div>

      {/* ── "Tap for sound" badge ─────────────────────────────────────────── */}
      {showSoundHint && (
        <button
          className={styles.soundHint}
          onClick={toggleMute}
          aria-label="Tap to enable sound"
        >
          <span className={styles.soundPulse} aria-hidden="true" />
          TAP FOR SOUND
        </button>
      )}

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <button
        className={styles.scrollIndicator}
        onClick={scrollToNext}
        aria-label="Scroll to next section"
      >
        <span className={styles.scrollLabel}>SCROLL</span>
        <span className={styles.scrollLine} aria-hidden="true" />
        <IconChevron />
      </button>

    </section>
  );
}
