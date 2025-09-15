import Header from "@/components/Index/Header";
import HeroCarousel from "@/components/Index/HeroCarousel";
import SearchSection from "@/components/Index/SearchSection";
import PrincipalProfile from "@/components/Index/PrincipalProfile";
import QuickAccess from "@/components/Index/QuickAccess";
import Footer from "@/components/Index/Footer";

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
