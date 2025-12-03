import Header from "@/components/Index/Header";
import HeroCarousel from "@/components/Index/HeroCarousel";
import SearchSection from "@/components/Index/SearchSection";
import PrincipalProfile from "@/components/Index/PrincipalProfile";
import { TeacherCarousel } from "@/components/Index/TeacherCarousel";
import Footer from "@/components/Index/Footer";
import { Teacher } from "@/contexts/TeachersContext";
import teacher1 from "@/assets/Teacher1.jpg";
import teacher2 from "@/assets/Teacher2.jpg";
import teacher3 from "@/assets/Teacher3.jpg";
import { useTeachers } from "@/contexts/TeachersContext";

const Index = () => {
  // const teachers:Teacher[] = [
  //   {
  //     id: "1",
  //     created_at: "2023-01-01T12:00:00.000Z",
  //     nip: "198503152010011001",
  //     username: "Dr. Ahmad Wijaya, M.Pd",
  //     jabatan: "Kepala Program Keahlian",
  //     mapel: ["Matematika"],
  //     kejuruan: ["Teknik Komputer dan Jaringan"],
  //     picture_url: teacher1,
  //     terdaftar: true,
  //   },
  //   {
  //     id: "2",
  //     created_at: "2023-01-02T12:00:00.000Z",
  //     nip: "199207082015022001",
  //     username: "Siti Nurhaliza, S.Kom",
  //     jabatan: "Guru Produktif",
  //     mapel: ["Pemrograman Web dan Mobile"],
  //     kejuruan: ["Rekayasa Perangkat Lunak"],
  //     picture_url: teacher2,
  //     terdaftar: true,
  //   },
  //   {
  //     id: "3",
  //     created_at: "2023-01-03T12:00:00.000Z",
  //     nip: "197805202005012003",
  //     username: "Dra. Ratna Dewi",
  //     jabatan: "Wakil Kepala Sekolah Kurikulum",
  //     mapel: ["Bahasa Indonesia"],
  //     kejuruan: ["Otomatisasi dan Tata Kelola Perkantoran"],
  //     picture_url: teacher3,
  //     terdaftar: true,
  //   },
  //   {
  //     id: "4",
  //     created_at: "2023-01-03T12:00:00.000Z",
  //     nip: "197805202005012004",
  //     username: "Dra. Ratna",
  //     jabatan: "Wakil Kantin",
  //     mapel: ["Bahasa Indonesia"],
  //     kejuruan: ["Otomatisasi dan Tata Kelola Perkantoran"],
  //     picture_url: teacher3,
  //     terdaftar: true,
  //   },
  //   {
  //     id: "5",
  //     created_at: "2023-01-03T12:00:00.000Z",
  //     nip: "197805202005012005",
  //     username: "Dra. Simbalungun",
  //     jabatan: "Wakil Kepala Jurusan",
  //     mapel: ["Brainrot"],
  //     kejuruan: ["Otomatisasi dan Tata Kelola Perkantoran"],
  //     picture_url: teacher3,
  //     terdaftar: true,
  //   },
  // ];

  const { teachers } = useTeachers();
  
  return (
    <div className="min-h-screen">
      <Header />
      <HeroCarousel />
      <SearchSection />
      <PrincipalProfile />
      <TeacherCarousel teachers={teachers} autoplayDelay={4000} />
      <Footer />
    </div>
  );
};

export default Index;

// import React from 'react';

// const Index = () => {
//   return (
//     <div>
//       <h1>Home Page</h1>
//     </div>
//   );
// };

// export default Index;
