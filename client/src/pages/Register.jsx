import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import PhoneInputLu from '@/components/shared/PhoneInputLu';
import { registerAdmin } from "@/services/adminService";
import { useAuth } from '@/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import clsx from "clsx";
import NestLogo from '@/components/shared/NestLogo';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(1, 'Enter a valid full name'),
  phone: z.preprocess(
    (val) => {
      const digits = String(val).replace(/\D/g, '');
      return digits.slice(-10);
    },
    z.string().refine((val) => /^\d{10}$/.test(val), {
      message: 'Phone must be a 10-digit number',
    })
  ),
  email: z.string().email('Enter a valid email address').optional(),
  password: z.string().min(1, 'Password is required'),
  homeName: z.string().min(1, 'Enter a valid home name'),
});

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeName, setHomeName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = registerSchema.safeParse({ name, phone, email, password, homeName });

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    try {
      const res = await registerAdmin({
        name,
        phone,
        email,
        password,
        home_name: homeName,
      });
      login(res.admin, res.token);
      navigate("/");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-start lg:justify-center bg-muted px-4 py-auto space-y-auto">
      {/* Logo + App Name */}
      <NestLogo />

      <div className="w-[340px] space-y-5 bg-background p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-foreground">Register Admin</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="admin-name">Name</Label>
            <Input
              id="admin-name"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(formErrors.name && 'border-destructive')}
            />
            {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
          </div>

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
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(formErrors.email && 'border-destructive')}
            />
            {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
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
                className={cn("pr-12", formErrors.password && 'border-destructive')}
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
            {formErrors.password && <p className="text-sm text-destructive">{formErrors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-home">Home Name</Label>
            <Input
              id="admin-home"
              placeholder="Enter home name"
              value={homeName}
              onChange={(e) => setHomeName(e.target.value)}
              className={cn(formErrors.homeName && 'border-destructive')}
            />
            {formErrors.homeName && <p className="text-sm text-destructive">{formErrors.homeName}</p>}
          </div>

          <Button type="submit" className="w-full gap-2">
            <FaUserPlus />
            Register
          </Button>
        </form>
      </div>

      <div className="text-center text-sm text-muted-foreground pt-2">
        Already have account?{' '}
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/login")}
          className="text-primary hover:bg-accent font-medium px-2 mb-12"
        >
          Login
        </Button>
      </div>
    </div>
  );
}