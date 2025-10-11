import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Registers = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [title, setTitle] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [region, setRegion] = useState("");
  const [address, setAddress] = useState("");
  const [religion, setReligion] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = () => {
    register({
      username,
      name,
      nip,
      title,
      birthDate,
      region,
      address,
      religion,
    });
    navigate("/login");
  };
  
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 opacity-20 animate-gradient-xy"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/smoky.png')] opacity-5"></div>
      
      <Card className="w-[380px] z-10 bg-white dark:bg-gray-800 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-50">Daftar</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 pt-2">
            Masukkan username dan password untuk melanjutkan Daftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" placeholder="Nama Lengkap Anda" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Username Anda" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Password Anda" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="nip">NIP</Label>
                <Input id="nip" placeholder="NIP Anda" value={nip} onChange={(e) => setNip(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Gelar</Label>
                <Input id="title" placeholder="Gelar Anda" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="birthDate">Tanggal Lahir</Label>
                <Input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="region">Wilayah</Label>
                <Input id="region" placeholder="Wilayah Anda" value={region} onChange={(e) => setRegion(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" placeholder="Alamat Anda" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="religion">Agama</Label>
                <Input id="religion" placeholder="Agama Anda" value={religion} onChange={(e) => setReligion(e.target.value)} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-6">
          <Button className="w-full" onClick={handleRegister}>Daftar</Button>
          <Button variant="outline" className="w-full text-lg py-6">
            <Link to="/login">
              Sudah punya akun? Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Registers;