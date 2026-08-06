import { Link } from 'react-router-dom';
import logo from '../assets/logoagri.jpg';

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-slate-50/95 backdrop-blur px-5 py-4 md:px-12">

      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="E-Krishi Logo"
          className="h-9 w-9 object-contain"
        />

        <span className="font-display text-[1.15rem] font-semibold text-slate-900">
          E-Krishi
        </span>
      </Link>


      {/* Navigation */}
      <nav className="hidden items-center gap-8 md:flex">
        <a
          href="#features"
          className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          Features
        </a>

 <a
          href="#recommendation"
          className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          Recommendation
        </a>
        <a
          href="#how-it-works"
          className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          How it works
        </a>

       
      </nav>


      {/* Authentication Buttons */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
        >
          Log in
        </Link>

        <Link
          to="/signup"
          className="rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
        >
          Get started
        </Link>
      </div>

    </header>
  );
}