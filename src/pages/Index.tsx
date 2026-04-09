import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { ClipboardCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ChecklistCard from "@/components/ChecklistCard";
import ProgressHeader from "@/components/ProgressHeader";
import FilterTabs from "@/components/FilterTabs";
import CategoryTabs from "@/components/CategoryTabs";
import AddItemForm from "@/components/AddItemForm";
import UserHeader from "@/components/UserHeader";
import LoginPage from "@/components/LoginPage";

export interface CheckItem {
  id: string;
  category: string;
  title: string;
  checked: boolean;
  memo: string;
}

const categories = ["월간 점검", "분기 점검"] as const;
const defaultItems = [
  { title: "고객정보 접근권한 확인", category: "월간 점검" },
  { title: "비밀번호 변경 여부", category: "월간 점검" },
  { title: "문서 보관 상태", category: "월간 점검" },
  { title: "시스템 로그 점검", category: "분기 점검" },
  { title: "외부감사 자료 준비", category: "분기 점검" },
  { title: "규정 변경사항 반영", category: "분기 점검" },
];

type Filter = "전체" | "완료" | "미완료";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState<Filter>("전체");
  const [activeCategory, setActiveCategory] = useState<string>("월간 점검");
  const queryClient = useQueryClient();
  const memoTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

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
    enabled: !!user,
  });

  // Seed default items for new users
  const seedMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("checklist_items").insert(
        defaultItems.map((item) => ({ ...item, user_id: userId }))
      );
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["checklist_items"] }),
  });

  useEffect(() => {
    if (user && !isLoading && items.length === 0 && !seedMutation.isPending) {
      seedMutation.mutate(user.id);
    }
  }, [user, isLoading, items.length]);

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

  const insertMutation = useMutation({
    mutationFn: async ({ title, category }: { title: string; category: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("checklist_items").insert({ title, category, user_id: user.id });
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["checklist_items"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("checklist_items").delete().eq("id", id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["checklist_items"] });
      const prev = queryClient.getQueryData<CheckItem[]>(["checklist_items"]);
      queryClient.setQueryData<CheckItem[]>(["checklist_items"], (old) => old?.filter((item) => item.id !== id));
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

  const updateMemo = useCallback((id: string, memo: string) => {
    queryClient.setQueryData<CheckItem[]>(["checklist_items"], (old) =>
      old?.map((item) => (item.id === id ? { ...item, memo } : item))
    );
    if (memoTimers.current[id]) clearTimeout(memoTimers.current[id]);
    memoTimers.current[id] = setTimeout(() => {
      updateMutation.mutate({ id, updates: { memo } });
    }, 500);
  }, [queryClient, updateMutation]);

  const handleAdd = (title: string, category: string) => {
    insertMutation.mutate({ title, category });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const categoryItems = items.filter((i) => i.category === activeCategory);
  const total = categoryItems.length;
  const completed = categoryItems.filter((i) => i.checked).length;

  const filtered = (() => {
    if (filter === "완료") return categoryItems.filter((i) => i.checked);
    if (filter === "미완료") return categoryItems.filter((i) => !i.checked);
    return categoryItems;
  })();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl py-6 space-y-5">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">OK금융 업무 점검</h1>
        </div>

        <UserHeader />

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
            <ChecklistCard
              key={item.id}
              item={item}
              onToggle={toggleCheck}
              onMemoChange={updateMemo}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">해당하는 항목이 없습니다.</div>
        )}

        <AddItemForm categories={[...categories]} onAdd={handleAdd} />
      </div>
    </div>
  );
};

export default Index;
