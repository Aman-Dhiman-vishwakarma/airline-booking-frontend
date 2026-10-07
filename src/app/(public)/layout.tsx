import GlobalAlert from "@/components/alert/GlobalAlert";
import Header from "@/components/layout/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
       <GlobalAlert topOffset="72px" />
      {children}
    </>
  );
}