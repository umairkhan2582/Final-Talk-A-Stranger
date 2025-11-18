import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Video,
  Users,
  MapPin,
  Building2,
  Map as MapIcon,
  Sparkles,
  Globe,
  Shield,
  Zap,
  Search,
} from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Link } from "wouter";
import { COUNTRIES, CITIES, AREAS, type Location } from "@shared/locations";
import AboutSection from "@/components/sections/AboutSection";
import StatsSection from "@/components/sections/StatsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import SafetySection from "@/components/sections/SafetySection";
import FAQSection from "@/components/sections/FAQSection";
import LocationSearch from "@/components/LocationSearch";
import Footer from "@/components/Footer";
import TassyMascot from "@/components/TassyMascot";
import MarriageFAQ from "@/components/MarriageFAQ";
import MarriageGuidance from "@/components/MarriageGuidance";
import HeroLocationSearch from "@/components/HeroLocationSearch";

interface WelcomeScreenProps {
  onStart?: () => void;
  hideHero?: boolean;
  isCameraReady?: boolean;
  localStream?: MediaStream | null;
}

import heroBackgroundImage from "@assets/stock_images/diverse_young_people_cd12aa80.jpg";

import locationImage1 from "@assets/stock_images/world_famous_cities__eaafc000.jpg";
import locationImage2 from "@assets/stock_images/world_famous_cities__2f96ef92.jpg";
import locationImage3 from "@assets/stock_images/world_famous_cities__a4091e35.jpg";
import locationImage4 from "@assets/stock_images/world_famous_cities__e5822400.jpg";
import locationImage5 from "@assets/stock_images/world_famous_cities__4c68282d.jpg";
import locationImage6 from "@assets/stock_images/world_famous_cities__c160bf36.jpg";
import locationImage7 from "@assets/stock_images/world_famous_cities__7ebb1573.jpg";
import locationImage8 from "@assets/stock_images/world_famous_cities__e414f587.jpg";
import locationImage9 from "@assets/stock_images/world_famous_cities__4547f4ec.jpg";
import locationImage10 from "@assets/stock_images/world_famous_cities__c9ad0a25.jpg";

const locationImages = [
  locationImage1,
  locationImage2,
  locationImage3,
  locationImage4,
  locationImage5,
  locationImage6,
  locationImage7,
  locationImage8,
  locationImage9,
  locationImage10,
];

function getLocationImage(index: number): string {
  return locationImages[index % locationImages.length];
}

function getCountForLocation(slug: string, type: string): number {
  const hash = slug
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const base = type === "country" ? 500 : type === "city" ? 100 : 50;
  return base + (hash % 2000);
}

