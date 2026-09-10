"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";

const INTRO_MS = 2200;
const EXIT_MS = 380;
const STORAGE_KEY = "hasSeenMancamIntro";
const LOGO_SRC =
  "https://res.cloudinary.com/dgphys1xd/image/upload/v1788992084/Photoroom_20260909_181404_r3umw2.png";
const EMERALD = 0x10b981;
const MORTAR = 0xf7f4ee;

type IntroStatus = "boot" | "intro" | "exiting" | "hidden";

function markIntroSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "true");
  } catch {
    /* private mode */
  }
}

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function createSackTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 704;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.fillStyle = "#f4f0e6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const grain = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grain.addColorStop(0, "rgba(255,255,255,0.35)");
  grain.addColorStop(1, "rgba(16,185,129,0.08)");
  ctx.fillStyle = grain;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#10B981";
  ctx.fillRect(0, 118, canvas.width, 92);
  ctx.fillStyle = "#0f9f72";
  ctx.fillRect(0, 210, canvas.width, 10);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 72px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("MIKAZONE", canvas.width / 2, 186);

  ctx.fillStyle = "#0f172a";
  ctx.font = "600 28px system-ui, sans-serif";
  ctx.fillText("CONSTRUCTION ADDITIVE", canvas.width / 2, 280);

  ctx.fillStyle = "rgba(15,23,42,0.45)";
  ctx.font = "500 22px system-ui, sans-serif";
  ctx.fillText("25 kg  ·  INDUSTRIAL GRADE", canvas.width / 2, 430);

  ctx.strokeStyle = "rgba(15,23,42,0.12)";
  ctx.lineWidth = 8;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function Hero3DIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finishRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<IntroStatus>("boot");
  const [showLogo, setShowLogo] = useState(false);

  const beginExit = useCallback(() => {
    markIntroSeen();
    setStatus((current) => (current === "hidden" ? current : "exiting"));
  }, []);

  useEffect(() => {
    finishRef.current = beginExit;
  }, [beginExit]);

  useEffect(() => {
    if (hasSeenIntro()) {
      setStatus("hidden");
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markIntroSeen();
      setStatus("hidden");
      return;
    }
    setStatus("intro");
  }, []);

  useEffect(() => {
    if (status !== "exiting") return;
    const timer = window.setTimeout(() => setStatus("hidden"), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "intro") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const canvas = canvasRef.current;
    if (!canvas) {
      document.body.style.overflow = previousOverflow;
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      finishRef.current?.();
      document.body.style.overflow = previousOverflow;
      return;
    }

    const isMobile = window.innerWidth < 768 || "ontouchstart" in window;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    const cameraBase = new THREE.Vector3(0, 0.05, 6.2);
    camera.position.copy(cameraBase);
    camera.lookAt(0, 0.15, 0);

    const texture = createSackTexture();
    const sackGeo = new THREE.BoxGeometry(1.22, 1.68, 0.38);
    const sackMat = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
    });
    const sack = new THREE.Mesh(sackGeo, sackMat);
    sack.position.set(0, 1.35, 0);
    sack.rotation.set(0.18, 0.12, -0.06);
    scene.add(sack);

    const shadowGeo = new THREE.CircleGeometry(0.55, 48);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.04,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.18;
    scene.add(shadow);

    const ringGeo = new THREE.RingGeometry(0.42, 0.58, 72);
    const ringMat = new THREE.MeshBasicMaterial({
      color: EMERALD,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.16;
    ring.scale.setScalar(0.15);
    scene.add(ring);

    const particleCount = isMobile ? 96 : 160;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleVel = new Float32Array(particleCount * 3);
    const emerald = new THREE.Color(EMERALD);
    const mortar = new THREE.Color(MORTAR);

    for (let i = 0; i < particleCount; i += 1) {
      const color = i % 3 === 0 ? emerald : mortar;
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.11 : 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(2.2, 6.4, 4.2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x10b981, 0.22);
    fill.position.set(-3, 2.4, 2);
    scene.add(fill);

    const startY = 1.35;
    const groundY = -0.62;
    const gravity = 9.2;
    let impactAt = 0;
    let impacted = false;
    let shake = 0;
    let logoArmed = false;
    let raf = 0;
    let disposed = false;
    let lastElapsed = 0;
    const clock = new THREE.Clock();

    const logoTimer = window.setTimeout(() => {
      const img = new Image();
      img.src = LOGO_SRC;
    }, 0);

    function resize() {
      const vv = window.visualViewport;
      const w = Math.max(
        1,
        Math.round(vv?.width ?? document.documentElement.clientWidth),
      );
      const h = Math.max(
        1,
        Math.round(vv?.height ?? document.documentElement.clientHeight),
      );
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
      renderer.setSize(w, h, false);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    function spawnShockwave() {
      for (let i = 0; i < particleCount; i += 1) {
        const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.24;
        const radius = 0.08 + Math.random() * 0.12;
        const speed = 2.4 + Math.random() * 3.6;
        particlePositions[i * 3] = Math.cos(angle) * radius;
        particlePositions[i * 3 + 1] = -0.95 + Math.random() * 0.08;
        particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
        particleVel[i * 3] = Math.cos(angle) * speed;
        particleVel[i * 3 + 1] = 1.1 + Math.random() * 2.2;
        particleVel[i * 3 + 2] = Math.sin(angle) * speed;
      }
      particleGeo.attributes.position.needsUpdate = true;
      particleMat.opacity = 1;
      ringMat.opacity = 0.9;
      ring.scale.setScalar(0.2);
      shake = 1;
    }

    function tick() {
      if (disposed) return;
      const elapsed = clock.getElapsedTime();
      const dt = Math.min(elapsed - lastElapsed, 0.033);
      lastElapsed = elapsed;

      if (!impacted) {
        const y = startY - 0.5 * gravity * elapsed * elapsed;
        if (y <= groundY) {
          impacted = true;
          impactAt = elapsed;
          sack.position.y = groundY;
          spawnShockwave();
        } else {
          const t = elapsed;
          sack.position.y = y;
          sack.rotation.x = 0.18 + t * 0.35;
          sack.rotation.y = 0.12 + t * 0.42;
          sack.rotation.z = -0.06 + t * 0.12;
          camera.lookAt(0, y * 0.25 + 0.05, 0);
          const proximity = 1 - THREE.MathUtils.clamp((y - groundY) / 4.4, 0, 1);
          shadow.scale.setScalar(0.45 + proximity * 1.15);
          shadowMat.opacity = 0.03 + proximity * 0.12;
        }
      } else {
        const after = elapsed - impactAt;
        const squash = 1 - Math.exp(-after * 18) * 0.16 * Math.cos(after * 22);
        sack.scale.set(1 + (1 - squash) * 0.08, squash, 1 + (1 - squash) * 0.05);
        sack.rotation.x = THREE.MathUtils.damp(sack.rotation.x, 0.02, 8, dt);
        sack.rotation.y = THREE.MathUtils.damp(sack.rotation.y, 0.18, 6, dt);
        sack.rotation.z = THREE.MathUtils.damp(sack.rotation.z, 0, 8, dt);
        sackMat.opacity = THREE.MathUtils.damp(
          sackMat.opacity,
          after > 0.28 ? 0 : 1,
          5,
          dt,
        );

        ring.scale.addScalar(dt * 7.2);
        ringMat.opacity = Math.max(0, 0.85 - after * 1.7);

        particleMat.opacity = Math.max(0, 1 - after * 1.35);
        for (let i = 0; i < particleCount; i += 1) {
          particleVel[i * 3 + 1] -= 6.4 * dt;
          particlePositions[i * 3] += particleVel[i * 3] * dt;
          particlePositions[i * 3 + 1] += particleVel[i * 3 + 1] * dt;
          particlePositions[i * 3 + 2] += particleVel[i * 3 + 2] * dt;
        }
        particleGeo.attributes.position.needsUpdate = true;

        shake *= Math.pow(0.001, dt);
        camera.position.x = cameraBase.x + Math.sin(elapsed * 78) * shake * 0.16;
        camera.position.y = cameraBase.y + Math.cos(elapsed * 64) * shake * 0.1;
        camera.position.z = cameraBase.z + Math.sin(elapsed * 50) * shake * 0.08;
        camera.lookAt(0, 0.05, 0);

        if (!logoArmed && after > 0.18) {
          logoArmed = true;
          setShowLogo(true);
        }
      }

      renderer.render(scene, camera);

      if (elapsed * 1000 >= INTRO_MS) {
        finishRef.current?.();
        return;
      }
      raf = window.requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = window.requestAnimationFrame(() => {
      resize();
      raf = window.requestAnimationFrame(tick);
    });

    return () => {
      disposed = true;
      window.clearTimeout(logoTimer);
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.body.style.overflow = previousOverflow;
      sackGeo.dispose();
      sackMat.dispose();
      texture.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [status]);

  if (status === "hidden") return null;

  return (
    <AnimatePresence>
      {status !== "hidden" ? (
        <motion.div
          key="mancam-intro"
          className="fixed inset-0 z-[80] overflow-hidden bg-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: status === "exiting" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="MikaZone introduction"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 block h-full w-full touch-none bg-white"
          />

          <AnimatePresence>
            {showLogo ? (
              <motion.div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.86 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="relative px-8"
                  style={{
                    filter:
                      "drop-shadow(0 0 28px rgba(16,185,129,0.55)) drop-shadow(0 0 64px rgba(16,185,129,0.28))",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={LOGO_SRC}
                    alt="MikaZone"
                    className="h-20 w-auto max-w-[min(78vw,340px)] object-contain sm:h-28"
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {status === "intro" ? (
            <button
              type="button"
              onClick={beginExit}
              className="absolute right-4 top-4 z-10 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400/80 transition hover:bg-slate-50 hover:text-slate-600"
            >
              Skip
            </button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
