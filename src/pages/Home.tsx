import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";

function HomeContent() {
  const { isDark, setTheme, theme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header darkMode={isDark} toggleDarkMode={toggleDarkMode} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="libroshere-theme">
      <HomeContent />
    </ThemeProvider>
  );
}