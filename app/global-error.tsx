"use client";
import CustomBtn from "@/components/ui/button";

// Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body className="flex items-center justify-center flex-col gap-5">
        <h2 className="text-myblack-0">Something went wrong!</h2>
        <p className="text-myblue-400">{error?.message}</p>
        <CustomBtn onClick={() => reset()} variant="secondary">
          Try again
        </CustomBtn>
      </body>
    </html>
  );
}
