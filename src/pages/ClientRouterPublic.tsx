import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ClientPublicRouter() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStep = async () => {
            const res = await fetch(`http://localhost:3000/api/clients/public/${token}`);
            const data = await res.json();

            if (!res.ok) {
                navigate("/404");
                return;
            }

            const step = data.client.step;

            if (step === 2) navigate(`/client-link/${token}/select`);
            else if (step === 3) navigate(`/client-link/${token}/payment`);
            else navigate(`/client-link/${token}/select`); // fallback
        };

        fetchStep();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
            Redirection...
        </div>
    );
}
