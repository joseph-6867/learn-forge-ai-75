import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, ArrowLeft, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const Flashcards = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    loadFlashcards();
  }, [id]);

  const loadFlashcards = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await api.getFlashcards(id);
      setFlashcards(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load flashcards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShuffle = () => {
    setFlashcards([...flashcards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const currentCard = flashcards[currentIndex];

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
            <h1 className="text-4xl font-bold tracking-tight">Flashcards</h1>
            <Button variant="outline" onClick={handleShuffle}>
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>
          </div>

          {loading ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : flashcards.length > 0 ? (
            <>
              <div className="text-center text-muted-foreground mb-4">
                Card {currentIndex + 1} of {flashcards.length}
              </div>

              <Card
                className="h-96 cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <CardContent className="h-full flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">
                      {isFlipped ? "Answer" : "Question"}
                    </div>
                    <p className="text-2xl font-medium leading-relaxed">
                      {isFlipped ? currentCard.answer : currentCard.question}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click to flip
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentIndex === flashcards.length - 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </>
          ) : (
            <Card className="p-12">
              <p className="text-center text-muted-foreground">
                No flashcards available yet
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Flashcards;
