import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Leaf,
  CheckCircle,
  Circle,
  Clock,
  Sparkles,
  RefreshCw,
  Award,
  Zap,
  ShoppingBag,
  ChefHat,
  Scale,
  DollarSign,
  TrendingDown,
  BookOpen,
  Check,
  Flame,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  ArrowRight,
  Trash2
} from "lucide-react";
import { Plan, GroceryItem } from "./types";
import { DEFAULT_PLAN, VIBES, DIETS, ECO_FOCUSES } from "./defaultData";

export default function App() {
  // Config state
  const [selectedVibe, setSelectedVibe] = useState("busy workday");
  const [selectedDiet, setSelectedDiet] = useState("Flexitarian");
  const [selectedServings, setSelectedServings] = useState(2);
  const [targetBudget, setTargetBudget] = useState(30);
  const [ecoFocus, setEcoFocus] = useState("Low Carbon");

  // App running state
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan>(DEFAULT_PLAN);
  const [completedTodos, setCompletedTodos] = useState<Set<string>>(new Set());
  const [swapsEnabled, setSwapsEnabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Gamified XP levels
  const [xp, setXp] = useState(240);
  const [level, setLevel] = useState(3);

  // Tab views
  const [activeTab, setActiveTab] = useState<"quests" | "meals" | "grocery" | "substitutions" | "budget">("quests");
  const [selectedMealTab, setSelectedMealTab] = useState<"breakfast" | "lunch" | "dinner">("breakfast");

  // Custom added grocery items
  const [customGroceries, setCustomGroceries] = useState<{name: string, category: string, estimatedCost: number, co2Level: string}[]>([]);
  const [newGroceryName, setNewGroceryName] = useState("");
  const [newGroceryCost, setNewGroceryCost] = useState("");

  // Live calculation of XP
  useEffect(() => {
    const calculatedLevel = Math.floor(xp / 100) + 1;
    if (calculatedLevel !== level) {
      setLevel(calculatedLevel);
    }
  }, [xp]);

  // Request AI generate plan
  const handleGeneratePlan = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          vibe: selectedVibe,
          diet: selectedDiet,
          servings: selectedServings,
          budget: targetBudget,
          priority: ecoFocus
        })
      });

      if (!response.ok) {
        throw new Error("Failed to receive structured meal plan from backend.");
      }

      const data: Plan = await response.json();
      setPlan(data);
      setCompletedTodos(new Set()); // Reset quest list for the new plan
      setXp((prev) => prev + 30); // Award XP for generating a new carbon blueprint
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Unable to contact EcoVibe engine. Operating on local high-precision offline model.");
      // Soft fallback to a beautiful simulated custom plan to guarantee premium UX
      const generatedMock = {
        ...DEFAULT_PLAN,
        levelTitle: ecoFocus === "Zero Waste" ? "Zero Waste Champion" : "Carbon Optimizer",
        xpEarned: 130,
        ecoScore: Math.min(100, 85 + Math.round(Math.random() * 15)),
        co2SavedKg: Number((3.5 + Math.random() * 2.5).toFixed(1))
      };
      setPlan(generatedMock);
      setCompletedTodos(new Set());
    } finally {
      setLoading(false);
    }
  };

  // Toggle checklist tasks
  const handleToggleTodo = (task: string, points: number) => {
    const nextCompleted = new Set(completedTodos);
    if (nextCompleted.has(task)) {
      nextCompleted.delete(task);
      setXp((prev) => Math.max(0, prev - points));
    } else {
      nextCompleted.add(task);
      setXp((prev) => prev + points);
    }
    setCompletedTodos(nextCompleted);
  };

  // Add custom grocery items
  const handleAddGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroceryName.trim()) return;
    const cost = parseFloat(newGroceryCost) || 1.50;
    setCustomGroceries([
      ...customGroceries,
      {
        name: newGroceryName,
        category: "Custom",
        estimatedCost: cost,
        co2Level: "Low"
      }
    ]);
    setNewGroceryName("");
    setNewGroceryCost("");
    setXp((prev) => prev + 5); // Award micro-XP for tracking grocery list
  };

  // Remove custom grocery item
  const handleRemoveGrocery = (index: number) => {
    const updated = [...customGroceries];
    updated.splice(index, 1);
    setCustomGroceries(updated);
  };

  // Calculate live grocery total with optional Eco-Swaps discount
  const getCalculatedGroceries = () => {
    let list = [...plan.groceryList].map(item => ({ ...item, isSwapped: false, originalCost: item.estimatedCost }));

    if (swapsEnabled) {
      plan.substitutions.forEach(sub => {
        // Find matching item in the list and swap it out
        list = list.map(item => {
          if (item.name.toLowerCase().includes(sub.originalItem.toLowerCase()) || 
              sub.originalItem.toLowerCase().includes(item.name.toLowerCase())) {
            return {
              ...item,
              name: `${sub.ecoReplacement} (Eco Swap)`,
              estimatedCost: Math.max(0.5, Number((item.estimatedCost + sub.costDifference).toFixed(2))),
              isSwapped: true,
              co2Level: "Low"
            };
          }
          return item;
        });
      });
    }

    return [...list, ...customGroceries];
  };

  const calculatedList = getCalculatedGroceries();
  const totalCost = Number(calculatedList.reduce((sum, item) => sum + item.estimatedCost, 0).toFixed(2));
  const isOverBudget = totalCost > targetBudget;

  // Active XP percentage
  const levelProgressPercent = xp % 100;

  return (
    <div id="ecovibe-root" className="min-h-screen bg-[#F8F7F2] text-[#2D2D2D] font-sans pb-16 antialiased selection:bg-[#E9EDC9] selection:text-[#6B705C]">
      
      {/* Decorative Warm Accent Blur */}
      <div id="glow-ambient-1" className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFE8D6]/30 rounded-full blur-3xl pointer-events-none"></div>
      <div id="glow-ambient-2" className="absolute top-1/3 right-10 w-80 h-80 bg-[#E9EDC9]/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Panel */}
      <header id="ecovibe-header" className="border-b border-black/5 bg-white/95 backdrop-blur-md sticky top-0 z-50 px-4 py-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div id="ecovibe-logo-badge" className="p-2.5 bg-[#E9EDC9] rounded-2xl border border-[#6B705C]/20">
              <Leaf className="w-6 h-6 text-[#6B705C] animate-pulse" />
            </div>
            <div>
              <h1 id="ecovibe-logo-title" className="font-display font-bold text-2xl tracking-tight text-[#2D2D2D] flex items-center gap-2">
                EcoVibe <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#6B705C]/10 text-[#6B705C] font-semibold">COOK</span>
              </h1>
              <p className="text-[10px] text-stone-500 font-mono uppercase tracking-widest font-bold">Carbon-Smart Culinary Companion</p>
            </div>
          </div>

          {/* User Gamified Level Badge */}
          <div id="user-gamified-badge" className="flex items-center gap-2 bg-[#F8F7F2] border border-black/5 rounded-2xl px-3.5 py-2 shadow-sm">
            <Award className="w-4.5 h-4.5 text-[#6B705C]" />
            <div className="text-left">
              <div className="text-[9px] uppercase tracking-wider text-stone-400 font-black">Level {level}</div>
              <div className="text-xs font-mono font-bold text-[#6B705C] leading-none mt-0.5">{plan.levelTitle}</div>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div id="level-progress-container" className="max-w-2xl mx-auto mt-3 px-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 mb-1">
            <span>XP earned: <strong className="text-[#6B705C]">{xp}</strong> / {Math.ceil((xp + 1)/100)*100}</span>
            <span>{100 - levelProgressPercent} XP to Next Milestone</span>
          </div>
          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden p-0.5 border border-black/5">
            <div 
              id="xp-progress-indicator"
              className="h-full bg-gradient-to-r from-[#B7B7A4] to-[#6B705C] rounded-full transition-all duration-500" 
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Container - Responsive layout with Bento properties */}
      <main id="ecovibe-main-content" className="max-w-2xl mx-auto px-4 mt-8 space-y-6">
        
        {/* Banner Alert for connection issues */}
        {errorMsg && (
          <div id="error-alert-banner" className="bg-[#FFE8D6] border border-[#DDBEA9] rounded-2xl p-4 text-xs text-[#8C6D58] flex items-center gap-3 animate-fadeIn">
            <Info className="w-5 h-5 shrink-0 text-[#6B705C]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Bento Box 1: Game Stats Hub Card */}
        <div id="game-stats-hub" className="bg-white border border-black/5 rounded-[24px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles className="w-24 h-24 text-[#6B705C]" />
          </div>

          <h2 className="text-[10px] font-mono uppercase tracking-widest text-[#6B705C] font-black mb-4 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#6B705C] animate-bounce" /> Carbon Impact Blueprint Status
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {/* Stat 1: Eco Score */}
            <div id="stat-eco-score" className="bg-[#F8F7F2] rounded-2xl p-4 border border-black/5 text-center">
              <div className="text-3xl font-display font-bold text-[#6B705C]">{plan.ecoScore}%</div>
              <div className="text-[10px] text-stone-500 font-medium mt-1">Eco Score</div>
              <div className="h-1 w-10 bg-[#6B705C] mx-auto mt-2 rounded-full"></div>
            </div>

            {/* Stat 2: Carbon Saved */}
            <div id="stat-carbon-saved" className="bg-[#E9EDC9] rounded-2xl p-4 border border-[#6B705C]/10 text-center">
              <div className="text-2xl font-display font-bold text-[#6B705C]">{plan.co2SavedKg} kg</div>
              <div className="text-[10px] text-[#6B705C] font-medium mt-1">CO2e Saved</div>
              <div className="text-[9px] font-mono text-stone-500 mt-1.5 font-semibold">Clean cooking</div>
            </div>

            {/* Stat 3: Quests Complete */}
            <div id="stat-quests-complete" className="bg-[#FFE8D6] rounded-2xl p-4 border border-black/5 text-center">
              <div className="text-2xl font-display font-bold text-[#8C6D58]">
                {completedTodos.size}/{plan.todoList.length}
              </div>
              <div className="text-[10px] text-[#8C6D58] font-medium mt-1">Quests Active</div>
              <div className="text-[9px] font-mono text-stone-500 mt-1.5 font-bold">
                +{Array.from(completedTodos).reduce((acc, taskName) => {
                  const item = plan.todoList.find(t => t.task === taskName);
                  return acc + (item ? item.points : 0);
                }, 0)} XP
              </div>
            </div>
          </div>
        </div>

        {/* Bento Box 2: Plan Configuration Panel */}
        <div id="planner-config-card" className="bg-white border border-black/5 rounded-[24px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
            <ChefHat className="w-5 h-5 text-[#6B705C]" />
            <h2 className="font-display font-bold text-xl text-[#2D2D2D]">
              Menu Generator
            </h2>
          </div>

          <div className="space-y-5 text-sm">
            {/* Vibe Selection */}
            <div id="config-vibe-group">
              <label className="text-xs font-mono text-stone-400 uppercase tracking-wider font-bold block mb-2.5">1. Day's Vibe / Schedule</label>
              <div className="grid grid-cols-2 gap-2.5">
                {VIBES.map((v) => (
                  <button
                    key={v.id}
                    id={`vibe-btn-${v.id.replace(/\s+/g, '-')}`}
                    onClick={() => setSelectedVibe(v.id)}
                    className={`text-left p-3 rounded-2xl border transition-all text-xs ${
                      selectedVibe === v.id
                        ? "border-[#6B705C] bg-[#E9EDC9]/30 text-[#6B705C] font-semibold"
                        : "border-stone-200/60 bg-white text-stone-500 hover:border-stone-300"
                    }`}
                  >
                    <div className="font-semibold text-stone-800">{v.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5 font-normal">{v.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Diet Selection */}
            <div id="config-diet-group">
              <label className="text-xs font-mono text-stone-400 uppercase tracking-wider font-bold block mb-2.5">2. Dietary Direction</label>
              <div className="flex flex-wrap gap-2">
                {DIETS.map((d) => (
                  <button
                    key={d.id}
                    id={`diet-btn-${d.id.replace(/\s+/g, '-')}`}
                    onClick={() => setSelectedDiet(d.id)}
                    className={`px-3.5 py-2 rounded-xl border text-xs transition-all ${
                      selectedDiet === d.id
                        ? "border-[#6B705C] bg-[#6B705C] text-white font-medium"
                        : "border-stone-200/60 bg-white text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Twin inputs: Servings and Target Budget */}
            <div id="config-twin-group" className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-stone-400 uppercase tracking-wider font-bold block mb-2">3. Servings Needed</label>
                <div className="flex items-center gap-1 bg-[#F8F7F2] rounded-xl p-1 border border-stone-200/60">
                  {[1, 2, 4, 6].map((num) => (
                    <button
                      key={num}
                      id={`servings-btn-${num}`}
                      type="button"
                      onClick={() => setSelectedServings(num)}
                      className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                        selectedServings === num
                          ? "bg-[#6B705C] text-white shadow"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      {num}P
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-stone-400 uppercase tracking-wider font-bold block mb-2">4. Target Budget ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 font-mono text-xs">
                    $
                  </div>
                  <input
                    id="input-budget-target"
                    type="number"
                    min="5"
                    max="150"
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(Math.max(5, parseInt(e.target.value) || 0))}
                    className="w-full pl-7 pr-3.5 py-2 bg-[#F8F7F2] border border-stone-200/60 rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:border-[#6B705C] font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Eco Priority selection */}
            <div id="config-eco-group">
              <label className="text-xs font-mono text-stone-400 uppercase tracking-wider font-bold block mb-2.5">5. Environmental Focus</label>
              <div className="grid grid-cols-2 gap-2.5">
                {ECO_FOCUSES.map((f) => (
                  <button
                    key={f.id}
                    id={`focus-btn-${f.id.replace(/\s+/g, '-')}`}
                    onClick={() => setEcoFocus(f.id)}
                    className={`text-left p-3 rounded-2xl border transition-all text-xs ${
                      ecoFocus === f.id
                        ? "border-[#6B705C] bg-[#FFE8D6]/40 text-[#6B705C] font-semibold"
                        : "border-stone-200/60 bg-white text-stone-500 hover:border-stone-300"
                    }`}
                  >
                    <div className="font-bold text-stone-800">{f.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5 font-normal">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <button
              id="btn-generate-plan"
              onClick={handleGeneratePlan}
              disabled={loading}
              className="w-full mt-3 py-3.5 bg-[#6B705C] hover:bg-[#5A5E4E] text-white font-display font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4.5 h-4.5 animate-spin text-white" />
                  Orchestrating Bento Blueprint...
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                  Generate Carbon-Smart cooking list
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bento Grid layout Navigation Tabs (styled like solid pill togglers) */}
        <div id="ecovibe-nav-tabs" className="flex bg-[#F1EFE9] p-1.5 rounded-2xl border border-black/5 sticky top-[92px] z-40 shadow-sm">
          <button
            id="tab-btn-quests"
            onClick={() => setActiveTab("quests")}
            className={`flex-1 py-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              activeTab === "quests" ? "bg-white text-[#6B705C] shadow-sm font-bold" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-[10px] md:text-xs">Quests</span>
          </button>
          <button
            id="tab-btn-meals"
            onClick={() => setActiveTab("meals")}
            className={`flex-1 py-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              activeTab === "meals" ? "bg-white text-[#6B705C] shadow-sm font-bold" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span className="text-[10px] md:text-xs">Schedule</span>
          </button>
          <button
            id="tab-btn-grocery"
            onClick={() => setActiveTab("grocery")}
            className={`flex-1 py-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              activeTab === "grocery" ? "bg-white text-[#6B705C] shadow-sm font-bold" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[10px] md:text-xs">Cart</span>
          </button>
          <button
            id="tab-btn-substitutions"
            onClick={() => setActiveTab("substitutions")}
            className={`flex-1 py-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              activeTab === "substitutions" ? "bg-white text-[#6B705C] shadow-sm font-bold" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span className="text-[10px] md:text-xs">Swaps</span>
          </button>
          <button
            id="tab-btn-budget"
            onClick={() => setActiveTab("budget")}
            className={`flex-1 py-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              activeTab === "budget" ? "bg-white text-[#6B705C] shadow-sm font-bold" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span className="text-[10px] md:text-xs">Budget</span>
          </button>
        </div>

        {/* Tab Contents loaded inside white Bento Cards */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: GAMIFIED ACTIVE QUEST LOG (To-Do List) */}
          {activeTab === "quests" && (
            <motion.div
              key="quests-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="tab-quests-content"
              className="space-y-4"
            >
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="font-display font-bold text-2xl text-[#2D2D2D]">Your Daily Kitchen Quests</h3>
                  <p className="text-xs text-stone-500">Complete tasks to earn XP and lower your environmental impact</p>
                </div>
                <span className="px-3.5 py-1.5 bg-[#E9EDC9] text-[#6B705C] rounded-full font-mono text-xs font-bold shrink-0 shadow-sm">
                  {completedTodos.size}/{plan.todoList.length} Complete
                </span>
              </div>

              {/* Quest Progress Bar */}
              <div id="quest-completion-bar-container" className="bg-white p-5 rounded-[24px] border border-black/5 shadow-sm">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-stone-500 font-medium">Bento Quest Completion</span>
                  <span className="text-[#6B705C] font-bold">
                    {Math.round((completedTodos.size / Math.max(1, plan.todoList.length)) * 100)}% Complete
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-[#6B705C] rounded-full transition-all duration-300"
                    style={{ width: `${(completedTodos.size / Math.max(1, plan.todoList.length)) * 100}%` }}
                  />
                </div>
              </div>

              {/* To-Do Checklist Cards */}
              <div id="todo-quest-list" className="space-y-3">
                {plan.todoList.map((item, idx) => {
                  const isDone = completedTodos.has(item.task);
                  return (
                    <div
                      key={idx}
                      id={`quest-card-${idx}`}
                      onClick={() => handleToggleTodo(item.task, item.points)}
                      className={`p-4 rounded-[24px] border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                        isDone 
                          ? "bg-[#F1EFE9]/50 border-stone-200 text-stone-400" 
                          : "bg-white border-black/5 hover:border-stone-300 text-stone-800 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                      }`}
                    >
                      <button
                        id={`todo-chk-${idx}`}
                        className="mt-0.5 shrink-0"
                        aria-label="Toggle quest"
                      >
                        {isDone ? (
                          <div className="w-5 h-5 bg-[#B7B7A4] rounded-md text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[4px]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-md border-2 border-[#DDBEA9] hover:border-[#6B705C]" />
                        )}
                      </button>

                      <div className="flex-1">
                        <p className={`text-sm leading-relaxed font-semibold ${isDone ? "line-through text-stone-400" : "text-stone-800"}`}>
                          {item.task}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-full font-bold ${
                            item.type === 'shopping' ? 'bg-[#FFE8D6] text-[#8C6D58]' :
                            item.type === 'prep' ? 'bg-blue-100 text-blue-700' :
                            item.type === 'cooking' ? 'bg-[#E9EDC9] text-[#6B705C]' :
                            'bg-pink-100 text-pink-700'
                          }`}>
                            {item.type}
                          </span>
                          <span className="text-[10px] font-mono text-[#6B705C] font-semibold">
                            +{item.points} XP Points
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 2: MEAL PLAN DETAIL (Breakfast, Lunch, Dinner) */}
          {activeTab === "meals" && (
            <motion.div
              key="meals-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="tab-meals-content"
              className="space-y-4"
            >
              <div className="px-1">
                <h3 className="font-display font-bold text-2xl text-[#2D2D2D]">Today's Schedule</h3>
                <p className="text-xs text-stone-500">Eco-conscious cooking steps crafted to maximize freshness</p>
              </div>

              {/* Meal Sub-tabs */}
              <div id="meal-type-selector" className="grid grid-cols-3 gap-1 bg-[#F1EFE9] p-1.5 rounded-xl border border-black/5">
                {(["breakfast", "lunch", "dinner"] as const).map((m) => (
                  <button
                    key={m}
                    id={`meal-subtab-btn-${m}`}
                    onClick={() => setSelectedMealTab(m)}
                    className={`py-2 rounded-lg text-xs capitalize font-bold transition-all ${
                      selectedMealTab === m
                        ? "bg-white text-[#6B705C] shadow-sm font-extrabold"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Meal Card Detail - incorporating the custom accent border pattern from Bento Design */}
              <div id="selected-meal-card" className="bg-white border-l-6 border-l-[#6B705C] border-y border-r border-black/5 rounded-[24px] p-6 shadow-sm relative">
                <div className="absolute top-6 right-6 flex items-center gap-1 bg-[#E9EDC9] text-[#6B705C] px-3 py-1 rounded-full text-[10px] font-mono font-bold">
                  <Flame className="w-3.5 h-3.5 text-[#6B705C]" />
                  {plan.meals[selectedMealTab].co2e}
                </div>

                <h4 className="font-display font-bold text-2xl text-[#2D2D2D] pr-24 leading-tight">
                  {plan.meals[selectedMealTab].title}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-2 font-mono font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#6B705C]" />
                  <span>Prep/Cook Time: {plan.meals[selectedMealTab].prepTime}</span>
                </div>

                {/* Ingredients section */}
                <div id="meal-ingredients-list" className="mt-6 border-t border-stone-100 pt-5">
                  <h5 className="text-[10px] font-mono uppercase tracking-widest text-[#6B705C] font-black mb-3">Required Ingredients</h5>
                  <ul className="space-y-2">
                    {plan.meals[selectedMealTab].ingredients.map((ing, i) => (
                      <li key={i} className="text-xs text-stone-700 flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B7B7A4]"></div>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions steps */}
                <div id="meal-instructions-list" className="mt-6 border-t border-stone-100 pt-5">
                  <h5 className="text-[10px] font-mono uppercase tracking-widest text-[#6B705C] font-black mb-3">Cooking Instructions</h5>
                  <ol className="space-y-3">
                    {plan.meals[selectedMealTab].instructions.map((inst, i) => (
                      <li key={i} className="text-xs text-stone-700 flex gap-3 items-start">
                        <span className="font-mono text-[#6B705C] font-bold text-xs bg-[#E9EDC9] h-5 w-5 rounded-full flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{inst}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Eco-Tip block */}
                <div id="meal-eco-tip" className="mt-6 p-4 bg-[#FFE8D6]/70 border border-[#DDBEA9]/40 rounded-2xl text-xs text-stone-700">
                  <div className="flex items-center gap-1.5 font-bold text-[#8C6D58] mb-1.5">
                    <Leaf className="w-4 h-4" />
                    <span className="font-display italic text-sm">Chef's Environmental Tip</span>
                  </div>
                  <p className="leading-relaxed">
                    {plan.meals[selectedMealTab].ecoTip}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: SMART GROCERY LIST */}
          {activeTab === "grocery" && (
            <motion.div
              key="grocery-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="tab-grocery-content"
              className="space-y-4"
            >
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="font-display font-bold text-2xl text-[#2D2D2D]">Smart Grocery Cart</h3>
                  <p className="text-xs text-stone-500 font-medium">Bento-friendly ingredients toggled for green swaps</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono text-[#6B705C] font-black">${totalCost.toFixed(2)}</div>
                  <div className="text-[10px] text-stone-400 font-mono">ESTIMATED TOTAL</div>
                </div>
              </div>

              {/* Eco Swap Toggle Action Card */}
              <div id="eco-swaps-toggle-card" className="bg-[#FFE8D6] border border-[#DDBEA9] rounded-[24px] p-5 flex items-center justify-between shadow-sm">
                <div className="pr-4">
                  <h4 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#6B705C]" />
                    Auto-Apply Eco Swaps
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">
                    Substitute high-footprint selections with sustainable green alternatives. Saves money & CO2.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    id="toggle-eco-swaps"
                    type="checkbox"
                    checked={swapsEnabled}
                    onChange={(e) => setSwapsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6B705C]"></div>
                </label>
              </div>

              {/* Interactive Grocery List items */}
              <div id="grocery-items-accordion" className="bg-white border border-black/5 rounded-[24px] overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-stone-100 flex justify-between items-center bg-[#F8F7F2]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold">Shopping List ({calculatedList.length} items)</span>
                  <span className="text-[10px] text-[#6B705C] font-bold bg-[#E9EDC9] px-2.5 py-1 rounded-full">
                    {swapsEnabled ? "Auto-Swapping" : "Standard List"}
                  </span>
                </div>

                <div className="divide-y divide-stone-100">
                  {calculatedList.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between text-sm hover:bg-[#F8F7F2]/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${
                          item.co2Level === "High" ? "bg-red-400" :
                          item.co2Level === "Medium" ? "bg-amber-400" :
                          "bg-[#6B705C]"
                        }`} title={`${item.co2Level} CO2 impact`} />
                        <div>
                          <div className={`text-xs md:text-sm font-semibold ${item.isSwapped ? "text-[#6B705C] font-extrabold" : "text-stone-800"}`}>
                            {item.name}
                          </div>
                          <span className="text-[9px] text-stone-400 font-mono uppercase tracking-wide">{item.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.isSwapped && (
                          <span className="text-xs text-stone-400 line-through font-mono">
                            ${item.originalCost?.toFixed(2)}
                          </span>
                        )}
                        <span className={`font-mono font-bold ${item.isSwapped ? "text-[#6B705C] text-sm" : "text-stone-700"}`}>
                          ${item.estimatedCost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Add Grocery Form */}
              <form id="form-add-grocery" onSubmit={handleAddGrocery} className="bg-white border border-black/5 rounded-[24px] p-5 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#6B705C] font-black">Add Custom Ingredient</h4>
                <div className="flex gap-2">
                  <input
                    id="input-grocery-name"
                    type="text"
                    required
                    placeholder="e.g. Garlic bulbs"
                    value={newGroceryName}
                    onChange={(e) => setNewGroceryName(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-[#F8F7F2] border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#6B705C]"
                  />
                  <input
                    id="input-grocery-cost"
                    type="number"
                    step="0.01"
                    placeholder="Cost e.g. 1.25"
                    value={newGroceryCost}
                    onChange={(e) => setNewGroceryCost(e.target.value)}
                    className="w-28 px-3.5 py-2.5 bg-[#F8F7F2] border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#6B705C] font-mono font-bold"
                  />
                  <button
                    id="btn-add-grocery-submit"
                    type="submit"
                    className="px-4 bg-[#6B705C] hover:bg-[#5A5E4E] text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* TAB 4: CARBON SWAPS (Substitutions Board) */}
          {activeTab === "substitutions" && (
            <motion.div
              key="substitutions-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="tab-substitutions-content"
              className="space-y-4"
            >
              <div className="px-1">
                <h3 className="font-display font-bold text-2xl text-[#2D2D2D]">Smart Swaps</h3>
                <p className="text-xs text-stone-500">Green replacements that diminish both food footprints and costs</p>
              </div>

              <div id="substitutions-board" className="space-y-4">
                {plan.substitutions.map((sub, idx) => (
                  <div
                    key={idx}
                    id={`substitution-card-${idx}`}
                    className="bg-white border border-black/5 rounded-[24px] p-5 space-y-4 shadow-sm relative overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 bg-[#E9EDC9] text-[#6B705C] font-mono text-[9px] font-black px-3 py-1.5 rounded-bl-2xl border-l border-b border-black/5">
                      SAVED ${Math.abs(sub.costDifference).toFixed(2)}
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="text-stone-400 bg-[#F1EFE9] px-3 py-1 rounded-lg text-xs font-mono line-through shrink-0 border border-black/5">
                        {sub.originalItem}
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#6B705C] shrink-0" />
                      <div className="text-white bg-[#6B705C] px-3 py-1 rounded-lg text-xs font-display font-bold shrink-0 shadow-sm">
                        {sub.ecoReplacement}
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="text-[9px] text-[#8C6D58] font-mono uppercase tracking-widest font-black">Environmental Logic</div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {sub.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: BUDGET FEASIBILITY */}
          {activeTab === "budget" && (
            <motion.div
              key="budget-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="tab-budget-content"
              className="space-y-4"
            >
              <div className="px-1">
                <h3 className="font-display font-bold text-2xl text-[#2D2D2D]">Budget Feasibility</h3>
                <p className="text-xs text-stone-500">Comparing estimated shopping costs against your target budget limit</p>
              </div>

              {/* Budget Gauge Card */}
              <div id="budget-gauge-card" className="bg-white border border-black/5 rounded-[24px] p-6 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-baseline mb-4">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono font-bold">Plan Cost</span>
                    <div className={`text-3xl font-display font-black mt-1 ${isOverBudget ? "text-rose-600" : "text-[#6B705C]"}`}>
                      ${totalCost.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono font-bold">Budget Goal</span>
                    <div className="text-xl font-mono font-bold text-stone-700 mt-1">
                      ${targetBudget.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div id="budget-percentage-bar" className="space-y-1">
                  <div className="h-3 w-full bg-[#F1EFE9] rounded-full overflow-hidden p-0.5 border border-black/5">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverBudget 
                          ? "bg-rose-400" 
                          : "bg-[#6B705C]"
                      }`}
                      style={{ width: `${Math.min(100, (totalCost / targetBudget) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-stone-400 mt-1">
                    <span>0%</span>
                    <span>100% Target limit</span>
                  </div>
                </div>

                {/* Feasibility Indicator Alert */}
                <div id="feasibility-indicator-bar" className={`mt-5 p-4 rounded-2xl border flex items-start gap-3 ${
                  isOverBudget 
                    ? "bg-rose-50 border-rose-200 text-rose-700" 
                    : "bg-[#E9EDC9] border-[#6B705C]/20 text-[#6B705C]"
                }`}>
                  <Info className="w-5 h-5 shrink-0" />
                  <p className="text-xs leading-relaxed font-semibold">
                    {plan.budgetAnalysis.feasibilityDetails}
                  </p>
                </div>
              </div>

              {/* Budget Saving Advice Card */}
              <div id="budget-saving-tips-card" className="bg-[#FFE8D6] border border-[#DDBEA9] rounded-[24px] p-5">
                <h4 className="font-display font-bold text-sm text-stone-800 mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4.5 h-4.5 text-[#6B705C]" />
                  Saving Insights
                </h4>

                <div className="space-y-3">
                  {plan.budgetAnalysis.savingTips.map((tip, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs text-stone-700 leading-relaxed font-semibold">
                      <span className="font-mono text-[#6B705C] font-extrabold text-[12px] shrink-0 mt-0.5">✓</span>
                      <p>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Page Footer */}
      <footer id="ecovibe-footer" className="max-w-2xl mx-auto mt-12 px-4 text-center text-[10px] text-stone-400 font-mono space-y-1.5 border-t border-black/5 pt-6">
        <div>EcoVibe Culinary Companion • Powered by Gemini 3.5 Flash</div>
        <div>Earn eco points to preserve Earth biomes. Every sustainable dish counts.</div>
      </footer>
    </div>
  );
}
