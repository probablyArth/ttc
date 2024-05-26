import type { FC, ReactNode } from "react";

export const H1: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <h1
      className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
    >
      {children}
    </h1>
  );
};
