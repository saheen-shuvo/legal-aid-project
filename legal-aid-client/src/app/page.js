import ActionCards from "@/components/ActionCards";
import Banner from "@/components/Banner";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf7f0] text-[#3d2f1f]">
      <Navbar />
      <Banner />
      <ActionCards />
      <Footer />
    </main>
  );
}
