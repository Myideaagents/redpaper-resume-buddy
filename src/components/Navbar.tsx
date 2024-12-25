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
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-3xl font-semibold tracking-tight text-accent">RedPaper</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/templates" className="text-gray-600 hover:text-accent transition-colors duration-200">Templates</Link>
          <Link to="/features" className="text-gray-600 hover:text-accent transition-colors duration-200">Features</Link>
          <Link to="/pricing" className="text-gray-600 hover:text-accent transition-colors duration-200">Pricing</Link>
          <Link to="/about" className="text-gray-600 hover:text-accent transition-colors duration-200">About</Link>
        </div>
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/signin">
                <button className="text-accent hover:text-accent/90 font-medium px-5 py-2 rounded-full transition-colors duration-200">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button className="apple-button">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <Link to="/dashboard">
              <button className="apple-button">
                Dashboard
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};