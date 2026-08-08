// "use client";

// import { ButtonHTMLAttributes, forwardRef } from "react";

// type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
// type ButtonSize = "sm" | "md" | "lg";

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: ButtonVariant;
//   size?: ButtonSize;
//   fullWidth?: boolean;
//   isLoading?: boolean;
// }

// const variantClasses: Record<ButtonVariant, string> = {
//   primary:
//     "bg-trackbite-green text-white hover:bg-trackbite-green-dark active:bg-trackbite-green-darker shadow-sm",
//   secondary:
//     "bg-trackbite-yellow text-trackbite-gray-900 hover:bg-trackbite-yellow-dark/90 active:bg-trackbite-yellow-dark shadow-sm",
//   ghost:
//     "bg-transparent text-trackbite-gray-600 hover:bg-trackbite-gray-100 active:bg-trackbite-gray-200",
//   outline:
//     "border-2 border-trackbite-green text-trackbite-green bg-transparent hover:bg-trackbite-green-muted active:bg-trackbite-green-light",
// };

// const sizeClasses: Record<ButtonSize, string> = {
//   sm: "h-10 px-4 text-sm",
//   md: "h-12 px-6 text-base",
//   lg: "h-14 px-8 text-lg",
// };

// export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
//   (
//     {
//       variant = "primary",
//       size = "md",
//       fullWidth = false,
//       isLoading = false,
//       disabled,
//       className = "",
//       children,
//       ...props
//     },
//     ref
//   ) => {
//     return (
//       <button
//         ref={ref}
//         disabled={disabled || isLoading}
//         className={[
//           "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors",
//           "disabled:cursor-not-allowed disabled:opacity-60",
//           variantClasses[variant],
//           sizeClasses[size],
//           fullWidth ? "w-full" : "",
//           className,
//         ]
//           .filter(Boolean)
//           .join(" ")}
//         {...props}
//       >
//         {isLoading ? (
//           <>
//             <span
//               className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
//               aria-hidden="true"
//             />
//             <span>{children}</span>
//           </>
//         ) : (
//           children
//         )}
//       </button>
//     );
//   }
// );

// Button.displayName = "Button";


"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-trackbite-green text-white hover:bg-trackbite-green-dark active:bg-trackbite-green-darker shadow-sm",
  secondary:
    "bg-trackbite-yellow text-trackbite-gray-900 hover:bg-trackbite-yellow-dark/90 active:bg-trackbite-yellow-dark shadow-sm",
  ghost:
    "bg-transparent text-trackbite-gray-600 hover:bg-trackbite-gray-100 active:bg-trackbite-gray-200",
  outline:
    "border-2 border-trackbite-green text-trackbite-green bg-transparent hover:bg-trackbite-green-muted active:bg-trackbite-green-light",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-11 px-6 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {isLoading ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";