export default function WelcomeScreen({
  onStart,
  hideHero = false,
  isCameraReady = false,
  localStream = null,
}: WelcomeScreenProps) {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket: Socket = io();
    socket.on("online-users", (count: number) => setOnlineUsers(count));
    return () => {
      socket.disconnect();
    };
  }, []);

  // Attach local stream to video preview
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Select diverse international locations - expanded to 24 each
  const allPopularCountries = [
    COUNTRIES.find((c) => c.slug === "united-states"),
    COUNTRIES.find((c) => c.slug === "united-kingdom"),
    COUNTRIES.find((c) => c.slug === "canada"),
    COUNTRIES.find((c) => c.slug === "australia"),
    COUNTRIES.find((c) => c.slug === "germany"),
    COUNTRIES.find((c) => c.slug === "france"),
    COUNTRIES.find((c) => c.slug === "japan"),
    COUNTRIES.find((c) => c.slug === "india"),
    COUNTRIES.find((c) => c.slug === "brazil"),
    COUNTRIES.find((c) => c.slug === "mexico"),
    COUNTRIES.find((c) => c.slug === "spain"),
    COUNTRIES.find((c) => c.slug === "italy"),
    COUNTRIES.find((c) => c.slug === "china"),
    COUNTRIES.find((c) => c.slug === "russia"),
    COUNTRIES.find((c) => c.slug === "south-korea"),
    COUNTRIES.find((c) => c.slug === "netherlands"),
    COUNTRIES.find((c) => c.slug === "switzerland"),
    COUNTRIES.find((c) => c.slug === "sweden"),
    COUNTRIES.find((c) => c.slug === "norway"),
    COUNTRIES.find((c) => c.slug === "denmark"),
    COUNTRIES.find((c) => c.slug === "belgium"),
    COUNTRIES.find((c) => c.slug === "austria"),
    COUNTRIES.find((c) => c.slug === "portugal"),
    COUNTRIES.find((c) => c.slug === "greece"),
  ].filter(Boolean) as Location[];

  const popularCountries = allPopularCountries;

  // Create truly international cities list (25 cities from different countries)
  const internationalCityNames = [
    "new-york-united-states",
    "london-united-kingdom",
    "tokyo-japan",
    "paris-france",
    "los-angeles-united-states",
    "sydney-australia",
    "dubai-united-arab-emirates",
    "singapore-singapore",
    "toronto-canada",
    "berlin-germany",
    "madrid-spain",
    "rome-italy",
    "amsterdam-netherlands",
    "barcelona-spain",
    "miami-united-states",
    "chicago-united-states",
    "san-francisco-united-states",
    "seoul-south-korea",
    "hong-kong-china",
    "shanghai-china",
    "mumbai-india",
    "istanbul-turkey",
    "moscow-russia",
    "beijing-china",
    "mexico-city-mexico",
  ];

  const allPopularCities = internationalCityNames
    .map((slug) => CITIES.find((c) => c.slug === slug))
    .filter(Boolean) as Location[];

  const popularCities = allPopularCities;

  // Create international areas list (25 areas from different countries)
  const internationalAreaNames = [
    "manhattan-new-york-united-states",
    "brooklyn-new-york-united-states",
    "hollywood-los-angeles-united-states",
    "beverly-hills-los-angeles-united-states",
    "westminster-london-united-kingdom",
    "camden-london-united-kingdom",
    "downtown-dubai-dubai-united-arab-emirates",
    "dubai-marina-dubai-united-arab-emirates",
    "orchard-road-singapore-singapore",
    "marina-bay-singapore-singapore",
    "shibuya-tokyo-japan",
    "shinjuku-tokyo-japan",
    "downtown-toronto-toronto-canada",
    "yorkville-toronto-canada",
    "mitte-berlin-germany",
    "charlottenburg-berlin-germany",
    "eixample-barcelona-spain",
    "gothic-quarter-barcelona-spain",
    "1st-arrondissement-paris-france",
    "7th-arrondissement-paris-france",
    "center-sydney-australia",
    "bondi-sydney-australia",
    "centro-storico-rome-italy",
    "trastevere-rome-italy",
    "gangnam-seoul-south-korea",
  ];

  const allPopularAreas = internationalAreaNames
    .map((slug) => AREAS.find((a) => a.slug === slug))
    .filter(Boolean) as Location[];

  const popularAreas = allPopularAreas;

  return (
    <div className="w-full overflow-x-hidden">
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 pb-24 md:pb-8">
        {!hideHero && (
          <>
            {/* Hero Section with Video Background */}
            <section className="relative min-h-screen overflow-y-auto">
              {/* Background Image (Video placeholder) */}
              <div className="absolute inset-0">
                <img
                  src={heroBackgroundImage}
                  alt="Video chat background"
                  className="w-full h-full object-cover"
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
              </div>

              {/* Hero Content */}
              <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center py-8">
                <h1 className="text-4xl md:text-7xl font-bold mb-3 text-white drop-shadow-lg">
                  Where You Meet New Friends!
                </h1>
                <p className="text-lg md:text-2xl text-white/90 mb-6 drop-shadow">
                  TalkAStranger.Com
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                  <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    <span className="font-bold text-white text-lg">
                      {onlineUsers} Online
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <MapPin className="w-5 h-5 text-white" />
                    <span className="font-semibold text-white text-lg">
                      150+ Countries
                    </span>
                  </div>
                </div>

                {/* TASSY Mascot - Above Camera */}
                <div className="px-4 max-w-2xl mx-auto mb-4">
                  <TassyMascot />
                </div>

                {/* AJAX Location Search */}
                <div className="px-4 max-w-2xl mx-auto mb-6">
                  <HeroLocationSearch />
                </div>

                {/* Camera Preview */}
                {localStream && (
                  <div className="mb-6 relative">
                    <div className="w-40 h-56 md:w-56 md:h-72 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl mx-auto">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                        data-testid="video-preview"
                      />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      Camera Ready ✓
                    </div>
                  </div>
                )}

                {!localStream && (
                  <div className="mb-6 text-white/80 text-sm">
                    Loading camera...
                  </div>
                )}

                <Button
                  size="lg"
                  onClick={onStart}
                  disabled={!isCameraReady}
                  className="text-lg md:text-xl px-8 md:px-12 py-6 md:py-7 mb-3 shadow-2xl z-50 relative"
                  data-testid="button-start-chat"
                >
                  <Video className="w-5 h-5 mr-2" />
                  {isCameraReady ? "Start Talking To Strangers Now" : "Loading Camera..."}
                </Button>

                <p className="text-sm md:text-base text-white/80 drop-shadow mb-4">
                  100% Free • No Sign Up • No Tokens
                </p>
              </div>
            </section>

            {/* Feature Cards Below Hero */}
            <section className="px-4 py-12 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <Card className="p-4 text-center">
                  <Zap className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <h3 className="font-bold text-sm">Instant Match</h3>
                  <p className="text-xs text-muted-foreground">Connect fast</p>
                </Card>
                <Card className="p-4 text-center">
                  <Sparkles className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <h3 className="font-bold text-sm">100% Free</h3>
                  <p className="text-xs text-muted-foreground">No fees</p>
                </Card>
                <Card className="p-4 text-center">
                  <Shield className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <h3 className="font-bold text-sm">Safe & Private</h3>
                  <p className="text-xs text-muted-foreground">Secure chat</p>
                </Card>
                <Card className="p-4 text-center">
                  <Globe className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <h3 className="font-bold text-sm">Global Reach</h3>
                  <p className="text-xs text-muted-foreground">Worldwide</p>
                </Card>
              </div>
            </section>
          </>
        )}

        {/* Stats Section */}
        <StatsSection />

        {/* About Section */}
        <AboutSection />

        {/* Connect With Strangers Section */}
        <section className="px-4 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Connect With Strangers Worldwide
          </h2>
          <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
            <p>
              Talkastranger is the ultimate platform for spontaneous video conversations with people from around the globe. Whether you're looking to make new friends, practice a foreign language, learn about different cultures, or simply have interesting conversations, our platform connects you with thousands of users worldwide.
            </p>
            <p>
              Our mission is to bring people together across borders and cultures through the power of face-to-face video chat. In an increasingly connected world, we believe in the value of genuine human connection and spontaneous conversation.
            </p>
            <p>
              Every day, thousands of people use Talkastranger to break out of their social bubble, discover new perspectives, and form meaningful connections with people they would never have met otherwise. From students practicing language skills to travelers sharing stories to friends looking for casual conversation, our diverse community welcomes everyone.
            </p>
            <p>
              Built with cutting-edge WebRTC technology, Talkastranger delivers crystal-clear video quality and instant connections. Your chats are peer-to-peer, ensuring privacy and the best possible experience. No downloads, no installations - just open your browser and start talking.
            </p>
          </div>
        </section>

        {/* Why Talk to Strangers Online */}
        <section className="px-4 py-16 max-w-4xl mx-auto bg-card/50 rounded-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Why Talk to Strangers Online?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary" />
                Break Cultural Barriers
              </h3>
              <p className="text-muted-foreground">
                Connect with people from different countries, backgrounds, and cultures. Expand your worldview and gain new perspectives through genuine conversations with strangers from every corner of the globe.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Build Social Skills
              </h3>
              <p className="text-muted-foreground">
                Practice your conversation skills in a safe, judgment-free environment. Whether you're shy or outgoing, talking to strangers online helps you become more confident in social situations.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Spontaneous Connections
              </h3>
              <p className="text-muted-foreground">
                Experience the thrill of unexpected friendships. Every conversation is unique, and you never know who you'll meet next - maybe your new best friend, language exchange partner, or someone with fascinating stories to share.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Anonymous & Safe
              </h3>
              <p className="text-muted-foreground">
                Chat anonymously without sharing personal information. Our platform includes safety features like instant skip, report functions, and moderation to ensure a positive experience for everyone.
              </p>
            </Card>
          </div>
        </section>

        {/* Global Community Section */}
        <section className="px-4 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Join Our Global Community
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg text-center">
              Whether you're looking to practice English, learn about life in another country, make international friends, or just have fun conversations, Talkastranger is your gateway to the world.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">150+</div>
                <div className="font-semibold">Countries</div>
                <p className="text-sm text-muted-foreground mt-2">Connect with people from every continent</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="font-semibold">Always Active</div>
                <p className="text-sm text-muted-foreground mt-2">Someone is always online to chat with</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="font-semibold">Free Forever</div>
                <p className="text-sm text-muted-foreground mt-2">No hidden fees or premium features</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <HowItWorksSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* CTA Section */}
        <section className="px-4 py-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Meet Someone New?
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join thousands of people making friends worldwide right now
          </p>
          <Button
            size="lg"
            onClick={onStart}
            disabled={!isCameraReady}
            className="text-lg px-8"
            data-testid="button-start-chat-cta"
          >
            {isCameraReady ? "Start Chatting Free" : "Preparing..."}
          </Button>
        </section>

        {/* Popular Countries */}
        <section className="px-4 py-12 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">
              Talk with Strangers Worldwide
            </h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Connect with people from different countries, cities, and areas
            around the globe
          </p>

          {/* Search Bar */}
          <div className="mb-12">
            <LocationSearch
              placeholder="Search countries, cities, or areas..."
              onSearchChange={setSearchQuery}
            />
          </div>

          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Popular Countries
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {popularCountries.map((country: Location, index: number) => (
              <Link
                key={country.slug}
                href={`/location/country/${country.slug}`}
              >
                <Card
                  className="p-4 text-center hover-elevate cursor-pointer transition-all"
                  data-testid={`country-card-${country.slug}`}
                >
                  <div className="w-full aspect-[4/3] bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={getLocationImage(index)}
                      alt={country.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <MapPin className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <h4
                    className="font-bold text-sm mb-1"
                    data-testid={`country-name-${country.slug}`}
                  >
                    {country.name}
                  </h4>
                  <p
                    className="text-xs text-muted-foreground"
                    data-testid={`country-count-${country.slug}`}
                  >
                    {getCountForLocation(country.slug, "country")}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mb-12">
            <Link href="/countries">
              <Button variant="outline" size="lg">
                View All {COUNTRIES.length} Countries →
              </Button>
            </Link>
          </div>

          {/* Popular Cities */}
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            Popular Cities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {popularCities.map((city: Location, index: number) => (
              <Link key={city.slug} href={`/location/city/${city.slug}`}>
                <Card
                  className="p-4 text-center hover-elevate cursor-pointer transition-all"
                  data-testid={`city-card-${city.slug}`}
                >
                  <div className="w-full aspect-square bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={getLocationImage(index + 3)}
                      alt={city.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4
                    className="font-bold text-sm mb-1"
                    data-testid={`city-name-${city.slug}`}
                  >
                    {city.name}
                  </h4>
                  <p
                    className="text-xs text-muted-foreground"
                    data-testid={`city-count-${city.slug}`}
                  >
                    {getCountForLocation(city.slug, "city")}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mb-12">
            <Link href="/cities">
              <Button variant="outline" size="lg">
                View All {CITIES.length.toLocaleString()} Cities →
              </Button>
            </Link>
          </div>

          {/* Popular Areas */}
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-primary" />
            Popular Areas & Regions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {popularAreas.map((area: Location, index: number) => (
              <Link key={area.slug} href={`/location/area/${area.slug}`}>
                <Card
                  className="p-4 text-center hover-elevate cursor-pointer transition-all"
                  data-testid={`area-card-${area.slug}`}
                >
                  <div className="w-full aspect-square bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={getLocationImage(index + 6)}
                      alt={area.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4
                    className="font-bold text-sm mb-1"
                    data-testid={`area-name-${area.slug}`}
                  >
                    {area.name}
                  </h4>
                  <p
                    className="text-xs text-muted-foreground"
                    data-testid={`area-count-${area.slug}`}
                  >
                    {getCountForLocation(area.slug, "area")}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mb-12">
            <Link href="/areas">
              <Button variant="outline" size="lg">
                View All {AREAS.length.toLocaleString()} Areas →
              </Button>
            </Link>
          </div>
        </section>

        {/* SEO Content Section - Boys, Girls, Chat, Talk, Social Platform */}
        <section className="px-4 py-16 bg-card/30">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Chat with Girls and Boys from Around the World
              </h2>
              <p className="text-lg text-muted-foreground">
                Talkastranger is the premier social platform for meeting new people through live video chat. Connect with girls and boys worldwide, talk to strangers, and build meaningful friendships.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold">Talk to Girls Online - Free Video Chat</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our platform makes it easy to talk to girls from different countries and cultures. Whether you're seeking friendship, language exchange, or meaningful conversations, our video chat connects you with girls who share your interests. The platform provides a safe, moderated environment where you can chat with confidence.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Many users come to our social platform specifically to meet girls for genuine friendship and cultural exchange. Our random video chat system ensures you'll always meet someone new, making every conversation unique and exciting.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold">Meet Boys and Make New Friends</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Connect with boys from around the globe through our instant video chat platform. Whether you want to talk about sports, gaming, music, or just have casual conversations, you'll find boys online ready to chat. Our social platform brings together people with diverse interests and backgrounds.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Boys using our platform appreciate the spontaneity of random video chat - you never know who you'll meet next. From students to professionals, our community includes boys from all walks of life looking to expand their social circle.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-2xl font-bold">The Ultimate Social Platform for Video Chat</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Talkastranger has evolved into more than just a chat platform - it's a thriving social community where millions of people come to talk, connect, and build relationships. Our social platform combines the spontaneity of random matching with advanced features that make every chat session enjoyable.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Unlike traditional social media platforms, we focus on real-time video conversations. When you chat with strangers here, you're having authentic face-to-face interactions that create genuine connections. Our platform supports text chat alongside video, giving you multiple ways to communicate and express yourself.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The beauty of our social platform is its simplicity: click start, and within seconds you're talking to someone new. Whether you want to chat with girls, meet boys, or simply talk to interesting strangers from different cultures, our platform delivers instant connections 24/7.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-2xl font-bold">Why People Choose Us to Talk and Chat</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-muted-foreground">
                      <strong>Instant Connections:</strong> Start a video chat within seconds - no lengthy signup process, just click and talk to strangers immediately
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-muted-foreground">
                      <strong>Diverse Community:</strong> Chat with girls and boys from 100+ countries, experiencing different cultures and perspectives through every conversation
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-muted-foreground">
                      <strong>Free Social Platform:</strong> Unlike other chat services, we offer completely free video chat - no subscriptions, no hidden fees, just unlimited conversations
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-muted-foreground">
                      <strong>Safe Environment:</strong> Our moderated social platform ensures appropriate behavior so you can talk and chat with confidence
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span className="text-muted-foreground">
                      <strong>Anonymous Chat:</strong> Talk to strangers without sharing personal information until you're comfortable - your privacy is protected
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                Join Millions Who Chat and Talk Every Day
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Our social platform brings together people from every corner of the world. Whether you're looking to chat with girls who share your interests, meet boys from different cultures, or simply talk to strangers and make new friends, Talkastranger is your gateway to global connections.
              </p>
              <Button
                size="lg"
                onClick={onStart}
                disabled={!isCameraReady}
                className="text-lg px-12"
                data-testid="button-start-chat-seo"
              >
                Start Chatting Now - It's Free!
              </Button>
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <SafetySection />

        {/* Marriage Guidance Content */}
        <MarriageGuidance />

        {/* Marriage FAQs */}
        <MarriageFAQ />

        {/* Final CTA */}
        <section className="px-4 py-16 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Start Making Friends Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Connect instantly with people from {COUNTRIES.length}+ countries. No
            registration, no fees, just chat!
          </p>
          <Button
            size="lg"
            onClick={onStart}
            disabled={!isCameraReady}
            className="text-lg px-12 py-6"
            data-testid="button-start-chat-final"
          >
            {isCameraReady ? "Begin Your First Chat" : "Loading..."}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Joining {onlineUsers.toLocaleString()} people online right now
          </p>
        </section>

        {/* FAQ Section */}
        <FAQSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
