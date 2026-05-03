"use client";


import { Footer } from "@/components/common/Footer.component";
import { Navbar } from "@/components/common/Navbar.component";



interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-background">
    <div className="flex-grow">
      <Navbar />
      <main className="py-6 sm:py-8">{children}</main>
    </div>
    <Footer />
  </div>
);

export default RootLayout;
