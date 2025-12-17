import { useState } from "react";
import { Type, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface FontOption {
  name: string;
  class: string;
  label: string;
}

const fonts: FontOption[] = [
  { name: "Syne", class: "font-syne", label: "Syne" },
  { name: "Playfair Display", class: "font-playfair", label: "Playfair" },
  { name: "Space Grotesk", class: "font-space-grotesk", label: "Space Grotesk" },
  { name: "Outfit", class: "font-outfit", label: "Outfit" },
  { name: "DM Sans", class: "font-dm-sans", label: "DM Sans" },
  { name: "Plus Jakarta Sans", class: "font-jakarta", label: "Jakarta Sans" },
  { name: "Manrope", class: "font-manrope", label: "Manrope" },
  { name: "Inter", class: "font-inter", label: "Inter" },
  { name: "Poppins", class: "font-poppins", label: "Poppins" },
  { name: "Montserrat", class: "font-montserrat", label: "Montserrat" },
];

interface FontSidebarProps {
  selectedFont: string;
  onFontChange: (fontClass: string) => void;
}

export function FontSidebar({ selectedFont, onFontChange }: FontSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Toggle button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-lg bg-secondary/80 backdrop-blur-sm border border-border/30 hover:bg-secondary transition-colors"
        >
          <PanelLeft className="w-5 h-5 text-foreground" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out",
          "w-64 bg-background/80 backdrop-blur-md border-r border-border/30",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-foreground" />
            <span className="font-medium text-foreground">Fonts</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-md hover:bg-secondary/50 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="p-3 space-y-1">
          {fonts.map((font) => (
            <button
              key={font.name}
              onClick={() => onFontChange(font.class)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-secondary/50",
                font.class,
                selectedFont === font.class
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <span className="text-sm">{font.label}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
