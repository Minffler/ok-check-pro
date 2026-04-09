const filters = ["전체", "완료", "미완료"] as const;

interface Props {
  filter: string;
  onFilterChange: (f: "전체" | "완료" | "미완료") => void;
}

const FilterTabs = ({ filter, onFilterChange }: Props) => (
  <div className="flex gap-2">
    {filters.map((f) => (
      <button
        key={f}
        onClick={() => onFilterChange(f)}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
          filter === f
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-muted"
        }`}
      >
        {f}
      </button>
    ))}
  </div>
);

export default FilterTabs;
