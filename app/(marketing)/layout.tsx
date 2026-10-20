import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        {/* overflow-x-clip (not hidden) so position: sticky keeps working inside. */}
        <main className="flex-1 overflow-x-clip">{children}</main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
