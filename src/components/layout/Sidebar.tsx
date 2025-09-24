import { cn } from "@/lib/utils";
import { Mail, Settings, FileText, Users, Building, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  {
    id: "templates",
    name: "Email Templates",
    icon: FileText,
    description: "Manage all email templates"
  },
  {
    id: "branding",
    name: "Domain & Branding",
    icon: Building,
    description: "Configure domains and brand assets"
  },
  {
    id: "automations",
    name: "Email Automations",
    icon: Settings,
    description: "Configure automation rules"
  }
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="w-64 bg-sidebar border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">Email Settings</h1>
            <p className="text-sm text-sidebar-muted">Customize your notifications</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full justify-start h-auto p-3 text-left",
                "hover:bg-sidebar-accent/10 transition-smooth",
                isActive && "bg-sidebar-accent text-white hover:bg-sidebar-accent hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 mr-3 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{item.name}</div>
                <div className={cn(
                  "text-xs mt-0.5",
                  isActive ? "text-white/80" : "text-sidebar-muted"
                )}>
                  {item.description}
                </div>
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-sidebar-muted">
          Email Customization v2.1
        </div>
      </div>
    </div>
  );
}