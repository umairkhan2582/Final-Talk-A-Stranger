import { useRoute } from "wouter";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Globe, MessageCircle, Newspaper, CheckCircle2, MessageSquare } from "lucide-react";
import { getLocationBySlug } from "@shared/locations";
import { generateLocationContent } from "@shared/content-generator";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "@/components/LoadingScreen";
import VideoDisplay from "@/components/VideoDisplay";
import ChatTimer from "@/components/ChatTimer";
import ControlButtons from "@/components/ControlButtons";
import ChatPanel from "@/components/ChatPanel";
import SettingsDialog from "@/components/SettingsDialog";
import ReportDialog from "@/components/ReportDialog";
import MenuDrawer from "@/components/MenuDrawer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Profile from "@/pages/Profile";
import PremiumMatchmaking from "@/components/PremiumMatchmaking";
import TassyMascot from "@/components/TassyMascot";
import MarriageFAQ from "@/components/MarriageFAQ";
import MarriageGuidance from "@/components/MarriageGuidance";
import LocationContentSection from "@/components/LocationContentSection";
import HeroLocationSearch from "@/components/HeroLocationSearch";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useToast } from "@/hooks/use-toast";

type AppState = 'welcome' | 'searching' | 'chatting';

import chatImage1 from '@assets/stock_images/diverse_young_people_cd12aa80.jpg';
import chatImage2 from '@assets/stock_images/diverse_young_people_92a62ccb.jpg';
import chatImage3 from '@assets/stock_images/diverse_young_people_39b07cf3.jpg';
import chatImage4 from '@assets/stock_images/diverse_young_people_df9889d0.jpg';
import locationImage1 from '@assets/stock_images/world_famous_cities__eaafc000.jpg';
import locationImage2 from '@assets/stock_images/world_famous_cities__2f96ef92.jpg';
import locationImage3 from '@assets/stock_images/world_famous_cities__a4091e35.jpg';
import locationImage4 from '@assets/stock_images/world_famous_cities__e5822400.jpg';
import locationImage5 from '@assets/stock_images/world_famous_cities__4c68282d.jpg';
import locationImage6 from '@assets/stock_images/world_famous_cities__c160bf36.jpg';
import travelImage1 from '@assets/stock_images/world_travel_destina_08ad410e.jpg';
import travelImage2 from '@assets/stock_images/world_travel_destina_1ab2cc2c.jpg';
import travelImage3 from '@assets/stock_images/world_travel_destina_b1694d0e.jpg';
import travelImage4 from '@assets/stock_images/world_travel_destina_953c9b73.jpg';
import travelImage5 from '@assets/stock_images/world_travel_destina_117ecc54.jpg';
import travelImage6 from '@assets/stock_images/world_travel_destina_b13256d4.jpg';
import travelImage7 from '@assets/stock_images/world_travel_destina_52ca1cb5.jpg';
import travelImage8 from '@assets/stock_images/world_travel_destina_3a61c563.jpg';
import travelImage9 from '@assets/stock_images/world_travel_destina_b709fb3b.jpg';
import travelImage10 from '@assets/stock_images/world_travel_destina_56b01056.jpg';

const heroImages = [
  chatImage1, chatImage2, chatImage3, chatImage4,
  locationImage1, locationImage2, locationImage3, locationImage4, locationImage5, locationImage6
];

// All unique cover images for location pages
const coverImages = [
  travelImage1, travelImage2, travelImage3, travelImage4, travelImage5,
  travelImage6, travelImage7, travelImage8, travelImage9, travelImage10,
  locationImage1, locationImage2, locationImage3, locationImage4, locationImage5, locationImage6,
  chatImage1, chatImage2, chatImage3, chatImage4
];

// Hash function to get unique image for each location
function getCoverImageForLocation(slug: string): string {
  const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return coverImages[hash % coverImages.length];
}

