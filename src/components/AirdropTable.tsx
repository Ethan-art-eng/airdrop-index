"use client";

import { useMemo, useState } from "react";
import { projects } from "@/data/projects";

type SortKey = "funding" | "status" | "updatedAt";
type SortDir = "asc" | "desc";

/** 你不确定结束态字段是什么：这里做成“可配置” + “强兼容” */
const ENDED_STATUSES = [
  "已结束",
  "结束",
  "已完成",
  "完成",
  "终止",
  "关闭",
  "停止",
  "已停止",
  "已关闭",
];

function isEndedStatus(s?: string) {
  if (!s) return false;
  // 精确命中 + 宽松包含（防止出现“已结束（不再更新）”这种）
  return (
    ENDED_STATUSES.includes(s) ||
    ENDED_STATUSES.some((x) => s.includes(x))
  );
}

function statusRank(s?: string) {
  // 用于“状态”排序：进行中最靠前，其次已结束，其余归类为“其他”
  if (s === "进行中") return 0;
  if (isEndedStatus(s)) return 1;
  return 2;
}

function statusColor(s?: string) {
  if (s === "进行中") return "text-emerald-300";
  if (isEndedStatus(s)) return "text-amber-300";
  return "text-[#94A3B8]";
}

function profitColor(p?: string) {
  if (!p) return "text-[#94A3B8]";
  // 简单匹配：高/中/低 或 预期/一般等你后面也能扩展
  if (p.includes("高")) return "text-amber-300";
  if (p.includes("中")) return "text-yellow-300";
  return "text-[#94A3B8]";
}

function parseFundingToNumber(v?: string) {
  // 兼容 "$120M" "$27M" "120M" "27m" "120,000,000" "未知" 等
  if (!v) return Number.NEGATIVE_INFINITY;
  const raw = String(v).trim();
  if (!raw) return Number.NEGATIVE_INFINITY;

  // 提取数值
  const num = Number(raw.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(num)) return Number.NEGATIVE_INFINITY;

  // 单位
  const upper = raw.toUpperCase();
  if (upper.includes("B")) return num * 1_000; // B > M（用 M 作为基准）
  if (upper.includes("M")) return num;
  if (upper.includes("K")) return num / 1_000;
  // 如果没单位，按“数值”处理
  return num;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className="ml-1 inline-flex flex-col leading-none align-middle">
      <svg width="10" height="10" viewBox="0 0 10 10" className="block">
        <path
          d="M5 1 L9 5 H1 Z"
          className={[
            "transition-colors",
            active && dir === "asc" ? "fill-amber-300" : "fill-[#394150]",
          ].join(" ")}
        />
      </svg>
      <svg width="10" height="10" viewBox="0 0 10 10" className="block -mt-[2px]">
        <path
          d="M5 9 L1 5 H9 Z"
          className={[
            "transition-colors",
            active && dir === "desc" ? "fill-amber-300" : "fill-[#394150]",
          ].join(" ")}
        />
      </svg>
    </span>
  );
}

function ThSortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <th className="py-3 px-4 text-left whitespace-nowrap">
      <button
        onClick={onClick}
        className={[
          "inline-flex items-center select-none",
          "text-[12px] tracking-[0.02em] font-medium",
          active ? "text-amber-200" : "text-[#9CA3AF]",
          "hover:text-amber-200 transition-colors",
        ].join(" ")}
      >
        {label}
        <SortIcon active={active} dir={dir} />
      </button>
    </th>
  );
}

