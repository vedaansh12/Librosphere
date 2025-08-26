import { useState } from "react";
import { ArrowRight, PlayCircle, BookOpen, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { DemoModal } from "./DemoModal";
import heroImage from "@/assets/library-hero.jpg";

export function HeroSection() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      
      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in-up stagger-1">
                Modern Library
                <span className="block text-primary animate-fade-in-up stagger-2">Management</span>
                <span className="block animate-fade-in-up stagger-3">Reimagined</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-lg animate-fade-in-up stagger-4">
                LibroSphere brings your library into the digital age with elegant design, 
                powerful features, and seamless user experience.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-5">
              <Button asChild size="lg" className="bg-gradient-primary hover:bg-primary-hover text-lg px-8 hover-lift transition-bounce">
                <Link to="/auth">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-smooth" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 hover-glow transition-smooth"
                onClick={() => setDemoModalOpen(true)}
              >
                <PlayCircle className="mr-2 h-5 w-5 animate-pulse-glow" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <Card className="text-center bg-gradient-card hover-lift hover-glow transition-bounce glass-morphism animate-scale-in stagger-1">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary animate-shimmer">10K+</div>
                  <div className="text-sm text-muted-foreground">Books Managed</div>
                </CardContent>
              </Card>
              <Card className="text-center bg-gradient-card hover-lift hover-glow transition-bounce glass-morphism animate-scale-in stagger-2">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary animate-shimmer">500+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </CardContent>
              </Card>
              <Card className="text-center bg-gradient-card hover-lift hover-glow transition-bounce glass-morphism animate-scale-in stagger-3">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary animate-shimmer">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Feature Preview */}
          <div className="space-y-6 animate-slide-in-right">
            <Card className="glass-morphism hover-lift hover-glow shadow-elegant transition-bounce animate-fade-in-up stagger-1">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 animate-bounce-gentle">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Smart Book Management</h3>
                    <p className="text-sm text-muted-foreground">
                      QR codes, real-time tracking, automated cataloging
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism hover-lift hover-glow shadow-elegant transition-bounce animate-fade-in-up stagger-2">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 animate-bounce-gentle">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Member Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Role-based access, digital profiles, history tracking
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism hover-lift hover-glow shadow-elegant transition-bounce animate-fade-in-up stagger-3">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10 animate-bounce-gentle">
                    <TrendingUp className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Analytics & Reports</h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time insights, usage patterns, performance metrics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <DemoModal open={demoModalOpen} onOpenChange={setDemoModalOpen} />
    </section>
  );
}