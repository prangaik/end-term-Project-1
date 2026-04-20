import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { GraduationCap, PlayCircle, BookOpen, Star } from 'lucide-react';

export default function LearningHub() {
  const courses = [
      { title: "Masterclass: Essential Skills", videoId: "BEuwA7Cbbuc", url: "https://www.youtube.com/watch?v=BEuwA7Cbbuc" },
      { title: "Deep Dive: Content Strategy", videoId: "iUIFyClTX6s", url: "https://www.youtube.com/watch?v=iUIFyClTX6s" },
      { title: "Algorithm secrets (Start at 21:28)", videoId: "82LboR7IVi4", url: "https://www.youtube.com/watch?v=82LboR7IVi4&t=1288s" },
      { title: "Next Level Production", videoId: "75tkthAzZog", url: "https://www.youtube.com/watch?v=75tkthAzZog" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
          <p className="text-muted-foreground">Master the art of content creation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-border/80 shadow-lg bg-card/90 backdrop-blur-md md:col-span-2">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><PlayCircle className="text-primary"/> Pro Courses</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {courses.map((course, i) => (
                    <a key={i} href={course.url} target="_blank" rel="noopener noreferrer" className="block group relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 hover:border-primary/50 transition-all">
                        <div className="w-full aspect-video bg-black rounded-t-xl overflow-hidden relative flex items-center justify-center">
                            <img 
                                src={`https://img.youtube.com/vi/${course.videoId}/maxresdefault.jpg`} 
                                alt={course.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                onError={(e) => e.target.src = `https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg`}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                            <div className="absolute bg-red-600/90 text-white rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                <PlayCircle size={32} fill="currentColor" strokeWidth={1} />
                            </div>
                        </div>
                        <div className="p-3">
                            <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{course.title}</h3>
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                <span>Advanced</span>
                                <span>Watch on YouTube ↗</span>
                            </div>
                        </div>
                    </a>
                 ))}
             </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="border-border/80 shadow-lg bg-card/90 backdrop-blur-md">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2"><Star className="text-yellow-500"/> Creator Challenges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 dark:bg-yellow-500/5">
                     <p className="font-bold text-sm text-yellow-600 dark:text-yellow-500">30 Days of Shorts</p>
                     <p className="text-xs mt-1 text-muted-foreground">Post 1 short per day. 12/30 completed.</p>
                     <div className="w-full bg-background rounded-full h-1.5 mt-2">
                        <div className="bg-yellow-500 h-1.5 rounded-full" style={{width: '40%'}}></div>
                     </div>
                 </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/80 shadow-lg bg-card/90 backdrop-blur-md">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2"><BookOpen className="text-blue-500"/> Case Studies</CardTitle>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-2 text-sm">
                     <li className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Why MrBeast's Thumbnail won
                     </li>
                     <li className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> The Anatomy of a Viral Tweet
                     </li>
                 </ul>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
