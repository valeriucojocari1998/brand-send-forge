import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, Play, Pause, Edit, Trash2, Zap, DollarSign, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutomationRule {
  id: string;
  name: string;
  template: string;
  triggerType: string;
  condition: string;
  active: boolean;
  description: string;
}

const mockTemplates = [
  { id: "load-released", name: "Load Released Notification" },
  { id: "load-delivered", name: "Load Delivered Notification" },
  { id: "payment-reminder", name: "Payment Reminder" },
  { id: "carrier-onboarding", name: "Carrier Onboarding Packet" }
];

const triggerTypes = [
  { id: "status-change", label: "Status Change", icon: Zap, description: "When load status changes" },
  { id: "financial-event", label: "Financial Event", icon: DollarSign, description: "Invoice created, payment due" },
  { id: "other-events", label: "Other Events", icon: Settings, description: "Driver notifications, POD uploads" }
];

const statusChangeConditions = [
  "Cancelled",
  "TONU",
  "Released",
  "Invoiced"
];

const financialConditions = [
  "Invoice Generated",
  "Payment Overdue",
  "Customer Payment Received"
];

const otherEventsConditions = [
  "Driver Check-In Notification",
  "Driver Check-Out Notification",
  "POD Document Uploaded",
  "Pickup Delayed by > 6h",
  "Delivery Delayed by > 6h"
];

export function EmailAutomations() {
  const [automations, setAutomations] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "Load Delivered Auto-Notification",
      template: "load-delivered",
      triggerType: "status-change",
      condition: "InTransit → Delivered",
      active: true,
      description: "Automatically notify customer and carrier when load is delivered"
    },
    {
      id: "2", 
      name: "Payment Reminder",
      template: "payment-reminder",
      triggerType: "financial-event",
      condition: "Payment Overdue",
      active: true,
      description: "Send payment reminder when invoice is overdue"
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    template: "",
    triggerType: "",
    condition: ""
  });

  const getConditionsForTrigger = (triggerType: string) => {
    switch (triggerType) {
      case "status-change":
        return statusChangeConditions;
      case "financial-event":
        return financialConditions;
      case "other-events":
        return otherEventsConditions;
      default:
        return [];
    }
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(auto => 
      auto.id === id ? { ...auto, active: !auto.active } : auto
    ));
  };

  const createAutomation = () => {
    if (newRule.name && newRule.template && newRule.triggerType && newRule.condition) {
      const automation: AutomationRule = {
        id: Date.now().toString(),
        name: newRule.name,
        template: newRule.template,
        triggerType: newRule.triggerType,
        condition: newRule.condition,
        active: true,
        description: "New automation rule"
      };
      setAutomations(prev => [...prev, automation]);
      setNewRule({ name: "", template: "", triggerType: "", condition: "" });
      setIsCreating(false);
    }
  };

  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(auto => auto.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Automations</h2>
          <p className="text-muted-foreground">Configure when and how email templates are triggered</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-gradient-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* Create New Automation */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Automation Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input
                  id="ruleName"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Load Delivered Auto-Notification"
                />
              </div>
              <div>
                <Label htmlFor="template">Select Template</Label>
                <Select value={newRule.template} onValueChange={(value) => setNewRule(prev => ({ ...prev, template: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose template" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="triggerType">Trigger Type</Label>
                <Select value={newRule.triggerType} onValueChange={(value) => setNewRule(prev => ({ ...prev, triggerType: value, condition: "" }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map((trigger) => {
                      const Icon = trigger.icon;
                      return (
                        <SelectItem key={trigger.id} value={trigger.id}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{trigger.label}</div>
                              <div className="text-xs text-muted-foreground">{trigger.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="condition">Trigger Condition</Label>
                <Select 
                  value={newRule.condition} 
                  onValueChange={(value) => setNewRule(prev => ({ ...prev, condition: value }))}
                  disabled={!newRule.triggerType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {getConditionsForTrigger(newRule.triggerType).map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={createAutomation} className="bg-gradient-primary hover:bg-primary-hover">
                Create Rule
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Automations */}
      <div className="grid gap-4">
        {automations.map((automation) => {
          const triggerType = triggerTypes.find(t => t.id === automation.triggerType);
          const TriggerIcon = triggerType?.icon || Zap;
          
          return (
            <Card key={automation.id} className={cn(
              "transition-all duration-200",
              automation.active ? "border-success/50 bg-success-light/20" : "border-muted opacity-60"
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <TriggerIcon className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">{automation.name}</h3>
                      <Badge variant={automation.active ? "default" : "secondary"}>
                        {automation.active ? "Active" : "Paused"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{automation.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline">
                        Template: {mockTemplates.find(t => t.id === automation.template)?.name}
                      </Badge>
                      <Badge variant="outline">
                        Trigger: {triggerType?.label}
                      </Badge>
                      <Badge variant="outline">
                        Condition: {automation.condition}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={automation.active}
                      onCheckedChange={() => toggleAutomation(automation.id)}
                    />
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteAutomation(automation.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Assistant Panel (Future Feature) */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-accent-light rounded-lg mx-auto mb-3">
            <Zap className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold mb-2">AI Automation Assistant</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Coming soon - Describe your automation needs in plain English and let AI suggest the perfect rule configuration.
          </p>
          <Badge variant="outline">Phase 2 Feature</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
