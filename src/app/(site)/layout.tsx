import Navbar from "@/components/Navbar";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <ChatbotWidget />
    </>
  );
}
