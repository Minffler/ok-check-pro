import { useState, useMemo } from "react";
import { ClipboardCheck } from "lucide-react";
import ChecklistCard from "@/components/ChecklistCard";
import ProgressHeader from "@/components/ProgressHeader";
import FilterTabs from "@/components/FilterTabs";
import CategoryTabs from "@/components/CategoryTabs";

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

const categories = ["월간 점검", "분기 점검"] as const;
type Filter = "전체" | "완료" | "미완료";

const Index = () => {
  const [items, setItems] = useState<CheckItem[]>(initialItems);
  const [filter, setFilter] = useState<Filter>("전체");
  const [activeCategory, setActiveCategory] = useState<string>("월간 점검");

  const toggleCheck = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const updateMemo = (id: string, memo: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, memo } : item)));
  };

  const categoryItems = items.filter((i) => i.category === activeCategory);
  const total = categoryItems.length;
  const completed = categoryItems.filter((i) => i.checked).length;

  const filtered = useMemo(() => {
    if (filter === "완료") return categoryItems.filter((i) => i.checked);
    if (filter === "미완료") return categoryItems.filter((i) => !i.checked);
    return categoryItems;
  }, [categoryItems, filter]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl py-6 space-y-5">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">OK금융 업무 점검</h1>
        </div>

        <CategoryTabs
          categories={[...categories]}
          active={activeCategory}
          onChange={(c) => { setActiveCategory(c); setFilter("전체"); }}
          items={items}
        />

        <ProgressHeader completed={completed} total={total} />
        <FilterTabs filter={filter} onFilterChange={setFilter} />

        <div className="space-y-3">
          {filtered.map((item) => (
            <ChecklistCard key={item.id} item={item} onToggle={toggleCheck} onMemoChange={updateMemo} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">해당하는 항목이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Index;
