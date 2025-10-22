import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Hedging from "./pages/Hedging";
import Contracts from "./pages/Contracts";
import Education from "./pages/Education";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";
import { marketService } from "./services/marketService";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Start market simulation when app loads
    marketService.startMarketSimulation();
    
    return () => {
      marketService.stopMarketSimulation();
    };
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hedging" element={<Hedging />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/education" element={<Education />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Navigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
