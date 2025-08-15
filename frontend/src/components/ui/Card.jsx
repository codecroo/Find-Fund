import React from "react"

export const Card = ({ children, className = "", ...props }) => (
    <div
        className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl p-6 
                transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-white/20 
                ${className}`}
        {...props}
    >
        {children}
    </div>
)

export const CardHeader = ({ children, className = "", ...props }) => (
    <div className={`mb-4 ${className}`} {...props}>
        {children}
    </div>
)

export const CardTitle = ({ children, className = "", ...props }) => (
    <h3 className={`text-xl font-semibold text-white mb-2 ${className}`} {...props}>
        {children}
    </h3>
)

export const CardDescription = ({ children, className = "", ...props }) => (
    <p className={`text-gray-300 text-sm ${className}`} {...props}>
        {children}
    </p>
)

export const CardContent = ({ children, className = "", ...props }) => (
    <div className={`${className}`} {...props}>
        {children}
    </div>
)
