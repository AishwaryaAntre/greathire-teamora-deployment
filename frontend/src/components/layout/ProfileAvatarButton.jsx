import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { employeeProfileApi } from "@/lib/api/employeeProfile";
import { useAuth } from "@/lib/AuthContext";

export default function ProfileAvatarButton({ name, size = "md" }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [avatar, setAvatar] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const displayName = name || user?.name || "Employee";

  useEffect(() => {
    let active = true;
    employeeProfileApi
      .getProfile()
      .then((profile) => {
        if (active) {
          setAvatar(profile.avatar || "");
          setImageFailed(false);
        }
      })
      .catch((error) => console.error("Failed to load profile photo:", error));

    return () => {
      active = false;
    };
  }, []);

  const sizeClass = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={() => navigate("/profile")}
      aria-label="Open profile"
      title="Profile"
      className={`${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xs font-semibold text-slate-700 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-700 dark:text-slate-100 dark:focus-visible:ring-offset-slate-900`}
    >
      {avatar && !imageFailed ? (
        <img
          src={avatar}
          alt={`${displayName}'s profile`}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        initials || "E"
      )}
    </button>
  );
}
