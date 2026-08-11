import AdminLayout from "../components/AdminLayout";
import { cropStats } from "../../admin/data/adminData";

export default function Reports() {
  return (
    <AdminLayout
      title="Reports"
      activePage="Reports"
    >
      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="font-bold text-gray-900">
            Crop Recommendation Report
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Overall distribution of recommended crops
          </p>

          <div className="mt-8 space-y-6">
            {cropStats.map((item) => (
              <div key={item.crop}>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {item.crop}
                  </span>

                  <span className="text-sm font-bold text-gray-900">
                    {item.percentage}%
                  </span>
                </div>

                <div className="h-3 rounded-full bg-gray-100">
                  <div
                    className="h-3 rounded-full bg-green-600"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="font-bold text-gray-900">
            System Overview
          </h3>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b border-gray-100 pb-4">
              <span className="text-sm text-gray-500">
                Total Users
              </span>

              <span className="font-bold">
                248
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-4">
              <span className="text-sm text-gray-500">
                Total Predictions
              </span>

              <span className="font-bold">
                1,284
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-100 pb-4">
              <span className="text-sm text-gray-500">
                Most Recommended
              </span>

              <span className="font-bold text-green-600">
                Rice
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">
                System Status
              </span>

              <span className="font-semibold text-green-600">
                Operational
              </span>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}