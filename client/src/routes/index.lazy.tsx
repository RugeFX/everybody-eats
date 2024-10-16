import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { authClient } from "../lib/auth";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api";
import { useAuthStore } from "../lib/store";

export const Route = createLazyFileRoute("/")({
        component: Index,
});

function Index() {
        const { setToken } = useAuthStore();

        const { data, refetch } = useQuery({
                queryKey: ["test"],
                queryFn: async () => {
                        const { data } = await apiClient.get("/auth-info");
                        return data as { userId: string };
                },
                enabled: false,
        });

        const handleRegister = async () => {
                const data = await authClient.signUp.email({
                        email: "zacky@rugefx.com",
                        password: "ahmadzacky123",
                        name: "RugeFX",
                });

                if (data.error) {
                        console.error(data.error);
                        return
                }

                setToken(data.data.session.id);
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
                        <button className="p-2 border-2 border-black" type="button" onClick={handleRegister}>
                                Register
                        </button>
                        <button className="p-2 border-2 border-black" type="button" onClick={handleLogin}>
                                Login
                        </button>
                        <button className="p-2 border-2 border-black" type="button" onClick={handleLogout}>
                                Logout
                        </button>
                        <button className="p-2 border-2 border-black" onClick={() => refetch()}>
                                Fetch userinfo
                        </button>
                        <Link to="/authed">Auth</Link>
                        {data !== undefined && <pre>{JSON.stringify(data, null, 2)}</pre>}
                </main>
        );
}
