import { useState } from "react";
import { ResumeSidebar } from "@/components/ResumeSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/auth";
import { Confetti } from "@/components/Confetti";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function ResumeResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(true);
  const [generatedResume, setGeneratedResume] = useState(
    location.state?.generatedResume || ""
  );
  const [interviewQA, setInterviewQA] = useState([]);
  const [loadingQA, setLoadingQA] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("docx");

  const generateInterviewQA = async () => {
    setLoadingQA(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-interview-qa', {
        body: {
          resume: location.state?.originalResume,
          jobDescription: location.state?.jobDescription
        }
      });

      if (error) throw error;
      setInterviewQA(data.interviewQA);
    } catch (error) {
      console.error('Error generating interview Q&A:', error);
      toast({
        title: "Error",
        description: "Failed to generate interview questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingQA(false);
    }
  };

  const handleSave = async () => {
    if (!resumeTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your resume",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to save your resume",
          variant: "destructive",
        });
        return;
      }

      const { data: existingResumes, error: countError } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id);

      if (countError) throw countError;

      if (existingResumes && existingResumes.length >= 5) {
        toast({
          title: "Limit Reached",
          description: "You can only save up to 5 resumes. Please delete some to save more.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from('resumes').insert({
        user_id: user.id,
        original_resume: location.state.originalResume,
        job_description: location.state.jobDescription,
        generated_resume: generatedResume,
        title: resumeTitle,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your resume has been saved.",
      });
      setSaveDialogOpen(false);
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([generatedResume], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      const filename = resumeTitle || 'optimized-resume';
      element.download = `${filename}.${downloadFormat}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloadDialogOpen(false);
      
      toast({
        title: "Success!",
        description: "Your resume has been downloaded.",
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ResumeSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Optimized Resume</h2>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setSaveDialogOpen(true)}>Save</Button>
                <Button variant="outline" onClick={() => setDownloadDialogOpen(true)}>Download</Button>
                <Button 
                  variant="outline" 
                  onClick={generateInterviewQA}
                  disabled={loadingQA}
                >
                  {loadingQA ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Q&A...
                    </>
                  ) : (
                    "Generate Interview Q&A"
                  )}
                </Button>
              </div>
            </div>
            <Textarea
              className="h-[calc(100vh-200px)] resize-none"
              value={generatedResume}
              onChange={(e) => setGeneratedResume(e.target.value)}
            />

            {interviewQA.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Interview Questions & Answers</h2>
                <div className="space-y-4">
                  {interviewQA.map((qa, index) => (
                    <Card key={index} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <CardHeader>
                        <h3 className="font-semibold text-lg">Question {index + 1}</h3>
                        <p className="text-gray-700">{qa.question}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 whitespace-pre-wrap">{qa.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Resume</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter resume title"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Resume</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Format</label>
              <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docx">Word Document (.docx)</SelectItem>
                  <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                  <SelectItem value="txt">Text File (.txt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Enter file name (optional)"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDownloadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDownload}>Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showConfetti && <Confetti />}
    </div>
  );
}