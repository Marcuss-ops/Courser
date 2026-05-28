"use client";

interface SidebarToggleBtnProps {
  toggleId?: string;
  className?: string;
  children: React.ReactNode;
}

export function SidebarToggleBtn({
  toggleId = "sidebar-toggle",
  className,
  children,
}: SidebarToggleBtnProps) {
  return (
    <button
      className={className}
      onClick={() => document.getElementById(toggleId)?.click()}
    >
      {children}
    </button>
  );
}
