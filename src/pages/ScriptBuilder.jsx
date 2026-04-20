import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Save, FileText, CheckCircle2 } from 'lucide-react';

export default function ScriptBuilder() {
  const { pipeline, ideas, updatePipelineItem, updateIdea } = useContent();
  const [selectedItemId, setSelectedItemId] = useState('');
  const [scriptContent, setScriptContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Filter pipeline items that need scripting
  const scriptablePipeline = pipeline.filter(item => 
      ['idea', 'script', 'recording'].includes(item.status)
  );

  // Provide unified dropdown blending Idea Vault entries and Content Manager entries seamlessly
  const allScriptableItems = [
      ...ideas.map(i => ({ ...i, listSource: 'ideas' })),
      ...scriptablePipeline.map(p => ({ ...p, listSource: 'pipeline', title: `${p.title} (Managed)` }))
  ];

  useEffect(() => {
     if (selectedItemId) {
         const item = allScriptableItems.find(i => i.id === selectedItemId);
         if (item) {
             setScriptContent(item.script || '');
         }
     } else {
         setScriptContent('');
     }
  }, [selectedItemId, pipeline, ideas]);

  const handleSave = async () => {
      if (!selectedItemId) return;
      setIsSaving(true);
      const item = allScriptableItems.find(i => i.id === selectedItemId);
      if (item) {
          if (item.listSource === 'pipeline') {
              await updatePipelineItem(selectedItemId, { script: scriptContent });
          } else {
              await updateIdea(selectedItemId, { script: scriptContent });
          }
      }
      setLastSaved(new Date());
      setIsSaving(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-6 animate-in fade-in duration-500 relative z-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Script Builder</h1>
          <p className="text-muted-foreground">Draft and organize your content scripts seamlessly.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="flex h-10 w-64 rounded-md border border-input bg-background/80 backdrop-blur-sm px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select an idea or project...</option>
            {allScriptableItems.map(item => (
                <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
          
          <Button onClick={handleSave} disabled={!selectedItemId || isSaving} className="gap-2 w-28">
            {isSaving ? <span className="animate-pulse">Saving...</span> : <><Save size={16}/> Save</>}
          </Button>
        </div>
      </div>

      <Card className="flex-1 border-border/80 shadow-lg flex flex-col overflow-hidden bg-card/90 backdrop-blur-md">
        <div className="bg-muted/40 px-4 py-2 border-b border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
                <FileText size={14} /> Markdown Supported
            </div>
            {lastSaved && (
                <div className="flex items-center gap-1 text-green-600 font-medium">
                    <CheckCircle2 size={14} /> Last saved: {lastSaved.toLocaleTimeString()}
                </div>
            )}
        </div>
        <CardContent className="p-0 flex-1 relative">
            {!selectedItemId ? (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/80 bg-background/50">
                    Select an Idea or Content Manager project from the dropdown to start scripting
                </div>
            ) : null}
             <textarea
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                placeholder="# Introduction&#10;Write your hook here...&#10;&#10;## Body&#10;Main talking points...&#10;&#10;## Outro&#10;Call to action..."
                className="w-full h-full p-6 bg-transparent border-none resize-none focus:outline-none font-mono text-sm leading-relaxed text-foreground"
                disabled={!selectedItemId}
             />
        </CardContent>
      </Card>
    </div>
  );
}
