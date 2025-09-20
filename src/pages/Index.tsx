import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TemplatesList } from "@/components/templates/TemplatesList";
import { TemplateEditor } from "@/components/templates/TemplateEditor";
import { BrandingSettings } from "@/components/branding/BrandingSettings";
import { TestingPanel } from "@/components/testing/TestingPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Mail, Shield, TestTube } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("templates");
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [creatingTemplate, setCreatingTemplate] = useState(false);

  const handleEditTemplate = (id: string) => {
    setEditingTemplate(id);
  };

  const handleCreateTemplate = () => {
    setCreatingTemplate(true);
  };

  const handleBackToTemplates = () => {
    setEditingTemplate(null);
    setCreatingTemplate(false);
  };

  const handleSaveTemplate = (template: any) => {
    console.log("Save template:", template);
    setEditingTemplate(null);
    setCreatingTemplate(false);
  };

  const renderContent = () => {
    // Show template editor if editing or creating
    if (editingTemplate || creatingTemplate) {
      return (
        <TemplateEditor
          templateId={editingTemplate || undefined}
          onBack={handleBackToTemplates}
          onSave={handleSaveTemplate}
        />
      );
    }

    switch (activeSection) {
      case "templates":
        return (
          <TemplatesList 
            onEditTemplate={handleEditTemplate}
            onCreateTemplate={handleCreateTemplate}
          />
        );
      case "branding":
        return <BrandingSettings />;
      case "testing":
        return <TestingPanel />;
      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">General Settings</h2>
              <p className="text-muted-foreground">Configure global email preferences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Global email sending preferences and delivery options.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Email security and compliance configuration.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;