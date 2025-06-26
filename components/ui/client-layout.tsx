"use client";

import { GoogleMapsProvider } from "./google-maps-provider";

const LayoutClient = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="2xl:w-[1440px] w-full">
      <GoogleMapsProvider>{children}</GoogleMapsProvider>
    </main>
  );
};

export default LayoutClient;
