import { useAuthStore } from "../lib/store";

export default function AuthStatus() {
  const { token } = useAuthStore();

  return (
    <div className="text-xl">
      <h3>
        Auth Status:{" "}
        <span className="font-bold">{token === null ? "Logged out" : "Logged in"}</span>
      </h3>
    </div>
  );
}
