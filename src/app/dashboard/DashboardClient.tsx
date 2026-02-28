"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { dashboardNav, DashboardKey } from "@/config/dashboard";
import { AirdropTable } from "@/components/AirdropTable";
import { EarnTable } from "@/components/EarnTable";
import { GuideGrid } from "@/components/GuideGrid";

export default function DashboardClient() {
  const [active, setActive] = useState<DashboardKey>("airdrop");

  const ActiveView = useMemo(() => {
    const map: Record<DashboardKey, ReactNode> = {
      airdrop: <AirdropTable />,
      earn: <EarnTable />,
      guide: <GuideGrid />,
    };
    return map[active];
  }, [active]);

  const title = useMemo(() => {
    const item = dashboardNav.find((x) => x.key === active);
    return item?.label ?? "Dashboard";
  }, [active]);

  return (
    <main className="min-h-screen bg-[#0D1117] text-[#E5E7EB]">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="border-b md:border-b-0 md:border-r border-[#1F2A44] bg-[#0B1220]">
            <div className="p-6">
              <div className="text-sm tracking-[0.28em] text-[#9CA3AF]">AIR DROP INDEX</div>
              <div className="mt-2 text-xl font-semibold">Terminal</div>
              <div className="mt-3 text-xs text-[#9CA3AF]">
                多板块内容看板：空投 / 交易所理财 / 教程
              </div>
            </div>

            <nav className="px-3 pb-6">
              {dashboardNav.map((item) => {
                const isActive = item.key === active;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActive(item.key)}
                    className={[
                      "w-full text-left px-4 py-3 mb-2 border border-transparent",
                      "transition select-none",
                      isActive
                        ? "bg-[#0F172A] border-[#1F2A44] text-[#39D353]"
                        : "text-[#9CA3AF] hover:bg-[#0F172A] hover:border-[#1F2A44] hover:text-[#E5E7EB]",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-[#39D353]" : "text-[#9CA3AF]"}>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                      {isActive && <span className="ml-auto text-xs text-[#39D353]">●</span>}
                    </div>
                    {item.description && (
                      <div className="mt-1 text-xs text-[#6B7280]">{item.description}</div>
                    )}
                  </button>
                );
              })}
            </nav>

          </aside>

          {/* Main */}
          <section className="p-6 md:p-8">

            <header className="mb-6 border-b border-[#1F2A44] pb-5">
              <div className="flex items-baseline gap-3">
                <h1 className="text-2xl tracking-[0.12em] text-[#E5E7EB]">{title}</h1>
                <span className="text-[11px] tracking-[0.28em] text-amber-300/80">
                  AIRDROP INDEX
                </span>
              </div>
              <p className="mt-2 text-sm text-[#9CA3AF]">
                聚合优质空投信息，筛掉噪音，只保留可执行的任务线索。
              </p>
            </header>

            {ActiveView}
          </section>
        </div>
      </div>
    </main>
  );
}