import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/auth";

export const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-white z-50 border-b">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-3xl font-bold text-accent">RedPaper</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/templates" className="text-gray-600 hover:text-accent">Templates</Link>
          <Link to="/features" className="text-gray-600 hover:text-accent">Features</Link>
          <Link to="/pricing" className="text-gray-600 hover:text-accent">Pricing</Link>
          <Link to="/about" className="text-gray-600 hover:text-accent">About</Link>
        </div>
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/signin">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-accent hover:bg-accent/90">Sign Up</Button>
              </Link>
            </>
          ) : (
            <Link to="/dashboard">
              <Button className="bg-accent hover:bg-accent/90">Dashboard</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};