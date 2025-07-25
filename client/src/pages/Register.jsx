import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import PhoneInputLu from '@/components/shared/PhoneInputLu';
import { registerAdmin } from "@/services/adminService";
import { useAuth } from '@/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeName, setHomeName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !phone || !password || !homeName) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await registerAdmin({ name, phone, email, password, home_name: homeName });
      register(res.admin, res.token);
      navigate("/");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-start bg-muted px-4 py-10 space-y-6">
      {/* Logo + App Name */}
      <div className="h-52 flex flex-col items-center justify-center">
        <img src="/nest.svg" alt="Nest Logo" className="w-36 h-36" />
        <h1 className="text-2xl font-semibold -mt-3 text-[color:oklch(0.645_0.246_16.439)]">Nest</h1>
      </div>

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
                required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="admin-phone">Phone</Label>
                <PhoneInputLu
                  nameValue="admin-phone"
                  valueInput={phone}
                  onChangeInput={setPhone}
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
                  required
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

            <div className="space-y-2">
                <Label htmlFor="admin-home">Home Name</Label>
                <Input
                id="admin-home"
                placeholder="Enter home name"
                value={homeName}
                onChange={(e) => setHomeName(e.target.value)}
                required
                />
            </div>

            <Button type="submit" className="w-full gap-2">
                <FaUserPlus />
                Register
            </Button>
            </form>
      </div>

      <div className="text-center text-sm text-muted-foreground pt-2">
        Already have account?{" "}
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/login")}
          className="text-primary hover:bg-accent font-medium px-2"
        >
          Login
        </Button>
        </div>
    </div>
  );
}
