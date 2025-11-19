import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import MobileFooter from "@/components/MobileFooter";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import Location from "@/pages/Location";
import Countries from "@/pages/Countries";
import Cities from "@/pages/Cities";
import Areas from "@/pages/Areas";
import Sitemap from "@/pages/Sitemap";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CommunityGuidelines from "@/pages/CommunityGuidelines";
import ContactUs from "@/pages/ContactUs";
import AboutUs from "@/pages/AboutUs";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/countries" component={Countries} />
      <Route path="/cities" component={Cities} />
      <Route path="/areas" component={Areas} />
      <Route path="/sitemap" component={Sitemap} />
      <Route path="/contact" component={ContactUs} />
      <Route path="/about" component={AboutUs} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/community-guidelines" component={CommunityGuidelines} />
      <Route path="/location/country/:slug" component={Location} />
      <Route path="/location/city/:slug" component={Location} />
      <Route path="/location/area/:slug" component={Location} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location, setLocation] = useLocation();

  const handleStartChat = () => {
    if (location === "/") {
      const event = new CustomEvent('startChat');
      window.dispatchEvent(event);
    } else {
      // Extract location slug from current path
      const match = location.match(/\/location\/(country|city|area)\/([^/?]+)/);
      if (match) {
        const slug = match[2];
        setLocation(`/?autostart=true&from=${slug}`);
      } else {
        setLocation("/?autostart=true");
      }
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="talkastranger-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
          <MobileFooter onStartChat={handleStartChat} />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
