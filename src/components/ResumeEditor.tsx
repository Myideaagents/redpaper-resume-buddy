import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Save, RefreshCw } from "lucide-react";

interface ResumeEditorProps {
  resume: string;
  jobDescription: string;
  generatedResume: string;
  isGenerating: boolean;
  onResumeChange: (value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  onGeneratedResumeChange: (value: string) => void;
  onGenerate: () => void;
  onSave: () => void;
  onDownload: () => void;
}

export const ResumeEditor = ({
  resume,
  jobDescription,
  generatedResume,
  isGenerating,
  onResumeChange,
  onJobDescriptionChange,
  onGeneratedResumeChange,
  onGenerate,
  onSave,
  onDownload,
}: ResumeEditorProps) => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-2 gap-6 p-6 min-h-screen">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Resume</h2>
            <Textarea
              placeholder="Paste your current resume here..."
              className="h-[calc(100vh-300px)] min-h-[500px] resize-none"
              value={resume}
              onChange={(e) => onResumeChange(e.target.value)}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <Textarea
              placeholder="Paste the job description here..."
              className="h-[calc(100vh-300px)] min-h-[500px] resize-none"
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
            />
          </div>
          <Button 
            className="w-full bg-accent hover:bg-accent/90"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate Optimized Resume'}
          </Button>
        </div>

        {generatedResume && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Generated Resume</h2>
              <div className="space-x-2">
                <Button 
                  variant="outline"
                  onClick={onSave}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button 
                  variant="outline"
                  onClick={onDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <Textarea
              className="h-[calc(100vh-200px)] min-h-[500px] resize-none"
              value={generatedResume}
              onChange={(e) => onGeneratedResumeChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};