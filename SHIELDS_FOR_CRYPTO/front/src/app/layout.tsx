import "./globals.css";
import { Inter, Roboto, Lato } from "next/font/google";
import { WagmiProvider } from "@/utils/wagmi";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const lato = Lato({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Sismo Connect - Onchain Tutorial",
  description: "A simple ERC20 gated airdrop example using Sismo Connect",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${lato.className} bg-slate-900 text-white mx-12`}>
        <WagmiProvider>
          <Navbar />
          {children}
          <Footer />
        </WagmiProvider>
      </body>
    </html>
  );
}
