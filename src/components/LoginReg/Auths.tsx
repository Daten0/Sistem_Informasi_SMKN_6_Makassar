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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auths = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, userRole, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && userRole === 'admin') {
      navigate("/admin");
    }
  }, [currentUser, userRole, navigate]);

  const sanitizeInput = (input: string) => {
    const map: { [key: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };
    const reg = /[&<>"'/]/gi;
    return input.replace(reg, (match) => map[match]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedPassword = sanitizeInput(password);
      await login(sanitizedEmail, sanitizedPassword);
      // navigate("/admin");
    } catch (error) {
      setError("Gagal melakukan login. Periksa kembali email dan password Anda.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 opacity-20 animate-gradient-xy"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/smoky.png')] opacity-5"></div>
      
      <Card className="w-[380px] z-10 bg-white dark:bg-gray-800 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-50">Login</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 pt-2">
            Masukkan email dan password untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">Email</Label>
                <Input id="email" type="email" placeholder="Email Anda" className="bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-gray-400 focus:ring-school-yellow" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">Password</Label>
                <Input id="password" type="password" placeholder="Password Anda" className="bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-gray-400 focus:ring-school-yellow" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            <CardFooter className="flex flex-col gap-4 pt-6 px-0">
              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-lg py-6">Login</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auths;