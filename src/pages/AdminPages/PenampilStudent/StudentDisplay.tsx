import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom";

interface StudentDisplayProps {
  studentData?: {
    fullName: string;
    nisn: string;
    gender: string;
    birthPlace: string;
    birthDate: string;
    religion: string;
    address: string;
    phoneNumber: string;
    email: string;
    parentInfo: {
      fatherName: string;
      fatherOccupation: string;
      fatherPhone: string;
      motherName: string;
      motherOccupation: string;
      motherPhone: string;
    };
  };
}

const StudentDisplay = () => {
  const location = useLocation();
  const studentData = location.state?.studentData;

  if (!studentData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">No student data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {/* Student Personal Information */}
              <section>
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{studentData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">NISN</p>
                    <p className="font-medium">{studentData.nisn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{studentData.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Religion</p>
                    <p className="font-medium">{studentData.religion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Birth Place</p>
                    <p className="font-medium">{studentData.birthPlace}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Birth Date</p>
                    <p className="font-medium">{studentData.birthDate}</p>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Contact Information */}
              <section>
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{studentData.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{studentData.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{studentData.email}</p>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Parent Information */}
              <section>
                <h3 className="text-xl font-semibold mb-4">Parent Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  {/* Father's Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Father's Details</h4>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{studentData.parentInfo.fatherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Occupation</p>
                      <p className="font-medium">{studentData.parentInfo.fatherOccupation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{studentData.parentInfo.fatherPhone}</p>
                    </div>
                  </div>

                  {/* Mother's Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Mother's Details</h4>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{studentData.parentInfo.motherName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Occupation</p>
                      <p className="font-medium">{studentData.parentInfo.motherOccupation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{studentData.parentInfo.motherPhone}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDisplay;