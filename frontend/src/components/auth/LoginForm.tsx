/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { api } from "@/src/lib/api";

/* ------------------ Schema ------------------ */
const loginSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    if (!mounted) return null;

    const onSubmit = async (data: LoginFormValues) => {
        setApiError(null);

        try {
            const res = await api.post("/auth/login", data);
            console.log("Login response:", res);
            // OPTION A: backend returns token
            if (res.data?.access_token) {
                document.cookie = `access_token=${res.data.access_token}; path=/`;
            }

            // OPTION B: backend already sets HttpOnly cookie
            router.push("/dashboard");
        } catch (err: any) {
            setApiError(
                err?.response?.data?.message || "Invalid email or password"
            );
        }
    };

    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-2xl">
                    Login
                </CardTitle>
                <p className="text-center text-sm text-muted-foreground">
                    Sign in to continue
                </p>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                >
                    {apiError && (
                        <p className="text-sm text-red-500 text-center">
                            {apiError}
                        </p>
                    )}

                    <div>
                        <Label>Email</Label>
                        <Input {...register("email")} />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Password</Label>
                        <Input type="password" {...register("password")} />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
