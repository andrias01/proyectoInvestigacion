import React, { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { 
  Search, 
  Download, 
  Plus, 
  Filter, 
  Briefcase, 
  Users, 
  TrendingUp,
  RefreshCw,
  Target,
  AlertCircle,
  CheckCircle,
  TrendingDown
} from "lucide-react";

// --- Datos de ejemplo ---
const competencias = [
  "Comunicación",
  "Trabajo en equipo", 
  "Pensamiento crítico",
  "Tecnología",
  "Ética",
  "Inglés"
];

const radarData = competencias.map((c) => ({
  competencia: c,
  declarado: Math.round(55 + Math.random() * 40),
  observado: Math.round(40 + Math.random() * 45),
  objetivo: Math.round(70 + Math.random() * 25),
}));

const brechas = radarData.map((d) => ({
  competencia: d.competencia,
  brecha: d.declarado - d.observado,
}));

const historicalData = Array.from({ length: 6 }, (_, i) => ({
  mes: ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][i],
  empleabilidad: Math.round(60 + Math.random() * 30),
  satisfaccion: Math.round(65 + Math.random() * 25),
}));

const empresas = [
  { nombre: "Nacional de Chocolates", satisfaccion: 82, entrevistas: 7 },
  { nombre: "Bancolombia", satisfaccion: 78, entrevistas: 9 },
  { nombre: "Cámara de Comercio", satisfaccion: 74, entrevistas: 4 },
  { nombre: "Zona Franca", satisfaccion: 69, entrevistas: 3 },
];

