"use client";

import { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = (aPosition + 1.0) * 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uTextureSize;
  uniform float uTime;
  uniform float uStrength;
  varying vec2 vUv;

  float tideField(vec2 point, float time) {
    float broad = sin(point.x * 2.4 + point.y * 1.2 + time * 0.62);
    float crossing = sin(-point.x * 1.35 + point.y * 3.6 - time * 0.48 + sin(point.x * 1.8 + time * 0.28) * 0.65);
    float curl = sin(length(point + vec2(sin(time * 0.19), cos(time * 0.16)) * 0.55) * 5.2 - time * 0.58);
    float ribbon = sin((point.x * 0.55 - point.y * 1.6) * 5.1 + time * 0.36 + sin(point.y * 3.0 - time * 0.22));
    return broad * 0.42 + crossing * 0.33 + curl * 0.18 + ribbon * 0.15;
  }

  vec2 coverUv(vec2 uv) {
    float viewportAspect = uResolution.x / uResolution.y;
    float textureAspect = uTextureSize.x / uTextureSize.y;
    vec2 scale = vec2(1.0);

    if (viewportAspect > textureAspect) {
      scale.y = textureAspect / viewportAspect;
    } else {
      scale.x = viewportAspect / textureAspect;
    }

    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 point = (vUv - 0.5) * vec2(aspect, 1.0);
    float epsilon = 0.018;
    float height = tideField(point, uTime);
    float rightHeight = tideField(point + vec2(epsilon, 0.0), uTime);
    float upperHeight = tideField(point + vec2(0.0, epsilon), uTime);
    vec2 gradient = vec2(rightHeight - height, upperHeight - height) / epsilon;

    vec2 textureUv = coverUv(vUv);
    vec2 aspectCorrection = vec2(uTextureSize.y / uTextureSize.x, 1.0);
    vec2 refraction = gradient * aspectCorrection * 0.016 * uStrength;
    refraction += vec2(
      sin(point.y * 4.2 + uTime * 0.34),
      cos(point.x * 3.5 - uTime * 0.29)
    ) * 0.0038 * uStrength;

    vec2 sampleUv = clamp(textureUv + refraction, 0.002, 0.998);
    vec2 prismOffset = normalize(gradient + vec2(0.0001)) * 0.0022 * uStrength;
    vec3 base = texture2D(uTexture, sampleUv).rgb;
    vec3 refracted = vec3(
      texture2D(uTexture, clamp(sampleUv + prismOffset, 0.002, 0.998)).r,
      base.g,
      texture2D(uTexture, clamp(sampleUv - prismOffset, 0.002, 0.998)).b
    );

    vec3 surfaceNormal = normalize(vec3(-gradient.x * 0.42, -gradient.y * 0.42, 1.0));
    vec3 lightDirection = normalize(vec3(-0.42, 0.58, 0.7));
    float specular = pow(max(dot(surfaceNormal, lightDirection), 0.0), 8.0);
    float softDepth = 0.985 + max(dot(surfaceNormal, vec3(0.22, -0.18, 0.96)), 0.0) * 0.035;
    vec3 color = mix(base, refracted, 0.42) * softDepth;
    color += vec3(0.92, 1.0, 0.97) * specular * 0.13;
    color = mix(color, color * vec3(0.975, 1.018, 1.014), 0.22);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("无法创建背景着色器");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "背景着色器编译失败";
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram();
  if (!program) throw new Error("无法创建背景渲染程序");
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? "背景渲染程序链接失败";
    gl.deleteProgram(program);
    throw new Error(message);
  }
  return program;
}

