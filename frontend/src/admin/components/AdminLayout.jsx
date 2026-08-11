import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({
  children,
  title,
  activePage,
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage={activePage} />

      <div className="ml-64">
        <Topbar title={title} />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}