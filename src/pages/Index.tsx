import { useState, useMemo } from "react";
import { ClipboardCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

const categories = ["월간 점검", "분기 점검"] as const;
type Filter = "전체" | "완료" | "미완료";

const Index = () => {
  const [filter, setFilter] = useState<Filter>("전체");
  const [activeCategory, setActiveCategory] = useState<string>("월간 점검");
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["checklist_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checklist_items")
        .select("id, title, category, checked, memo")
        .order("created_at");
      if (error) throw error;
      return data as CheckItem[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Pick<CheckItem, "checked" | "memo">> }) => {
      const { error } = await supabase.from("checklist_items").update(updates).eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["checklist_items"] });
      const prev = queryClient.getQueryData<CheckItem[]>(["checklist_items"]);
      queryClient.setQueryData<CheckItem[]>(["checklist_items"], (old) =>
        old?.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(["checklist_items"], context.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["checklist_items"] }),
  });

  const toggleCheck = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) updateMutation.mutate({ id, updates: { checked: !item.checked } });
  };

  const updateMemo = (id: string, memo: string) => {
    updateMutation.mutate({ id, updates: { memo } });
  };

  const categoryItems = items.filter((i) => i.category === activeCategory);
  const total = categoryItems.length;
  const completed = categoryItems.filter((i) => i.checked).length;

  const filtered = useMemo(() => {
    if (filter === "완료") return categoryItems.filter((i) => i.checked);
    if (filter === "미완료") return categoryItems.filter((i) => !i.checked);
    return categoryItems;
  }, [categoryItems, filter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

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
