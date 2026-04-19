import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth/use-auth-store";
import { bannerService, blogService, badgeService, userService } from "@/services/admin/admin-service";
import type {
  CreateBannerData, UpdateBannerData,
  CreateBlogData, UpdateBlogData,
  CreateBadgeData, UpdateBadgeData,
} from "@/types/admin";

function useToken() {
  return useAuthStore((s) => s.accessToken) ?? "";
}

// ─── User Hooks ───────────────────────────────────────────────────
export function useAdminUsers() {
  const token = useToken();
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => userService.findAll(token),
    enabled: !!token,
  });
}

export function useCreateAdminUser() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; name: string; country?: string }) =>
      userService.create(data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

// ─── Banner Hooks ─────────────────────────────────────────────────
export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: () => bannerService.findAll(),
  });
}

export function useCreateBanner() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBannerData) => bannerService.create(data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banners"] }),
  });
}

export function useUpdateBanner() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBannerData }) =>
      bannerService.update(id, data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banners"] }),
  });
}

export function useDeleteBanner() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bannerService.remove(id, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banners"] }),
  });
}

// ─── Blog Hooks ───────────────────────────────────────────────────
export function useBlog(id: number) {
  return useQuery({
    queryKey: ["blogs", id],
    queryFn: () => blogService.findOne(id),
    enabled: !!id,
  });
}

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: () => blogService.findAll(),
  });
}

export function useCreateBlog() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBlogData) => blogService.create(data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] }),
  });
}

export function useUpdateBlog() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBlogData }) =>
      blogService.update(id, data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] }),
  });
}

export function useDeleteBlog() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => blogService.remove(id, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] }),
  });
}

// ─── Badge Hooks ──────────────────────────────────────────────────
export function useBadges() {
  const token = useToken();
  return useQuery({
    queryKey: ["badges"],
    queryFn: () => badgeService.findAll(token),
    enabled: !!token,
  });
}

export function useCreateBadge() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBadgeData) => badgeService.create(data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["badges"] }),
  });
}

export function useUpdateBadge() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBadgeData }) =>
      badgeService.update(id, data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["badges"] }),
  });
}

export function useDeleteBadge() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => badgeService.remove(id, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["badges"] }),
  });
}
