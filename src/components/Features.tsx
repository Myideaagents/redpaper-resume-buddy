import { Brain, MessageSquare, Download } from "lucide-react";
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
            title="AI-Powered Resume Optimization"
            description="Our advanced AI analyzes job descriptions and optimizes your resume to match perfectly, removing unnecessary formatting."
            icon={<Brain className="w-6 h-6" />}
            className="animate-fade-up [animation-delay:200ms]"
          />
          <Feature
            title="Interview Q&A Generator"
            description="Get personalized interview questions and detailed answers based on your resume and job requirements."
            icon={<MessageSquare className="w-6 h-6" />}
            className="animate-fade-up [animation-delay:400ms]"
          />
          <Feature
            title="Save & Download Options"
            description="Save up to 5 optimized resumes and download them in your preferred format (Word, PDF, or Text)."
            icon={<Download className="w-6 h-6" />}
            className="animate-fade-up [animation-delay:600ms]"
          />
        </div>
      </div>
    </section>
  );
};