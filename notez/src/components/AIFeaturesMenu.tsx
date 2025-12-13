"use client";

import { useState } from "react";
import { Sparkles, Loader2, Lock } from "lucide-react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "./ui/dialog";
import { backendApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import Link from "next/link";

type AIFeaturesMenuProps = {
    getNoteContent: () => string;
    onUpdateContent: (newContent: string) => void;
    onAddTags: (tags: string[]) => void;
};

export default function AIFeaturesMenu({
    getNoteContent,
    onUpdateContent,
    onAddTags,
}: AIFeaturesMenuProps) {
    const { toast } = useToast();
    const { subscription, loading: subscriptionLoading } = useSubscription();
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<{
        title: string;
        description?: string;
        body: React.ReactNode;
        action?: () => void;
        actionLabel?: string;
    } | null>(null);

    const checkAIAccess = (): boolean => {
        // Always block if still loading
        if (subscriptionLoading) {
            toast({
                title: "Loading...",
                description: "Please wait while we check your subscription.",
            });
            return false;
        }

        // Debug logging
        console.log('AI Access Check:', {
            plan: subscription.plan,
            status: subscription.status,
            hasAIAccess: subscription.hasAIAccess,
            loading: subscriptionLoading,
        });

        // Block if no AI access
        if (!subscription.hasAIAccess) {
            setUpgradeDialogOpen(true);
            return false;
        }

        return true;
    };

    const handleAction = async (
        actionName: string,
        actionFn: () => Promise<any>
    ) => {
        setIsLoading(true);
        try {
            await actionFn();
        } catch (error: any) {
            toast({
                title: "AI Action Failed",
                description: error.message || "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSummary = () => {
        if (!checkAIAccess()) return;
        handleAction("Summary", async () => {
            const content = getNoteContent();
            if (!content) return;
            const { summary } = await backendApi.summary(content);
            setDialogContent({
                title: "AI Summary",
                body: <p className="whitespace-pre-wrap">{summary}</p>,
            });
            setDialogOpen(true);
        });
    };

    const handleGlossary = () => {
        if (!checkAIAccess()) return;
        handleAction("Glossary", async () => {
            const content = getNoteContent();
            if (!content) {
                toast({ title: "Note is empty." });
                return;
            }
            const glossary = await backendApi.glossary(content);

            if (!glossary || Object.keys(glossary).length === 0) {
                toast({ title: "No glossary terms found." });
                return;
            }

            // Create a temporary DOM element to parse the HTML
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = content;

            // Helper to escape regex special characters
            const escapeRegExp = (string: string) => {
                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            };

            // Prepare terms and regexes
            const terms = Object.keys(glossary).sort((a, b) => b.length - a.length); // Match longer terms first

            // Function to traverse and replace text nodes
            const walk = (node: Node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    let text = node.nodeValue || "";
                    let modified = false;

                    // We need to be careful not to double-replace in the same text node
                    // A simple approach is to replace all terms in the text node
                    // But we must ensure we don't replace inside the HTML we just generated
                    // Since we are operating on text nodes, we are safe from existing tags
                    // But we need to return a document fragment or HTML string to replace this node

                    // Actually, simpler: check if any term exists in this text node
                    // If so, replace the text node with a span containing the highlighted HTML

                    // Let's do a single pass replacement for all terms
                    // We need to handle overlapping terms, but for now let's assume non-overlapping or just take the first match
                    // The sort by length helps with sub-matches

                    // We can't easily use regex replace for multiple terms at once without a complex regex
                    // Let's construct a single regex for all terms
                    if (terms.length === 0) return;

                    const pattern = terms.map(escapeRegExp).join("|");
                    const regex = new RegExp(`\\b(${pattern})\\b`, "gi");

                    if (regex.test(text)) {
                        const fragment = document.createDocumentFragment();
                        let lastIndex = 0;

                        // Reset regex
                        regex.lastIndex = 0;
                        let match;

                        // We need to use exec to get matches and indices
                        // Note: "g" flag is needed for exec loop
                        // But we need to be careful with the loop

                        // Alternative: split by regex
                        const parts = text.split(regex);
                        // split with capturing group includes the separators
                        // e.g. "Hello world" split by /(world)/ -> ["Hello ", "world", ""]

                        // Wait, split behavior with capturing groups is:
                        // [pre-match, match, post-match...]

                        // Let's use a more manual approach with matchAll or exec
                        // But split is easier if it works consistently

                        // Let's try replacing the node with HTML
                        const newHtml = text.replace(regex, (match) => {
                            // Find the definition (case-insensitive lookup needed)
                            const originalTerm = terms.find(t => t.toLowerCase() === match.toLowerCase());
                            const definition = originalTerm ? glossary[originalTerm] : "";
                            return `<span class="glossary-term" title="${definition}">${match}</span>`;
                        });

                        const span = document.createElement("span");
                        span.innerHTML = newHtml;
                        node.parentNode?.replaceChild(span, node);
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // Skip existing glossary terms to avoid double highlighting
                    const element = node as Element;
                    if (element.classList.contains("glossary-term")) return;

                    // Recursively walk children
                    // We need to convert childNodes to array to avoid issues if we modify the DOM while iterating
                    Array.from(node.childNodes).forEach(walk);
                }
            };

            walk(tempDiv);

            onUpdateContent(tempDiv.innerHTML);
            toast({
                title: "Glossary Extracted",
                description: "Important terms have been highlighted.",
            });
        });
    };

    const handleTags = () => {
        if (!checkAIAccess()) return;
        handleAction("Tags", async () => {
            const content = getNoteContent();
            if (!content) return;
            const { tags } = await backendApi.suggestTags(content);
            onAddTags(tags);
            toast({
                title: "Tags Added",
                description: `Added tags: ${tags.join(", ")}`,
            });
        });
    };

    const handleGrammar = () => {
        if (!checkAIAccess()) return;
        handleAction("Grammar", async () => {
            const content = getNoteContent();
            if (!content) return;
            const { corrected_text } = await backendApi.checkGrammar(content);

            if (corrected_text.trim() === content.trim()) {
                toast({
                    title: "Grammar Check",
                    description: "No issues found!",
                });
                return;
            }

            setDialogContent({
                title: "Grammar Check",
                description: "Review the corrected text below.",
                body: (
                    <div className="max-h-[60vh] overflow-y-auto rounded-md border p-4 bg-muted/50">
                        <div
                            className="prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: corrected_text }}
                        />
                    </div>
                ),
                action: () => {
                    onUpdateContent(corrected_text);
                    setDialogOpen(false);
                },
                actionLabel: "Apply Correction",
            });
            setDialogOpen(true);
        });
    };

    const handleTranslate = () => {
        if (!checkAIAccess()) return;
        // Simple prompt for language for now
        const language = prompt("Enter target language (e.g., Spanish, French):");
        if (!language) return;

        handleAction("Translate", async () => {
            const content = getNoteContent();
            if (!content) return;
            const { translation } = await backendApi.translate(content, language);
            setDialogContent({
                title: `Translation (${language})`,
                body: (
                    <div className="max-h-[60vh] overflow-y-auto rounded-md border p-4 bg-muted/50">
                        <div
                            className="prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: translation }}
                        />
                    </div>
                ),
            });
            setDialogOpen(true);
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={isLoading || subscriptionLoading}
                        title="AI Features"
                        className={!subscription.hasAIAccess ? "opacity-50" : ""}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Sparkles className={subscription.hasAIAccess ? "text-yellow-500" : "text-muted-foreground"} />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                        onClick={handleSummary}
                        className={!subscription.hasAIAccess ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        AI Summary
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={handleGlossary}
                        className={!subscription.hasAIAccess ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        Extract Glossary
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={handleTags}
                        className={!subscription.hasAIAccess ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        Suggest Tags
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={handleGrammar}
                        className={!subscription.hasAIAccess ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        Check Grammar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={handleTranslate}
                        className={!subscription.hasAIAccess ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        Translate
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{dialogContent?.title}</DialogTitle>
                        {dialogContent?.description && (
                            <DialogDescription>{dialogContent.description}</DialogDescription>
                        )}
                    </DialogHeader>
                    {dialogContent?.body}
                    <DialogFooter>
                        {dialogContent?.action && (
                            <Button onClick={dialogContent.action}>
                                {dialogContent.actionLabel}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Upgrade Dialog */}
            <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Premium Feature
                        </DialogTitle>
                        <DialogDescription>
                            AI features are available with AI Basic or AI Pro subscription plans.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            Upgrade to unlock powerful AI features:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>AI Analysis & Summary</li>
                            <li>Grammar Check</li>
                            <li>Suggested Tags</li>
                            <li>Translation</li>
                            <li>Glossary Extraction</li>
                        </ul>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Link href="/pricing">
                            <Button onClick={() => setUpgradeDialogOpen(false)}>
                                View Plans
                            </Button>
                        </Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