export function AmbientFlowBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      root.classList.add("is-fallback", "is-reduced-motion");
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      premultipliedAlpha: false,
    });

    if (!gl) {
      root.classList.add("is-fallback");
      return;
    }

    let animationFrame = 0;
    let disposed = false;
    let ready = false;
    let previousTime = 0;
    let elapsedTime = 0;
    let frameInterval = 1000 / 45;
    let program: WebGLProgram | null = null;
    let positionBuffer: WebGLBuffer | null = null;
    let texture: WebGLTexture | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const image = new Image();
    image.decoding = "async";

    const stopAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      previousTime = 0;
    };

    const markFallback = () => {
      stopAnimation();
      root.classList.remove("is-ready");
      root.classList.add("is-fallback");
    };

    const handleContextLost = () => markFallback();

    const startRenderer = () => {
      try {
        program = createProgram(gl);
        gl.useProgram(program);

        positionBuffer = gl.createBuffer();
        if (!positionBuffer) throw new Error("无法创建背景顶点缓冲区");
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        texture = gl.createTexture();
        if (!texture) throw new Error("无法创建背景纹理");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        const resolutionLocation = gl.getUniformLocation(program, "uResolution");
        const textureSizeLocation = gl.getUniformLocation(program, "uTextureSize");
        const timeLocation = gl.getUniformLocation(program, "uTime");
        const strengthLocation = gl.getUniformLocation(program, "uStrength");
        const textureLocation = gl.getUniformLocation(program, "uTexture");

        gl.uniform1i(textureLocation, 0);
        gl.uniform2f(textureSizeLocation, image.naturalWidth, image.naturalHeight);

        const resize = () => {
          const width = Math.max(canvas.clientWidth, 1);
          const height = Math.max(canvas.clientHeight, 1);
          const mobile = width < 720;
          frameInterval = 1000 / (mobile ? 30 : 45);
          const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1.05 : 1.4);
          const rawWidth = width * pixelRatio;
          const rawHeight = height * pixelRatio;
          const pixelBudget = mobile ? 1_250_000 : 2_800_000;
          const budgetScale = Math.min(1, Math.sqrt(pixelBudget / (rawWidth * rawHeight)));
          const nextWidth = Math.max(1, Math.round(rawWidth * budgetScale));
          const nextHeight = Math.max(1, Math.round(rawHeight * budgetScale));

          if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
            canvas.width = nextWidth;
            canvas.height = nextHeight;
          }

          gl.viewport(0, 0, nextWidth, nextHeight);
          gl.uniform2f(resolutionLocation, nextWidth, nextHeight);
          gl.uniform1f(strengthLocation, mobile ? 0.82 : 1);
        };

        const render = (timestamp: number) => {
          if (disposed || document.hidden) return;
          if (previousTime && timestamp - previousTime < frameInterval) {
            animationFrame = window.requestAnimationFrame(render);
            return;
          }
          if (previousTime) elapsedTime += Math.min((timestamp - previousTime) / 1000, 0.05);
          previousTime = timestamp;
          gl.uniform1f(timeLocation, elapsedTime);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          if (!ready) {
            ready = true;
            root.classList.remove("is-fallback");
            root.classList.add("is-ready");
          }
          animationFrame = window.requestAnimationFrame(render);
        };

        const handleVisibilityChange = () => {
          if (document.hidden) {
            stopAnimation();
          } else if (!animationFrame) {
            animationFrame = window.requestAnimationFrame(render);
          }
        };

        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(root);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        resize();
        animationFrame = window.requestAnimationFrame(render);

        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
      } catch {
        markFallback();
        return undefined;
      }
    };

    let removeVisibilityListener: (() => void) | undefined;
    image.addEventListener("load", () => {
      if (!disposed) removeVisibilityListener = startRenderer();
    }, { once: true });
    image.addEventListener("error", markFallback, { once: true });
    canvas.addEventListener("webglcontextlost", handleContextLost);
    image.src = "/tidal-glass-background.png";

    return () => {
      disposed = true;
      stopAnimation();
      removeVisibilityListener?.();
      resizeObserver?.disconnect();
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      if (texture) gl.deleteTexture(texture);
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (program) gl.deleteProgram(program);
    };
  }, []);

  return (
    <div ref={rootRef} className="ambient-flow-background is-fallback" aria-hidden="true">
      <div className="tidal-glass-fallback" />
      <canvas ref={canvasRef} className="tidal-glass-canvas" />
      <div className="tidal-glass-light" />
    </div>
  );
}
