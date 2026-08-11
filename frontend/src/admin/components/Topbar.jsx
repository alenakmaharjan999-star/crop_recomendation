import { Bell, Search } from "lucide-react";

export default function Topbar({ title }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-8 backdrop-blur">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="text-sm text-gray-500">
          Manage your crop recommendation system
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-xl p-2.5 text-gray-500 hover:bg-gray-100">
          <Search className="h-5 w-5" />
        </button>

        <button className="relative rounded-xl p-2.5 text-gray-500 hover:bg-gray-100">
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-500" />
        </button>

        <div className="h-9 w-px bg-gray-200" />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
}