"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import { useSidebar } from "./ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { PanelLeft } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

import logo from "@/assets/logo.png";

function Header() {
  const { state, toggleSidebar } = useSidebar();
  const { subscription, loading } = useSubscription();

  // Determine button text based on subscription
  const getButtonText = () => {
    if (loading) return "Upgrade";
    if (subscription.status === 'active') {
      if (subscription.plan === 'ai_basic') return "Basic";
      if (subscription.plan === 'ai_pro') return "Pro";
    }
    return "Upgrade";
  };

  return (
    <header
      className="bg-sidebar relative flex h-24 w-full items-center justify-between px-3 sm:px-8 border-b border-sidebar-border"
    >
      <div className="flex items-center gap-2">
        {state === "collapsed" && (
          <Button
            onClick={toggleSidebar}
            size="icon"
            variant="ghost"
            className="h-7 w-7"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
        <Link className="flex items-end gap-2" href="/">
          <Image
            src={logo}
            height={60}
            width={60}
            alt="logo"
            className="rounded-full"
            priority
          />

          <h1 className="flex flex-col pb-1 text-2xl font-semibold leading-6">
            AI <span>Notes</span>
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/pricing">
          <Button
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm font-medium"
          >
            {getButtonText()}
          </Button>
        </Link>
        <DarkModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-10 h-10"
            }
          }}
        />
      </div>
    </header>
  );
}

export default Header;
