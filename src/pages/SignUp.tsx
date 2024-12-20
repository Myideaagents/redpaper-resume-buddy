import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signUp } from "@/lib/auth";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password);
      toast({
        title: "Success!",
        description: "Please check your email to verify your account.",
      });
      navigate("/signin");
    } catch (error: any) {
      // Check if the error is due to existing user
      if (error.message.includes("user_already_exists")) {
        toast({
          title: "Account Already Exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/signin"), 2000); // Redirect to signin after 2 seconds
      } else {
        toast({
          title: "Error",
          description: "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-accent">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 text-accent hover:text-accent/90"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}