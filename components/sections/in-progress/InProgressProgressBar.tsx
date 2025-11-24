"use client";

type InProgressProgressBarProps = {
  label: string;              // e.g. "Progress"
  percent: number;            // numeric value 0-100
  valueText?: string;         // e.g. "70%" (optional override for display)
  className?: string;
  variant?: "light" | "dark";
};

export default function InProgressProgressBar({
  label,
  percent,
  valueText,
  className = "",
  variant = "light",
}: InProgressProgressBarProps) {
  // Clamp to 0-100 to guard against bad data
  const clampedPercent = Math.max(0, Math.min(100, percent));

  // Variant based styling for light vs dark surfaces
  const textColor = variant === "dark" ? "text-white/90" : "text-ink/70";
  const trackBg = variant === "dark" ? "bg-white/10" : "bg-ink/5";
  const trackBorder = variant === "dark" ? "border-white/20" : "border-ink/15";

  // Use provided value text if present, otherwise derive from percent
  const displayValue = valueText ?? `${clampedPercent}%`;
  const ariaLabel = `${label}: ${displayValue}`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Top row: label on the left, single numeric percent on the right */}
      <div className={`flex items-center justify-between text-xs ${textColor}`}>
        <span>{label}</span>
        <span>{displayValue}</span>
      </div>

      {/* Progress bar track showing full 100% width */}
      <div
        role="progressbar"
        aria-valuenow={clampedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        className={`h-1.5 w-full overflow-hidden rounded-full border ${trackBg} ${trackBorder}`}
      >
        <div
          className="h-full rounded-full bg-[color:var(--brand)] transition-all duration-300"
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  );
}
