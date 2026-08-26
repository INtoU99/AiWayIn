/* eslint-disable @next/next/no-img-element */

const contactEmail = "chuthachtung22013@gmail.com";

export function SiteFooter() {
  return (
    <footer className="global-site-footer">
      <p>本站主要面向新手提供基础的资源导航。若您已经是成熟的使用者，可以访问更权威的聚合站点；若有任何改进建议，请联系站长。</p>
      <a className="footer-contact" href={`mailto:${contactEmail}`} aria-label={`发送邮件至 ${contactEmail}`}>
        <img src="/resource-logos/gmail-contact.svg" alt="Gmail 标志" />
        <span>{contactEmail}</span>
      </a>
    </footer>
  );
}
