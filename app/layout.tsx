import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { AppSidebar } from "./_components/app-sidebar";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenDayCare",
  description: "Comunicación diaria de la sala con las familias",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <div className="flex min-h-dvh">
          <AppSidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
