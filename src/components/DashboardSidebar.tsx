import { FileText, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

export const DashboardSidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-accent">RedPaper</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/10 text-gray-700"
            >
              <FileText className="w-5 h-5" />
              <span>My Resumes</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/profile"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/10 text-gray-700"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:text-accent"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};