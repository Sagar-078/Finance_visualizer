"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });
    setLoading(false);

    if (res.ok) {
      toast.success("Registered successfully");
      router.push("/login");
    } else {
      const data = await res.json();
      toast.error(data.error || "Registration failed");
    }
  };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/");
        }
    }, []);

  return (
    <div  className="max-w-md mx-auto mt-10 space-y-4 p-6 items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 space-y-4 bg-white p-6 rounded shadow"
      >
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Sign Up"}
        </Button>
      </form>
      <div className="flex justify-between font-semibold mt-4 text-sm p-3">
        <p> Do you have account ?</p>
        <button onClick={() => router.push("/login")} className="text-blue-950 cursor-pointer">
          SignIn
        </button>
      </div>
    </div>
  );
}
