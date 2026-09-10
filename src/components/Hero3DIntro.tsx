"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

const INTRO_MS = 2200;
const LOGO_SRC =
  "https://res.cloudinary.com/dgphys1xd/image/upload/v1788992084/Photoroom_20260909_181404_r3umw2.png";
const EMERALD = 0x10b981;
const MORTAR = 0xf7f4ee;

type SackLook = {
  band: string;
  bandDark: string;
  title: string;
  subtitle: string;
};

function createSackTexture(look: SackLook) {
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
  grain.addColorStop(1, `${look.band}14`);
  ctx.fillStyle = grain;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = look.band;
  ctx.fillRect(0, 118, canvas.width, 92);
  ctx.fillStyle = look.bandDark;
  ctx.fillRect(0, 210, canvas.width, 10);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 64px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(look.title, canvas.width / 2, 186);

  ctx.fillStyle = "#0f172a";
  ctx.font = "600 26px system-ui, sans-serif";
  ctx.fillText(look.subtitle, canvas.width / 2, 280);

  ctx.fillStyle = "rgba(15,23,42,0.45)";
  ctx.font = "500 22px system-ui, sans-serif";
  ctx.fillText("25 kg  ·  EXPO SPECIAL", canvas.width / 2, 430);

  ctx.strokeStyle = "rgba(15,23,42,0.12)";
  ctx.lineWidth = 8;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function Hero3DIntro({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completedRef = useRef(false);
  const [showBrand, setShowBrand] = useState(false);
  const [shaking, setShaking] = useState(false);

  function finish() {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const completeTimer = window.setTimeout(finish, INTRO_MS);
    const canvas = canvasRef.current;
    if (!canvas) {
      document.body.style.overflow = previousOverflow;
      return () => {
        window.clearTimeout(completeTimer);
        document.body.style.overflow = previousOverflow;
      };
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

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    const cameraBase = new THREE.Vector3(0, 0.35, 7.6);
    camera.position.copy(cameraBase);
    camera.lookAt(0, 1.2, 0);

    const hpmcTex = createSackTexture({
      band: "#10B981",
      bandDark: "#0f9f72",
      title: "HPMC 200P",
      subtitle: "CELLULOSE ETHER",
    });
    const rppTex = createSackTexture({
      band: "#1A6FB5",
      bandDark: "#155a94",
      title: "RPP 3510",
      subtitle: "VAE POLYMER",
    });

    const sackGeo = new THREE.BoxGeometry(1.12, 1.58, 0.36);
    const hpmcMat = new THREE.MeshLambertMaterial({
      map: hpmcTex,
      transparent: true,
      opacity: 1,
    });
    const rppMat = new THREE.MeshLambertMaterial({
      map: rppTex,
      transparent: true,
      opacity: 1,
    });
    const hpmcSack = new THREE.Mesh(sackGeo, hpmcMat);
    const rppSack = new THREE.Mesh(sackGeo, rppMat);
    hpmcSack.position.set(-1.05, 2.45, 0);
    rppSack.position.set(1.05, 2.45, 0);
    hpmcSack.rotation.set(0.16, 0.18, -0.08);
    rppSack.rotation.set(0.2, -0.16, 0.07);
    scene.add(hpmcSack, rppSack);

    const shadowGeo = new THREE.CircleGeometry(0.52, 48);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.04,
    });
    const hpmcShadow = new THREE.Mesh(shadowGeo, shadowMat);
    const rppShadow = new THREE.Mesh(shadowGeo, shadowMat.clone());
    hpmcShadow.rotation.x = -Math.PI / 2;
    rppShadow.rotation.x = -Math.PI / 2;
    hpmcShadow.position.set(-1.05, -1.18, 0);
    rppShadow.position.set(1.05, -1.18, 0);
    scene.add(hpmcShadow, rppShadow);

    const ringGeo = new THREE.RingGeometry(0.36, 0.52, 72);
    const ringMat = new THREE.MeshBasicMaterial({
      color: EMERALD,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const rppRingMat = ringMat.clone();
    const hpmcRing = new THREE.Mesh(ringGeo, ringMat);
    const rppRing = new THREE.Mesh(ringGeo, rppRingMat);
    hpmcRing.rotation.x = -Math.PI / 2;
    rppRing.rotation.x = -Math.PI / 2;
    hpmcRing.position.set(-1.05, -1.16, 0);
    rppRing.position.set(1.05, -1.16, 0);
    hpmcRing.scale.setScalar(0.15);
    rppRing.scale.setScalar(0.15);
    scene.add(hpmcRing, rppRing);

    const particleCount = isMobile ? 140 : 220;
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

    const startY = 2.45;
    const groundY = -0.52;
    const gravity = 4.12;
    let impactAt = 0;
    let impacted = false;
    let shake = 0;
    let brandArmed = false;
    let raf = 0;
    let disposed = false;
    let lastElapsed = 0;
    const startMs = performance.now();

    const preload = new Image();
    preload.src = LOGO_SRC;

    function resize() {
      if (!canvas) return;
      const w = Math.max(
        1,
        canvas.clientWidth ||
          Math.round(
            window.visualViewport?.width ?? document.documentElement.clientWidth,
          ),
      );
      const h = Math.max(
        1,
        canvas.clientHeight ||
          Math.round(
            window.visualViewport?.height ??
              document.documentElement.clientHeight,
          ),
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
        const originX = i % 2 === 0 ? -1.05 : 1.05;
        const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.24;
        const radius = 0.08 + Math.random() * 0.16;
        const speed = 2.2 + Math.random() * 3.4;
        particlePositions[i * 3] = originX + Math.cos(angle) * radius;
        particlePositions[i * 3 + 1] = -0.92 + Math.random() * 0.1;
        particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
        particleVel[i * 3] = Math.cos(angle) * speed;
        particleVel[i * 3 + 1] = 1.15 + Math.random() * 2.4;
        particleVel[i * 3 + 2] = Math.sin(angle) * speed;
      }
      particleGeo.attributes.position.needsUpdate = true;
      particleMat.opacity = 1;
      ringMat.opacity = 0.9;
      rppRingMat.opacity = 0.9;
      hpmcRing.scale.setScalar(0.2);
      rppRing.scale.setScalar(0.2);
      shake = 1;
      setShaking(true);
      window.setTimeout(() => setShaking(false), 280);
    }

    function tick() {
      if (disposed) return;
      const elapsed = (performance.now() - startMs) / 1000;
      const dt = Math.min(elapsed - lastElapsed, 0.033);
      lastElapsed = elapsed;

      if (!impacted) {
        const y = startY - 0.5 * gravity * elapsed * elapsed;
        if (y <= groundY) {
          impacted = true;
          impactAt = elapsed;
          hpmcSack.position.y = groundY;
          rppSack.position.y = groundY;
          spawnShockwave();
        } else {
          const t = elapsed;
          hpmcSack.position.y = y;
          rppSack.position.y = y;
          hpmcSack.rotation.x = 0.16 + t * 0.28;
          hpmcSack.rotation.y = 0.18 + t * 0.34;
          rppSack.rotation.x = 0.2 + t * 0.3;
          rppSack.rotation.y = -0.16 - t * 0.32;
          camera.lookAt(0, y * 0.42 + 0.08, 0);
          const proximity = 1 - THREE.MathUtils.clamp((y - groundY) / 3.4, 0, 1);
          const shadowScale = 0.55 + proximity * 1.05;
          hpmcShadow.scale.setScalar(shadowScale);
          rppShadow.scale.setScalar(shadowScale);
          shadowMat.opacity = 0.03 + proximity * 0.12;
          (rppShadow.material as THREE.MeshBasicMaterial).opacity =
            0.03 + proximity * 0.12;
        }
      } else {
        const after = elapsed - impactAt;
        const squash = 1 - Math.exp(-after * 18) * 0.16 * Math.cos(after * 22);
        hpmcSack.scale.set(1 + (1 - squash) * 0.08, squash, 1 + (1 - squash) * 0.05);
        rppSack.scale.set(1 + (1 - squash) * 0.08, squash, 1 + (1 - squash) * 0.05);
        hpmcSack.rotation.x = THREE.MathUtils.damp(hpmcSack.rotation.x, 0.04, 8, dt);
        hpmcSack.rotation.y = THREE.MathUtils.damp(hpmcSack.rotation.y, 0.22, 6, dt);
        rppSack.rotation.x = THREE.MathUtils.damp(rppSack.rotation.x, 0.05, 8, dt);
        rppSack.rotation.y = THREE.MathUtils.damp(rppSack.rotation.y, -0.2, 6, dt);
        hpmcMat.opacity = THREE.MathUtils.damp(
          hpmcMat.opacity,
          after > 0.32 ? 0 : 1,
          5,
          dt,
        );
        rppMat.opacity = THREE.MathUtils.damp(
          rppMat.opacity,
          after > 0.32 ? 0 : 1,
          5,
          dt,
        );

        hpmcRing.scale.addScalar(dt * 7.2);
        rppRing.scale.addScalar(dt * 7.2);
        ringMat.opacity = Math.max(0, 0.85 - after * 1.7);
        rppRingMat.opacity = Math.max(0, 0.85 - after * 1.7);

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

        if (!brandArmed && after > 0.18) {
          brandArmed = true;
          setShowBrand(true);
        }
      }

      renderer.render(scene, camera);
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
      window.clearTimeout(completeTimer);
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.body.style.overflow = previousOverflow;
      sackGeo.dispose();
      hpmcMat.dispose();
      rppMat.dispose();
      hpmcTex.dispose();
      rppTex.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      (rppShadow.material as THREE.MeshBasicMaterial).dispose();
      ringGeo.dispose();
      ringMat.dispose();
      rppRingMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
    // finish is stable for this mount; onComplete is invoked once via completedRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-white"
      initial={{ opacity: 1, x: 0, y: 0 }}
      animate={
        shaking
          ? { opacity: 1, x: [0, -8, 7, -5, 4, 0], y: [0, 5, -4, 3, 0] }
          : { opacity: 1, x: 0, y: 0 }
      }
      exit={{ opacity: 0 }}
      transition={
        shaking
          ? { duration: 0.28, ease: "easeOut" }
          : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
      }
      role="dialog"
      aria-label="MikaZone introduction"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full touch-none bg-white"
      />

      {showBrand ? (
        <motion.div
          className="pointer-events-none relative z-10 flex flex-col items-center px-6 text-center"
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
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
          <p className="mt-6 max-w-xl text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:text-xs">
            MikaZone USA • High Performance Construction Additives • BuildExpo
            2026
          </p>
        </motion.div>
      ) : null}

      <button
        type="button"
        onClick={finish}
        className="absolute right-4 top-4 z-50 rounded-full border border-slate-300 bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-500 backdrop-blur-md hover:text-slate-800"
      >
        Skip ✕
      </button>
    </motion.div>
  );
}
