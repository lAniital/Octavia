import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import PatientDetail from "@/pages/PatientDetail";
import MonitoringSurveillance from "@/pages/MonitoringSurveillance";
import Interactions from "@/pages/Interactions";
import Predictions from "@/pages/Predictions";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import Analyses from "@/pages/Analyses";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/monitoring" element={<MonitoringSurveillance />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/interactions" element={<Interactions />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analyses" element={<Analyses />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
