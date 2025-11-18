import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const Quiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await api.getQuiz(id);
      setQuiz(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    const correct = quiz.filter((q, i) => answers[i] === q.correct_answer).length;
    toast({
      title: "Quiz Complete!",
      description: `You scored ${correct} out of ${quiz.length}`,
    });
  };

  const getScore = () => {
    return quiz.filter((q, i) => answers[i] === q.correct_answer).length;
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
          <Button variant="outline" onClick={() => navigate(`/summary/${id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </nav>

      <main className="container px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">Quiz Time</h1>
            {showResults && (
              <div className="text-2xl font-bold text-primary">
                Score: {getScore()}/{quiz.length}
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : quiz.length > 0 ? (
            <>
              <div className="space-y-6">
                {quiz.map((question, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Question {index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="font-medium">{question.question}</p>
                      <div className="space-y-2">
                        {question.options.map((option: string, optIndex: number) => {
                          const isSelected = answers[index] === option;
                          const isCorrect = option === question.correct_answer;
                          const showFeedback = showResults && isSelected;

                          return (
                            <Button
                              key={optIndex}
                              variant={isSelected ? "default" : "outline"}
                              className={`w-full justify-start text-left h-auto py-3 ${
                                showFeedback
                                  ? isCorrect
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-red-500 hover:bg-red-600"
                                  : ""
                              }`}
                              onClick={() => {
                                if (!showResults) {
                                  setAnswers({ ...answers, [index]: option });
                                }
                              }}
                              disabled={showResults}
                            >
                              <span className="flex-1">{option}</span>
                              {showFeedback && (
                                isCorrect ? (
                                  <CheckCircle className="w-5 h-5 ml-2" />
                                ) : (
                                  <XCircle className="w-5 h-5 ml-2" />
                                )
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!showResults && (
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="w-full"
                  disabled={Object.keys(answers).length !== quiz.length}
                >
                  Submit Quiz
                </Button>
              )}
            </>
          ) : (
            <Card className="p-12">
              <p className="text-center text-muted-foreground">
                No quiz available yet
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quiz;
