"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleMapsProvider } from "./google-maps-provider";

const queryClient = new QueryClient();

const LayoutClient = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    // <main className="2xl:w-[1440px] w-full">
    <main className=" w-full">
      <QueryClientProvider client={queryClient}>
        <GoogleMapsProvider>{children}</GoogleMapsProvider>
      </QueryClientProvider>
    </main>
  );
};

export default LayoutClient;
