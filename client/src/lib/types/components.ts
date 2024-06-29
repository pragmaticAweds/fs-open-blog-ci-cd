import { ReactNode, InputHTMLAttributes, ButtonHTMLAttributes } from "react";

export interface ButtonAttributes
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  disable?: boolean;
  maxWidth?: string;
}

export interface InputAttributes extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label?: string;
  suffix?: ReactNode;
  mxWt?: string;
  border?: string;
  isRequired?: boolean;
  extraInfo?: {
    label: string;
    to?: string;
  };
}
