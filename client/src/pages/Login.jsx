import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import PhoneInputLu from '@/components/shared/PhoneInputLu';
import { loginAdmin } from '@/services/adminService';
import { useAuth } from '@/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'sonner';
import NestLogo from '@/components/shared/NestLogo';

const loginSchema = z.object({
  phone: z
    .preprocess((val) => {
      const digits = String(val).replace(/\D/g, '');
      return digits.slice(-10);
    }, z
      .string()
      .refine((val) => /^\d{10}$/.test(val), {
        message: 'Enter a valid 10-digit phone number',
      })
    ),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ phone, password });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setFormErrors(fieldErrors);
      return;
    }

    try {
      const res = await loginAdmin({ phone, password });

      // Check if the response has tenant or admin
      if (res.admin) {
        login(res.admin, res.token, 'admin');
        navigate('/');
      } else if (res.tenant) {
        login(res.tenant, res.token, 'tenant');
        navigate('/user');
      } else {
        throw new Error("Invalid login response");
      }

    } catch (err) {
      console.error("Error: ", err.message);
    }
  };


  return (
    <div className="min-h-dvh flex flex-col items-center justify-start lg:justify-center bg-muted px-4 py-10 space-y-6">
      {/* Logo + App Name */}
      <NestLogo />

      <div className="w-[340px] space-y-5 bg-background p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-foreground">Login Admin</h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="admin-phone">Phone</Label>
            <PhoneInputLu
              nameValue="admin-phone"
              valueInput={phone}
              onChangeInput={setPhone}
              formError={formErrors.phone}
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
                className={formErrors.password ? 'border-destructive' : 'pr-12'}
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
            {formErrors.password && (
              <span className="text-xs text-destructive">{formErrors.password}</span>
            )}
          </div>

          <Button type="submit" className="w-full gap-2">
            <FaSignInAlt />
            Login
          </Button>
        </form>
      </div>

      <div className="text-center text-sm text-muted-foreground pt-2">
        Don't have an account?{' '}
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate('/register')}
          className="text-primary hover:bg-accent font-medium px-2"
        >
          Register
        </Button>
      </div>
    </div>
  );
}
