import clsx from "clsx";

import { useState } from "react";
import { InputAttributes } from "../../lib/types/components";
import ViewPasswordIcon from "./vectors/svg/ViewPasswordIcon";
import HidePasswordIcon from "./vectors/svg/HidePasswordIcon";

const Input = ({
  name,
  label,
  type,
  suffix,
  extraInfo,
  isRequired = false,
  ...ref
}: InputAttributes) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const handleHidePassword = () => setShowPassword((prev) => !prev);

  const handleFocus = () => setIsFocused((prev) => !prev);

  const handleBlur = () => setIsFocused((prev) => !prev);

  return (
    <div className="flex flex-col gap-y-1">
      {label ? (
        <label htmlFor={name} className="text-base text-twikkl-main">
          {label}
        </label>
      ) : null}

      <div
        className={clsx(
          "flex flex-1 bg-white pl-3 pr-4 py-3 items-center gap-x-1 transition-all duration-200 border",
          isFocused ? "border-gray-600" : "border-gray-300"
        )}
      >
        <input
          className="flex-1 bg-transparent font-light placeholder:font-light placeholder:text-[0.9375rem] focus:outline-none"
          type={
            type === "password" && showPassword
              ? type
              : !showPassword
              ? "text"
              : type
          }
          name={name}
          onFocus={handleFocus}
          onBlur={handleBlur}
          id={name}
          required={isRequired}
          {...ref}
        />
        {suffix ? (
          suffix
        ) : type === "password" ? (
          <div>
            {showPassword ? (
              <span onClick={handleShowPassword}>
                <ViewPasswordIcon />
              </span>
            ) : (
              <span onClick={handleHidePassword}>
                <HidePasswordIcon />
              </span>
            )}
          </div>
        ) : null}
      </div>
      {extraInfo?.to ? (
        <a
          href={extraInfo.to || "#"}
          className="self-end text-twikkl-primary text-sm mt-2 underline"
        >
          {extraInfo?.label}
        </a>
      ) : null}
    </div>
  );
};

export default Input;
