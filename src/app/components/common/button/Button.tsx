'use client';

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "w-full px-4 py-2 rounded-2xl transition-colors duration-200 font-semibold",
  {
    variants: {
      variant: {
        default: "bg-yellow-main text-black hover:bg-yellow-light",
        outline: "bg-white text-yellow-main border border-yellow-main hover:bg-yellow-main/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className, variant, children, ...props }) => {
  return (
    <button
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
