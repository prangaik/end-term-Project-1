import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, ExternalLink, Plus } from 'lucide-react';

const defaultEngagement = [
  { name: 'Week 1', views: 12000, likes: 3000, shares: 400 },
  { name: 'Week 2', views: 19000, likes: 4500, shares: 800 },
];

export default function Analytics() {
  const [engagementData, setEngagementData] = useState(() => {
    const saved = localStorage.getItem('creator_analytics');
    return saved ? JSON.parse(saved) : defaultEngagement;
  });

  const [formData, setFormData] = useState({ name: '', views: '', likes: '', shares: '' });

  useEffect(() => {
    localStorage.setItem('creator_analytics', JSON.stringify(engagementData));
  }, [engagementData]);

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.views) return;
    
    const newEntry = {
      name: formData.name,
      views: Number(formData.views),
      likes: Number(formData.likes || 0),
      shares: Number(formData.shares || 0)
    };
    
    setEngagementData([...engagementData, newEntry]);
    setFormData({ name: '', views: '', likes: '', shares: '' });
  };

  const totalViews = engagementData.reduce((acc, curr) => acc + curr.views, 0);
  const totalLikes = engagementData.reduce((acc, curr) => acc + curr.likes, 0);
  const avgEngagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Lab</h1>
          <p className="text-muted-foreground">Log your performance and calculate true engagement.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Views Logged</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(totalViews / 1000).toFixed(1)}k</div>
            </CardContent>
          </Card>
          
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">True Engagement Rate</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgEngagementRate}%</div>
              <p className="text-xs text-muted-foreground mt-1 text-primary cursor-pointer hover:underline flex items-center gap-1">Based on (Likes/Views) <ExternalLink size={10}/></p>
            </CardContent>
          </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 border-border shadow-md bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Audience Engagement Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <defs>
                   <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="likes" stroke="#8b5cf6" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-border shadow-md bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Log Performance</CardTitle>
          </CardHeader>
          <CardContent>
             <form onSubmit={handleAddLog} className="space-y-4">
                 <div className="space-y-2">
                     <label className="text-xs font-semibold text-muted-foreground uppercase">Period (e.g., Week 3)</label>
                     <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Week 3" className="bg-background"/>
                 </div>
                 <div className="space-y-2">
                     <label className="text-xs font-semibold text-muted-foreground uppercase">Total Views</label>
                     <Input required type="number" value={formData.views} onChange={e => setFormData({...formData, views: e.target.value})} placeholder="15000" className="bg-background"/>
                 </div>
                 <div className="space-y-2">
                     <label className="text-xs font-semibold text-muted-foreground uppercase">Total Likes</label>
                     <Input type="number" value={formData.likes} onChange={e => setFormData({...formData, likes: e.target.value})} placeholder="3800" className="bg-background"/>
                 </div>
                 <Button type="submit" className="w-full gap-2 shadow-primary/20 shadow-lg mt-2">
                     <Plus size={16} /> Add to Graph
                 </Button>
                 <Button type="button" variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => setEngagementData(defaultEngagement)}>
                     Reset Data
                 </Button>
             </form>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
