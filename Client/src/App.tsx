import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppRouter } from "@/routes/AppRouter";
import { ThemeProvider } from "@/hooks/ThemeContext";
import { ChatWidget } from "@/components/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <AppRouter />
        <ChatWidget />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;