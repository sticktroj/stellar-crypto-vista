
import { ReactNode } from "react";
import { AppNavigation } from "@/components/AppNavigation";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <div className="w-full md:w-64 md:h-screen md:overflow-y-auto">
        <AppNavigation />
      </div>
      <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
