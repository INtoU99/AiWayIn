import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AmbientFlowBackground } from "@/components/AmbientFlowBackground";
import { BackToTop } from "@/components/BackToTop";
import { SiteFooter } from "@/components/SiteFooter";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "开启使用 AI 的第一步",
  description: "面向中文零基础用户的 AI 工具导航、安装指南与精选资源入口。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AmbientFlowBackground />
        <div className="site-content-layer">{children}<SiteFooter /></div>
        <BackToTop />
      </body>
    </html>
  );
}
