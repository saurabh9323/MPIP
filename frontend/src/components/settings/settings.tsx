"use client";

import { Card } from "@/src/components/ui/card";

import { Label } from "@/src/components/ui/label";
import { Switch } from "@radix-ui/react-switch";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your preferences
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>Enable Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive system notifications
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Email Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Get updates via email
            </p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Weekly Summary</Label>
            <p className="text-sm text-muted-foreground">
              Receive weekly activity summary
            </p>
          </div>
          <Switch defaultChecked />
        </div>
      </Card>
    </div>
  );
}
