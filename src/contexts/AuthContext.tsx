// import { ACCESS_TOKEN } from "../helpers/constants";
// import { jwtDecode } from "jwt-decode";
import { useState, createContext, useContext, useEffect } from "react";
import supabase from "../supabase";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const logout = async () => {
    await supabase.auth.signOut(); // optional: sign out from Supabase too
    setUser(null);
    setIsAuthenticated(false);
    toast.success("You have been signed out!");
  };

  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      // console.log("session", session);
      setUser(session.user as User);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  let context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
