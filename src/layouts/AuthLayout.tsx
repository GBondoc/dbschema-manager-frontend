import type { PropsWithChildren } from "react";

type AuthLayoutProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

export function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10 text-foreground">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-black/20">
        <header className="mb-8 flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">
            DB
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">
              {title}
            </h1>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </header>

        {children}
      </section>
    </main>
  );
}