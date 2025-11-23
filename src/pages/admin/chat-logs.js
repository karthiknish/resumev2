import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ChatLogs() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return null;
}
