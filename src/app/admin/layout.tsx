import AdminRoute from "@/components/auth/AdminRoute";
import AdminSidebar from "@/components/admin/AdminSidebar";
import GlobalAlert from "@/components/alert/GlobalAlert";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <AdminRoute>
      <AdminSidebar>
        <GlobalAlert topOffset="0px" />
        {children}
      </AdminSidebar>
    </AdminRoute>
  );
}