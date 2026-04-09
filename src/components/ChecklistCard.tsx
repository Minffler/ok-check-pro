import { CheckCircle2, Circle } from "lucide-react";
import type { CheckItem } from "@/pages/Index";

interface Props {
  item: CheckItem;
  onToggle: (id: string) => void;
  onMemoChange: (id: string, memo: string) => void;
}

const ChecklistCard = ({ item, onToggle, onMemoChange }: Props) => (
  <div
    className={`bg-card border rounded-lg p-4 transition-all duration-200 ${
      item.checked ? "border-success/40" : "border-border"
    }`}
  >
    <div className="flex items-start gap-3">
      <button
        onClick={() => onToggle(item.id)}
        className="mt-0.5 shrink-0 transition-transform active:scale-90"
        aria-label={item.checked ? "완료 해제" : "완료 처리"}
      >
        {item.checked ? (
          <CheckCircle2 className="h-5 w-5 text-success animate-check-pop" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      <div className="flex-1 space-y-2">
        <span
          className={`text-sm font-medium transition-colors ${
            item.checked ? "text-muted-foreground line-through" : "text-foreground"
          }`}
        >
          {item.title}
        </span>
        <input
          type="text"
          placeholder="메모 입력..."
          value={item.memo}
          onChange={(e) => onMemoChange(item.id, e.target.value)}
          className="w-full bg-input border-none rounded-md px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
    </div>
  </div>
);

export default ChecklistCard;
