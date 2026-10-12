"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Metric = {
  id: number;
  value: string;
  label: string;
  description: string[];
};

const metrics: Metric[] = [
  {
    id: 1,
    value: "5+",
    label: "Fejlesztési terület",
    description: ["asztali", "mobil", "front-end", "back-end", "tesztelés"],
  },
  {
    id: 2,
    value: "100%",
    label: "Minőségbiztosítás",
    description: [
      "csoportmunka",
      "verziókövetés",
      "tiszta kód",
      "kódellenőrzés",
      "automatizált tesztek",
      "tervezési minták",
    ],
  },
  {
    id: 3,
    value: "10+",
    label: "Technológiák",
    description: [
      "Docker, Kubernetes",
      "Git, GitHub",
      "REST API",
      "VS Code, Visual Studio",
      "Copilot, ChatGPT",
      "Cypress, Selenium",
      "SQL, NoSQL",
    ],
  },
  {
    id: 4,
    value: "5+",
    label: "Programozási nyelvek",
    description: ["Python", "C#", "JavaScript", "TypeScript", "PHP"],
  },
  {
    id: 5,
    value: "CI/CD",
    label: "Fejlesztési folyamat",
    description: ["folyamatos integráció", "automatizált build", "tesztelés", "telepítés"],
  },
];

type MetricCardProps = {
  metric: Metric;
  index: number;
  progress: MotionValue<number>;
};

// Egy hasáb: a beúszása a hasábokat tartalmazó div görgetési pozíciójától függ
function MetricCard({ metric, index, progress }: MetricCardProps) {
  // Minden hasáb a görgetési tartomány egy-egy, lépcsőzetesen eltolt szakaszán úszik be
  // (az utolsó hasáb pontosan 1-nél, a tartomány végén ér a helyére)
  const start = index * 0.15;
  const end = start + 0.4;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [80, 0]);

  return (
    <motion.div
      className={`flex min-w-50 flex-1 flex-col items-center justify-center px-8 text-center ${index !== metrics.length - 1 ? "border-purple-300/20 pb-6 max-sm:border-b md:border-r md:pb-0" : ""}`}
      style={{ opacity, y }}
      whileHover={{ scale: 1.05 }}
    >
      <h3 className="mb-4 text-3xl font-bold text-blue-500/60 md:text-5xl dark:text-purple-300/60">
        {metric.value}
      </h3>
      <p className="mb-2 text-2xl text-black dark:text-white">{metric.label}</p>
      <ul className="list-inside list-disc text-left text-lg leading-relaxed text-gray-800 md:text-xl dark:text-gray-400">
        {metric.description.map((desc, descIndex) => (
          <li key={descIndex}>{desc}</li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function KeyMetrics() {
  const cardsRef = useRef<HTMLDivElement>(null);
  // 0: a div teteje a képernyő aljánál, 1: a div teteje a képernyő tetejétől 20%-ra
  const { scrollYProgress } = useScroll({
    target: cardsRef,
    offset: ["start end", "start 0.2"],
  });

  return (
    <section className="container mx-auto px-4 py-32 text-white" id="about">
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        viewport={{ margin: "0px 0px -20% 0px" }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <p className="text-center text-4xl font-bold text-gray-800/30 md:text-6xl dark:text-purple-300/80">
          Mihez ért egy végzett Jedlikes?
        </p>
      </motion.h2>

      <div
        className="mt-6 flex flex-col items-stretch space-y-12 overflow-x-auto rounded-2xl bg-white/5 p-8 backdrop-blur-sm md:flex-row md:space-y-0"
        ref={cardsRef}
      >
        {metrics.map((metric, index) => (
          <MetricCard index={index} key={index} metric={metric} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
