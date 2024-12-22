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

export default function ResumeResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(true);
  const [generatedResume, setGeneratedResume] = useState(
    location.state?.generatedResume || ""
  );
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("docx");

  const interviewQA = location.state?.interviewQA || [];

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

      const { error } = await supabase.from('resumes').insert({
        user_id: user.id,
        original_resume: location.state.originalResume,
        job_description: location.state.jobDescription,
        generated_resume: generatedResume,
        title: resumeTitle,
        interview_qa: interviewQA,
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
        <div className="grid grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Optimized Resume</h2>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setSaveDialogOpen(true)}>Save</Button>
                <Button variant="outline" onClick={() => setDownloadDialogOpen(true)}>Download</Button>
              </div>
            </div>
            <Textarea
              className="h-[calc(100vh-200px)] resize-none"
              value={generatedResume}
              onChange={(e) => setGeneratedResume(e.target.value)}
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Interview Questions & Answers</h2>
            <div className="space-y-4">
              {interviewQA.map((qa, index) => (
                <Card key={index} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader className="pb-2">
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