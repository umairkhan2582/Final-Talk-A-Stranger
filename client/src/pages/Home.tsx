import { useState, useEffect } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import LoadingScreen from "@/components/LoadingScreen";
import VideoDisplay from "@/components/VideoDisplay";
import ChatTimer from "@/components/ChatTimer";
import ControlButtons from "@/components/ControlButtons";
import ChatPanel from "@/components/ChatPanel";
import SettingsDialog from "@/components/SettingsDialog";
import ReportDialog from "@/components/ReportDialog";
import ProfileModal from "@/components/ProfileModal";
import MenuDrawer from "@/components/MenuDrawer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Profile from "@/pages/Profile";
import GenderFilterModal from "@/components/GenderFilterModal";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, Video, Menu } from "lucide-react";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useToast } from "@/hooks/use-toast";
import { getLocationBySlug } from "@shared/locations";

type AppState = 'welcome' | 'searching' | 'chatting';

interface SourcePageInfo {
  type: 'home' | 'location';
  locationSlug?: string;
  locationData?: any;
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGenderFilterOpen, setIsGenderFilterOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'all'>('all');
  const [primaryVideo, setPrimaryVideo] = useState<'remote' | 'local'>('remote');
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [chatStartTime, setChatStartTime] = useState<number>(Date.now());
  const [sourcePageInfo, setSourcePageInfo] = useState<SourcePageInfo>({ type: 'home' });
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingAutostart, setPendingAutostart] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    videoQuality: 'high'
  });

  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const locationSource = params.get('from');
    
    if (locationSource) {
      const locationData = getLocationBySlug(locationSource);
      if (locationData) {
        setSourcePageInfo({
          type: 'location',
          locationSlug: locationSource,
          locationData
        });
      }
      window.history.replaceState({}, '', '/');
    }
    
    if (params.get('autostart') === 'true') {
      handleStart();
    }
    
    const handleStartEvent = () => {
      if (appState === 'welcome') {
        handleStart();
      }
    };
    
    window.addEventListener('startChat', handleStartEvent);
    return () => window.removeEventListener('startChat', handleStartEvent);
  }, [appState]);

  const {
    localStream,
    remoteStream,
    isConnected,
    isSearching,
    partnerUsername,
    messages,
    error,
    startSearching,
    skipPartner,
    sendMessage,
    toggleVideo,
    toggleAudio,
    isVideoEnabled,
    isAudioEnabled,
  } = useWebRTC();

  useEffect(() => {
    if (isSearching && appState === 'welcome') {
      setAppState('searching');
    }
  }, [isSearching, appState]);

  useEffect(() => {
    if (isConnected && appState === 'searching') {
      setAppState('chatting');
      setChatStartTime(Date.now());
    }
  }, [isConnected, appState]);

  // Track unread messages when chat is closed
  useEffect(() => {
    if (!isChatOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isOwn) {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isChatOpen]);

  useEffect(() => {
    if (!isConnected && !isSearching && appState === 'chatting') {
      setAppState('searching');
    }
  }, [isConnected, isSearching, appState]);

  useEffect(() => {
    if (error) {
      // Clear pending autostart on error (e.g., permissions denied)
      setPendingAutostart(false);
      
      toast({
        title: "Connection Issue",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Auto-retry start when camera becomes ready after a pending autostart
  useEffect(() => {
    if (pendingAutostart && localStream && appState === 'welcome') {
      const username = `User_${Math.floor(Math.random() * 10000)}`;
      startSearching(username);
      setAppState('searching');
      setPendingAutostart(false);
    }
  }, [pendingAutostart, localStream, appState, startSearching]);

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
    const username = `User_${Math.floor(Math.random() * 10000)}`;
    startSearching(username);
    setAppState('searching');
  };

  const handleNext = () => {
    skipPartner();
    setAppState('searching');
  };

  if (appState === 'welcome') {
    return (
      <>
        <Header 
          onStartChat={handleStart}
          onMenuClick={() => setIsMenuOpen(true)}
          onProfileClick={() => setIsProfileOpen(true)}
        />
        <WelcomeScreen onStart={handleStart} isCameraReady={!!localStream} localStream={localStream} />
        <MenuDrawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        {isProfileOpen && (
          <Profile onClose={() => setIsProfileOpen(false)} />
        )}
      </>
    );
  }

  if (appState === 'searching') {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingScreen tip="Be kind and respectful to make new friends!" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onStartChat={appState === 'chatting' ? handleNext : handleStart}
        onMenuClick={() => setIsMenuOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        isConnected={appState === 'chatting'}
      />
      
      <div className="flex-1 pb-24 md:pb-0 flex flex-col md:flex-row md:overflow-hidden">
        {/* Video Chat Section and Content */}
        <div className="flex-1 flex flex-col md:overflow-y-auto">
          <div className={`${isVideoExpanded ? 'fixed inset-0 z-50' : 'h-[75vh] md:h-[25vh]'} md:flex-shrink-0 flex flex-col relative bg-black`}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 md:hidden">
            <ChatTimer startTime={chatStartTime} isActive={appState === 'chatting'} />
          </div>

          {/* Main Video - Show based on primaryVideo state */}
          <div className="flex-1 relative cursor-pointer" onClick={() => setPrimaryVideo(primaryVideo === 'remote' ? 'local' : 'remote')}>
            <VideoDisplay
              stream={primaryVideo === 'remote' ? remoteStream : localStream}
              username={primaryVideo === 'remote' ? (partnerUsername || "Stranger") : "You"}
              isLocalVideo={primaryVideo === 'local'}
              isMuted={primaryVideo === 'local'}
              className="w-full h-full"
            />
          </div>

          {/* Small PIP Video - Show opposite of primary */}
          <div className="absolute top-4 left-4 z-10 cursor-pointer" onClick={() => setPrimaryVideo(primaryVideo === 'remote' ? 'local' : 'remote')}>
            <div className="w-20 h-28 md:w-32 md:h-44">
              <VideoDisplay
                stream={primaryVideo === 'remote' ? localStream : remoteStream}
                username={primaryVideo === 'remote' ? "You" : (partnerUsername || "Stranger")}
                isLocalVideo={primaryVideo === 'remote'}
                isMuted={primaryVideo === 'remote'}
                className="w-full h-full shadow-lg"
              />
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsVideoExpanded(!isVideoExpanded)}
              className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30"
              data-testid="button-expand-video"
            >
              {isVideoExpanded ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </Button>
          </div>

          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10 md:bottom-0">
            <ControlButtons
              onNext={handleNext}
              onReport={() => setIsReportOpen(true)}
              onSettings={() => setIsSettingsOpen(true)}
              onGenderFilter={() => setIsGenderFilterOpen(true)}
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

          {/* Content Below Video */}
          <div className="md:min-h-0 bg-background">
            {sourcePageInfo.type === 'home' ? (
              <WelcomeScreen hideHero={true} />
            ) : (
              sourcePageInfo.locationData && (
                <div className="py-12 px-4">
                  <div className="max-w-4xl mx-auto space-y-12">
                    <section>
                      <h2 className="text-3xl font-bold mb-6 text-center">
                        {sourcePageInfo.locationData.h2}
                      </h2>
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        {sourcePageInfo.locationData.content}
                      </p>
                    </section>
                    
                    <section>
                      <h2 className="text-3xl font-bold mb-8 text-center">
                        Frequently Asked Questions
                      </h2>
                      <div className="space-y-6">
                        {sourcePageInfo.locationData.faq.map((item: any, index: number) => (
                          <div key={index} className="border-b border-border pb-6">
                            <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
                            <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              )
            )}
            
            <Footer />
          </div>
        </div>

        {/* Desktop Chat Sidebar - Full height with input at bottom */}
        <div className="hidden md:flex md:w-96 md:flex-shrink-0 md:border-l md:border-border md:sticky md:top-0" style={{ height: '100vh' }}>
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

      {isProfileOpen && (
        <Profile onClose={() => setIsProfileOpen(false)} />
      )}

      <MenuDrawer
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <GenderFilterModal
        isOpen={isGenderFilterOpen}
        onClose={() => setIsGenderFilterOpen(false)}
        onSelectGender={(gender) => {
          setSelectedGender(gender);
          toast({
            title: "Filter Updated",
            description: gender === 'all' 
              ? "Matching with everyone" 
              : `Filtering for ${gender === 'male' ? 'boys' : 'girls'} only`,
          });
        }}
      />
    </div>
  );
}
