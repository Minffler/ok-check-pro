import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const UserHeader = () => {
  const { user, signOut } = useAuth();
  if (!user) return null;

  const name = user.user_metadata?.full_name || user.email || "사용자";
  const avatar = user.user_metadata?.avatar_url;

  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-2.5">
      <div className="flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt={name} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
            {name.charAt(0)}
          </div>
        )}
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>
      <button
        onClick={signOut}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <LogOut className="h-3.5 w-3.5" />
        로그아웃
      </button>
    </div>
  );
};

export default UserHeader;
