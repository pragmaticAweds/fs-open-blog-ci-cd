import { ButtonAttributes } from "../../lib/types/components";
import { cn } from "@/lib/utils";

const Button = ({
  label,
  disable,
  className,
  maxWidth = "max-w-full",
  ...ref
}: ButtonAttributes) => {
  return (
    <button
      className={cn(
        "py-4 md:py-3 flex flex-1 justify-center items-center font-medium text-white transition-all duration-200 w-full",
        maxWidth,
        disable ? "bg-gray-400" : "bg-gray-950 hover:bg-gray-800",
        className
      )}
      disabled={disable}
      {...ref}
    >
      {label || ""}
    </button>
  );
};

export default Button;
