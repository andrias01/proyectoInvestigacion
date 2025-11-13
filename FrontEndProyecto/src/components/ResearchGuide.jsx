import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./css/ResearchGuide.css";

// Estado base (solo uno)
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

const stepsIds = [
  "paso1",
  "paso2",
  "paso3",
  "paso4",
  "paso5",
  "paso6",
  "paso7",
  "paso8",
  "paso9",
];

const ResearchGuide = () => {
  const [form, setForm] = useState(defaultState);
  const [restored, setRestored] = useState(false);
  const [activeStep, setActiveStep] = useState("paso1");
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const sectionRefs = useRef({});

  const clearPdfFeedback = () => {
    setPdfUrl("");
    setApiMessage("");
    setApiError("");
  };

  // Cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setForm(JSON.parse(saved));
        setPdfUrl("");
        setApiMessage("");
        setApiError("");
        setRestored(true);
        setTimeout(() => setRestored(false), 3000);
      } catch {}
    }
  }, []);

  // Guardar cambios
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  // Cambiar texto
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    clearPdfFeedback();
  };

  // Cambiar checkboxes
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

  // Scroll a sección
  const handleStepClick = (id) => {
    setActiveStep(id);
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Generar conclusión automática
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
    setActiveStep("paso8");
  };

  // Cargar datos de ejemplo
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
  };

  // Limpiar
  const limpiarTodo = () => {
    setForm(defaultState);
    clearPdfFeedback();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Imprimir
  const handlePrint = () => window.print();

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
      setActiveStep("herramientas");
      const herramientasSection = sectionRefs.current["herramientas"];
      if (herramientasSection) {
        herramientasSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "No fue posible generar el PDF.";
      setApiError(message);
    } finally {
      setLoadingPdf(false);
    }
  };

  // Progreso simple basado en 6 campos clave
  const completedChunks = [
    form.problema,
    form.objGeneral,
    form.marco,
    form.diseno,
    form.resultados,
    form.conclusion,
  ].filter((v) => v.trim().length > 0).length;

  const progress = Math.round((completedChunks / 6) * 100);

  return (
    <div className="rg-body">
      <header className="rg-header">
        <div className="rg-wrap rg-top">
          <div className="rg-brand">
            <div className="rg-logo">
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path d="M12 2l3.5 6.5L22 9l-5 4.9L18 21l-6-3.2L6 21l1-7.1L2 9l6.5-.5L12 2z" />
              </svg>
            </div>
            <div>
              <strong>Pasos de la Investigación</strong>
              <br />
              <span className="rg-muted">Guía interactiva y plantillas</span>
            </div>
          </div>
          <nav className="rg-nav">
            <a href="#acerca">Acerca</a>
            <a href="#pasos">Pasos</a>
            <a href="#herramientas">Herramientas</a>
            <button className="rg-btn ghost" onClick={handlePrint}>
              🖨 Imprimir
            </button>
          </nav>
        </div>

        <div className="rg-progress-bar">
          <div className="rg-progress-track">
            <div
              className="rg-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="rg-progress-label">
            Progreso estimado: {progress}%
          </span>
        </div>

        {restored && (
          <div className="rg-toast">
            Progreso restaurado automáticamente. 🎓
          </div>
        )}
      </header>

      <main className="rg-wrap rg-grid" id="pasos">
        {/* Sidebar */}
        <aside className="rg-toc">
          <h3>Mapa del curso</h3>

          {stepsIds.map((id, index) => (
            <button
              key={id}
              className={
                "rg-toc-link" + (activeStep === id ? " rg-toc-link--active" : "")
              }
              onClick={() => handleStepClick(id)}
            >
              {index + 1}.{" "}
              {
                {
                  paso1: "Problema",
                  paso2: "Objetivos",
                  paso3: "Marco teórico",
                  paso4: "Metodología",
                  paso5: "Recolección",
                  paso6: "Análisis",
                  paso7: "Resultados",
                  paso8: "Conclusiones",
                  paso9: "Referencias",
                }[id]
              }
            </button>
          ))}

          <button
            className={
              "rg-toc-link rg-toc-link--secondary" +
              (activeStep === "herramientas" ? " rg-toc-link--active" : "")
            }
            onClick={() => handleStepClick("herramientas")}
          >
            Recursos
          </button>
        </aside>

        {/* Contenido principal */}
        <section className="rg-main">
          {/* --- ACERCA --- */}
          <article
            id="acerca"
            className="rg-card"
            ref={(el) => (sectionRefs.current["acerca"] = el)}
          >
            <h2>
              Plataforma Web Interactiva para la Enseñanza y Construcción de
              Proyectos de Investigación {" "}
              <span className="rg-badge">Proyecto académico</span>
            </h2>
            <p className="rg-description">
              Esta plataforma nace para responder a las dificultades que
              estudiantes y docentes encuentran al formular y estructurar un
              proyecto de investigación. Reúne en un solo lugar recursos
              pedagógicos, orientación práctica y herramientas digitales para
              avanzar sin perder de vista la metodología.
            </p>
            <p className="rg-description">
              Al combinar teoría y práctica, el usuario aprende cada etapa del
              proceso mientras construye su propio documento final: identifica
              el problema, define objetivos, documenta el marco teórico y
              selecciona la metodología adecuada con apoyo constante.
            </p>
            <div className="rg-row">
              <div>
                <h3 className="rg-subtitle">Componentes clave</h3>
                <ul className="rg-list">
                  <li>
                    Backend en Python que estructura los aportes y genera un
                    PDF listo para revisión.
                  </li>
                  <li>
                    API construida con FastAPI que enlaza la interfaz con el
                    motor de generación de documentos.
                  </li>
                  <li>
                    Frontend interactivo que guía con plantillas, ejemplos y
                    recordatorios paso a paso.
                  </li>
                  <li>
                    Despliegue en Render y Netlify para garantizar acceso
                    confiable desde cualquier dispositivo.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="rg-subtitle">Equipo y contexto</h3>
                <ul className="rg-team">
                  <li>Andrés Vélez</li>
                  <li>Felipe Solís</li>
                  <li>Samuel Riaño</li>
                </ul>
                <p className="rg-description">
                  Universidad Católica de Oriente · Facultad de Ingeniería · 4
                  de septiembre de 2025
                </p>
              </div>
            </div>
          </article>

          {/* === PASO 1 === */}
          <article
            id="paso1"
            className="rg-card"
            ref={(el) => (sectionRefs.current["paso1"] = el)}
          >
            <h2>1) Planteamiento del problema</h2>
            <p className="rg-description">
              Describe con claridad qué situación genera la necesidad de tu
              investigación, a quién afecta, en qué contexto ocurre y por qué es
              relevante abordarla. Cuanto más preciso sea el planteamiento,
              más fácil será definir objetivos y diseñar soluciones viables.
            </p>
            <label>Describe tu problema</label>
            <textarea
              value={form.problema}
              onChange={handleChange("problema")}
              placeholder="Describe qué ocurre, a quién afecta, dónde, cuándo y por qué es relevante..."
            />
          </article>

          {/* === PASO 2 === */}
          <article
            id="paso2"
            className="rg-card"
            ref={(el) => (sectionRefs.current["paso2"] = el)}
          >
            <h2>2) Objetivos</h2>
            <p className="rg-description">
              Formula un objetivo general que capture la finalidad central del
              estudio y especifica metas particulares que permitan alcanzarlo.
              Procura que cada objetivo específico sea medible y alineado con
              el problema planteado.
            </p>
            <label>Objetivo general</label>
            <input
              value={form.objGeneral}
              onChange={handleChange("objGeneral")}
            />

            <label style={{ marginTop: 10 }}>Objetivos específicos</label>
            <textarea
              value={form.objEspecificos}
              onChange={handleChange("objEspecificos")}
              placeholder={"1) Identificar...\n2) Analizar...\n3) Evaluar..."}
            />
          </article>

          {/* === PASO 3 === */}
          <article
            id="paso3"
            className="rg-card"
            ref={(el) => (sectionRefs.current["paso3"] = el)}
          >
            <h2>3) Marco teórico</h2>
            <p className="rg-description">
              Integra conceptos, teorías, antecedentes y referencias que
              respalden tu estudio. Usa esta sección para construir la base
              conceptual que orientará la interpretación de los datos.
            </p>
            <textarea
              value={form.marco}
              onChange={handleChange("marco")}
              placeholder="Conceptos, teorías, autores, antecedentes..."
            />
          </article>

          {/* === PASO 4 === */}
          <article
            id="paso4"
            className="rg-card"
            ref={(el) => (sectionRefs.current["paso4"] = el)}
          >
            <h2>4) Metodología</h2>
            <p className="rg-description">
              Define cómo abordarás la investigación: especifica el enfoque,
              el diseño elegido, el tipo de muestra y los instrumentos que
              utilizarás para recolectar información. La coherencia entre estas
              decisiones garantizará que los resultados respondan a tus
              objetivos.
            </p>

            <label>Enfoque</label>
            <select
              value={form.enfoque}
              onChange={handleChange("enfoque")}
            >
              <option value="cuantitativo">Cuantitativo</option>
              <option value="cualitativo">Cualitativo</option>
              <option value="mixto">Mixto</option>
            </select>

            <label style={{ marginTop: 10 }}>Diseño</label>
            <input
              value={form.diseno}
              onChange={handleChange("diseno")}
            />

            <label style={{ marginTop: 10 }}>Muestra</label>
            <input
              value={form.muestra}
              onChange={handleChange("muestra")}
            />

            <label style={{ marginTop: 10 }}>Instrumentos</label>
            <textarea
              value={form.instrumentos}
              onChange={handleChange("instrumentos")}
            />
          </article>

          {/* === PASO 5 === */}
          <article
            id="paso5"
            className="rg-card"
            ref={(el) => (sectionRefs.current["paso5"] = el)}
          >
            <h2>5) Recolección de datos</h2>
            <p className="rg-description">
              Asegura las condiciones logísticas y éticas necesarias antes de
              salir a campo. Utiliza la lista de verificación para confirmar que
              cuentas con consentimiento informado, cronograma, protocolos de
              calidad y mecanismos de resguardo de la información.
            </p>

            <ul className="rg-checklist">
              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={form.checklist.consentimiento}
                    onChange={() => handleChecklistChange("consentimiento")}
                  />
                  Consentimiento informado listo
                </label>
              </li>

              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={form.checklist.cronograma}
                    onChange={() => handleChecklistChange("cronograma")}
                  />
                  Cronograma definido
                </label>
              </li>

              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={form.checklist.protocolos}
                    onChange={() => handleChecklistChange("protocolos")}
                  />
                  Protocolos de calidad (piloto)
                </label>
              </li>

              <li>
                <label>
                  <input
                    type="checkbox"
                    checked={form.checklist.resguardo}
                    onChange={() => handleChecklistChange("resguardo")}
                  />
                  Resguardo/anónimo OK
                </label>
              </li>
            </ul>
          </article>

          {/* === PASO 6 === */}
          <article
            id="paso6"
            className="rg-card"
            ref={(el) => (sectionRefs.current["paso6"] = el)}
          >
            <h2>6) Análisis de datos</h2>
            <p className="rg-description">
              Define los procedimientos analíticos que utilizarás para dar
              respuesta a cada objetivo. Selecciona técnicas acordes al enfoque
              (cuantitativo, cualitativo o mixto) y deja explícito cómo
              interpretarás los hallazgos.
            </p>
            <details>
              <summary>Ejemplos</summary>
              <ul>
                <li><b>Cuantitativo:</b> ANOVA, t-Student, regresión</li>
                <li><b>Cualitativo:</b> codificación abierta, análisis temático</li>
              </ul>
            </details>
          </article>

          {/* === PASO 7 === */}
          <article
            id="paso7"
            className="rg-card"
            ref={(el) => (sectionRefs.current["paso7"] = el)}
          >
            <h2>7) Resultados</h2>
            <p className="rg-description">
              Resume los hallazgos más relevantes y explica cómo se relacionan
              con las preguntas y objetivos. Puedes apoyarte en tablas, figuras
              o descripciones narrativas según el tipo de estudio.
            </p>
            <textarea
              value={form.resultados}
              onChange={handleChange("resultados")}
              placeholder="Describe tus hallazgos..."
            />
          </article>

          {/* === PASO 8 === */}
          <article
            id="paso8"
            className="rg-card"
            ref={(el) => (sectionRefs.current["paso8"] = el)}
          >
            <h2>8) Conclusiones</h2>
            <p className="rg-description">
              Integra lo aprendido durante el proceso, responde a la pregunta
              de investigación y plantea recomendaciones o líneas futuras. Usa
              el generador automático como base y ajusta la redacción final.
            </p>
            <button className="rg-btn primary" onClick={generarConclusion}>
              ⚡ Generar conclusión
            </button>

            <textarea
              value={form.conclusion}
              onChange={handleChange("conclusion")}
              placeholder="Aquí aparecerá tu conclusión generada."
            />
          </article>

          {/* === PASO 9 === */}
          <article
            id="paso9"
            className="rg-card"
            ref={(el) => (sectionRefs.current["paso9"] = el)}
          >
            <h2>9) Referencias</h2>
            <p className="rg-description">
              Registra todas las fuentes consultadas siguiendo una norma
              reconocida (APA, IEEE, Vancouver, entre otras). Mantener la
              bibliografía actualizada evita el plagio y facilita futuras
              revisiones.
            </p>

            <textarea
              value={form.refs}
              onChange={handleChange("refs")}
              placeholder="Norma APA, IEEE o Vancouver..."
            />
          </article>

          {/* === HERRAMIENTAS === */}
          <article
            id="herramientas"
            className="rg-card"
            ref={(el) => (sectionRefs.current["herramientas"] = el)}
          >
            <h2>Herramientas y recursos de apoyo</h2>
            <p className="rg-description">
              Siguiendo el proceso de investigación descrito por QuestionPro,
              priorizamos recursos que fortalecen cada fase: planificación,
              recolección, análisis y difusión de resultados.
            </p>
            <ul className="rg-tools">
              <li>
                <strong>Planeación:</strong> tableros de proyecto y mapas de
                ruta para organizar etapas, entregables y responsables.
              </li>
              <li>
                <strong>Recolección de datos:</strong> formularios digitales,
                encuestas en QuestionPro o Google Forms y guías para entrevistas
                semiestructuradas.
              </li>
              <li>
                <strong>Análisis:</strong> hojas de cálculo colaborativas,
                software estadístico y herramientas de codificación cualitativa
                para transformar la información en hallazgos.
              </li>
              <li>
                <strong>Comunicación:</strong> plantillas de informes y
                presentaciones que facilitan compartir conclusiones con la
                comunidad académica.
              </li>
            </ul>
            <p className="rg-description">
              Utiliza las siguientes acciones rápidas para trabajar con tu
              proyecto y generar el documento final desde el backend.
            </p>
            <div className="rg-actions">
              <button className="rg-btn" onClick={cargarEjemplo}>
                💡 Cargar ejemplo
              </button>
              <button className="rg-btn" onClick={limpiarTodo}>
                🧹 Limpiar
              </button>
              <button
                className="rg-btn primary"
                onClick={handleGeneratePdf}
                disabled={loadingPdf}
              >
                {loadingPdf ? "Generando PDF..." : "Generar PDF"}
              </button>
              {pdfUrl && (
                <a
                  className="rg-btn"
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ⬇️ Descargar PDF
                </a>
              )}
            </div>
            {apiMessage && (
              <p className="rg-status rg-status--ok">{apiMessage}</p>
            )}
            {apiError && (
              <p className="rg-status rg-status--error">{apiError}</p>
            )}
          </article>

          <p className="rg-footer">
            Hecho con ❤️ para estudiantes e investigadores.
          </p>
        </section>
      </main>
    </div>
  );
};

export default ResearchGuide;
