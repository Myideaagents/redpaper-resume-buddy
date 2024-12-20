import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Plus } from "lucide-react";

export default function Dashboard() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const { toast } = useToast();

  const handleGenerateResume = async () => {
    if (!resume || !jobDescription) {
      toast({
        title: "Missing information",
        description: "Please provide both your resume and the job description.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Generating resume...",
      description: "Please wait while we optimize your resume.",
    });

    // TODO: Implement OpenAI integration here
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Generate Resume</h1>
            
            <div className="grid gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Your Resume</h2>
                <Textarea
                  placeholder="Paste your current resume here..."
                  className="min-h-[200px]"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                />
                <div className="mt-4">
                  <Button variant="outline" className="flex items-center">
                    <FileUp className="w-4 h-4 mr-2" />
                    Upload Resume
                  </Button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <Textarea
                  placeholder="Paste the job description here..."
                  className="min-h-[200px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>

            <Button
              className="w-full bg-accent hover:bg-accent/90"
              size="lg"
              onClick={handleGenerateResume}
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Optimized Resume
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};