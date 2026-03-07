import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Timer, 
  BookOpen, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw,
  ChevronRight,
  Search,
  Bell,
  Settings,
  Zap,
  Calendar as CalendarIcon,
  Trophy,
  Sparkles,
  FileText,
  BrainCircuit,
  Upload,
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  Save,
  Edit3,
  Droplets,
  Music,
  SkipBack,
  SkipForward,
  Menu,
  X,
  Clock,
  Candy,
  Volume2,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  BarChart3,
  Layers,
  Users,
  Flame,
  Star,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';


pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: string;
}

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  day: string;
  type: 'Class' | 'Study' | 'Exam' | 'Break';
}

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface Song {
  title: string;
  artist: string;
  url: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const CANDY_SONGS: Song[] = [
  { 
    title: "Lofi Study Session", 
    artist: "Chill Mind", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
  },
  { 
    title: "Dreamy Focus", 
    artist: "Aesthetic Beats", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" 
  },
  { 
    title: "Midnight Piano", 
    artist: "Soft Keys", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" 
  },
  { 
    title: "Morning Coffee", 
    artist: "Sunrise Vibe", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" 
  }
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
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large Blobs */}
      <motion.div style={{ y: y1, rotate, scale }} className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-candy-pink/5 rounded-full blur-[120px]" />
      <motion.div style={{ y: y2, rotate: -rotate }} className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-candy-blue/5 rounded-full blur-[150px]" />
      <motion.div style={{ y: y3, scale }} className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-candy-purple/5 rounded-full blur-[100px]" />
      <motion.div style={{ y: y4 }} className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] bg-candy-yellow/5 rounded-full blur-[130px]" />
      
      {/* Floating Icons & Components */}
      <motion.div style={{ y: y2 }} className="absolute top-20 left-[10%] text-candy-pink/10 animate-float opacity-40">
        <Candy size={120} strokeWidth={1} />
      </motion.div>
      <motion.div style={{ y: y1, animationDelay: '1s' }} className="absolute bottom-40 right-[15%] text-candy-blue/10 animate-float opacity-40">
        <Clock size={160} strokeWidth={0.5} />
      </motion.div>
      <motion.div style={{ y: y3, animationDelay: '2s' }} className="absolute top-1/2 right-[5%] text-candy-yellow/10 animate-float opacity-40">
        <Zap size={80} strokeWidth={1} />
      </motion.div>
      <motion.div style={{ y: y4, animationDelay: '1.5s' }} className="absolute top-[15%] right-[30%] text-candy-purple/10 animate-float opacity-40">
        <BookOpen size={100} strokeWidth={0.5} />
      </motion.div>
      <motion.div style={{ y: y1, animationDelay: '0.5s' }} className="absolute bottom-[10%] left-[20%] text-candy-green/10 animate-float opacity-40">
        <CheckSquare size={140} strokeWidth={0.5} />
      </motion.div>

      {/* Decorative Circles */}
      <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-candy-pink/20 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 right-1/2 w-3 h-3 bg-candy-blue/20 rounded-full animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-candy-purple/20 rounded-full animate-pulse delay-1000" />

      {/* Mini Floating Widgets */}
      <motion.div style={{ y: y3 }} className="absolute top-[10%] right-[10%] glass-candy p-3 rounded-2xl opacity-20 hidden lg:block">
        <div className="w-20 h-2 bg-slate-200 rounded-full mb-2" />
        <div className="w-12 h-2 bg-slate-100 rounded-full" />
      </motion.div>
      <motion.div style={{ y: y1 }} className="absolute bottom-[20%] left-[5%] glass-candy p-4 rounded-3xl opacity-20 hidden lg:block">
        <div className="flex gap-2 mb-2">
          <div className="w-4 h-4 rounded-full bg-candy-pink/50" />
          <div className="w-4 h-4 rounded-full bg-candy-blue/50" />
        </div>
        <div className="w-16 h-2 bg-slate-100 rounded-full" />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute top-[40%] left-[40%] glass-candy p-2 rounded-xl opacity-10 hidden lg:block">
        <div className="w-8 h-8 rounded-lg bg-candy-yellow/30" />
      </motion.div>
      <motion.div style={{ y: y4 }} className="absolute bottom-[10%] right-[40%] glass-candy p-3 rounded-2xl opacity-15 hidden lg:block">
        <div className="w-10 h-10 rounded-full border-2 border-candy-green/20" />
      </motion.div>
    </div>
  );
};

