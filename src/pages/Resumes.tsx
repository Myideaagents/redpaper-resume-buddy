import { useState } from "react";
import { ResumeSidebar } from "@/components/ResumeSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/auth";

export default function Resumes() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerateResume = async () => {
    if (!resume || !jobDescription) {
      toast({
        title: "Missing information",
        description: "Please provide both your resume and the job description.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    toast({
      title: "Generating resume...",
      description: "Please wait while we optimize your resume.",
    });

    try {
      const response = await supabase.functions.invoke('generate-resume', {
        body: { resume, jobDescription }
      });

      if (response.error) throw new Error(response.error.message);
      
      const data = response.data;
      
      // Navigate to results page with the generated content
      navigate('/resume-results', { 
        state: { 
          originalResume: resume,
          jobDescription,
          generatedResume: data.generatedResume,
          interviewQuestions: data.interviewQuestions 
        } 
      });
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ResumeSidebar />
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-2 h-full">
          <div className="p-6 border-r border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Your Resume</h2>
            <Textarea
              placeholder="Paste your current resume here..."
              className="h-[calc(100vh-200px)] resize-none"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          </div>
          
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
            <Textarea
              placeholder="Paste the job description here..."
              className="h-[calc(100vh-200px)] resize-none"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200 flex justify-center">
          <Button 
            className="w-64 bg-accent hover:bg-accent/90"
            onClick={handleGenerateResume}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Optimized Resume'}
          </Button>
        </div>
      </div>
    </div>
  );
}