import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import MainLayout from "./components/MainLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import DocumentationCenter from "./pages/DocumentationCenter";
import Referrals from "./pages/Referrals";
import Crisis from "./pages/Crisis";
import Services from "./pages/Services";
import Staff from "./pages/Staff";
import Billing from "./pages/Billing";
import Compliance from "./pages/Compliance";
import Reports from "./pages/Reports";
import SOPChapters from "./pages/SOPChapters";
import Ch1Admissions from "./pages/sop/Ch1Admissions";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/clients" component={Clients} />
        <Route path="/documentation" component={DocumentationCenter} />
        <Route path="/referrals" component={Referrals} />
        <Route path="/crisis" component={Crisis} />
        <Route path="/services" component={Services} />
        <Route path="/staff" component={Staff} />
        <Route path="/billing" component={Billing} />
        <Route path="/compliance" component={Compliance} />
        <Route path="/reports" component={Reports} />
      <Route path="/sop-chapters" component={SOPChapters} />
      <Route path="/sop/ch1-admissions" component={Ch1Admissions} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

