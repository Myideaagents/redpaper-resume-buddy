import { Brain, FileText, Wand2 } from "lucide-react";
import { Feature } from "@/components/Feature";

export const Features = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose RedPaper?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            title="AI-Powered Optimization"
            description="Our advanced AI analyzes job descriptions and optimizes your resume to match perfectly."
            icon={<Brain className="w-6 h-6" />}
            className="animate-fade-up [animation-delay:200ms]"
          />
          <Feature
            title="Smart Resume Builder"
            description="Create professional resumes with our intelligent builder that suggests improvements."
            icon={<FileText className="w-6 h-6" />}
            className="animate-fade-up [animation-delay:400ms]"
          />
          <Feature
            title="Perfect Job Match"
            description="Get tailored suggestions to match your skills with job requirements."
            icon={<Wand2 className="w-6 h-6" />}
            className="animate-fade-up [animation-delay:600ms]"
          />
        </div>
      </div>
    </section>
  );
};