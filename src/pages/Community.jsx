import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, Code, MessageSquare, HeartHandshake } from 'lucide-react';

export default function Community() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community & Collab</h1>
          <p className="text-muted-foreground">Networking, feedback, and collaborations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/80 shadow-lg bg-card/90 backdrop-blur-md">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><HeartHandshake className="text-primary"/> Collaboration Board</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {[
                { name: 'Sarah Tech', role: 'YouTuber (50k)', looking: 'Looking for a dev to review my CSS video' },
                 { name: 'UI Maker', role: 'Designer', looking: 'Want to do a design challenge collab?' },
                 { name: 'DevDaily', role: 'TikToker', looking: 'Need someone to react to bad code with me' }
             ].map((post, i) => (
                 <div key={i} className="p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/30 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                         <div>
                             <p className="font-bold">{post.name}</p>
                             <p className="text-xs text-muted-foreground">{post.role}</p>
                         </div>
                         <Button variant="outline" size="sm" className="h-7 text-xs">Connect</Button>
                     </div>
                     <p className="text-sm mt-2">{post.looking}</p>
                 </div>
             ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="border-border/80 shadow-lg bg-card/90 backdrop-blur-md">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2"><MessageSquare className="text-teal-500"/> Direct Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/60 rounded-xl">
                    <Users size={32} className="text-muted-foreground mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">Connect with creators to start messaging.</p>
                </div>
              </CardContent>
            </Card>
            
             <Card className="border-border/80 shadow-lg bg-card/90 backdrop-blur-md">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2"><Code className="text-orange-500"/> Script Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                 <Button className="w-full text-primary-foreground">Share Script for Review</Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
