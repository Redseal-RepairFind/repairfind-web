import { ReactNode } from "react";

const CustomBtn = ({
  children,
  variant = "primary",
  onClick,
  className,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "color";
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      className={`py-2 px-8 rounded-sm z-50 cursor-pointer hover:bg-bgImg hover:text-white transition duration-300 ${
        variant === "primary"
          ? "bg-mygray-0 text-myblack-0"
          : variant === "secondary"
          ? "border border-myblack-0 text-myblack-0 bg-mygray-0"
          : "bg-myblue-400 text-mygray-0"
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default CustomBtn;
