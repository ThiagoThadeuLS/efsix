import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EFSIX — Built as Armour",
  description:
    "Mais que esporte. Propósito. Rashguards e roupas esportivas de alta performance com tecnologia de ponta e design brutalista.",
  keywords: ["rashguard", "roupas esportivas", "alta performance", "EFSIX", "proteção UV"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${cinzel.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#020202] text-white font-body">
        {children}
      </body>
    </html>
  );
}
