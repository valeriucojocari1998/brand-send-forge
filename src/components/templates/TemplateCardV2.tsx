import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmailTemplate } from "@/types/templates";
import { Clock, FileText, MoreVertical, PlayCircle, Copy, Edit, Trash2, Eye, Power, PowerOff } from "lucide-react";
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

const statusConfig = {
  active: { 
    variant: "default" as const, 
    text: "Active",
    className: "bg-success text-success-foreground"
  },
  draft: { 
    variant: "secondary" as const, 
    text: "Draft",
    className: "bg-warning text-warning-foreground"
  },
  disabled: { 
    variant: "outline" as const, 
    text: "Disabled",
    className: "bg-muted text-muted-foreground"
  }
};

const categoryConfig = {
  operational: "bg-blue-100 text-blue-700 border-blue-200",
  financial: "bg-green-100 text-green-700 border-green-200",
  marketplace: "bg-purple-100 text-purple-700 border-purple-200",
  onboarding: "bg-orange-100 text-orange-700 border-orange-200"
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
  const categoryClass = categoryConfig[template.category];
  
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
    <Card className="group hover:shadow-lg transition-all duration-300 bg-card border-border hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{categoryIcon}</span>
              <Badge 
                variant="outline" 
                className={cn("text-xs font-medium border", categoryClass)}
              >
                {template.category}
              </Badge>
              <Badge 
                variant={statusInfo.variant}
                className={cn("text-xs", statusInfo.className)}
              >
                {statusInfo.text}
              </Badge>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground leading-tight mb-1">
                {template.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.subject.substring(0, 80)}
                {template.subject.length > 80 ? "..." : ""}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(template)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(template)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPreview(template)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTest(template)}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Test Send
              </DropdownMenuItem>
              {onToggleStatus && (
                <DropdownMenuItem onClick={() => onToggleStatus(template)}>
                  {template.status === "active" ? (
                    <>
                      <PowerOff className="h-4 w-4 mr-2" />
                      Set to Draft
                    </>
                  ) : (
                    <>
                      <Power className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(template)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="py-3">
        {template.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {template.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(template.lastModified)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="h-3 w-3" />
            <span>{variables.length} variables</span>
          </div>
        </div>
        
        {variables.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {variables.slice(0, 3).map((variable) => (
                <Badge 
                  key={variable} 
                  variant="outline" 
                  className="text-xs bg-muted/50 hover:bg-muted"
                >
                  {variable}
                </Badge>
              ))}
              {variables.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-muted/50"
                >
                  +{variables.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-3 border-t border-border">
        <div className="flex w-full space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => onPreview(template)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 text-xs bg-gradient-primary hover:bg-primary-hover"
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