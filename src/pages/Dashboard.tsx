import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Download, Save, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/auth";
import { Confetti } from "@/components/Confetti";

export default function Dashboard() {
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
      <DashboardSidebar />
      <div className="flex-1 overflow-hidden">
        <div className="h-full">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full rounded-lg border"
          >
            <ResizablePanel defaultSize={50} className="min-h-[calc(100vh-2rem)]">
              <div className="h-full p-6">
                <Tabs defaultValue="resume" className="h-full">
                  <TabsList>
                    <TabsTrigger value="resume">Your Resume</TabsTrigger>
                    <TabsTrigger value="job">Job Description</TabsTrigger>
                  </TabsList>
                  <TabsContent value="resume" className="h-[calc(100%-40px)]">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Paste your current resume here..."
                        className="h-[calc(100vh-300px)] min-h-[500px] resize-none"
                        value={resume}
                        onChange={(e) => setResume(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                        <Button variant="outline" className="w-full">
                          <FileUp className="w-4 h-4 mr-2" />
                          Upload Resume
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="job" className="h-[calc(100%-40px)]">
                    <Textarea
                      placeholder="Paste the job description here..."
                      className="h-[calc(100vh-300px)] min-h-[500px] resize-none"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={50} className="min-h-[calc(100vh-2rem)]">
              <div className="h-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Generated Resume</h2>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleGenerateResume}
                      className="bg-accent hover:bg-accent/90"
                      disabled={isGenerating}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleSaveResume}
                      disabled={!generatedResume}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleDownload}
                      disabled={!generatedResume}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <Textarea
                  placeholder="Your optimized resume will appear here..."
                  className="h-[calc(100vh-300px)] min-h-[500px] resize-none transition-all duration-500 ease-in-out"
                  value={generatedResume}
                  onChange={(e) => setGeneratedResume(e.target.value)}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      {showConfetti && <Confetti />}
    </div>
  );
}