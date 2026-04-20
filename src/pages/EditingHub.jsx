import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Video, Sparkles, Scissors, Type, Music, Download, Upload, Loader2, Target, Trash2, Save } from 'lucide-react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export default function EditingHub() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [editedBlob, setEditedBlob] = useState(null);
  const [hasUnsavedEdits, setHasUnsavedEdits] = useState(false);
  
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);

  useEffect(() => {
    loadFfmpeg();
  }, []);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const loadFfmpeg = async () => {
    try {
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });
      // Load standard ffmpeg core
      await ffmpeg.load({
          coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
          wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm'
      });
      setIsLoaded(true);
    } catch (err) {
      console.error("FFMPEG Load Error:", err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setEditedBlob(null);
      setHasUnsavedEdits(false);
      setStartTime(0);
      
      // Auto-set end time to 10s initially
      if (videoRef.current) {
         videoRef.current.onloadedmetadata = () => {
            setEndTime(Math.floor(videoRef.current.duration) || 10);
         };
      }
    }
  };

  const setCurrentVideoTime = (type) => {
      if (videoRef.current) {
          const time = Math.floor(videoRef.current.currentTime * 100) / 100;
          if (type === 'start') setStartTime(time);
          if (type === 'end') setEndTime(time);
      }
  };

  const clearCurrentClip = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl('');
    setEditedBlob(null);
    setHasUnsavedEdits(false);
    setStartTime(0);
    setEndTime(10);
    setProgress(0);
  };

  const cleanupFsFiles = async (filenames) => {
    const ffmpeg = ffmpegRef.current;
    for (const filename of filenames) {
      try {
        await ffmpeg.deleteFile(filename);
      } catch (_) {
        // Ignore cleanup failures for files that do not exist.
      }
    }
  };

  const replacePreviewWithBlob = (blob, filename = 'edited_clip.mp4') => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    const previewUrl = URL.createObjectURL(blob);
    const editedFile = new File([blob], filename, { type: 'video/mp4' });
    setVideoUrl(previewUrl);
    setVideoFile(editedFile);
    setEditedBlob(blob);
    setHasUnsavedEdits(true);
    setStartTime(0);
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        setEndTime(Math.floor(videoRef.current.duration) || 10);
      };
    }
  };

  const exportSelection = async ({ replacePreview = false, downloadNow = false } = {}) => {
    if (!videoFile || !isLoaded) return;

    if (endTime <= startTime) {
      alert('End time must be greater than start time.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    
    try {
      const ffmpeg = ffmpegRef.current;
      await cleanupFsFiles(['input.mp4', 'output.mp4']);
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));
      const duration = Math.max(0.1, endTime - startTime);

      // Re-encode for reliable frame-accurate trim.
      await ffmpeg.exec([
        '-ss', startTime.toString(),
        '-i', 'input.mp4',
        '-t', duration.toString(),
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-c:a', 'aac',
        '-movflags', '+faststart',
        'output.mp4'
      ]);
      
      // Read out the trimmed file
      const data = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([data.buffer], { type: 'video/mp4' });
      setEditedBlob(blob);
      setHasUnsavedEdits(true);

      if (replacePreview) {
        replacePreviewWithBlob(blob, 'trimmed_clip.mp4');
      }

      if (downloadNow) {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'trimmed_clip.mp4';
        a.click();
        URL.revokeObjectURL(downloadUrl);
        setHasUnsavedEdits(false);
      }
      
    } catch (err) {
      console.error("Export Error: ", err);
      alert("Error processing video. Check console.");
    } finally {
      setIsProcessing(false);
      await cleanupFsFiles(['input.mp4', 'output.mp4']);
    }
  };

  const handleTrim = async () => {
    await exportSelection({ replacePreview: true, downloadNow: false });
  };

  const handleCut = async () => {
    if (!videoFile || !isLoaded) return;

    if (endTime <= startTime) {
      alert('End time must be greater than start time.');
      return;
    }

    const totalDuration = videoRef.current?.duration || 0;
    const hasLeftSegment = startTime > 0.05;
    const hasRightSegment = endTime < (totalDuration - 0.05);

    if (!hasLeftSegment && !hasRightSegment) {
      alert('Selected cut removes the full video. Adjust the range.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const ffmpeg = ffmpegRef.current;
      await cleanupFsFiles(['input.mp4', 'part1.mp4', 'part2.mp4', 'concat.txt', 'output.mp4']);
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

      if (hasLeftSegment) {
        await ffmpeg.exec([
          '-i', 'input.mp4',
          '-t', startTime.toString(),
          '-c:v', 'libx264',
          '-preset', 'veryfast',
          '-c:a', 'aac',
          'part1.mp4'
        ]);
      }

      if (hasRightSegment) {
        await ffmpeg.exec([
          '-ss', endTime.toString(),
          '-i', 'input.mp4',
          '-c:v', 'libx264',
          '-preset', 'veryfast',
          '-c:a', 'aac',
          'part2.mp4'
        ]);
      }

      if (hasLeftSegment && hasRightSegment) {
        const concatFile = `file 'part1.mp4'\nfile 'part2.mp4'\n`;
        await ffmpeg.writeFile('concat.txt', new TextEncoder().encode(concatFile));
        await ffmpeg.exec([
          '-f', 'concat',
          '-safe', '0',
          '-i', 'concat.txt',
          '-c', 'copy',
          'output.mp4'
        ]);
      } else if (hasLeftSegment) {
        await ffmpeg.exec([
          '-i', 'part1.mp4',
          '-c', 'copy',
          'output.mp4'
        ]);
      } else {
        await ffmpeg.exec([
          '-i', 'part2.mp4',
          '-c', 'copy',
          'output.mp4'
        ]);
      }

      const data = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([data.buffer], { type: 'video/mp4' });
      replacePreviewWithBlob(blob, 'cut_clip.mp4');
    } catch (err) {
      console.error("Cut Error: ", err);
      alert("Error cutting video. Check console.");
    } finally {
      setIsProcessing(false);
      await cleanupFsFiles(['input.mp4', 'part1.mp4', 'part2.mp4', 'concat.txt', 'output.mp4']);
    }
  };

  const handleSaveAll = () => {
    if (!videoFile) return;
    const blobToSave = editedBlob || videoFile;
    const downloadUrl = URL.createObjectURL(blobToSave);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = editedBlob ? 'edited_project.mp4' : (videoFile.name || 'project_video.mp4');
    a.click();
    URL.revokeObjectURL(downloadUrl);
    setHasUnsavedEdits(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editing Hub</h1>
          <p className="text-muted-foreground transition-all">
             {isLoaded ? "FFmpeg Engine Ready" : "Loading Editing Engine..."}
          </p>
        </div>
        <div className="relative overflow-hidden inline-block">
            <Button className="gap-2 shadow-lg shadow-primary/20">
            <Upload size={18} /> Upload Video
            </Button>
            <input 
                type="file" 
                accept="video/*" 
                onChange={handleFileUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card className="border-border/80 shadow-xl bg-card/90 backdrop-blur-md overflow-hidden flex flex-col min-h-[500px]">
             
             {/* Video Player */}
             <div className="flex-1 bg-black/90 flex items-center justify-center relative min-h-[350px]">
                 {videoUrl ? (
                     <video 
                        ref={videoRef}
                        src={videoUrl} 
                        controls 
                        className="max-h-full max-w-full"
                     />
                 ) : (
                     <p className="text-white/50 flex flex-col items-center gap-2">
                         <Video size={48} className="opacity-50" />
                         Upload a local video file to begin cutting
                     </p>
                 )}
                 {videoUrl && (
                    <div className="absolute top-4 right-4 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                        <Sparkles size={14}/> Active Project
                    </div>
                 )}
             </div>
             
             {/* Timeline Editor */}
             <div className="bg-muted/30 border-t border-border/50 p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Timeline Trim Tool</span>
                    {isProcessing && <span className="text-xs text-primary font-bold animate-pulse">Processing... {progress}%</span>}
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1 w-24">
                        <div className="flex justify-between items-center">
                           <label className="text-[10px] text-muted-foreground uppercase font-bold">Start (sec)</label>
                           <button onClick={() => setCurrentVideoTime('start')} className="text-primary hover:text-primary/80" title="Set to current video time">
                               <Target size={12}/>
                           </button>
                        </div>
                        <input 
                            type="number" 
                            value={startTime} 
                            onChange={(e) => setStartTime(Number(e.target.value))}
                            className="bg-background border border-border rounded px-2 py-1 text-sm outline-none w-full"
                            min="0"
                            step="0.1"
                        />
                    </div>
                    
                    {/* Visual bar to represent video */}
                    <div className="flex-1 h-8 bg-blue-500/10 rounded-lg border border-blue-500/30 flex items-center justify-center relative overflow-hidden">
                         <div className="absolute inset-y-0 bg-blue-500/30" style={{ left: '0%', width: '100%' }}></div>
                         <span className="text-xs text-blue-500 font-bold z-10">Video Preview Track</span>
                    </div>

                    <div className="flex flex-col gap-1 w-24">
                       <div className="flex justify-between items-center">
                           <label className="text-[10px] text-muted-foreground uppercase font-bold">End (sec)</label>
                           <button onClick={() => setCurrentVideoTime('end')} className="text-primary hover:text-primary/80" title="Set to current video time">
                               <Target size={12}/>
                           </button>
                        </div>
                        <input 
                            type="number" 
                            value={endTime} 
                            onChange={(e) => setEndTime(Number(e.target.value))}
                            className="bg-background border border-border rounded px-2 py-1 text-sm outline-none w-full"
                            min="0.1"
                            step="0.1"
                        />
                    </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                    <Button 
                        onClick={clearCurrentClip} 
                        disabled={!videoFile || isProcessing} 
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2 border-red-500/40 text-red-500 hover:bg-red-500/10"
                    >
                        <Trash2 size={16}/>
                        Delete Clip
                    </Button>

                    <Button 
                        onClick={handleTrim} 
                        disabled={!videoFile || !isLoaded || isProcessing} 
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                    >
                        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Scissors size={16}/>}
                        {isProcessing ? `Trimming (${progress}%)` : 'Trim'}
                    </Button>

                    <Button 
                        onClick={handleCut} 
                        disabled={!videoFile || !isLoaded || isProcessing} 
                        className="bg-primary text-primary-foreground flex-1 flex items-center justify-center gap-2"
                    >
                        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Download size={16}/>}
                        {isProcessing ? `Cutting (${progress}%)` : 'Cut'}
                    </Button>

                    <Button 
                        onClick={handleSaveAll} 
                        disabled={!videoFile || isProcessing} 
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                    >
                        <Save size={16}/>
                        {hasUnsavedEdits ? 'Save All*' : 'Save All'}
                    </Button>
                </div>
             </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="border-border/80 shadow-lg bg-card/90 backdrop-blur-md">
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="text-primary" size={18}/> AI Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground pb-2">These tools become active after uploading a valid video file.</p>
              <Button disabled variant="outline" className="w-full justify-start gap-3 border-border/60 transition-all opacity-50">
                <Type size={16} /> Auto Captions (Coming Soon)
              </Button>
              <Button disabled variant="outline" className="w-full justify-start gap-3 border-border/60 transition-all opacity-50">
                <Music size={16} /> Suggest BGM (Coming Soon)
              </Button>
              <Button onClick={() => alert("To mock this: We would run ffmpeg with silenceremove audio filter.")} disabled={!videoFile} variant="outline" className="w-full justify-start gap-3 border-border/60 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all">
                <Scissors size={16} /> AI Cut Silences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
