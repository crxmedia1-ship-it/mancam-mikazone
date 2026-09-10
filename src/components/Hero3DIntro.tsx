"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

const INTRO_MS = 3800;
const FALL_END = 1.8;
const IMPACT_END = 2.2;
const BRAND_END = 3.4;
const INTRO_S = 3.8;
const LOGO_SRC =
  "https://res.cloudinary.com/dgphys1xd/image/upload/v1788992084/Photoroom_20260909_181404_r3umw2.png";
const EMERALD = 0x10b981;
const MORTAR = 0xf7f4ee;
const SACK_W = 1.4;
const SACK_H = 2.0;
const SACK_D = 0.65;
const SACK_X_DESKTOP = 1.22;
const SACK_X_MOBILE = 1.02;
const FLOOR_Y = -1.18;
const REST_Y = FLOOR_Y + SACK_H * 0.5;
const START_Y = 1.92;
const GRAVITY = (2 * (START_Y - REST_Y)) / (FALL_END * FALL_END);

type SackLook = {
  baseTop: string;
  baseBottom: string;
  stripe: string;
  stripeText: string;
  label: string;
  sub: string;
  paper: boolean;
};

function createIndustrialSackGeometry(detail: number) {
  const segW = 8 + detail * 2;
  const segH = 12 + detail * 3;
  const segD = 5 + detail;
  const geometry = new THREE.BoxGeometry(SACK_W, SACK_H, SACK_D, segW, segH, segD);
  const radius = 0.2;
  const hw = SACK_W / 2;
  const hh = SACK_H / 2;
  const hd = SACK_D / 2;
  const pos = geometry.attributes.position;
  const inner = new THREE.Vector3();
  const offset = new THREE.Vector3();

  for (let i = 0; i < pos.count; i += 1) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    inner.set(
      THREE.MathUtils.clamp(x, -hw + radius, hw - radius),
      THREE.MathUtils.clamp(y, -hh + radius, hh - radius),
      THREE.MathUtils.clamp(z, -hd + radius, hd - radius),
    );
    offset.set(x - inner.x, y - inner.y, z - inner.z);
    const len = offset.length();
    if (len > 1e-5) {
      offset.multiplyScalar(radius / len);
      x = inner.x + offset.x;
      y = inner.y + offset.y;
      z = inner.z + offset.z;
    }

    const ny = THREE.MathUtils.clamp(y / hh, -1, 1);
    const belly = Math.pow(Math.cos(ny * Math.PI * 0.5), 1.35);
    x *= 1 + 0.14 * belly;
    z *= 1 + 0.26 * belly;

    const fold = Math.pow(Math.abs(ny), 7.2);
    const pinch = 1 - fold * 0.28;
    x *= pinch;
    z *= pinch;

    if (Math.abs(ny) > 0.76) {
      const k = (Math.abs(ny) - 0.76) / 0.24;
      z += Math.sin((x / hw) * Math.PI * 4) * 0.02 * k;
      y += (ny > 0 ? -1 : 1) * k * 0.03;
    }

    pos.setXYZ(i, x, y, z);
  }

  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function createSackTexture(look: SackLook, mobile: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = mobile ? 384 : 640;
  canvas.height = mobile ? 560 : 920;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const { width: w, height: h } = canvas;
  const body = ctx.createLinearGradient(0, 0, 0, h);
  body.addColorStop(0, look.baseTop);
  body.addColorStop(1, look.baseBottom);
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, w, h);

  ctx.globalAlpha = 0.12;
  for (let y = 0; y < h; y += 3) {
    ctx.fillStyle = y % 6 === 0 ? "#ffffff" : "#0f172a";
    ctx.fillRect(0, y, w, 1);
  }
  ctx.globalAlpha = 1;

  const stripeY = h * 0.28;
  const stripeH = h * 0.16;
  ctx.fillStyle = look.stripe;
  ctx.fillRect(0, stripeY, w, stripeH);

  ctx.fillStyle = look.stripeText;
  ctx.textAlign = "center";
  ctx.font = `800 ${Math.round(w * 0.092)}px system-ui, sans-serif`;
  ctx.fillText("MIKAZONE", w / 2, stripeY + stripeH * 0.62);

  ctx.fillStyle = look.paper ? "#0f172a" : "#ffffff";
    ctx.font = `700 ${Math.round(w * 0.056)}px system-ui, sans-serif`;
    ctx.fillText(look.label, w / 2, stripeY + stripeH + h * 0.1);

  ctx.globalAlpha = 0.72;
  ctx.font = `600 ${Math.round(w * 0.038)}px system-ui, sans-serif`;
  ctx.fillText(look.sub, w / 2, stripeY + stripeH + h * 0.16);
  ctx.fillText("25 kg  ·  INDUSTRIAL GRADE", w / 2, h * 0.78);
  ctx.globalAlpha = 1;

  ctx.strokeStyle = look.paper ? "rgba(15,23,42,0.16)" : "rgba(255,255,255,0.28)";
  ctx.lineWidth = 10;
  ctx.strokeRect(18, 18, w - 36, h - 36);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = mobile ? 1 : 4;
  texture.needsUpdate = true;
  return texture;
}

function createDustTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const glow = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    glow.addColorStop(0, "rgba(255,255,255,0.95)");
    glow.addColorStop(0.45, "rgba(255,255,255,0.35)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function Hero3DIntro({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completedRef = useRef(false);
  const [showBrand, setShowBrand] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [fading, setFading] = useState(false);

  function finish() {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const completeTimer = window.setTimeout(finish, INTRO_MS);
    const fadeTimer = window.setTimeout(() => setFading(true), BRAND_END * 1000);
    const canvas = canvasRef.current;
    if (!canvas) {
      document.body.style.overflow = previousOverflow;
      return () => {
        window.clearTimeout(completeTimer);
        window.clearTimeout(fadeTimer);
        document.body.style.overflow = previousOverflow;
      };
    }

    const isMobile = window.innerWidth < 768 || "ontouchstart" in window;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(THREE.MathUtils.clamp(window.devicePixelRatio || 1, 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const sackX = isMobile ? SACK_X_MOBILE : SACK_X_DESKTOP;
    const camera = new THREE.PerspectiveCamera(isMobile ? 42 : 40, 1, 0.1, 48);
    const cameraBase = new THREE.Vector3(0, 0.2, isMobile ? 7.8 : 7.15);
    camera.position.copy(cameraBase);
    camera.lookAt(0, 0.55, 0);

    const sackGeo = createIndustrialSackGeometry(isMobile ? 2 : 4);
    const hpmcTex = createSackTexture(
      {
        baseTop: "#10B981",
        baseBottom: "#059669",
        stripe: "#ffffff",
        stripeText: "#059669",
        label: "MIKAZONE HPMC MK 200P",
        sub: "CELLULOSE ETHER",
        paper: true,
      },
      isMobile,
    );
    const rppTex = createSackTexture(
      {
        baseTop: "#ffffff",
        baseBottom: "#f4f1ea",
        stripe: "#2563EB",
        stripeText: "#ffffff",
        label: "MIKAZONE VAE RPP 3510",
        sub: "REDISPERSIBLE POLYMER",
        paper: true,
      },
      isMobile,
    );

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
    hpmcSack.castShadow = true;
    rppSack.castShadow = true;
    hpmcSack.layers.enable(1);
    rppSack.layers.enable(1);
    hpmcSack.position.set(-sackX, START_Y, 0);
    rppSack.position.set(sackX, START_Y, 0);
    hpmcSack.rotation.set(0.06, 0.38, -0.08);
    rppSack.rotation.set(0.05, -0.36, 0.07);
    scene.add(hpmcSack, rppSack);

    const floorGeo = new THREE.CircleGeometry(9, isMobile ? 32 : 64);
    const floorMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = FLOOR_Y;
    floor.receiveShadow = true;
    scene.add(floor);

    const blobGeo = new THREE.CircleGeometry(0.72, 32);
    const blobMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.04,
      depthWrite: false,
    });
    const hpmcBlob = new THREE.Mesh(blobGeo, blobMat);
    const rppBlob = new THREE.Mesh(blobGeo, blobMat.clone());
    hpmcBlob.rotation.x = -Math.PI / 2;
    rppBlob.rotation.x = -Math.PI / 2;
    hpmcBlob.position.set(-sackX, FLOOR_Y + 0.01, 0);
    rppBlob.position.set(sackX, FLOOR_Y + 0.01, 0);
    scene.add(hpmcBlob, rppBlob);

    const particleCount = isMobile ? 90 : 170;
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
    const dustTex = createDustTexture();
    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.16 : 0.22,
      map: dustTex,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(particleGeo, particleMat));

    scene.add(new THREE.AmbientLight(0xffffff, 0.72));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(3.6, 7.4, 5.4);
    key.castShadow = true;
    key.shadow.mapSize.set(isMobile ? 512 : 1024, isMobile ? 512 : 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.camera.left = -6;
    key.shadow.camera.right = 6;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    key.shadow.radius = isMobile ? 2.5 : 4.5;
    key.shadow.bias = -0.0007;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xf8fafc, 0.72);
    fill.position.set(-5.4, 2.6, 3.4);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0x10b981, 1.15);
    rim.position.set(0.2, 3.4, -5.8);
    rim.layers.set(1);
    scene.add(rim);
    camera.layers.enable(1);

    let impacted = false;
    let brandArmed = false;
    let shake = 0;
    let raf = 0;
    let disposed = false;
    let lastElapsed = 0;
    const startMs = performance.now();

    const preload = new Image();
    preload.src = LOGO_SRC;

    function resize() {
      if (!canvas) return;
      const vv = window.visualViewport;
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(
        1,
        Math.round(
          rect.width ||
            canvas.clientWidth ||
            vv?.width ||
            document.documentElement.clientWidth,
        ),
      );
      const h = Math.max(
        1,
        Math.round(
          rect.height ||
            canvas.clientHeight ||
            vv?.height ||
            document.documentElement.clientHeight,
        ),
      );
      renderer.setPixelRatio(
        THREE.MathUtils.clamp(window.devicePixelRatio || 1, 1, 2),
      );
      renderer.setSize(w, h, false);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    function spawnDust() {
      for (let i = 0; i < particleCount; i += 1) {
        const originX = i % 2 === 0 ? -sackX : sackX;
        const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.3;
        const radius = 0.12 + Math.random() * 0.22;
        const speed = 1.4 + Math.random() * 2.4;
        particlePositions[i * 3] = originX + Math.cos(angle) * radius;
        particlePositions[i * 3 + 1] = FLOOR_Y + 0.08 + Math.random() * 0.1;
        particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
        particleVel[i * 3] = Math.cos(angle) * speed;
        particleVel[i * 3 + 1] = 1.4 + Math.random() * 2.1;
        particleVel[i * 3 + 2] = Math.sin(angle) * speed * 0.85;
      }
      particleGeo.attributes.position.needsUpdate = true;
      particleMat.opacity = 1;
      shake = 1;
      setShaking(true);
      window.setTimeout(() => setShaking(false), 320);
    }

    function setBlob(mesh: THREE.Mesh, x: number, y: number) {
      const proximity = 1 - THREE.MathUtils.clamp((y - REST_Y) / 3.6, 0, 1);
      mesh.position.x = x;
      mesh.scale.setScalar(0.55 + proximity * 1.15);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.03 + proximity * 0.16;
    }

    function tick() {
      if (disposed) return;
      const elapsed = (performance.now() - startMs) / 1000;
      const dt = Math.min(elapsed - lastElapsed, 0.033);
      lastElapsed = elapsed;

      if (elapsed < FALL_END) {
        const y = START_Y - 0.5 * GRAVITY * elapsed * elapsed;
        const spin = elapsed / FALL_END;
        hpmcSack.position.y = y;
        rppSack.position.y = y;
        hpmcSack.rotation.y = 0.38 + Math.sin(elapsed * 1.15) * 0.16;
        hpmcSack.rotation.z = -0.08 + spin * 0.1;
        rppSack.rotation.y = -0.36 - Math.sin(elapsed * 1.08) * 0.15;
        rppSack.rotation.z = 0.07 - spin * 0.09;
          camera.lookAt(0, y * 0.38 + 0.22, 0);
        setBlob(hpmcBlob, -sackX, y);
        setBlob(rppBlob, sackX, y);
      } else {
        if (!impacted) {
          impacted = true;
          hpmcSack.position.y = REST_Y;
          rppSack.position.y = REST_Y;
          spawnDust();
        }

        const impactU = THREE.MathUtils.clamp(
          (elapsed - FALL_END) / (IMPACT_END - FALL_END),
          0,
          1,
        );
        const squashPeak = Math.exp(-Math.pow((impactU - 0.22) / 0.14, 2));
        const liveSquash = elapsed < IMPACT_END ? squashPeak : 0;
        const sy = 1 - 0.2 * liveSquash;
        const sx = 1 + 0.14 * liveSquash;
        const sz = 1 + 0.1 * liveSquash;
        const bounce =
          elapsed < IMPACT_END
            ? Math.sin(impactU * Math.PI) * 0.26 * Math.exp(-impactU * 1.8)
            : 0;
        hpmcSack.scale.set(sx, sy, sz);
        rppSack.scale.set(sx, sy, sz);
        hpmcSack.position.y = REST_Y + bounce;
        rppSack.position.y = REST_Y + bounce;

        hpmcSack.rotation.x = THREE.MathUtils.damp(hpmcSack.rotation.x, 0.05, 4.2, dt);
        hpmcSack.rotation.y = THREE.MathUtils.damp(hpmcSack.rotation.y, 0.32, 3.4, dt);
        hpmcSack.rotation.z = THREE.MathUtils.damp(hpmcSack.rotation.z, -0.045, 4.2, dt);
        rppSack.rotation.x = THREE.MathUtils.damp(rppSack.rotation.x, 0.04, 4.2, dt);
        rppSack.rotation.y = THREE.MathUtils.damp(rppSack.rotation.y, -0.34, 3.4, dt);
        rppSack.rotation.z = THREE.MathUtils.damp(rppSack.rotation.z, 0.05, 4.2, dt);

        setBlob(hpmcBlob, -sackX, REST_Y);
        setBlob(rppBlob, sackX, REST_Y);

        particleMat.opacity = Math.max(0, 1 - (elapsed - FALL_END) * 1.15);
        for (let i = 0; i < particleCount; i += 1) {
          particleVel[i * 3 + 1] -= 5.6 * dt;
          particlePositions[i * 3] += particleVel[i * 3] * dt;
          particlePositions[i * 3 + 1] += particleVel[i * 3 + 1] * dt;
          particlePositions[i * 3 + 2] += particleVel[i * 3 + 2] * dt;
          if (particlePositions[i * 3 + 1] < FLOOR_Y + 0.02) {
            particlePositions[i * 3 + 1] = FLOOR_Y + 0.02;
            particleVel[i * 3 + 1] *= -0.18;
            particleVel[i * 3] *= 0.72;
            particleVel[i * 3 + 2] *= 0.72;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;

        shake *= Math.pow(0.0008, dt);
        camera.position.x = cameraBase.x + Math.sin(elapsed * 62) * shake * 0.12;
        camera.position.y = cameraBase.y + Math.cos(elapsed * 54) * shake * 0.08;
        camera.position.z = cameraBase.z + Math.sin(elapsed * 40) * shake * 0.05;
        camera.lookAt(0, 0.12, 0);

        if (!brandArmed && elapsed >= IMPACT_END) {
          brandArmed = true;
          setShowBrand(true);
        }
      }

      if (elapsed > BRAND_END) {
        const fade = THREE.MathUtils.clamp(
          (elapsed - BRAND_END) / (INTRO_S - BRAND_END),
          0,
          1,
        );
        hpmcMat.opacity = 1 - fade;
        rppMat.opacity = 1 - fade;
        hpmcMat.transparent = true;
        rppMat.transparent = true;
      }

      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    renderer.render(scene, camera);
    raf = window.requestAnimationFrame(() => {
      resize();
      raf = window.requestAnimationFrame(tick);
    });

    return () => {
      disposed = true;
      window.clearTimeout(completeTimer);
      window.clearTimeout(fadeTimer);
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      document.body.style.overflow = previousOverflow;
      sackGeo.dispose();
      hpmcMat.dispose();
      rppMat.dispose();
      hpmcTex.dispose();
      rppTex.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      blobGeo.dispose();
      blobMat.dispose();
      (rppBlob.material as THREE.MeshBasicMaterial).dispose();
      particleGeo.dispose();
      particleMat.dispose();
      dustTex.dispose();
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
        fading
          ? { opacity: 0, x: 0, y: 0 }
          : shaking
            ? { opacity: 1, x: [0, -7, 6, -4, 3, 0], y: [0, 4, -3, 2, 0] }
            : { opacity: 1, x: 0, y: 0 }
      }
      exit={{ opacity: 0 }}
      transition={
        fading
          ? { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
          : shaking
            ? { duration: 0.32, ease: "easeOut" }
            : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
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
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: fading ? 0 : 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
