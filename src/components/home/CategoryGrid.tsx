import Link from "next/link";
import {
  Plug,
  Bot,
  Database,
  MessageCircle,
  PenTool,
  Languages,
  BarChart,
  Zap,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  nameCn: string;
  slug: string;
  description: string;
  workflowCount: number;
}

interface CategoryGridProps {
  categories: Category[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  mcp: Plug,
  agents: Bot,
  rag: Database,
  chatbots: MessageCircle,
  content: PenTool,
  translation: Languages,
  data: BarChart,
  automation: Zap,
  development: Code,
};

const colorMap: Record<string, string> = {
  mcp: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
  agents: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
  rag: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
  chatbots: "from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700",
  content:
    "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
  translation:
    "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
  data: "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
  automation:
    "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
  development:
    "from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700",
};

const bgColorMap: Record<string, string> = {
  mcp: "bg-purple-500/10 border-purple-500/20",
  agents: "bg-blue-500/10 border-blue-500/20",
  rag: "bg-green-500/10 border-green-500/20",
  chatbots: "bg-cyan-500/10 border-cyan-500/20",
  content: "bg-orange-500/10 border-orange-500/20",
  translation: "bg-pink-500/10 border-pink-500/20",
  data: "bg-indigo-500/10 border-indigo-500/20",
  automation: "bg-yellow-500/10 border-yellow-500/20",
  development: "bg-slate-500/10 border-slate-500/20",
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect workflow template for your use case. From MCP
            servers to RAG pipelines, we&apos;ve got you covered.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = iconMap[category.id] || Zap;
            const gradientColor = colorMap[category.id] || colorMap.automation;
            const bgColor = bgColorMap[category.id] || bgColorMap.automation;

            return (
              <Link
                key={category.id}
                href={`/explore/${category.slug}`}
                className={cn(
                  "group relative overflow-hidden rounded-xl border p-6 transition-all duration-300",
                  "hover:shadow-lg hover:-translate-y-0.5",
                  bgColor,
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4",
                    "bg-gradient-to-br text-white shadow-lg",
                    gradientColor,
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {category.description}
                </p>

                {/* Count badge */}
                <div className="inline-flex items-center text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {category.workflowCount}
                  </span>
                  <span className="ml-1">templates</span>
                </div>

                {/* Hover arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-background shadow flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
