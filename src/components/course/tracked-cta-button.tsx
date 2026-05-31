"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { trackCheckoutOpen } from "./analytics-tracker";

interface TrackedCtaButtonProps {
  href?: string;
  productSlug: string;
  productId?: string;
  locale?: string;
  children: React.ReactNode;
  className?: string;
}

export function TrackedCtaButton({
  href,
  productSlug,
  productId,
  locale = "it",
  children,
  className,
}: TrackedCtaButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    trackCheckoutOpen(productSlug, { locale });

    if (productId) {
      e.preventDefault();
      setLoading(true);
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, locale }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error || "Checkout failed");
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
      return;
    }

    // If no productId, use href as fallback
    if (!href) {
      e.preventDefault();
    }
  };

  if (productId) {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          children
        )}
        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
      </button>
    );
  }

  return (
    <a
      href={href || "#"}
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
