import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Code, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useCodeGenStore } from "@/stores/codeGenStore";
import { Separator } from "@/components/ui/separator";

export function CodeGenerator() {
  const { generateCode, generatedCode, codeStatus } = useCodeGenStore();
  const [copied, setCopied] = React.useState(false);

  const handleGenerateCode = () => {
    generateCode();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <TooltipProvider>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleGenerateCode}>
                <Code className="h-5 w-5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate code</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent className="sm:max-w-[900px] h-[80vh]">
          <DialogHeader className="space-y-3">
            <DialogTitle>Generated HTML/CSS Code</DialogTitle>
            <DialogDescription>
              This is the generated code for your layout. You can copy it and use it directly in your project.
            </DialogDescription>
            <Separator />
          </DialogHeader>

          <div className="flex-1 my-4 relative min-h-0">
            {codeStatus === 'generating' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground animate-pulse">Generating code...</div>
              </div>
            )}
            {codeStatus === 'error' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-destructive">Error generating code. Please try again.</div>
              </div>
            )}
            {codeStatus === 'success' && (
              <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
                <Textarea
                  value={generatedCode}
                  readOnly
                  className="font-mono text-sm border-0 resize-none h-full focus-visible:ring-0"
                />
              </ScrollArea>
            )}
          </div>

          <DialogFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {codeStatus === 'success' && 'Code generated successfully'}
            </div>
            {codeStatus === 'success' && (
              <Button
                onClick={copyToClipboard}
                className="min-w-[100px]"
                variant={copied ? "outline" : "default"}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
} 