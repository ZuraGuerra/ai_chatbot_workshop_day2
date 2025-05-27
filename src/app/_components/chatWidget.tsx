"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { nanoid } from "nanoid";

interface ChatWidgetProps {
  token: string;
  domain: string;
}

interface ChatMessage {
  id: number;
  content: string;
  threadId: string;
  userEmail: string;
  senderType: string;
  createdAt: Date;
}

export default function ChatWidget({ token, domain }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [hasEmail, setHasEmail] = useState(false);
  const [threadId, setThreadId] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: widgetCredentialsVerification } =
    api.widgetAuth.verifyWidgetCredentials.useQuery({
      token,
      allowedDomain: domain,
    });

  const sendChatMessage = api.chatbot.sendChatMessage.useMutation();

  const sendWelcomeMessage = api.chatbot.sendWelcomeMessage.useMutation();

  const { data: updatedThreadMessages, refetch: refetchThreadMessages } =
    api.chatbot.getThreadMessages.useQuery({
      threadId: threadId,
      userEmail: userEmail,
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (updatedThreadMessages) {
      setChatMessages(updatedThreadMessages);
    }
  }, [updatedThreadMessages]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !widgetCredentialsVerification?.isValid) return;

    setIsLoading(true);
    try {
      const newThreadId = nanoid();
      setThreadId(newThreadId);

      await sendWelcomeMessage.mutateAsync({
        threadId: newThreadId,
        userEmail: userEmail,
        userName: userName,
      });

      await refetchThreadMessages();

      setHasEmail(true);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
    setIsLoading(false);
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !threadId) return;

    setIsLoading(true);

    try {
      await sendChatMessage.mutateAsync({
        threadId,
        content: newChatMessage.trim(),
        userEmail: userEmail,
      });

      setNewChatMessage("");

      await refetchThreadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setIsLoading(false);
  };

  if (!widgetCredentialsVerification?.isValid) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-blue-500 p-4 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-blue-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="flex h-96 w-80 flex-col rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between rounded-t-lg bg-blue-500 p-4 text-white">
            <h3 className="font-semibold">Chat de Soporte</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {!hasEmail && (
            <div className="flex flex-1 flex-col justify-center p-4">
              <h4 className="mb-4 text-lg font-medium">¡Hola! 👋</h4>
              <p className="mb-4 text-gray-600">
                Para comenzar, necesitamos tus datos:
              </p>
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Tu nombre"
                  className="mb-4 w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="mb-4 w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? "Iniciando..." : "Comenzar Chat"}
                </button>
              </form>
            </div>
          )}

          {hasEmail && threadId && (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-2 ${message.senderType == "USER" ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`inline-block max-w-[70%] rounded-lg p-2 break-words ${
                        message.senderType == "USER"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendChatMessage} className="border-t p-4">
                <div className="flex space-x-2">
                  <textarea
                    ref={(textArea) => {
                      if (textArea && !newChatMessage) {
                        textArea.focus();
                      }
                    }}
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    onKeyDown={async (
                      e: React.KeyboardEvent<HTMLTextAreaElement>,
                    ) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (newChatMessage.trim() && !isLoading) {
                          await handleSendChatMessage(
                            e as unknown as React.FormEvent,
                          );
                        }
                      }
                    }}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    disabled={isLoading}
                    rows={2}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !newChatMessage.trim()}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isLoading ? "..." : "Enviar"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
