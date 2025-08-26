import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayCircle, Pause, ChevronLeft, ChevronRight, BookOpen, Users, BarChart3, QrCode, CreditCard, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const demoSlides = [
  {
    id: 1,
    title: "Modern Dashboard",
    description: "Real-time analytics and quick access to all library functions",
    icon: BarChart3,
    features: ["Live statistics", "Quick actions", "Recent activity", "Performance metrics"],
    mockup: (
      <div className="bg-gradient-to-br from-background to-muted/50 p-4 rounded-lg border">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Library Dashboard</h3>
            <Badge variant="secondary">Live</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-3">
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-xs text-muted-foreground">Total Books</div>
            </Card>
            <Card className="p-3">
              <div className="text-2xl font-bold text-accent">89</div>
              <div className="text-xs text-muted-foreground">Active Members</div>
            </Card>
            <Card className="p-3">
              <div className="text-2xl font-bold text-warning">23</div>
              <div className="text-xs text-muted-foreground">Overdue</div>
            </Card>
          </div>
          <div className="h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Analytics Chart</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Smart Book Management",
    description: "Efficiently catalog, track, and manage your entire book collection",
    icon: BookOpen,
    features: ["ISBN scanning", "Automated cataloging", "Availability tracking", "Search & filters"],
    mockup: (
      <div className="bg-gradient-to-br from-background to-muted/50 p-4 rounded-lg border">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Book Management</h3>
            <Button size="sm" className="h-6 px-2 text-xs">Add Book</Button>
          </div>
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center space-x-3 p-2 bg-background rounded border">
                <div className="w-8 h-10 bg-primary/20 rounded"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Book Title {i}</div>
                  <div className="text-xs text-muted-foreground">Author Name • Available</div>
                </div>
                <QrCode className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Member Management",
    description: "Comprehensive user profiles with borrowing history and privileges",
    icon: Users,
    features: ["Digital profiles", "Borrowing history", "Role management", "Automated notifications"],
    mockup: (
      <div className="bg-gradient-to-br from-background to-muted/50 p-4 rounded-lg border">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Members</h3>
            <Badge variant="outline">156 Active</Badge>
          </div>
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center space-x-3 p-2 bg-background rounded border">
                <div className="w-8 h-8 bg-accent/20 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Member {i}</div>
                  <div className="text-xs text-muted-foreground">{2+i} books borrowed</div>
                </div>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "QR Code Integration",
    description: "Instant book check-in/out with QR code scanning technology",
    icon: QrCode,
    features: ["Quick scanning", "Instant transactions", "Mobile-friendly", "Offline support"],
    mockup: (
      <div className="bg-gradient-to-br from-background to-muted/50 p-4 rounded-lg border">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold">QR Scanner</h3>
            <p className="text-xs text-muted-foreground">Scan book QR code</p>
          </div>
          <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
            <div className="text-center space-y-2">
              <QrCode className="h-12 w-12 mx-auto text-primary animate-pulse" />
              <div className="text-xs text-muted-foreground">Position QR code here</div>
            </div>
          </div>
          <Button className="w-full" size="sm">Start Scanning</Button>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Transaction System",
    description: "Complete borrowing workflow with automated fine calculation",
    icon: CreditCard,
    features: ["Digital checkout", "Due date tracking", "Fine calculation", "Payment integration"],
    mockup: (
      <div className="bg-gradient-to-br from-background to-muted/50 p-4 rounded-lg border">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Transactions</h3>
            <Badge variant="outline">Today: 12</Badge>
          </div>
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center justify-between p-2 bg-background rounded border">
                <div className="space-y-1">
                  <div className="font-medium text-sm">Book Title {i}</div>
                  <div className="text-xs text-muted-foreground">Due: Jan {15+i}, 2025</div>
                </div>
                <Badge variant={i === 1 ? "destructive" : "secondary"} className="text-xs">
                  {i === 1 ? "Overdue" : "Active"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Advanced Analytics",
    description: "Comprehensive reports and insights for data-driven decisions",
    icon: BarChart3,
    features: ["Usage analytics", "Popular books", "Member trends", "Financial reports"],
    mockup: (
      <div className="bg-gradient-to-br from-background to-muted/50 p-4 rounded-lg border">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Analytics</h3>
            <Badge variant="outline">Real-time</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-background rounded border text-center">
              <div className="text-lg font-bold text-primary">87%</div>
              <div className="text-xs text-muted-foreground">Utilization</div>
            </div>
            <div className="p-2 bg-background rounded border text-center">
              <div className="text-lg font-bold text-accent">$245</div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
          </div>
          <div className="h-16 bg-gradient-to-r from-primary/20 via-accent/20 to-warning/20 rounded flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Trend Chart</span>
          </div>
        </div>
      </div>
    )
  }
];

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying || !open) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % demoSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, open]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % demoSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + demoSlides.length) % demoSlides.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const currentSlideData = demoSlides[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full p-0 overflow-hidden bg-background border-0 shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            LibroSphere Interactive Demo
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left side - Feature info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{currentSlideData.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentSlideData.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Key Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {currentSlideData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={prevSlide}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={nextSlide}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentSlide + 1} of {demoSlides.length}
                </div>
              </div>

              {/* Slide indicators */}
              <div className="flex space-x-2 justify-center">
                {demoSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right side - Mockup */}
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-muted/30 to-background rounded-lg border-2 border-border/50 overflow-hidden">
                <div className="h-full p-4 animate-fade-in" key={currentSlide}>
                  {currentSlideData.mockup}
                </div>
              </div>
              
              {/* Elegant frame overlay */}
              <div className="absolute inset-0 rounded-lg ring-1 ring-primary/20 pointer-events-none"></div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 pt-6 border-t border-border/50">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Close Demo
            </Button>
            <Button asChild className="bg-gradient-primary hover:bg-primary-hover">
              <a href="/auth">Try LibroSphere Now</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}