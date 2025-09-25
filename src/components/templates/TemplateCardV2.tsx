import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmailTemplate } from "@/types/templates";
import { Clock, MoreVertical, PlayCircle, Copy, Edit, Trash2, Eye, Power, PowerOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateCardV2Props {
  template: EmailTemplate;
  onEdit: (template: EmailTemplate) => void;
  onDuplicate: (template: EmailTemplate) => void;
  onDelete: (template: EmailTemplate) => void;
  onPreview: (template: EmailTemplate) => void;
  onTest: (template: EmailTemplate) => void;
  onToggleStatus?: (template: EmailTemplate) => void;
}

const categoryIcons = {
  operational: "🚛",
  financial: "💰", 
  marketplace: "🏪",
  onboarding: "👨‍💼"
};

const categoryConfig = {
  operational: { 
    variant: "operational" as const, 
    className: "bg-primary/10 text-primary border-primary/20"
  },
  financial: { 
    variant: "financial" as const, 
    className: "bg-success/10 text-success border-success/20"
  },
  marketplace: { 
    variant: "marketplace" as const, 
    className: "bg-accent/10 text-accent border-accent/20"
  },
  onboarding: { 
    variant: "onboarding" as const, 
    className: "bg-warning/10 text-warning border-warning/20"
  }
};

const statusConfig = {
  active: { 
    className: "bg-success text-success-foreground",
    text: "Active"
  },
  draft: { 
    className: "bg-warning text-warning-foreground",
    text: "Draft"
  },
  disabled: { 
    className: "bg-muted text-muted-foreground",
    text: "Disabled"
  }
};

export function TemplateCardV2({ 
  template, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onPreview, 
  onTest, 
  onToggleStatus 
}: TemplateCardV2Props) {
  const categoryIcon = categoryIcons[template.category];
  const statusInfo = statusConfig[template.status];
  const categoryInfo = categoryConfig[template.category];
  
  // Extract variables from subject and body
  const extractVariables = (text: string) => {
    const matches = text.match(/\{\{[^}]+\}\}/g) || [];
    return [...new Set(matches)];
  };
  
  const variables = [
    ...extractVariables(template.subject),
    ...extractVariables(template.body)
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-card border-border hover:shadow-card transition-smooth">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">{categoryIcon}</span>
            <Badge 
              variant="outline" 
              className={cn("text-xs font-medium", categoryInfo.className)}
            >
              {template.category}
            </Badge>
            <Badge 
              className={cn("text-xs font-medium", statusInfo.className)}
            >
              {statusInfo.text}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(template)} className="text-sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(template)} className="text-sm">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPreview(template)} className="text-sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTest(template)} className="text-sm">
                <PlayCircle className="h-4 w-4 mr-2" />
                Test Send
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(template)}
                className="text-sm text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div>
          <h3 className="font-semibold text-foreground text-base leading-tight mb-2">
            {template.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {template.description || template.subject}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(template.lastModified)}</span>
          </div>
          {variables.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">
                {variables.slice(0, 2).join(", ")}
              </span>
              {variables.length > 2 && (
                <span className="text-muted-foreground">
                  +{variables.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <div className="flex w-full gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 text-xs font-medium"
            onClick={() => onPreview(template)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button 
            size="sm" 
            className="flex-1 h-8 text-xs font-medium bg-primary hover:bg-primary-hover text-primary-foreground"
            onClick={() => onEdit(template)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}