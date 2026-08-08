"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, id, className = "", required, ...props }, ref) => {
    const inputId = id || props.name;
    const [visible, setVisible] = useState(false);

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-trackbite-gray-800"
        >
          {label}
          {required && <span className="text-trackbite-error"> *</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={[
              "w-full rounded-xl border bg-white px-4 py-3 pr-12 text-base text-trackbite-gray-900",
              "placeholder:text-trackbite-gray-400 transition-colors",
              "focus:border-trackbite-green focus:ring-2 focus:ring-trackbite-green/20 focus:outline-none",
              error
                ? "border-trackbite-error bg-trackbite-error-light"
                : "border-trackbite-gray-200",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            required={required}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-trackbite-gray-500 hover:text-trackbite-gray-800"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? "Hide" : "Show"}
          </button>
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="mt-1.5 text-sm text-trackbite-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
