/* eslint-disable @next/next/no-img-element */

type ToolLogoProps = {
  src: string;
  alt: string;
  size?: "medium" | "large";
};

export function ToolLogo({ src, alt, size = "medium" }: ToolLogoProps) {
  const isDockerLogo = src.endsWith("/docker.png");
  return (
    <span className={`official-logo official-logo-${size}${isDockerLogo ? " docker-logo" : ""}`}>
      <img src={src} alt={alt} />
    </span>
  );
}
