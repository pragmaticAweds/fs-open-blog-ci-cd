import { HTMLAttributes, ReactNode } from "react";

export interface ButtonAttributes extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  disable?: boolean;
  maxWidth?: string;
}

export interface InputAttributes extends HTMLAttributes<HTMLInputElement> {
  name?: string;
  label?: string;
  type?: string;
  suffix?: ReactNode;
  mxWt?: string;
  border?: string;
  isRequired?: boolean;
  extraInfo?: {
    label: string;
    to?: string;
  };
}
