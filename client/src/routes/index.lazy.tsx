import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "../lib/auth";
import { useAuthStore } from "../lib/store";
import { apiClient } from "../api";
import Signup from "../components/auth/sign-up";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { setToken } = useAuthStore();

  const { data, refetch } = useQuery({
    queryKey: ["info"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ userId: string }>("/auth-info");
      return data;
    },
    enabled: false,
  });

  const handleRegister = async (data: { email: string; name: string; password: string }) => {
    const result = await authClient.signUp.email(data);

    if (result.error) {
      console.error(result.error);
      return;
    }

    setToken(result.data.session.id);
  };

  const handleLogin = async () => {
    const data = await authClient.signIn.email({
      email: "zacky@rugefx.com",
      password: "ahmadzacky123",
    });

    if (data.error) {
      console.error(data.error);
      return;
    }

    setToken(data.data.session.id);
  };

  const handleLogout = async () => {
    await authClient.signOut();

    setToken(null);
  };

  return (
    <main>
      <h1>Register here</h1>
      <Signup onSignup={handleRegister} />
      <button className="p-2 border-2 border-black" type="button" onClick={handleLogin}>
        Login
      </button>
      <button className="p-2 border-2 border-black" type="button" onClick={handleLogout}>
        Logout
      </button>
      <button
        className="p-2 border-2 border-black"
        onClick={() => {
          console.log("refetching...");
          refetch();
        }}
      >
        Fetch userinfo
      </button>
      <Link to="/authed">Auth</Link>
      {data !== undefined && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </main>
  );
}
