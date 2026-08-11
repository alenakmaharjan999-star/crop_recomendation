import { Search } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { predictions } from "../data/adminData";

export default function Predictions() {
  return (
    <AdminLayout
      title="Predictions"
      activePage="Predictions"
    >
      <div className="rounded-2xl border border-gray-200 bg-white">

        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-bold text-gray-900">
              Prediction History
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View all crop recommendations
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search predictions..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-500 md:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-400">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">N</th>
                <th className="px-6 py-4">P</th>
                <th className="px-6 py-4">K</th>
                <th className="px-6 py-4">pH</th>
                <th className="px-6 py-4">Temp.</th>
                <th className="px-6 py-4">Humidity</th>
                <th className="px-6 py-4">Crop</th>
                <th className="px-6 py-4">Location</th>
              </tr>
            </thead>

            <tbody>
              {predictions.map((prediction) => (
                <tr
                  key={prediction.id}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                    {prediction.user}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {prediction.nitrogen}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {prediction.phosphorus}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {prediction.potassium}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {prediction.ph}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {prediction.temperature}°C
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {prediction.humidity}%
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {prediction.crop}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-500">
                    {prediction.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}