import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Subjects = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-6 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-8">Subjects</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive curriculum and learning materials will be available here.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Subjects;