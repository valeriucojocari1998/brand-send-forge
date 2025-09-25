import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplateCardV2 } from "./TemplateCardV2";
import { EmailTemplate, TemplateCategoryType } from "@/types/templates";
import { Search, Plus, Filter, Grid, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TemplatesListV2Props {
  templates: EmailTemplate[];
  onCreateTemplate: () => void;
  onEditTemplate: (template: EmailTemplate) => void;
}

const mockTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Load Status Change Notification",
    subject: "Load {{LoadID}} Status Updated: {{LoadStatus}}",
    body: "Dear {{CarrierName}}, the status of load {{LoadID}} has been updated to {{LoadStatus}}.",
    category: "operational",
    description: "Triggered when load status changes (Dispatched, Cancelled, Released, etc.)",
    status: "active",
    lastModified: new Date(Date.now() - 3600000),
    variables: ["LoadID", "LoadStatus", "PreviousStatus", "CarrierName"],
  },
  {
    id: "2",
    name: "Driver Statement Email",
    subject: "Driver Statement - {{StatementPeriod}} | {{DriverName}}",
    body: "Dear {{DriverName}}, your statement for {{StatementPeriod}} is ready.",
    category: "financial",
    description: "Weekly/monthly statement for driver payments and settlements",
    status: "active",
    lastModified: new Date(Date.now() - 7200000),
    variables: ["DriverName", "StatementPeriod", "TotalEarnings"],
  },
  {
    id: "3",
    name: "Marketplace Bid Received",
    subject: "New Bid Received - Load {{LoadID}} | ${{BidAmount}}",
    body: "A new bid has been received for load {{LoadID}} from {{CarrierName}}.",
    category: "marketplace",
    description: "Notification when a new bid is received on marketplace load",
    status: "draft",
    lastModified: new Date(Date.now() - 86400000),
    variables: ["LoadID", "CarrierName", "BidAmount"],
  },
  {
    id: "4",
    name: "Carrier Onboarding Packet",
    subject: "Welcome {{CarrierName}} - Onboarding Started",
    body: "Welcome to our network! Your onboarding process has begun.",
    category: "onboarding",
    description: "Welcome packet with required documents and next steps",
    status: "active",
    lastModified: new Date(Date.now() - 172800000),
    variables: ["CarrierName", "ContactPerson"],
  },
];

const categoryConfig = {
  operational: {
    name: "🚛 Operational",
    description: "Load status changes, driver notifications, delay alerts",
    color: "bg-blue-100 text-blue-700"
  },
  financial: {
    name: "💰 Financial",
    description: "Driver payments, carrier settlements, quick pay",
    color: "bg-green-100 text-green-700"
  },
  marketplace: {
    name: "🏪 Marketplace",
    description: "Bidding workflow, load postings, carrier communications",
    color: "bg-purple-100 text-purple-700"
  },
  onboarding: {
    name: "👨‍💼 Onboarding",
    description: "Carrier & employee onboarding, documentation",
    color: "bg-orange-100 text-orange-700"
  }
};

export function TemplatesListV2({ templates = mockTemplates, onCreateTemplate, onEditTemplate }: TemplatesListV2Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategoryType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "disabled">("all");
  const [viewMode, setViewMode] = useState<"grid" | "category">("category");

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || template.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const templatesByCategory = Object.entries(categoryConfig).map(([key, config]) => ({
    category: key as TemplateCategoryType,
    ...config,
    templates: filteredTemplates.filter(t => t.category === key)
  })).filter(group => group.templates.length > 0);

  const handleDuplicate = (template: EmailTemplate) => {
    console.log("Duplicate template:", template.id);
  };

  const handleDelete = (template: EmailTemplate) => {
    console.log("Delete template:", template.id);
  };

  const handlePreview = (template: EmailTemplate) => {
    console.log("Preview template:", template.id);
  };

  const handleTest = (template: EmailTemplate) => {
    console.log("Test template:", template.id);
  };

  const handleToggleStatus = (template: EmailTemplate) => {
    console.log("Toggle status for template:", template.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Templates</h1>
          <p className="text-muted-foreground mt-1">
            Manage and customize your automated email communications
          </p>
        </div>
        <Button onClick={onCreateTemplate} className="bg-gradient-primary hover:bg-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Filters and Controls */}
      <Card className="bg-card/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search templates by name, subject, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as any)}>
                <SelectTrigger className="w-48">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="operational">🚛 Operational</SelectItem>
                  <SelectItem value="financial">💰 Financial</SelectItem>
                  <SelectItem value="marketplace">🏪 Marketplace</SelectItem>
                  <SelectItem value="onboarding">👨‍💼 Onboarding</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "category" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("category")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Content */}
      <Tabs value={viewMode} className="space-y-6">
        <TabsContent value="grid" className="space-y-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-full bg-muted p-6 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || categoryFilter !== "all" || statusFilter !== "all" 
                  ? "Try adjusting your filters" 
                  : "Get started by creating your first email template"
                }
              </p>
              {!searchQuery && categoryFilter === "all" && statusFilter === "all" && (
                <Button onClick={onCreateTemplate} className="bg-gradient-primary hover:bg-primary-hover">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Template
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCardV2
                  key={template.id}
                  template={template}
                  onEdit={onEditTemplate}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                  onTest={handleTest}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="category" className="space-y-8">
          {templatesByCategory.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-full bg-muted p-6 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            templatesByCategory.map((group) => (
              <Card key={group.category} className="overflow-hidden">
                <CardHeader className="bg-gradient-subtle">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={group.color}>
                        {group.name}
                      </Badge>
                      <div>
                        <CardTitle className="text-lg">{group.name} Templates</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      {group.templates.length} template{group.templates.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.templates.map((template) => (
                      <TemplateCardV2
                        key={template.id}
                        template={template}
                        onEdit={onEditTemplate}
                        onDuplicate={handleDuplicate}
                        onDelete={handleDelete}
                        onPreview={handlePreview}
                        onTest={handleTest}
                        onToggleStatus={handleToggleStatus}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}