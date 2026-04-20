import React from 'react';
import { useContent } from '../context/ContentContext';
import { Card, CardContent } from '../components/ui/Card';
import { Trash2 } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'script', label: 'Scripting' },
  { value: 'recording', label: 'Recording' },
  { value: 'editing', label: 'Editing' },
  { value: 'thumbnail', label: 'Thumbnail & SEO' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' }
];

export default function ContentManager() {
  const { pipeline, updatePipelineItem, deletePipelineItem } = useContent();

  const handleStatusChange = async (id, newStatus) => {
    await updatePipelineItem(id, { status: newStatus });
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500 relative z-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Manager</h1>
        <p className="text-muted-foreground">Easily track and progress your projects using the table list below.</p>
      </div>

      <Card className="border-border shadow-sm bg-card/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/30 border-b border-border text-muted-foreground">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Title</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Platform</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Priority</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Stage</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pipeline.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                      {item.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                        {item.tag}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.priority === 'High' ? 'text-destructive bg-destructive/10' :
                        item.priority === 'Medium' ? 'text-amber-500 bg-amber-500/10' :
                        'text-primary bg-primary/10'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={item.status} 
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="bg-muted text-foreground border border-border text-xs rounded focus:ring-primary focus:border-primary block w-full p-2"
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deletePipelineItem(item.id)}
                        className="text-muted-foreground hover:text-destructive flex items-center justify-end w-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {pipeline.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                      No active projects. Start by sending an idea to the manager from the Idea Vault!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
