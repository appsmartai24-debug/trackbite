// "use client";

// import { InputHTMLAttributes, forwardRef } from "react";

// interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   error?: string;
//   hint?: string;
// }

// export const Input = forwardRef<HTMLInputElement, InputProps>(
//   ({ label, error, hint, id, className = "", required, ...props }, ref) => {
//     const inputId = id || props.name;

//     return (
//       <div className="w-full">
//         <label
//           htmlFor={inputId}
//           className="mb-1.5 block text-sm font-medium text-trackbite-gray-800"
//         >
//           {label}
//           {required && <span className="text-trackbite-error"> *</span>}
//         </label>
//         <input
//           ref={ref}
//           id={inputId}
//           aria-invalid={error ? true : undefined}
//           aria-describedby={
//             error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
//           }
//           className={[
//             "w-full rounded-xl border bg-white px-4 py-3 text-base text-trackbite-gray-900",
//             "placeholder:text-trackbite-gray-400 transition-colors",
//             "focus:border-trackbite-green focus:ring-2 focus:ring-trackbite-green/20 focus:outline-none",
//             error
//               ? "border-trackbite-error bg-trackbite-error-light"
//               : "border-trackbite-gray-200",
//             className,
//           ]
//             .filter(Boolean)
//             .join(" ")}
//           required={required}
//           {...props}
//         />
//         {hint && !error && (
//           <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-trackbite-gray-500">
//             {hint}
//           </p>
//         )}
//         {error && (
//           <p
//             id={`${inputId}-error`}
//             role="alert"
//             className="mt-1.5 text-sm text-trackbite-error"
//           >
//             {error}
//           </p>
//         )}
//       </div>
//     );
//   }
// );

// Input.displayName = "Input";


"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", required, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-medium text-trackbite-gray-700"
        >
          {label}
          {required && <span className="text-trackbite-error"> *</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={[
            "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-trackbite-gray-900",
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
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-trackbite-gray-500">
            {hint}
          </p>
        )}
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="mt-1.5 text-xs text-trackbite-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";