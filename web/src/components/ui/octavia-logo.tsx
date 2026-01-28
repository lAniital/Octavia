import { cn } from "@/lib/utils";
import octaviaLogo from "@/assets/octavia-logo.png";

interface OctaviaLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export function OctaviaLogo({ size = "lg", className, showText = true }: OctaviaLogoProps) {
  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-16",
  };

  return (
    <img
      src={octaviaLogo}
      alt="OCTAVIA Logo"
      className={cn(
        "object-contain transition-transform duration-300 bg-transparent border-none",
        sizes[size],
        className,
      )}
      style={{
        backgroundColor: "transparent",
        border: "none",
      }}
    />
  );
}
