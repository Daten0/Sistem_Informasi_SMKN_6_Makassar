import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import SearchSection from "@/components/SearchSection";
import PrincipalProfile from "@/components/PrincipalProfile";
import QuickAccess from "@/components/QuickAccess";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroCarousel />
      <SearchSection />
      <PrincipalProfile />
      <QuickAccess />
      <Footer />
    </div>
  );
};

export default Index;
