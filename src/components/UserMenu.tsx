import { useNavigate } from "react-router";

import { useAuth } from "../auth/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  LogOut,
  Settings,
} from "lucide-react";

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName =
    user?.displayedName?.trim() ||
    user?.email ||
    "Utilizator";

  const initial = displayName.charAt(0).toUpperCase();

  async function handleLogout(): Promise<void> {
    await logout();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="
          flex cursor-pointer items-center gap-2
          rounded-lg px-2 py-1.5
          text-sm
          outline-none
          transition-colors
          hover:bg-accent
          focus-visible:ring-2
          focus-visible:ring-ring
        "
      >
        <span
          className="
            flex size-8 shrink-0 items-center justify-center
            rounded-full
            bg-primary
            text-sm font-semibold
            text-primary-foreground
          "
        >
          {initial}
        </span>

        <span className="max-w-40 truncate">
          {displayName}
        </span>

        <span className="text-xs text-muted-foreground">
          ▾
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex items-center gap-3 py-1">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {initial}
              </div>

              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">
                  {displayName}
                </span>

                <span className="truncate text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem disabled>
            <Settings />
            Setări
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => void handleLogout()}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut />
            Deconectare
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}