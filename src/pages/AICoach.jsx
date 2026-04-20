import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function AICoach() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "AI features are currently removed from this page." }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const query = inputVal.trim();
    const newMsg = { id: Date.now(), sender: 'user', text: query };
    
    // Update UI immediately
    setMessages(prev => [...prev, newMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'AI is disabled right now. I saved your message in this chat only.'
        }
      ]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-6 animate-in fade-in duration-500 relative z-10 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Coach</h1>
          <p className="text-muted-foreground">Your built-in knowledge and answering companion.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col border-border/80 shadow-lg bg-card/90 backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/30 py-4 flex flex-row items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl text-primary animate-pulse">
            <Sparkles size={24} />
          </div>
          <div>
            <CardTitle className="text-lg">Creator AI</CardTitle>
            <p className="text-xs text-primary/80 font-medium tracking-wide">AI Disabled</p>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 mt-1 h-8 w-8 rounded-full flex items-center justify-center shadow-sm
                  ${msg.sender === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed shadow-sm
                  ${msg.sender === 'user' ? 'bg-secondary text-secondary-foreground rounded-tr-sm' : 'bg-muted border border-border rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
               <div className="flex gap-3 max-w-[80%] flex-row">
                 <div className="flex-shrink-0 mt-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                    <Bot size={16} />
                 </div>
                 <div className="p-4 rounded-2xl bg-muted border border-border shadow-sm rounded-tl-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
               </div>
             </div>
          )}
          <div ref={endOfMessagesRef} />
        </CardContent>

        <CardFooter className="border-t border-border/50 bg-background/50 p-4">
          <form onSubmit={handleSend} className="flex w-full gap-2 relative">
            <Input 
               value={inputVal}
               onChange={(e) => setInputVal(e.target.value)}
               placeholder="Ask me a question..."
               className="flex-1 bg-background shadow-sm border-border"
               disabled={isTyping}
            />
            <Button type="submit" disabled={isTyping || !inputVal.trim()} className="gap-2 shadow-sm text-primary-foreground">
              <Send size={16} /> Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
