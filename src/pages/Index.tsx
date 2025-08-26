import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">LibroSphere Demo</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          This is a demo page. Visit the main application to explore LibroSphere's features.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild className="bg-gradient-primary hover:bg-primary-hover">
            <a href="/">
              Go to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="/app">Go to Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
