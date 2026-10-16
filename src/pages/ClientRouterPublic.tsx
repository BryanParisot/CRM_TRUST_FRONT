import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientPortalPath } from '../utils/clientPortal';

export default function ClientPublicRouter() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    const load = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/clients/public/${token}`, { signal: controller.signal, cache: 'no-store' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Impossible de charger votre dossier.');
        if (!controller.signal.aborted) navigate(clientPortalPath(token!, data.client.step), { replace: true });
      } catch (error) {
        if (!controller.signal.aborted) setError((error as Error).message);
      }
    };
    load();
    return () => controller.abort();
  }, [token, navigate, attempt]);
  return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center text-sm text-gray-500">
    {error ? <div><p role="alert" className="text-red-600">{error}</p><button onClick={() => setAttempt(value => value + 1)} className="mt-4 font-medium text-blue-600">Réessayer</button></div> : <p>Chargement de votre dossier…</p>}
  </main>;
}
