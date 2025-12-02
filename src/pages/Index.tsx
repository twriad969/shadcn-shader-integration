import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

const Index = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      <WebGLShader />
      <div className="relative border border-border/30 p-2 w-full mx-auto max-w-3xl">
        <main className="relative border border-border/30 py-10 overflow-hidden">
          <h1 className="mb-3 text-hero-foreground text-center text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter lg:text-[clamp(2rem,8vw,7rem)]">
            Ronok Sheikh
          </h1>
          <p className="text-hero-muted px-6 text-center text-xs md:text-sm lg:text-lg">
            I build future-ready digital experiences. Founder at VibeAcademy, specializing in AI Automation, SaaS, and cutting-edge tech solutions. Based in Rajshahi, crafting global impact.
          </p>
          <div className="my-8 flex items-center justify-center gap-1">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-status"></span>
            </span>
            <p className="text-xs text-status">Available for New Projects</p>
          </div>

          <div className="flex justify-center">
            <LiquidButton className="text-hero-foreground border border-border/50 rounded-full" size="xl">
              Let's Go
            </LiquidButton>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
