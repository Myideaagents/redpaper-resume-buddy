import { Button } from "@/components/ui/button";
import { Feature } from "@/components/Feature";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Brain, FileText, Wand2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
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
                {/* Resume Template Preview */}
                <div className="animate-fade-up [animation-delay:200ms] bg-gray-50 rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform">
                  <div className="h-64 bg-white rounded border-2 border-gray-100 p-4">
                    <div className="w-1/3 h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-gray-100 rounded"></div>
                      <div className="w-5/6 h-2 bg-gray-100 rounded"></div>
                      <div className="w-4/6 h-2 bg-gray-100 rounded"></div>
                      {/* Added Details */}
                      <div className="mt-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-accent/20"></div>
                          <div className="w-20 h-2 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-accent/20"></div>
                          <div className="w-24 h-2 bg-gray-200 rounded"></div>
                        </div>
                      </div>
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
                      {/* Added Details */}
                      <div className="mt-4 p-2 bg-accent/5 rounded">
                        <div className="w-full h-2 bg-accent/20 rounded mb-2"></div>
                        <div className="w-4/5 h-2 bg-accent/20 rounded"></div>
                      </div>
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
                      {/* Added Details */}
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded-sm bg-accent/30"></div>
                          <div className="w-32 h-2 bg-accent/20 rounded"></div>
                        </div>
                        <div className="w-full h-16 bg-accent/5 rounded p-2">
                          <div className="space-y-1">
                            <div className="w-full h-1.5 bg-accent/10 rounded"></div>
                            <div className="w-11/12 h-1.5 bg-accent/10 rounded"></div>
                            <div className="w-4/5 h-1.5 bg-accent/10 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-center mt-2 text-gray-600">Optimized Resume</p>
                </div>
              </div>
              
              {/* Snake-like Red Line */}
              <div className="absolute -z-10 top-1/2 left-0 right-0 transform -translate-y-1/2">
                <svg className="w-full" viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M0 100C200 20 400 180 600 100C800 20 1000 180 1200 100" 
                    stroke="#f56565" 
                    strokeWidth="4"
                    strokeDasharray="8 8"
                    className="animate-[dash_20s_linear_infinite]"
                  >
                    <animate 
                      attributeName="stroke-dashoffset" 
                      from="0" 
                      to="-100" 
                      dur="2s" 
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Story</h2>
            <div className="prose prose-lg mx-auto">
              <p className="text-gray-600 mb-6">
                RedPaper was born from a personal struggle. As a job seeker myself, I spent countless hours tailoring resumes for different positions, often feeling lost in the process. The breakthrough came when I realized that AI could transform this tedious task into a streamlined, intelligent process.
              </p>
              <p className="text-gray-600 mb-6">
                After missing out on several dream opportunities due to poorly optimized resumes, I decided to create a solution that would help others avoid the same frustration. RedPaper combines cutting-edge AI technology with years of recruitment insights to help you create the perfect resume for every opportunity.
              </p>
              <p className="text-gray-600">
                Today, RedPaper helps thousands of job seekers optimize their resumes and land their dream jobs. We're committed to continuously improving our platform to make the job application process smoother and more successful for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">RedPaper</h3>
              <p className="text-gray-400">
                Making resume optimization easy and effective.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                Questions? Reach out to us at support@redpaper.com
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;