const StylizedFooter = () => {
  return (
    <footer className="mt-20 pb-12 pt-20 border-t border-slate-100/50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-8">

          {/* Stylized Logo Text */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 footer-text-stylized text-5xl md:text-9xl p-10">
            <span className="text-candy-pink glass-text -rotate-6 animate-liquid">K</span>
            <span className="text-candy-blue glass-text rotate-3 animate-liquid" style={{ animationDelay: '0.5s' }}>E</span>
            <span className="text-candy-purple glass-text -rotate-2 animate-liquid" style={{ animationDelay: '1s' }}>L</span>
            <span className="text-candy-yellow glass-text rotate-6 animate-liquid" style={{ animationDelay: '1.5s' }}>A</span>
            <span className="text-candy-green glass-text -rotate-3 animate-liquid" style={{ animationDelay: '2s' }}>R</span>
            <span className="text-candy-pink glass-text rotate-2 animate-liquid" style={{ animationDelay: '2.5s' }}>.</span>
            <span className="text-candy-blue glass-text -rotate-6 animate-liquid" style={{ animationDelay: '3s' }}>I</span>
            <span className="text-candy-purple glass-text rotate-3 animate-liquid" style={{ animationDelay: '3.5s' }}>N</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            <a href="#" className="hover:text-candy-pink transition-colors">Productivity</a>
            <a href="#" className="hover:text-candy-blue transition-colors">Focus</a>
            <a href="#" className="hover:text-candy-purple transition-colors">Notes</a>
            <a href="#" className="hover:text-candy-green transition-colors">AI Sync</a>
          </div>

          <div className="text-center space-y-2">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              © 2026 KELAR.IN PRODUCTIVITY NETWORK • ALL SYSTEMS OPERATIONAL
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const CandyCard = ({ children, className = "", title, color = "bg-white" }: { children: React.ReactNode, className?: string, title?: string, color?: string, key?: React.Key }) => (
  <div className={`glass-candy rounded-3xl p-6 relative transition-all duration-300 hover:scale-[1.02] ${color} ${className}`}>
    {title && (
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-bold uppercase tracking-widest text-slate-400">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick, color = "text-candy-pink" }: { icon: any, label: string, active: boolean, onClick: () => void, color?: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
      active ? 'bg-white shadow-sm ' + color : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
    }`}
  >
    <Icon size={20} className={active ? color : 'group-hover:scale-110 transition-transform'} />
    <span className="text-sm font-bold">{label}</span>
    {active && <motion.div layoutId="active-pill" className={`ml-auto w-1.5 h-6 rounded-full ${color.replace('text-', 'bg-')}`} />}
  </button>
);

interface Flashcard {
  id: string;
  front: string;
  back: string;
  mastered: boolean;
}

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`relative ${className} flex items-center justify-center bg-candy-yellow rounded-full shadow-md border-2 border-white/40 overflow-hidden`}>
    <div className="absolute inset-[8%] bg-white rounded-full flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Clock marks */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute w-0.5 h-1.5 bg-slate-200" style={{ transform: `rotate(${i * 30}deg) translateY(-220%)` }} />
        ))}
        {/* The 'K' shape */}
        <div className="absolute w-1.5 h-[60%] bg-candy-pink rounded-full -translate-x-1.5 shadow-sm" />
        <div className="absolute w-1.5 h-[40%] bg-slate-800 rounded-full rotate-45 translate-x-1 -translate-y-1.5 shadow-sm" />
        <div className="absolute w-1.5 h-[40%] bg-slate-800 rounded-full -rotate-45 translate-x-1 translate-y-1.5 shadow-sm" />
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Persistence
  const [tasks, setTasks] = useState<Task[]>(() => JSON.parse(localStorage.getItem('kelarin_tasks') || '[]'));
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => JSON.parse(localStorage.getItem('kelarin_schedules') || '[]'));
  const [notes, setNotes] = useState<Note[]>(() => JSON.parse(localStorage.getItem('kelarin_notes') || '[]'));
  const [waterIntake, setWaterIntake] = useState<number>(() => Number(localStorage.getItem('kelarin_water') || '0'));
  
  // Gamification State
  const [candyPoints, setCandyPoints] = useState<number>(() => Number(localStorage.getItem('kelarin_points') || '0'));
  const [streak, setStreak] = useState<number>(() => Number(localStorage.getItem('kelarin_streak') || '0'));
  const [level, setLevel] = useState<number>(() => Math.floor(Number(localStorage.getItem('kelarin_points') || '0') / 100) + 1);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => JSON.parse(localStorage.getItem('kelarin_flashcards') || '[]'));

  useEffect(() => {
    localStorage.setItem('kelarin_tasks', JSON.stringify(tasks));
    localStorage.setItem('kelarin_schedules', JSON.stringify(schedules));
    localStorage.setItem('kelarin_notes', JSON.stringify(notes));
    localStorage.setItem('kelarin_water', waterIntake.toString());
    localStorage.setItem('kelarin_points', candyPoints.toString());
    localStorage.setItem('kelarin_streak', streak.toString());
    localStorage.setItem('kelarin_flashcards', JSON.stringify(flashcards));
  }, [tasks, schedules, notes, waterIntake, candyPoints, streak, flashcards]);

  // UI State
  const [newTask, setNewTask] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [isEditingNote, setIsEditingNote] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Schedule Form State
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ title: '', time: '', day: 'Mon', type: 'Study' as const });

  // Quiz State
  const [studyMaterial, setStudyMaterial] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

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
    const newEntry = {
      id: Math.random().toString(36).substr(2, 9),
      mood: mood.label,
      icon: mood.icon,
      color: mood.color,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMoodHistory([newEntry, ...moodHistory].slice(0, 10));
    setCurrentMood(mood.label);
    setCandyPoints(p => p + 5);
  };
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Timer & Music State
  const [focusDuration, setFocusDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [manualMinutes, setManualMinutes] = useState('25');
  const [isActive, setIsActive] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
      // Timer habis, matikan musik juga
      setIsPlayingMusic(false);
      // Award points
      setCandyPoints(p => p + 50);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

// Audio Logic
useEffect(() => {
  if (audioRef.current) {
    audioRef.current.load();
    if (isPlayingMusic || isActive) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  }
}, [currentSongIndex]);

useEffect(() => {
  if (isPlayingMusic || isActive) {
    audioRef.current?.play().catch(e => console.log("Audio play failed:", e));
  } else {
    audioRef.current?.pause();
  }
}, [isPlayingMusic, isActive]);

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

  // Chatbot Logic
  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...chatHistory, userMsg].map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        config: { systemInstruction: "You are Kelar.in AI, a helpful and cool student productivity assistant. You love candy colors and being positive. Keep answers concise!" }
      });
      setChatHistory(prev => [...prev, { role: 'model', text: response.text || "Oops, my candy brain froze!" }]);
    } catch (error) {
      console.error("Chat failed:", error);
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const generateQuiz = async () => {
    if (!studyMaterial.trim() && !uploadedImage) return;
    setIsQuizLoading(true);
    setQuizQuestions([]);
    setQuizFinished(false);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setUserAnswers([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      let contents: any;
      if (uploadedImage) {
        contents = {
          parts: [
            { inlineData: { data: uploadedImage.split(',')[1], mimeType: "image/png" } },
            { text: `Generate a 5-question multiple choice quiz based on the content of this image. 
              If there is text in the image, use it as the source. If it's a diagram, ask questions about it.
              Return the response in JSON format as an array of objects with these properties: 
              question (string), options (array of 4 strings), correctAnswer (number, 0-3 index), explanation (string).` }
          ]
        };
      } else {
        contents = `Generate a 5-question multiple choice quiz based on the following study material. 
          Return the response in JSON format as an array of objects with these properties: 
          question (string), options (array of 4 strings), correctAnswer (number, 0-3 index), explanation (string).
          
          Material: ${studyMaterial}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: { 
          responseMimeType: "application/json",
          systemInstruction: "You are a professional educator. Create challenging but fair quiz questions."
        }
      });
      
      const questions = JSON.parse(response.text || "[]");
      setQuizQuestions(questions);
    } catch (error) {
      console.error("Quiz generation failed:", error);
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (showExplanation) return;
    
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    
    const isCorrect = optionIndex === quizQuestions[currentQuizIndex].correctAnswer;
    if (isCorrect) setQuizScore(s => s + 1);
    setUserAnswers([...userAnswers, optionIndex]);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setSelectedOption(null);
    
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadedImage(null);
    setStudyMaterial('');

    const fileType = file.type;

    if (fileType.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (fileType === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
        const pdf = await pdfjs.getDocument(typedarray).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }
        setStudyMaterial(fullText);
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        setStudyMaterial(result.value);
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Default to text
      const reader = new FileReader();
      reader.onload = (event) => {
        setStudyMaterial(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-bg-light bg-candy-mesh selection:bg-candy-pink selection:text-white overflow-hidden">
      <ParallaxBackground />
      <audio ref={audioRef} src={CANDY_SONGS[currentSongIndex].url} loop />
      
      {/* Unified Header */}
      <header className="h-16 flex-shrink-0 z-50 bg-white/40 backdrop-blur-md border-b border-white/40 px-4 md:px-8">
        <div className="h-full max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 hover:bg-white/50 rounded-xl transition-colors"
            >
              <Menu size={24} className="text-slate-600" />
            </button>
            <Logo className="w-8 h-8 md:w-10 md:h-10" />
            <span className="text-lg md:text-xl font-display font-bold tracking-tighter text-candy-pink text-glow-candy">KELAR.IN</span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl border border-white/40 shadow-sm">
              <Candy className="text-candy-yellow" size={18} />
              <div className="flex flex-col">
                <span className="hidden md:block text-[8px] font-black text-slate-400 uppercase leading-none">Points</span>
                <span className="text-xs md:text-sm font-bold text-slate-700 leading-none">{candyPoints}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl border border-white/40 shadow-sm">
              <Flame className="text-candy-pink" size={18} />
              <div className="flex flex-col">
                <span className="hidden md:block text-[8px] font-black text-slate-400 uppercase leading-none">Streak</span>
                <span className="text-xs md:text-sm font-bold text-slate-700 leading-none">{streak}</span>
              </div>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-candy-purple/10 border border-candy-purple/20 flex flex-col items-center justify-center text-candy-purple">
              <span className="text-[6px] md:text-[8px] font-black uppercase leading-none">Level</span>
              <span className="text-sm md:text-lg font-bold leading-none">{level}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 glass-candy m-4 rounded-[2.5rem] p-6 flex flex-col gap-8 transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:flex md:m-0 md:rounded-none md:bg-transparent md:backdrop-blur-none md:border-r md:border-white/20
        `}>
          <nav className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false)}} color="text-candy-blue" />
            <SidebarItem icon={CheckSquare} label="Tasks" active={activeTab === 'tasks'} onClick={() => {setActiveTab('tasks'); setIsSidebarOpen(false)}} color="text-candy-pink" />
            <SidebarItem icon={CalendarIcon} label="Schedule" active={activeTab === 'schedule'} onClick={() => {setActiveTab('schedule'); setIsSidebarOpen(false)}} color="text-candy-yellow" />
            <SidebarItem icon={BrainCircuit} label="Study Lab" active={activeTab === 'quiz'} onClick={() => {setActiveTab('quiz'); setIsSidebarOpen(false)}} color="text-candy-purple" />
            <SidebarItem icon={Timer} label="Focus" active={activeTab === 'timer'} onClick={() => {setActiveTab('timer'); setIsSidebarOpen(false)}} color="text-candy-blue" />
            
            <div className="my-2 px-4">
              <div className="h-px bg-slate-200 w-full rounded-full opacity-60"></div>
            </div>

            <SidebarItem icon={BookOpen} label="Notes" active={activeTab === 'notes'} onClick={() => {setActiveTab('notes'); setIsSidebarOpen(false)}} color="text-candy-purple" />
            <SidebarItem icon={MessageSquare} label="AI Chat" active={activeTab === 'chat'} onClick={() => {setActiveTab('chat'); setIsSidebarOpen(false)}} color="text-candy-green" />
            <SidebarItem icon={Smile} label="Mood" active={activeTab === 'mood'} onClick={() => {setActiveTab('mood'); setIsSidebarOpen(false)}} color="text-candy-green" />
            
            <div className="my-2 px-4">
              <div className="h-px bg-slate-200 w-full rounded-full opacity-60"></div>
            </div>

            <SidebarItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => {setActiveTab('analytics'); setIsSidebarOpen(false)}} color="text-candy-blue" />
            <SidebarItem icon={Layers} label="Flashcards" active={activeTab === 'flashcards'} onClick={() => {setActiveTab('flashcards'); setIsSidebarOpen(false)}} color="text-candy-purple" />
            <SidebarItem icon={Trophy} label="Rewards" active={activeTab === 'rewards'} onClick={() => {setActiveTab('rewards'); setIsSidebarOpen(false)}} color="text-candy-yellow" />
          </nav>

          <div className="mt-auto p-4 bg-candy-blue/10 rounded-3xl border border-candy-blue/20">
            <div className="flex items-center gap-3 mb-2">
              <Droplets className="text-candy-blue" size={20} />
              <span className="text-xs font-bold text-candy-blue uppercase tracking-widest">Hydration</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600">{waterIntake} / 8 glasses</span>
              <button onClick={() => setWaterIntake(w => Math.min(w + 1, 12))} className="w-8 h-8 rounded-full bg-candy-blue text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                <Plus size={16} />
              </button>
            </div>
            <div className="mt-2 h-2 w-full bg-white rounded-full overflow-hidden">
              <motion.div animate={{ width: `${(waterIntake / 8) * 100}%` }} className="h-full bg-candy-blue" />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 relative z-10 overflow-y-auto custom-scrollbar">
          <header className="hidden md:flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <Logo className="w-12 h-12" />
              <div>
                <h1 className="text-3xl font-display font-bold mb-1 text-slate-800">Productivity Hub.</h1>
                <p className="text-slate-400 text-sm">Everything is ready for your success!</p>
              </div>
            </div>
          </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              {/* Top Row: Progress & Hydration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CandyCard title="Today's Progress" className="col-span-1 md:col-span-2" color="bg-candy-blue/5">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <div className="text-6xl font-display font-bold mb-2 text-candy-blue">2.4h</div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Focus Time Today</div>
                    </div>
                    <div className="text-center md:text-right">
                      <div className="text-3xl font-bold text-candy-pink">{tasks.filter(t => t.completed).length} / {tasks.length}</div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Tasks Completed</div>
                    </div>
                  </div>
                </CandyCard>
                
                <CandyCard title="Hydration Goal" color="bg-candy-blue/5">
                  <div className="text-center">
                    <div className="text-4xl font-display font-bold text-candy-blue mb-2">{waterIntake} <span className="text-lg">glasses</span></div>
                    <p className="text-xs text-slate-400 mb-4">Stay fresh, stay smart!</p>
                    <button onClick={() => setWaterIntake(0)} className="text-[10px] font-bold text-slate-300 hover:text-candy-blue uppercase tracking-widest">Reset Daily</button>
                  </div>
                </CandyCard>
              </div>

              {/* Middle Row: Tasks, Focus Room, Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Tasks */}
                <CandyCard title="Quick Tasks" color="bg-candy-pink/5">
                  <div className="space-y-3 mb-4">
                    {tasks.filter(t => !t.completed).slice(0, 3).map(t => (
                      <div key={t.id} className="flex items-center gap-2 p-2 bg-white/50 rounded-xl border border-white/20">
                        <div className="w-2 h-2 rounded-full bg-candy-pink" />
                        <span className="text-sm font-medium text-slate-600 truncate">{t.text}</span>
                      </div>
                    ))}
                    {tasks.filter(t => !t.completed).length === 0 && <p className="text-xs text-slate-400 italic">No pending tasks!</p>}
                  </div>
                  <button onClick={() => setActiveTab('tasks')} className="w-full py-2 bg-candy-pink/10 text-candy-pink rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-candy-pink/20 transition-colors flex items-center justify-center gap-2">
                    Manage Tasks <ArrowRight size={14} />
                  </button>
                </CandyCard>

                {/* Focus Room Preview */}
                <CandyCard title="Focus Room" color="bg-candy-green/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-2">
                      {[4,5,6].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                          <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="user" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-700">Live Room</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Studying Now</div>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('timer')} className="w-full py-2 bg-candy-green/10 text-candy-green rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-candy-green/20 transition-colors flex items-center justify-center gap-2">
                    Join Session <ArrowRight size={14} />
                  </button>
                </CandyCard>

                {/* Analytics Preview */}
                <CandyCard title="Productivity" color="bg-candy-blue/5">
                  <div className="h-24 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'M', v: 40 }, { name: 'T', v: 70 }, { name: 'W', v: 50 }, { name: 'T', v: 90 }, { name: 'F', v: 60 }
                      ]}>
                        <Bar dataKey="v" fill="#7ec8e3" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <button onClick={() => setActiveTab('analytics')} className="w-full py-2 bg-candy-blue/10 text-candy-blue rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-candy-blue/20 transition-colors flex items-center justify-center gap-2">
                    View Insights <ArrowRight size={14} />
                  </button>
                </CandyCard>
              </div>

              {/* Bottom Row: Music & Flashcards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CandyCard title="Focus Music" className="col-span-1 md:col-span-2" color="bg-candy-purple/5">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-candy-purple flex items-center justify-center text-white shadow-lg">
                      <Music size={32} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="font-bold text-lg text-slate-700">{CANDY_SONGS[currentSongIndex].title}</h4>
                      <p className="text-sm text-slate-400">{CANDY_SONGS[currentSongIndex].artist}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setCurrentSongIndex(i => (i - 1 + CANDY_SONGS.length) % CANDY_SONGS.length)} className="p-3 rounded-full hover:bg-white transition-colors text-slate-400"><SkipBack size={24} /></button>
                      <button onClick={() => setIsPlayingMusic(!isPlayingMusic)} className="w-14 h-14 rounded-full bg-candy-purple text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        {isPlayingMusic ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                      </button>
                      <button onClick={() => setCurrentSongIndex(i => (i + 1) % CANDY_SONGS.length)} className="p-3 rounded-full hover:bg-white transition-colors text-slate-400"><SkipForward size={24} /></button>
                    </div>
                  </div>
                </CandyCard>

                <CandyCard title="Flashcard of the Day" color="bg-candy-purple/5">
                  {flashcards.length > 0 ? (
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-600 mb-4 line-clamp-2">"{flashcards[Math.floor(Math.random() * flashcards.length)].front}"</p>
                      <button onClick={() => setActiveTab('flashcards')} className="w-full py-2 bg-candy-purple/10 text-candy-purple rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-candy-purple/20 transition-colors">
                        Study Now
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-4 italic">No cards yet!</p>
                      <button onClick={() => setActiveTab('flashcards')} className="w-full py-2 bg-candy-purple/10 text-candy-purple rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-candy-purple/20 transition-colors">
                        Create Cards
                      </button>
                    </div>
                  )}
                </CandyCard>
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
                  <div key={t.id} className="glass-candy p-5 rounded-3xl flex items-center justify-between group bg-white/50">
                    <div className="flex items-center gap-4">
                      <button onClick={() => {
                        const isCompleting = !t.completed;
                        setTasks(tasks.map(x => x.id === t.id ? {...x, completed: isCompleting} : x));
                        if (isCompleting) setCandyPoints(p => p + 10);
                      }} className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${t.completed ? 'bg-candy-pink border-candy-pink' : 'border-slate-200 hover:border-candy-pink'}`}>
                        {t.completed && <CheckCircle2 size={16} className="text-white" />}
                      </button>
                      <span className={`text-lg font-medium ${t.completed ? 'line-through text-slate-300' : 'text-slate-700'}`}>{t.text}</span>
                    </div>
                    <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto h-[70vh] flex flex-col glass-candy rounded-[2.5rem] overflow-hidden bg-white/30">
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {chatHistory.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-[1.5rem] font-medium ${m.role === 'user' ? 'bg-candy-green text-slate-700 shadow-sm' : 'bg-white text-slate-600 shadow-sm'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && <div className="flex justify-start"><div className="bg-white/50 p-4 rounded-[1.5rem] animate-pulse text-slate-400">Thinking...</div></div>}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 bg-white/50 border-t border-white/40 flex gap-4">
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask Kelar AI something..." className="flex-1 bg-white rounded-2xl px-6 outline-none border border-transparent focus:border-candy-green text-slate-700" />
                <button onClick={sendMessage} className="bg-candy-green text-slate-700 p-4 rounded-2xl hover:scale-105 transition-transform shadow-md"><Send size={20} /></button>
              </div>
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CandyCard className="md:col-span-1" title="New Note" color="bg-candy-purple/5">
                <input value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} placeholder="Title" className="w-full bg-white rounded-xl p-3 mb-4 outline-none border border-transparent focus:border-candy-purple text-slate-700" />
                <textarea value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})} placeholder="Content..." className="w-full h-40 bg-white rounded-xl p-3 mb-4 outline-none border border-transparent focus:border-candy-purple text-slate-700 resize-none" />
                <button onClick={() => {
                  if (isEditingNote) {
                    setNotes(notes.map(n => n.id === isEditingNote ? {...n, title: newNote.title, content: newNote.content} : n));
                    setIsEditingNote(null);
                  } else {
                    setNotes([{id: Date.now().toString(), ...newNote, date: new Date().toLocaleDateString(), color: 'bg-candy-purple/10'}, ...notes]);
                  }
                  setNewNote({title: '', content: ''});
                }} className="w-full py-3 bg-candy-purple text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform">
                  <Save size={18} /> {isEditingNote ? 'Update' : 'Save Note'}
                </button>
              </CandyCard>
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {notes.map(n => (
                  <CandyCard key={n.id} color={n.color}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-slate-700">{n.title}</h4>
                      <div className="flex gap-2">
                        <button onClick={() => {setIsEditingNote(n.id); setNewNote({title: n.title, content: n.content})}} className="text-slate-300 hover:text-candy-blue transition-colors"><Edit3 size={18} /></button>
                        <button onClick={() => setNotes(notes.filter(x => x.id !== n.id))} className="text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-4 mb-4">{n.content}</p>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{n.date}</span>
                  </CandyCard>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div key="schedule" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-slate-800">Weekly Schedule</h2>
                  <p className="text-slate-400 text-sm">Plan your success, one hour at a time.</p>
                </div>
                <button 
                  onClick={() => setIsAddingSchedule(!isAddingSchedule)}
                  className="px-6 py-3 bg-candy-yellow text-slate-700 font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                >
                  {isAddingSchedule ? <X size={20} /> : <Plus size={20} />}
                  {isAddingSchedule ? 'Cancel' : 'Add Event'}
                </button>
              </div>

              <AnimatePresence>
                {isAddingSchedule && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="glass-candy p-6 rounded-[2rem] mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 bg-white/50">
                      <input 
                        value={scheduleForm.title} 
                        onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})} 
                        placeholder="Event Title" 
                        className="bg-white rounded-xl px-4 py-3 outline-none border border-transparent focus:border-candy-yellow text-slate-700" 
                      />
                      <input 
                        type="time"
                        value={scheduleForm.time} 
                        onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} 
                        className="bg-white rounded-xl px-4 py-3 outline-none border border-transparent focus:border-candy-yellow text-slate-700" 
                      />
                      <select 
                        value={scheduleForm.day} 
                        onChange={e => setScheduleForm({...scheduleForm, day: e.target.value})} 
                        className="bg-white rounded-xl px-4 py-3 outline-none border border-transparent focus:border-candy-yellow text-slate-700"
                      >
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <select 
                        value={scheduleForm.type} 
                        onChange={e => setScheduleForm({...scheduleForm, type: e.target.value as any})} 
                        className="bg-white rounded-xl px-4 py-3 outline-none border border-transparent focus:border-candy-yellow text-slate-700"
                      >
                        {['Class', 'Study', 'Exam', 'Break'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <button 
                        onClick={() => {
                          if (scheduleForm.title && scheduleForm.time) {
                            setSchedules([...schedules, { id: Date.now().toString(), ...scheduleForm }]);
                            setScheduleForm({ title: '', time: '', day: scheduleForm.day, type: 'Study' });
                            setIsAddingSchedule(false);
                          }
                        }}
                        className="bg-candy-yellow text-slate-700 font-bold rounded-xl py-3 shadow-md hover:bg-candy-yellow/80 transition-colors"
                      >
                        Save Event
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="space-y-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center py-2 bg-white/30 rounded-xl">{day}</div>
                    <div className="min-h-[100px] flex flex-col gap-3">
                      {schedules.filter(s => s.day === day).sort((a,b) => a.time.localeCompare(b.time)).map(s => (
                        <motion.div 
                          layout
                          key={s.id} 
                          className={`glass-candy p-4 rounded-2xl border-l-4 relative group bg-white shadow-sm hover:shadow-md transition-all ${
                            s.type === 'Class' ? 'border-l-candy-blue' : 
                            s.type === 'Exam' ? 'border-l-candy-pink' : 
                            s.type === 'Break' ? 'border-l-candy-green' : 
                            'border-l-candy-yellow'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-xs font-bold text-slate-700 truncate pr-4">{s.title}</div>
                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                              s.type === 'Class' ? 'bg-candy-blue/10 text-candy-blue' : 
                              s.type === 'Exam' ? 'bg-candy-pink/10 text-candy-pink' : 
                              s.type === 'Break' ? 'bg-candy-green/10 text-candy-green' : 
                              'border-l-candy-yellow'
                            }`}>
                              {s.type}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <Clock size={10} /> {s.time}
                          </div>
                          <button 
                            onClick={() => setSchedules(schedules.filter(x => x.id !== s.id))} 
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
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
                    <div className="w-20 h-20 bg-candy-purple/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-candy-purple">
                      <BrainCircuit size={48} />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-slate-800">AI Study Lab</h2>
                    <p className="text-slate-400">Upload your material and let AI test your knowledge!</p>
                  </div>

                  <CandyCard color="bg-white/50">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-candy-purple">
                          <FileText size={20} />
                          <span className="text-sm font-bold uppercase tracking-widest">Study Material</span>
                        </div>
                        <div className="flex gap-2">
                          <label className="cursor-pointer px-4 py-2 bg-white text-candy-purple border border-candy-purple/20 rounded-xl text-xs font-bold hover:bg-candy-purple/5 transition-colors flex items-center gap-2">
                            <Upload size={14} />
                            Upload File
                            <input 
                              type="file" 
                              accept=".txt,.md,.pdf,.docx,.doc,.pptx,.jpg,.jpeg,.png,.svg" 
                              className="hidden" 
                              onChange={handleFileUpload} 
                            />
                          </label>
                        </div>
                      </div>
                      <textarea 
                        value={studyMaterial}
                        onChange={(e) => setStudyMaterial(e.target.value)}
                        placeholder="Paste your notes here or upload a file..."
                        className="w-full h-64 bg-white rounded-2xl p-6 outline-none border border-transparent focus:border-candy-purple text-slate-700 resize-none shadow-inner"
                      />
                      {fileName && (
                        <div className="flex items-center gap-2 p-3 bg-candy-purple/5 rounded-xl border border-candy-purple/10">
                          <FileText size={18} className="text-candy-purple" />
                          <span className="text-sm font-bold text-slate-600 truncate max-w-xs">{fileName}</span>
                        </div>
                      )}
                      <div className="flex justify-end">
                        <button 
                          onClick={generateQuiz}
                          disabled={!studyMaterial.trim() && !uploadedImage}
                          className="px-8 py-4 bg-candy-purple text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                        >
                          <Sparkles size={20} /> Generate Quiz
                        </button>
                      </div>
                    </div>
                  </CandyCard>
                </div>
              )}

              {isQuizLoading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <Loader2 className="w-12 h-12 text-candy-purple animate-spin" />
                  <h3 className="text-xl font-bold text-slate-700">AI is reading your material...</h3>
                </div>
              )}

              {quizQuestions.length > 0 && !quizFinished && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-slate-700">Question {currentQuizIndex + 1} of {quizQuestions.length}</h3>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Score: {quizScore}</div>
                  </div>

                  <motion.div 
                    key={currentQuizIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-candy p-8 rounded-[2.5rem] bg-white/80 shadow-xl"
                  >
                    <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-tight">
                      {quizQuestions[currentQuizIndex].question}
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                      {quizQuestions[currentQuizIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          disabled={showExplanation}
                          className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                            showExplanation 
                              ? idx === quizQuestions[currentQuizIndex].correctAnswer 
                                ? 'border-candy-green bg-candy-green/10' 
                                : idx === selectedOption 
                                  ? 'border-candy-pink bg-candy-pink/10' 
                                  : 'border-slate-50 opacity-50'
                              : 'border-slate-50 hover:border-candy-purple hover:bg-candy-purple/5'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="font-medium text-slate-700">{option}</span>
                        </button>
                      ))}
                    </div>

                    {showExplanation && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-700 mb-2">Explanation</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{quizQuestions[currentQuizIndex].explanation}</p>
                        <button onClick={nextQuestion} className="w-full mt-6 py-3 bg-slate-800 text-white rounded-xl font-bold">
                          {currentQuizIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              )}

              {quizFinished && (
                <div className="text-center py-12">
                  <Trophy size={64} className="text-candy-yellow mx-auto mb-6" />
                  <h2 className="text-4xl font-display font-bold text-slate-800 mb-2">Quiz Complete!</h2>
                  <div className="text-6xl font-display font-bold text-candy-purple mb-8">
                    {Math.round((quizScore / quizQuestions.length) * 100)}%
                  </div>
                  <button onClick={() => {setQuizQuestions([]); setQuizFinished(false);}} className="px-8 py-4 bg-candy-purple text-white rounded-2xl font-bold shadow-lg">
                    Try Another Material
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'mood' && (
            <motion.div key="mood" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="glass-candy p-8 rounded-[2rem] text-center">
                <h2 className="text-3xl font-display font-bold text-slate-700 mb-2">How are you feeling?</h2>
                <p className="text-slate-500 mb-8">Tracking your mood helps you understand your productivity patterns.</p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  {moods.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => addMood(mood)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-3xl transition-all hover:scale-105 ${
                        currentMood === mood.label ? 'bg-white shadow-xl ring-2 ring-candy-blue/20' : 'glass-candy hover:bg-white'
                      }`}
                    >
                      <div className={`p-4 rounded-2xl ${mood.bg} ${mood.color}`}>
                        <mood.icon size={32} />
                      </div>
                      <span className="font-bold text-slate-600">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-candy p-8 rounded-[2rem]">
                  <h3 className="text-xl font-display font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-candy-blue" />
                    Recent Moods
                  </h3>
                  <div className="space-y-4">
                    {moodHistory.map((entry) => (
                      <div key={entry.id} className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-white/20">
                        <div className={`p-2 rounded-xl bg-slate-100 ${entry.color}`}>
                          <entry.icon size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-700">{entry.mood}</div>
                          <div className="text-xs text-slate-400">{entry.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-candy p-8 rounded-[2rem] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-candy-pink/10 text-candy-pink rounded-full flex items-center justify-center mb-4">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-700 mb-2">Mood Insight</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
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

          {activeTab === 'timer' && (
            <motion.div key="timer" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="flex flex-col items-center justify-center py-12">
              {/* Focus Room Widget */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 glass-candy px-6 py-3 rounded-2xl flex items-center gap-4 bg-white/50 border border-white/40"
              >
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="user" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Live Focus Room</span>
                  <span className="text-[10px] text-candy-green font-bold uppercase tracking-widest flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-candy-green animate-pulse" />
                    Learning with you now
                  </span>
                </div>
              </motion.div>

              <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
                {[15, 25, 45, 60].map(mins => (
                  <button 
                    key={mins}
                    onClick={() => {
                      const secs = mins * 60;
                      setFocusDuration(secs);
                      setTimeLeft(secs);
                      setIsActive(false);
                      setManualMinutes(mins.toString());
                    }}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                      focusDuration === mins * 60 
                        ? 'bg-candy-blue text-white shadow-md' 
                        : 'bg-white text-slate-400 hover:bg-candy-blue/5'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
                
                <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                <div className="flex items-center gap-2 glass-candy p-1.5 rounded-xl bg-white/50 border border-white/40">
                  <input 
                    type="number" 
                    value={manualMinutes} 
                    onChange={(e) => setManualMinutes(e.target.value)}
                    className="w-12 bg-transparent text-center font-bold text-slate-700 outline-none text-sm"
                    min="1"
                    max="999"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">min</span>
                  <button 
                    onClick={() => {
                      const mins = parseInt(manualMinutes);
                      if (mins > 0) {
                        const secs = mins * 60;
                        setFocusDuration(secs);
                        setTimeLeft(secs);
                        setIsActive(false);
                      }
                    }}
                    className="bg-candy-blue text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-sm"
                  >
                    Set
                  </button>
                </div>
              </div>

              <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                  <motion.circle 
                    cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={880} 
                    animate={{ strokeDashoffset: 880 - (880 * (timeLeft / focusDuration)) }}
                    className="text-candy-blue" 
                    style={{ strokeLinecap: 'round' }}
                  />
                </svg>
                <div className="text-6xl md:text-7xl font-display font-bold text-slate-700">{formatTime(timeLeft)}</div>
              </div>

              <div className="flex gap-6 mt-12">
                <button 
                  onClick={() => {
                    setIsActive(!isActive);
                    if (!isActive) setIsPlayingMusic(true);
                  }}
                  className="w-16 h-16 rounded-full bg-candy-pink text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                >
                  {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                </button>
                <button 
                  onClick={() => { setTimeLeft(focusDuration); setIsActive(false); setIsPlayingMusic(false); }}
                  className="w-16 h-16 rounded-full glass-candy flex items-center justify-center hover:bg-white transition-colors text-slate-400"
                >
                  <RotateCcw size={28} />
                </button>
              </div>

              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Music size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Focus Music</span>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsPlayingMusic(!isPlayingMusic)} className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${isPlayingMusic ? 'bg-candy-purple text-white shadow-md' : 'bg-white text-slate-400'}`}>
                    {isPlayingMusic ? 'Music On' : 'Music Off'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <CandyCard title="Total Points" color="bg-candy-yellow/10" className="md:col-span-1">
                  <div className="text-4xl font-display font-bold text-candy-yellow">{candyPoints}</div>
                  <p className="text-xs text-slate-400 mt-1">Keep earning!</p>
                </CandyCard>
                <CandyCard title="Current Streak" color="bg-candy-pink/10" className="md:col-span-1">
                  <div className="text-4xl font-display font-bold text-candy-pink flex items-center gap-2">
                    {streak} <Flame size={32} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Days in a row</p>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: 'Mon', time: 120 },
                      { name: 'Tue', time: 180 },
                      { name: 'Wed', time: 150 },
                      { name: 'Thu', time: 210 },
                      { name: 'Fri', time: 190 },
                      { name: 'Sat', time: 90 },
                      { name: 'Sun', time: 60 },
                    ]}>
                      <defs>
                        <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7ec8e3" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#7ec8e3" stopOpacity={0}/>
                        </linearGradient>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Study', count: 12 },
                      { name: 'Class', count: 8 },
                      { name: 'Exam', count: 3 },
                      { name: 'Break', count: 15 },
                    ]}>
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

          {activeTab === 'flashcards' && (
            <motion.div key="flashcards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold text-slate-800">AI Flashcards</h2>
                  <p className="text-slate-400 text-sm">Master your material with spaced repetition.</p>
                </div>
                <button 
                  onClick={() => {
                    const front = prompt('Enter front of card:');
                    const back = prompt('Enter back of card:');
                    if (front && back) {
                      setFlashcards([...flashcards, { id: Date.now().toString(), front, back, mastered: false }]);
                    }
                  }}
                  className="px-6 py-3 bg-candy-purple text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <Plus size={20} /> Add Card
                </button>
              </div>

              {flashcards.length === 0 ? (
                <div className="text-center py-20 glass-candy rounded-[2.5rem] bg-white/30 border-dashed border-2 border-slate-200">
                  <Layers className="mx-auto text-slate-200 mb-4" size={64} />
                  <p className="text-slate-400 font-bold uppercase tracking-widest">No flashcards yet</p>
                  <p className="text-xs text-slate-300 mt-2">Add some manually or generate from Study Lab!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {flashcards.map(card => (
                    <motion.div 
                      key={card.id}
                      whileHover={{ scale: 1.02 }}
                      className="group relative h-64 perspective-1000"
                    >
                      <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden glass-candy p-8 rounded-[2rem] flex flex-col items-center justify-center text-center bg-white">
                          <span className="text-xs font-bold text-candy-purple uppercase tracking-widest mb-4">Question</span>
                          <p className="text-lg font-bold text-slate-700">{card.front}</p>
                          <div className="mt-auto text-[10px] text-slate-300 font-bold uppercase tracking-widest flex items-center gap-1">
                            Hover to flip <ArrowRight size={10} />
                          </div>
                        </div>
                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 glass-candy p-8 rounded-[2rem] flex flex-col items-center justify-center text-center bg-candy-purple/10 border-candy-purple/20">
                          <span className="text-xs font-bold text-candy-purple uppercase tracking-widest mb-4">Answer</span>
                          <p className="text-lg font-bold text-slate-700">{card.back}</p>
                          <div className="mt-auto flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setFlashcards(flashcards.filter(f => f.id !== card.id));
                              }}
                              className="p-2 rounded-xl bg-white text-red-400 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setFlashcards(flashcards.map(f => f.id === card.id ? {...f, mastered: !f.mastered} : f));
                                if (!card.mastered) setCandyPoints(p => p + 20);
                              }}
                              className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                                card.mastered ? 'bg-candy-green text-slate-700' : 'bg-white text-slate-400'
                              }`}
                            >
                              {card.mastered ? 'Mastered!' : 'Mark Mastered'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div key="rewards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-candy-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6 text-candy-yellow">
                  <Star size={48} className="fill-current" />
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-800">Candy Rewards</h2>
                <p className="text-slate-400">Redeem your points for cool digital perks!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Golden Timer', cost: 500, icon: Timer, color: 'bg-candy-yellow' },
                  { title: 'Exclusive Lofi Pack', cost: 1000, icon: Music, color: 'bg-candy-purple' },
                  { title: 'AI Pro Assistant', cost: 2500, icon: Sparkles, color: 'bg-candy-blue' },
                  { title: 'Custom Theme', cost: 5000, icon: Zap, color: 'bg-candy-pink' },
                  { title: 'Productivity Badge', cost: 100, icon: Trophy, color: 'bg-candy-green' },
                  { title: 'Secret Moods', cost: 300, icon: Smile, color: 'bg-candy-blue' },
                ].map((reward, i) => (
                  <CandyCard key={i} className="flex flex-col items-center text-center p-8">
                    <div className={`w-16 h-16 rounded-2xl ${reward.color} text-white flex items-center justify-center mb-6 shadow-lg`}>
                      <reward.icon size={32} />
                    </div>
                    <h4 className="font-bold text-slate-700 mb-2">{reward.title}</h4>
                    <div className="flex items-center gap-1 text-candy-yellow font-bold text-sm mb-6">
                      <Candy size={14} /> {reward.cost} pts
                    </div>
                    <button 
                      disabled={candyPoints < reward.cost}
                      onClick={() => {
                        if (candyPoints >= reward.cost) {
                          setCandyPoints(p => p - reward.cost);
                          alert(`Redeemed ${reward.title}!`);
                        }
                      }}
                      className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                        candyPoints >= reward.cost 
                          ? 'bg-slate-800 text-white hover:scale-105' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      }`}
                    >
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

      {/* Custom Scrollbar */}
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
