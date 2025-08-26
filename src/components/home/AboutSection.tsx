import { CheckCircle, Shield, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AboutSection() {
  const values = [
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee"
    },
    {
      icon: Users,
      title: "User-Centered Design",
      description: "Built with librarians and patrons in mind for optimal experience"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance for quick searches and seamless browsing"
    },
    {
      icon: CheckCircle,
      title: "Proven Success",
      description: "Trusted by libraries worldwide with measurable results"
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-16 animate-fade-in-up">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              About LibroSphere
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              We're revolutionizing library management with cutting-edge technology 
              that makes organizing, tracking, and accessing books effortless.
            </p>
          </div>

          {/* Story */}
          <Card className="mb-16 glass-morphism hover-lift transition-smooth animate-fade-in-up stagger-1">
            <CardContent className="p-8 lg:p-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Founded in 2023, LibroSphere emerged from a simple observation: libraries needed 
                  modern tools that matched their important mission. Our team of developers, designers, 
                  and library science experts came together to create a platform that doesn't just 
                  digitize old processes—it reimagines them entirely.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-6">
                  Today, we serve hundreds of libraries worldwide, from small community centers 
                  to large academic institutions, helping them serve their communities better 
                  through technology that just works.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={value.title} className={`glass-morphism hover-lift hover-glow transition-smooth animate-fade-in-up stagger-${index + 1}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 animate-bounce-gentle">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}