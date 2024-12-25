import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8">
            <h1 className="text-6xl font-semibold tracking-tight">
              <span className="text-black block">Transform</span>
              <span className="text-accent block">Your Resume</span>
              <span className="text-black block">With AI</span>
            </h1>
            <p className="text-gray-600 text-xl leading-relaxed max-w-lg">
              Create professional, tailored resumes that stand out with our AI-powered platform.
            </p>
            <Link to="/signup">
              <button className="apple-button">
                Get Started
              </button>
            </Link>
          </div>
          <div className="relative">
            <div className="grid grid-cols-3 gap-6">
              {/* Resume Preview Cards */}
              <div className="animate-fade-up [animation-delay:200ms] apple-card hover:scale-105 transition-all duration-300">
                <div className="h-64 bg-white rounded-xl border border-gray-100 p-4">
                  <div className="w-1/3 h-4 bg-gray-100 rounded-full mb-4"></div>
                  <div className="space-y-3">
                    <div className="w-full h-2 bg-gray-50 rounded-full"></div>
                    <div className="w-5/6 h-2 bg-gray-50 rounded-full"></div>
                    <div className="w-4/6 h-2 bg-gray-50 rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm text-center mt-4 text-gray-600">Your Resume</p>
              </div>
              
              <div className="animate-fade-up [animation-delay:400ms] apple-card hover:scale-105 transition-all duration-300">
                <div className="h-64 bg-white rounded-xl border border-gray-100 p-4">
                  <div className="w-2/3 h-4 bg-gray-100 rounded-full mb-4"></div>
                  <div className="space-y-3">
                    <div className="w-full h-2 bg-accent/10 rounded-full"></div>
                    <div className="w-5/6 h-2 bg-accent/10 rounded-full"></div>
                    <div className="w-full h-2 bg-accent/10 rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm text-center mt-4 text-gray-600">Job Description</p>
              </div>
              
              <div className="animate-fade-up [animation-delay:600ms] apple-card hover:scale-105 transition-all duration-300">
                <div className="h-64 bg-white rounded-xl border-2 border-accent p-4">
                  <div className="w-1/2 h-4 bg-accent/10 rounded-full mb-4"></div>
                  <div className="space-y-3">
                    <div className="w-full h-2 bg-accent/5 rounded-full"></div>
                    <div className="w-5/6 h-2 bg-accent/5 rounded-full"></div>
                    <div className="w-4/6 h-2 bg-accent/5 rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm text-center mt-4 text-gray-600">Optimized Resume</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};