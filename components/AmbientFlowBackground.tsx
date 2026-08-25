"use client";

import { useEffect, useRef } from "react";

type RGB = [number, number, number];

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

type FlowLayer = {
  y: number;
  amplitude: number;
  width: number;
  speed: number;
  phase: number;
  direction: 1 | -1;
  opacity: number;
};

const BLUE: RGB = [72, 126, 242];
const PINK_LAVENDER: RGB = [218, 117, 204];
const BLUSH: RGB = [244, 151, 184];
const MINT: RGB = [83, 194, 171];

const FLOW_LAYERS: FlowLayer[] = [
  { y: 0.18, amplitude: 54, width: 210, speed: 0.0002, phase: 0.2, direction: 1, opacity: 0.11 },
  { y: 0.49, amplitude: 76, width: 280, speed: 0.00015, phase: 2.1, direction: -1, opacity: 0.125 },
  { y: 0.8, amplitude: 62, width: 240, speed: 0.00018, phase: 4.2, direction: 1, opacity: 0.105 },
];

function rgba([red, green, blue]: RGB, alpha: number) {
  return `rgba(${red},${green},${blue},${alpha})`;
}

export function AmbientFlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;
    const lowPowerDevice = (navigator.hardwareConcurrency ?? 8) <= 4;
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let resizeFrame = 0;
    let animationTime = 0;
    let previousFrameTime = 0;
    let lastDrawTime = 0;

    function drawFrame(time: number) {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";
      drawAtmosphere(time);
      FLOW_LAYERS.forEach((layer, index) => drawFlowLayer(time, layer, index));
    }

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, saveData || lowPowerDevice ? 1.15 : 1.4);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawFrame(animationTime);
    }

    function drawAtmosphere(time: number) {
      const radius = Math.max(width, height) * 0.72;
      const glows: Array<{ color: RGB; x: number; y: number; phase: number; opacity: number }> = [
        { color: BLUE, x: 0.12, y: 0.2, phase: 0, opacity: 0.12 },
        { color: PINK_LAVENDER, x: 0.66, y: 0.26, phase: 2.3, opacity: 0.145 },
        { color: BLUSH, x: 0.88, y: 0.72, phase: 4.1, opacity: 0.11 },
        { color: MINT, x: 0.25, y: 0.84, phase: 5.4, opacity: 0.105 },
      ];

      for (const glow of glows) {
        const x = width * glow.x + Math.sin(time * 0.00008 + glow.phase) * width * 0.08;
        const y = height * glow.y + Math.cos(time * 0.00007 + glow.phase) * height * 0.09;
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, rgba(glow.color, glow.opacity));
        gradient.addColorStop(0.46, rgba(glow.color, glow.opacity * 0.48));
        gradient.addColorStop(1, rgba(glow.color, 0));
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      }
    }

    function traceWave(time: number, layer: FlowLayer) {
      const mobileScale = width < 680 ? 0.78 : 1;
      const baseY = height * layer.y
        + Math.sin(time * 0.00009 + layer.phase) * height * 0.035;
      const amplitude = layer.amplitude * mobileScale;
      context.beginPath();
      for (let x = -80; x <= width + 80; x += 20) {
        const y = baseY
          + Math.sin(x * 0.0048 + time * layer.speed * layer.direction + layer.phase) * amplitude
          + Math.cos(x * 0.0022 - time * layer.speed * 0.56 + layer.phase) * amplitude * 0.48;
        if (x === -80) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
    }

    function drawFlowLayer(time: number, layer: FlowLayer, index: number) {
      const mobileScale = width < 680 ? 0.72 : 1;
      const flowGradient = context.createLinearGradient(0, 0, width, height * 0.22);
      if (index === 1) {
        flowGradient.addColorStop(0, rgba(MINT, layer.opacity * 0.76));
        flowGradient.addColorStop(0.46, rgba(PINK_LAVENDER, layer.opacity * 1.12));
        flowGradient.addColorStop(1, rgba(BLUE, layer.opacity * 0.82));
      } else {
        flowGradient.addColorStop(0, rgba(BLUE, layer.opacity * 0.9));
        flowGradient.addColorStop(0.54, rgba(PINK_LAVENDER, layer.opacity * 1.2));
        flowGradient.addColorStop(1, rgba(MINT, layer.opacity * 0.84));
      }

      traceWave(time, layer);
      context.strokeStyle = flowGradient;
      context.lineWidth = layer.width * mobileScale;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.stroke();

      const crestGradient = context.createLinearGradient(0, 0, width, 0);
      crestGradient.addColorStop(0, rgba(BLUE, layer.opacity * 0.2));
      crestGradient.addColorStop(0.55, rgba(BLUSH, layer.opacity * 0.42));
      crestGradient.addColorStop(1, rgba(MINT, layer.opacity * 0.18));
      traceWave(time + 480, { ...layer, amplitude: layer.amplitude * 0.72 });
      context.strokeStyle = crestGradient;
      context.lineWidth = layer.width * mobileScale * 0.42;
      context.stroke();
    }

    function animate(time: number) {
      animationFrame = 0;
      if (document.hidden || reducedMotion.matches) return;
      const elapsed = previousFrameTime ? Math.min(time - previousFrameTime, 50) : 0;
      previousFrameTime = time;
      animationTime += elapsed;
      const frameInterval = width < 680 || saveData || lowPowerDevice ? 34 : 24;
      if (time - lastDrawTime >= frameInterval) {
        drawFrame(animationTime);
        lastDrawTime = time;
      }
      animationFrame = window.requestAnimationFrame(animate);
    }

    function startAnimation() {
      if (!animationFrame && !document.hidden && !reducedMotion.matches) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    }

    function stopAnimation() {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      previousFrameTime = 0;
    }

    function handleResize() {
      const nextWidth = window.innerWidth;
      const widthUnchanged = Math.abs(nextWidth - width) <= 1;
      const mobileViewport = Math.min(nextWidth, width) < 680;

      // Mobile browser toolbars change only the visual viewport height while
      // scrolling. Resizing the canvas for those events clears and redraws the
      // fixed background repeatedly, which makes the ribbons appear to twitch.
      if (mobileViewport && widthUnchanged) return;
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        resizeCanvas();
      });
    }

    function handleVisibilityChange() {
      if (document.hidden) stopAnimation();
      else startAnimation();
    }

    function handleMotionPreference() {
      if (reducedMotion.matches) {
        stopAnimation();
        drawFrame(animationTime);
      } else {
        startAnimation();
      }
    }

    resizeCanvas();
    startAnimation();
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      stopAnimation();
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-flow-background" aria-hidden="true" />;
}
