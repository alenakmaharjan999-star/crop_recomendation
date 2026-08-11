import {
  Users,
  Sprout,
  Activity,
  TrendingUp,
} from "lucide-react";

const icons = {
  "Total Users": Users,
  Predictions: Activity,
  "Today's Predictions": TrendingUp,
  "Top Crop": Sprout,
};

export default function StatCard({
  title,
  value,
  change,
  description,
}) {
  const Icon = icons[title] || Activity;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-green-50 p-3">
          <Icon className="h-6 w-6 text-green-600" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="font-semibold text-green-600">
          {change}
        </span>

        <span className="text-gray-500">
          {description}
        </span>
      </div>
    </div>
  );
}