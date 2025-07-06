"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", form.email);
      toast.success("Logged in successfully");
      router.push("/");
    } else {
      const data = await res.json();
      toast.error(data.error || "Login failed");
    }
  };

  return (
    <div  className="max-w-md mx-auto mt-10 space-y-4 p-6 items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 space-y-4 bg-white p-6 rounded shadow"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="flex justify-between font-semibold mt-4 text-sm p-3">
        <p>Want to register account ?</p>
        <button onClick={() => router.push("/register")} className="text-blue-950 cursor-pointer">
          Signup
        </button>
      </div>

    </div>
  );
}