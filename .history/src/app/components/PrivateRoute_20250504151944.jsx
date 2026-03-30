"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (allowedRoles && !allowedRoles.includes(user?.role)) {
      router.push("/");
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) return null;

  return children;
}
