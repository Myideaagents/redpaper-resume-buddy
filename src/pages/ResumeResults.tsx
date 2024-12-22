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
      if (!user) return;

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
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    const element = document.createElement("a");
    const file = new Blob([generatedResume], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `optimized-resume.${downloadFormat}`;
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
                <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="docx">Word</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="txt">Text</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setSaveDialogOpen(true)}>Save</Button>
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
            <h2 className="text-2xl font-semibold mb-6">Interview Questions & Answers</h2>
            <div className="space-y-4">
              {interviewQA.map((qa, index) => (
                <Card key={index}>
                  <CardHeader>
                    <h3 className="font-semibold">Question {index + 1}</h3>
                    <p className="text-gray-700">{qa.question}</p>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-2">Answer:</h4>
                    <p className="text-gray-600">{qa.answer}</p>
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

      {showConfetti && <Confetti />}
    </div>
  );
}