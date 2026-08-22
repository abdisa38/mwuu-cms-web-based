import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import mwuLogo from "../../../imports/download.jfif";
import { Button } from "../ui/Button";
import { Menu, X, ShieldCheck, Home, HelpCircle, Sparkles, LogIn, UserPlus } from "lucide-react";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
            <ImageWithFallback src={mwuLogo} alt="MWU Logo" className="w-10 h-10 object-contain rounded-md shadow-xs" />
            <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
              MWU e-Clearance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/verify" className="hover:text-blue-600 transition-colors">Verify Certificate</Link>
            <Link to="/features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link to="/faq" className="hover:text-blue-600 transition-colors">FAQs</Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-medium">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 font-medium">
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/login">
              <Button size="sm" variant="ghost" className="text-xs text-slate-700 px-2.5">
                Log In
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname === "/" ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Home className="w-4 h-4 text-slate-500" />
                Home
              </Link>
              <Link
                to="/verify"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname === "/verify" ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                Verify Certificate
              </Link>
              <Link
                to="/features"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname === "/features" ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Sparkles className="w-4 h-4 text-slate-500" />
                Features
              </Link>
              <Link
                to="/faq"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  location.pathname === "/faq" || location.pathname === "/faqs" ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                FAQs
              </Link>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link to="/register" onClick={closeMobileMenu}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  <UserPlus className="w-4 h-4 mr-2" /> Register Student Account
                </Button>
              </Link>
              <Link to="/login" onClick={closeMobileMenu}>
                <Button variant="outline" className="w-full border-slate-200 text-slate-700 font-semibold">
                  <LogIn className="w-4 h-4 mr-2" /> Sign In to Portal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-10 mt-auto">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <ImageWithFallback src={mwuLogo} alt="MWU Logo" className="w-8 h-8 grayscale opacity-70" />
            <span>&copy; {new Date().getFullYear()} Madda Walabu University. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-xs sm:text-sm">
            <Link to="/features" className="hover:text-slate-900 transition-colors">Features</Link>
            <Link to="/verify" className="hover:text-slate-900 transition-colors">Verify</Link>
            <Link to="/faq" className="hover:text-slate-900 transition-colors">FAQs</Link>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Portal Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
