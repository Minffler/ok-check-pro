import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import type { CheckItem } from "@/pages/Index";

interface Props {
  item: CheckItem;
  onToggle: (id: string) => void;
  onMemoChange: (id: string, memo: string) => void;
  onDelete: (id: string) => void;
}

const ChecklistCard = ({ item, onToggle, onMemoChange, onDelete }: Props) => (
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
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-medium transition-colors ${
              item.checked ? "text-muted-foreground line-through" : "text-foreground"
            }`}
          >
            {item.title}
          </span>
          <button
            onClick={() => onDelete(item.id)}
            className="shrink-0 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="항목 삭제"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
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
