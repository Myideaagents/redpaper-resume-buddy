import { Button } from "@/components/ui/button";
import { Feature } from "@/components/Feature";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Brain, Save, Layout } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary animate-fade-down">
            Optimize Your Resume for the Perfect Job Match
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto animate-fade-up">
            Use AI-powered tools to create tailored resumes that stand out and get you noticed by employers.
          </p>
          <div className="mt-10 animate-fade-up">
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
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
              title="Save & Manage Resumes"
              description="Keep all your tailored resumes organized and easily accessible in one place."
              icon={<Save className="w-6 h-6" />}
              className="animate-fade-up [animation-delay:400ms]"
            />
            <Feature
              title="Professional Templates"
              description="Choose from a variety of ATS-friendly templates designed for success."
              icon={<Layout className="w-6 h-6" />}
              className="animate-fade-up [animation-delay:600ms]"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">RedPaper</h3>
              <p className="text-primary-foreground/80">
                Making resume optimization easy and effective.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="hover:text-primary-foreground/80">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-primary-foreground/80">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-primary-foreground/80">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-primary-foreground/80">
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