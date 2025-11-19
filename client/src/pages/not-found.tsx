import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home as HomeIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function NotFound() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/10 via-background to-accent/10 pb-24 md:pb-8">
      <Header onMenuClick={() => setIsMenuOpen(true)} />
      <div className="flex-1 flex items-center justify-center p-6">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold text-foreground">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground mb-6">
            The page you're looking for doesn't exist.
          </p>
          
          <Link href="/">
            <Button className="w-full" data-testid="button-home">
              <HomeIcon className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
      </div>
      <Footer />
    </div>
  );
}
