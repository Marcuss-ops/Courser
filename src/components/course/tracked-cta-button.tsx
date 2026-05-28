"use client";

import { ArrowRight } from "lucide-react";

interface TrackedCtaButtonProps {
  href: string;
  productSlug: string;
  children: React.ReactNode;
  className?: string;
}

export function TrackedCtaButton({
  href,
  productSlug,
  children,
  className,
}: TrackedCtaButtonProps) {
  const handleClick = () => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "click_buy",
        productId: productSlug,
        metadata: { url: window.location.href },
      }),
    }).catch(() => {});
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </a>
  );
}
