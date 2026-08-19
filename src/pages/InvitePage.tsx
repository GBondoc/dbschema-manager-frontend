import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router";

import {
  acceptProjectInviteRequest,
  getProjectInviteRequest,
  type ProjectInvitePreview,
} from "../features/project-members/project-member-api";

import { Button } from "@/components/ui/button";

export function InvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [invite, setInvite] =
    useState<ProjectInvitePreview | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isAccepting, setIsAccepting] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadInvite(): Promise<void> {
      if (!token) {
        setError("Invitație invalidă.");
        setIsLoading(false);
        return;
      }

      try {
        const data =
          await getProjectInviteRequest(token);

        setInvite(data);
      } catch {
        setError(
          "Invitația nu este validă, a expirat sau a fost revocată.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadInvite();
  }, [token]);

  async function handleAccept(): Promise<void> {
    if (!token) {
      return;
    }

    setError("");
    setIsAccepting(true);

    try {
      await acceptProjectInviteRequest(token);

      navigate("/dashboard", {
        replace: true,
      });
    } catch {
      setError(
        "Nu s-a putut accepta invitația.",
      );
    } finally {
      setIsAccepting(false);
    }
  }

  function getRoleLabel(): string {
    if (invite?.role === "EDITOR") {
      return "Editor";
    }

    return "Vizualizator";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10 text-foreground">
      <section className="w-full max-w-md rounded-2xl border-2 border-primary bg-card p-8 shadow-2xl">
        <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">
          DB
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Se încarcă invitația...
          </p>
        )}

        {!isLoading && error && !invite && (
          <>
            <h1 className="text-2xl font-bold">
              Invitație indisponibilă
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {error}
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-6"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Înapoi la proiecte
            </Button>
          </>
        )}

        {!isLoading && invite && (
          <>
            <h1 className="text-2xl font-bold tracking-tight">
              Ai primit o invitație
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Ai fost invitat să colaborezi la proiectul:
            </p>

            <div className="mt-5 rounded-xl border border-border bg-background/40 p-4">
              <h2 className="text-lg font-semibold">
                {invite.projectName}
              </h2>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Rol
                </span>

                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {getRoleLabel()}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Expiră
                </span>

                <span className="text-sm">
                  {new Date(
                    invite.expiresAt,
                  ).toLocaleString("ro-RO", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>

            {error && (
              <div
                className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isAccepting}
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Refuză
              </Button>

              <Button
                type="button"
                disabled={isAccepting}
                onClick={() =>
                  void handleAccept()
                }
              >
                {isAccepting
                  ? "Se acceptă..."
                  : "Acceptă invitația"}
              </Button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}