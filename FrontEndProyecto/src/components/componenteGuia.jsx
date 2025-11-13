import React, { useState } from 'react';
import { BookOpen, Target, Brain, FlaskConical, Database, BarChart3, FileText, CheckCircle2, BookMarked, Lightbulb, Trash2, Sparkles, Menu, X } from 'lucide-react';

export default function ResearchGuide() {
  const [formData, setFormData] = useState({
    problema: '',
    objGeneral: '',
    objEspecificos: '',
    marco: '',
    enfoque: 'cuantitativo',
    diseno: '',
    muestra: '',
    instrumentos: '',
    resultados: '',
    conclusion: '',
    refs: ''
  });

  const [checklist, setChecklist] = useState({
    consentimiento: false,
    cronograma: false,
    protocolos: false,
    resguardo: false,
    respondeProblema: false,
    citaHallazgos: false,
    implicaciones: false,
    limitaciones: false
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChecklistChange = (field) => {
    setChecklist(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const generarConclusion = () => {
    const { problema, objGeneral, objEspecificos } = formData;
    const objetivos = objEspecificos.split('\n').filter(Boolean).map(s => s.replace(/^\d+\)\s*/, '')).slice(0, 5);
    let base = [];
    if (problema) {
      base.push('Este estudio abordo la problematica: ' + problema);
    } else {
      base.push('Este estudio abordo la problematica definida en el planteamiento inicial.');
    }
    if (objGeneral) {
      base.push('En coherencia con el objetivo general - ' + objGeneral + ' - se desarrollo un enfoque metodologico acorde.');
    }
    if (objetivos.length) {
      base.push('Se cumplieron los objetivos especificos: ' + objetivos.map((o, i) => (i + 1) + ') ' + o).join('; ') + '.');
    }
    base.push('Los hallazgos permiten responder a la pregunta de investigacion y aportan evidencia util para la toma de decisiones en el contexto analizado.');
    base.push('Como lineas futuras, se sugiere ampliar la muestra, incorporar nuevas variables y replicar el estudio en otros escenarios.');
    handleInputChange('conclusion', base.join(' '));
    setTimeout(() => {
      const elem = document.getElementById('paso8');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const cargarEjemplo = () => {
    setFormData({
      problema: 'En el conjunto residencial Nova, el uso del gimnasio es bajo pese a la alta inscripcion de residentes, lo que sugiere barreras de acceso y motivacion.',
      objGeneral: 'Analizar los factores que influyen en el bajo uso del gimnasio por parte de los residentes en Nova.',
      objEspecificos: '1) Identificar barreras percibidas (horarios, aforo, normas).\n2) Describir el perfil de los usuarios frecuentes y no frecuentes.\n3) Evaluar el impacto de recordatorios y senalizacion en el uso.',
      marco: 'Teoria del comportamiento planificado; adherencia a actividad fisica; diseno centrado en el usuario en espacios compartidos.',
      enfoque: 'mixto',
      diseno: 'explicativo secuencial',
      muestra: '200 residentes; muestreo estratificado por torres',
      instrumentos: 'Encuesta Likert de 20 items; entrevistas a 12 residentes; conteo de accesos por torniquete.',
      resultados: 'Se observaron picos de uso entre 6-7 a.m. y 7-8 p.m.; las principales barreras fueron horarios percibidos, falta de ventilacion y desconocimiento de normas; los recordatorios por senalizacion incrementaron el uso un 15%.',
      conclusion: '',
      refs: 'Ajzen, I. (1991). The theory of planned behavior. Organizational Behavior and Human Decision Processes, 50(2), 179-211.'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limpiarTodo = () => {
    setFormData({
      problema: '',
      objGeneral: '',
      objEspecificos: '',
      marco: '',
      enfoque: 'cuantitativo',
      diseno: '',
      muestra: '',
      instrumentos: '',
      resultados: '',
      conclusion: '',
      refs: ''
    });
    setChecklist({
      consentimiento: false,
      cronograma: false,
      protocolos: false,
      resguardo: false,
      respondeProblema: false,
      citaHallazgos: false,
      implicaciones: false,
      limitaciones: false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    { id: 'paso1', title: '1. Problema', icon: BookOpen },
    { id: 'paso2', title: '2. Objetivos', icon: Target },
    { id: 'paso3', title: '3. Marco teorico', icon: Brain },
    { id: 'paso4', title: '4. Metodologia', icon: FlaskConical },
    { id: 'paso5', title: '5. Recoleccion', icon: Database },
    { id: 'paso6', title: '6. Analisis', icon: BarChart3 },
    { id: 'paso7', title: '7. Resultados', icon: FileText },
    { id: 'paso8', title: '8. Conclusiones', icon: CheckCircle2 },
    { id: 'paso9', title: '9. Referencias', icon: BookMarked }
  ];

  const scrollToSection = (id) => {
    const elem = document.getElementById(id);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-gray-900 text-gray-100">
      <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Pasos de la Investigacion</h1>
                <p className="text-xs text-gray-400">Guia interactiva y plantillas</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition">
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <button onClick={() => window.print()} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition">
              Imprimir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          <aside className={`${sidebarOpen ? 'fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-xl p-6' : 'hidden'} lg:block lg:sticky lg:top-24 lg:w-64 lg:self-start lg:bg-gray-900/60 lg:backdrop-blur-sm lg:border lg:border-white/10 lg:rounded-2xl lg:p-5 lg:shadow-2xl`}>
            <div className="lg:hidden flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Mapa del curso</h3>
              <button onClick={() => setSidebarOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <h3 className="hidden lg:block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Mapa del curso</h3>
            <nav className="space-y-1">
              {steps.map(({ id, title, icon: Icon }) => (
                <button key={id} onClick={() => scrollToSection(id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cyan-400/10 text-left transition group">
                  <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                  <span className="text-sm">{title}</span>
                </button>
              ))}
              <button onClick={() => scrollToSection('herramientas')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cyan-400/10 text-left transition group">
                <Lightbulb className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                <span className="text-sm">Recursos</span>
              </button>
            </nav>
          </aside>

          <main className="flex-1 space-y-6">
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-3 mb-3">
                <h2 className="text-2xl font-bold flex-1">Aprende el proceso de investigacion</h2>
                <span className="px-3 py-1 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 text-xs font-bold rounded-full">Modo guia</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Esta pagina te conduce paso a paso desde el planteamiento del problema hasta las conclusiones. En cada paso encontraras tips, ejemplos y pequenos formularios para practicar.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">Tiempo: 6-10 h</span>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">Metodo: iterativo</span>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">Nivel: principiante</span>
              </div>
            </div>

            <div id="paso1" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl scroll-mt-24">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                1) Planteamiento del problema
              </h2>
              <p className="text-sm text-gray-400 mb-4">Define que te preocupa, a quien afecta, donde y cuando ocurre, y por que es importante investigarlo.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Escribe tu problematica</label>
                  <textarea value={formData.problema} onChange={(e) => handleInputChange('problema', e.target.value)} placeholder="Ej.: En el conjunto residencial X se presentan bajas tasas de uso del gimnasio..." className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-h-32 resize-y" />
                </div>
                <details className="border border-dashed border-white/20 rounded-xl p-4">
                  <summary className="cursor-pointer text-cyan-400 font-semibold text-sm mb-2">Plantilla rapida</summary>
                  <div className="text-sm text-gray-400 space-y-2">
                    <p><strong className="text-gray-300">Formato:</strong> En [contexto] se observa [situacion] que afecta a [poblacion].</p>
                    <p><strong className="text-gray-300">Ejemplo:</strong> En colegios urbanos se observa un descenso en la lectura recreativa.</p>
                  </div>
                </details>
              </div>
            </div>

            <div id="paso2" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl scroll-mt-24">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Target className="w-6 h-6 text-cyan-400" />
                2) Objetivos
              </h2>
              <p className="text-sm text-gray-400 mb-4">Formula un objetivo general y varios objetivos especificos.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Objetivo general</label>
                    <input value={formData.objGeneral} onChange={(e) => handleInputChange('objGeneral', e.target.value)} placeholder="Ej.: Analizar los factores que..." className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Objetivos especificos</label>
                    <textarea value={formData.objEspecificos} onChange={(e) => handleInputChange('objEspecificos', e.target.value)} placeholder="1) Identificar...&#10;2) Comparar..." className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-h-32 resize-y" />
                  </div>
                </div>
                <details className="border border-dashed border-white/20 rounded-xl p-4">
                  <summary className="cursor-pointer text-cyan-400 font-semibold text-sm mb-2">Consejos</summary>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li><strong>Cuantitativo:</strong> Medir, comparar, estimar</li>
                    <li><strong>Cualitativo:</strong> Comprender, describir, explorar</li>
                  </ul>
                </details>
              </div>
            </div>

            <div id="paso3" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl scroll-mt-24">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Brain className="w-6 h-6 text-cyan-400" />
                3) Marco teorico
              </h2>
              <p className="text-sm text-gray-400 mb-4">Resume conceptos clave y trabajos previos.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Notas del marco teorico</label>
                  <textarea value={formData.marco} onChange={(e) => handleInputChange('marco', e.target.value)} placeholder="Conceptos, teorias, autores..." className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-h-32 resize-y" />
                </div>
                <details className="border border-dashed border-white/20 rounded-xl p-4">
                  <summary className="cursor-pointer text-cyan-400 font-semibold text-sm mb-2">Tips</summary>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>Define conceptos con citas</li>
                    <li>Conecta con tus objetivos</li>
                  </ul>
                </details>
              </div>
            </div>

            <div id="paso4" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl scroll-mt-24">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <FlaskConical className="w-6 h-6 text-cyan-400" />
                4) Metodologia
              </h2>
              <p className="text-sm text-gray-400 mb-4">Elige enfoque, diseno, muestra e instrumentos.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Enfoque</label>
                    <select value={formData.enfoque} onChange={(e) => handleInputChange('enfoque', e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
                      <option value="cuantitativo">Cuantitativo</option>
                      <option value="cualitativo">Cualitativo</option>
                      <option value="mixto">Mixto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Diseno</label>
                    <input value={formData.diseno} onChange={(e) => handleInputChange('diseno', e.target.value)} placeholder="descriptivo, correlacional..." className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Poblacion / Muestra</label>
                    <input value={formData.muestra} onChange={(e) => handleInputChange('muestra', e.target.value)} placeholder="120 residentes..." className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Instrumentos</label>
                  <textarea value={formData.instrumentos} onChange={(e) => handleInputChange('instrumentos', e.target.value)} placeholder="Encuesta Likert, entrevista..." className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 h-full min-h-44 resize-y" />
                </div>
              </div>
            </div>

            <div id="paso5" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl scroll-mt-24">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Database className="w-6 h-6 text-cyan-400" />
                5) Recoleccion de datos
              </h2>
              <p className="text-sm text-gray-400 mb-4">Planifica como obtendras los datos.</p>
              <div className="space-y-2">
                {[
                  { key: 'consentimiento', label: 'Consentimiento informado' },
                  { key: 'cronograma', label: 'Cronograma y responsables' },
                  { key: 'protocolos', label: 'Protocolos de calidad' },
                  { key: 'resguardo', label: 'Resguardo de datos' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition cursor-pointer">
                    <input type="checkbox" checked={checklist[key]} onChange={() => handleChecklistChange(key)} className="w-4 h-4 rounded" />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div id="paso6" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl scroll-mt-24">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
                6) Analisis de datos
              </h2>
              <p className="text-sm text-gray-400 mb-4">Selecciona tecnicas acorde al enfoque.</p>
              <details className="border border-dashed border-white/20 rounded-xl p-4">
                <summary className="cursor-pointer text-cyan-400 font-semibold text-sm mb-2">Tecnicas</summary>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li><strong>Cuantitativo:</strong> estadistica, ANOVA, regresion</li>
                  <li><strong>Cualitativo:</strong> codificacion tematica, triangulacion</li>
                </ul>
              </details>
            </div>

            <div id="paso7" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl scroll-mt-24">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <FileText className="w-6 h-6 text-cyan-400" />
                7) Resultados
              </h2>
              <p className="text-sm text-gray-400 mb-4">Presenta hallazgos con descripciones claras.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Borrador de resultados</label>
                  <textarea value={formData.resultados} onChange={(e) => handleInputChange('resultados', e.target.value)} placeholder="Resume los hallazgos..." className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-h-32 resize-y" />
                </div>
                <details className="border border-dashed border-white/20 rounded-xl p-4">
                  <summary className="cursor-pointer text-cyan-400 font-semibold text-sm mb-2">Buenas practicas</summary>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>Una idea por parrafo</li>
                    <li>Referencia cruzada a objetivos</li>
                  </ul>
                </details>
              </div>
            </div>

            <div id="paso8" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl scroll-mt-24">
              <div className="flex items-start gap-3 mb-3">
                <h2 className="text-xl font-bold flex items-center gap-2 flex-1">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  8) Conclusiones
                </h2>
                <span className="px-3 py-1 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 text-xs font-bold rounded-full">Generador</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">Genera un borrador editable.</p>
              <button onClick={generarConclusion} className="mb-4 px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-500 hover:to-violet-600 text-slate-900 font-bold rounded-xl transition flex items-center gap-2 shadow-lg">
                <Sparkles className="w-4 h-4" />
                Generar conclusion
              </button>
              <textarea value={formData.conclusion} onChange={(e) => handleInputChange('conclusion', e.target.value)} placeholder="Aqui aparecera tu conclusion..." className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-h-40 resize-y mb-4" />
              <details className="border border-dashed border-white/20 rounded-xl p-4">
                <summary className="cursor-pointer text-cyan-400 font-semibold text-sm mb-2">Checklist</summary>
                <div className="space-y-2">
                  {[
                    { key: 'respondeProblema', label: 'Responde al problema' },
                    { key: 'citaHallazgos', label: 'Cita hallazgos clave' },
                    { key: 'implicaciones', label: 'Indica implicaciones' },
                    { key: 'limitaciones', label: 'Menciona limitaciones' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition cursor-pointer">
                      <input type="checkbox" checked={checklist[key]} onChange={() => handleChecklistChange(key)} className="w-4 h-4 rounded" />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </details>
            </div>

            <div id="paso9" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl scroll-mt-24">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <BookMarked className="w-6 h-6 text-cyan-400" />
                9) Referencias
              </h2>
              <p className="text-sm text-gray-400 mb-4">Registra tus fuentes con estilo consistente.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Lista de referencias</label>
                  <textarea value={formData.refs} onChange={(e) => handleInputChange('refs', e.target.value)} placeholder="Autor, A. (Ano). Titulo. Revista..." className="w-full px-4 py-3 bg-slate-950 border border-white/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 min-h-32 resize-y" />
                </div>
                <details className="border border-dashed border-white/20 rounded-xl p-4">
                  <summary className="cursor-pointer text-cyan-400 font-semibold text-sm mb-2">Tips APA</summary>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>Autores: Apellido, Iniciales</li>
                    <li>Ano entre parentesis</li>
                    <li>DOI o URL cuando aplique</li>
                  </ul>
                </details>
              </div>
            </div>

            <div id="herramientas" className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl scroll-mt-24">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-cyan-400" />
                Recursos y herramientas
              </h2>
              <ul className="text-sm text-gray-400 space-y-2 mb-4">
                <li>Plantillas de objetivos con verbos de accion</li>
                <li>Checklist de etica y calidad</li>
                <li>Impresion y exportacion a PDF</li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <button onClick={cargarEjemplo} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Cargar ejemplo
                </button>
                <button onClick={limpiarTodo} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Limpiar
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400 py-8">
              Hecho con amor para estudiantes e investigadores. Puedes imprimir o guardar como PDF.
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}