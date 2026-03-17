import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  Sun, Moon, LayoutDashboard, CheckSquare, Timer, BookOpen, Plus, Trash2, Play, Pause, RotateCcw,
  Search, Bell, Settings, Zap, Calendar as CalendarIcon, Trophy, Sparkles, FileText, BrainCircuit, Upload,
  MessageSquare, Send, CheckCircle2, XCircle, Loader2, Save, Edit3, Droplets, Music as MusicIcon, Volume2, SkipBack, SkipForward, Menu, X, Clock, Candy, Smile, Frown, Meh, Laugh, Angry, BarChart3, Layers, Users, Star, ArrowRight, Type, Pen, Highlighter, Eraser, Undo2, Redo2, Palette, AlignLeft, Bold, Italic, Underline, Strikethrough, Square, MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import ReactPlayer from 'react-player';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { BsPlayFill, BsPauseFill, BsSkipEndFill, BsFillSkipStartFill } from 'react-icons/bs';
import { SiYoutubemusic } from "react-icons/si";
import { CgClose } from "react-icons/cg";
import { MdPlaylistPlay } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { GoogleGenAI } from "@google/genai";

interface Task { id: string; text: string; completed: boolean; category: string; }
interface ScheduleItem { id: string; title: string; time: string; day: string; type: 'Class' | 'Study' | 'Exam' | 'Break'; }
interface Note { id: string; title: string; content: string; date: string; color: string; image?: string; drawing?: string; }
interface ChatMessage { role: 'user' | 'model'; text: string; }
interface Song { title: string; artist: string; url: string; }
interface QuizQuestion { question: string; options: string[]; correctAnswer: number; explanation: string; }
interface Flashcard { front: string; back: string; }

const CANDY_SONGS: Song[] = [
  { title: "Lofi Study Session", artist: "Chill Mind", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Dreamy Focus", artist: "Aesthetic Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Midnight Piano", artist: "Soft Keys", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "Morning Coffee", artist: "Sunrise Vibe", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
];

const NOTE_COLORS = [
  { name: 'Purple', bg: 'bg-candy-purple/10', border: 'border-candy-purple/20', text: 'text-candy-purple' },
  { name: 'Blue', bg: 'bg-candy-blue/10', border: 'border-candy-blue/20', text: 'text-candy-blue' },
  { name: 'Pink', bg: 'bg-candy-pink/10', border: 'border-candy-pink/20', text: 'text-candy-pink' },
  { name: 'Yellow', bg: 'bg-candy-yellow/10', border: 'border-candy-yellow/20', text: 'text-candy-yellow' },
  { name: 'Green', bg: 'bg-candy-green/10', border: 'border-candy-green/20', text: 'text-candy-green' },
];

const ParallaxBackground = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -450]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -800]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 hidden lg:block">
      <motion.div style={{ y: y1, rotate, scale }} className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-candy-pink/5 rounded-full blur-[120px]" />
      <motion.div style={{ y: y2, rotate: -rotate }} className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-candy-blue/5 rounded-full blur-[150px]" />
      <motion.div style={{ y: y3, scale }} className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-candy-purple/5 rounded-full blur-[100px]" />
      <motion.div style={{ y: y4 }} className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] bg-candy-yellow/5 rounded-full blur-[130px]" />
      <motion.div style={{ y: y2 }} className="absolute top-20 left-[10%] text-candy-pink/10 animate-float opacity-40"><Candy size={120} strokeWidth={1} /></motion.div>
      <motion.div style={{ y: y1, animationDelay: '1s' }} className="absolute bottom-40 right-[15%] text-candy-blue/10 animate-float opacity-40"><Clock size={160} strokeWidth={0.5} /></motion.div>
      <motion.div style={{ y: y3, animationDelay: '2s' }} className="absolute top-1/2 right-[5%] text-candy-yellow/10 animate-float opacity-40"><Zap size={80} strokeWidth={1} /></motion.div>
      <motion.div style={{ y: y4, animationDelay: '1.5s' }} className="absolute top-[15%] right-[30%] text-candy-purple/10 animate-float opacity-40"><BookOpen size={100} strokeWidth={0.5} /></motion.div>
      <motion.div style={{ y: y1, animationDelay: '0.5s' }} className="absolute bottom-[10%] left-[20%] text-candy-green/10 animate-float opacity-40"><CheckSquare size={140} strokeWidth={0.5} /></motion.div>
    </div>
  );
};

const StylizedFooter = () => (
  <footer className="mt-20 pb-12 pt-20 border-t border-slate-100/50 relative overflow-hidden">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 footer-text-stylized text-4xl md:text-8xl p-10">
          <span className="text-candy-pink glass-text -rotate-6 animate-liquid">K</span>
          <span className="text-candy-blue glass-text rotate-3 animate-liquid" style={{ animationDelay: '0.5s' }}>E</span>
          <span className="text-candy-purple glass-text -rotate-2 animate-liquid" style={{ animationDelay: '1s' }}>L</span>
          <span className="text-candy-yellow glass-text rotate-6 animate-liquid" style={{ animationDelay: '1.5s' }}>A</span>
          <span className="text-candy-green glass-text -rotate-3 animate-liquid" style={{ animationDelay: '2s' }}>R</span>
          <span className="text-candy-pink glass-text rotate-2 animate-liquid" style={{ animationDelay: '2.5s' }}>.</span>
          <span className="text-candy-blue glass-text -rotate-6 animate-liquid" style={{ animationDelay: '3s' }}>I</span>
          <span className="text-candy-purple glass-text rotate-3 animate-liquid" style={{ animationDelay: '3.5s' }}>N</span>
        </div>
        <div className="text-center space-y-2">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2026 KELAR.IN PRODUCTIVITY NETWORK</p>
        </div>
      </div>
    </div>
  </footer>
);

const CandyCard = ({ children, className = "", title, color = "bg-white" }: { children: React.ReactNode, className?: string, title?: string, color?: string }) => (
  <div className={`glass-candy rounded-3xl p-6 relative transition-all duration-500 hover:scale-[1.02] ${color} dark:bg-slate-900/40 ${className}`}>
    {title && <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-display font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{title}</h3></div>}
    {children}
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick, color = "text-candy-pink" }: { icon: any, label: string, active: boolean, onClick: () => void, color?: string }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-500 group ${active ? 'bg-white dark:bg-slate-800 shadow-sm ' + color : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>
    <Icon size={20} className={active ? color : 'group-hover:scale-110 transition-transform'} />
    <span className="text-sm font-bold">{label}</span>
    {active && <motion.div layoutId="active-pill" className={`ml-auto w-1.5 h-6 rounded-full ${color.replace('text-', 'bg-')}`} />}
  </button>
);

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <img
    src="/assets/kelar.in%20logo-B_o5c9a2.png"
    alt="KELAR.IN Logo"
    className={`${className} object-contain`}
    loading="lazy"
  />
);

