
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate login API call
    setTimeout(() => {
      // Demo credentials
      if (username === 'admin' && password === 'password') {
        toast({
          title: "Login Successful",
          description: "Welcome to the Library Management System.",
        });
        navigate('/');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password. Try admin/password.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-primary">Library</span> Hub
          </h1>
          <p className="text-muted-foreground">
            Sign in to the Library Management System
          </p>
        </div>
        
        <div className="glass-effect rounded-xl p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="focus-ring"
                autoComplete="username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="focus-ring pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <div className="text-center mt-4 text-sm text-muted-foreground">
              <p>Demo credentials:</p>
              <p>Username: <span className="font-medium">admin</span>, Password: <span className="font-medium">password</span></p>
            </div>
          </form>
        </div>
        
        <div className="flex items-center justify-center mt-6">
          <Lock size={14} className="text-muted-foreground mr-1" />
          <p className="text-xs text-muted-foreground">
            Secure login for library administrators only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
