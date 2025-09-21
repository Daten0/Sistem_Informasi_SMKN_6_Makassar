import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/pages/AdminPages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { username, profileImage, setUsername, setProfileImage } = useProfile();
  const [profile, setProfile] = useState({
    nip: "123456789",
    name: username,
    title: "Administrator",
    birthDate: "1990-01-01",
    region: "Makassar",
    address: "Jl. Admin No. 1",
    religion: "Islam",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    if (name === "name") {
      setUsername(value);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
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
            <AvatarImage src={profileImage || undefined} alt="User Profile" />
            <AvatarFallback>{username.charAt(0)}</AvatarFallback>
          </Avatar>
          {isEditing && (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" type="file" onChange={handleImageChange} />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nip">NIP</Label>
            <Input id="nip" name="nip" value={profile.nip} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="name">Nama</Label>
            <Input id="name" name="name" value={profile.name} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="title">Jabatan</Label>
            <Input id="title" name="title" value={profile.title} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="birthDate">Tanggal Lahir</Label>
            <Input id="birthDate" name="birthDate" type="date" value={profile.birthDate} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="region">Asal</Label>
            <Input id="region" name="region" value={profile.region} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="address">Alamat</Label>
            <Input id="address" name="address" value={profile.address} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="religion">Agama</Label>
            <Input id="religion" name="religion" value={profile.religion} onChange={handleInputChange} disabled={!isEditing} />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          {isEditing ? (
            <Button onClick={() => setIsEditing(false)}>Save</Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;