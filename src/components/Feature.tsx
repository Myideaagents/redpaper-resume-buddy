import { cn } from "@/lib/utils";

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export const Feature = ({ title, description, icon, className }: FeatureProps) => {
  return (
    <div className={cn("p-8 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow", className)}>
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};