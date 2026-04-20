import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Tag, Trash2, ArrowRight } from 'lucide-react';

export default function IdeaVault() {
  const { ideas, addIdea, deleteIdea, addPipelineItem } = useContent();
  const [newIdea, setNewIdea] = useState('');
  const [tag, setTag] = useState('YouTube');
  const [priority, setPriority] = useState('Medium');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newIdea.trim()) return;
    await addIdea({ title: newIdea, tag, priority, createdAt: new Date().toISOString() });
    setNewIdea('');
  };

  const convertToPipeline = async (idea) => {
    await addPipelineItem({
      title: idea.title,
      tag: idea.tag,
      priority: idea.priority,
      status: 'idea',
      dueDate: null,
      createdAt: new Date().toISOString()
    });
    // optionally delete from ideas or mark as converted
    await deleteIdea(idea.id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Idea Vault</h1>
          <p className="text-muted-foreground">Brainstorm and store your potential content gems.</p>
        </div>
      </div>

      <Card className="border-border">
        <CardContent className="pt-6">
          <form onSubmit={handleAdd} className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Idea Title</label>
              <Input 
                value={newIdea} 
                onChange={(e) => setNewIdea(e.target.value)} 
                placeholder="e.g. 5 ways to optimize React apps..." 
              />
            </div>
            <div className="w-full md:w-48 space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <select 
                value={tag} 
                onChange={(e) => setTag(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="YouTube">YouTube</option>
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter</option>
                <option value="Blog">Blog</option>
              </select>
            </div>
            <div className="w-full md:w-32 space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <Button type="submit" className="w-full md:w-auto gap-2">
              <Plus size={16} /> Add Idea
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ideas.map((idea) => (
          <Card key={idea.id} className="group relative border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg pr-8">{idea.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  <Tag size={12} /> {idea.tag}
                </span>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold
                  ${idea.priority === 'High' ? 'bg-destructive/10 text-destructive' : 
                    idea.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 
                    'bg-green-500/10 text-green-500'}
                `}>
                  {idea.priority}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <button 
                  onClick={() => deleteIdea(idea.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors text-sm flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1 border-primary/20 hover:bg-primary/10 hover:text-primary"
                  onClick={() => convertToPipeline(idea)}
                >
                  Send to Content Manager <ArrowRight size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {ideas.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            No ideas yet. Start brainstorming!
          </div>
        )}
      </div>
    </div>
  );
}
