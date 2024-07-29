import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import ProviderWrapper from "@/redux/ProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Lab",
  description: "Fantasy Football League Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1, minimum-scale=1"
        />
        <link href="https://fonts.cdnfonts.com/css/pulang" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/chillit" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
