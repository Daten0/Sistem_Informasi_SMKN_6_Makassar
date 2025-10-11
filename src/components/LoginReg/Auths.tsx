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
import User from "@/contexts/AuthContext";

const Auths = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    // For now, we'll simulate a login and create a dummy user object.
    // In a real application, you would fetch the user data from a server.
    const user : User= {
      id: "1",
      name: "Admin User",
      username: username,
      role: "admin",
      nip: "123456789",
      title: "Administrator",
      birthDate: "1990-01-01",
      region: "Indonesia",
      address: "123 Admin St",
      religion: "Islam",
    };
    login(user);
    navigate("/admin/profile");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 opacity-20 animate-gradient-xy"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/smoky.png')] opacity-5"></div>
      
      <Card className="w-[380px] z-10 bg-white dark:bg-gray-800 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-50">Login</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 pt-2">
            Masukkan username dan password untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="username" className="text-gray-800 dark:text-gray-200">Username</Label>
                <Input id="username" placeholder="Username Anda" className="bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-gray-400 focus:ring-school-yellow" value={username} onChange={(e) => setUsername(e.target.value)}/>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">Password</Label>
                <Input id="password" type="password" placeholder="Password Anda" className="bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-gray-400 focus:ring-school-yellow" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-6">
          <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-lg py-6" onClick={handleLogin}>Login</Button>
          <Button variant="outline" className="w-full text-lg py-6">
            <Link to="/register">
              Daftar
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auths;