import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TemplatesListV2 as TemplatesList } from "@/components/templates/TemplatesListV2";
import { TemplateEditor } from "@/components/templates/TemplateEditor";
import { BrandingSettings } from "@/components/branding/BrandingSettings";
import { EmailAutomations } from "@/components/automations/EmailAutomations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Mail, Shield, TestTube } from "lucide-react";
import { EmailTemplate } from "@/types/templates";

const Index = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [creatingTemplate, setCreatingTemplate] = useState(false);

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template.id);
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

  const renderTabContent = () => {
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

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="automations">Email Automations</TabsTrigger>
          <TabsTrigger value="branding">Brand Assets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="mt-6">
          <TemplatesList 
            onEditTemplate={handleEditTemplate}
            onCreateTemplate={handleCreateTemplate}
          />
        </TabsContent>
        
        <TabsContent value="automations" className="mt-6">
          <EmailAutomations />
        </TabsContent>
        
        <TabsContent value="branding" className="mt-6">
          <BrandingSettings />
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;