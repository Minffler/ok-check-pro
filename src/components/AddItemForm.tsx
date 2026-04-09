import { useState } from "react";
import { Plus, X } from "lucide-react";

interface Props {
  categories: string[];
  onAdd: (title: string, category: string) => void;
}

const AddItemForm = ({ categories, onAdd }: Props) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0] || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), category);
    setTitle("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-card transition-colors text-sm font-medium"
      >
        <Plus className="h-4 w-4" />
        항목 추가
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-lg p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">새 점검 항목</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <input
        type="text"
        placeholder="항목명 입력..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        className="w-full bg-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <div className="flex items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              category === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <button
        type="submit"
        disabled={!title.trim()}
        className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        저장
      </button>
    </form>
  );
};

export default AddItemForm;