// --- Componentes Simples ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-neutral-900 border border-neutral-800 rounded-lg p-4 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", size = "md", className = "", disabled = false }) => {
  const variants = {
    primary: "bg-lime-400 text-neutral-900 hover:bg-lime-500",
    secondary: "bg-neutral-700 text-neutral-100 hover:bg-neutral-600",
    outline: "border border-neutral-600 text-neutral-300 hover:border-lime-400 hover:text-lime-400"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-lg font-medium transition-all duration-200 
        flex items-center justify-center gap-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

const StatCard = ({ label, value, trend, icon: Icon, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const numValue = parseInt(value) || 0;
      let current = 0;
      const increment = numValue / 30;
      const counter = setInterval(() => {
        current += increment;
        if (current >= numValue) {
          setDisplayValue(numValue);
          clearInterval(counter);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 30);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <Card className="hover:border-neutral-700 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className={`h-3 w-3 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent">
        {typeof value === 'string' && value.includes('%') ? `${displayValue}%` : displayValue}
      </p>
    </Card>
  );
};

const Thermometer = ({ value, label }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 500);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="flex items-end gap-4">
      <div className="h-32 w-8 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="w-full bg-gradient-to-t from-green-500 to-lime-400 transition-all duration-1000 ease-out"
          style={{ height: `${animatedValue}%`, minHeight: animatedValue > 0 ? 4 : 0 }}
        />
      </div>
      <div>
        <p className="text-2xl font-bold text-lime-400">{value}%</p>
        <p className="text-xs text-neutral-400">{label}</p>
      </div>
    </div>
  );
};

export default function RadarEgresados() {
  const [activeTab, setActiveTab] = useState("radar");
  const [isLoading, setIsLoading] = useState(false);
  
  const percepcionGlobal = Math.round(
    radarData.reduce((acc, d) => acc + d.observado, 0) / radarData.length
  );

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center font-bold text-neutral-900">
                R
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent">
                  Radar de Egresados 2025
                </h1>
                <p className="text-sm text-neutral-400">Análisis de competencias y empleabilidad</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <input
                  className="pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-lime-400 transition-colors w-64"
                  placeholder="Buscar..."
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Termómetro */}
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-lime-400" />
                Indicador Global
              </h3>
              <Thermometer value={percepcionGlobal} label="Valoración empleadores" />
              <div className="mt-4 p-3 bg-neutral-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  Meta: 75% • Actual: {percepcionGlobal}%
                </div>
              </div>
            </Card>

            {/* Acciones */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4" />
                  Nueva encuesta
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4" />
                  Cargar egresados
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="h-4 w-4" />
                  Panel empleadores
                </Button>
              </div>
            </Card>

            {/* Próximas entrevistas */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Próximas Entrevistas</h3>
              <div className="space-y-3">
                {[
                  { empresa: "EPM", fecha: "15 Sep" },
                  { empresa: "Nutresa", fecha: "18 Sep" },
                  { empresa: "Ruta N", fecha: "22 Sep" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-neutral-800/30 rounded">
                    <span className="text-sm">{item.empresa}</span>
                    <span className="text-xs text-neutral-400">{item.fecha}</span>
                  </div>
                ))}
              </div>
            </Card>
          </aside>

          {/* Main Dashboard */}
          <section className="lg:col-span-3 space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Egresados" value="236" trend={12} icon={Users} delay={100} />
              <StatCard label="Empleadores" value="23" trend={8} icon={Briefcase} delay={200} />
              <StatCard label="Empleabilidad" value="76%" trend={-2} icon={TrendingUp} delay={300} />
              <StatCard label="Brecha Prom." value="12%" trend={-5} icon={Target} delay={400} />
            </div>

            {/* Tabs */}
            <div className="space-y-4">
              <div className="flex gap-2 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                {[
                  { id: "radar", label: "Competencias" },
                  { id: "brechas", label: "Brechas" },
                  { id: "empleadores", label: "Empleadores" },
                  { id: "tendencias", label: "Tendencias" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded transition-all ${
                      activeTab === tab.id 
                        ? 'bg-lime-400 text-neutral-900' 
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Radar Tab */}
              {activeTab === "radar" && (
                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <Card>
                      <h3 className="text-lg font-semibold mb-4">Perfil de Competencias</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData}>
                            <PolarGrid stroke="#404040" />
                            <PolarAngleAxis dataKey="competencia" tick={{ fill: "#a3a3a3", fontSize: 12 }} />
                            <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#737373", fontSize: 10 }} />
                            <Radar name="Declarado" dataKey="declarado" stroke="#84cc16" fill="#84cc16" fillOpacity={0.2} />
                            <Radar name="Observado" dataKey="observado" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                            <Radar name="Objetivo" dataKey="objetivo" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeDasharray="5 5" />
                            <Legend />
                            <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>
                  <div>
                    <Card>
                      <h3 className="text-lg font-semibold mb-4">Competencias Críticas</h3>
                      <div className="space-y-3">
                        {brechas
                          .sort((a, b) => Math.abs(b.brecha) - Math.abs(a.brecha))
                          .slice(0, 4)
                          .map((item) => (
                            <div key={item.competencia} className="flex justify-between items-center p-2 bg-neutral-800/50 rounded">
                              <span className="text-sm">{item.competencia}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                Math.abs(item.brecha) > 15 ? 'bg-red-400/20 text-red-400' : 'bg-yellow-400/20 text-yellow-400'
                              }`}>
                                {item.brecha > 0 ? '+' : ''}{item.brecha}%
                              </span>
                            </div>
                          ))
                        }
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Brechas Tab */}
              {activeTab === "brechas" && (
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Análisis de Brechas</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={brechas}>
                        <XAxis dataKey="competencia" tick={{ fill: "#a3a3a3", fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                        <YAxis tick={{ fill: "#737373" }} />
                        <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }} />
                        <Bar dataKey="brecha" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}

              {/* Empleadores Tab */}
              {activeTab === "empleadores" && (
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Panel de Empleadores</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {empresas.map((empresa) => (
                      <div key={empresa.nombre} className="p-4 bg-neutral-800/50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">{empresa.nombre}</h4>
                          <span className="text-xs bg-neutral-700 px-2 py-1 rounded">{empresa.entrevistas} entrevistas</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Satisfacción</span>
                            <span>{empresa.satisfaccion}%</span>
                          </div>
                          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-lime-400 to-green-500 transition-all duration-1000"
                              style={{ width: `${empresa.satisfaccion}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Tendencias Tab */}
              {activeTab === "tendencias" && (
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Evolución Temporal</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData}>
                        <XAxis dataKey="mes" tick={{ fill: "#a3a3a3" }} />
                        <YAxis tick={{ fill: "#737373" }} />
                        <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }} />
                        <Legend />
                        <Line type="monotone" dataKey="empleabilidad" stroke="#10b981" strokeWidth={3} name="Empleabilidad" />
                        <Line type="monotone" dataKey="satisfaccion" stroke="#84cc16" strokeWidth={3} name="Satisfacción" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}