import { useState } from "react";
import { ResumeSidebar } from "@/components/ResumeSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/auth";
import { Confetti } from "@/components/Confetti";
import { Card } from "@/components/ui/card";

export default function ResumeResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(true);
  const [generatedResume, setGeneratedResume] = useState(
    location.state?.generatedResume || ""
  );

  const interviewQuestions = location.state?.interviewQuestions || [];

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('resumes').insert({
        user_id: user.id,
        original_resume: location.state.originalResume,
        job_description: location.state.jobDescription,
        generated_resume: generatedResume,
        title: `Resume for ${location.state.jobDescription.slice(0, 50)}...`,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your resume has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedResume], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "optimized-resume.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ResumeSidebar />
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Optimized Resume</h2>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={handleDownload}>Download</Button>
              </div>
            </div>
            <Textarea
              className="h-[calc(100vh-200px)] resize-none"
              value={generatedResume}
              onChange={(e) => setGeneratedResume(e.target.value)}
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Interview Questions</h2>
            <div className="space-y-4">
              {interviewQuestions.map((question, index) => (
                <Card key={index} className="p-4">
                  <h3 className="font-semibold mb-2">Question {index + 1}</h3>
                  <p className="text-gray-700">{question}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showConfetti && <Confetti />}
    </div>
  );
}