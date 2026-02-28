"use client";

import { useMemo, useState } from "react";
import { projects } from "@/data/projects";

type SortKey = "funding" | "status" | "updatedAt";
type SortDir = "asc" | "desc";

function normalizeStatus(raw: string) {
  // 你的数据里可能是：进行中 / 传闻 / 其他 / 已结束...
  // 这里统一成两态
  return raw?.includes("进行") ? "进行中" : "已结束";
}

function parseFundingToNumber(input: string) {
  // 支持：$120M / 120M / $2.5B / 10m / 800k / 空
  const s = (input || "").trim().toUpperCase();
  if (!s) return Number.NEGATIVE_INFINITY;

  // 去掉货币符号和逗号
  const cleaned = s.replace(/[$,]/g, "");

  const m = cleaned.match(/^(\d+(\.\d+)?)([KMB])?$/i);
  if (!m) return Number.NEGATIVE_INFINITY;

  const num = Number(m[1]);
  const unit = m[3];

  const mult =
    unit === "K" ? 1e3 : unit === "M" ? 1e6 : unit === "B" ? 1e9 : 1;

  return num * mult;
}

function SortIcon({
  active,
  dir,
}: {
  active: boolean;
  dir: SortDir;
}) {
  // 两个小三角：未激活灰色；激活时金色，并根据 asc/desc 高亮上/下
  const upActive = active && dir === "asc";
  const downActive = active && dir === "desc";

  return (
    <span className="ml-1 inline-flex flex-col items-center leading-none align-middle">
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        className={upActive ? "opacity-100" : "opacity-40"}
      >
        <path
          d="M5 0 L10 6 H0 Z"
          className={upActive ? "fill-[#F5C86A]" : "fill-[#9CA3AF]"}
        />
      </svg>
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        className={downActive ? "opacity-100 -mt-[1px]" : "opacity-40 -mt-[1px]"}
      >
        <path
          d="M0 0 H10 L5 6 Z"
          className={downActive ? "fill-[#F5C86A]" : "fill-[#9CA3AF]"}
        />
      </svg>
    </span>
  );
}

function ThButton({
  children,
  onClick,
  active,
  dir,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  dir: SortDir;
}) {
  return (
    <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.02em] text-[#9CA3AF]">
      <button
        onClick={onClick}
        className={[
          "inline-flex items-center select-none",
          "hover:text-[#F5C86A] transition-colors",
          active ? "text-[#F5C86A]" : "",
        ].join(" ")}
      >
        {children}
        <SortIcon active={active} dir={dir} />
      </button>
    </th>
  );
}

function Td({
  children,
  className = "",
  noWrap = true,
}: {
  children: React.ReactNode;
  className?: string;
  noWrap?: boolean;
}) {
  return (
    <td
      className={[
        "py-4 px-4 align-middle text-sm text-[#E5E7EB]",
        noWrap ? "whitespace-nowrap" : "whitespace-normal",
        className,
      ].join(" ")}
    >
      {children}
    </td>
  );
}

