import { NextResponse } from "next/server";
import { experience, personalInfo, projects, skills } from "@/lib/data";

export const runtime = "nodejs";

type HistoryMessage = {
  role: "user" | "model";
  text: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;
const rateLimitStore = new Map<string, RateLimitEntry>();

const FALLBACK_REPLY =
  "I'm not sure about that specific question, but feel free to ask about Minhal's skills, projects, or experience — or reach out via the Contact form!";

/** Certifications are defined in the Certifications component; summarized here for the chatbot. */
const certifications = [
  {
    title: "IEEE WIE Certificate of Appreciation",
    organization: "IEEE WIE SBAG, ITU",
    role: "Volunteer (2024–2025 tenure)",
  },
  {
    title: "IET Certificate of Appreciation",
    organization: "IET On Campus ITU Lahore",
    role: "Management Coordinator (2024–25)",
  },
];

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "127.0.0.1";
}

function isRateLimited(ipAddress: string): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(ipAddress);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ipAddress, {
      count: 1,
      resetAt: now + RATE_WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT;
}

function parseHistory(value: unknown): HistoryMessage[] | null {
  if (!Array.isArray(value)) return null;

  const recent = value.slice(-20);
  const parsed: HistoryMessage[] = [];

  for (const item of recent) {
    if (
      typeof item !== "object" ||
      item === null ||
      !("role" in item) ||
      !("text" in item)
    ) {
      return null;
    }

    const { role, text } = item as { role: unknown; text: unknown };
    if (
      (role !== "user" && role !== "model") ||
      typeof text !== "string" ||
      text.trim().length === 0 ||
      text.length > 2_000
    ) {
      return null;
    }

    parsed.push({ role, text: text.trim() });
  }

  return parsed;
}

/** "a, b, and c" style joining for natural-sounding lists */
function formatList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function includesAny(message: string, keywords: string[]): boolean {
  return keywords.some((keyword) => message.includes(keyword));
}

/** Extra name aliases so partial/informal project mentions still match */
const projectAliases: Record<string, string[]> = {
  "Drelix AI": ["drelix"],
  FasalGuard: ["fasalguard", "fasal guard", "crop disease"],
  "Urdu AI Writing Assistant": ["urdu", "writing assistant", "nllb"],
  InterviewGPT: ["interviewgpt", "interview gpt", "mock interview"],
  SentimentSense: ["sentimentsense", "sentiment sense", "sentiment analysis"],
  "TurboVision Web": ["turbovision", "turbo vision", "object detection"],
  "Integrated City Management System": [
    "city management",
    "icms",
    "city system",
  ],
};

function answerForProject(title: string): string {
  const project = projects.find((entry) => entry.title === title);
  if (!project) return FALLBACK_REPLY;

  const tagsSentence = `It's built with ${formatList(project.tags)}.`;
  const linkSentence = project.githubUrl
    ? ` You can explore the source code on GitHub: ${project.githubUrl}`
    : " The repository isn't public yet, but feel free to ask Minhal about it via the Contact form.";

  return `${project.title} is one of Minhal's projects — ${lowerFirst(
    project.description
  )} ${tagsSentence}${linkSentence}`;
}

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function answerForSkills(): string {
  const [languages, tools, embedded, aiWeb] = skills;
  return `Minhal works across a broad technical stack. He programs in ${formatList(
    languages.items
  )}, using tools like ${formatList(
    tools.items
  )}. On the embedded systems side he works with ${formatList(
    embedded.items
  )}, while for AI/ML and web development he uses ${formatList(aiWeb.items)}.`;
}

function answerForProjects(): string {
  const titles = projects.map((project) => project.title);
  const highlight = projects[1];
  return `Minhal has built ${projects.length} projects spanning AI/ML, computer vision, web, and embedded systems — including ${formatList(
    titles.slice(0, 4)
  )}. One highlight is ${highlight.title}, ${lowerFirst(
    highlight.description
  )} Ask me about any specific project (like "Tell me about ${titles[0]}") and I'll share the details!`;
}

