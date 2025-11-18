import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload as UploadIcon, FileText, X, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(30);

    try {
      // Upload file
      const uploadResult = await api.uploadDocument(selectedFile);
      setProgress(60);

      // For now, we'll simulate text extraction
      // In production, you'd use a proper extraction library
      const mockExtractedText = `Sample extracted text from ${selectedFile.name}`;
      
      // Process document
      await api.processDocument(uploadResult.documentId, mockExtractedText);
      setProgress(100);

      toast({
        title: "Success!",
        description: "Your document has been processed",
      });

      // Navigate to summary page
      setTimeout(() => {
        navigate(`/summary/${uploadResult.documentId}`);
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process document",
        variant: "destructive",
      });
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
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
            Back to Dashboard
          </Button>
        </div>
      </nav>

      <main className="container px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Upload Your Study Material
            </h1>
            <p className="text-lg text-muted-foreground">
              Supports PDF, Word, and PowerPoint files up to 10MB
            </p>
          </div>

          <Card
            className={`p-12 border-2 border-dashed transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/5 scale-105"
                : "border-border hover:border-primary/50"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              {!selectedFile ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <UploadIcon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">
                      Drag & drop your file here
                    </h3>
                    <p className="text-muted-foreground">or click to browse</p>
                  </div>
                  <Button
                    onClick={() => document.getElementById('file-input')?.click()}
                    size="lg"
                  >
                    Select File
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  />
                </>
              ) : (
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                    <FileText className="w-10 h-10 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedFile(null)}
                      disabled={isProcessing}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={progress} />
                      <p className="text-sm text-center text-muted-foreground">
                        Processing your document...
                      </p>
                    </div>
                  )}

                  {!isProcessing && (
                    <Button
                      onClick={handleUpload}
                      size="lg"
                      className="w-full"
                    >
                      Process Document
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Upload;
