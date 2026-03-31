import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AirportProximityGate from "@/components/AirportProximityGate";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import MessagesPage from "./pages/MessagesPage";
import UserProfilePage from "./pages/UserProfilePage";
import NotFound from "./pages/NotFound";
import SkoinPage from "./pages/SkoinPage";
import SkoinPaymentPage from "./pages/SkoinPaymentPage";
import AboutPage from "./pages/AboutPage";
import SafetyPage from "./pages/SafetyPage";
import HelpPage from "./pages/HelpPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PrivacyPage from "./pages/PrivacyPage";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<AirportProximityGate><Dashboard /></AirportProximityGate>} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/search" element={<AirportProximityGate><SearchPage /></AirportProximityGate>} />
            <Route path="/messages" element={<AirportProximityGate><MessagesPage /></AirportProximityGate>} />
            <Route path="/messages/:userId" element={<AirportProximityGate><MessagesPage /></AirportProximityGate>} />
            <Route path="/user/:userId" element={<AirportProximityGate><UserProfilePage /></AirportProximityGate>} />
            <Route path="/skoin" element={<SkoinPage />} />
            <Route path="/skoin/payment" element={<SkoinPaymentPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
