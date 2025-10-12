// Datos de ejercicios por nivel
export const levelData = {
  1: {
    title: "Nivel 1: Identifica las Palabras",
    description: "Encuentra los sustantivos, adjetivos y verbos en las oraciones.",
    isFree: true,
    exercises: [
      {
        sentence: "El gato negro corre rápidamente por el jardín.",
        words: ["gato", "negro", "corre", "jardín"],
        answers: {
          "gato": "sustantivo",
          "negro": "adjetivo", 
          "corre": "verbo",
          "jardín": "sustantivo"
        },
        question: "¿Qué tipo de palabra es '{word}'?"
      },
      {
        sentence: "María come una manzana roja en la cocina.",
        words: ["María", "come", "manzana", "roja"],
        answers: {
          "María": "sustantivo",
          "come": "verbo",
          "manzana": "sustantivo", 
          "roja": "adjetivo"
        },
        question: "¿Qué tipo de palabra es '{word}'?"
      }
    ]
  },
  2: {
    title: "Nivel 2: Sustantivos Propios e Impropios",
    description: "Aprende a distinguir entre sustantivos propios e impropios.",
    isFree: true,
    exercises: [
      {
        sentence: "Pedro vive en Madrid con su perro.",
        words: ["Pedro", "Madrid", "perro"],
        answers: {
          "Pedro": "propio",
          "Madrid": "propio",
          "perro": "impropio"
        },
        question: "¿'{word}' es un sustantivo propio o impropio?"
      },
      {
        sentence: "Ana y Carlos fueron al parque de Buenos Aires.",
        words: ["Ana", "Carlos", "parque", "Buenos Aires"],
        answers: {
          "Ana": "propio",
          "Carlos": "propio",
          "parque": "impropio",
          "Buenos Aires": "propio"
        },
        question: "¿'{word}' es un sustantivo propio o impropio?"
      }
    ]
  },
  3: {
    title: "Nivel 3: Tiempos Verbales",
    description: "Identifica si los verbos están en presente, pasado o futuro.",
    isFree: false,
    exercises: [
      {
        sentence: "Ayer jugué fútbol, hoy estudio y mañana iré al cine.",
        words: ["jugué", "estudio", "iré"],
        answers: {
          "jugué": "pasado",
          "estudio": "presente",
          "iré": "futuro"
        },
        question: "¿En qué tiempo está el verbo '{word}'?"
      },
      {
        sentence: "Mañana visitaremos el museo, ayer fuimos al parque.",
        words: ["visitaremos", "fuimos"],
        answers: {
          "visitaremos": "futuro",
          "fuimos": "pasado"
        },
        question: "¿En qué tiempo está el verbo '{word}'?"
      }
    ]
  },
  4: {
    title: "Nivel 4: Artículos y Determinantes",
    description: "Aprende sobre artículos definidos e indefinidos.",
    isFree: false,
    exercises: [
      {
        sentence: "El niño tiene una pelota y la niña tiene un libro.",
        words: ["El", "una", "la", "un"],
        answers: {
          "El": "definido",
          "una": "indefinido",
          "la": "definido",
          "un": "indefinido"
        },
        question: "¿'{word}' es un artículo definido o indefinido?"
      }
    ]
  },
  5: {
    title: "Nivel 5: Género y Número",
    description: "Identifica el género y número de sustantivos y adjetivos.",
    isFree: false,
    exercises: [
      {
        sentence: "Las casas blancas son muy bonitas.",
        words: ["casas", "blancas", "bonitas"],
        answers: {
          "casas": "femenino plural",
          "blancas": "femenino plural",
          "bonitas": "femenino plural"
        },
        question: "¿Cuál es el género y número de '{word}'?"
      }
    ]
  },
  6: {
    title: "Nivel 6: Sinónimos y Antónimos",
    description: "Encuentra palabras con significados similares y opuestos.",
    isFree: false,
    exercises: [
      {
        sentence: "La casa grande es lo opuesto a la casa pequeña.",
        words: ["grande", "pequeña"],
        answers: {
          "grande": "antónimo de pequeña",
          "pequeña": "antónimo de grande"
        },
        question: "¿Qué relación tiene '{word}' con las otras palabras?"
      }
    ]
  }
};

// Función para obtener niveles gratuitos
export const getFreelevels = () => {
  return Object.entries(levelData)
    .filter(([_, level]) => level.isFree)
    .reduce((acc, [key, level]) => {
      acc[key] = level;
      return acc;
    }, {});
};

// Función para obtener todos los niveles
export const getAllLevels = () => {
  return levelData;
};

// Función para verificar si un nivel es gratuito
export const isLevelFree = (levelNumber) => {
  return levelData[levelNumber]?.isFree || false;
};