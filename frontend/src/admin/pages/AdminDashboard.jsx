import AdminLayout from "../components/AdminLayout";
import StatCard from "../components/StatCard";

import {
  dashboardStats,
  recentPredictions,
  cropStats,
} from "../data/adminData";

export default function Dashboard() {
  return (
    <AdminLayout
      title="Dashboard"
      activePage="Dashboard"
    >
      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
        ))}
      </div>

      {/* Main grid */}
      <div className="mt-8 grid gap-6 xl:grid-cols-3">

        {/* Crop statistics */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 xl:col-span-1">
          <div className="mb-6">
            <h3 className="font-bold text-gray-900">
              Crop Recommendations
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Distribution of recommended crops
            </p>
          </div>

          <div className="space-y-5">
            {cropStats.map((item) => (
              <div key={item.crop}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {item.crop}
                  </span>

                  <span className="font-semibold text-gray-900">
                    {item.percentage}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-green-600"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent predictions */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">
                Recent Predictions
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Latest crop recommendations
              </p>
            </div>

            <a
              href="/admin/predictions"
              className="text-sm font-semibold text-green-600 hover:text-green-700"
            >
              View all
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Location</th>
                  <th className="pb-3 font-medium">Crop</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>

              <tbody>
                {recentPredictions.map((prediction) => (
                  <tr
                    key={prediction.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {prediction.user}
                      </p>
                    </td>

                    <td className="py-4 text-sm text-gray-500">
                      {prediction.location}
                    </td>

                    <td className="py-4">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        {prediction.crop}
                      </span>
                    </td>

                    <td className="py-4 text-sm text-gray-500">
                      {prediction.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}