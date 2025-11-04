import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export const Navigation = ({ onSignIn }: { onSignIn: () => void }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            StudyBuddy AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden md:inline-flex">
            Features
          </Button>
          <Button variant="ghost" className="hidden md:inline-flex">
            How It Works
          </Button>
          <Button variant="outline" onClick={onSignIn}>
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
};
