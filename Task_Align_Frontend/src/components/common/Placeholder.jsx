import Card from "@/components/ui/Card.jsx";
import { Sparkles } from "lucide-react";

export default function Placeholder({ title, description }) {
  return (
    <Card className="flex flex-col items-center justify-center py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-50 text-primary-600">
        <Sparkles size={22} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-ink-soft">{description}</p>
    </Card>
  );
}
