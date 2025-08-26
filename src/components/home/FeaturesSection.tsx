import {
  BookOpen,
  Users,
  QrCode,
  TrendingUp,
  Shield,
  Clock,
  Smartphone,
  Globe,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "Smart Cataloging",
    description: "Automated book categorization with QR code generation and barcode scanning support.",
    color: "text-primary bg-primary/10"
  },
  {
    icon: Users,
    title: "Member Management",
    description: "Comprehensive user profiles with role-based permissions and activity tracking.",
    color: "text-accent bg-accent/10"
  },
  {
    icon: QrCode,
    title: "QR Code Integration",
    description: "Generate and scan QR codes for quick book identification and checkout processes.",
    color: "text-warning bg-warning/10"
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    description: "Real-time dashboard with insights on book popularity, member activity, and trends.",
    color: "text-success bg-success/10"
  },
  {
    icon: Shield,
    title: "Role-Based Security",
    description: "Granular permissions for admins, librarians, and members with secure authentication.",
    color: "text-destructive bg-destructive/10"
  },
  {
    icon: Clock,
    title: "Automated Reminders",
    description: "Smart notifications for due dates, penalties, and reservation confirmations.",
    color: "text-primary bg-primary/10"
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Fully responsive design that works seamlessly across all devices and screen sizes.",
    color: "text-accent bg-accent/10"
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Support for multiple languages and localization for global library systems.",
    color: "text-warning bg-warning/10"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance with instant search, quick load times, and smooth animations.",
    color: "text-success bg-success/10"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Powerful Features for Modern Libraries
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to manage your library efficiently, beautifully designed 
            with cutting-edge technology and user-centric approach.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="hover-lift bg-gradient-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}