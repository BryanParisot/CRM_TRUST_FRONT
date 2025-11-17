import React from "react";
import { CheckCircle2Icon } from "lucide-react";

interface NotificationPanelProps {
    notifications: any[];
    refresh: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
    notifications,
    refresh,
}) => {
    const markAsRead = async (id: number) => {
        await fetch(`http://localhost:3000/api/notifications/read/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        refresh();
    };

    return (
        <div className="absolute top-16 right-6 w-80 bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 p-4 z-50 animate-slide-left">

            <h3 className="text-lg font-semibold mb-3">Notifications</h3>

            {notifications.length === 0 && (
                <p className="text-sm text-gray-500">Aucune notification</p>
            )}

            <div className="space-y-3">
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-start"
                    >
                        <div>
                            <p className="text-sm font-medium">{n.message}</p>
                            <p className="text-xs text-gray-400">
                                {new Date(n.created_at).toLocaleString()}
                            </p>
                        </div>

                        {!n.is_read && (
                            <button onClick={() => markAsRead(n.id)}>
                                <CheckCircle2Icon className="w-5 h-5 text-blue-500" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default NotificationPanel;
