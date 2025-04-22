import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { User } from "@supabase/supabase-js";
import supabase from "../supabase";
import { toast } from "sonner";

const SignInPage: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields must be filled!");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      return;
    }

    if (data.user) {
      setUser?.(data.user as User);
      setIsAuthenticated(true);
      setLoading(false);
      toast.success("You have been signed in successfully!");
    }
    navigate("/");
  };

  return (
    <section className="flex flex-col justify-center px-6 py-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-sm w-98">
      <h1 className="mb-4 text-2xl font-semibold text-center">
        Signin to continue!
      </h1>
      <form onSubmit={handleSignIn}>
        <div>
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border bg-gray-50 border-gray-300 w-full text-gray-900 text-sm rounded-lg p-2.5 mb-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="border bg-gray-50 border-gray-300 w-full text-gray-900 text-sm rounded-lg p-2.5 mb-2"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 mt-2 text-lg font-semibold text-center text-white rounded-md cursor-pointer bg-black/90 hover:bg-black"
          >
            {loading ? "Signing in..." : "Signin"}
          </button>
        </div>
        <p className="mt-4 text-lg">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold">
            Signup here
          </Link>
        </p>
      </form>
    </section>
  );
};

export default SignInPage;
