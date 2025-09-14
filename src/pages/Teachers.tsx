import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Teachers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-6 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-8">Teachers</h1>
          <p className="text-xl text-muted-foreground">
            Information about our qualified teaching staff will be displayed here.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Teachers;