"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Card } from "@/src/components/ui/card";

type Profile = {
    user_id: string;
    email: string;
    profile: string | null; // base64 image
    first_name: string | null;
    last_name: string | null;
    address: string | null;
    phone_number: string | null;
    role: string;
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [form, setForm] = useState<Partial<Profile>>({});
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    /* ------------------ Load Profile ------------------ */
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await api.get("/user/me");
            setProfile((prev)=>({
                ...prev,
                ...res.data,
                profile_pic: res.data.profile_pic,
            }));
            setForm((prev)=>({
                ...prev,
                ...res.data,
                profile: res.data.profile_pic,
            }));
        } finally {
            setLoading(false);
        }
    };

    /* ------------------ Form Change ------------------ */
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    /* ------------------ Image Upload (Base64) ------------------ */
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Image size should be less than 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm((prev) => ({
                ...prev,
                profile: reader.result as string, // base64
            }));
        };

        reader.readAsDataURL(file);
    };

    /* ------------------ Save Profile ------------------ */
    const saveProfile = async () => {
        await api.put("/user/me", {
            first_name: form.first_name,
            last_name: form.last_name,
            phone_number: form.phone_number,      // ✅ renamed
            address: form.address,
            profile_pic: form.profile,     // ✅ renamed (base64)
        });


        setEditing(false);
        loadProfile();
    };

    if (loading) return <p className="text-muted-foreground">Loading profile…</p>;
    if (!profile) return null;

    return (
        <div className="space-y-10">
            {/* ================== HERO / IDENTITY ================== */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={form.profile || undefined} />
                            <AvatarFallback className="text-xl">
                                {profile.first_name?.[0] || "U"}
                            </AvatarFallback>
                        </Avatar>

                        {editing && (
                            <label className="absolute -bottom-2 -right-2 cursor-pointer bg-background border rounded-full px-2 py-1 text-xs shadow">
                                Change
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        )}
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold">
                            {profile.first_name || "Unnamed"} {profile.last_name || ""}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {profile.email}
                        </p>
                        <Badge className="mt-2 capitalize">
                            {profile.role}
                        </Badge>
                    </div>
                </div>

                {!editing ? (
                    <Button onClick={() => setEditing(true)}>
                        Edit Profile
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button onClick={saveProfile}>Save</Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setForm(profile);
                                setEditing(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </div>

            {/* ================== PERSONAL INFO ================== */}
            <Card className="p-6">
                <h2 className="text-lg font-medium mb-6">
                    Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label>First Name</Label>
                        <Input
                            name="first_name"
                            value={form.first_name || ""}
                            onChange={onChange}
                            disabled={!editing}
                        />
                    </div>

                    <div>
                        <Label>Last Name</Label>
                        <Input
                            name="last_name"
                            value={form.last_name || ""}
                            onChange={onChange}
                            disabled={!editing}
                        />
                    </div>

                    <div>
                        <Label>Phone</Label>
                        <Input
                            name="phone"
                            value={form.phone_number || ""}
                            onChange={onChange}
                            disabled={!editing}
                        />
                    </div>

                    <div>
                        <Label>Address</Label>
                        <Input
                            name="address"
                            value={form.address || ""}
                            onChange={onChange}
                            disabled={!editing}
                        />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input value={profile.email} disabled />
                    </div>

                    <div>
                        <Label>Role</Label>
                        <Input value={profile.role} disabled />
                    </div>
                </div>
            </Card>

            {/* ================== FUTURE ANALYTICS ================== */}
            <Card className="p-6 text-muted-foreground">
                <h2 className="text-lg font-medium mb-2">
                    Activity & Insights
                </h2>
                <p className="text-sm">
                    User activity analytics, login trends, and graphs will appear here.
                </p>
            </Card>
        </div>
    );
}
