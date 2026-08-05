import { Link } from 'react-router-dom';

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-slate-50 px-5 py-4 md:px-12">
      <div className="font-display text-[1.15rem] font-semibold text-slate-900">🌱 E-Krishi</div>

      <nav className="hidden items-center gap-8 md:flex">
        <a href="#features" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Features</a>
        <a href="#how-it-works" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">How it works</a>
        <a href="#preview" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Try it</a>
      </nav>

      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm font-semibold text-slate-700">Log in</Link>
        <Link to="/signup" className="rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95">Get started</Link>
      </div>
    </header>
  );
}