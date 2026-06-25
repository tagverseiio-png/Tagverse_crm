'use client';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { WorkspaceProvider } from '@/context/WorkspaceContext';

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Get route segment (e.g. /leads -> leads)
  const activePage = pathname.split('/').filter(Boolean)[0] || 'dashboard';

  return (
    <WorkspaceProvider>
      <div className="crm-layout">
        <Sidebar />
        <div className="main-content">
          <Topbar activePage={activePage} />
          <div className="page-content animate-fade" key={pathname}>
            {children}
          </div>
        </div>
      </div>
    </WorkspaceProvider>
  );
}

