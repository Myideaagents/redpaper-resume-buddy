import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/auth";
import { User, LogOut, FileText } from "lucide-react";

export const ResumeSidebar = () => {
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error('Error loading resumes:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-accent">RedPaper</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mb-8">
          <Link to="/profile">
            <Button variant="ghost" className="w-full justify-start">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="w-4 h-4 mr-2" />
            My Resumes
          </Button>
          <div className="space-y-2 mt-2">
            {resumes.map((resume) => (
              <Button
                key={resume.id}
                variant="ghost"
                className="w-full justify-start text-sm truncate"
                onClick={() => navigate(`/resumes/${resume.id}`)}
              >
                {resume.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};