import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useContent } from '../context/ContentContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Video, Lightbulb, Clock, CheckCircle, Trash2 } from 'lucide-react';

const mockProductivity = [
  { name: 'Mon', videos: 0, ideas: 2, scripts: 1 },
  { name: 'Tue', videos: 1, ideas: 1, scripts: 2 },
  { name: 'Wed', videos: 0, ideas: 3, scripts: 0 },
  { name: 'Thu', videos: 0, ideas: 0, scripts: 1 },
  { name: 'Fri', videos: 2, ideas: 1, scripts: 1 },
  { name: 'Sat', videos: 0, ideas: 4, scripts: 0 },
  { name: 'Sun', videos: 1, ideas: 0, scripts: 0 },
];

export default function Dashboard() {
  const { ideas, pipeline, deletePipelineItem } = useContent();

  const metrics = [
    { title: "Total Ideas", value: ideas.length, icon: Lightbulb, color: "text-amber-500" },
    { title: "In Production", value: pipeline.filter(i => i.status !== 'published').length, icon: Video, color: "text-primary" },
    { title: "Scheduled", value: pipeline.filter(i => i.status === 'scheduled').length, icon: Clock, color: "text-blue-500" },
    { title: "Published", value: pipeline.filter(i => i.status === 'published').length, icon: CheckCircle, color: "text-green-500" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map(metric => (
          <Card key={metric.title} className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value || 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 border-border">
          <CardHeader>
            <CardTitle>Weekly Productivity</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockProductivity}>
                <defs>
                  <linearGradient id="colorVideos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="videos" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVideos)" />
                <Area type="monotone" dataKey="ideas" stroke="#8b5cf6" fillOpacity={0.2} fill="#8b5cf6" />
                <Area type="monotone" dataKey="scripts" stroke="#10b981" fillOpacity={0.2} fill="#10b981" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-border">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {pipeline.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
                No active projects in the pipeline.
              </div>
            ) : (
              <div className="space-y-4">
                {pipeline.slice(0, 4).map((item, i) => (
                  <div key={item.id} className="group flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0 border-border hover:bg-muted/30 p-2 rounded-lg transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Clock size={18} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{item.title}</p>
                      <p className="text-xs text-muted-foreground">Status: <span className="uppercase text-primary">{item.status}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                        {item.dueDate && (
                            <div className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                                {new Date(item.dueDate).toLocaleDateString()}
                            </div>
                        )}
                        <button onClick={() => deletePipelineItem(item.id)} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={14} />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
