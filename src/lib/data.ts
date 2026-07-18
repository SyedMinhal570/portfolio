/**
 * Central data file for portfolio content.
 * Keeping content here (instead of hardcoding in components) makes it easy
 * to update projects/skills without touching UI logic — useful for Task 4+.
 */

/** A grouped list of skills (e.g. Languages, Tools, etc.) */
export interface SkillGroup {
  category: string;
  items: string[];
}

/** Portfolio project card data — githubUrl is null when repo is not public yet */
export interface Project {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string | null;
}

/** True when a social URL is a real link (not empty or "#" placeholder) */
export function isSocialLinkActive(
  url: string | null | undefined
): url is string {
  if (!url) return false;
  const trimmed = url.trim();
  return trimmed !== "" && trimmed !== "#";
}

/** Education or work experience entry */
export interface ExperienceItem {
  title: string;
  organization: string;
  period: string;
  description: string;
  type: "education" | "work";
}

/** Personal info used in Hero, About, and Footer */
export const personalInfo = {
  name: "Muhammad Minhal",
  tagline: "Computer Engineering Student | AI/ML & Embedded Systems Enthusiast",
  bio: "Computer Engineering undergraduate at Information Technology University, Lahore, currently building real-world projects across embedded systems, machine learning, and full-stack development. Passionate about systems that combine hardware and software — from STM32 microcontrollers to deployed AI applications. Currently interning in MERN stack development.",
  email: "contact@example.com", // placeholder — update with real email when ready
  social: {
    github: "https://github.com/SyedMinhal570",
    // Set to your LinkedIn URL when ready — icon is hidden while empty or "#"
    linkedin: "",
  },
};

/** Navigation links — ids must match section id attributes on the homepage */
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Certifications", href: "#certifications" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

/** Grouped skills displayed in the Skills section */
export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["C++", "C", "Python", "JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    category: "Tools & IDEs",
    items: [
      "VS Code",
      "CLion",
      "PyCharm",
      "STM32CubeIDE",
      "Arduino IDE",
      "GitHub",
      "MATLAB",
      "Vivado",
    ],
  },
  {
    category: "Embedded Systems",
    items: ["STM32F407", "Arduino", "RISC-V (Verilog)"],
  },
  {
    category: "AI/ML & Web",
    items: [
      "MERN Stack",
      "Streamlit",
      "Scikit-learn",
      "MediaPipe",
      "Prisma",
      "Supabase",
    ],
  },
];

/** Project portfolio entries */
export const projects: Project[] = [
  {
    title: "Drelix AI",
    description:
      "Driver drowsiness and distraction detector using MediaPipe Face Mesh, EAR/MAR thresholds, and 2D geometry-based head pose estimation. Built for real-time safety monitoring.",
    tags: ["Python", "MediaPipe", "OpenCV", "Computer Vision"],
    githubUrl: "https://github.com/SyedMinhal570/drelix-ai",
  },
  {
    title: "FasalGuard",
    description:
      "Crop disease detector for Pakistani farmers using a custom MobileNetV2 model (99% validation accuracy, 38 disease classes), with a bilingual English/Urdu treatment knowledge base.",
    tags: ["Python", "TensorFlow", "MobileNetV2", "Streamlit"],
    githubUrl: "https://github.com/SyedMinhal570/fasalguard",
  },
  {
    title: "Urdu AI Writing Assistant",
    description:
      "Multilingual translation and summarization tool using Meta's NLLB-200 model across 9 languages with a TF-IDF extractive summarizer.",
    tags: ["Python", "NLLB-200", "NLP", "Transformers"],
    githubUrl: null,
  },
  {
    title: "InterviewGPT",
    description:
      "AI mock interview platform using Google Gemini 2.5 Flash, generating personalized questions from resumes/job descriptions with voice input and multi-factor answer evaluation.",
    tags: ["React", "Google Gemini", "Speech API", "AI"],
    githubUrl: "https://github.com/SyedMinhal570/InterviewGPT",
  },
  {
    title: "SentimentSense",
    description:
      "End-to-end ML sentiment analysis pipeline (NLTK + TF-IDF + Logistic Regression, 89% accuracy) with a Streamlit web app.",
    tags: ["Python", "NLTK", "Scikit-learn", "Streamlit"],
    githubUrl: "https://github.com/SyedMinhal570/SentimentSense",
  },
  {
    title: "TurboVision Web",
    description:
      "Fully client-side real-time object detection running YOLOv8n via ONNX Runtime Web in-browser, zero server, with webcam feed and FPS tracking.",
    tags: ["JavaScript", "YOLOv8", "ONNX Runtime Web", "WebRTC"],
    githubUrl: "https://github.com/SyedMinhal570/turbovision-web",
  },
  {
    title: "Integrated City Management System",
    description:
      "C++ resource management framework using Graphs and BSTs for city zone connectivity and emergency alert prioritization.",
    tags: ["C++", "Graphs", "BST", "Data Structures"],
    githubUrl: null,
  },
];

/** Education and work experience timeline */
export const experience: ExperienceItem[] = [
  {
    title: "B.S. Computer Engineering",
    organization: "Information Technology University, Lahore",
    period: "Sept 2024 – May 2028",
    description:
      "Undergraduate degree in Computer Engineering with focus on embedded systems, AI/ML, and software development.",
    type: "education",
  },
  {
    title: "Management Coordinator",
    organization: "IET On Campus ITU",
    period: "Aug 2024 – May 2025",
    description:
      "Managed event operations and team coordination for technical and professional events.",
    type: "work",
  },
];