function Th({ children, className = "" }: any) {
  return (
    <th
      className={[
        "py-3 px-4 text-left whitespace-nowrap",
        "text-[12px] tracking-[0.02em] font-medium text-[#9CA3AF]",
        className,
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "" }: any) {
  return (
    <td className={["py-4 px-4 align-middle whitespace-nowrap", className].join(" ")}>
      {children}
    </td>
  );
}

export function AirdropTable() {
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
      return;
    }
    setSortDir((d) => (d === "desc" ? "asc" : "desc"));
  };

  const total = projects.length;
  const inProgress = projects.filter((p: any) => p.status === "进行中").length;
  const ended = projects.filter((p: any) => isEndedStatus(p.status)).length;

  const sorted = useMemo(() => {
    const arr = [...projects] as any[];
    const sign = sortDir === "asc" ? 1 : -1;

    arr.sort((a, b) => {
      if (sortKey === "funding") {
        const av = parseFundingToNumber(a.funding);
        const bv = parseFundingToNumber(b.funding);
        return (av - bv) * sign;
      }
      if (sortKey === "updatedAt") {
        const at = Date.parse(a.updatedAt || "");
        const bt = Date.parse(b.updatedAt || "");
        // 无效日期放最后
        const aa = Number.isFinite(at) ? at : -Infinity;
        const bb = Number.isFinite(bt) ? bt : -Infinity;
        return (aa - bb) * sign;
      }
      // status
      const ar = statusRank(a.status);
      const br = statusRank(b.status);
      if (ar !== br) return (ar - br) * sign;

      // 同一档内再按 updatedAt 辅助排序，让列表更稳定
      const at = Date.parse(a.updatedAt || "");
      const bt = Date.parse(b.updatedAt || "");
      return ((Number.isFinite(at) ? at : -Infinity) - (Number.isFinite(bt) ? bt : -Infinity)) * -1;
    });

    return arr;
  }, [sortKey, sortDir]);

  return (
    <div className="w-full">
      {/* 页面标题 & 说明（更产品化） */}
      <div className="mb-6">
        <h1 className="text-3xl tracking-[0.12em] text-[#E5E7EB]">空投项目</h1>
        <p className="mt-2 text-sm text-[#9CA3AF]">
          聚合优质空投信息，筛掉噪音，只保留可执行的任务线索。
        </p>
      </div>

      <div className="rounded-2xl border border-[#1F2A44] bg-[#0B1220] shadow-[0_0_40px_rgba(255,184,0,0.06)] w-full">
        {/* 头部栏：标题 + 统计 */}
        <div className="flex items-start gap-4 px-6 pt-6">
          <div className="flex-1">
            <div className="flex items-baseline gap-3">
              <div className="text-xl font-semibold text-[#E5E7EB]">空投项目</div>
              <div className="text-xs tracking-[0.22em] text-amber-300/80">
                AIRDROP INDEX
              </div>
            </div>
            <div className="mt-2 text-sm text-[#9CA3AF]">聚合优质空投信息。</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-[#1F2A44] bg-[#0B1220] px-4 py-3 min-w-[92px]">
              <div className="text-[11px] text-[#9CA3AF]">总项目</div>
              <div className="mt-1 text-xl font-semibold text-[#E5E7EB]">{total}</div>
            </div>

            <div className="rounded-xl border border-emerald-800/40 bg-[#0B1220] px-4 py-3 min-w-[92px]">
              <div className="text-[11px] text-[#9CA3AF]">进行中</div>
              <div className="mt-1 text-xl font-semibold text-emerald-300">{inProgress}</div>
            </div>

            <div className="rounded-xl border border-amber-800/40 bg-[#0B1220] px-4 py-3 min-w-[92px]">
              <div className="text-[11px] text-[#9CA3AF]">已结束</div>
              <div className="mt-1 text-xl font-semibold text-amber-300">{ended}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-[#1F2A44]" />

        {/* 表格：外层有 bg，内层滚动，不露白 */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1250px] border-collapse">
            <thead className="bg-[#0B1220]">
              <tr className="border-b border-[#1F2A44]">
                <Th className="pl-6">名称</Th>
                <Th>类别</Th>

                <ThSortButton
                  label="融资"
                  active={sortKey === "funding"}
                  dir={sortDir}
                  onClick={() => toggleSort("funding")}
                />

                <Th>投资机构</Th>
                <Th>成本</Th>
                <Th>建议上号</Th>

                <ThSortButton
                  label="状态"
                  active={sortKey === "status"}
                  dir={sortDir}
                  onClick={() => toggleSort("status")}
                />

                <ThSortButton
                  label="更新"
                  active={sortKey === "updatedAt"}
                  dir={sortDir}
                  onClick={() => toggleSort("updatedAt")}
                />

                <Th>利润</Th>
                <Th>任务链接</Th>
                <Th className="pr-6">备注</Th>
              </tr>
            </thead>

            <tbody>
              {sorted.map((p: any) => (
                <tr
                  key={p.name}
                  className="border-b border-[#111827] hover:bg-[#0F172A] transition-colors"
                >
                  <Td className="pl-6 font-medium text-[#E5E7EB]">{p.name}</Td>
                  <Td className="text-[#9CA3AF]">{p.category}</Td>

                  <Td className="text-amber-300 font-semibold">{p.funding}</Td>

                  <Td className="text-[#9CA3AF]">{p.investors}</Td>
                  <Td className="text-[#9CA3AF]">{p.cost}</Td>
                  <Td className="text-[#9CA3AF]">{p.accounts}</Td>

                  <Td className={statusColor(p.status)}>{p.status}</Td>

                  <Td className="text-[#9CA3AF]">{p.updatedAt}</Td>

                  <Td className={["font-semibold", profitColor(p.profit)].join(" ")}>
                    {p.profit}
                  </Td>

                  <Td>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-200 hover:text-amber-100 underline underline-offset-4 decoration-amber-400/40 hover:decoration-amber-300 transition-colors"
                    >
                      打开
                    </a>
                  </Td>

                  <Td className="pr-6 text-[#9CA3AF]">{p.note}</Td>
                </tr>
              ))}

              {/* 空数据兜底 */}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-[#9CA3AF]">
                    暂无项目数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 text-xs text-[#64748B]">
          本站仅提供信息参考，不构成任何投资建议，请自行研究。
        </div>
      </div>
    </div>
  );
}