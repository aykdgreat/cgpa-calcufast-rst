import { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "sonner";
const App: FC = () => {
  return (
    <>
      <Router>
        <Toaster richColors={true} closeButton={true} position="top-center" />
        <Header />
        <main className="mx-4 md:mx-16 py-10">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
          </Routes>
        </main>
      </Router>
    </>
  );
};

export default App;
