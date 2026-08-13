import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../auth/AuthContext";
import { AuthLayout } from "../layouts/AuthLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [displayedName, setDisplayedName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Parolele nu coincid.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        displayedName: displayedName.trim() || undefined,
        email: email.trim(),
        password,
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch {
      setError("Nu s-a putut crea contul.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Creează un cont"
      description="Creează proiecte și învață să construiești scheme MySQL."
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="register-name"
            className="text-sm font-medium"
          >
            Nume afișat
          </label>

          <Input
            id="register-name"
            type="text"
            value={displayedName}
            onChange={(event) =>
              setDisplayedName(event.target.value)
            }
            placeholder="Numele tău"
            autoComplete="name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="register-email"
            className="text-sm font-medium"
          >
            Email
          </label>

          <Input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="nume@exemplu.ro"
            autoComplete="email"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="register-password"
            className="text-sm font-medium"
          >
            Parolă
          </label>

          <Input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Alege o parolă"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="register-confirm-password"
            className="text-sm font-medium"
          >
            Confirmă parola
          </label>

          <Input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            placeholder="Introdu parola din nou"
            autoComplete="new-password"
            required
          />
        </div>

        {error && (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Se creează contul..."
            : "Înregistrare"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ai deja cont?{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:underline"
        >
          Autentifică-te
        </Link>
      </p>
    </AuthLayout>
  );
}