import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    nip: "123456789",
    name: "Admin User",
    title: "Administrator",
    birthDate: "1990-01-01",
    region: "Makassar",
    address: "Jl. Admin No. 1",
    religion: "Islam",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nip">NIP</Label>
            <Input id="nip" name="nip" value={profile.nip} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={profile.name} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={profile.title} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input id="birthDate" name="birthDate" type="date" value={profile.birthDate} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="region">Region</Label>
            <Input id="region" name="region" value={profile.region} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={profile.address} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="religion">Religion</Label>
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