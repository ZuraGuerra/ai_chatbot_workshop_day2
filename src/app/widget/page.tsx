"use client";

import { useSearchParams } from "next/navigation";
import ChatWidget from "../_components/chatWidget";

export default function WidgetPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const domain = searchParams.get("domain");

  if (!token || !domain) {
    return <div>Invalid configuration</div>;
  }

  return (
    <div className="h-screen">
      <ChatWidget token={token} domain={domain} />
    </div>
  );
}
