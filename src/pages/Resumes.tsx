import { useState } from "react";
import { ResumeSidebar } from "@/components/ResumeSidebar";
import { ResumeEditor } from "@/components/ResumeEditor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/auth";
import { Confetti } from "@/components/Confetti";

export default function Resumes() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedResume, setGeneratedResume] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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

    setIsGenerating(true);
    toast({
      title: "Generating resume...",
      description: "Please wait while we optimize your resume.",
    });

    try {
      const response = await fetch(
        'https://txbvgwrqqznojrpxurss.supabase.co/functions/v1/generate-resume',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ resume, jobDescription }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }

      const data = await response.json();
      setGeneratedResume(data.generatedResume);
      setShowConfetti(true);
      
      // Scroll to the generated resume
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
      
      toast({
        title: "Success!",
        description: "Your resume has been optimized.",
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

  const handleSaveResume = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('resumes').insert({
        user_id: user.id,
        original_resume: resume,
        job_description: jobDescription,
        generated_resume: generatedResume,
        title: `Resume for ${jobDescription.slice(0, 50)}...`,
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
      <ResumeEditor
        resume={resume}
        jobDescription={jobDescription}
        generatedResume={generatedResume}
        isGenerating={isGenerating}
        onResumeChange={setResume}
        onJobDescriptionChange={setJobDescription}
        onGeneratedResumeChange={setGeneratedResume}
        onGenerate={handleGenerateResume}
        onSave={handleSaveResume}
        onDownload={handleDownload}
      />
      {showConfetti && <Confetti />}
    </div>
  );
}