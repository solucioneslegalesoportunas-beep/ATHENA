
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from '../types';
import { STATUSES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getTrainingSuggestions = async (task: Task): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const prompt = `
    Eres un coach experto en desarrollo profesional y productividad llamado ATHENA.
    Un miembro del equipo ha marcado la siguiente tarea como "necesita capacitación":

    Tarea: "${task.title}"
    Descripción: "${task.description}"
    Área: "${task.area}"

    Tu objetivo es proporcionar 3 a 5 pasos de acción concretos y útiles para que esta persona pueda superar el bloqueo y completar la tarea de forma autónoma.
    Las sugerencias deben ser prácticas y directas.

    Formato de la respuesta:
    - Usa Markdown para dar formato.
    - Empieza con un encabezado principal: "# Plan de Capacitación para: [Título de la Tarea]".
    - Luego, crea una lista numerada con cada paso sugerido.
    - Cada paso debe incluir:
      1. Una acción clara (ej. "Investigar...", "Ver el tutorial...", "Usar esta plantilla...").
      2. Una breve explicación de por qué es útil.
      3. Si es posible, sugiere recursos reales como enlaces a tutoriales de YouTube, artículos de blogs de alta calidad o cursos en línea (ej. Coursera, Udemy).
    - También puedes incluir un "Prompt para IA" que puedan usar con un asistente como Gemini para obtener ayuda específica.

    Ejemplo de un paso:
    "1. **Analizar Ejemplos de Alto Rendimiento:** Busca en [sitio de inspiración] 3 ejemplos de '${task.title}' que consideres excelentes. Esto te dará una visión clara del estándar de calidad y te ayudará a generar ideas."

    Genera el plan de capacitación ahora.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(`Gemini API error (${model}):`, error);
    return "Error al conectar con el servicio de IA. Por favor, revisa la configuración.";
  }
};

export const generateTaskDetails = async (prompt: string): Promise<{ title: string; description: string }> => {
  const model = 'gemini-2.5-flash';
  const fullPrompt = `Basado en la siguiente idea del usuario, genera un título de tarea que sea claro y accionable, y una descripción detallada.
  La descripción debe explicar el objetivo, los pasos clave a seguir, y cuál es el resultado esperado.
  La respuesta DEBE ser en español.
  
  Idea del usuario: "${prompt}"`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Un título de tarea claro y conciso.' },
            description: { type: Type.STRING, description: 'Una descripción detallada de la tarea, incluyendo objetivos y pasos.' },
          },
          required: ['title', 'description'],
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error(`Gemini API error (${model}):`, error);
    return { title: prompt, description: 'No se pudo generar la descripción con IA. Por favor, inténtalo de nuevo.' };
  }
};

export const analyzeRisks = async (tasks: Task[]): Promise<string> => {
  const model = 'gemini-2.5-pro'; // Use Pro for more complex reasoning
  const taskSummaries = tasks.map(task => 
    `- Tarea: "${task.title}" (Executor: ${task.executor}, Área: ${task.area}, Vence: ${task.dueDate})
       - Estado actual: ${STATUSES[task.status].label}
       - Descripción: ${task.description || 'N/A'}`
  ).join('\n');

  const prompt = `
    Eres ATHENA, una IA de análisis estratégico para líderes de alto rendimiento.
    Se te ha proporcionado la siguiente lista de tareas de alto riesgo (bloqueadas o vencidas).
    Tu misión es analizar esta lista, identificar patrones y proponer un plan de acción conciso y priorizado para el Director.

    Tareas de Alto Riesgo:
    ${taskSummaries}

    Análisis Requerido:
    1.  **Resumen Ejecutivo:** Proporciona un párrafo breve (2-3 frases) que resuma la situación general. ¿El problema está concentrado en un área, persona o tipo de tarea?
    2.  **Patrones y Causas Raíz:** Identifica 2-3 patrones clave o posibles causas raíz de los bloqueos. Ve más allá de lo obvio. (Ej: "Falta de acceso a recursos en el Área Legal", "Posible sobrecarga de trabajo para Subalterno 1", "Dependencias externas no gestionadas").
    3.  **Plan de Acción Priorizado:** Ofrece 3 acciones concretas y accionables que el Director debe tomar de inmediato. Usa un lenguaje directo y orientado a la solución.

    Formato de la respuesta:
    - La respuesta DEBE ser en español.
    - Usa Markdown para el formato.
    - Usa encabezados (##) para cada sección (Resumen Ejecutivo, Patrones y Causas Raíz, Plan de Acción).
    - Usa listas para los puntos clave.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(`Gemini API error (${model}):`, error);
    return "## Error de Análisis\n\nNo se pudo conectar con el servicio de IA para el análisis de riesgos. Por favor, revisa la configuración o inténtalo más tarde.";
  }
};