export default function Location() {
  // Try to match all three route patterns
  const [matchCountry, paramsCountry] = useRoute("/location/country/:slug");
  const [matchCity, paramsCity] = useRoute("/location/city/:slug");
  const [matchArea, paramsArea] = useRoute("/location/area/:slug");
  
  const params = paramsCountry || paramsCity || paramsArea;
  const location = params?.slug ? getLocationBySlug(params.slug) : undefined;

  // Video chat state
  const [appState, setAppState] = useState<AppState>('welcome');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [chatStartTime, setChatStartTime] = useState<number>(Date.now());
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingAutostart, setPendingAutostart] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    videoQuality: 'high'
  });

  const { toast } = useToast();

  const {
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    partnerUsername,
    messages,
    error,
    myLocationSlug,
    partnerLocationSlug,
    toggleVideo,
    toggleAudio,
    sendMessage,
    skipPartner,
    startSearching
  } = useWebRTC();

  // Fetch news for this location
  const { data: newsData, isLoading: newsLoading, error: newsError } = useQuery({
    queryKey: ['/api/news', location?.type, location?.name],
    queryFn: async () => {
      if (!location) return null;
      const response = await fetch(`/api/news/${location.type}/${encodeURIComponent(location.name)}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      return response.json();
    },
    enabled: !!location,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const handleStart = () => {
    // Check if camera/mic are ready before starting
    if (!localStream) {
      setPendingAutostart(true);
      toast({
        title: "Camera Loading",
        description: "Waiting for camera access. Chat will start automatically once ready...",
      });
      return;
    }
    
    setPendingAutostart(false);
    setAppState('searching');
    const username = `User_${Math.floor(Math.random() * 10000)}`;
    const locationSlug = params?.slug || null;
    startSearching(username, locationSlug);
    setChatStartTime(Date.now());
  };

  const handleNext = () => {
    skipPartner();
    setAppState('searching');
  };

  useEffect(() => {
    if (remoteStream) {
      setAppState('chatting');
    }
  }, [remoteStream]);

  // Track unread messages when chat is closed
  useEffect(() => {
    if (!isChatOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isOwn) {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isChatOpen]);

  // Auto-retry start when camera becomes ready after a pending autostart
  useEffect(() => {
    if (pendingAutostart && localStream && appState === 'welcome') {
      const username = `User_${Math.floor(Math.random() * 10000)}`;
      const locationSlug = params?.slug || null;
      startSearching(username, locationSlug);
      setAppState('searching');
      setChatStartTime(Date.now());
      setPendingAutostart(false);
    }
  }, [pendingAutostart, localStream, appState, startSearching]);

  // Handle WebRTC errors (e.g., camera permissions denied)
  useEffect(() => {
    if (error) {
      // Clear pending autostart on error
      setPendingAutostart(false);
      
      toast({
        title: "Connection Issue",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (location) {
      // Set SEO meta tags
      document.title = location.seoTitle;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', location.seoDescription);

      // Add Open Graph tags
      const ogTags = [
        { property: 'og:title', content: location.seoTitle },
        { property: 'og:description', content: location.seoDescription },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Talkastranger' }
      ];

      ogTags.forEach(tag => {
        let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
        if (!ogTag) {
          ogTag = document.createElement('meta');
          ogTag.setAttribute('property', tag.property);
          document.head.appendChild(ogTag);
        }
        ogTag.setAttribute('content', tag.content);
      });
    }
  }, [location]);

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Location Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the location you're looking for.
            </p>
            <Link href="/">
              <Button data-testid="button-home">Go to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const comprehensiveContent = generateLocationContent(location.name, location.type as 'country' | 'city' | 'area');

  // If searching, show loading screen
  if (appState === 'searching') {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingScreen tip="Be kind and respectful to make new friends!" />
      </div>
    );
  }

  // If chatting, show video interface with location content below
  if (appState === 'chatting') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header 
          onStartChat={appState === 'chatting' ? handleNext : handleStart}
          onMenuClick={() => setIsMenuOpen(true)}
          onProfileClick={() => setIsProfileOpen(true)}
          isConnected={appState === 'chatting'}
        />
        
        <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
          {/* Main Content Area - Scrollable */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Video Chat Section */}
            <div className="h-[50vh] md:h-[30vh] flex-none flex flex-col relative bg-black">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 md:hidden">
                <ChatTimer startTime={chatStartTime} isActive={appState === 'chatting'} />
              </div>

              {/* Main Video - Mobile: Remote (stranger), Desktop: Local (you) */}
              <div className="flex-1 relative">
                <div className="md:hidden w-full h-full">
                  <VideoDisplay
                    stream={remoteStream}
                    username={partnerUsername || "Stranger"}
                    className="w-full h-full"
                  />
                </div>
                <div className="hidden md:block w-full h-full">
                  <VideoDisplay
                    stream={localStream}
                    username="You"
                    isLocalVideo
                    isMuted
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Small PIP Video - Mobile: Local (you), Desktop: Remote (stranger) */}
              <div className="absolute top-4 left-4 z-10">
                <div className="w-20 h-28 md:w-32 md:h-44">
                  <div className="md:hidden w-full h-full">
                    <VideoDisplay
                      stream={localStream}
                      username="You"
                      isLocalVideo
                      isMuted
                      className="w-full h-full shadow-lg"
                    />
                  </div>
                  <div className="hidden md:block w-full h-full">
                    <VideoDisplay
                      stream={remoteStream}
                      username={partnerUsername || "Stranger"}
                      className="w-full h-full shadow-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10 md:bottom-0">
                <ControlButtons
                  onNext={handleNext}
                  onReport={() => setIsReportOpen(true)}
                  onSettings={() => setIsSettingsOpen(true)}
                  isVideoEnabled={isVideoEnabled}
                  isAudioEnabled={isAudioEnabled}
                  onToggleVideo={toggleVideo}
                  onToggleAudio={toggleAudio}
                />
              </div>

              <div className="md:hidden absolute bottom-24 right-4 z-10">
                <Button
                  size="icon"
                  onClick={() => {
                    setIsChatOpen(!isChatOpen);
                    if (!isChatOpen) {
                      setUnreadCount(0);
                    }
                  }}
                  className="h-14 w-14 rounded-full shadow-lg relative"
                  data-testid="button-toggle-chat"
                >
                  <MessageSquare className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse" data-testid="badge-unread-count">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* Mobile Chat Overlay - Inside Video Area */}
              {isChatOpen && (
                <div className="md:hidden absolute bottom-0 left-0 right-0 h-[45vh] z-20 bg-background/90 backdrop-blur-md border-t border-border">
                  <ChatPanel
                    isOpen={true}
                    onClose={() => setIsChatOpen(false)}
                    messages={messages}
                    onSendMessage={sendMessage}
                    partnerUsername={partnerUsername || "Stranger"}
                  />
                </div>
              )}
            </div>

            {/* Scrollable Content Below Video */}
            <div className="flex-1 bg-gradient-to-br from-primary/10 via-background to-accent/10 pb-24 md:pb-8">
              <div className="max-w-6xl mx-auto p-6">
                <LocationContentSection 
                  myLocationSlug={myLocationSlug}
                  partnerLocationSlug={partnerLocationSlug}
                />
              </div>
              <Footer />
            </div>
          </div>

          {/* Desktop Chat Panel - Full height with input at bottom */}
          <div className="hidden md:flex md:w-96 md:flex-shrink-0 md:border-l md:border-border md:h-full">
            <ChatPanel
              isOpen={true}
              onClose={() => setIsChatOpen(false)}
              messages={messages}
              onSendMessage={sendMessage}
              partnerUsername={partnerUsername || "Stranger"}
            />
          </div>
        </div>

        <SettingsDialog
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSettingsChange={setSettings}
        />

        <ReportDialog
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
        />

        <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        
        {isProfileOpen && (
          <Profile onClose={() => setIsProfileOpen(false)} />
        )}
      </div>
    );
  }

  // Default welcome state with location page
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 pb-24 md:pb-8">
      {/* Hero Section with Unique Cover Image */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getCoverImageForLocation(location.slug)}
            alt={location.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-blue-900/90" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-8 h-8 text-accent" />
            <span className="text-sm font-medium text-accent uppercase tracking-wide">
              {location.type}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl" data-testid="text-location-h1">
            {location.h1}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-lg">
            {location.description}
          </p>
          
          {/* AJAX Location Search */}
          <div className="mb-8">
            <HeroLocationSearch />
          </div>
          
          {/* Video Preview - Show camera like home page */}
          {localStream && (
            <div className="mb-8 max-w-md mx-auto">
              <div className="aspect-[9/16] md:aspect-video w-full max-w-sm md:max-w-md mx-auto rounded-lg overflow-hidden shadow-2xl border-4 border-white/20">
                <VideoDisplay
                  stream={localStream}
                  username="You"
                  isLocalVideo
                  isMuted
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
          
          {/* TASSY Mascot */}
          <div className="mb-8">
            <TassyMascot />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 shadow-2xl" 
              data-testid="button-start-chatting"
              onClick={handleStart}
              disabled={!localStream}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {localStream ? `Start Chatting in ${location.name}` : "Loading Camera..."}
            </Button>
            <Link href="/">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" data-testid="button-home">
                <Users className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Globe className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold mb-2">Free</h3>
              <p className="text-muted-foreground">100% Free Service</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold mb-2">Instant</h3>
              <p className="text-muted-foreground">Connect in Seconds</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold mb-2">Safe</h3>
              <p className="text-muted-foreground">Moderated Platform</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Content Section - Comprehensive */}
      <section className="py-12 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center" data-testid="text-location-h2">
            {location.h2}
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              {comprehensiveContent.mainContent.map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed text-muted-foreground" data-testid={`text-content-paragraph-${index}`}>
                  {paragraph}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How-To Guides Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            How-To Guides
          </h2>
          <div className="grid gap-8">
            {comprehensiveContent.howToSections.map((section, sectionIndex) => (
              <Card key={sectionIndex}>
                <CardHeader>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {section.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                          {stepIndex + 1}
                        </span>
                        <span className="text-muted-foreground leading-relaxed pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Matchmaking Section */}
      <PremiumMatchmaking locationName={location.name} />

      {/* Marriage Guidance Content */}
      <MarriageGuidance />

      {/* Marriage FAQs */}
      <MarriageFAQ />

      {/* Tips Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Pro Tips for the Best Experience
          </h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="grid gap-4">
                {comprehensiveContent.tips.map((tip, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* News Section */}
      {newsData && newsData.articles && newsData.articles.length > 0 && (
        <section className="py-16 px-4 bg-card/30">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Newspaper className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-center">
                Latest News from {location.name}
              </h2>
            </div>
            <p className="text-center text-muted-foreground mb-8">
              Stay updated with daily news rewritten specifically for our community
            </p>
            <div className="grid gap-6">
              {newsData.articles.map((article: any, index: number) => (
                <Card key={index} className="hover-elevate transition-all">
                  <CardHeader>
                    <CardTitle className="text-xl" data-testid={`text-news-title-${index}`}>
                      {article.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-4" data-testid={`text-news-content-${index}`}>
                      {article.content}
                    </p>
                    {article.url && article.url !== '/' && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        Read original article →
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section - Comprehensive */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {comprehensiveContent.additionalFaq.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl" data-testid={`text-faq-question-${index}`}>
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`text-faq-answer-${index}`}>
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Meet People from {location.name}?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands already chatting on Talkastranger. It's free, instant, and fun!
          </p>
          <Link href="/">
            <Button size="lg" className="text-lg px-12" data-testid="button-cta-start">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Video Chat Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
