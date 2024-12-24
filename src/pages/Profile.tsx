import { useState, useEffect } from "react";
import { ResumeSidebar } from "@/components/ResumeSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/auth";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { expertiseSuggestions, interestSuggestions } from "@/lib/suggestions";

export default function Profile() {
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    linkedin: "",
    experience: "",
    expertise: ["", "", "", "", ""],
    interests: ["", "", "", "", ""],
  });
  const [openExpertise, setOpenExpertise] = useState(Array(5).fill(false));
  const [openInterests, setOpenInterests] = useState(Array(5).fill(false));
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

  const handleExpertiseChange = (index: number, value: string) => {
    const newExpertise = [...profile.expertise];
    newExpertise[index] = value;
    setProfile({ ...profile, expertise: newExpertise });
  };

  const handleInterestChange = (index: number, value: string) => {
    const newInterests = [...profile.interests];
    newInterests[index] = value;
    setProfile({ ...profile, interests: newInterests });
  };

  const toggleExpertise = (index: number) => {
    const newOpen = [...openExpertise];
    newOpen[index] = !newOpen[index];
    setOpenExpertise(newOpen);
  };

  const toggleInterests = (index: number) => {
    const newOpen = [...openInterests];
    newOpen[index] = !newOpen[index];
    setOpenInterests(newOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ResumeSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Profile</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  value={profile.full_name || ""}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <Input
                  value={profile.linkedin || ""}
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <Input
                  value={profile.experience || ""}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  placeholder="5 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Expertise (Things you know how to do)
                </label>
                <div className="space-y-2">
                  {profile.expertise.map((item, index) => (
                    <div key={`expertise-${index}`} className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500 w-8">{index + 1}.</span>
                      <Popover open={openExpertise[index]} onOpenChange={() => toggleExpertise(index)}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openExpertise[index]}
                            className="w-full justify-between"
                          >
                            {item || `Select expertise #${index + 1}`}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder={`Search expertise...`} />
                            <CommandEmpty>No expertise found.</CommandEmpty>
                            <CommandGroup>
                              {expertiseSuggestions.map((suggestion) => (
                                <CommandItem
                                  key={suggestion}
                                  value={suggestion}
                                  onSelect={() => {
                                    handleExpertiseChange(index, suggestion);
                                    toggleExpertise(index);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      item === suggestion ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {suggestion}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Interest (Things you want to do)
                </label>
                <div className="space-y-2">
                  {profile.interests.map((item, index) => (
                    <div key={`interest-${index}`} className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500 w-8">{index + 1}.</span>
                      <Popover open={openInterests[index]} onOpenChange={() => toggleInterests(index)}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openInterests[index]}
                            className="w-full justify-between"
                          >
                            {item || `Select interest #${index + 1}`}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder={`Search interests...`} />
                            <CommandEmpty>No interest found.</CommandEmpty>
                            <CommandGroup>
                              {interestSuggestions.map((suggestion) => (
                                <CommandItem
                                  key={suggestion}
                                  value={suggestion}
                                  onSelect={() => {
                                    handleInterestChange(index, suggestion);
                                    toggleInterests(index);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      item === suggestion ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {suggestion}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
                </div>
              </div>

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