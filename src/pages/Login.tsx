// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockIcon, MailIcon } from "lucide-react";
import toast from "react-hot-toast";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Erreur de connexion");
            }

            // ✅ Stocke le token et user info
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            toast.success(`Bienvenue ${data.user.name} 👋`);
            navigate("/"); // redirection vers le dashboard
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
                    Connexion à Cartrust Admin
                </h2>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                            Adresse email
                        </label>
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700">
                            <MailIcon className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="email"
                                className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-200"
                                placeholder="ex: admin@cartrust.fr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                            Mot de passe
                        </label>
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700">
                            <LockIcon className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="password"
                                className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-200"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg font-medium text-white transition ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
                    © 2025 Cartrust – Tous droits réservés.
                </p>
            </div>
        </div>
    );
};

export default Login;
