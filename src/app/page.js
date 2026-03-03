import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductsGrid from '@/components/ProductsGrid';
import AboutUs from '@/components/AboutUs';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="font-sans">
      <div className="flex flex-col min-h-screen font-inter">
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <ProductsGrid />
          <AboutUs />
        </main>
        <Footer />
      </div>
    </div>
  );
}
