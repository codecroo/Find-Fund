import React from "react";

const Badge = ({ children, className = "", ...props }) => {
    return (
        <div
            className={`inline-flex items-center px-3 py-1 text-xs font-semibold text-white 
        bg-white/10 backdrop-blur-md border border-white/20 rounded-full 
        transition-colors duration-300 hover:bg-black/40 hover:text-white ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Badge;
