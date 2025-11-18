import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  const handleSignIn = () => {
    toast({
      title: "Coming Soon",
      description: "Authentication will be available shortly!",
    });
  };


  return (
    <div className="min-h-screen bg-background">
      <Navigation onSignIn={handleSignIn} />
      
      <main className="pt-16">
        <Hero onGetStarted={handleGetStarted} />
        <Features />
      </main>

      <footer className="border-t border-border/50 py-12 px-4 md:px-6 mt-24">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 StudyBuddy AI. Transforming education with AI.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
