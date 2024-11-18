import { ping } from "@/lib/api/auth.api";

const SessionChecker = () => {
  ping().then((p) => {
    if (!p) location.href = "/login?redirect=" + location.pathname;
  });
};

export default SessionChecker;
