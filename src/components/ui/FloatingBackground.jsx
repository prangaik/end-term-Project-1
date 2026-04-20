import React from 'react';
import { PenTool, Calendar, Star, Video, Layers, Sparkles } from 'lucide-react';

export default function FloatingBackground() {
  const getRandomPos = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  // We explicitly position these so they spread across the screen visually forming a parallax-like background
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
      {/* Soft gradient blobs for additional aesthetic */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-[100px]"></div>
      <div className="absolute -bottom-24 -left-24 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]"></div>
      <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/80 blur-[80px]"></div>

      {/* Floating illustrations */}
      <div className="absolute top-[10%] left-[15%] text-primary/30 animate-float-1">
        <PenTool size={120} strokeWidth={1} />
      </div>
      
      <div className="absolute top-[20%] right-[10%] text-accent/40 animate-float-2">
        <Star size={80} strokeWidth={1.5} />
      </div>

      <div className="absolute bottom-[30%] left-[5%] text-primary/20 animate-float-3">
        <Video size={100} strokeWidth={1} />
      </div>

      <div className="absolute bottom-[10%] right-[20%] text-accent/30 animate-float-1">
        <Calendar size={140} strokeWidth={1} />
      </div>

      <div className="absolute top-[60%] right-[5%] text-primary/40 animate-float-2">
        <Sparkles size={60} strokeWidth={1.5} />
      </div>
      
      <div className="absolute top-[40%] left-[30%] text-secondary-foreground/10 animate-float-3">
        <Layers size={90} strokeWidth={1} />
      </div>
    </div>
  );
}
