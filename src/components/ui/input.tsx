import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "outline" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    variant = "default", 
    size = "md", 
    error = false, 
    leftIcon, 
    rightIcon,
    ...props 
  }, ref) => {
    const variants = {
      default: "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring-blue-500",
      outline: "border-2 border-slate-200 dark:border-slate-700 bg-transparent focus:border-blue-500 focus:ring-blue-500",
      filled: "border-0 bg-slate-100 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-blue-500",
      ghost: "border-0 bg-transparent focus:bg-slate-50 dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500"
    };

    const sizes = {
      sm: "h-8 px-2 text-sm",
      md: "h-10 px-3 text-base",
      lg: "h-12 px-4 text-lg"
    };

    const errorStyles = error 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400" 
      : "";

    const baseStyles = cn(
      "flex w-full rounded-lg transition-all duration-200 ease-in-out",
      "text-slate-900 dark:text-slate-100",
      "placeholder:text-slate-400 dark:placeholder:text-slate-500",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
      variants[variant],
      sizes[size],
      errorStyles,
      leftIcon && "pl-10",
      rightIcon && "pr-10",
      className
    );

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={baseStyles}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
