import { useState, useMemo } from "react";
import { CheckCircle2, Circle, ClipboardCheck } from "lucide-react";
import ChecklistCard from "@/components/ChecklistCard";
import ProgressHeader from "@/components/ProgressHeader";
import FilterTabs from "@/components/FilterTabs";

export interface CheckItem {
  id: string;
  category: string;
  title: string;
  checked: boolean;
  memo: string;
}

const initialItems: CheckItem[] = [
  { id: "1", category: "월간 점검", title: "고객정보 접근권한 확인", checked: false, memo: "" },
  { id: "2", category: "월간 점검", title: "비밀번호 변경 여부", checked: false, memo: "" },
  { id: "3", category: "월간 점검", title: "문서 보관 상태", checked: false, memo: "" },
  { id: "4", category: "분기 점검", title: "시스템 로그 점검", checked: false, memo: "" },
  { id: "5", category: "분기 점검", title: "외부감사 자료 준비", checked: false, memo: "" },
  { id: "6", category: "분기 점검", title: "규정 변경사항 반영", checked: false, memo: "" },
];

type Filter = "전체" | "완료" | "미완료";

const Index = () => {
  const [items, setItems] = useState<CheckItem[]>(initialItems);
  const [filter, setFilter] = useState<Filter>("전체");

  const toggleCheck = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const updateMemo = (id: string, memo: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, memo } : item)));
  };

  const total = items.length;
  const completed = items.filter((i) => i.checked).length;

  const filtered = useMemo(() => {
    if (filter === "완료") return items.filter((i) => i.checked);
    if (filter === "미완료") return items.filter((i) => !i.checked);
    return items;
  }, [items, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, CheckItem[]>();
    filtered.forEach((item) => {
      const arr = map.get(item.category) || [];
      arr.push(item);
      map.set(item.category, arr);
    });
    return map;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl py-6 space-y-6">
        {/* Title */}
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">OK금융 업무 점검</h1>
        </div>

        <ProgressHeader completed={completed} total={total} />
        <FilterTabs filter={filter} onFilterChange={setFilter} />

        {/* Cards grouped by category */}
        {Array.from(grouped.entries()).map(([category, categoryItems]) => (
          <div key={category} className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1">
              {category}
            </h2>
            {categoryItems.map((item) => (
              <ChecklistCard
                key={item.id}
                item={item}
                onToggle={toggleCheck}
                onMemoChange={updateMemo}
              />
            ))}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            해당하는 항목이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
