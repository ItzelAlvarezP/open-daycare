import { AppSidebar } from "../_components/app-sidebar";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-dvh md:flex">
      <AppSidebar />
      {children}
    </div>
  );
}
