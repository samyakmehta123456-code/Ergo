"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Account created successfully");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-slate-50 text-slate-900">
      
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Ergo
        </h1>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_20px_50px_rgba(53,89,224,0.12)] border border-slate-200/80 relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-[#3559E0] focus:bg-white outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-[#3559E0] focus:bg-white outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-[#3559E0] focus:bg-white outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3559E0] hover:bg-[#2c4ac0] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 transition shadow-md shadow-[#3559E0]/25 disabled:opacity-50"
          >
            {loading ? <span>Creating Account...</span> : <><span>Register Account</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#3559E0] hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
