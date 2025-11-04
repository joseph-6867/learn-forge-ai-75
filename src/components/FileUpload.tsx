import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptedFormats = ".pdf,.doc,.docx,.ppt,.pptx";
  const maxSize = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      toast({
        title: "Unsupported format",
        description: "Please upload a PDF, Word document, or PowerPoint file",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-24 px-4 md:px-6 bg-muted/50">
      <div className="container max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Upload Your Study Material
          </h2>
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
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center justify-center space-y-6">
            {!selectedFile ? (
              <>
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">
                    Drag & drop your file here
                  </h3>
                  <p className="text-muted-foreground">or click to browse</p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                >
                  Select File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={acceptedFormats}
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
              </>
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted w-full max-w-md">
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
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};
