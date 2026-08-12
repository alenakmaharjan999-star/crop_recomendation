import { Search, MoreHorizontal } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { users } from "../data/adminData";

export default function Users() {
  return (
    <AdminLayout
      title="Users"
      activePage="Users"
    >
      <div className="rounded-2xl border border-gray-200 bg-white">

        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-bold text-gray-900">
              All Users
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Manage registered users
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search users..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-500 md:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-400">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Predictions</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 font-semibold text-green-700">
                        {user.username.charAt(0)}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.username}
                        </p>

                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {user.predictions}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-500">
                    {user.joined}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
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
