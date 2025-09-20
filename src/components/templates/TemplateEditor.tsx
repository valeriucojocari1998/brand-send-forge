import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Send, Eye, Copy, Settings, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateEditorProps {
  templateId?: string;
  onBack: () => void;
  onSave: (template: any) => void;
}

const variableCategories = {
  load: ["LoadID", "LoadWeight", "PickupLocation", "DeliveryLocation", "PickupDate", "DeliveryDate", "SpecialInstructions"],
  carrier: ["CarrierName", "DriverName", "CarrierEmail", "ContactPhone", "AuthorityNumber"],
  financial: ["InvoiceID", "Amount", "Rate", "DueDate", "PaymentTerms", "TransactionID"],
  company: ["CompanyName", "ContactPerson", "AccountManager", "BrokerName"],
  system: ["Timestamp", "SystemDate", "UserName", "LoadStatus"]
};

export function TemplateEditor({ templateId, onBack, onSave }: TemplateEditorProps) {
  const [template, setTemplate] = useState({
    name: "Load Released Notification",
    subject: "Load {{LoadID}} Released - Ready for Pickup from {{PickupLocation}}",
    category: "operational",
    description: "Automated notification when load is released and ready for carrier pickup",
    fromAddress: "dispatch@company.com",
    replyTo: "dispatch@company.com",
    ccAddresses: ["operations@company.com"],
    bccAddresses: [],
    priority: "normal",
    trackOpens: true,
    trackClicks: true,
    htmlBody: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Load Released</h1>
  </div>
  
  <div style="padding: 30px; background: #ffffff;">
    <p>Dear {{CarrierName}},</p>
    
    <p>Load <strong>{{LoadID}}</strong> has been released and is ready for pickup.</p>
    
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1e40af;">Load Details</h3>
      <p><strong>Pickup:</strong> {{PickupLocation}} on {{PickupDate}}</p>
      <p><strong>Delivery:</strong> {{DeliveryLocation}} on {{DeliveryDate}}</p>
      <p><strong>Weight:</strong> {{LoadWeight}} lbs</p>
      {{#if SpecialInstructions}}
      <p><strong>Special Instructions:</strong> {{SpecialInstructions}}</p>
      {{/if}}
    </div>
    
    <p>Please confirm receipt and provide your ETA for pickup.</p>
    
    <p>Questions? Contact us at {{ContactPhone}} or reply to this email.</p>
    
    <p>Best regards,<br>
    {{CompanyName}} Dispatch Team</p>
  </div>
</div>`,
    textBody: `Dear {{CarrierName}},

Load {{LoadID}} has been released and is ready for pickup.

LOAD DETAILS:
- Pickup: {{PickupLocation}} on {{PickupDate}}
- Delivery: {{DeliveryLocation}} on {{DeliveryDate}}
- Weight: {{LoadWeight}} lbs
{{#if SpecialInstructions}}
- Special Instructions: {{SpecialInstructions}}
{{/if}}

Please confirm receipt and provide your ETA for pickup.

Questions? Contact us at {{ContactPhone}} or reply to this email.

Best regards,
{{CompanyName}} Dispatch Team`,
    variables: ["LoadID", "CarrierName", "PickupLocation", "DeliveryLocation", "PickupDate", "DeliveryDate", "LoadWeight", "SpecialInstructions", "ContactPhone", "CompanyName"]
  });

  const [activeTab, setActiveTab] = useState("content");
  const [newCcEmail, setNewCcEmail] = useState("");
  const [newBccEmail, setNewBccEmail] = useState("");

  const addEmailAddress = (type: 'cc' | 'bcc', email: string) => {
    if (email && email.includes('@')) {
      setTemplate(prev => ({
        ...prev,
        [`${type}Addresses`]: [...prev[`${type}Addresses` as keyof typeof prev] as string[], email]
      }));
      if (type === 'cc') setNewCcEmail("");
      else setNewBccEmail("");
    }
  };

  const removeEmailAddress = (type: 'cc' | 'bcc', index: number) => {
    setTemplate(prev => ({
      ...prev,
      [`${type}Addresses`]: (prev[`${type}Addresses` as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const insertVariable = (variable: string, targetField: 'subject' | 'htmlBody' | 'textBody') => {
    const variableTag = `{{${variable}}}`;
    setTemplate(prev => ({
      ...prev,
      [targetField]: prev[targetField] + variableTag
    }));
  };

  const handlePreview = () => {
    console.log("Preview template with sample data");
  };

  const handleTest = () => {
    console.log("Send test email");
  };

  const handleSave = () => {
    onSave(template);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{templateId ? 'Edit' : 'Create'} Template</h2>
            <p className="text-muted-foreground">Configure email template content and settings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={handleTest}>
            <Send className="w-4 h-4 mr-2" />
            Send Test
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary hover:bg-primary-hover">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="routing">Email Routing</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Template Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Template Name</Label>
                      <Input
                        id="name"
                        value={template.name}
                        onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={template.category} onValueChange={(value) => setTemplate(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operational">🚛 Operational Workflows</SelectItem>
                          <SelectItem value="financial">💰 Financial & Settlements</SelectItem>
                          <SelectItem value="marketplace">🏪 Marketplace</SelectItem>
                          <SelectItem value="onboarding">👨‍💼 Onboarding</SelectItem>
                          <SelectItem value="notifications">📧 System Notifications</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={template.description}
                      onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Email Subject</Label>
                    <Input
                      id="subject"
                      value={template.subject}
                      onChange={(e) => setTemplate(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Enter email subject with {{variables}}"
                    />
                  </div>

                  <div>
                    <Label htmlFor="htmlBody">HTML Email Body</Label>
                    <Textarea
                      id="htmlBody"
                      value={template.htmlBody}
                      onChange={(e) => setTemplate(prev => ({ ...prev, htmlBody: e.target.value }))}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="textBody">Plain Text Version</Label>
                    <Textarea
                      id="textBody"
                      value={template.textBody}
                      onChange={(e) => setTemplate(prev => ({ ...prev, textBody: e.target.value }))}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={template.priority} onValueChange={(value) => setTemplate(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Tracking Options</h4>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="trackOpens">Track Email Opens</Label>
                      <Switch
                        id="trackOpens"
                        checked={template.trackOpens}
                        onCheckedChange={(checked) => setTemplate(prev => ({ ...prev, trackOpens: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="trackClicks">Track Link Clicks</Label>
                      <Switch
                        id="trackClicks"
                        checked={template.trackClicks}
                        onCheckedChange={(checked) => setTemplate(prev => ({ ...prev, trackClicks: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="routing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Routing Configuration</CardTitle>
                  <p className="text-sm text-muted-foreground">Configure sender and recipient settings</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fromAddress">From Address</Label>
                      <Input
                        id="fromAddress"
                        value={template.fromAddress}
                        onChange={(e) => setTemplate(prev => ({ ...prev, fromAddress: e.target.value }))}
                        placeholder="dispatch@company.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="replyTo">Reply-To Address</Label>
                      <Input
                        id="replyTo"
                        value={template.replyTo}
                        onChange={(e) => setTemplate(prev => ({ ...prev, replyTo: e.target.value }))}
                        placeholder="support@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>CC Recipients</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newCcEmail}
                        onChange={(e) => setNewCcEmail(e.target.value)}
                        placeholder="Add CC email address"
                        onKeyPress={(e) => e.key === 'Enter' && addEmailAddress('cc', newCcEmail)}
                      />
                      <Button size="sm" onClick={() => addEmailAddress('cc', newCcEmail)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.ccAddresses.map((email, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {email}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeEmailAddress('cc', index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>BCC Recipients</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newBccEmail}
                        onChange={(e) => setNewBccEmail(e.target.value)}
                        placeholder="Add BCC email address"
                        onKeyPress={(e) => e.key === 'Enter' && addEmailAddress('bcc', newBccEmail)}
                      />
                      <Button size="sm" onClick={() => addEmailAddress('bcc', newBccEmail)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.bccAddresses.map((email, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {email}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeEmailAddress('bcc', index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="automation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Automation Rules</CardTitle>
                  <p className="text-sm text-muted-foreground">Configure when and how this template is triggered</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Trigger Conditions</h4>
                    <p className="text-sm text-muted-foreground">
                      This template will be automatically sent when a load status changes to "Released" in the system.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Advanced Automation (Pro Feature)</h4>
                    <p className="text-sm text-muted-foreground">
                      Set up complex triggers, conditional logic, and multi-step automation workflows.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Configure Advanced Rules
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Variables Sidebar */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Available Variables</CardTitle>
              <p className="text-xs text-muted-foreground">Click to insert into template</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(variableCategories).map(([category, variables]) => (
                <div key={category}>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">{category}</h4>
                  <div className="space-y-1">
                    {variables.map((variable) => (
                      <button
                        key={variable}
                        onClick={() => insertVariable(variable, 'htmlBody')}
                        className={cn(
                          "w-full text-left px-2 py-1 text-xs rounded hover:bg-accent hover:text-accent-foreground",
                          "transition-colors duration-200"
                        )}
                      >
                        {`{{${variable}}}`}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}