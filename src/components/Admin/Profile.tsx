import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
 } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Admin</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={undefined} alt="User Profile" />
            <AvatarFallback>{currentUser?.user_metadata?.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Nama</Label>
            <Input id="name" name="name" value={currentUser?.user_metadata?.full_name || ''} disabled />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" value={currentUser?.email || ''} disabled />
          </div>
          <div>
            <Label htmlFor="role">Jabatan</Label>
            <Input id="role" name="role" value={currentUser?.role || ''} disabled />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;