import React, { useState, useEffect, useRef } from 'react';
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
  Angry
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
  { title: "Ethereal Piano", artist: "Soft Keys", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
  { title: "Midnight Keys", artist: "Dreamy Piano", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" },
  { title: "Morning Dew", artist: "Nature Piano", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" },
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

const CandyCard = ({ children, className = "", title, color = "bg-white" }: { children: React.ReactNode, className?: string, title?: string, color?: string }) => (
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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Persistence
  const [tasks, setTasks] = useState<Task[]>(() => JSON.parse(localStorage.getItem('kelarin_tasks') || '[]'));
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => JSON.parse(localStorage.getItem('kelarin_schedules') || '[]'));
  const [notes, setNotes] = useState<Note[]>(() => JSON.parse(localStorage.getItem('kelarin_notes') || '[]'));
  const [waterIntake, setWaterIntake] = useState<number>(() => Number(localStorage.getItem('kelarin_water') || '0'));

  useEffect(() => {
    localStorage.setItem('kelarin_tasks', JSON.stringify(tasks));
    localStorage.setItem('kelarin_schedules', JSON.stringify(schedules));
    localStorage.setItem('kelarin_notes', JSON.stringify(notes));
    localStorage.setItem('kelarin_water', waterIntake.toString());
  }, [tasks, schedules, notes, waterIntake]);

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
  const [isActive, setIsActive] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
      if (isPlayingMusic) setIsPlayingMusic(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isPlayingMusic]);

  useEffect(() => {
    if (isPlayingMusic && isActive) {
      audioRef.current?.play().catch(e => console.log("Audio play failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlayingMusic, isActive, currentSongIndex]);

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
    <div className="min-h-screen flex flex-col md:flex-row bg-bg-light bg-candy-mesh selection:bg-candy-pink selection:text-white">
      <ParallaxBackground />
      <audio ref={audioRef} src={CANDY_SONGS[currentSongIndex].url} loop />
      
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 glass-candy sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-candy-pink rounded-lg flex items-center justify-center shadow-md">
            <Zap size={18} className="text-white fill-current" />
          </div>
          <span className="text-lg font-display font-bold tracking-tighter text-candy-pink">KELAR.IN</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 glass-candy m-4 rounded-[2.5rem] p-6 flex flex-col gap-8 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex
      `}>
        <div className="hidden md:flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-candy-pink rounded-xl flex items-center justify-center shadow-lg">
            <Zap size={24} className="text-white fill-current" />
          </div>
          <span className="text-xl font-display font-bold tracking-tighter text-candy-pink text-glow-candy">KELAR.IN</span>
        </div>

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
      <main className="flex-1 p-4 md:p-8 relative z-10 overflow-y-auto h-screen custom-scrollbar">
        <header className="hidden md:flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1 text-slate-800">Productivity Hub.</h1>
            <p className="text-slate-400 text-sm">Everything is ready for your success!</p>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <CandyCard title="Focus Music" className="col-span-1 md:col-span-3" color="bg-candy-purple/5">
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
                      <button onClick={() => setTasks(tasks.map(x => x.id === t.id ? {...x, completed: !x.completed} : x))} className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${t.completed ? 'bg-candy-pink border-candy-pink' : 'border-slate-200 hover:border-candy-pink'}`}>
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
                              'bg-candy-yellow/10 text-candy-yellow'
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
                      {schedules.filter(s => s.day === day).length === 0 && (
                        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl opacity-30">
                          <span className="text-[10px] font-bold uppercase tracking-tighter">Free</span>
                        </div>
                      )}
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
                          {studyMaterial && (
                            <button 
                              onClick={() => setStudyMaterial('')}
                              className="px-4 py-2 bg-white text-red-400 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                      <textarea 
                        value={studyMaterial}
                        onChange={(e) => {
                          setStudyMaterial(e.target.value);
                          if (e.target.value) {
                            setFileName(null);
                            setUploadedImage(null);
                          }
                        }}
                        placeholder="Paste your notes here or upload a file..."
                        className="w-full h-64 bg-white rounded-2xl p-6 outline-none border border-transparent focus:border-candy-purple text-slate-700 resize-none shadow-inner"
                      />
                      {fileName && (
                        <div className="flex items-center gap-2 p-3 bg-candy-purple/5 rounded-xl border border-candy-purple/10">
                          <FileText size={18} className="text-candy-purple" />
                          <span className="text-sm font-bold text-slate-600 truncate max-w-xs">{fileName}</span>
                          <button onClick={() => { setFileName(null); setUploadedImage(null); setStudyMaterial(''); }} className="ml-auto text-slate-400 hover:text-red-400">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-400 font-medium italic">Pro tip: The more detailed the content, the better the quiz!</p>
                        <button 
                          onClick={generateQuiz}
                          disabled={!studyMaterial.trim() && !uploadedImage}
                          className="px-8 py-4 bg-candy-purple text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
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
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-candy-purple/20 rounded-full" />
                    <div className="absolute inset-0 w-24 h-24 border-4 border-candy-purple border-t-transparent rounded-full animate-spin" />
                    <BrainCircuit className="absolute inset-0 m-auto text-candy-purple animate-pulse" size={32} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-700">AI is reading your material...</h3>
                    <p className="text-slate-400">Crafting personalized questions just for you.</p>
                  </div>
                </div>
              )}

              {quizQuestions.length > 0 && !quizFinished && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-candy-purple text-white rounded-xl flex items-center justify-center font-bold">
                        {currentQuizIndex + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-700">Question {currentQuizIndex + 1} of {quizQuestions.length}</h3>
                        <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
                            className="h-full bg-candy-purple"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Score: {quizScore}
                    </div>
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
                      {quizQuestions[currentQuizIndex].options.map((option, idx) => {
                        const isCorrect = idx === quizQuestions[currentQuizIndex].correctAnswer;
                        const isSelected = idx === selectedOption;
                        
                        let buttonClass = "border-slate-50 hover:border-candy-purple hover:bg-candy-purple/5";
                        if (showExplanation) {
                          if (isCorrect) buttonClass = "border-candy-green bg-candy-green/10";
                          else if (isSelected) buttonClass = "border-candy-pink bg-candy-pink/10";
                          else buttonClass = "border-slate-50 opacity-50";
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={showExplanation}
                            className={`w-full text-left p-6 rounded-2xl border-2 transition-all group flex items-center gap-4 ${buttonClass}`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-colors ${
                              showExplanation && isCorrect ? 'bg-candy-green text-white' :
                              showExplanation && isSelected && !isCorrect ? 'bg-candy-pink text-white' :
                              'bg-slate-100 text-slate-500 group-hover:bg-candy-purple group-hover:text-white'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="font-medium text-slate-700">{option}</span>
                            {showExplanation && isCorrect && <CheckCircle2 size={20} className="ml-auto text-candy-green" />}
                            {showExplanation && isSelected && !isCorrect && <XCircle size={20} className="ml-auto text-candy-pink" />}
                          </button>
                        );
                      })}
                    </div>

                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${selectedOption === quizQuestions[currentQuizIndex].correctAnswer ? 'bg-candy-green/10 text-candy-green' : 'bg-candy-pink/10 text-candy-pink'}`}>
                              <Sparkles size={18} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-700 mb-1">Explanation</h4>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {quizQuestions[currentQuizIndex].explanation}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={nextQuestion}
                            className="w-full mt-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors"
                          >
                            {currentQuizIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}

              {quizFinished && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-32 h-32 bg-candy-yellow/10 rounded-full flex items-center justify-center mx-auto mb-8 text-candy-yellow relative">
                    <Trophy size={64} />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-2 -right-2 text-candy-pink"
                    >
                      <Sparkles size={32} />
                    </motion.div>
                  </div>
                  <h2 className="text-4xl font-display font-bold text-slate-800 mb-2">Quiz Complete!</h2>
                  <p className="text-slate-400 mb-8">You've mastered this material.</p>
                  
                  <div className="max-w-md mx-auto glass-candy p-8 rounded-[2rem] bg-white/50 mb-12">
                    <div className="text-6xl font-display font-bold text-candy-purple mb-2">
                      {Math.round((quizScore / quizQuestions.length) * 100)}%
                    </div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Your Final Score: {quizScore} / {quizQuestions.length}
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => {
                        setQuizQuestions([]);
                        setQuizFinished(false);
                      }}
                      className="px-8 py-4 bg-candy-purple text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
                    >
                      Try Another Material
                    </button>
                    <button 
                      onClick={generateQuiz}
                      className="px-8 py-4 bg-white text-slate-600 rounded-2xl font-bold shadow-md hover:scale-105 transition-transform"
                    >
                      Retake Quiz
                    </button>
                  </div>
                </motion.div>
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
                    {moodHistory.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 italic">No moods recorded today.</div>
                    ) : (
                      moodHistory.map((entry) => (
                        <div key={entry.id} className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-white/20">
                          <div className={`p-2 rounded-xl bg-slate-100 ${entry.color}`}>
                            <entry.icon size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-slate-700">{entry.mood}</div>
                            <div className="text-xs text-slate-400">{entry.time}</div>
                          </div>
                        </div>
                      ))
                    )}
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
              <div className="flex gap-3 mb-12">
                {[15, 25, 45, 60].map(mins => (
                  <button 
                    key={mins}
                    onClick={() => {
                      const secs = mins * 60;
                      setFocusDuration(secs);
                      setTimeLeft(secs);
                      setIsActive(false);
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
  );
}
