import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, FileText, AlertCircle, TrendingUp, Clock } from "lucide-react";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import { StatsChart } from "@/components/dashboard/StatsChart";

export default function Dashboard() {
  const { stats, recentActivities, loading } = useRealtimeStats();

  const statCards = [
    {
      title: "Total Books",
      value: loading ? "..." : stats.totalBooks.toLocaleString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: BookOpen,
      color: "text-primary bg-primary/10"
    },
    {
      title: "Active Members",
      value: loading ? "..." : stats.activeMembers.toLocaleString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: Users,
      color: "text-accent bg-accent/10"
    },
    {
      title: "Books Issued",
      value: loading ? "..." : stats.booksIssued.toLocaleString(),
      change: "-3%",
      changeType: "negative" as const,
      icon: FileText,
      color: "text-warning bg-warning/10"
    },
    {
      title: "Overdue Books",
      value: loading ? "..." : stats.overdueBooks.toLocaleString(),
      change: "+5%",
      changeType: "negative" as const,
      icon: AlertCircle,
      color: "text-destructive bg-destructive/10"
    }
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your library's current status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card 
            key={stat.title} 
            className={`hover-lift hover-glow transition-smooth glass-morphism animate-fade-in-up stagger-${index + 1}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.color} transition-bounce`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animate-shimmer">{stat.value}</div>
              <p className={`text-xs transition-smooth ${
                stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="glass-morphism hover-glow transition-smooth animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 animate-pulse-glow" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className={`flex items-center space-x-4 hover-lift transition-smooth animate-fade-in stagger-${index + 1}`}>
                  <div className="flex h-2 w-2 rounded-full bg-primary animate-pulse-glow"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.action}: <span className="text-primary">{activity.book_title}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.member_name} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Charts */}
        <StatsChart data={stats} />
      </div>
    </div>
  );
}