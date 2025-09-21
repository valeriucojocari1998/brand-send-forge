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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { VariableTooltip } from "@/components/ui/variable-tooltip";
import { ArrowLeft, Save, Send, Eye, Copy, Settings, Plus, X, Paperclip, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateEditorProps {
  templateId?: string;
  onBack: () => void;
  onSave: (template: any) => void;
}

const variableCategories = {
  load: ["LoadID", "LoadWeight", "PickupLocation", "DeliveryLocation", "PickupDate", "DeliveryDate", "SpecialInstructions", "LoadStatus", "PreviousStatus", "OrderNumber", "PONumber", "TotalBillable", "CarrierTotalPayable", "SalesManager", "AccountManager", "CustomerServiceRep", "Dispatcher"],
  statuses: ["Dispatched", "Cancelled", "Released", "InTransit", "Delivered", "Invoiced", "Completed"],
  carrier: ["CarrierName", "CarrierEmail", "CarrierMC", "DriverName", "DriverEmails"],
  customer: ["Customer/Broker3PL"],
  financial: ["InvoiceId", "PaymentTerms", "InvoiceDueDate"]
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
    emailBody: `<p>Dear {{CarrierName}},</p>

<p>Load <strong>{{LoadID}}</strong> has been released and is ready for pickup.</p>

<h3>Load Details</h3>
<ul>
<li><strong>Pickup:</strong> {{PickupLocation}} on {{PickupDate}}</li>
<li><strong>Delivery:</strong> {{DeliveryLocation}} on {{DeliveryDate}}</li>
<li><strong>Weight:</strong> {{LoadWeight}} lbs</li>
</ul>

<p>Please confirm receipt and provide your ETA for pickup.</p>

<p>Questions? Contact us or reply to this email.</p>

<p>Best regards,<br>
Dispatch Team</p>`,
    attachedDocuments: [],
    variables: ["LoadID", "CarrierName", "PickupLocation", "DeliveryLocation", "PickupDate", "DeliveryDate", "LoadWeight", "SpecialInstructions"]
  });

  const [activeTab, setActiveTab] = useState("content");
  const [newCcEmail, setNewCcEmail] = useState("");
  const [newBccEmail, setNewBccEmail] = useState("");
  const [showPreview, setShowPreview] = useState(false);

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

  const insertVariable = (variable: string, targetField: 'subject' | 'emailBody') => {
    const variableTag = `{{${variable}}}`;
    setTemplate(prev => ({
      ...prev,
      [targetField]: prev[targetField] + variableTag
    }));
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
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
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={template.description}
                      onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="emailBody">Email Body</Label>
                    <RichTextEditor
                      content={template.emailBody}
                      onChange={(content) => setTemplate(prev => ({ ...prev, emailBody: content }))}
                      placeholder="Enter your email content..."
                    />
                  </div>

                  <div>
                    <Label>Attached Documents</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Paperclip className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Drag and drop documents or click to browse</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Add Documents
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="routing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Routing Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fromAddress">From Address</Label>
                      <Input
                        id="fromAddress"
                        value={template.fromAddress}
                        onChange={(e) => setTemplate(prev => ({ ...prev, fromAddress: e.target.value }))}
                        placeholder="dispatch@company.com or {{CarrierEmail}}"
                      />
                    </div>
                    <div>
                      <Label htmlFor="replyTo">Reply-To Address</Label>
                      <Input
                        id="replyTo"
                        value={template.replyTo}
                        onChange={(e) => setTemplate(prev => ({ ...prev, replyTo: e.target.value }))}
                        placeholder="support@company.com or {{CarrierEmail}}"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>CC Recipients</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newCcEmail}
                        onChange={(e) => setNewCcEmail(e.target.value)}
                        placeholder="email@company.com or {{CarrierEmail}}, {{CustomerEmail}}"
                        onKeyPress={(e) => e.key === 'Enter' && addEmailAddress('cc', newCcEmail)}
                      />
                      <Button size="sm" onClick={() => addEmailAddress('cc', newCcEmail)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Supports both static emails and dynamic variables</p>
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
                        placeholder="email@company.com or {{AccountManagerEmail}}"
                        onKeyPress={(e) => e.key === 'Enter' && addEmailAddress('bcc', newBccEmail)}
                      />
                      <Button size="sm" onClick={() => addEmailAddress('bcc', newBccEmail)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Supports both static emails and dynamic variables</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="triggerType">Trigger Type</Label>
                      <Select defaultValue="load-status-change">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="load-status-change">Load Status Change</SelectItem>
                          <SelectItem value="driver-checkin">Driver Check-In</SelectItem>
                          <SelectItem value="driver-checkout">Driver Check-Out</SelectItem>
                          <SelectItem value="payment-processed">Payment Processed</SelectItem>
                          <SelectItem value="manual-trigger">Manual Trigger</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="triggerCondition">Trigger Condition</Label>
                      <Select defaultValue="released">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dispatched">Status = Dispatched</SelectItem>
                          <SelectItem value="cancelled">Status = Cancelled</SelectItem>
                          <SelectItem value="released">Status = Released</SelectItem>
                          <SelectItem value="in-transit">Status = In Transit</SelectItem>
                          <SelectItem value="delivered">Status = Delivered</SelectItem>
                          <SelectItem value="on-hold">Status = On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Current Trigger Configuration</h4>
                    <p className="text-sm text-muted-foreground">
                      This template will be automatically sent when <strong>Load Status changes to "Released"</strong> in the system.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">Load Status Change</Badge>
                      <Badge variant="outline">Status = Released</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium">Advanced Automation Rules</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Coming soon - Available only for Premium Plan subscribers
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Variables Sidebar + Preview */}
        <div className="space-y-6">
          {showPreview && (
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Email Preview
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowPreview(false)}
                  className="w-full"
                >
                  Hide Preview
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Subject:</strong> {template.subject}</div>
                  <div className="border rounded p-3 bg-muted/20" dangerouslySetInnerHTML={{ __html: template.emailBody }} />
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Available Variables</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {showPreview ? 'Hide' : 'Show'} Preview
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(variableCategories).map(([category, variables]) => (
                <div key={category}>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">{category}</h4>
                  <div className="space-y-1">
                    {variables.map((variable) => (
                      <VariableTooltip variable={variable}>
                        <button
                          key={variable}
                          onClick={() => insertVariable(variable, 'emailBody')}
                          className={cn(
                            "w-full text-left px-2 py-1 text-xs rounded hover:bg-accent hover:text-accent-foreground",
                            "transition-colors duration-200"
                          )}
                        >
                          {`{{${variable}}}`}
                        </button>
                      </VariableTooltip>
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