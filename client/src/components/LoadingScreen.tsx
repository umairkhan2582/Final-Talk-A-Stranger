import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import tassyMascot from '@assets/generated_images/TASSY_mascot_character_design_a24f8778.png';

interface LoadingScreenProps {
  message?: string;
  tip?: string;
}

const funnyOneLiners = [
  "TASSY is doing push-ups to prepare for this conversation...",
  "Warning: May cause uncontrollable laughter and new friendships!",
  "Searching the globe... TASSY found someone in 3... 2... 1...",
  "TASSY's picking the coolest person for you right now!",
  "Fun fact: You're about to meet someone awesome. TASSY guarantees it!",
  "TASSY is consulting the friendship oracle... Results: POSITIVE!",
  "Hold tight! TASSY's connecting you faster than Wi-Fi!",
  "TASSY says: The best conversations start with 'Hey, nice to meet you!'",
  "Pro tip from TASSY: Smile! They can't see it, but they'll feel it!",
  "TASSY just high-fived your future new friend. Get ready!",
  "Loading awesomeness... 99%... Just kidding, it's instant!",
  "TASSY's motto: No boring chats allowed!",
  "Your conversation partner is being hand-picked by TASSY himself!",
  "TASSY is matching energy levels... Yours is off the charts!",
  "Breaking news: You're about to have a legendary chat!",
  "TASSY's spinning the wheel of friendship... and it landed on YOU!",
  "Psst... TASSY says your next friend is gonna be epic!",
  "TASSY is making sure they speak your vibe language!",
  "Alert: Coolness overload incoming in 3... 2... 1...",
  "TASSY's checking if they're ready for your awesome personality!"
];

export default function LoadingScreen({ 
  message = "Finding someone new...",
  tip
}: LoadingScreenProps) {
  const [currentTip, setCurrentTip] = useState(tip || funnyOneLiners[0]);

  useEffect(() => {
    if (!tip) {
      const interval = setInterval(() => {
        setCurrentTip(funnyOneLiners[Math.floor(Math.random() * funnyOneLiners.length)]);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [tip]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 bg-gradient-to-br from-primary/20 via-accent/10 to-background min-h-screen">
      {/* TASSY Mascot with Animation */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Animated rings around TASSY */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-4 border-accent/30 animate-ping" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-primary/40 animate-pulse" />
          </div>
          
          {/* TASSY Mascot Image */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-2xl shadow-primary/50 animate-bounce">
            <img 
              src={tassyMascot} 
              alt="TASSY Mascot"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground uppercase tracking-tight">
          Talk<span className="text-primary">A</span>Stranger
        </h1>
      </div>
      
      {/* Loading Spinner */}
      <div className="relative">
        <Loader2 className="w-20 h-20 text-accent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-accent/20 animate-ping" />
        </div>
      </div>
      
      {/* Funny Messages */}
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-3xl font-bold text-foreground text-center" data-testid="text-loading-message">
          {message}
        </h2>
        <p className="text-lg text-foreground text-center max-w-lg px-4 font-medium min-h-[3.5rem] flex items-center">
          {currentTip}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>TASSY is working his magic...</span>
        </div>
      </div>
    </div>
  );
}
