import { Card } from "@/components/ui/card";
import { Globe, Users, MapPin, Video, Shield, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COUNTRIES, CITIES, AREAS } from "@shared/locations";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Talkastranger
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We are a leading random video chat platform connecting people from around the world. 
              Our mission is to break down barriers and create meaningful connections across borders.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <Card className="p-6 text-center">
              <Globe className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="text-3xl font-bold mb-1">{COUNTRIES.length}</h3>
              <p className="text-sm text-muted-foreground">Countries</p>
            </Card>
            <Card className="p-6 text-center">
              <MapPin className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="text-3xl font-bold mb-1">{CITIES.length.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Cities</p>
            </Card>
            <Card className="p-6 text-center">
              <MapPin className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="text-3xl font-bold mb-1">{AREAS.length.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Areas & Regions</p>
            </Card>
            <Card className="p-6 text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="text-3xl font-bold mb-1">24/7</h3>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </Card>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
            <Card className="p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Talkastranger, we believe that meaningful connections can happen anywhere, anytime. 
                Our platform is designed to bring people together from different cultures, backgrounds, and 
                locations. Whether you're looking to practice a new language, learn about different cultures, 
                or simply make new friends, we provide a safe, free, and easy-to-use platform for spontaneous 
                video conversations.
              </p>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <Globe className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-3">Global Reach</h3>
                <p className="text-muted-foreground">
                  Connect with people from {COUNTRIES.length}+ countries, {CITIES.length.toLocaleString()}+ cities, 
                  and {AREAS.length.toLocaleString()}+ specific areas worldwide. Our platform showcases locations 
                  from every corner of the globe.
                </p>
              </Card>
              <Card className="p-6">
                <Video className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-3">High Quality Video</h3>
                <p className="text-muted-foreground">
                  Experience crystal-clear video and audio quality with our peer-to-peer WebRTC technology. 
                  No downloads or installations required.
                </p>
              </Card>
              <Card className="p-6">
                <Zap className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-3">Instant Matching</h3>
                <p className="text-muted-foreground">
                  Get connected with someone new in seconds. Our smart matching algorithm ensures you're 
                  always paired with active users from your selected location.
                </p>
              </Card>
              <Card className="p-6">
                <Shield className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-3">Safe & Secure</h3>
                <p className="text-muted-foreground">
                  Your privacy and safety are our top priorities. All conversations are anonymous, and we have 
                  built-in reporting and moderation systems.
                </p>
              </Card>
              <Card className="p-6">
                <Users className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-3">100% Free</h3>
                <p className="text-muted-foreground">
                  No hidden fees, no subscriptions, no tokens. Our service is completely free and always will be. 
                  No registration required.
                </p>
              </Card>
              <Card className="p-6">
                <MapPin className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-3">Location-Based</h3>
                <p className="text-muted-foreground">
                  Choose specific countries, cities, or areas to chat with people from your preferred locations. 
                  Perfect for travelers and language learners.
                </p>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-accent/10">
              <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of people making new friends and having amazing conversations every day.
              </p>
              <Link href="/">
                <Button size="lg" className="text-lg px-8">
                  Start Chatting Now
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
