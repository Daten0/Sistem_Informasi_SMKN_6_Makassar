import Header from "@/components/Index/Header";
import Footer from "@/components/Index/Footer";
import NewsPreview from "@/components/Index/PreviewNews/PreviewBerita";

const  BeritaPreview= () => {
  return (
    <div className="min-h-screen">
      <Header />
      <NewsPreview />
      <Footer />
    </div>
  );
};

export default BeritaPreview;
