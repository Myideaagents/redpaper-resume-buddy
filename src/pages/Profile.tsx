import { useState, useEffect } from "react";
import { ResumeSidebar } from "@/components/ResumeSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/auth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { ExpertiseForm } from "@/components/profile/ExpertiseForm";
import { InterestsForm } from "@/components/profile/InterestsForm";

export default function Profile() {
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    linkedin: "",
    experience: "",
    expertise: ["", "", "", "", ""],
    interests: ["", "", "", "", ""],
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          ...data,
          expertise: data.expertise ? JSON.parse(data.expertise) : ["", "", "", "", ""],
          interests: data.interests ? JSON.parse(data.interests) : ["", "", "", "", ""],
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          expertise: JSON.stringify(profile.expertise),
          interests: JSON.stringify(profile.interests),
          updated_at: new Date(),
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBasicInfoUpdate = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleExpertiseChange = (index: number, value: string) => {
    const newExpertise = [...profile.expertise];
    newExpertise[index] = value;
    setProfile(prev => ({ ...prev, expertise: newExpertise }));
  };

  const handleInterestChange = (index: number, value: string) => {
    const newInterests = [...profile.interests];
    newInterests[index] = value;
    setProfile(prev => ({ ...prev, interests: newInterests }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ResumeSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <ProfileHeader />
            
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
              <BasicInfoForm
                fullName={profile.full_name}
                phone={profile.phone}
                linkedin={profile.linkedin}
                experience={profile.experience}
                onUpdate={handleBasicInfoUpdate}
              />

              <ExpertiseForm
                expertise={profile.expertise}
                onUpdate={handleExpertiseChange}
              />

              <InterestsForm
                interests={profile.interests}
                onUpdate={handleInterestChange}
              />

              <Button
                className="w-full bg-accent hover:bg-accent/90"
                onClick={handleSave}
              >
                Save Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}