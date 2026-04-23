"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Page } from "@/types/database";
import {
  BookOpen,
  Mic,
  Speaker,
  HandHeart,
  Quote,
  FolderOpen,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  FileText,
  Plus,
  EyeOff,
  BarChart3,
  Activity as ActivityIcon,
  AlertCircle,
  ScrollText,
} from "lucide-react";
import { ToastProvider } from "@/components/admin/toast";
import { PrimaryButton } from "@/components/admin/form-fields";
import { CommandPalette, CommandPaletteTrigger } from "@/components/admin/command-palette";

const topNavLinks: { href: string; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
];

const insightsNavLinks: { href: string; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/activity", label: "Activity", icon: ActivityIcon },
  { href: "/admin/audit", label: "Audit Log", icon: ScrollText },
  { href: "/admin/needs-attention", label: "Content Health", icon: AlertCircle },
];

const contentNavLinks: { href: string; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { href: "/admin/books", label: "Books", icon: BookOpen },
  { href: "/admin/lectures", label: "Lectures", icon: Mic },
  { href: "/admin/khutbas", label: "Khutbas", icon: Speaker },
  { href: "/admin/duas", label: "Duas", icon: HandHeart },
  { href: "/admin/wisdom", label: "Wisdom", icon: Quote },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
];

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/analytics": "Analytics",
  "/admin/activity": "Activity",
  "/admin/audit": "Audit Log",
  "/admin/needs-attention": "Content Health",
  "/admin/pages": "Pages",
  "/admin/books": "Books",
  "/admin/lectures": "Lectures",
  "/admin/khutbas": "Khutbas",
  "/admin/duas": "Duas",
  "/admin/wisdom": "Wisdom",
  "/admin/categories": "Categories",
};

type SidebarPage = Pick<Page, "id" | "slug" | "parent_id" | "title" | "sort_order" | "hidden">;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pages, setPages] = useState<SidebarPage[]>([]);
  const [collapsedPages, setCollapsedPages] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  const loadPages = useCallback(async () => {
    const { data } = await supabase
      .from("pages")
      .select("id,slug,parent_id,title,sort_order,hidden")
      .order("sort_order")
      .order("title");
    setPages((data as SidebarPage[]) ?? []);
  }, []);

  useEffect(() => {
    if (!user) return;
    loadPages();
    function onChanged() {
      loadPages();
    }
    window.addEventListener("admin:pages:changed", onChanged);
    return () => window.removeEventListener("admin:pages:changed", onChanged);
  }, [user, loadPages]);

  // Refetch on route change — covers admin actions on the pages admin
  useEffect(() => {
    if (user) loadPages();
  }, [pathname, user, loadPages]);

  const pageTree = useMemo(() => {
    const byParent = new Map<string | null, SidebarPage[]>();
    pages.forEach((p) => {
      const key = p.parent_id ?? null;
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key)!.push(p);
    });
    byParent.forEach((list) =>
      list.sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title))
    );
    return byParent;
  }, [pages]);

  const togglePageCollapse = useCallback((id: string) => {
    setCollapsedPages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (sidebarOpen) setSidebarOpen(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-teal-700 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500">Loading admin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0] px-4">
        <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md w-full">
          <div className="flex flex-col items-center mb-6">
            <Image src="/logo.png" alt="Ilm Library" width={48} height={48} className="rounded-md mb-3" />
            <h1 className="text-2xl font-bold text-teal-900">Admin Sign In</h1>
            <p className="text-sm text-gray-500 mt-1">Ilm Library management</p>
          </div>
          <LoginForm onLogin={setUser} />
        </div>
      </div>
    );
  }

  const currentTitle = pageTitles[pathname] ?? "Admin";
  const isDashboard = pathname === "/admin";

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f0f0f0] flex">
        {/* Mobile toggle */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-teal-900 text-white p-2 rounded-md shadow-md hover:bg-teal-800 transition-colors"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0 flex flex-col lg:h-screen ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="bg-teal-900 px-5 py-5">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-md bg-teal-800 flex items-center justify-center shrink-0 ring-1 ring-teal-700/60">
                <Image
                  src="/logo.png"
                  alt="Ilm Library"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                  priority
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white truncate leading-tight text-base">
                  Ilm Library
                </p>
                <p className="text-[11px] text-teal-200 uppercase tracking-wider font-semibold">
                  Admin Console
                </p>
              </div>
            </Link>
          </div>

          <div className="px-3 pt-3">
            <CommandPaletteTrigger />
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {topNavLinks.map((link) => (
              <SidebarLink key={link.href} link={link} pathname={pathname} />
            ))}

            {/* Insights section */}
            <div className="pt-4 mt-3 border-t border-gray-200">
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Insights
              </p>
              {insightsNavLinks.map((link) => (
                <SidebarLink key={link.href} link={link} pathname={pathname} />
              ))}
            </div>

            {/* Pages section — dynamic list from DB */}
            <div className="pt-4">
              <div className="flex items-center justify-between px-3 pb-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Pages
                </p>
                <Link
                  href="/admin/pages?new=1"
                  title="New page"
                  className="text-gray-400 hover:text-teal-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Plus size={12} />
                </Link>
              </div>

              <Link
                href="/admin/pages"
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/admin/pages"
                    ? "bg-teal-50 text-teal-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FileText size={16} />
                All Pages
                <span className="ml-auto text-[11px] text-gray-400">{pages.length}</span>
              </Link>

              <PageNavTree
                parentId={null}
                tree={pageTree}
                depth={0}
                collapsed={collapsedPages}
                onToggle={togglePageCollapse}
              />
            </div>

            {/* Content section */}
            <div className="pt-4 mt-3 border-t border-gray-200">
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Content
              </p>
              {contentNavLinks.map((link) => (
                <SidebarLink key={link.href} link={link} pathname={pathname} />
              ))}
            </div>

            <div className="pt-4 mt-3 border-t border-gray-200">
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                External
              </p>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <ExternalLink size={16} />
                View Public Site
              </a>
            </div>
          </nav>

          <div className="border-t border-gray-200 p-3">
            <div className="flex items-center gap-2 px-1">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-sm text-gray-900 truncate">{user.email}</p>
              </div>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                }}
                className="text-gray-500 hover:text-gray-900 p-1.5 rounded hover:bg-gray-100 transition-colors"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {!isDashboard && (
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
                <Link href="/admin" className="hover:text-teal-900">
                  Admin
                </Link>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="text-gray-900">{currentTitle}</span>
              </div>
            </div>
          )}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 lg:py-8">{children}</div>
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <CommandPalette />
      </div>
    </ToastProvider>
  );
}

