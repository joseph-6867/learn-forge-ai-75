import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, ArrowLeft, Download, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StudyPlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const weekPlan = [
    {
      day: "Monday",
      tasks: ["Review flashcards (30 min)", "Complete quiz section 1-3", "Watch related videos"],
      completed: 3,
      total: 3
    },
    {
      day: "Tuesday",
      tasks: ["Read summary chapter 1", "Practice problems", "Create mind map"],
      completed: 2,
      total: 3
    },
    {
      day: "Wednesday",
      tasks: ["Review notes", "Group study session", "Complete assignments"],
      completed: 0,
      total: 3
    },
    {
      day: "Thursday",
      tasks: ["Watch lectures", "Take practice quiz", "Review mistakes"],
      completed: 0,
      total: 3
    },
    {
      day: "Friday",
      tasks: ["Final review", "Mock test", "Rest and consolidate"],
      completed: 0,
      total: 3
    }
  ];

  const handleDownload = () => {
    toast({
      title: "Coming Soon",
      description: "Study plan export will be available soon",
    });
  };

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
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </nav>

      <main className="container px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Your Study Plan</h1>
              <p className="text-muted-foreground">Stay on track with your learning goals</p>
            </div>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Export Plan
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="text-muted-foreground">
                    5 / 15 tasks completed
                  </span>
                </div>
                <Progress value={33} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {weekPlan.map((day, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <CardTitle className="text-xl">{day.day}</CardTitle>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {day.completed}/{day.total} completed
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {day.tasks.map((task, taskIndex) => (
                      <li
                        key={taskIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          taskIndex < day.completed
                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                            : "bg-muted"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          taskIndex < day.completed
                            ? "border-green-500 bg-green-500"
                            : "border-border"
                        }`}>
                          {taskIndex < day.completed && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyPlan;