export function AirdropTable() {
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("desc");
  };

  const data = useMemo(() => {
    // 先把状态归一化
    const arr = projects.map((p: any) => ({
      ...p,
      __status2: normalizeStatus(p.status || ""),
    }));

    arr.sort((a: any, b: any) => {
      let va: any;
      let vb: any;

      if (sortKey === "funding") {
        va = parseFundingToNumber(a.funding || "");
        vb = parseFundingToNumber(b.funding || "");
      } else if (sortKey === "status") {
        // 进行中排前（desc 时）
        va = a.__status2 === "进行中" ? 1 : 0;
        vb = b.__status2 === "进行中" ? 1 : 0;
      } else {
        // updatedAt：按字符串比较（YYYY-MM-DD），desc = 新的在前
        va = (a.updatedAt || "").toString();
        vb = (b.updatedAt || "").toString();
      }

      if (va === vb) return 0;
      const res = va > vb ? 1 : -1;
      return sortDir === "asc" ? res : -res;
    });

    return arr;
  }, [sortKey, sortDir]);

  const stats = useMemo(() => {
    const total = data.length;
    const inProgress = data.filter((p: any) => p.__status2 === "进行中").length;
    const ended = total - inProgress;
    return { total, inProgress, ended };
  }, [data]);

  const statusPill = (s2: "进行中" | "已结束") => {
    if (s2 === "进行中") {
      return (
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-800/50 bg-emerald-900/20 px-3 py-1 text-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          进行中
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/20 px-3 py-1 text-zinc-200">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        已结束
      </span>
    );
  };

  const profitColor = (p: string) =>
    (p || "").includes("高")
      ? "text-amber-300"
      : (p || "").includes("中")
      ? "text-yellow-300"
      : "text-[#D1D5DB]";

  return (
    <div className="w-full">

      <section className="w-full rounded-2xl border border-[#1F2A44] bg-[#0B1220] shadow-[0_0_40px_rgba(245,200,106,0.10)]">
        {/* 顶部栏：左边统计 / 右边说明 */}
        <div className="flex w-full items-start justify-between gap-6 px-6 pt-6">
          {/* 左：统计 */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-[#1F2A44] bg-[#0B1220] px-4 py-3 min-w-[112px]">
              <div className="text-[11px] tracking-[0.10em] text-[#9CA3AF]">
                总项目
              </div>
              <div className="mt-1 text-xl font-semibold text-[#E5E7EB]">
                {stats.total}
              </div>
            </div>

            <div className="rounded-xl border border-emerald-800/50 bg-[#0B1220] px-4 py-3 min-w-[112px]">
              <div className="text-[11px] tracking-[0.10em] text-[#9CA3AF]">
                进行中
              </div>
              <div className="mt-1 text-xl font-semibold text-emerald-200">
                {stats.inProgress}
              </div>
            </div>

            <div className="rounded-xl border border-amber-800/40 bg-[#0B1220] px-4 py-3 min-w-[112px]">
              <div className="text-[11px] tracking-[0.10em] text-[#9CA3AF]">
                已结束
              </div>
              <div className="mt-1 text-xl font-semibold text-amber-200">
                {stats.ended}
              </div>
            </div>
          </div>

          {/* 右：说明（你后续想写什么再改这里） */}
          <div className="flex-1 text-right">
            <div className="text-[11px] tracking-[0.12em] text-[#9CA3AF]">
              说明
            </div>
            <div className="mt-1 text-sm text-[#C7CCD6]">
              （预留）这里可以写：筛选标准 / 更新频率 / 风险提示 / 你的操作原则等。
            </div>
          </div>
        </div>

        {/* 分割线 */}
        <div className="mt-5 border-t border-[#132033]" />

        {/* 表格 */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-[#0B1220]">
              <tr className="border-b border-[#1F2A44]">
                <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.02em] text-[#9CA3AF]">
                  名称
                </th>
                <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.02em] text-[#9CA3AF]">
                  类别
                </th>

                <ThButton
                  onClick={() => toggleSort("funding")}
                  active={sortKey === "funding"}
                  dir={sortDir}
                >
                  融资
                </ThButton>

                <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.02em] text-[#9CA3AF]">
                  投资机构
                </th>
                <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.02em] text-[#9CA3AF]">
                  成本
                </th>
                <th className="py-3 px-4 whitespace-nowrap text-left font-medium text-[12px] tracking-[0.02em] text-[#9CA3AF]">
                  建议上号
                </th>

                <ThButton
                  onClick={() => toggleSort("status")}
                  active={sortKey === "status"}
                  dir={sortDir}
                >
                  状态
                </ThButton>

                <ThButton
                  onClick={() => toggleSort("updatedAt")}
                  active={sortKey === "updatedAt"}
                  dir={sortDir}
                >
                  更新
                </ThButton>

                <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.02em] text-[#9CA3AF]">
                  利润
                </th>
               <th className="py-3 px-4 whitespace-nowrap text-left font-medium text-[12px] tracking-[0.02em] text-[#9CA3AF]">
                 任务链接
                </th>

                {/* 备注：允许换行，居中 */}
                <th className="py-3 px-4 text-center font-medium text-[12px] tracking-[0.02em] text-[#9CA3AF]">
                  备注
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((p: any) => {
                const s2 = p.__status2 as "进行中" | "已结束";
                return (
                  <tr
                    key={p.name}
                    className="border-b border-[#111827] hover:bg-[#0F1A2B] transition-colors"
                  >
                    <Td className="font-semibold text-[#E6EDF3]">
                      {p.name}
                    </Td>
                    <Td className="text-[#9CA3AF]">{p.category}</Td>

                    <Td className="text-[#F5C86A] font-semibold">
                      {p.funding}
                    </Td>

                    <Td className="text-[#B8C0CC]">{p.investors}</Td>
                    <Td className="text-[#B8C0CC]">{p.cost}</Td>
                    <Td className="text-[#B8C0CC]">{p.accounts}</Td>

                    <Td className="text-[#B8C0CC]">{statusPill(s2)}</Td>

                    <Td className="text-[#B8C0CC]">{p.updatedAt}</Td>

                    <Td className={[profitColor(p.profit), "font-semibold"].join(" ")}>
                      {p.profit}
                    </Td>

                    <Td className="text-[#F5C86A] font-semibold">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline underline-offset-4"
                      >
                        打开
                      </a>
                    </Td>

                    {/* 备注：可换行 + 居中对齐 */}
                    <Td
                      noWrap={false}
                      className="text-center text-[#A8B0BE] align-middle"
                    >
                      {p.note || ""}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 text-xs text-[#8B949E]">
          本站仅提供信息参考，不构成任何投资建议，请自行研究。
        </div>
      </section>
    </div>
  );
}