function SidebarLink({
  link,
  pathname,
}: {
  link: { href: string; label: string; icon: React.ComponentType<{ size?: number }> };
  pathname: string;
}) {
  const Icon = link.icon;
  const isActive =
    link.href === "/admin"
      ? pathname === "/admin"
      : pathname === link.href || pathname.startsWith(link.href + "/");
  return (
    <Link
      href={link.href}
      className={`relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "bg-teal-50 text-teal-900"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-teal-900 rounded-r" />
      )}
      <Icon size={16} />
      {link.label}
    </Link>
  );
}

function PageNavTree({
  parentId,
  tree,
  depth,
  collapsed,
  onToggle,
}: {
  parentId: string | null;
  tree: Map<string | null, SidebarPage[]>;
  depth: number;
  collapsed: Set<string>;
  onToggle: (id: string) => void;
}) {
  const rows = tree.get(parentId) ?? [];
  if (rows.length === 0) return null;
  return (
    <>
      {rows.map((page) => {
        const children = tree.get(page.id) ?? [];
        const hasChildren = children.length > 0;
        const isCollapsed = collapsed.has(page.id);
        return (
          <PageNavItem
            key={page.id}
            page={page}
            depth={depth}
            hasChildren={hasChildren}
            isCollapsed={isCollapsed}
            onToggle={onToggle}
          >
            {hasChildren && !isCollapsed && (
              <PageNavTree
                parentId={page.id}
                tree={tree}
                depth={depth + 1}
                collapsed={collapsed}
                onToggle={onToggle}
              />
            )}
          </PageNavItem>
        );
      })}
    </>
  );
}

function PageNavItem({
  page,
  depth,
  hasChildren,
  isCollapsed,
  onToggle,
  children,
}: {
  page: SidebarPage;
  depth: number;
  hasChildren: boolean;
  isCollapsed: boolean;
  onToggle: (id: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div
        className="group flex items-center gap-1 pr-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        <button
          type="button"
          onClick={() => hasChildren && onToggle(page.id)}
          className={`w-5 h-5 flex items-center justify-center shrink-0 text-gray-400 ${
            hasChildren ? "hover:text-teal-700" : "invisible"
          }`}
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          {hasChildren && (isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />)}
        </button>
        <Link
          href={`/admin/pages?edit=${page.id}`}
          className={`flex-1 flex items-center gap-2 py-1.5 min-w-0 ${
            page.hidden ? "opacity-60" : ""
          }`}
          title={page.hidden ? "Hidden from public" : `/${page.slug}`}
        >
          <FileText size={13} className="text-gray-400 shrink-0" />
          <span className="truncate">{page.title}</span>
          {page.hidden && <EyeOff size={11} className="text-gray-400 shrink-0" />}
        </Link>
      </div>
      {children}
    </>
  );
}

function LoginForm({ onLogin }: { onLogin: (user: { email?: string }) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else if (data.user) {
      onLogin(data.user);
    }
  }

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-shadow";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />
      </div>
      {error && (
        <p className="text-rose-600 text-sm bg-rose-50 px-3 py-2 rounded-lg">{error}</p>
      )}
      <PrimaryButton type="submit" disabled={loading} className="w-full">
        {loading ? "Signing in..." : "Sign In"}
      </PrimaryButton>
    </form>
  );
}
