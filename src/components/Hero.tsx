import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-6xl font-bold mb-6">
              <span className="text-black">NEW</span><br />
              <span className="text-accent">REDPAPER</span><br />
              <span className="text-black">RESUME</span><br />
              <span className="text-black">COLLECTION</span>
            </h1>
            <p className="text-gray-600 text-xl mb-8 max-w-lg">
              Transform your career opportunities with AI-powered resume optimization
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="grid grid-cols-3 gap-4">
              {/* Resume Preview Cards */}
              <div className="animate-fade-up [animation-delay:200ms] bg-gray-50 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform">
                <div className="h-64 bg-white rounded border-2 border-gray-100 p-4">
                  <div className="w-1/3 h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-gray-100 rounded"></div>
                    <div className="w-5/6 h-2 bg-gray-100 rounded"></div>
                    <div className="w-4/6 h-2 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <p className="text-sm text-center mt-2 text-gray-600">Your Resume</p>
              </div>
              
              <div className="animate-fade-up [animation-delay:400ms] bg-gray-50 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform">
                <div className="h-64 bg-white rounded border-2 border-gray-100 p-4">
                  <div className="w-2/3 h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="w-full h-3 bg-accent/20 rounded"></div>
                    <div className="w-5/6 h-3 bg-accent/20 rounded"></div>
                    <div className="w-full h-3 bg-accent/20 rounded"></div>
                  </div>
                </div>
                <p className="text-sm text-center mt-2 text-gray-600">Job Description</p>
              </div>
              
              <div className="animate-fade-up [animation-delay:600ms] bg-gray-50 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform">
                <div className="h-64 bg-white rounded border-2 border-accent p-4">
                  <div className="w-1/2 h-4 bg-accent/20 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-accent/10 rounded"></div>
                    <div className="w-5/6 h-2 bg-accent/10 rounded"></div>
                    <div className="w-4/6 h-2 bg-accent/10 rounded"></div>
                  </div>
                </div>
                <p className="text-sm text-center mt-2 text-gray-600">Optimized Resume</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};