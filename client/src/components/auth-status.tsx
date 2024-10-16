import { authClient } from "../lib/auth";

export default function AuthStatus() {
  const session = authClient.useSession();

  return (
    <div className="text-xl">
      <h3>
        Auth Status:{" "}
        <span className="font-bold">{session.data === null ? "Logged out" : "Logged in"}</span>
      </h3>
    </div>
  );
}
