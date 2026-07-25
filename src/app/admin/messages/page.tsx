"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Mail, MailOpen, Trash2 } from "lucide-react";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { rows } = await adminApi.list<ContactMessage>("contact_messages", {
        orderBy: [{ col: "created_at", dir: "desc" }],
        limit: 500,
      });
      setMessages(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load messages");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function open(m: ContactMessage) {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.read) {
      try {
        await adminApi.update("contact_messages", m.id, { read: true });
        setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
      } catch {
        // non-critical
      }
    }
  }

  async function remove(m: ContactMessage) {
    if (!confirm(`Delete message from ${m.name}?`)) return;
    try {
      await adminApi.remove("contact_messages", m.id);
      setMessages((prev) => prev.filter((x) => x.id !== m.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Contact-form submissions — {messages.length} total{unread > 0 ? `, ${unread} unread` : ""}.
          Notifications also go to your email.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-md px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        {messages.length === 0 && (
          <p className="p-6 text-sm text-gray-500">No messages yet.</p>
        )}
        {messages.map((m) => (
          <div key={m.id}>
            <button
              onClick={() => open(m)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
            >
              {m.read ? (
                <MailOpen size={16} className="text-gray-300 shrink-0" />
              ) : (
                <Mail size={16} className="text-teal-700 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className={`text-sm truncate ${m.read ? "text-gray-700" : "font-semibold text-gray-900"}`}>
                  {m.name} <span className="text-gray-400 font-normal">· {m.email}</span>
                </p>
                <p className="text-xs text-gray-500 truncate">{m.message}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {new Date(m.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            </button>
            {openId === m.id && (
              <div className="px-11 pb-4">
                <p className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 rounded-md p-4 mb-3">
                  {m.message}
                </p>
                <div className="flex gap-3">
                  <a
                    href={`mailto:${m.email}?subject=Re: your message to Ilm Library`}
                    className="text-sm font-medium text-teal-700 hover:text-teal-900"
                  >
                    Reply by email →
                  </a>
                  <button
                    onClick={() => remove(m)}
                    className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-rose-600"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
