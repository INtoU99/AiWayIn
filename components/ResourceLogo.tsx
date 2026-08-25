/* eslint-disable @next/next/no-img-element */

type ResourceLogoProps = {
  logo?: string;
  mark: string;
  tone: string;
  name: string;
};

export function ResourceLogo({ logo, mark, tone, name }: ResourceLogoProps) {
  return logo ? <span className="resource-logo"><img src={logo} alt={`${name} 标志`} /></span> : <span className={`resource-mark ${tone}`} aria-hidden="true">{mark}</span>;
}
