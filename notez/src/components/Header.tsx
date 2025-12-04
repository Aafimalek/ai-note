import { shadow } from "@/styles/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import { SidebarTrigger } from "./ui/sidebar";
import { UserButton } from "@clerk/nextjs";

import logo from "@/assets/logo.png";

function Header() {
  return (
    <header
      className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
    >
      <SidebarTrigger className="absolute left-1 top-1" />

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

      <div className="flex items-center gap-4">
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
