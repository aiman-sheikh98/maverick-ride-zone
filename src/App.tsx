
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookCab from "./pages/BookCab";
import ServiceAreas from "./pages/ServiceAreas";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// Admin Routes
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAreas from "./pages/admin/Areas";
import AdminContacts from "./pages/admin/Contacts";
import AdminBookings from "./pages/admin/Bookings";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/book-cab" element={<BookCab />} />
    <Route path="/service-areas" element={<ServiceAreas />} />
    <Route path="/about" element={<About />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
    
    {/* Admin Routes */}
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/areas" element={<AdminAreas />} />
    <Route path="/admin/contacts" element={<AdminContacts />} />
    <Route path="/admin/bookings" element={<AdminBookings />} />
    
    {/* Catch-all Route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
