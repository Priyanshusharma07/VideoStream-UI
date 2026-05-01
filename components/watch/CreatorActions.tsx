"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export function CreatorActions({ creatorName }: { creatorName: string }) {
  const [subscribed, setSubscribed] = useState(false);
  const toast = useToast();

  const handleSubscribe = () => {
    setSubscribed(!subscribed);
    toast.push({
      variant: subscribed ? "info" : "success",
      title: subscribed ? "Unsubscribed" : "Subscribed",
      message: `You have ${subscribed ? "unsubscribed from" : "subscribed to"} ${creatorName}.`,
    });
  };

  const handleJoin = () => {
    toast.push({
      variant: "info",
      title: "Join Channel",
      message: "Membership features are coming soon!",
    });
  };

  return (
    <div className="space-y-3">
      <button 
        onClick={handleSubscribe}
        className={`w-full font-black py-3 rounded-2xl transition-all text-sm ${
          subscribed 
          ? "bg-white/10 text-white border border-white/10 hover:bg-white/20" 
          : "bg-white text-black hover:brightness-90"
        }`}
      >
        {subscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
      </button>
      <button 
        onClick={handleJoin}
        className="w-full bg-white/5 text-white font-bold py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-sm"
      >
        JOIN
      </button>
    </div>
  );
}
