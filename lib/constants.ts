export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string; // YYYY-MM-DD
  time: string; // human time
  description: string;
  overview: string;
  agenda: string[];
  tags: string[];
  organizer: string;
  mode: string;
  audience: string;
};

export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "React Summit US 2025",
    slug: "react-summit-us-2025",
    location: "San Francisco, CA, USA",
    date: "2025-11-07",
    time: "09:00 AM",
    description: "A full-day conference covering the latest in React, state management, and performance.",
    overview:
      "Join React core contributors and community experts for talks, workshops, and networking focused on building fast, resilient user interfaces.",
    agenda: ["Keynote: The future of React", "Advanced patterns workshop", "Scaling React apps"],
    tags: ["react", "frontend", "javascript"],
    organizer: "React Community",
    mode: "offline",
    audience: "Developers",
  },
  {
    image: "/images/event2.png",
    title: "KubeCon + CloudNativeCon Europe 2026",
    slug: "kubecon-cloudnativecon-eu-2026",
    location: "Vienna, Austria",
    date: "2026-03-18",
    time: "10:00 AM",
    description: "The largest gathering for cloud native communities covering Kubernetes, observability, and edge computing.",
    overview:
      "Leading practitioners share real-world experiences building and operating resilient distributed systems on Kubernetes.",
    agenda: ["Kubernetes internals deep-dive", "Service mesh patterns", "Observability at scale"],
    tags: ["kubernetes", "cloudnative", "devops"],
    organizer: "Cloud Native Computing Foundation",
    mode: "offline",
    audience: "Engineers",
  },
  {
    image: "/images/event3.png",
    title: "AWS re:Invent 2025",
    slug: "aws-reinvent-2025",
    location: "Las Vegas, NV, USA",
    date: "2025-12-01",
    time: "08:30 AM",
    description: "AWS's annual conference with product announcements, deep technical sessions, and hands-on labs.",
    overview: "Product launches, architecture sessions, and practical guides to building on AWS.",
    agenda: ["Serverless patterns", "Data analytics workshop", "Security best practices"],
    tags: ["cloud", "aws", "architecture"],
    organizer: "Amazon Web Services",
    mode: "hybrid",
    audience: "Architects",
  },
  {
    image: "/images/event4.png",
    title: "Next.js Conf 2025",
    slug: "nextjs-conf-2025",
    location: "Los Angeles, CA, USA (Hybrid)",
    date: "2025-11-12",
    time: "09:30 AM",
    description: "Official Next.js conference with talks from the core team and adopters.",
    overview: "Learn about the latest Next.js features, performance strategies, and production patterns.",
    agenda: ["Next.js roadmap", "Edge functions workshop", "Performance case studies"],
    tags: ["nextjs", "react", "webdev"],
    organizer: "Vercel",
    mode: "hybrid",
    audience: "Frontend Engineers",
  },
  {
    image: "/images/event5.png",
    title: "Google Cloud Next 2026",
    slug: "google-cloud-next-2026",
    location: "San Jose, CA, USA",
    date: "2026-04-07",
    time: "09:00 AM",
    description: "Google Cloud's flagship conference covering AI, data platforms, and cloud infrastructure.",
    overview: "Hands-on sessions and customer stories showing how organizations scale with Google Cloud.",
    agenda: ["Generative AI on Google Cloud", "Data platform modernisation", "Security and compliance"],
    tags: ["gcp", "ai", "data"],
    organizer: "Google Cloud",
    mode: "offline",
    audience: "Data Engineers",
  },
  {
    image: "/images/event6.png",
    title: "ETHGlobal Hackathon: Paris 2026",
    slug: "ethglobal-paris-2026",
    location: "Paris, France",
    date: "2026-07-10",
    time: "10:00 AM",
    description: "A weekend hackathon focused on blockchain and decentralized tech with mentorship and prizes.",
    overview: "Build, learn, and ship Web3 projects with a strong community and developer support.",
    agenda: ["Kickoff & ideation", "Mentor sessions", "Demos and prizes"],
    tags: ["web3", "blockchain", "hackathon"],
    organizer: "ETHGlobal",
    mode: "offline",
    audience: "Hackers",
  },
];

export default events;