import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { DollarSign, Briefcase, Calculator, ShoppingBag, Plus, Trash2, ArrowRightLeft } from 'lucide-react';

const defaultDeals = [
  { id: 1, brand: 'TechGear', status: 'In Review', amount: 1200, color: 'text-amber-500' },
  { id: 2, brand: 'CodeAcademy', status: 'Approved', amount: 2500, color: 'text-emerald-500' }
];

export default function Monetization() {
  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem('creator_deals');
    return saved ? JSON.parse(saved) : defaultDeals;
  });

  const [newBrand, setNewBrand] = useState('');
  const [newAmount, setNewAmount] = useState('');
  
  const [digitalSales, setDigitalSales] = useState(() => {
     const saved = localStorage.getItem('creator_sales');
     return saved ? parseInt(saved, 10) : 4250;
  });
  
  const [customSaleAmount, setCustomSaleAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('creator_deals', JSON.stringify(deals));
    localStorage.setItem('creator_sales', digitalSales.toString());
  }, [deals, digitalSales]);

  const handleAddDeal = (e) => {
    e.preventDefault();
    if (!newBrand || !newAmount) return;
    
    setDeals([
      ...deals, 
      { id: Date.now(), brand: newBrand, status: 'Negotiating', amount: Number(newAmount), color: 'text-blue-500' }
    ]);
    setNewBrand('');
    setNewAmount('');
  };

  const handleDeleteDeal = (id) => {
      setDeals(deals.filter(d => d.id !== id));
  };
  
  const cycleStatus = (id) => {
      setDeals(deals.map(d => {
          if (d.id === id) {
              const stages = [
                  { s: 'Negotiating', c: 'text-blue-500' },
                  { s: 'In Review', c: 'text-amber-500' },
                  { s: 'Approved', c: 'text-emerald-500' }
              ];
              const idx = stages.findIndex(st => st.s === d.status);
              const next = stages[(idx + 1) % stages.length];
              return { ...d, status: next.s, color: next.c };
          }
          return d;
      }));
  };

  const handleDigitalTransaction = (mode) => {
      if (!customSaleAmount) return;
      const amt = Number(customSaleAmount);
      if (mode === 'add') setDigitalSales(prev => prev + amt);
      if (mode === 'sub') setDigitalSales(prev => Math.max(0, prev - amt));
      setCustomSaleAmount('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monetization Hub</h1>
          <p className="text-muted-foreground">Track brand deals, rates, and digital products</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-border/80 shadow-lg bg-card/90 backdrop-blur-md flex flex-col h-full">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Briefcase className="text-primary"/> Active Brand Deals</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 gap-4">
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
               {deals.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No active deals.</p>}
               {deals.map(deal => (
                  <div key={deal.id} className="group flex justify-between items-center p-3 rounded-lg border border-border/50 bg-background/30 hover:bg-muted/50 transition-colors">
                     <div className="flex-1">
                        <p className="font-semibold text-sm">{deal.brand}</p>
                        <button onClick={() => cycleStatus(deal.id)} className={`text-xs ${deal.color} hover:underline flex items-center gap-1`}>
                            {deal.status} <ArrowRightLeft size={10} className="opacity-50" />
                        </button>
                     </div>
                     <div className="flex items-center gap-3">
                         <span className="font-bold text-foreground">${deal.amount.toLocaleString()}</span>
                         <button onClick={() => handleDeleteDeal(deal.id)} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                             <Trash2 size={14} />
                         </button>
                     </div>
                  </div>
               ))}
            </div>
            
            <form onSubmit={handleAddDeal} className="pt-2 border-t border-border flex gap-2">
               <Input placeholder="Brand" value={newBrand} onChange={e => setNewBrand(e.target.value)} className="bg-background"/>
               <Input placeholder="$0" type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="bg-background w-24"/>
               <Button type="submit" size="icon" className="shrink-0"><Plus size={16}/></Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-lg bg-card/90 backdrop-blur-md">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Calculator className="text-pink-500"/> Rate Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground">Based on your recent engagement and niche, here is your suggested rate card.</p>
             <div className="bg-muted p-4 rounded-xl space-y-2">
                 <div className="flex justify-between">
                     <span className="text-sm">Dedicated YouTube Video</span>
                     <span className="font-bold text-emerald-400">$1,500</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-sm">Instagram Reel</span>
                     <span className="font-bold text-emerald-400">$800</span>
                 </div>
                 <div className="flex justify-between">
                     <span className="text-sm">60s Integration</span>
                     <span className="font-bold text-emerald-400">$900</span>
                 </div>
             </div>
             <Button variant="outline" className="w-full border-dashed" onClick={() => alert("Connecting to Analytics...")}>
                 Recalculate using Live Data
             </Button>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-lg bg-card/90 backdrop-blur-md">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><ShoppingBag className="text-blue-500"/> Digital Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
               <div>
                   <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">Total Sales</p>
                   <p className="text-2xl font-bold flex items-center"><DollarSign size={20}/> {digitalSales.toLocaleString()}</p>
               </div>
               <TrendingUpIcon />
            </div>
            
            <div className="flex items-center gap-2 mb-4">
               <span className="text-primary font-bold bg-muted px-3 py-2 rounded-md border border-border">$</span>
               <Input type="number" placeholder="Amt" value={customSaleAmount} onChange={e => setCustomSaleAmount(e.target.value)} className="bg-background"/>
               <Button onClick={() => handleDigitalTransaction('add')} className="bg-blue-500 hover:bg-blue-600">Add</Button>
               <Button onClick={() => handleDigitalTransaction('sub')} variant="destructive">Remove</Button>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
               <div className="flex justify-between items-center text-sm p-2 bg-background/50 rounded border border-border/50">
                   <span>Lightroom Presets</span>
                   <span className="font-medium text-emerald-500">Active</span>
               </div>
               <div className="flex justify-between items-center text-sm p-2 bg-background/50 rounded border border-border/50">
                   <span>Notion Creator Template</span>
                   <span className="font-medium text-emerald-500">Active</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <div className="bg-blue-500/20 text-blue-500 p-2 rounded-full">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
    </div>
  )
}
