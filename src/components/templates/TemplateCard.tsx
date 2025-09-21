import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Eye, TestTube, MoreVertical, Copy, Power, PowerOff, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    subject: string;
    category: string;
    description?: string;
    status: "active" | "draft" | "disabled";
    lastModified: string;
    variables: string[];
  };
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onTest: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  active: {
    color: "bg-success text-success-foreground",
    label: "Active"
  },
  draft: {
    color: "bg-warning text-warning-foreground",
    label: "Draft"
  },
  disabled: {
    color: "bg-muted text-muted-foreground",
    label: "Disabled"
  }
};

export function TemplateCard({ template, onEdit, onPreview, onTest, onDuplicate, onToggleStatus, onDelete }: TemplateCardProps) {
  const status = statusConfig[template.status];

  return (
    <Card className="group hover:shadow-md transition-smooth bg-gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate">{template.name}</h3>
            <Badge className={cn("text-xs", status.color)}>
              {status.label}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-smooth"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(template.id)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(template.id)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleStatus?.(template.id)}>
                {template.status === "active" ? (
                  <>
                    <PowerOff className="w-4 h-4 mr-2" />
                    Set to Draft
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(template.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Subject:</p>
          <p className="text-sm bg-muted/50 p-2 rounded border text-foreground">
            {template.subject}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {template.description && (
            <p className="text-xs text-muted-foreground">{template.description}</p>
          )}
          
          {template.variables.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Variables:</p>
              <div className="flex flex-wrap gap-1">
                {template.variables.slice(0, 3).map((variable) => (
                  <Badge key={variable} variant="outline" className="text-xs">
                    {variable}
                  </Badge>
                ))}
                {template.variables.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.variables.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              Modified {template.lastModified}
            </span>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPreview(template.id)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTest(template.id)}
                className="h-8 w-8 p-0"
              >
                <TestTube className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(template.id)}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(template.id)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}