import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BuildProvider } from "@/contexts/BuildContext";
import Entry from "./pages/Entry";
import JobDefinition from "./pages/JobDefinition";
import Questions from "./pages/Questions";
import Review from "./pages/Review";
import Generating from "./pages/Generating";
import Materials from "./pages/Materials";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BuildProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Entry />} />
            <Route path="/job-definition" element={<JobDefinition />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/review" element={<Review />} />
            <Route path="/generating" element={<Generating />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BuildProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
