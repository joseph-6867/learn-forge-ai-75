import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Download, RefreshCw, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const Summary = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [document, setDocument] = useState<any>(null);

  useEffect(() => {
    loadSummary();
  }, [id]);

  const loadSummary = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [docData, summaryData] = await Promise.all([
        api.getDocument(id),
        api.getSummary(id)
      ]);
      setDocument(docData);
      setSummary(summaryData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load summary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    toast({
      title: "Coming Soon",
      description: "Export functionality will be available soon",
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
              <h1 className="text-4xl font-bold tracking-tight mb-2">Document Summary</h1>
              {document && (
                <p className="text-muted-foreground">{document.filename}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadSummary}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : summary ? (
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {summary.content}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No summary available yet
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6"
              onClick={() => navigate(`/flashcards/${id}`)}
            >
              <div className="text-center">
                <Brain className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">View Flashcards</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6"
              onClick={() => navigate(`/quiz/${id}`)}
            >
              <div className="text-center">
                <Brain className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">Take Quiz</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6"
              onClick={() => navigate(`/chat/${id}`)}
            >
              <div className="text-center">
                <Brain className="w-8 h-8 mx-auto mb-2" />
                <div className="font-semibold">Chat with Doc</div>
              </div>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Summary;
