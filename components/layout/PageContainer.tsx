interface PageContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

export function PageContainer({
  children,
  size = "md",
  className = "",
}: PageContainerProps) {
  return (
    <div
      className={[
        "mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:py-12",
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
