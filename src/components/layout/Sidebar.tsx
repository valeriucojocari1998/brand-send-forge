import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

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

      {/* Tabs Navigation */}
      <div className="flex-1 p-4">
        <Tabs value={activeSection} onValueChange={onSectionChange} orientation="vertical" className="w-full">
          <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent p-0 gap-1">
            <TabsTrigger 
              value="templates" 
              className="w-full justify-start text-left p-3 data-[state=active]:bg-sidebar-accent data-[state=active]:text-white"
            >
              Email Templates
            </TabsTrigger>
            <TabsTrigger 
              value="automations" 
              className="w-full justify-start text-left p-3 data-[state=active]:bg-sidebar-accent data-[state=active]:text-white"
            >
              Automation Rules
            </TabsTrigger>
            <TabsTrigger 
              value="branding" 
              className="w-full justify-start text-left p-3 data-[state=active]:bg-sidebar-accent data-[state=active]:text-white"
            >
              Brand Assets
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-sidebar-muted">
          Email Customization v2.1
        </div>
      </div>
    </div>
  );
}