"use client";


import { Footer } from "@/components/common/Footer.component";
import { Navbar } from "@/components/common/Navbar.component";



interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <div className="flex-grow">
      <Navbar />
      <main className="my-6">{children}</main>
    </div>
    <Footer />
  </div>
);

export default RootLayout;
