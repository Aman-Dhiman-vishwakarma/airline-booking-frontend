import PublicRoute from "@/components/auth/PublicRoute";

interface GuestLayoutProps {
  children: React.ReactNode;
}

export default function GuestLayout({
  children,
}: GuestLayoutProps) {
  return (
    <PublicRoute>
      {children}
    </PublicRoute>
  );
}