const LightSwitch = ({ isOn, onToggle }: { isOn: boolean, onToggle: () => void }) => (
  <div className="flex items-center gap-3">
    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isOn ? 'text-slate-500' : 'text-candy-yellow'}`}>{isOn ? 'Night' : 'Day'}</span>
    <button onClick={onToggle} className={`relative w-16 h-8 rounded-full transition-all duration-500 p-1 flex items-center border-2 ${isOn ? 'bg-slate-900 border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]' : 'bg-candy-yellow/10 border-candy-yellow/20 shadow-[0_4px_12px_rgba(255,215,0,0.1)]'}`}>
      <motion.div animate={{ x: isOn ? 32 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className={`w-6 h-6 rounded-full shadow-lg flex items-center justify-center transition-colors ${isOn ? 'bg-slate-100' : 'bg-white'}`}>
        {isOn ? <Moon size={14} className="text-slate-900" /> : <Sun size={14} className="text-candy-yellow" />}
      </motion.div>
    </button>
  </div>
);

const DrawingCanvas = ({ initialData, onSave, onCancel }: { initialData?: string, onSave: (data: string) => void, onCancel: () => void }) => {
  const [isDrawingNow, setIsDrawingNow] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth * 2; 
      canvas.height = canvas.offsetHeight * 2;
      const ctx = canvas.getContext('2d');
      if (ctx) { 
        ctx.scale(2, 2); 
        ctx.lineCap = 'round'; 
        ctx.strokeStyle = '#be95ff'; 
        ctx.lineWidth = 4; 
        ctxRef.current = ctx; 
        
        if (initialData) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
          };
          img.src = initialData;
        }
      }
    }
  }, [initialData]);

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current; 
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: any) => {
    const { x, y } = getCoordinates(e);
    ctxRef.current?.beginPath(); 
    ctxRef.current?.moveTo(x, y); 
    setIsDrawingNow(true);
  };

  const draw = (e: any) => {
    if (!isDrawingNow) return;
    const { x, y } = getCoordinates(e);
    ctxRef.current?.lineTo(x, y); 
    ctxRef.current?.stroke();
  };

  const stopDrawing = () => { 
    setIsDrawingNow(false); 
    ctxRef.current?.closePath(); 
  };

  const clearCanvas = () => { 
    const canvas = canvasRef.current; 
    if (canvas && ctxRef.current) {
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height); 
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="font-display font-bold text-slate-700">Draw something...</h3>
          <div className="flex gap-2">
            <button onClick={clearCanvas} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><RotateCcw size={20} /></button>
            <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><X size={20} /></button>
          </div>
        </div>
        <div className="flex-1 w-full bg-slate-50 touch-none overflow-hidden relative">
           <canvas 
             ref={canvasRef} 
             onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} 
             onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} 
             className="w-full h-[50vh] cursor-crosshair touch-none block" 
           />
        </div>
        <div className="p-6 bg-slate-50 flex justify-end gap-4 shrink-0">
          <button onClick={onCancel} className="px-6 py-2 font-bold text-slate-400">Cancel</button>
          <button onClick={() => { if(canvasRef.current) onSave(canvasRef.current.toDataURL()); }} className="px-8 py-2 bg-candy-purple text-white rounded-xl font-bold shadow-lg">Save Drawing</button>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  // Persistence
  const [tasks, setTasks] = useState<Task[]>(() => JSON.parse(localStorage.getItem('kelarin_tasks') || '[]'));
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => JSON.parse(localStorage.getItem('kelarin_schedules') || '[]'));
  const [notes, setNotes] = useState<Note[]>(() => JSON.parse(localStorage.getItem('kelarin_notes') || '[]'));
  const [waterIntake, setWaterIntake] = useState<number>(() => Number(localStorage.getItem('kelarin_water') || '0'));
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('kelarin_dark_mode') === 'true');
  const [candyPoints, setCandyPoints] = useState<number>(() => Number(localStorage.getItem('kelarin_points') || '0'));
  const [level, setLevel] = useState<number>(() => Math.floor(Number(localStorage.getItem('kelarin_points') || '0') / 100) + 1);

  useEffect(() => {
    localStorage.setItem('kelarin_tasks', JSON.stringify(tasks));
    localStorage.setItem('kelarin_schedules', JSON.stringify(schedules));
    localStorage.setItem('kelarin_notes', JSON.stringify(notes));
    localStorage.setItem('kelarin_water', waterIntake.toString());
    localStorage.setItem('kelarin_points', candyPoints.toString());
    localStorage.setItem('kelarin_dark_mode', darkMode.toString());
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [tasks, schedules, notes, waterIntake, candyPoints, darkMode]);

  useEffect(() => {
    if (!window?.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setIsReducedMotion(!!mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const [newTask, setNewTask] = useState('');
  
  // NOTES STATE 
  const [newNote, setNewNote] = useState<{title: string, content: string, image?: string, drawing?: string, color?: string}>({ title: '', content: '' });
  const [noteColor, setNoteColor] = useState(NOTE_COLORS[0].bg);
  const [isEditingNote, setIsEditingNote] = useState<string | null>(null);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ title: '', time: '', day: 'Mon', type: 'Study' as const });

  // Quiz State
  const [studyMaterial, setStudyMaterial] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  const [isFlashcardsLoading, setIsFlashcardsLoading] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);

  // Mood Tracker State
  const [moodHistory, setMoodHistory] = useState<{id: string, mood: string, icon: any, color: string, time: string}[]>([]);
  const [currentMood, setCurrentMood] = useState<string | null>(null);

  const moods = [
    { label: 'Happy', icon: Laugh, color: 'text-candy-yellow', bg: 'bg-candy-yellow/10' },
    { label: 'Calm', icon: Smile, color: 'text-candy-green', bg: 'bg-candy-green/10' },
    { label: 'Neutral', icon: Meh, color: 'text-candy-blue', bg: 'bg-candy-blue/10' },
    { label: 'Tired', icon: Frown, color: 'text-candy-purple', bg: 'bg-candy-purple/10' },
    { label: 'Stressed', icon: Angry, color: 'text-candy-pink', bg: 'bg-candy-pink/10' },
  ];

  const addMood = (mood: any) => {
    const newEntry = { id: Math.random().toString(36).substr(2, 9), mood: mood.label, icon: mood.icon, color: mood.color, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMoodHistory([newEntry, ...moodHistory].slice(0, 10));
    setCurrentMood(mood.label);
    setCandyPoints(p => p + 5);
  };

  const [quizScore, setQuizScore] = useState(0);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [isMagicWriting, setIsMagicWriting] = useState(false);
  const [isAnalyzingNote, setIsAnalyzingNote] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // ==========================================
  // MEDIA PLAYER GLOBAL STATE
  // ==========================================
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mediaPlayerMode, setMediaPlayerMode] = useState<'candy'|'youtube'>('candy');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  
  // YT Playlist Player State
  const ytVideoElementRef = useRef<YouTubePlayer | null>(null);
  const [ytPlaylist, setYtPlaylist] = useState<any[]>([]);
  const [ytPlaylistCount, setYtPlaylistCount] = useState<number>(0);
  const [ytActiveItem, setYtActiveItem] = useState<any | null>(null);
  const [ytPlayer, setYtPlayer] = useState<any>(null);
  const [ytStatus, setYtStatus] = useState<number>(0);
  const [ytTime, setYtTime] = useState('00:00');
  const [ytDuration, setYtDuration] = useState(0);
  const [ytCurrentSeconds, setYtCurrentSeconds] = useState(0);
  const [ytLoading, setYtLoading] = useState(false);
  const [ytPlayerLoad, setYtPlayerLoad] = useState(true);

  // Search YT
  const [searchQuery, setSearchQuery] = useState('');
  const [youtubeResults, setYoutubeResults] = useState<Array<{id: string; title: string; channelTitle: string; thumbnail: string}>>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY || "AIzaSyC4mJJQYLGdN6Anr4eQkgNUgN_WVyvGHEk"; 
  const YOUTUBE_PLAYLIST_ID = "PLyOL_RMmwqydRtzTaTuzHc7GCXlAR2aO8"; 

  // ==========================================
  // GLOBAL FOCUS TIMER STATE (DI LIFT-UP)
  // ==========================================
  const [focusDuration, setFocusDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [manualMinutes, setManualMinutes] = useState('25');

  // Menggunakan interval yang aman dari re-render tiap detik
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
             setIsTimerActive(false);
             if (isPlayingMusic) togglePlayPause(); 
             setCandyPoints(p => p + 50); // Award points
             return focusDuration; // Reset ke durasi awal jika habis
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, focusDuration, isPlayingMusic]); 

  const formatTimerTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };


  // --- AUDIO LOGIC ---
  const togglePlayPause = () => {
    const nextState = !isPlayingMusic;
    setIsPlayingMusic(nextState);

    if (mediaPlayerMode === 'candy') {
      if (nextState) audioRef.current?.play();
      else audioRef.current?.pause();
    } else if (mediaPlayerMode === 'youtube') {
      if (ytPlayer) {
        if (nextState) ytPlayer.playVideo();
        else ytPlayer.pauseVideo();
      }
    }
  };

  useEffect(() => {
    if (mediaPlayerMode === 'candy' && audioRef.current) {
      audioRef.current.load();
      if (isPlayingMusic) audioRef.current.play().catch(e => console.log("Audio error:", e));
    }
  }, [currentSongIndex, mediaPlayerMode]);

  // --- YOUTUBE LOGIC ---
  useEffect(() => {
    if (activeTab === 'youtube_music' && ytPlaylist.length === 0) {
      setYtLoading(true);
      fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${youtubeApiKey}&maxResults=50`)
        .then((res) => res.json())
        .then((data) => {
          if (data.items) {
            setYtPlaylist(data.items);
            setYtPlaylistCount(data.pageInfo?.totalResults || data.items.length);
          }
          setYtLoading(false);
        })
        .catch((err) => { console.error(err); setYtLoading(false); });
    }
  }, [activeTab, ytPlaylist.length, youtubeApiKey]);

  const handleYtPlayerReady = (event: any) => {
    ytVideoElementRef.current = event;
    setYtPlayer(event.target);
    setYtPlayerLoad(false);
    event.target.unMute();
    event.target.setVolume(100);
    setYtDuration(event.target.getDuration() || 0);
    
    if (isPlayingMusic && mediaPlayerMode === 'youtube') event.target.playVideo();
  };

  const handleYtPlayerStateChange = (event: any) => {
    setYtStatus(event.data);
    if (event.data === 1) { // Playing
      setIsPlayingMusic(true);
    } else if (event.data === 2) { // Paused
      setIsPlayingMusic(false);
    } else if (event.data === 0) { // Ended
      playNextYt();
    }
  };

  const musicPlayerSetup = (items: any) => {
    if (!items) return;
    setYtActiveItem(items);
    setMediaPlayerMode('youtube');
    setIsPlayingMusic(true); 
    if (audioRef.current) audioRef.current.pause(); // stop internal audio
  };

  const formatSeconds = (seconds: number) => {
    const m = Math.floor(seconds / 60); const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function' && ytStatus === 1) {
        try {
          let current = Math.floor(ytPlayer.getCurrentTime());
          setYtCurrentSeconds(current);
          setYtTime(formatSeconds(current));
        } catch(e) {}
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [ytPlayer, ytStatus]);

  const playPrevYt = () => {
    if (!ytPlaylist.length || !ytActiveItem) return;
    const idx = ytPlaylist.findIndex(item => item.id === ytActiveItem.id);
    if (idx > 0) musicPlayerSetup(ytPlaylist[idx - 1]);
  };

  const playNextYt = () => {
    if (!ytPlaylist.length || !ytActiveItem) return;
    const idx = ytPlaylist.findIndex(item => item.id === ytActiveItem.id);
    if (idx >= 0) musicPlayerSetup(ytPlaylist[(idx + 1) % ytPlaylist.length]);
  };

  const searchYouTubeAPI = async () => {
    if (!youtubeApiKey) { alert('VITE_YOUTUBE_API_KEY tidak ditemukan.'); return; }
    if (!searchQuery.trim()) { alert('Masukkan kata kunci.'); return; }
    setIsSearchLoading(true); setYoutubeResults([]);
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(searchQuery)}&key=${youtubeApiKey}`);
      const data = await response.json();
      if (!data.items) throw new Error(data.error?.message || 'API YouTube gagal');
      const results = data.items.map((item: any) => ({ 
        id: item.id.videoId, 
        title: item.snippet.title, 
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.default.url
      }));
      setYoutubeResults(results);
    } catch (err) { console.error(err); alert('Gagal mencari YouTube.'); } 
    finally { setIsSearchLoading(false); }
  };

  const handleSelectSearchResult = (video: any) => {
    const formattedVideo = {
      id: video.id,
      snippet: {
        resourceId: { videoId: video.id },
        title: video.title,
        videoOwnerChannelTitle: video.channelTitle,
        thumbnails: { default: { url: video.thumbnail }, high: { url: video.thumbnail } },
        position: 0
      }
    };
    setYtPlaylist([formattedVideo, ...ytPlaylist]); // Insert ke antrean
    musicPlayerSetup(formattedVideo);
  };


  // --- AI LOGIC ---
  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput(''); setIsChatLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") { setChatHistory(prev => [...prev, { role: 'model', text: "Waduh Bos, API Key-nya belum diset nih! Coba cek file .env. 🍬" }]); setIsChatLoading(false); return; }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...chatHistory, userMsg].map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        config: { systemInstruction: "You are Kelar.in AI, a helpful and cool student productivity assistant. Keep answers concise! Avoid using symbol star * and **." }
      });
      setChatHistory(prev => [...prev, { role: 'model', text: response.text || "Oops, my candy brain froze!" }]);
    } catch (error) { console.error("Chat failed:", error); } 
    finally { setIsChatLoading(false); }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  const generateFlashcards = async () => {
    if (!studyMaterial.trim() && !uploadedImage) return;
    setIsFlashcardsLoading(true); setFlashcards([]); setCurrentFlashcardIndex(0); setIsFlashcardFlipped(false); setShowFlashcards(true); setQuizQuestions([]); 
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") { alert("API Key belum diset!"); setIsFlashcardsLoading(false); return; }
      const ai = new GoogleGenAI({ apiKey });
      let contents: any;
      if (uploadedImage) contents = { parts: [{ inlineData: { data: uploadedImage.split(',')[1], mimeType: "image/png" } }, { text: `Generate 10 flashcards from image. Return JSON format: array of objects {front, back}.` }] };
      else contents = `Generate 10 flashcards from material. Return JSON format: array of objects {front, back}. Material: ${studyMaterial}`;
      const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents, config: { responseMimeType: "application/json" } });
      setFlashcards(JSON.parse(response.text || "[]"));
    } catch (error) { console.error("Flashcards failed:", error); } 
    finally { setIsFlashcardsLoading(false); }
  };

  const generateQuiz = async () => {
    if (!studyMaterial.trim() && !uploadedImage) return;
    setIsQuizLoading(true); setQuizQuestions([]); setQuizFinished(false); setCurrentQuizIndex(0); setQuizScore(0); setUserAnswers([]);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") { alert("API Key belum diset!"); setIsQuizLoading(false); return; }
      const ai = new GoogleGenAI({ apiKey });
      let contents: any;
      if (uploadedImage) contents = { parts: [{ inlineData: { data: uploadedImage.split(',')[1], mimeType: "image/png" } }, { text: `Generate 5-question quiz from image. Return JSON: array of objects {question, options: [4 strings], correctAnswer: number 0-3, explanation}.` }] };
      else contents = `Generate 5-question quiz. Return JSON: array of objects {question, options: [4 strings], correctAnswer: number 0-3, explanation}. Material: ${studyMaterial}`;
      const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents, config: { responseMimeType: "application/json" } });
      setQuizQuestions(JSON.parse(response.text || "[]"));
    } catch (error) { console.error("Quiz failed:", error); } 
    finally { setIsQuizLoading(false); }
  };

  const generateAINotes = async () => {
    if (!studyMaterial.trim() && !uploadedImage) return;
    setIsNotesLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") { alert("API Key belum diset!"); setIsNotesLoading(false); return; }
      const ai = new GoogleGenAI({ apiKey });
      let contents: any;
      if (uploadedImage) contents = { parts: [{ inlineData: { data: uploadedImage.split(',')[1], mimeType: "image/png" } }, { text: `Summarize into study notes. Return JSON: {title, content}.` }] };
      else contents = `Summarize into study notes. Return JSON: {title, content}. Material: ${studyMaterial}`;
      const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents, config: { responseMimeType: "application/json" } });
      const result = JSON.parse(response.text || "{}");
      setNotes([{ id: Date.now().toString(), title: result.title || "AI Generated Note", content: result.content || "", date: new Date().toLocaleDateString(), color: 'bg-candy-blue/10' }, ...notes]);
      setActiveTab('notes'); alert("Notes berhasil dibuat!");
    } catch (error) { console.error("Notes failed:", error); } 
    finally { setIsNotesLoading(false); }
  };

  const magicWrite = async () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return alert("Kasih judul atau konten dulu!");
    setIsMagicWriting(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") return alert("API Key belum diset!");
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: `Expand these notes. Title: ${newNote.title} Content: ${newNote.content} Return JSON: {title, content}.`, config: { responseMimeType: "application/json" } });
      const result = JSON.parse(response.text || "{}");
      setNewNote(prev => ({ ...prev, title: result.title || prev.title, content: result.content || prev.content }));
    } catch (error) { console.error("Magic write failed:", error); } 
    finally { setIsMagicWriting(false); }
  };

  const analyzeHandwriting = async (imageData: string) => {
    setIsAnalyzingNote(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") return alert("API Key belum diset!");
      
      let mimeType = "image/png";
      const mimeMatch = imageData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/);
      if (mimeMatch && mimeMatch.length > 1) mimeType = mimeMatch[1];

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: { parts: [{ inlineData: { data: imageData.split(',')[1], mimeType } }, { text: "Extract text from image." }] } });
      setNewNote(prev => ({ ...prev, content: prev.content + (prev.content ? "\n\n" : "") + (response.text || "") }));
    } catch (error) { console.error("Handwriting failed:", error); } 
    finally { setIsAnalyzingNote(false); }
  };

  const handleAnswer = (optionIndex: number) => {
    if (showExplanation) return;
    setSelectedOption(optionIndex); setShowExplanation(true);
    if (optionIndex === quizQuestions[currentQuizIndex].correctAnswer) setQuizScore(s => s + 1);
    setUserAnswers([...userAnswers, optionIndex]);
  };

  const nextQuestion = () => {
    setShowExplanation(false); setSelectedOption(null);
    if (currentQuizIndex < quizQuestions.length - 1) setCurrentQuizIndex(currentQuizIndex + 1);
    else setQuizFinished(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name); setUploadedImage(null); setStudyMaterial('');
    const fileType = file.type;

    if (fileType.startsWith('image/')) {
      const reader = new FileReader(); reader.onload = (event) => setUploadedImage(event.target?.result as string); reader.readAsDataURL(file);
    } else if (fileType === 'application/pdf') {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      const reader = new FileReader();
      reader.onload = async (event) => {
        const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
        const pdf = await pdfjs.getDocument(typedarray).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
        }
        setStudyMaterial(fullText);
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const mammoth = (await import('mammoth')).default;
      const reader = new FileReader();
      reader.onload = async (event) => { const result = await mammoth.extractRawText({ arrayBuffer: event.target?.result as ArrayBuffer }); setStudyMaterial(result.value); };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader(); reader.onload = (event) => setStudyMaterial(event.target?.result as string); reader.readAsText(file);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-bg-light bg-candy-mesh selection:bg-candy-pink selection:text-white overflow-hidden">
      {!isReducedMotion && <ParallaxBackground />}
      
      {/* ROOT AUDIO/VIDEO PLAYER DITEMPATKAN DI LUAR SYSTEM TAB */}
      <audio ref={audioRef} src={CANDY_SONGS[currentSongIndex].url} loop />
      <div className="hidden">
         {mediaPlayerMode === 'youtube' && ytActiveItem && (
           <YouTube 
             videoId={ytActiveItem.snippet?.resourceId?.videoId || ytActiveItem.id} 
             opts={{ width: '0', height: '0', playerVars: { autoplay: 1 } }} 
             onReady={handleYtPlayerReady} 
             onStateChange={handleYtPlayerStateChange} 
           />
         )}
      </div>
      
      <header className="h-16 flex-shrink-0 z-50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-b border-white/40 dark:border-white/5 px-4 md:px-8 transition-colors duration-500">
        <div className="h-full max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"><Menu size={24} className="text-slate-600 dark:text-slate-400" /></button>
            <Logo className="w-8 h-8 md:w-10 md:h-10" />
            <span className="text-lg md:text-xl font-display font-bold tracking-tighter text-candy-pink text-glow-candy">KELAR.IN</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <LightSwitch isOn={darkMode} onToggle={() => setDarkMode(!darkMode)} />
            <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl border border-white/40 dark:border-white/5 shadow-sm">
              <Candy className="text-candy-yellow" size={18} />
              <div className="flex flex-col"><span className="hidden md:block text-[8px] font-black text-slate-400 uppercase leading-none">Points</span><span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200 leading-none">{candyPoints}</span></div>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-candy-purple/10 border border-candy-purple/20 flex flex-col items-center justify-center text-candy-purple"><span className="text-[6px] md:text-[8px] font-black uppercase leading-none">Level</span><span className="text-sm md:text-lg font-bold leading-none">{level}</span></div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-candy m-4 rounded-[2.5rem] p-6 flex flex-col gap-8 transition-all duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex md:m-0 md:rounded-none md:bg-transparent md:backdrop-blur-none md:border-r md:border-white/20 dark:md:border-white/5`}>
          <nav className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false)}} color="text-candy-blue" />
            <SidebarItem icon={CheckSquare} label="Tasks" active={activeTab === 'tasks'} onClick={() => {setActiveTab('tasks'); setIsSidebarOpen(false)}} color="text-candy-pink" />
            <SidebarItem icon={CalendarIcon} label="Schedule" active={activeTab === 'schedule'} onClick={() => {setActiveTab('schedule'); setIsSidebarOpen(false)}} color="text-candy-yellow" />
            <SidebarItem icon={BrainCircuit} label="Study Lab" active={activeTab === 'quiz'} onClick={() => {setActiveTab('quiz'); setIsSidebarOpen(false)}} color="text-candy-purple" />
            <SidebarItem icon={Timer} label="Focus" active={activeTab === 'timer'} onClick={() => {setActiveTab('timer'); setIsSidebarOpen(false)}} color="text-candy-blue" />
            <div className="my-2 px-4"><div className="h-px bg-slate-200 dark:bg-slate-800 w-full rounded-full opacity-60"></div></div>
            <SidebarItem icon={BookOpen} label="Notes" active={activeTab === 'notes'} onClick={() => {setActiveTab('notes'); setIsSidebarOpen(false)}} color="text-candy-purple" />
            <SidebarItem icon={MessageSquare} label="AI Chat" active={activeTab === 'chat'} onClick={() => {setActiveTab('chat'); setIsSidebarOpen(false)}} color="text-candy-green" />
            <SidebarItem icon={Smile} label="Mood" active={activeTab === 'mood'} onClick={() => {setActiveTab('mood'); setIsSidebarOpen(false)}} color="text-candy-green" />
            <div className="my-2 px-4"><div className="h-px bg-slate-200 dark:bg-slate-800 w-full rounded-full opacity-60"></div></div>
            <SidebarItem icon={SiYoutubemusic} label="YT Music" active={activeTab === 'youtube_music'} onClick={() => {setActiveTab('youtube_music'); setIsSidebarOpen(false)}} color="text-[#ff0000]" />
            <SidebarItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => {setActiveTab('analytics'); setIsSidebarOpen(false)}} color="text-candy-blue" />
            <SidebarItem icon={Trophy} label="Rewards" active={activeTab === 'rewards'} onClick={() => {setActiveTab('rewards'); setIsSidebarOpen(false)}} color="text-candy-yellow" />
          </nav>
          <div className="mt-auto p-4 bg-candy-blue/10 dark:bg-candy-blue/5 rounded-3xl border border-candy-blue/20 dark:border-candy-blue/10">
            <div className="flex items-center gap-3 mb-2"><Droplets className="text-candy-blue" size={20} /><span className="text-xs font-bold text-candy-blue uppercase tracking-widest">Hydration</span></div>
            <div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-600 dark:text-slate-400">{waterIntake} / 8 glasses</span><button onClick={() => setWaterIntake(w => Math.min(w + 1, 12))} className="w-8 h-8 rounded-full bg-candy-blue text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md"><Plus size={16} /></button></div>
            <div className="mt-2 h-2 w-full bg-white dark:bg-slate-800 rounded-full overflow-hidden"><motion.div animate={{ width: `${(waterIntake / 8) * 100}%` }} className="h-full bg-candy-blue" /></div>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8 relative z-10 overflow-y-auto custom-scrollbar bg-white/20 dark:bg-black/20 transition-colors duration-500 main-content-area">
          <header className="hidden md:flex items-center justify-between mb-12">
            <div className="flex items-center gap-4"><Logo className="w-12 h-12" /><div><h1 className="text-3xl font-display font-bold mb-1 text-slate-800 dark:text-slate-100">Productivity Hub.</h1><p className="text-slate-400 text-sm">Everything is ready for your success!</p></div></div>
          </header>

          {/* FLOATING TIMER WIDGET */}
          <AnimatePresence>
             {isTimerActive && activeTab !== 'timer' && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                  onClick={() => setActiveTab('timer')}
                  className="fixed bottom-6 right-6 z-[90] glass-candy bg-white/90 dark:bg-slate-900/90 rounded-[2rem] p-4 flex items-center gap-4 cursor-pointer hover:scale-105 shadow-2xl border-2 border-candy-blue/50"
                >
                   <div className="relative w-12 h-12 flex items-center justify-center">
                     <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                       <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200 dark:text-slate-700" />
                       <motion.circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125} animate={{ strokeDashoffset: 125 - (125 * (timeLeft / focusDuration)) }} className="text-candy-blue" style={{ strokeLinecap: 'round' }} />
                     </svg>
                     <Timer size={16} className="text-candy-blue" />
                   </div>
                   <div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Focusing</div>
                     <div className="text-xl font-display font-bold text-slate-700 dark:text-slate-200">{formatTimerTime(timeLeft)}</div>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>

          {isDrawing && (
             <DrawingCanvas 
               initialData={newNote.drawing}
               onSave={(dataUrl) => {
                 setNewNote(prev => ({ ...prev, drawing: dataUrl }));
                 setIsDrawing(false);
               }} 
               onCancel={() => setIsDrawing(false)} 
             />
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <CandyCard title="Today's Progress" className="col-span-1 md:col-span-2" color="bg-candy-blue/5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div><div className="text-6xl font-display font-bold mb-2 text-candy-blue">2.4h</div><div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Focus Time Today</div></div>
                      <div className="text-center md:text-right"><div className="text-3xl font-bold text-candy-pink">{tasks.filter(t => t.completed).length} / {tasks.length}</div><div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Tasks Completed</div></div>
                    </div>
                  </CandyCard>
                  <CandyCard title="Hydration Goal" color="bg-candy-blue/5">
                    <div className="text-center"><div className="text-4xl font-display font-bold text-candy-blue mb-2">{waterIntake} <span className="text-lg">glasses</span></div><p className="text-xs text-slate-400 mb-4">Stay fresh, stay smart!</p><button onClick={() => setWaterIntake(0)} className="text-[10px] font-bold text-slate-300 hover:text-candy-blue uppercase tracking-widest">Reset Daily</button></div>
                  </CandyCard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <CandyCard title="Quick Tasks" color="bg-candy-pink/5">
                    <div className="space-y-3 mb-4">
                      {tasks.filter(t => !t.completed).slice(0, 3).map(t => (<div key={t.id} className="flex items-center gap-2 p-2 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/20 dark:border-white/5"><div className="w-2 h-2 rounded-full bg-candy-pink" /><span className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">{t.text}</span></div>))}
                      {tasks.filter(t => !t.completed).length === 0 && <p className="text-xs text-slate-400 italic">No pending tasks!</p>}
                    </div>
                    <button onClick={() => setActiveTab('tasks')} className="w-full py-2 bg-candy-pink/10 text-candy-pink rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-candy-pink/20 transition-colors flex items-center justify-center gap-2">Manage Tasks <ArrowRight size={14} /></button>
                  </CandyCard>

                  <CandyCard title="Focus Room" color="bg-candy-green/5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex -space-x-2">{[4,5,6].map(i => (<div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img loading="lazy" src={`https://picsum.photos/seed/user${i}/32/32`} alt="user" referrerPolicy="no-referrer" /></div>))}</div>
                      <div><div className="text-lg font-bold text-slate-700 dark:text-slate-200">Live Room</div><div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Studying Now</div></div>
                    </div>
                    <button onClick={() => setActiveTab('timer')} className="w-full py-2 bg-candy-green/10 text-candy-green rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-candy-green/20 transition-colors flex items-center justify-center gap-2">Join Session <ArrowRight size={14} /></button>
                  </CandyCard>

                  <CandyCard title="Productivity" color="bg-candy-blue/5">
                    <div className="h-24 mb-4 min-h-[96px]">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={undefined}><BarChart data={[{ name: 'M', v: 40 }, { name: 'T', v: 70 }, { name: 'W', v: 50 }, { name: 'T', v: 90 }, { name: 'F', v: 60 }]}><Bar dataKey="v" fill="#7ec8e3" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
                    </div>
                    <button onClick={() => setActiveTab('analytics')} className="w-full py-2 bg-candy-blue/10 text-candy-blue rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-candy-blue/20 transition-colors flex items-center justify-center gap-2">View Insights <ArrowRight size={14} /></button>
                  </CandyCard>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <CandyCard title="Focus Music" color="bg-candy-purple/5">
                    <div className="grid grid-cols-1 gap-6">
                      
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <button onClick={() => setMediaPlayerMode('candy')} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${mediaPlayerMode === 'candy' ? 'bg-candy-blue text-white' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>Playlist KELAR.IN</button>
                        <button onClick={() => { setMediaPlayerMode('youtube'); setActiveTab('youtube_music'); }} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${mediaPlayerMode === 'youtube' ? 'bg-candy-green text-white' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>Cari Lagu di YT</button>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-candy-purple flex items-center justify-center text-white shadow-lg shrink-0">
                          {mediaPlayerMode === 'candy' ? <MusicIcon size={32} /> : <SiYoutubemusic size={32} />}
                        </div>
                        <div className="flex-1 text-center md:text-left w-full">
                          {mediaPlayerMode === 'candy' ? (
                             <>
                               <h4 className="font-bold text-lg text-slate-700 dark:text-slate-200">{CANDY_SONGS[currentSongIndex].title}</h4>
                               <p className="text-sm text-slate-400">{CANDY_SONGS[currentSongIndex].artist}</p>
                             </>
                          ) : (
                            <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/70 border border-white/40 dark:border-white/10 w-full shadow-sm">
                              {ytActiveItem ? (
                                <div>
                                  <div className="text-xs font-bold mb-2 text-slate-500 uppercase tracking-widest text-center">Memutar YouTube Music:</div>
                                  <div className="text-sm font-bold text-slate-600 dark:text-slate-300 line-clamp-1 text-center mb-1">{ytActiveItem.snippet?.title || ytActiveItem.title}</div>
                                  <div className="text-xs text-slate-400 text-center mb-2">{ytTime} / {ytDuration ? formatSeconds(ytDuration) : "0:00"}</div>
                                </div>
                              ) : (
                                <div className="text-xs text-slate-500 text-center p-2">Buka Tab "YT Music" untuk mencari lagu.</div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center gap-4 shrink-0">
                          {mediaPlayerMode === 'candy' ? (
                            <>
                              <button onClick={() => setCurrentSongIndex(i => (i - 1 + CANDY_SONGS.length) % CANDY_SONGS.length)} className="p-3 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-400"><SkipBack size={24} /></button>
                              <button onClick={togglePlayPause} className="w-14 h-14 rounded-full bg-candy-purple text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                {isPlayingMusic ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                              </button>
                              <button onClick={() => setCurrentSongIndex(i => (i + 1) % CANDY_SONGS.length)} className="p-3 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-400"><SkipForward size={24} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={playPrevYt} className="p-3 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-400"><SkipBack size={24} /></button>
                              <button onClick={togglePlayPause} className="w-14 h-14 rounded-full bg-candy-purple text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                {isPlayingMusic ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                              </button>
                              <button onClick={playNextYt} className="p-3 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-400"><SkipForward size={24} /></button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CandyCard>
                </div>
              </motion.div>
            )}

            {/* TAB YOUTUBE MUSIC */}
            {activeTab === 'youtube_music' && (
              <motion.div key="youtube_music" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-slate-800 dark:text-slate-100">YouTube Music</h1>
                  <p className="mt-2 text-slate-500">Cari lagu favorit kamu atau dengarkan playlist KELAR.IN!</p>
                </div>

                <div className="flex gap-2">
                  <input 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && searchYouTubeAPI()} 
                    placeholder="Cari lagu di YouTube (contoh: Lofi Girl)" 
                    className="flex-1 rounded-2xl px-6 py-4 border border-white/40 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 shadow-sm text-slate-700 dark:text-slate-200 outline-none focus:border-candy-pink" 
                  />
                  <button onClick={searchYouTubeAPI} className="px-6 rounded-2xl bg-candy-pink text-white font-bold shadow-md hover:scale-105 transition-transform">Cari</button>
                </div>

                {isSearchLoading && <div className="text-center p-4"><Loader2 className="animate-spin text-candy-pink mx-auto" size={32} /></div>}
                
                {youtubeResults.length > 0 && (
                  <div className="glass-candy rounded-[2rem] p-6 bg-white/40 dark:bg-slate-900/40">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Hasil Pencarian:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                      {youtubeResults.map(item => (
                        <button key={item.id} onClick={() => handleSelectSearchResult(item)} className="w-full text-left rounded-xl p-3 bg-white dark:bg-slate-800 hover:bg-candy-purple/10 dark:hover:bg-candy-purple/20 transition-all border border-transparent shadow-sm flex items-center gap-4">
                          <img src={item.thumbnail} className="w-16 h-12 rounded object-cover" alt="thumb" />
                          <div className="flex-1">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1">{item.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'")}</span>
                            <span className="text-xs text-slate-500 line-clamp-1">{item.channelTitle}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  <button aria-label="Play all songs" onClick={() => { if(ytPlaylist.length) musicPlayerSetup(ytPlaylist[Math.floor(Math.random() * ytPlaylist.length)]); }} className="flex items-center rounded-xl bg-candy-purple text-white px-6 py-3 font-bold shadow-lg hover:scale-105 transition-transform">
                    <BsPlayFill className="text-3xl mr-2" /> Shuffle Play
                  </button>
                  <a href={`https://music.youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`} className="flex items-center rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-6 py-3 font-bold shadow-sm hover:bg-slate-50 transition-colors" target="_blank" rel="noreferrer">
                    <MdPlaylistPlay className="text-3xl mr-2 text-candy-blue" />
                    <div className="block">
                      <p className="text-sm">View playlist</p>
                      <p className="text-[10px] text-slate-400">YouTube Music</p>
                    </div>
                  </a>
                </div>

                {ytActiveItem && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-candy rounded-[2rem] p-6 bg-white/60 dark:bg-slate-900/60 flex flex-col md:flex-row items-center gap-6 relative shadow-xl overflow-hidden">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-lg shrink-0 border-4 border-white dark:border-slate-800 relative">
                       <img className="w-full h-full object-cover" src={ytActiveItem.snippet?.thumbnails?.high?.url || ytActiveItem.snippet?.thumbnails?.standard?.url || ytActiveItem.snippet?.thumbnails?.default?.url} alt="thumbnail" />
                       <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <SiYoutubemusic size={40} className="text-white/80 drop-shadow-md" />
                       </div>
                    </div>

                    <div className="flex-1 w-full text-center md:text-left">
                      <div className="mb-4 pr-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                          {ytActiveItem.snippet?.title?.split(/[\[(]/)[0] || "Unknown Title"}
                        </h2>
                        <p className="text-slate-500 font-medium">
                          {ytActiveItem.snippet?.videoOwnerChannelTitle?.replace(/ - Topic/g, " ") || "Unknown Artist"}
                        </p>
                      </div>

                      {/* Slider Progress */}
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-xs font-bold text-slate-400 w-10 text-right">{ytTime || "0:00"}</span>
                        <input 
                           type="range" min="0" max={ytDuration} value={ytCurrentSeconds} 
                           onChange={(x) => { 
                             const newTime = Number(x.target.value);
                             setYtTime(formatSeconds(newTime)); 
                             ytPlayer?.seekTo(newTime); 
                           }} 
                           className="flex-1 h-2 rounded-full accent-candy-purple bg-slate-200 dark:bg-slate-700 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-candy-purple [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-400 w-10 text-left">
                           {ytDuration ? formatSeconds(ytDuration) : "0:00"}
                        </span>
                      </div>

                      {/* Kontrol */}
                      <div className="flex items-center justify-center md:justify-start gap-6">
                        <button onClick={playPrevYt} className="text-slate-400 hover:text-candy-blue transition-colors">
                          <BsFillSkipStartFill size={32} />
                        </button>
                        <button onClick={togglePlayPause} className="w-16 h-16 rounded-full bg-candy-purple text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                          {ytPlayerLoad ? <Loader2 className="animate-spin" size={24} /> : (isPlayingMusic ? <BsPauseFill size={36} /> : <BsPlayFill size={36} className="ml-1" />)}
                        </button>
                        <button onClick={playNextYt} className="text-slate-400 hover:text-candy-blue transition-colors">
                          <BsSkipEndFill size={32} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Daftar Lagu */}
                <div className="glass-candy rounded-[2rem] p-6 bg-white/40 dark:bg-slate-900/40 mt-8">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-6 flex items-center gap-2"><MdPlaylistPlay size={24} className="text-candy-purple" /> Antrean Playlist</h3>
                  
                  {ytLoading || ytPlaylist.length === 0 ? (
                    <Skeleton count={5} borderRadius="10px" height="60px" baseColor="#e2e8f0" highlightColor="#f8fafc" className="my-2 opacity-50 dark:opacity-10" />
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {ytPlaylist.map((items, index) => {
                        const isPlayingNow = ytActiveItem && (ytActiveItem.id?.videoId || ytActiveItem.id) === (items.id?.videoId || items.id);
                        return (
                          <button
                            key={items.id + index}
                            onClick={() => musicPlayerSetup(items)}
                            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group border border-transparent ${isPlayingNow ? 'bg-candy-purple/10 border-candy-purple/30 shadow-sm' : 'hover:bg-white dark:hover:bg-slate-800'}`}
                          >
                            <div className="w-8 flex justify-center text-slate-400 font-bold">
                              {isPlayingNow ? (
                                isPlayingMusic ? (
                                  <div className="flex items-end h-4 gap-[2px]">
                                    <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-candy-purple rounded-t-sm" />
                                    <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 bg-candy-purple rounded-t-sm" />
                                    <motion.div animate={{ height: [6, 14, 6] }} transition={{ repeat: Infinity, duration: 1.0 }} className="w-1 bg-candy-purple rounded-t-sm" />
                                  </div>
                                ) : (
                                  <div className="flex items-end h-4 gap-[2px]">
                                    <div className="w-1 h-1 bg-candy-purple rounded-sm" />
                                    <div className="w-1 h-1 bg-candy-purple rounded-sm" />
                                    <div className="w-1 h-1 bg-candy-purple rounded-sm" />
                                  </div>
                                )
                              ) : (
                                <span className="group-hover:hidden">{items.snippet?.position !== undefined ? items.snippet.position + 1 : index + 1}</span>
                              )}
                              {!isPlayingNow && <BsPlayFill className="hidden group-hover:block text-candy-purple text-xl" />}
                            </div>

                            <img src={items.snippet?.thumbnails?.default?.url} className="w-12 h-12 rounded-lg object-cover shadow-sm bg-slate-200 dark:bg-slate-700" alt="" />

                            <div className="flex-1 text-left">
                              <h4 className={`font-bold line-clamp-1 ${isPlayingNow ? 'text-candy-purple' : 'text-slate-700 dark:text-slate-200'}`}>
                                {items.snippet?.title?.split(/[\[(]/)[0] || 'Unknown'}
                              </h4>
                              <p className="text-xs text-slate-500 truncate">
                                {items.snippet?.videoOwnerChannelTitle?.replace(/ - Topic/g, " ") || ''}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div key="tasks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto">
                <div className="flex gap-4 mb-8">
                  <input value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (setTasks([{id: Date.now().toString(), text: newTask, completed: false, category: 'Study'}, ...tasks]), setNewTask(''))} placeholder="Add a task..." className="flex-1 glass-candy px-6 py-4 rounded-3xl outline-none focus:border-candy-pink/50 text-slate-700" />
                  <button onClick={() => (setTasks([{id: Date.now().toString(), text: newTask, completed: false, category: 'Study'}, ...tasks]), setNewTask(''))} className="bg-candy-pink text-white p-4 rounded-3xl shadow-lg hover:scale-105 transition-transform"><Plus size={24} /></button>
                </div>
                <div className="space-y-4">
                  {tasks.map(t => (
                    <div key={t.id} className="glass-candy p-5 rounded-3xl flex items-center justify-between group bg-white/50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-4">
                        <button onClick={() => { const isCompleting = !t.completed; setTasks(tasks.map(x => x.id === t.id ? {...x, completed: isCompleting} : x)); if (isCompleting) setCandyPoints(p => p + 10); }} className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${t.completed ? 'bg-candy-pink border-candy-pink' : 'border-slate-200 dark:border-slate-700 hover:border-candy-pink'}`}>{t.completed && <CheckCircle2 size={16} className="text-white" />}</button>
                        <span className={`text-lg font-medium ${t.completed ? 'line-through text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-200'}`}>{t.text}</span>
                      </div>
                      <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20} /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto h-[70vh] flex flex-col glass-candy rounded-[2.5rem] overflow-hidden bg-white/30 dark:bg-slate-900/30">
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {chatHistory.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-[1.5rem] font-medium ${m.role === 'user' ? 'bg-candy-green text-slate-700 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm'}`}>{m.text}</div>
                    </div>
                  ))}
                  {isChatLoading && <div className="flex justify-start"><div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-[1.5rem] animate-pulse text-slate-400">Thinking...</div></div>}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-4 bg-white/50 dark:bg-slate-900/50 border-t border-white/40 dark:border-white/5 flex gap-4">
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask Kelar AI something..." className="flex-1 bg-white dark:bg-slate-800 rounded-2xl px-6 outline-none border border-transparent focus:border-candy-green text-slate-700 dark:text-slate-200" />
                  <button onClick={sendMessage} className="bg-candy-green text-slate-700 p-4 rounded-2xl hover:scale-105 transition-transform shadow-md"><Send size={20} /></button>
                </div>
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <AnimatePresence>
                  {isNoteEditorOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsNoteEditorOpen(false); setIsEditingNote(null); setNewNote({title: '', content: ''}); setNoteColor(NOTE_COLORS[0].bg); }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                      <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className={`relative w-full max-w-xl h-[85vh] translate-y-8 flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden bg-white dark:bg-slate-900 border border-white/40 dark:border-white/5 transition-colors duration-500`}>
                        <div className={`h-2 w-full ${noteColor.replace('/10', '')} shrink-0`} />
                        <div className="h-16 border-b border-black/5 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
                          <div className="flex items-center gap-1">
                            <div className="flex bg-white/50 dark:bg-slate-800/50 p-1 rounded-xl gap-0.5"><button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"><Type size={18} /></button><button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"><Pen size={18} /></button></div>
                            <div className="w-px h-6 bg-black/5 mx-2" />
                            <div className="relative group">
                              <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-2"><Palette size={18} /></button>
                              <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-white/5 hidden group-hover:flex gap-2 z-10">
                                {NOTE_COLORS.map(c => <button key={c.bg} onClick={() => setNoteColor(c.bg)} className={`w-6 h-6 rounded-full ${c.bg} border-2 ${noteColor === c.bg ? 'border-slate-800 dark:border-white' : 'border-transparent'} transition-all hover:scale-110`} />)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => { if (isEditingNote) { setNotes(notes.map(n => n.id === isEditingNote ? {...n, ...newNote, color: noteColor} : n)); setIsEditingNote(null); } else { setNotes([{id: Date.now().toString(), ...newNote, date: new Date().toLocaleDateString(), color: noteColor}, ...notes]); } setNewNote({title: '', content: ''}); setIsNoteEditorOpen(false); }} className="px-5 py-2 bg-candy-purple text-white rounded-xl font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all">Save</button>
                            <button onClick={() => { setIsNoteEditorOpen(false); setIsEditingNote(null); setNewNote({title: '', content: ''}); setNoteColor(NOTE_COLORS[0].bg); }} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl text-slate-400 transition-all"><X size={20} /></button>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                          <input value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} placeholder="Note Title" className="w-full text-2xl font-display font-bold mb-6 outline-none border-none bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-700" />
                          <div className="relative min-h-[400px]">
                            <textarea value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})} placeholder="Start typing your thoughts..." className="w-full h-full min-h-[400px] text-base leading-relaxed outline-none border-none bg-transparent text-slate-600 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 resize-none" />
                            {(isAnalyzingNote || isMagicWriting) && (<div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-2xl"><div className="bg-white/90 dark:bg-slate-800 p-6 rounded-3xl shadow-xl flex flex-col items-center gap-3 border border-white/50 dark:border-white/5"><Loader2 className="animate-spin text-candy-purple w-8 h-8" /><span className="text-xs font-black text-candy-purple uppercase tracking-[0.2em]">AI Processing</span></div></div>)}
                            <div className="space-y-4 mt-6">
                              {newNote.image && (<div className="relative group"><img src={newNote.image} alt="note" className="w-full rounded-2xl border border-white/40 shadow-sm" /><button onClick={() => setNewNote({...newNote, image: undefined})} className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500"><X size={14} /></button></div>)}
                              {newNote.drawing && (<div className="relative group"><img src={newNote.drawing} alt="drawing" className="w-full bg-white/50 rounded-2xl border border-white/40 shadow-sm cursor-pointer" onClick={() => setIsDrawing(true)} /><button onClick={() => setNewNote({...newNote, drawing: undefined})} className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500"><X size={14} /></button></div>)}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border-t border-black/5 flex flex-wrap items-center justify-between gap-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shrink-0">
                          <div className="flex items-center gap-2">
                            <button onClick={magicWrite} className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-candy-purple rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all hover:scale-105"><Zap size={14} /> Magic</button>
                            <label className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-candy-blue rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm cursor-pointer transition-all hover:scale-105">
                              <Sparkles size={14} /> Scan
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => { 
                                const file = e.target.files?.[0]; 
                                if (file) { 
                                  const reader = new FileReader(); 
                                  reader.onload = (ev) => {
                                    const imgData = ev.target?.result as string;
                                    setNewNote(prev => ({...prev, image: imgData}));
                                    analyzeHandwriting(imgData); 
                                  };
                                  reader.readAsDataURL(file); 
                                } 
                              }} />
                            </label>
                            <button onClick={() => setIsDrawing(true)} className="p-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-candy-pink rounded-xl shadow-sm transition-all hover:scale-105"><Pen size={18} /></button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">My Notes</h2>
                    <p className="text-slate-400 text-sm">Capture your thoughts and study materials.</p>
                  </div>
                  <button onClick={() => { setNewNote({ title: '', content: '' }); setIsEditingNote(null); setNoteColor(NOTE_COLORS[0].bg); setIsNoteEditorOpen(true); }} className="px-6 py-3 bg-candy-purple text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                    <Plus size={20} /> New Note
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {notes.map(n => (
                    <CandyCard key={n.id} color={n.color} className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-lg text-slate-700 line-clamp-1">{n.title || "Untitled Note"}</h4>
                        <div className="flex gap-2">
                          <button onClick={() => { setIsEditingNote(n.id); setNewNote({title: n.title, content: n.content, image: n.image, drawing: n.drawing}); setNoteColor(n.color || NOTE_COLORS[0].bg); setIsNoteEditorOpen(true); }} className="text-slate-300 hover:text-candy-blue transition-colors"><Edit3 size={18} /></button>
                          <button onClick={() => setNotes(notes.filter(x => x.id !== n.id))} className="text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      {n.image && <img src={n.image} alt="note" className="w-full h-32 object-cover rounded-xl mb-4 border border-black/5" />}
                      {n.drawing && <img src={n.drawing} alt="drawing" className="w-full h-32 object-contain bg-white rounded-xl mb-4 border border-black/5" />}
                      <p className="text-sm text-slate-500 line-clamp-6 mb-6 flex-1">{n.content}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{n.date}</span>
                        <div className="flex gap-1">
                          {n.image && <Upload size={12} className="text-slate-200" />}
                          {n.drawing && <Pen size={12} className="text-slate-200" />}
                        </div>
                      </div>
                    </CandyCard>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'schedule' && (
              <motion.div key="schedule" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">Weekly Schedule</h2>
                    <p className="text-slate-400 text-sm">Plan your success, one hour at a time.</p>
                  </div>
                  <button onClick={() => setIsAddingSchedule(!isAddingSchedule)} className="px-6 py-3 bg-candy-yellow text-slate-700 font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                    {isAddingSchedule ? <X size={20} /> : <Plus size={20} />} {isAddingSchedule ? 'Cancel' : 'Add Event'}
                  </button>
                </div>

                <AnimatePresence>
                  {isAddingSchedule && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="glass-candy p-6 rounded-[2rem] mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 bg-white/50">
                        <input value={scheduleForm.title} onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})} placeholder="Event Title" className="bg-white rounded-xl px-4 py-3 outline-none border border-transparent focus:border-candy-yellow text-slate-700" />
                        <input type="time" value={scheduleForm.time} onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} className="bg-white rounded-xl px-4 py-3 outline-none border border-transparent focus:border-candy-yellow text-slate-700" />
                        <select value={scheduleForm.day} onChange={e => setScheduleForm({...scheduleForm, day: e.target.value})} className="bg-white rounded-xl px-4 py-3 outline-none border border-transparent focus:border-candy-yellow text-slate-700">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select value={scheduleForm.type} onChange={e => setScheduleForm({...scheduleForm, type: e.target.value as any})} className="bg-white rounded-xl px-4 py-3 outline-none border border-transparent focus:border-candy-yellow text-slate-700">
                          {['Class', 'Study', 'Exam', 'Break'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <button onClick={() => { if (scheduleForm.title && scheduleForm.time) { setSchedules([...schedules, { id: Date.now().toString(), ...scheduleForm }]); setScheduleForm({ title: '', time: '', day: scheduleForm.day, type: 'Study' }); setIsAddingSchedule(false); } }} className="bg-candy-yellow text-slate-700 font-bold rounded-xl py-3 shadow-md hover:bg-candy-yellow/80 transition-colors">
                          Save Event
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="space-y-4">
                      <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center py-2 bg-white/30 dark:bg-slate-800/30 rounded-xl">{day}</div>
                      <div className="min-h-[100px] flex flex-col gap-3">
                        {schedules.filter(s => s.day === day).sort((a,b) => a.time.localeCompare(b.time)).map(s => (
                          <motion.div layout key={s.id} className={`glass-candy p-4 rounded-2xl border-l-4 relative group bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all ${ s.type === 'Class' ? 'border-l-candy-blue' : s.type === 'Exam' ? 'border-l-candy-pink' : s.type === 'Break' ? 'border-l-candy-green' : 'border-l-candy-yellow' }`}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate pr-4">{s.title}</div>
                              <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${ s.type === 'Class' ? 'bg-candy-blue/10 text-candy-blue' : s.type === 'Exam' ? 'bg-candy-pink/10 text-candy-pink' : s.type === 'Break' ? 'bg-candy-green/10 text-candy-green' : 'bg-candy-yellow/10 text-candy-yellow' }`}>{s.type}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1"><Clock size={10} /> {s.time}</div>
                            <button onClick={() => setSchedules(schedules.filter(x => x.id !== s.id))} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'quiz' && (
              <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
                {!quizQuestions.length && !isQuizLoading && (
                  <div className="space-y-8">
                    <div className="text-center mb-12">
                      <div className="w-20 h-20 bg-candy-purple/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-candy-purple"><BrainCircuit size={48} /></div>
                      <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">AI Study Lab</h2>
                      <p className="text-slate-400 dark:text-slate-500">Upload your material and let AI test your knowledge!</p>
                    </div>

                    <CandyCard color="bg-white/50 dark:bg-slate-900/50">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-candy-purple"><FileText size={20} /><span className="text-sm font-bold uppercase tracking-widest">Study Material</span></div>
                          <div className="flex gap-2">
                            <label className="cursor-pointer px-4 py-2 bg-white dark:bg-slate-800 text-candy-purple border border-candy-purple/20 rounded-xl text-xs font-bold hover:bg-candy-purple/5 transition-colors flex items-center gap-2">
                              <Upload size={14} /> Upload File
                              <input type="file" accept=".txt,.md,.pdf,.docx,.doc,.pptx,.jpg,.jpeg,.png,.svg" className="hidden" onChange={handleFileUpload} />
                            </label>
                          </div>
                        </div>
                        <textarea value={studyMaterial} onChange={(e) => setStudyMaterial(e.target.value)} placeholder="Paste your notes here or upload a file..." className="w-full h-64 bg-white dark:bg-slate-800 rounded-2xl p-6 outline-none border border-transparent focus:border-candy-purple text-slate-700 dark:text-slate-200 resize-none shadow-inner" />
                        {fileName && (
                          <div className="flex items-center gap-2 p-3 bg-candy-purple/5 rounded-xl border border-candy-purple/10"><FileText size={18} className="text-candy-purple" /><span className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate max-w-xs">{fileName}</span></div>
                        )}
                        <div className="flex flex-wrap justify-end gap-4">
                          <button onClick={generateFlashcards} disabled={!studyMaterial.trim() && !uploadedImage || isFlashcardsLoading} className="px-6 py-4 bg-white dark:bg-slate-800 text-candy-pink border border-candy-pink/20 rounded-2xl font-bold flex items-center gap-2 shadow-sm hover:bg-candy-pink/5 transition-all disabled:opacity-50">
                            {isFlashcardsLoading ? <Loader2 size={20} className="animate-spin" /> : <Layers size={20} />} Generate Flashcards
                          </button>
                          <button onClick={generateAINotes} disabled={!studyMaterial.trim() && !uploadedImage || isNotesLoading} className="px-6 py-4 bg-white dark:bg-slate-800 text-candy-blue border border-candy-blue/20 rounded-2xl font-bold flex items-center gap-2 shadow-sm hover:bg-candy-blue/5 transition-all disabled:opacity-50">
                            {isNotesLoading ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />} Generate Notes
                          </button>
                          <button onClick={generateQuiz} disabled={!studyMaterial.trim() && !uploadedImage || isQuizLoading} className="px-8 py-4 bg-candy-purple text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all disabled:opacity-50">
                            {isQuizLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />} Generate Quiz
                          </button>
                        </div>
                      </div>
                    </CandyCard>
                  </div>
                )}

                {isQuizLoading && (<div className="flex flex-col items-center justify-center py-20 space-y-6"><Loader2 className="w-12 h-12 text-candy-purple animate-spin" /><h3 className="text-xl font-bold text-slate-700">AI is reading your material...</h3></div>)}
                {isFlashcardsLoading && (<div className="flex flex-col items-center justify-center py-20 space-y-6"><Loader2 className="w-12 h-12 text-candy-pink animate-spin" /><h3 className="text-xl font-bold text-slate-700">AI is creating your flashcards...</h3></div>)}

                {flashcards.length > 0 && showFlashcards && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between mb-8">
                      <button onClick={() => setShowFlashcards(false)} className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2"><SkipBack size={16} /> Back to Lab</button>
                      <h3 className="font-bold text-slate-700">Card {currentFlashcardIndex + 1} of {flashcards.length}</h3>
                    </div>

                    <div className="flex justify-center">
                      <motion.div key={currentFlashcardIndex} initial={{ opacity: 0, rotateY: -180 }} animate={{ opacity: 1, rotateY: isFlashcardFlipped ? 180 : 0 }} transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }} onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)} className="relative w-full max-w-md h-80 cursor-pointer preserve-3d">
                        <div className={`absolute inset-0 backface-hidden glass-candy p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl flex flex-col items-center justify-center text-center border-b-8 border-candy-pink ${isFlashcardFlipped ? 'hidden' : 'flex'}`}>
                          <div className="text-xs font-bold text-candy-pink uppercase tracking-[0.2em] mb-4">Front</div>
                          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{flashcards[currentFlashcardIndex].front}</h2>
                          <div className="mt-8 text-slate-400 text-xs font-bold animate-pulse">Click to flip</div>
                        </div>
                        <div className={`absolute inset-0 backface-hidden glass-candy p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl flex flex-col items-center justify-center text-center border-b-8 border-candy-blue [transform:rotateY(180deg)] ${isFlashcardFlipped ? 'flex' : 'hidden'}`}>
                          <div className="text-xs font-bold text-candy-blue uppercase tracking-[0.2em] mb-4">Back</div>
                          <p className="text-xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed">{flashcards[currentFlashcardIndex].back}</p>
                          <div className="mt-8 text-slate-400 text-xs font-bold animate-pulse">Click to flip back</div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="flex justify-center gap-6">
                      <button onClick={() => { setCurrentFlashcardIndex(prev => Math.max(0, prev - 1)); setIsFlashcardFlipped(false); }} disabled={currentFlashcardIndex === 0} className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-md disabled:opacity-30"><SkipBack size={24} className="text-slate-600 dark:text-slate-300" /></button>
                      <button onClick={() => { if (currentFlashcardIndex < flashcards.length - 1) { setCurrentFlashcardIndex(prev => prev + 1); setIsFlashcardFlipped(false); } else { setShowFlashcards(false); setFlashcards([]); } }} className="px-8 py-4 bg-candy-pink text-white rounded-2xl font-bold shadow-lg flex items-center gap-2">{currentFlashcardIndex < flashcards.length - 1 ? 'Next Card' : 'Finish Session'}<SkipForward size={20} /></button>
                    </div>
                  </div>
                )}

                {quizQuestions.length > 0 && !quizFinished && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-bold text-slate-700">Question {currentQuizIndex + 1} of {quizQuestions.length}</h3>
                      <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Score: {quizScore}</div>
                    </div>

                    <motion.div key={currentQuizIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-candy p-8 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 shadow-xl">
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 leading-tight">{quizQuestions[currentQuizIndex].question}</h2>
                      <div className="grid grid-cols-1 gap-4">
                        {quizQuestions[currentQuizIndex].options.map((option, idx) => (
                          <button key={idx} onClick={() => handleAnswer(idx)} disabled={showExplanation} className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${ showExplanation ? idx === quizQuestions[currentQuizIndex].correctAnswer ? 'border-candy-green bg-candy-green/10 dark:bg-candy-green/20' : idx === selectedOption ? 'border-candy-pink bg-candy-pink/10 dark:bg-candy-pink/20' : 'border-slate-50 dark:border-slate-800 opacity-50' : 'border-slate-50 dark:border-slate-800 hover:border-candy-purple hover:bg-candy-purple/5' }`}>
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">{String.fromCharCode(65 + idx)}</div>
                            <span className="font-medium text-slate-700 dark:text-slate-200">{option}</span>
                          </button>
                        ))}
                      </div>

                      {showExplanation && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                          <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Explanation</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{quizQuestions[currentQuizIndex].explanation}</p>
                          <button onClick={nextQuestion} className="w-full mt-6 py-3 bg-slate-800 dark:bg-candy-purple text-white rounded-xl font-bold">{currentQuizIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}</button>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                )}

                {quizFinished && (
                  <div className="text-center py-12">
                    <Trophy size={64} className="text-candy-yellow mx-auto mb-6" />
                    <h2 className="text-4xl font-display font-bold text-slate-800 dark:text-slate-100 mb-2">Quiz Complete!</h2>
                    <div className="text-6xl font-display font-bold text-candy-purple mb-8">{Math.round((quizScore / quizQuestions.length) * 100)}%</div>
                    <button onClick={() => {setQuizQuestions([]); setQuizFinished(false);}} className="px-8 py-4 bg-candy-purple text-white rounded-2xl font-bold shadow-lg">Try Another Material</button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'timer' && (
              <motion.div key="timer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <div className="flex flex-col items-center justify-center py-12">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 glass-candy px-6 py-3 rounded-2xl flex items-center gap-4 bg-white/50 border border-white/40">
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src={`https://picsum.photos/seed/user${i}/32/32`} alt="user" referrerPolicy="no-referrer" /></div>)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">Live Focus Room</span>
                        <span className="text-[10px] text-candy-green font-bold uppercase tracking-widest flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-candy-green animate-pulse" />Learning with you now</span>
                      </div>
                    </motion.div>

                    <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
                      {[15, 25, 45, 60].map(mins => (
                        <button key={mins} onClick={() => { const secs = mins * 60; setFocusDuration(secs); setTimeLeft(secs); setIsTimerActive(false); setManualMinutes(mins.toString()); }} className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${focusDuration === mins * 60 ? 'bg-candy-blue text-white shadow-md' : 'bg-white text-slate-400 hover:bg-candy-blue/5'}`}>{mins}m</button>
                      ))}
                      <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
                      <div className="flex items-center gap-2 glass-candy p-1.5 rounded-xl bg-white/50 border border-white/40">
                        <input type="number" value={manualMinutes} onChange={(e) => setManualMinutes(e.target.value)} className="w-12 bg-transparent text-center font-bold text-slate-700 outline-none text-sm" min="1" max="999" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">min</span>
                        <button onClick={() => { const mins = parseInt(manualMinutes); if (mins > 0) { const secs = mins * 60; setFocusDuration(secs); setTimeLeft(secs); setIsTimerActive(false); } }} className="bg-candy-blue text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-sm">Set</button>
                      </div>
                    </div>

                    <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                        <motion.circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={880} animate={{ strokeDashoffset: 880 - (880 * (timeLeft / focusDuration)) }} className="text-candy-blue" style={{ strokeLinecap: 'round' }} />
                      </svg>
                      <div className="text-6xl md:text-7xl font-display font-bold text-slate-700">{formatTimerTime(timeLeft)}</div>
                    </div>

                    <div className="flex gap-6 mt-12">
                      <button onClick={() => setIsTimerActive(!isTimerActive)} className="w-16 h-16 rounded-full bg-candy-pink text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                        {isTimerActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                      </button>
                      <button onClick={() => { setTimeLeft(focusDuration); setIsTimerActive(false); }} className="w-16 h-16 rounded-full glass-candy flex items-center justify-center hover:bg-white transition-colors text-slate-400">
                        <RotateCcw size={28} />
                      </button>
                    </div>

                    <div className="mt-12 flex flex-col items-center gap-4 w-full max-w-md">
                      <div className="flex items-center gap-2 text-slate-400"><MusicIcon size={16} /><span className="text-xs font-bold uppercase tracking-widest">Focus Music</span></div>
                      <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/70 border border-white/40 dark:border-white/10 w-full shadow-sm text-center">
                         <div className="text-xs font-bold mb-1 text-slate-500 uppercase tracking-widest">Sedang Diputar:</div>
                         <div className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1">
                           {mediaPlayerMode === 'candy' ? CANDY_SONGS[currentSongIndex].title : (ytActiveItem?.snippet?.title || ytActiveItem?.title || "Unknown")}
                         </div>
                         <div className="text-xs text-slate-500 line-clamp-1">
                           {mediaPlayerMode === 'candy' ? CANDY_SONGS[currentSongIndex].artist : (ytActiveItem?.snippet?.videoOwnerChannelTitle || ytActiveItem?.channelTitle || "YouTube Music")}
                         </div>
                         
                         <div className="mt-4 flex justify-center">
                           <button onClick={togglePlayPause} className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${isPlayingMusic ? 'bg-candy-purple text-white shadow-md' : 'bg-white text-slate-400'}`}>
                              {isPlayingMusic ? 'Music On' : 'Music Off'}
                           </button>
                         </div>
                      </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'mood' && (
              <motion.div key="mood" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="glass-candy p-8 rounded-[2rem] text-center">
                  <h2 className="text-3xl font-display font-bold text-slate-700 dark:text-slate-100 mb-2">How are you feeling?</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">Tracking your mood helps you understand your productivity patterns.</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {moods.map((mood) => (
                      <button key={mood.label} onClick={() => addMood(mood)} className={`flex flex-col items-center gap-3 p-6 rounded-3xl transition-all hover:scale-105 ${ currentMood === mood.label ? 'bg-white dark:bg-slate-800 shadow-xl ring-2 ring-candy-blue/20' : 'glass-candy hover:bg-white dark:hover:bg-slate-800' }`}>
                        <div className={`p-4 rounded-2xl ${mood.bg} ${mood.color}`}><mood.icon size={32} /></div>
                        <span className="font-bold text-slate-600 dark:text-slate-300">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-candy p-8 rounded-[2rem]">
                    <h3 className="text-xl font-display font-bold text-slate-700 dark:text-slate-100 mb-6 flex items-center gap-2"><Clock size={20} className="text-candy-blue" /> Recent Moods</h3>
                    <div className="space-y-4">
                      {moodHistory.map((entry) => (
                        <div key={entry.id} className="flex items-center gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/20 dark:border-white/5">
                          <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-700 ${entry.color}`}><entry.icon size={20} /></div>
                          <div className="flex-1">
                            <div className="font-bold text-slate-700 dark:text-slate-200">{entry.mood}</div>
                            <div className="text-xs text-slate-400 dark:text-slate-500">{entry.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass-candy p-8 rounded-[2rem] flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-candy-pink/10 text-candy-pink rounded-full flex items-center justify-center mb-4"><Sparkles size={32} /></div>
                    <h3 className="text-xl font-display font-bold text-slate-700 dark:text-slate-100 mb-2">Mood Insight</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {currentMood === 'Stressed' ? "Take a 5-minute break. Your health is more important than your to-do list." :
                       currentMood === 'Tired' ? "Maybe it's time for a quick power nap or some water?" :
                       currentMood === 'Happy' ? "You're in a great state! Use this energy to tackle your hardest tasks." :
                       currentMood === 'Calm' ? "Perfect state for deep work. Keep going!" :
                       "Keep tracking your mood to see your weekly productivity trends."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <CandyCard title="Total Points" color="bg-candy-yellow/10" className="md:col-span-1">
                    <div className="text-4xl font-display font-bold text-candy-yellow">{candyPoints}</div>
                    <p className="text-xs text-slate-400 mt-1">Keep earning!</p>
                  </CandyCard>
                  <CandyCard title="Productivity Level" color="bg-candy-purple/10" className="md:col-span-1">
                    <div className="text-4xl font-display font-bold text-candy-purple">Lvl {level}</div>
                    <p className="text-xs text-slate-400 mt-1">Master of Focus</p>
                  </CandyCard>
                  <CandyCard title="Focus Score" color="bg-candy-blue/10" className="md:col-span-1">
                    <div className="text-4xl font-display font-bold text-candy-blue">88</div>
                    <p className="text-xs text-slate-400 mt-1">Top 5% of students</p>
                  </CandyCard>

                  <CandyCard title="Focus Time Distribution" className="md:col-span-2 h-[350px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={undefined}>
                      <AreaChart data={[{ name: 'Mon', time: 120 }, { name: 'Tue', time: 180 }, { name: 'Wed', time: 150 }, { name: 'Thu', time: 210 }, { name: 'Fri', time: 190 }, { name: 'Sat', time: 90 }, { name: 'Sun', time: 60 }]}>
                        <defs>
                          <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7ec8e3" stopOpacity={0.3}/><stop offset="95%" stopColor="#7ec8e3" stopOpacity={0}/></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                        <YAxis hide />
                        <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="time" stroke="#7ec8e3" strokeWidth={3} fillOpacity={1} fill="url(#colorTime)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CandyCard>

                  <CandyCard title="Task Categories" className="md:col-span-2 h-[350px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} aspect={undefined}>
                      <BarChart data={[{ name: 'Study', count: 12 }, { name: 'Class', count: 8 }, { name: 'Exam', count: 3 }, { name: 'Break', count: 15 }]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                        <YAxis hide />
                        <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="count" fill="#ff85a2" radius={[10, 10, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CandyCard>
                </div>
              </motion.div>
            )}

            {activeTab === 'rewards' && (
              <motion.div key="rewards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
                <div className="text-center mb-12">
                  <div className="w-24 h-24 bg-candy-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6 text-candy-yellow"><Star size={48} className="fill-current" /></div>
                  <h2 className="text-3xl font-display font-bold text-slate-800">Candy Rewards</h2>
                  <p className="text-slate-400">Redeem your points for cool digital perks!</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Golden Timer', cost: 500, icon: Timer, color: 'bg-candy-yellow' },
                    { title: 'Exclusive Lofi Pack', cost: 1000, icon: MusicIcon, color: 'bg-candy-purple' },
                    { title: 'AI Pro Assistant', cost: 2500, icon: Sparkles, color: 'bg-candy-blue' },
                    { title: 'Custom Theme', cost: 5000, icon: Zap, color: 'bg-candy-pink' },
                    { title: 'Productivity Badge', cost: 100, icon: Trophy, color: 'bg-candy-green' },
                    { title: 'Secret Moods', cost: 300, icon: Smile, color: 'bg-candy-blue' },
                  ].map((reward, i) => (
                    <CandyCard key={i} className="flex flex-col items-center text-center p-8">
                      <div className={`w-16 h-16 rounded-2xl ${reward.color} text-white flex items-center justify-center mb-6 shadow-lg`}><reward.icon size={32} /></div>
                      <h4 className="font-bold text-slate-700 mb-2">{reward.title}</h4>
                      <div className="flex items-center gap-1 text-candy-yellow font-bold text-sm mb-6"><Candy size={14} /> {reward.cost} pts</div>
                      <button disabled={candyPoints < reward.cost} onClick={() => { if (candyPoints >= reward.cost) { setCandyPoints(p => p - reward.cost); alert(`Redeemed ${reward.title}!`); } }} className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${ candyPoints >= reward.cost ? 'bg-slate-800 text-white hover:scale-105' : 'bg-slate-100 text-slate-300 cursor-not-allowed' }`}>
                        {candyPoints >= reward.cost ? 'Redeem' : 'Not Enough Points'}
                      </button>
                    </CandyCard>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
          <StylizedFooter />
        </main>

        <style dangerouslySetInnerHTML={{ __html: `
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 133, 162, 0.2); }
        `}} />
      </div>
    </div>
  );
}