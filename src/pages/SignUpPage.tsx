import { FC, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabase";
import { toast } from "sonner";

const SignUpPage: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cPassword, setCPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !email || !password || !cPassword) {
      toast.error("All fields must be filled!");
      return;
    }

    if (password !== cPassword) {
      toast.error("Password does not match, please try again!");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      console.error("Registration error:", error.message);
      return;
    }

    if (data.user) {
      setUser(data.user);
      setIsAuthenticated(true);
      setLoading(false);
      toast.success("Account has been created successfully!");
    }

    navigate("/");
  };

  return (
    <section className="flex flex-col justify-center px-6 py-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-sm w-98">
      <h1 className="mb-4 text-2xl font-semibold text-center">Signup now!</h1>
      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="username" className="block mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border bg-gray-50 border-gray-300 w-full text-gray-900 text-sm rounded-lg p-2.5 mb-2"
          />
        </div>
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
          <label htmlFor="password" className="block mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={cPassword}
            onChange={(e) => setCPassword(e.target.value)}
            className="border bg-gray-50 border-gray-300 w-full text-gray-900 text-sm rounded-lg p-2.5 mb-2"
          />
        </div>
        <div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-2 mt-2 text-lg font-semibold text-center text-white rounded-md cursor-pointer bg-black/90 hover:bg-black"
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </div>{" "}
        <p className="mt-4 text-lg">
          Already have an account?{" "}
          <Link to="/signin" className="font-bold">
            Signin here
          </Link>
        </p>
      </form>
    </section>
  );
};

export default SignUpPage;
