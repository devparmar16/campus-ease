import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/supabase/supabaseClient';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/UserContext';


const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUserData } = useUser();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!userId || !password) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive"
      });
      return;
    }
  
    setLoading(true);
  
    try {
      // Step 1: Check ID format and determine role
      let role = '';
      let tableName = '';
      let email = '';
  
      const studentIdPattern = /^[2][0-5](dit|dce|dcs|it|ce|cs)\d{3}$/i;
      const facultyIdPattern = /^fac_(dit|dce|dcs|it|ce|cs)\d{3}$/i;
      const adminIdPattern = /^admin\d{3}$/i;

      const studentEmailPattern = (id: string) => new RegExp(`^${id}@charusat.edu.in$`, 'i');
      // Faculty email pattern (ID is the faculty ID, i.e., facId)
      const facultyEmailPattern = (id: string) => new RegExp(`^${id}@charusat.ac.in$`, 'i');
      // Admin email pattern (ID is the admin ID, format: adminId_ad)
      const adminEmailPattern = (id: string) => new RegExp(`^${id}_ad@charusat.ac.in$`, 'i');
  
      if (studentIdPattern.test(userId)) {
        tableName = 'users'; // Student IDs are stored in the 'users' table
      } else if (facultyIdPattern.test(userId)) {
    
        tableName = 'faculty'; // Faculty IDs are stored in the 'faculty' table
      } else if (adminIdPattern.test(userId)) {
        tableName = 'admin'; // Admin IDs are stored in the 'admin' table
      } else {
        throw new Error("Invalid ID format");
      }
  
      // Step 2: Query the appropriate table based on the role
      const { data: userData, error: userError } = await supabase
        .from(tableName)
        .select('*')
        .ilike('user_id', userId)
        .maybeSingle();
     
        console.log("Logging in with ID:", userId);
        console.log("Querying table:", tableName);


      if (!userData) {
        console.log(tableName);
        console.log(userData);

        throw new Error(`${role} ID not found`);
      }
      
  
      email = userData.email;
  
      // Step 3: Use email to log in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (authError) {
        throw new Error("Invalid credentials");
      }

      setUserData({
        id: userData.id,
        user_id: userData.user_id,
        fname: userData.fname,
        lname: userData.lname,
        email: userData.email,
        profile_photo: userData.profile_photo,
        course_taken:userData.course_taken,
        mobile_num:userData.mobile_num,
        address:userData.address,
        dob:userData.dob,
        emergency_contact:userData.emergency_contact,
        role: studentIdPattern.test(userId) && studentEmailPattern(userId).test(email) ? 'student' :
        facultyIdPattern.test(userId) && facultyEmailPattern(userId).test(email) ? 'faculty' : 'admin', // 'student', 'faculty', or 'admin'
      });
  
      sessionStorage.setItem('isLoggedIn', 'true');
      toast({
        title: "Login Successful",
        description: "Welcome back to CampusEase!",
      });
      navigate("/Index");
  
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-campus-gradient flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black">Welcome Back</h1>
          <p className="text-lg text-black/90 mt-2">Sign in to continue to CampusEase</p>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-black font-bold text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="userId" className="text-sm font-medium">ID Number</label>
                <Input
                  id="userId"
                  placeholder="Enter your ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Link to="/forgot-password" className="text-sm text-campus-blue hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-campus-blue hover:bg-campus-dark-blue text-black"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-campus-blue hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
