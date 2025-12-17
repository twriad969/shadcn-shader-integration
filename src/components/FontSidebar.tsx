import { useState, useEffect } from "react";
import { Type, PanelLeftClose, PanelLeft, Copy, RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FontOption {
  name: string;
  class: string;
  label: string;
  category: "display" | "sans" | "serif";
}

const fonts: FontOption[] = [
  // Display & Modern
  { name: "Syne", class: "font-syne", label: "Syne", category: "display" },
  { name: "Bricolage Grotesque", class: "font-bricolage", label: "Bricolage", category: "display" },
  { name: "Red Hat Display", class: "font-red-hat", label: "Red Hat", category: "display" },
  
  // Premium Sans
  { name: "Outfit", class: "font-outfit", label: "Outfit", category: "sans" },
  { name: "Plus Jakarta Sans", class: "font-jakarta", label: "Jakarta Sans", category: "sans" },
  { name: "Manrope", class: "font-manrope", label: "Manrope", category: "sans" },
  { name: "Space Grotesk", class: "font-space-grotesk", label: "Space Grotesk", category: "sans" },
  { name: "DM Sans", class: "font-dm-sans", label: "DM Sans", category: "sans" },
  { name: "Albert Sans", class: "font-albert-sans", label: "Albert Sans", category: "sans" },
  { name: "Figtree", class: "font-figtree", label: "Figtree", category: "sans" },
  { name: "Onest", class: "font-onest", label: "Onest", category: "sans" },
  { name: "Urbanist", class: "font-urbanist", label: "Urbanist", category: "sans" },
  { name: "Lexend", class: "font-lexend", label: "Lexend", category: "sans" },
  { name: "Archivo", class: "font-archivo", label: "Archivo", category: "sans" },
  { name: "Work Sans", class: "font-work-sans", label: "Work Sans", category: "sans" },
  { name: "Rubik", class: "font-rubik", label: "Rubik", category: "sans" },
  { name: "Inter", class: "font-inter", label: "Inter", category: "sans" },
  { name: "Poppins", class: "font-poppins", label: "Poppins", category: "sans" },
  { name: "Montserrat", class: "font-montserrat", label: "Montserrat", category: "sans" },
  
  // Serif
  { name: "Playfair Display", class: "font-playfair", label: "Playfair", category: "serif" },
];

const weightOptions = [
  { value: 300, label: "Light" },
  { value: 400, label: "Regular" },
  { value: 500, label: "Medium" },
  { value: 600, label: "SemiBold" },
  { value: 700, label: "Bold" },
  { value: 800, label: "ExtraBold" },
];

const lineHeightOptions = [
  { value: 1.2, label: "Tight" },
  { value: 1.5, label: "Normal" },
  { value: 1.75, label: "Relaxed" },
  { value: 2, label: "Loose" },
];

const textTransformOptions = [
  { value: "none", label: "None" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "capitalize", label: "Capitalize" },
  { value: "lowercase", label: "lowercase" },
];

export interface TypographySettings {
  fontFamily: string;
  fontClass: string;
  fontWeight: number;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  textTransform: string;
}

const defaultSettings: TypographySettings = {
  fontFamily: "Syne",
  fontClass: "font-syne",
  fontWeight: 400,
  fontSize: 100,
  letterSpacing: 0,
  lineHeight: 1.5,
  textTransform: "none",
};

interface FontSidebarProps {
  settings: TypographySettings;
  onSettingsChange: (settings: TypographySettings) => void;
}

export function FontSidebar({ settings, onSettingsChange }: FontSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [fontsOpen, setFontsOpen] = useState(true);
  const [weightOpen, setWeightOpen] = useState(true);
  const [spacingOpen, setSpacingOpen] = useState(true);
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("typography-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        onSettingsChange({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error("Failed to parse saved settings");
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("typography-settings", JSON.stringify(settings));
  }, [settings]);

  const handleFontChange = (font: FontOption) => {
    onSettingsChange({
      ...settings,
      fontFamily: font.name,
      fontClass: font.class,
    });
  };

  const handleCopySettings = async () => {
    const exportSettings = {
      fontFamily: settings.fontFamily,
      fontWeight: settings.fontWeight,
      fontSize: `${settings.fontSize}%`,
      letterSpacing: `${settings.letterSpacing}em`,
      lineHeight: settings.lineHeight,
      textTransform: settings.textTransform,
    };
    
    await navigator.clipboard.writeText(JSON.stringify(exportSettings, null, 2));
    toast({
      title: "Copied!",
      description: "Typography settings copied to clipboard",
    });
  };

  const handleReset = () => {
    onSettingsChange(defaultSettings);
    toast({
      title: "Reset",
      description: "Typography settings reset to defaults",
    });
  };

  const groupedFonts = {
    display: fonts.filter(f => f.category === "display"),
    sans: fonts.filter(f => f.category === "sans"),
    serif: fonts.filter(f => f.category === "serif"),
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-lg bg-secondary/80 backdrop-blur-sm border border-border/30 hover:bg-secondary transition-colors"
        >
          <PanelLeft className="w-5 h-5 text-foreground" />
        </button>
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out",
          "w-72 bg-background/90 backdrop-blur-md border-r border-border/30 overflow-hidden flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30 shrink-0">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-foreground" />
            <span className="font-medium text-foreground">Typography</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-md hover:bg-secondary/50 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Font Family Section */}
          <Collapsible open={fontsOpen} onOpenChange={setFontsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/30 transition-colors">
              <span className="text-sm font-medium text-foreground">Font Family</span>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", fontsOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {/* Display Fonts */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground px-2">Display</span>
                {groupedFonts.display.map((font) => (
                  <button
                    key={font.name}
                    onClick={() => handleFontChange(font)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg transition-all duration-200",
                      "hover:bg-secondary/50",
                      font.class,
                      settings.fontClass === font.class
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <span className="text-sm">{font.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Sans Fonts */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground px-2">Sans Serif</span>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {groupedFonts.sans.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => handleFontChange(font)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg transition-all duration-200",
                        "hover:bg-secondary/50",
                        font.class,
                        settings.fontClass === font.class
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <span className="text-sm">{font.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Serif Fonts */}
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground px-2">Serif</span>
                {groupedFonts.serif.map((font) => (
                  <button
                    key={font.name}
                    onClick={() => handleFontChange(font)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg transition-all duration-200",
                      "hover:bg-secondary/50",
                      font.class,
                      settings.fontClass === font.class
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <span className="text-sm">{font.label}</span>
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Weight & Transform Section */}
          <Collapsible open={weightOpen} onOpenChange={setWeightOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/30 transition-colors">
              <span className="text-sm font-medium text-foreground">Weight & Style</span>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", weightOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-2 px-2">
              {/* Font Weight */}
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Weight</span>
                <div className="grid grid-cols-3 gap-1">
                  {weightOptions.map((weight) => (
                    <button
                      key={weight.value}
                      onClick={() => onSettingsChange({ ...settings, fontWeight: weight.value })}
                      className={cn(
                        "px-2 py-1.5 rounded text-xs transition-all",
                        settings.fontWeight === weight.value
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/50"
                      )}
                      style={{ fontWeight: weight.value }}
                    >
                      {weight.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Transform */}
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Transform</span>
                <div className="grid grid-cols-2 gap-1">
                  {textTransformOptions.map((transform) => (
                    <button
                      key={transform.value}
                      onClick={() => onSettingsChange({ ...settings, textTransform: transform.value })}
                      className={cn(
                        "px-2 py-1.5 rounded text-xs transition-all",
                        settings.textTransform === transform.value
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/50"
                      )}
                    >
                      {transform.label}
                    </button>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Spacing & Size Section */}
          <Collapsible open={spacingOpen} onOpenChange={setSpacingOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-secondary/30 transition-colors">
              <span className="text-sm font-medium text-foreground">Spacing & Size</span>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", spacingOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-2 px-2">
              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Size</span>
                  <span className="text-xs text-muted-foreground">{settings.fontSize}%</span>
                </div>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([value]) => onSettingsChange({ ...settings, fontSize: value })}
                  min={50}
                  max={150}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Letter Spacing */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Letter Spacing</span>
                  <span className="text-xs text-muted-foreground">{settings.letterSpacing.toFixed(2)}em</span>
                </div>
                <Slider
                  value={[settings.letterSpacing]}
                  onValueChange={([value]) => onSettingsChange({ ...settings, letterSpacing: value })}
                  min={-0.05}
                  max={0.2}
                  step={0.01}
                  className="w-full"
                />
              </div>

              {/* Line Height */}
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Line Height</span>
                <div className="grid grid-cols-4 gap-1">
                  {lineHeightOptions.map((lh) => (
                    <button
                      key={lh.value}
                      onClick={() => onSettingsChange({ ...settings, lineHeight: lh.value })}
                      className={cn(
                        "px-2 py-1.5 rounded text-xs transition-all",
                        settings.lineHeight === lh.value
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/50"
                      )}
                    >
                      {lh.label}
                    </button>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border/30 space-y-2 shrink-0">
          <button
            onClick={handleCopySettings}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-foreground text-sm"
          >
            <Copy className="w-4 h-4" />
            Copy Settings JSON
          </button>
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/30 transition-colors text-muted-foreground text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>
      </aside>
    </>
  );
}
