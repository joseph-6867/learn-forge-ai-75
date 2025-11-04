import { Card } from "@/components/ui/card";
import { FileText, Brain, MessageSquare, Zap, Download, Video } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Smart Summaries",
    description: "AI extracts key points and creates concise, comprehensive summaries from any document.",
  },
  {
    icon: Brain,
    title: "Auto Flashcards",
    description: "Generate interactive flashcards automatically to reinforce your learning.",
  },
  {
    icon: Zap,
    title: "Instant Quizzes",
    description: "Create multiple-choice quizzes with detailed explanations in seconds.",
  },
  {
    icon: MessageSquare,
    title: "Document Chat",
    description: "Ask questions and get instant answers based on your uploaded content.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "Download your study materials as Word documents or PDFs.",
  },
  {
    icon: Video,
    title: "Video Suggestions",
    description: "Get relevant YouTube video recommendations to enhance your learning.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-4 md:px-6">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Everything You Need to Study Better
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools designed to make learning more efficient and effective
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex flex-col space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
