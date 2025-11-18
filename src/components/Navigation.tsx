import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GraduationCap, Menu, Home, LayoutDashboard, Upload, FileText, Brain, MessageSquare, Calendar } from "lucide-react";

export const Navigation = ({ onSignIn }: { onSignIn: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { icon: Home, label: "Home", path: "/" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Upload, label: "Upload", path: "/upload" },
    { icon: FileText, label: "Summary", path: "/summary/demo" },
    { icon: Brain, label: "Flashcards", path: "/flashcards/demo" },
    { icon: MessageSquare, label: "Quiz", path: "/quiz/demo" },
    { icon: MessageSquare, label: "Chat", path: "/chat/demo" },
    { icon: Calendar, label: "Study Plan", path: "/study-plan/demo" },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MST
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <Button
              key={link.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavClick(link.path)}
              className="gap-2"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Button>
          ))}
          <Button variant="outline" onClick={onSignIn} className="ml-2">
            Sign In
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center gap-2">
          <Button variant="outline" onClick={onSignIn} size="sm">
            Sign In
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    variant="ghost"
                    onClick={() => handleNavClick(link.path)}
                    className="justify-start gap-3 h-12"
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
