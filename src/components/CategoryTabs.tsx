import type { CheckItem } from "@/pages/Index";

interface Props {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
  items: CheckItem[];
}

const CategoryTabs = ({ categories, active, onChange, items }: Props) => (
  <div className="flex rounded-lg bg-card border border-border overflow-hidden">
    {categories.map((cat) => {
      const catItems = items.filter((i) => i.category === cat);
      const done = catItems.filter((i) => i.checked).length;
      const isActive = active === cat;
      return (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {cat}
          <span className={`ml-2 text-xs ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {done}/{catItems.length}
          </span>
        </button>
      );
    })}
  </div>
);

export default CategoryTabs;
