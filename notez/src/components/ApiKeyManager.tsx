"use client";

import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { CheckCircle } from "lucide-react";

function ApiKeyManager() {
  const [apiKey, setApiKey] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySaved(true);
    }
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem("gemini_api_key", apiKey);
    setIsKeySaved(true);
  };

  const handleClearKey = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
    setIsKeySaved(false);
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <Label className="text-xs">Gemini API Key</Label>
        {isKeySaved && <CheckCircle className="size-4 text-green-500" />}
      </div>
      <Input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your API key"
        className="h-8"
      />
      <div className="flex gap-2">
        <Button onClick={handleSaveKey} className="w-full" size="sm">
          Save
        </Button>
        {isKeySaved && (
          <Button
            onClick={handleClearKey}
            variant="destructive"
            className="w-full"
            size="sm"
          >
            Clear
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Your API key is stored in your browser's local storage.
      </p>
    </div>
  );
}

export default ApiKeyManager;
