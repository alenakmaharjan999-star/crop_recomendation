import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-8 lg:px-10">{children}</main>
    </div>
  );
}
