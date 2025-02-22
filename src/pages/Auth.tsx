
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Google, Linkedin } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (isSignUp: boolean) => {
    setLoading(true);
    try {
      const authMethod = isSignUp
        ? supabase.auth.signUp.bind(supabase.auth)
        : supabase.auth.signInWithPassword.bind(supabase.auth);

      const { error } = await authMethod({
        email,
        password,
      });

      if (error) throw error;

      if (!isSignUp) {
        navigate("/");
      } else {
        toast({
          title: "Verification email sent",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google' | 'linkedin_oidc') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <Card className="glass-card w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">Sign in to access AI Radio Host</p>
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => handleAuth(false)}
              disabled={loading}
            >
              Sign In
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleAuth(true)}
              disabled={loading}
            >
              Sign Up
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              disabled={true}
              className="w-full"
            >
              <Google className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('github')}
              disabled={true}
              className="w-full"
            >
              <Github className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('linkedin_oidc')}
              disabled={true}
              className="w-full"
            >
              <Linkedin className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
