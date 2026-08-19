import { useState, type FormEvent } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";

import { useAuth } from "../auth/AuthContext";
import { AuthLayout } from "../layouts/AuthLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as {
    from?: string;
  } | null;

  const redirectTo =
    locationState?.from ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      navigate(redirectTo, {
        replace: true,
      });
    } catch {
      setError("Emailul sau parola sunt incorecte.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Bine ai revenit"
      description="Autentifică-te pentru a continua lucrul la proiectele tale."
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-email"
            className="text-sm font-medium"
          >
            Email
          </label>

          <Input
            id="login-email"
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
            htmlFor="login-password"
            className="text-sm font-medium"
          >
            Parolă
          </label>

          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Introdu parola"
            autoComplete="current-password"
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
            ? "Se autentifică..."
            : "Autentificare"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Nu ai cont?{" "}
        <Link
          to="/register"
          state={{
            from: redirectTo,
          }}
          className="font-medium text-primary hover:underline"
        >
          Creează un cont
        </Link>
      </p>
    </AuthLayout>
  );
}