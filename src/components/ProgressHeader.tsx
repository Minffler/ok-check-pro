import { Progress } from "@/components/ui/progress";

interface Props {
  completed: number;
  total: number;
}

const ProgressHeader = ({ completed, total }: Props) => {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-card rounded-lg p-4 space-y-3 border border-border">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">진행률</span>
        <span className="text-sm font-semibold text-foreground">
          {completed} / {total}
          <span className="ml-2 text-primary">({pct}%)</span>
        </span>
      </div>
      <Progress value={pct} className="h-2 bg-muted" />
    </div>
  );
};

export default ProgressHeader;
