const Header = ({
  variant = "h1",
  header,
  align,
  shade = "light",
  className,
}: {
  variant?: "h1" | "h2" | "h3";
  header: string;
  align?: boolean;
  shade?: "dark" | "light";
  className?: string;
}) => {
  if (variant === "h2")
    return (
      <h2
        className={`${
          shade === "light" ? "text-white" : "text-myblack-0"
        } text-lg md:text-xl xl:text-2xl 2xl:text-3xl  ${
          align ? "text-center" : ""
        } ${className}`}
      >
        {header}
      </h2>
    );
  if (variant === "h3")
    return (
      <h3
        className={`${
          shade === "light" ? "text-white" : "text-myblack-0"
        } text-base md:text-lg xl:text-xl 2xl:text-2xl ${
          align ? "text-center" : ""
        } ${className}`}
      >
        {header}
      </h3>
    );
  return (
    <h1
      className={`${
        shade === "light" ? "text-white" : "text-myblack-0"
      } text-xl md:text-3xl xl:text-4xl 2xl:text-5xl text-center ${
        align ? "text-center" : ""
      } ${className}`}
    >
      {header}
    </h1>
  );
};

export default Header;
