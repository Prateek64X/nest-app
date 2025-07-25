import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import PhoneInputLu from '@/components/shared/PhoneInputLu';
import { loginAdmin } from '@/services/adminService';
import { useAuth } from '@/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!phone || !password) {
      alert("Please enter correct details");
      return;
    }

    try {
      const res = await loginAdmin({ phone, password });
      login(res.admin, res.token);
      navigate("/");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-start bg-muted px-4 py-10 space-y-6">
      {/* Logo + App Name */}
      <div className="h-62 flex flex-col items-center justify-center">
        <img src="/nest.svg" alt="Nest Logo" className="w-36 h-36" />
        <h1 className="text-2xl font-semibold -mt-3 text-[color:oklch(0.645_0.246_16.439)]">Nest</h1>
      </div>

      <div className="w-[340px] space-y-5 bg-background p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-foreground">Login Admin</h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="admin-phone">Phone</Label>
            <PhoneInputLu
              nameValue="admin-phone"
              valueInput={phone}
              onChangeInput={setPhone}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-12"
              />

              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-0 h-full px-2 flex items-center justify-center rounded-r-md text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full gap-2">
            <FaSignInAlt />
            Login
          </Button>
        </form>
      </div>

      <div className="text-center text-sm text-muted-foreground pt-2">
        Don't have an account?{" "}
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/register")}
          className="text-primary hover:bg-accent font-medium px-2"
        >
          Register
        </Button>
      </div>
    </div>
  );
}
