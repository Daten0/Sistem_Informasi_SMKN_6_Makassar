import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: "student" | "parent";
  onTabChange: (tab: "student" | "parent") => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <Card className="w-full max-w-4xl mx-auto mb-6 shadow-soft">
      <CardContent className="p-4">
        <div className="flex space-x-2">
          <Button
            variant={activeTab === "student" ? "default" : "outline"}
            onClick={() => onTabChange("student")}
            className={cn(
              "flex-1 transition-smooth",
              activeTab === "student" 
                ? "bg-gradient-primary shadow-soft" 
                : "hover:bg-academic-blue-light"
            )}
          >
            <GraduationCap className="h-5 w-5 mr-2" />
            Data Siswa
          </Button>
          <Button
            variant={activeTab === "parent" ? "default" : "outline"}
            onClick={() => onTabChange("parent")}
            className={cn(
              "flex-1 transition-smooth",
              activeTab === "parent" 
                ? "bg-gradient-primary shadow-soft" 
                : "hover:bg-academic-blue-light"
            )}
          >
            <Users className="h-5 w-5 mr-2" />
            Data Orang Tua/Wali
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TabNavigation;