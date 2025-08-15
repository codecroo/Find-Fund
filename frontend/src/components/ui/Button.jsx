import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md backdrop-blur-md border transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95 cursor-pointer";


  const variants = {
    primary:
      "bg-gradient-to-r from-purple-500 to-blue-500 text-white border border-purple-400/50 hover:from-purple-600 hover:to-blue-600 hover:shadow-xl focus:ring-purple-400",
    secondary:
      "bg-gray-700/80 text-white border border-gray-500 hover:bg-gray-600 hover:shadow-md focus:ring-gray-400",
    danger:
      "bg-gradient-to-r from-red-500 to-pink-500 text-white border border-red-400/50 hover:from-red-600 hover:to-pink-600 hover:shadow-xl focus:ring-red-400",
    outline:
      "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-md focus:ring-white/30",
    ghost:
      "bg-transparent text-white border border-transparent hover:bg-white/10 hover:border-white/20 hover:shadow-md focus:ring-white/20",
  };

  const sizes = {
    default: "px-5 py-2.5 text-sm",
    sm: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-3",
  };

  const variantClass = variants[variant] || variants["primary"];
  const sizeClass = sizes[size] || sizes["default"];

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
