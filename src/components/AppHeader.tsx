import { UserMenu } from "./UserMenu";

export function AppHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">
            DB
          </div>

          <div className="flex flex-col">
            <strong className="text-sm font-semibold leading-tight">
              DB Schema Manager
            </strong>

            <span className="text-xs text-muted-foreground">
              Mediu de învățare MySQL
            </span>
          </div>
        </div>

        <UserMenu />
      </div>
    </header>
  );
}