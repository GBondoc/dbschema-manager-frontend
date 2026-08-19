import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Copy,
  Link2,
  Plus,
  RefreshCw,
  RotateCcw,
  Users,
} from "lucide-react";

import {
  createProjectInviteRequest,
  getProjectInvitesRequest,
  getProjectMembersRequest,
  removeProjectMemberRequest,
  revokeProjectInviteRequest,
  updateProjectMemberRoleRequest,
} from "../features/project-members/project-member-api";

import type {
  ProjectInvite,
  ProjectInviteRole,
  ProjectMember,
} from "../features/project-members/project-member.types";

import type { ProjectAccessRole } from "../features/projects/project.types";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ProjectMembersDialogProps = {
  projectId: string;
  accessRole: ProjectAccessRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProjectMembersDialog({
  projectId,
  accessRole,
  open,
  onOpenChange,
}: ProjectMembersDialogProps) {
  const isOwner = accessRole === "OWNER";

  const [members, setMembers] =
    useState<ProjectMember[]>([]);

  const [invites, setInvites] =
    useState<ProjectInvite[]>([]);

  const [inviteRole, setInviteRole] =
    useState<ProjectInviteRole>("EDITOR");

  const [expiresInMinutes, setExpiresInMinutes] =
    useState(30);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isCreating, setIsCreating] =
    useState(false);

  const [revokingInviteId, setRevokingInviteId] =
    useState<string | null>(null);

  const [copiedToken, setCopiedToken] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const [refreshCooldown, setRefreshCooldown] =
    useState(0);
  
  const [updatingMemberId, setUpdatingMemberId] =
    useState<string | null>(null);

  const [removingMemberId, setRemovingMemberId] =
    useState<string | null>(null);

  const [memberToRemove, setMemberToRemove] =
    useState<ProjectMember | null>(null);

  const [roleChangeToConfirm, setRoleChangeToConfirm] =
    useState<{
      member: ProjectMember;
      newRole: "EDITOR" | "VIEWER";
    } | null>(null);

  const [inviteToRevoke, setInviteToRevoke] =
    useState<ProjectInvite | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    void loadData();
  }, [open, projectId]);

  useEffect(() => {
    if (refreshCooldown <= 0) {
        return;
    }

    const timeout = window.setTimeout(() => {
        setRefreshCooldown((current) =>
        Math.max(0, current - 1),
        );
    }, 1000);

    return () => {
        window.clearTimeout(timeout);
    };
  }, [refreshCooldown]);

  async function loadData(): Promise<void> {
    setIsLoading(true);
    setError("");

    try {
      const memberData =
        await getProjectMembersRequest(projectId);

      setMembers(memberData);

      if (isOwner) {
        const inviteData =
          await getProjectInvitesRequest(projectId);

        setInvites(inviteData);
      } else {
        setInvites([]);
      }
    } catch {
      setError(
        "Nu s-au putut încărca membrii proiectului.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateInvite(): Promise<void> {
    setError("");
    setIsCreating(true);

    try {
      const invite =
        await createProjectInviteRequest(
          projectId,
          {
            role: inviteRole,
            expiresInMinutes,
          },
        );

      setInvites((current) => [
        invite,
        ...current,
      ]);
    } catch {
      setError(
        "Nu s-a putut genera invitația.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleRevokeInvite(
    inviteId: string,
  ): Promise<void> {
    setError("");
    setRevokingInviteId(inviteId);

    try {
      await revokeProjectInviteRequest(
        projectId,
        inviteId,
      );

      setInvites((current) =>
        current.filter(
          (invite) => invite.id !== inviteId,
        ),
      );
    } catch {
      setError(
        "Nu s-a putut revoca invitația.",
      );
    } finally {
      setRevokingInviteId(null);
    }
  }

  async function handleCopyInvite(
    invite: ProjectInvite,
  ): Promise<void> {
    const inviteUrl =
      `${window.location.origin}/invite/${invite.token}`;

    await navigator.clipboard.writeText(
      inviteUrl,
    );

    setCopiedToken(invite.token);

    window.setTimeout(() => {
      setCopiedToken(null);
    }, 1500);
  }

  function getRoleLabel(
    role: ProjectMember["role"],
  ): string {
    if (role === "OWNER") {
      return "Proprietar";
    }

    if (role === "EDITOR") {
      return "Editor";
    }

    return "Vizualizator";
  }

  function getInitial(
    member: ProjectMember,
  ): string {
    const name =
      member.displayedName?.trim() ||
      "Utilizator";

    return name.charAt(0).toUpperCase();
  }

  function formatExpiration(
    expiresAt: string,
  ): string {
    return new Date(expiresAt).toLocaleString(
      "ro-RO",
      {
        dateStyle: "short",
        timeStyle: "short",
      },
    );
  }

    async function handleRefresh(): Promise<void> {
    if (refreshCooldown > 0) {
        return;
    }

    setRefreshCooldown(5);
    setError("");

    try {
        const memberData =
        await getProjectMembersRequest(projectId);

        setMembers(memberData);
    } catch {
        setError(
        "Nu s-au putut reîmprospăta membrii proiectului.",
        );
    }
  }

  async function handleChangeRole(
    member: ProjectMember,
    role: "EDITOR" | "VIEWER",
  ): Promise<void> {
    if (!member.id) {
      return;
    }

    setError("");
    setUpdatingMemberId(member.id);

    try {
      await updateProjectMemberRoleRequest(
        projectId,
        member.id,
        role,
      );

      setMembers((current) =>
        current.map((currentMember) =>
          currentMember.id === member.id
            ? {
                ...currentMember,
                role,
              }
            : currentMember,
        ),
      );
    } catch {
      setError(
        "Nu s-a putut modifica rolul membrului.",
      );
    } finally {
      setUpdatingMemberId(null);
    }
  }

  async function handleRemoveMember(
    member: ProjectMember,
  ): Promise<void> {
    if (!member.id) {
      return;
    }

    setError("");
    setRemovingMemberId(member.id);

    try {
      await removeProjectMemberRequest(
        projectId,
        member.id,
      );

      setMembers((current) =>
        current.filter(
          (currentMember) =>
            currentMember.id !== member.id,
        ),
      );
    } catch {
      setError(
        "Nu s-a putut elimina membrul din proiect.",
      );
    } finally {
      setRemovingMemberId(null);
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto border-2 border-primary bg-card shadow-2xl sm:max-w-2xl">
          <DialogHeader className="gap-2">
            <DialogTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Membrii proiectului
            </DialogTitle>

            <DialogDescription>
              Vezi utilizatorii care au acces la acest
              proiect și rolurile lor.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {error}
            </div>
          )}

          {isLoading ? (
            <p className="py-6 text-sm text-muted-foreground">
              Se încarcă membrii...
            </p>
          ) : (
            <div className="flex flex-col gap-8">
              {/* MEMBERS */}
              <section className="rounded-xl border border-border bg-background/40 p-5">
                <div className="mb-3 flex items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold">
                          Membri
                      </h3>

                      <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={refreshCooldown > 0 || isLoading}
                          onClick={() => void handleRefresh()}
                          className="border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                          >
                          <RefreshCw
                              className={`size-4 ${
                              isLoading ? "animate-spin" : ""
                              }`}
                          />

                          {refreshCooldown > 0
                          ? `Așteaptă ${refreshCooldown}s`
                          : "Reîmprospătează"}
                      </Button>
                  </div>

                <div className="overflow-hidden rounded-lg bg-muted/30">
                  {members.map(
                    (member, index) => (
                      <div
                        key={member.userId}
                        className={`flex items-center justify-between gap-4 px-4 py-3 ${
                          index !==
                          members.length - 1
                            ? "border-b border-border"
                            : ""
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                            {getInitial(member)}
                          </div>

                          <span className="truncate text-sm font-medium">
                            {member.displayedName ||
                              "Utilizator"}
                          </span>
                        </div>

                        {member.role === "OWNER" || !isOwner ? (
                          <span
                            className={
                              member.role === "OWNER"
                                ? "rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                                : "rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground"
                            }
                          >
                            {getRoleLabel(member.role)}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              value={member.role}
                              disabled={
                                updatingMemberId === member.id ||
                                removingMemberId === member.id
                              }
                              onChange={(event) =>
                                setRoleChangeToConfirm({
                                  member,
                                  newRole: event.target.value as
                                    | "EDITOR"
                                    | "VIEWER",
                                })
                              }
                              className="h-8 rounded-md border border-input bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                            >
                              <option value="EDITOR">
                                Editor
                              </option>

                              <option value="VIEWER">
                                Vizualizator
                              </option>
                            </select>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={
                                updatingMemberId === member.id ||
                                removingMemberId === member.id
                              }
                              onClick={() =>
                                setMemberToRemove(member)
                              }
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              {removingMemberId === member.id
                                ? "Se elimină..."
                                : "Elimină"}
                            </Button>
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </section>

              {/* OWNER CONTROLS */}
              {isOwner && (
                <>
                  <section className="rounded-xl border border-border bg-background/40 p-5">
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold">
                        Generează o invitație
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Linkul poate fi folosit de mai
                        mulți utilizatori până când
                        expiră sau este revocat.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="invite-role"
                          className="text-sm font-medium"
                        >
                          Rol
                        </label>

                        <select
                          id="invite-role"
                          value={inviteRole}
                          onChange={(event) =>
                            setInviteRole(
                              event.target
                                .value as ProjectInviteRole,
                            )
                          }
                          className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="EDITOR">
                            Editor
                          </option>

                          <option value="VIEWER">
                            Vizualizator
                          </option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="invite-expiration"
                          className="text-sm font-medium"
                        >
                          Expiră în
                        </label>

                        <select
                          id="invite-expiration"
                          value={expiresInMinutes}
                          onChange={(event) =>
                            setExpiresInMinutes(
                              Number(
                                event.target
                                  .value,
                              ),
                            )
                          }
                          className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value={30}>
                            30 minute
                          </option>

                          <option value={60}>
                            1 oră
                          </option>

                          <option value={360}>
                            6 ore
                          </option>

                          <option value={720}>
                            12 ore
                          </option>

                          <option value={1440}>
                            24 ore
                          </option>
                        </select>
                      </div>
                    </div>

                    <Button
                      type="button"
                      className="mt-4"
                      onClick={() =>
                        void handleCreateInvite()
                      }
                      disabled={isCreating}
                    >
                      <Plus className="size-4" />

                      {isCreating
                        ? "Se generează..."
                        : "Generează invitație"}
                    </Button>
                  </section>

                  {/* ACTIVE INVITES */}
                  <section className="rounded-xl border border-border bg-background/40 p-5">
                    <h3 className="mb-3 text-sm font-semibold">
                      Invitații active
                    </h3>

                    {invites.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nu există invitații active.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {invites.map(
                          (invite) => (
                            <div
                              key={invite.id}
                              className="rounded-xl border border-border bg-card p-4"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Link2 className="size-4 text-muted-foreground" />

                                    <span className="text-sm font-medium">
                                      {invite.role ===
                                      "EDITOR"
                                        ? "Editor"
                                        : "Vizualizator"}
                                    </span>
                                  </div>

                                  <p className="mt-1 text-xs text-muted-foreground">
                                    Expiră:{" "}
                                    {formatExpiration(
                                      invite.expiresAt,
                                    )}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      void handleCopyInvite(
                                        invite,
                                      )
                                    }
                                  >
                                    {copiedToken ===
                                    invite.token ? (
                                      <>
                                        <Check className="size-4" />
                                        Copiat
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="size-4" />
                                        Copiază
                                      </>
                                    )}
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setInviteToRevoke(invite)
                                    }
                                    disabled={
                                      revokingInviteId ===
                                      invite.id
                                    }
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  >
                                    <RotateCcw className="size-4" />

                                    {revokingInviteId ===
                                    invite.id
                                      ? "Se revocă..."
                                      : "Revocă"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={roleChangeToConfirm !== null}
        onOpenChange={(alertOpen) => {
          if (!alertOpen) {
            setRoleChangeToConfirm(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Schimbă permisiunea?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Ești sigur că vrei să schimbi permisiunea lui{" "}
              <strong className="text-foreground">
                {roleChangeToConfirm?.member.displayedName ||
                  "acest utilizator"}
              </strong>{" "}
              în{" "}
              <strong className="text-foreground">
                {roleChangeToConfirm?.newRole === "EDITOR"
                  ? "Editor"
                  : "Vizualizator"}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Anulează
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (roleChangeToConfirm) {
                  void handleChangeRole(
                    roleChangeToConfirm.member,
                    roleChangeToConfirm.newRole,
                  );

                  setRoleChangeToConfirm(null);
                }
              }}
            >
              Confirmă
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={memberToRemove !== null}
        onOpenChange={(alertOpen) => {
          if (!alertOpen) {
            setMemberToRemove(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Elimină membrul?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Ești sigur că vrei să îl elimini pe{" "}
              <strong className="text-foreground">
                {memberToRemove?.displayedName ||
                  "acest utilizator"}
              </strong>{" "}
              din proiect?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Anulează
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (memberToRemove) {
                  void handleRemoveMember(
                    memberToRemove,
                  );

                  setMemberToRemove(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Elimină
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={inviteToRevoke !== null}
        onOpenChange={(alertOpen) => {
          if (!alertOpen) {
            setInviteToRevoke(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Revocă invitația?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Ești sigur că vrei să revoci această invitație cu rolul{" "}
              <strong className="text-foreground">
                {inviteToRevoke?.role === "EDITOR"
                  ? "Editor"
                  : "Vizualizator"}
              </strong>
              ? Linkul va deveni invalid și va trebui să generezi o nouă invitație pentru a oferi acces altor utilizatori.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Anulează
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (inviteToRevoke) {
                  void handleRevokeInvite(
                    inviteToRevoke.id,
                  );

                  setInviteToRevoke(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revocă
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}