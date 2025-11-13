import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BookOpen,
  Target,
  Brain,
  FlaskConical,
  Database,
  BarChart3,
  FileText,
  CheckCircle2,
  BookMarked,
  Lightbulb,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import "./css/ResearchGuide.css";

const defaultState = {
  problema: "",
  objGeneral: "",
  objEspecificos: "",
  marco: "",
  enfoque: "cuantitativo",
  diseno: "",
  muestra: "",
  instrumentos: "",
  resultados: "",
  conclusion: "",
  refs: "",
  checklist: {
    consentimiento: false,
    cronograma: false,
    protocolos: false,
    resguardo: false,
  },
};

const STORAGE_KEY = "research-guide-v1";
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const steps = [
  { id: "paso1", title: "1. Problema", icon: BookOpen },
  { id: "paso2", title: "2. Objetivos", icon: Target },
  { id: "paso3", title: "3. Marco teórico", icon: Brain },
  { id: "paso4", title: "4. Metodología", icon: FlaskConical },
  { id: "paso5", title: "5. Recolección", icon: Database },
  { id: "paso6", title: "6. Análisis", icon: BarChart3 },
  { id: "paso7", title: "7. Resultados", icon: FileText },
  { id: "paso8", title: "8. Conclusiones", icon: CheckCircle2 },
  { id: "paso9", title: "9. Referencias", icon: BookMarked },
];

