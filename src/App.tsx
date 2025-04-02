
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { WalletProvider } from "@/context/WalletContext";
import { MainLayout } from "@/layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import SendPage from "./pages/SendPage";
import ReceivePage from "./pages/ReceivePage";
import SwapPage from "./pages/SwapPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/send" element={<SendPage />} />
                <Route path="/receive" element={<ReceivePage />} />
                <Route path="/swap" element={<SwapPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </TooltipProvider>
      </WalletProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
