import { WebGLShader } from "@/components/ui/web-gl-shader";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const Index = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      <WebGLShader />
      <div className="relative border border-border/30 p-2 w-full mx-auto max-w-3xl">
        <main className="relative border border-border/30 py-10 overflow-hidden">
          <h1 className="mb-3 text-hero-foreground text-center text-5xl sm:text-6xl md:text-7xl font-syne font-light tracking-tight lg:text-[clamp(2rem,8vw,7rem)]">
            Fahimun Tasin
          </h1>
          <p className="text-hero-muted px-6 text-center text-xs md:text-sm lg:text-lg max-w-xl mx-auto">
            I build future-ready digital experiences. Founder at VibeAcademy, specializing in AI Automation, SaaS, and cutting-edge tech solutions. Based in Rajshahi, crafting global impact.
          </p>
          <div className="mt-8 flex justify-center">
            <a href="mailto:tasinfahimun@gmail.com">
              <Button className="group" variant="secondary">
                <Mail className="-ms-1 me-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
                Email
                <ArrowRight
                  className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
