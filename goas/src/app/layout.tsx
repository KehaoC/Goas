import { Kalam, Patrick_Hand } from "next/font/google";
import "./globals.css";

const kalam = Kalam({
  variable: "--font-kalam",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${kalam.variable} ${patrickHand.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
