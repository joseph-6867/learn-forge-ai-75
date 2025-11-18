import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Brain, MessageSquare, Calendar, Download, Sparkles } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: "Upload File",
      description: "Upload PDF, DOCX, PPTX, or media files",
      action: () => navigate("/upload"),
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileText,
      title: "Generate Summary",
      description: "AI-powered summaries of your content",
      action: () => navigate("/upload"),
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Brain,
      title: "Create Flashcards",
      description: "Auto-generate study flashcards",
      action: () => navigate("/upload"),
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      title: "Generate Quiz",
      description: "Test your knowledge with AI quizzes",
      action: () => navigate("/upload"),
      color: "from-orange-500 to-red-500"
    },
    {
      icon: MessageSquare,
      title: "Chat With Document",
      description: "Ask questions about your content",
      action: () => navigate("/upload"),
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Calendar,
      title: "Create Study Plan",
      description: "Plan your learning journey",
      action: () => navigate("/upload"),
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: Download,
      title: "Export to DOCX",
      description: "Download your study materials",
      action: () => navigate("/upload"),
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MST
            </span>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </nav>

      <main className="container px-4 md:px-6 py-12">
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Your Study Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose a tool to get started with AI-powered learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-border/50"
              onClick={feature.action}
            >
              <CardHeader>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
