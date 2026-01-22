"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Users,
  LogIn,
  Activity,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { useEffect } from "react";

/* ------------------ Dummy Data (API-ready) ------------------ */

const activityData = [
  { day: "Mon", value: 2 },
  { day: "Tue", value: 5 },
  { day: "Wed", value: 3 },
  { day: "Thu", value: 6 },
  { day: "Fri", value: 4 },
  { day: "Sat", value: 1 },
  { day: "Sun", value: 2 },
];

const profileCompletion = [
  { name: "Completed", value: 80 },
  { name: "Remaining", value: 20 },
];

const COLORS = ["#22c55e", "#e5e7eb"];

export default function DashboardPage() {

  
  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Overview of your account activity
          </p>
        </div>

        <Badge className="bg-green-100 text-green-700">
          Active
        </Badge>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Logins"
          value="124"
          icon={<LogIn className="text-blue-600" />}
          bg="bg-blue-50"
        />

        <KpiCard
          title="Active Sessions"
          value="3"
          icon={<Users className="text-purple-600" />}
          bg="bg-purple-50"
        />

        <KpiCard
          title="Activity Score"
          value="87%"
          icon={<Activity className="text-orange-600" />}
          bg="bg-orange-50"
        />

        <KpiCard
          title="Account Status"
          value="Verified"
          icon={<CheckCircle className="text-green-600" />}
          bg="bg-green-50"
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-medium mb-1">
            Weekly Activity
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Login frequency over the last 7 days
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">
            Profile Completion
          </h2>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={profileCompletion}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                >
                  {profileCompletion.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-2">
            80% completed
          </p>
        </Card>
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-2">
            Recent Activity
          </h2>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>✔ Logged in from Chrome</li>
            <li>✔ Updated profile information</li>
            <li>✔ Uploaded profile image</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium mb-2">
            System Status
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="text-green-600" />
            All systems operational
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ================= KPI CARD ================= */

function KpiCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <Card className={`p-6 ${bg}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-semibold mt-1">
            {value}
          </p>
        </div>
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow">
          {icon}
        </div>
      </div>
    </Card>
  );
}
