# Cinematic Portfolio Hero — Setup Guide

## 1. Install dependencies

```bash
npm install three gsap
# gsap ScrollTrigger is included in the main gsap package
```

## 2. Place files

```
your-next-app/
├── public/
│   └── hero-video.mp4          ← drop your video here
├── components/
│   └── VideoIntro/
│       ├── VideoIntro.jsx
│       ├── CinematicLayer.jsx
│       └── VideoIntro.module.css
└── app/
    └── page.jsx
```

## 3. Use in your page

```jsx
// app/page.jsx
import VideoIntro from '@/components/VideoIntro/VideoIntro';

export default function HomePage() {
  return (
    <main>
      <VideoIntro
        videoSrc="/hero-video.mp4"
        name={{ first: 'RAGHAVENDAR', last: 'MIDJILLA' }}
        tagline="Software Developer · Automation & AI Agents"
        role="Building intelligent systems that think, act, and scale."
      />

      {/* Your next section — the scroll indicator scrolls here */}
      <section id="about" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
        {/* ... */}
      </section>
    </main>
  );
}
```

## 4. Font (optional but recommended)

Add Inter to your `app/layout.jsx` for the premium display feel:

```jsx
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Then update the CSS token:
```css
--font-display: var(--font-inter), system-ui, sans-serif;
--font-mono:    var(--font-mono),  monospace;
```

## 5. Next.js config (if Three.js causes issues)

```js
// next.config.js
const nextConfig = {
  transpilePackages: ['three'],
};
module.exports = nextConfig;
```

## 6. Customisation quick-reference

| What to change        | Where                              |
|-----------------------|------------------------------------|
| Name / tagline / role | Props on `<VideoIntro>`            |
| Particle count        | `COUNT` in `CinematicLayer.jsx`    |
| Particle colors       | `warm`, `white`, `cool` in Layer   |
| Orange accent color   | `--orange` in CSS module           |
| Text size             | `clamp()` values on `.firstName`   |
| Video position        | `.videoWrapper` right / width      |
| Sound-hint duration   | `setTimeout` in VideoIntro (ms)    |

## Architecture overview

```
VideoIntro.jsx            — orchestrator; video, controls, GSAP timeline
  └── CinematicLayer.jsx  — Three.js WebGL canvas (client-only, SSR-skipped)
VideoIntro.module.css     — all visual styling (no inline styles)
```

GSAP animations are scoped with `gsap.context()` and cleaned up on unmount.
Three.js geometry, material, and renderer are all disposed on unmount.
No memory leaks, no unnecessary re-renders.
