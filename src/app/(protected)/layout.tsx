import Header from "@/components/layout/Header";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GlobalAlert from "@/components/alert/GlobalAlert";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  return (
    <ProtectedRoute>
      <Header />
      <GlobalAlert topOffset="72px" />

      <main>{children}</main>
    </ProtectedRoute>
  );
}