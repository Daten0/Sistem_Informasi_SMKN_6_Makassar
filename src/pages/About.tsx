import Header from "@/components/Index/Header";
import Footer from "@/components/Index/Footer";
import ManagementSection from "@/components/About/ManagementSection";
import HistorySection from "@/components/About/HistorySection";
import Hero from "@/components/About/Hero";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <HistorySection/>
      <ManagementSection />
      <Footer />
    </div>
  );
};

export default About;