function answerForExperience(): string {
  const education = experience.find((entry) => entry.type === "education");
  const work = experience.find((entry) => entry.type === "work");

  const educationSentence = education
    ? `Minhal is pursuing a ${education.title} at ${education.organization} (${education.period}), focusing on embedded systems, AI/ML, and software development.`
    : "";
  const workSentence = work
    ? ` He also served as ${work.title} at ${work.organization} (${work.period}), where he ${lowerFirst(
        work.description
      )}`
    : "";

  return `${educationSentence}${workSentence} On top of that, he's currently interning in MERN stack development, building real-world full-stack experience.`;
}

function answerForCertifications(): string {
  const [ieee, iet] = certifications;
  return `Minhal holds a couple of certifications from his campus involvement. He earned the ${ieee.title} from ${ieee.organization} as a ${ieee.role}, and the ${iet.title} from ${iet.organization} for his work as ${iet.role}. You can view both certificates in the Certifications section of this site.`;
}

function answerForAbout(): string {
  return `${personalInfo.name} is a ${lowerFirst(personalInfo.tagline)}. ${personalInfo.bio} Feel free to ask about his skills, projects, or experience!`;
}

function answerForContact(): string {
  return `The easiest way to reach Minhal is through the Contact form right here on this site — messages go straight to him. You can also email him at ${personalInfo.email} or check out his work on GitHub: ${personalInfo.social.github}.`;
}

function buildReply(rawMessage: string): string {
  const message = rawMessage.toLowerCase();

  // Specific project names take priority over broader categories
  for (const project of projects) {
    const aliases = [
      project.title.toLowerCase(),
      ...(projectAliases[project.title] ?? []),
    ];
    if (includesAny(message, aliases)) {
      return answerForProject(project.title);
    }
  }

  if (
    includesAny(message, [
      "certificat",
      "certified",
      "award",
      "achievement",
      "recognition",
    ])
  ) {
    return answerForCertifications();
  }

  if (
    includesAny(message, [
      "skill",
      "tech stack",
      "stack",
      "technolog",
      "language",
      "tools",
      "framework",
      "programming",
      "coding",
      "what can he do",
      "what does he know",
    ])
  ) {
    return answerForSkills();
  }

  if (
    includesAny(message, [
      "project",
      "built",
      "portfolio",
      "made",
      "apps",
      "applications",
      "showcase",
    ])
  ) {
    return answerForProjects();
  }

  if (
    includesAny(message, [
      "experience",
      "education",
      "study",
      "studies",
      "degree",
      "university",
      "intern",
      "job",
      "career",
      "work history",
      "school",
      "college",
      "qualification",
    ])
  ) {
    return answerForExperience();
  }

  if (
    includesAny(message, [
      "contact",
      "email",
      "reach",
      "hire",
      "hiring",
      "collaborat",
      "get in touch",
      "linkedin",
      "github",
      "connect",
    ])
  ) {
    return answerForContact();
  }

  const isGreeting = /\b(hi|hello|hey|salam|assalam)\b/.test(message);
  if (
    isGreeting ||
    includesAny(message, [
      "who is",
      "who's",
      "about minhal",
      "about him",
      "tell me about",
      "introduce",
      "bio",
      "himself",
      "minhal",
    ])
  ) {
    return answerForAbout();
  }

  return FALLBACK_REPLY;
}

export async function POST(request: Request) {
  const ipAddress = getClientIp(request);

  if (isRateLimited(ipAddress)) {
    return NextResponse.json(
      {
        error:
          "You've sent several messages quickly. Please wait a minute and try again.",
      },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as {
      message?: unknown;
      history?: unknown;
    };

    if (
      typeof body.message !== "string" ||
      body.message.trim().length === 0 ||
      body.message.length > 1_000
    ) {
      return NextResponse.json(
        { error: "Please enter a message between 1 and 1,000 characters." },
        { status: 400 }
      );
    }

    const history = parseHistory(body.history);
    if (!history) {
      return NextResponse.json(
        { error: "The conversation history is invalid." },
        { status: 400 }
      );
    }

    const reply = buildReply(body.message.trim());

    return NextResponse.json(
      { reply },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error(
      "Chatbot API error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json({ error: FALLBACK_REPLY }, { status: 500 });
  }
}
