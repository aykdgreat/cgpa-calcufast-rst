import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { logout, isAuthenticated } = useAuth();
  return (
    <header className="flex justify-between items-center h-20 shadow-md w-full py-4 px-16">
      <div className="font-bold text-3xl">CGPA-Calcufast</div>
      <nav>
        {isAuthenticated && (
          <button
            onClick={logout}
            className="font-semibold text-lg px-4 py-2  cursor-pointer hover:bg-white border border-black rounded-lg "
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