const ResearchGuide = () => {
  const [form, setForm] = useState(defaultState);
  const [restored, setRestored] = useState(false);
  const [activeStep, setActiveStep] = useState("paso1");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("pasos");
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm(parsed);
        setPdfUrl("");
        setApiMessage("");
        setApiError("");
        setRestored(true);
        const timeout = setTimeout(() => setRestored(false), 3000);
        return () => clearTimeout(timeout);
      } catch (error) {
        console.error("No se pudo restaurar el estado", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const clearPdfFeedback = () => {
    setPdfUrl("");
    setApiMessage("");
    setApiError("");
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    clearPdfFeedback();
  };

  const handleChecklistChange = (key) => {
    setForm((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [key]: !prev.checklist[key],
      },
    }));
    clearPdfFeedback();
  };

  const handleStepClick = (id) => {
    setActivePanel("pasos");
    setActiveStep(id);
    setSidebarOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const generarConclusion = () => {
    const problema = form.problema.trim();
    const objG = form.objGeneral.trim();
    const objE = form.objEspecificos
      .trim()
      .split(/\n+/)
      .filter(Boolean)
      .map((s) => s.replace(/^\d+\)\s*/, ""));

    const partes = [];

    partes.push(
      problema
        ? `Este estudio abordó la problemática: ${problema}.`
        : "Este estudio abordó la problemática planteada al inicio."
    );

    if (objG) {
      partes.push(
        `El estudio se desarrolló acorde al objetivo general: ${objG}.`
      );
    }

    if (objE.length > 0) {
      partes.push(
        "Se cumplieron los objetivos específicos: " +
          objE.map((o, i) => `${i + 1}) ${o}`).join("; ") +
          "."
      );
    }

    partes.push(
      "Los resultados permitieron responder la pregunta de investigación y aportan elementos relevantes para la mejora y toma de decisiones."
    );

    partes.push(
      "Como líneas futuras se sugiere ampliar la muestra, explorar nuevas variables y replicar el estudio en otros contextos."
    );

    setForm((prev) => ({
      ...prev,
      conclusion: partes.join(" "),
    }));

    clearPdfFeedback();
    setActivePanel("pasos");
    setActiveStep("paso8");
    const element = document.getElementById("paso8");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const cargarEjemplo = () => {
    setForm({
      problema:
        "En el conjunto residencial Nova, el uso del gimnasio es bajo pese a la alta inscripción de residentes.",
      objGeneral:
        "Analizar los factores que influyen en el bajo uso del gimnasio por parte de los residentes de Nova.",
      objEspecificos:
        "1) Identificar barreras percibidas.\n2) Comparar uso entre grupos.\n3) Evaluar impacto de recordatorios.",
      marco:
        "Teoría del comportamiento planificado; adherencia a actividad física; diseño centrado en el usuario.",
      enfoque: "mixto",
      diseno: "explicativo secuencial",
      muestra: "200 residentes; muestreo estratificado.",
      instrumentos:
        "Encuesta Likert; entrevistas; conteo electrónico de accesos.",
      resultados:
        "Se observaron picos horarios; las barreras principales fueron ventilación, horarios y normas poco claras.",
      conclusion: "",
      refs: "Ajzen (1991). The theory of planned behavior...",
      checklist: {
        consentimiento: true,
        cronograma: true,
        protocolos: true,
        resguardo: true,
      },
    });

    clearPdfFeedback();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActivePanel("pasos");
    setActiveStep("paso1");
  };

  const limpiarTodo = () => {
    setForm(defaultState);
    clearPdfFeedback();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActivePanel("pasos");
    setActiveStep("paso1");
  };

  const handleGeneratePdf = async () => {
    setLoadingPdf(true);
    setApiError("");
    setApiMessage("");

    const metodologiaPartes = [
      `Enfoque: ${form.enfoque || "Pendiente por definir"}`,
      form.diseno && `Diseño: ${form.diseno}`,
      form.muestra && `Muestra: ${form.muestra}`,
      form.instrumentos && `Instrumentos: ${form.instrumentos}`,
    ].filter(Boolean);

    const payload = {
      problema: form.problema.trim() || "Pendiente por definir.",
      obj_general: form.objGeneral.trim() || "Pendiente por definir.",
      obj_especificos:
        form.objEspecificos.trim() || "Pendiente por definir.",
      marco: form.marco.trim() || "Pendiente por definir.",
      metodologia:
        metodologiaPartes.join("\n\n") || "Pendiente por definir.",
      resultados: form.resultados.trim() || "Pendiente por definir.",
      conclusiones: form.conclusion.trim() || "Pendiente por definir.",
      referencias: form.refs.trim() || "Pendiente por definir.",
    };

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/research/generate`,
        payload
      );

      const link = data?.file_path
        ? `${API_BASE_URL}${data.file_path}`
        : "";

      if (link) {
        setPdfUrl(link);
      }

      setApiMessage(data?.message || "PDF generado exitosamente.");
      setActivePanel("herramientas");
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "No fue posible generar el PDF.";
      setApiError(message);
      setActivePanel("herramientas");
    } finally {
      setLoadingPdf(false);
    }
  };

  const completedChunks = [
    form.problema,
    form.objGeneral,
    form.marco,
    form.diseno,
    form.resultados,
    form.conclusion,
  ].filter((v) => v.trim().length > 0).length;

  const progress = Math.round((completedChunks / 6) * 100);

  const panelButtonClass = (panel) =>
    `px-4 py-2 text-sm font-medium rounded-xl transition border border-white/10 ${
      activePanel === panel
        ? "bg-white/20 text-white"
        : "bg-white/5 text-gray-300 hover:bg-white/10"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-gray-900 text-gray-100">
      <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Pasos de la Investigación</h1>
                <p className="text-xs text-gray-400">Guía interactiva y plantillas</p>
              </div>
            </div>
            <div className="flex flex-1 sm:flex-none items-center justify-end gap-3">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-1 py-1">
                <button
                  className={panelButtonClass("acerca")}
                  onClick={() => {
                    setActivePanel("acerca");
                    setSidebarOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Acerca
                </button>
                <button
                  className={panelButtonClass("pasos")}
                  onClick={() => {
                    setActivePanel("pasos");
                    setSidebarOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Pasos
                </button>
                <button
                  className={panelButtonClass("herramientas")}
                  onClick={() => {
                    setActivePanel("herramientas");
                    setSidebarOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Herramientas
                </button>
              </div>
              <button
                onClick={handleGeneratePdf}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 font-semibold rounded-xl shadow-lg transition disabled:opacity-60"
                disabled={loadingPdf}
              >
                {loadingPdf ? "Generando PDF..." : "Generar PDF"}
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
                aria-label="Abrir menú"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="font-medium">Progreso: {progress}%</span>
            {restored && (
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[11px] text-white">
                Progreso restaurado automáticamente 🎓
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activePanel === "acerca" && (
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-2xl font-bold">
              Plataforma Web Interactiva para la Enseñanza y Construcción de Proyectos de Investigación
              <span className="ml-2 px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-cyan-300">Proyecto académico</span>
            </h2>
            <p className="text-sm text-gray-400">
              Esta plataforma nace para responder a las dificultades que estudiantes y docentes encuentran al formular y estructurar un proyecto de investigación. Reúne en un solo lugar recursos pedagógicos, orientación práctica y herramientas digitales para avanzar sin perder de vista la metodología.
            </p>
            <p className="text-sm text-gray-400">
              Al combinar teoría y práctica, el usuario aprende cada etapa del proceso mientras construye su propio documento final: identifica el problema, define objetivos, documenta el marco teórico y selecciona la metodología adecuada con apoyo constante.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Componentes clave</h3>
                <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                  <li>Backend en Python que estructura los aportes y genera un PDF listo para revisión.</li>
                  <li>API construida con FastAPI que enlaza la interfaz con el motor de generación de documentos.</li>
                  <li>Frontend interactivo que guía con plantillas, ejemplos y recordatorios paso a paso.</li>
                  <li>Despliegue en Render y Netlify para garantizar acceso confiable desde cualquier dispositivo.</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Equipo y contexto</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>Andrés Vélez</li>
                  <li>Felipe Solís</li>
                  <li>Samuel Riaño</li>
                </ul>
                <p className="text-sm text-gray-400">
                  Universidad Católica de Oriente · Facultad de Ingeniería · 4 de septiembre de 2025
                </p>
              </div>
            </div>
          </div>
        )}

        {activePanel === "pasos" && (
          <div className="flex gap-6">
            <aside
              className={`${
                sidebarOpen
                  ? "fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-xl p-6"
                  : "hidden"
              } lg:block lg:sticky lg:top-32 lg:w-64 lg:self-start lg:bg-gray-900/60 lg:backdrop-blur-sm lg:border lg:border-white/10 lg:rounded-2xl lg:p-5 lg:shadow-2xl`}
            >
              <div className="lg:hidden flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Mapa del curso</h3>
                <button onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <h3 className="hidden lg:block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Mapa del curso
              </h3>
              <nav className="space-y-1">
                {steps.map(({ id, title, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleStepClick(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition group ${
                      activeStep === id ? "bg-cyan-400/10 border border-cyan-400/40" : "hover:bg-cyan-400/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                    <span className="text-sm">{title}</span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setActivePanel("herramientas");
                    setSidebarOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cyan-400/10 text-left transition group"
                >
                  <Lightbulb className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                  <span className="text-sm">Recursos</span>
                </button>
              </nav>
            </aside>

            <main className="flex-1 space-y-6">
              <div className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex flex-wrap items-start gap-3 mb-4">
                  <h2 className="text-2xl font-bold flex-1">Aprende el proceso de investigación</h2>
                  <span className="px-3 py-1 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 text-xs font-bold rounded-full">
                    Modo guía
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Esta página te conduce paso a paso desde el planteamiento del problema hasta las conclusiones. En cada paso encontrarás tips, ejemplos y pequeños formularios para practicar.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">Tiempo: 6-10h</span>
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">Método: iterativo</span>
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">Nivel: principiante</span>
                </div>
              </div>

              <section id="paso1" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                  1) Planteamiento del problema
                </h2>
                <p className="text-sm text-gray-400">
                  Describe con claridad qué situación genera la necesidad de tu investigación, a quién afecta, en qué contexto ocurre y por qué es relevante abordarla.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Escribe tu problemática</label>
                    <textarea
                      value={form.problema}
                      onChange={handleChange("problema")}
                      placeholder="Ej.: En el conjunto residencial X se presentan bajas tasas de uso del gimnasio..."
                      className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-h-32 resize-y"
                    />
                  </div>
                  <details className="border border-dashed border-white/20 rounded-xl p-4">
                    <summary className="cursor-pointer text-cyan-400 font-semibold text-sm mb-2">Plantilla rápida</summary>
                    <div className="text-sm text-gray-400 space-y-2">
                      <p>
                        <strong className="text-gray-300">Formato:</strong> En [contexto] se observa [situación] que afecta a [población].
                      </p>
                      <p>
                        <strong className="text-gray-300">Ejemplo:</strong> En colegios urbanos se observa un descenso en la lectura recreativa.
                      </p>
                    </div>
                  </details>
                </div>
              </section>

              <section id="paso2" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Target className="w-6 h-6 text-cyan-400" />
                  2) Objetivos
                </h2>
                <p className="text-sm text-gray-400">
                  Formula un objetivo general y varios objetivos específicos alineados con el problema planteado.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Objetivo general</label>
                      <input
                        value={form.objGeneral}
                        onChange={handleChange("objGeneral")}
                        placeholder="Ej.: Analizar los factores que..."
                        className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Objetivos específicos</label>
                      <textarea
                        value={form.objEspecificos}
                        onChange={handleChange("objEspecificos")}
                        placeholder={"1) Identificar...\n2) Comparar..."}
                        className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-h-32 resize-y"
                      />
                    </div>
                  </div>
                  <details className="border border-dashed border-white/20 rounded-xl p-4">
                    <summary className="cursor-pointer text-cyan-400 font-semibold text-sm mb-2">Consejos</summary>
                    <ul className="text-sm text-gray-400 space-y-2">
                      <li>
                        <strong>Cuantitativo:</strong> Medir, comparar, estimar
                      </li>
                      <li>
                        <strong>Cualitativo:</strong> Comprender, describir, explorar
                      </li>
                    </ul>
                  </details>
                </div>
              </section>

              <section id="paso3" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Brain className="w-6 h-6 text-cyan-400" />
                  3) Marco teórico
                </h2>
                <p className="text-sm text-gray-400">
                  Integra conceptos, teorías y antecedentes que respalden tu estudio. Usa esta sección para construir la base conceptual que orientará la interpretación de los datos.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Notas del marco teórico</label>
                    <textarea
                      value={form.marco}
                      onChange={handleChange("marco")}
                      placeholder="Conceptos, teorías, autores..."
                      className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-h-32 resize-y"
                    />
                  </div>
                  <details className="border border-dashed border-white/20 rounded-xl p-4">
                    <summary className="cursor-pointer text-cyan-400 font-semibold text-sm mb-2">Tips</summary>
                    <ul className="text-sm text-gray-400 space-y-2">
                      <li>Define conceptos con citas clave.</li>
                      <li>Conecta los referentes con tus objetivos.</li>
                    </ul>
                  </details>
                </div>
              </section>

              <section id="paso4" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FlaskConical className="w-6 h-6 text-cyan-400" />
                  4) Metodología
                </h2>
                <p className="text-sm text-gray-400">
                  Define el enfoque, el diseño, la muestra y los instrumentos que utilizarás para recolectar información.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Enfoque</label>
                      <select
                        value={form.enfoque}
                        onChange={handleChange("enfoque")}
                        className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      >
                        <option value="cuantitativo">Cuantitativo</option>
                        <option value="cualitativo">Cualitativo</option>
                        <option value="mixto">Mixto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Diseño</label>
                      <input
                        value={form.diseno}
                        onChange={handleChange("diseno")}
                        placeholder="Descriptivo, correlacional..."
                        className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Población / Muestra</label>
                      <input
                        value={form.muestra}
                        onChange={handleChange("muestra")}
                        placeholder="120 residentes..."
                        className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Instrumentos</label>
                    <textarea
                      value={form.instrumentos}
                      onChange={handleChange("instrumentos")}
                      placeholder="Encuesta Likert, entrevista..."
                      className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-h-44 resize-y"
                    />
                  </div>
                </div>
              </section>

              <section id="paso5" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Database className="w-6 h-6 text-cyan-400" />
                  5) Recolección de datos
                </h2>
                <p className="text-sm text-gray-400">
                  Planifica cómo obtendrás los datos necesarios para tu investigación.
                </p>
                <div className="space-y-2">
                  {[
                    { key: "consentimiento", label: "Consentimiento informado" },
                    { key: "cronograma", label: "Cronograma y responsables" },
                    { key: "protocolos", label: "Protocolos de calidad" },
                    { key: "resguardo", label: "Resguardo de datos" },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.checklist[key]}
                        onChange={() => handleChecklistChange(key)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section id="paso6" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                  6) Análisis de datos
                </h2>
                <p className="text-sm text-gray-400">
                  Selecciona técnicas de análisis acordes al enfoque y al tipo de datos recopilados.
                </p>
                <details className="border border-dashed border-white/20 rounded-xl p-4">
                  <summary className="cursor-pointer text-cyan-400 font-semibold text-sm mb-2">Técnicas sugeridas</summary>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>
                      <strong>Cuantitativo:</strong> estadística descriptiva, ANOVA, regresión
                    </li>
                    <li>
                      <strong>Cualitativo:</strong> codificación temática, triangulación, análisis narrativo
                    </li>
                  </ul>
                </details>
              </section>

              <section id="paso7" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-6 h-6 text-cyan-400" />
                  7) Resultados
                </h2>
                <p className="text-sm text-gray-400">
                  Resume los hallazgos más importantes obtenidos tras aplicar tus instrumentos.
                </p>
                <textarea
                  value={form.resultados}
                  onChange={handleChange("resultados")}
                  placeholder="Describe los resultados principales..."
                  className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-h-32 resize-y"
                />
              </section>

              <section id="paso8" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  8) Conclusiones
                </h2>
                <p className="text-sm text-gray-400">
                  Integra lo aprendido durante el proceso, responde a la pregunta de investigación y plantea recomendaciones o líneas futuras.
                </p>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 font-semibold rounded-xl shadow-lg transition hover:shadow-cyan-500/20"
                  onClick={generarConclusion}
                >
                  ⚡ Generar conclusión
                </button>
                <textarea
                  value={form.conclusion}
                  onChange={handleChange("conclusion")}
                  placeholder="Aquí aparecerá tu conclusión generada."
                  className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-h-32 resize-y"
                />
              </section>

              <section id="paso9" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookMarked className="w-6 h-6 text-cyan-400" />
                  9) Referencias
                </h2>
                <p className="text-sm text-gray-400">
                  Registra todas las fuentes consultadas siguiendo una norma reconocida (APA, IEEE, Vancouver, entre otras).
                </p>
                <textarea
                  value={form.refs}
                  onChange={handleChange("refs")}
                  placeholder="Norma APA, IEEE o Vancouver..."
                  className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-h-32 resize-y"
                />
              </section>

              <p className="text-center text-xs text-gray-500 py-6">
                Hecho con ❤️ para estudiantes e investigadores.
              </p>
            </main>
          </div>
        )}

        {activePanel === "herramientas" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-cyan-400" /> Herramientas y recursos de apoyo
              </h2>
              <p className="text-sm text-gray-400">
                Siguiendo el proceso de investigación descrito por QuestionPro, priorizamos recursos que fortalecen cada fase: planificación, recolección, análisis y difusión de resultados.
              </p>
              <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                <li>
                  <strong className="text-gray-200">Planeación:</strong> tableros de proyecto y mapas de ruta para organizar etapas, entregables y responsables.
                </li>
                <li>
                  <strong className="text-gray-200">Recolección de datos:</strong> formularios digitales, encuestas en QuestionPro o Google Forms y guías para entrevistas semiestructuradas.
                </li>
                <li>
                  <strong className="text-gray-200">Análisis:</strong> hojas de cálculo colaborativas, software estadístico y herramientas de codificación cualitativa.
                </li>
                <li>
                  <strong className="text-gray-200">Comunicación:</strong> plantillas de informes y presentaciones que facilitan compartir conclusiones con la comunidad académica.
                </li>
              </ul>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition"
                  onClick={cargarEjemplo}
                >
                  💡 Cargar ejemplo
                </button>
                <button
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition"
                  onClick={limpiarTodo}
                >
                  🧹 Limpiar
                </button>
              </div>
              {apiMessage && (
                <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2">
                  {apiMessage}
                </p>
              )}
              {apiError && (
                <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2">
                  {apiError}
                </p>
              )}
              {pdfUrl && (
                <a
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 font-semibold rounded-xl shadow-lg transition"
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ⬇️ Descargar PDF
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchGuide;
