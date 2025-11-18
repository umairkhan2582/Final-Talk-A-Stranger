import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import tassyMascot from "@assets/generated_images/TASSY_mascot_character_design_a24f8778.png";

const TASSY_ONE_LINERS = [
  "Hey! TASSY here! Keep it classy or I'll disconnect you faster than your ex!",
  "Welcome to TalkAStranger! Rule #1: Clothes stay ON. This isn't that kind of party!",
  "TASSY says: Your face is all we need to see. Keep everything else covered, champ!",
  "Nudity? NOPE! We're here to chat, not to create evidence. Stay decent, folks!",
  "Hi! I'm TASSY, your anti-awkwardness guardian. Keep it PG or I'll boot you to the moon!",
  "Remember: This is a CHAT app, not an anatomy lesson. Cover up, buttercup!",
  "TASSY's tip: Show off your personality, not your... well, you get it. Stay cool!",
  "Welcome! Before you start: Shirts required, drama optional, nudity FORBIDDEN!",
  "Hey stranger! TASSY here reminding you: We're rated E for Everyone. Keep it clean!",
  "Pro tip from TASSY: The fastest way to get banned? Nudity. Don't be that person!",
  "Hello! I'm watching... and I mean your CHAT behavior. Keep it respectful!",
  "TASSY checking in: Your mom could be watching. Act accordingly!",
];

interface TassyMascotProps {
  className?: string;
}

export default function TassyMascot({ className = "" }: TassyMascotProps) {
  const [currentOneLiner, setCurrentOneLiner] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Pick a random one-liner
    const randomIndex = Math.floor(Math.random() * TASSY_ONE_LINERS.length);
    setCurrentOneLiner(TASSY_ONE_LINERS[randomIndex]);
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Rotate one-liner every 8 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        const newIndex = Math.floor(Math.random() * TASSY_ONE_LINERS.length);
        setCurrentOneLiner(TASSY_ONE_LINERS[newIndex]);
        setIsVisible(true);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card 
      className={`p-4 max-w-2xl mx-auto bg-primary/10 border-primary/30 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } ${className}`}
      data-testid="mascot-tassy"
    >
      <div className="flex items-center gap-4">
        {/* TASSY Mascot Cat Image */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg ring-2 ring-primary/50">
            <img 
              src={tassyMascot} 
              alt="TASSY Mascot"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* One-liner */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-primary text-sm">TASSY</span>
            <span className="text-xs text-muted-foreground">Your friendly mascot</span>
          </div>
          <p className="text-sm leading-relaxed" data-testid="text-tassy-oneliner">
            {currentOneLiner}
          </p>
        </div>
      </div>
    </Card>
  );
}
