import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";

interface SidebarProps {}

export function Sidebar({}: SidebarProps) {
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

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="text-sm text-sidebar-muted">
          Configure email templates, automation rules, and brand assets using the tabs in the main content area.
        </div>
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