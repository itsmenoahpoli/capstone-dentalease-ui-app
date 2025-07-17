import { Inter } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "./app.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme scaling="90%">{children}</Theme>
      </body>
    </html>
  );
}
