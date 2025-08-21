// components/ui/Button.jsx
import React from "react";

/**
 * Button
 * Props:
 *  - variant: "primary" | "secondary" | "outline" | "danger"
 *  - size: "sm" | "default" | "lg" | "icon"
 *  - disabled: boolean
 *  - square: boolean -> makes the button square (good for icon-only)
 *  - fullWidth: boolean -> stretch to container width
 *  - className: additional classes
 */
const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "default",
  className = "",
  disabled = false,
  square = false,
  fullWidth = false,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-md cursor-pointer select-none backdrop-blur-md border transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 whitespace-nowrap";

  const variants = {
    primary:
      "bg-blue-500/10 text-blue-200 border border-blue-300/30 shadow-md hover:bg-blue-500/20 hover:shadow-[0_6px_20px_rgba(59,130,246,0.18)] active:translate-y-[0.5px] active:shadow-inner focus:ring-blue-400",
    secondary:
      "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-[0_4px_14px_rgba(255,255,255,0.06)] active:translate-y-[0.5px] active:shadow-inner focus:ring-white/20",
    outline:
      "bg-transparent text-white border border-white/30 hover:bg-white/6 hover:shadow-[0_3px_10px_rgba(255,255,255,0.08)] active:translate-y-[0.5px] active:shadow-inner focus:ring-white/20",
    danger:
      "bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20 hover:shadow-[0_5px_16px_rgba(239,68,68,0.12)] active:translate-y-[0.5px] active:shadow-inner focus:ring-red-400",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs rounded-md",
    default: "px-5 py-2.5 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-lg",
    icon: "p-2.5",
  };

  const disabledClass = disabled
    ? "opacity-60 cursor-not-allowed pointer-events-none grayscale"
    : "hover:-translate-y-[0.25px]";

  // square buttons: ensure width == height
  const squareClass =
    square && (size === "sm" ? "w-9 h-9" : size === "lg" ? "w-12 h-12" : size === "icon" ? "w-10 h-10" : "w-10 h-10");

  const fullWidthClass = fullWidth ? "w-full" : "inline-block";

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.default;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`${base} ${variantClass} ${sizeClass} ${disabledClass} ${square ? squareClass : ""} ${fullWidthClass} ${className}`}
      {...props}
    >
      {/* wrap children to preserve spacing between icon + label */}
      <span className="flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;
