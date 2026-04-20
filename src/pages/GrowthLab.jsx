import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TrendingUp, Activity, Dna, Search, Plus, Trash2 } from 'lucide-react';

const defaultCompetitors = ['@tech_guru', '@coding_life', '@dev_diaries'];

export default function GrowthLab() {
  const [competitors, setCompetitors] = useState(() => {
    const saved = localStorage.getItem('creator_competitors');
    return saved ? JSON.parse(saved) : defaultCompetitors;
  });
  
  const [newCompetitor, setNewCompetitor] = useState('');
  
  const [dna, setDna] = useState(() => {
      const saved = localStorage.getItem('creator_dna');
      return saved ? JSON.parse(saved) : { format: "Talking Head + B-Roll Hook", pacing: "Fast Cuts (Every 2-3s)" };
  });

  // Calculate generic viral score (mock math based on length of competitors list)
  const viralScore = Math.min(99, 65 + (competitors.length * 3));

  useEffect(() => {
    localStorage.setItem('creator_competitors', JSON.stringify(competitors));
  }, [competitors]);
  
  useEffect(() => {
      localStorage.setItem('creator_dna', JSON.stringify(dna));
  }, [dna]);

  const handleAddCompetitor = (e) => {
    e.preventDefault();
    if (!newCompetitor.trim()) return;
    
    let handle = newCompetitor.trim();
    if (!handle.startsWith('@')) handle = '@' + handle;
    
    if (!competitors.includes(handle)) {
      setCompetitors([...competitors, handle]);
    }
    setNewCompetitor('');
  };

  const removeCompetitor = (handleToRemove) => {
      setCompetitors(competitors.filter(h => h !== handleToRemove));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Growth Lab</h1>
          <p className="text-muted-foreground">Viral pattern analysis & trend detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-border/80 shadow-lg bg-gradient-to-br from-card/90 to-primary/5 backdrop-blur-md">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Dna className="text-primary"/> Content DNA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">AI analysis of what specifically works for your audience.</p>
            <div className="space-y-4">
               <div className="bg-muted/50 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors cursor-text group">
                  <span className="text-xs font-bold text-primary tracking-wide uppercase">Top Format</span>
                  <Input 
                      value={dna.format} 
                      onChange={e => setDna({...dna, format: e.target.value})} 
                      className="mt-1 bg-transparent border-0 px-0 focus-visible:ring-0 shadow-none font-medium text-md h-auto p-0 group-hover:text-primary transition-colors" 
                  />
               </div>
               <div className="bg-muted/50 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors cursor-text group">
                  <span className="text-xs font-bold text-primary tracking-wide uppercase">Optimal Pacing</span>
                  <Input 
                      value={dna.pacing} 
                      onChange={e => setDna({...dna, pacing: e.target.value})} 
                      className="mt-1 bg-transparent border-0 px-0 focus-visible:ring-0 shadow-none font-medium text-md h-auto p-0 group-hover:text-primary transition-colors" 
                  />
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-lg bg-card/90 backdrop-blur-md">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Activity className="text-orange-500"/> Viral Score Predictor</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 text-center">
            <div className={`w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center relative mb-4 transition-all duration-1000 ${viralScore > 80 ? 'shadow-[0_0_30px_rgba(249,115,22,0.4)]' : ''}`}>
                <div className="absolute inset-0 rounded-full border-8 border-orange-500 border-t-transparent animate-spin-slow"></div>
                <span className="text-4xl font-bold text-foreground">{viralScore}%</span>
            </div>
            <p className="text-sm text-muted-foreground">Your latest script draft has a {viralScore > 80 ? 'high' : 'moderate'} probability of going viral based on current trends.</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-lg bg-card/90 backdrop-blur-md h-full flex flex-col">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Search className="text-emerald-500"/> Competitor Watch</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 flex-1">
                {competitors.map((handle) => (
                   <div key={handle} className="group flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors cursor-pointer">
                      <span className="font-medium">{handle}</span>
                      <div className="flex items-center gap-2">
                          <div className="flex items-center text-emerald-500 text-xs font-bold">
                             <TrendingUp size={14} className="mr-1"/> +{Math.floor(Math.random() * 20 + 1)}%
                          </div>
                          <button onClick={() => removeCompetitor(handle)} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={14} />
                          </button>
                      </div>
                   </div>
                ))}
            </div>
            
            <form onSubmit={handleAddCompetitor} className="pt-2 border-t border-border flex gap-2 mt-auto">
               <Input placeholder="@handle" value={newCompetitor} onChange={e => setNewCompetitor(e.target.value)} className="bg-background"/>
               <Button type="submit" size="icon" className="shrink-0"><Plus size={16}/></Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
