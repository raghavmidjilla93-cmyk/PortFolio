'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * CinematicLayer
 * A fullscreen Three.js canvas that renders warm bokeh particles
 * over the hero section. Pointer-events are disabled so it never
 * blocks clicks on controls beneath it.
 */
export default function CinematicLayer() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene / Camera ───────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 6;

    // ── Circular soft-glow texture ───────────────────────────────
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 128;
    texCanvas.height = 128;
    const ctx = texCanvas.getContext('2d');
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0,    'rgba(255, 255, 255, 1)');
    grd.addColorStop(0.25, 'rgba(255, 185,  90, 0.7)');
    grd.addColorStop(0.6,  'rgba(255, 130,  40, 0.2)');
    grd.addColorStop(1,    'rgba(0,     0,   0, 0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);
    const particleTex = new THREE.CanvasTexture(texCanvas);

    // ── Particle geometry ────────────────────────────────────────
    const COUNT = 280;
    const positions  = new Float32Array(COUNT * 3);
    const colors     = new Float32Array(COUNT * 3);
    const phases     = new Float32Array(COUNT);      // per-particle sine phase
    const amplitudes = new Float32Array(COUNT * 2);  // x / y amplitude

    const warm  = new THREE.Color('#ff8c3a');
    const white = new THREE.Color('#ffe8cc');
    const cool  = new THREE.Color('#6eb5ff');        // subtle blue-monitor accent

    for (let i = 0; i < COUNT; i++) {
      // Spread across a wide frustum so particles extend off-screen
      positions[i * 3]     = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      phases[i]          = Math.random() * Math.PI * 2;
      amplitudes[i * 2]  = 0.08 + Math.random() * 0.18;  // x
      amplitudes[i * 2 + 1] = 0.06 + Math.random() * 0.14; // y

      // 80 % warm/white, 20 % cool monitor-blue accent
      const t    = Math.random();
      const type = Math.random();
      let c;
      if (type < 0.15) {
        c = cool.clone().lerp(white, t * 0.4);
      } else {
        c = warm.clone().lerp(white, t);
      }
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

    // ── Material ─────────────────────────────────────────────────
    const material = new THREE.PointsMaterial({
      size:           0.22,
      map:            particleTex,
      vertexColors:   true,
      blending:       THREE.AdditiveBlending,
      transparent:    true,
      depthWrite:     false,
      sizeAttenuation: true,
      opacity:        0.85,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Snapshot of original positions for sine animation ────────
    const origPos = Float32Array.from(positions);

    // ── Mouse parallax state ─────────────────────────────────────
    let targetX = 0;
    let targetY = 0;
    let currX   = 0;
    let currY   = 0;

    const onMouseMove = (e) => {
      targetX = (e.clientX / window.innerWidth  - 0.5);
      targetY = (e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Resize ───────────────────────────────────────────────────
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // ── Animation loop ───────────────────────────────────────────
    const startTime = performance.now();
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = (performance.now() - startTime) / 1000; // seconds
      const pos = geometry.attributes.position.array;

      for (let i = 0; i < COUNT; i++) {
        const ph = phases[i];
        pos[i * 3]     = origPos[i * 3]     + Math.cos(t * 0.18 + ph) * amplitudes[i * 2];
        pos[i * 3 + 1] = origPos[i * 3 + 1] + Math.sin(t * 0.22 + ph) * amplitudes[i * 2 + 1];
      }
      geometry.attributes.position.needsUpdate = true;

      // Smooth parallax — very subtle so it feels cinematic, not game-like
      currX += (targetX * 0.6 - currX) * 0.04;
      currY += (-targetY * 0.4 - currY) * 0.04;
      camera.position.x = currX;
      camera.position.y = currY;

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ──────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize',    onResize);
      geometry.dispose();
      material.dispose();
      particleTex.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position:      'absolute',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        3,
      }}
    />
  );
}
