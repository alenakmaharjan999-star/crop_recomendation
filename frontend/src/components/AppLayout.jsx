import Sidebar from './Sidebar';
import './AppLayout.css';

export default function AppLayout({ children, mainClassName = '' }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className={`app-layout__main ${mainClassName}`}>{children}</main>
    </div>
  );
}
