import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/pages/AdminPages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    mapel: ["DKV", "Matematika", "TKJ"],
    kelas: ["DKV", "AK", "Tata Kecantikan"],
  });

  const mapelOptions = ["DKV", "Matematika", "TKJ", "Bahasa Indonesia", "IPA"];
  const kelasOptions = ["DKV", "AK", "Tata Kecantikan", "TKJ", "RPL"];

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

  // Add a subject
  const handleAddMapel = (value: string) => {
    if (value && !profile.mapel.includes(value)) {
      setProfile({ ...profile, mapel: [...profile.mapel, value] });
    }
  };

  // Remove a subject
  const handleRemoveMapel = (mapelToRemove: string) => {
    setProfile({ 
      ...profile, 
      mapel: profile.mapel.filter(m => m !== mapelToRemove) 
    });
  };

  // Add a class
  const handleAddKelas = (value: string) => {
    if (value && !profile.kelas.includes(value)) {
      setProfile({ ...profile, kelas: [...profile.kelas, value] });
    }
  };

  // Remove a class
  const handleRemoveKelas = (kelasToRemove: string) => {
    setProfile({ 
      ...profile, 
      kelas: profile.kelas.filter(k => k !== kelasToRemove) 
    });
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
          
          {/* Mata Pelajaran with Select */}
          <div>
            <Label>Mata Pelajaran</Label>
            <div className="space-y-2">
              <Select onValueChange={handleAddMapel} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue placeholder="Tambah mata pelajaran" />
                </SelectTrigger>
                <SelectContent>
                  {mapelOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <div className="flex flex-wrap gap-2">
                {profile.mapel.map(mapel => (
                  <div key={mapel} className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {mapel}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMapel(mapel)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div> */}
            </div>
          </div>
          
          {/* Kelas with Select */}
          <div>
            <Label>Kelas</Label>
            <div className="space-y-2">
              <Select onValueChange={handleAddKelas} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue placeholder="Tambah kelas" />
                </SelectTrigger>
                <SelectContent>
                  {kelasOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <div className="flex flex-wrap gap-2">
                {profile.kelas.map(kelas => (
                  <div key={kelas} className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {kelas}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveKelas(kelas)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div> */}
            </div>
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