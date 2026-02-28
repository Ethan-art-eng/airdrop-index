import { useMemo, useState } from "react";
import { projects } from "@/data/projects";

type SortKey = "funding" | "status" | "updatedAt";
type SortDir = "asc" | "desc";

function parseFunding(v: string): number {
  // 支持: "$120M" "$27M" "120M" "2.5B" "—"
  if (!v) return -Infinity;
  const s = v.toString().trim().toUpperCase().replaceAll(",", "");
  if (s === "-" || s === "—" || s === "N/A") return -Infinity;

  const m = s.match(/([0-9]*\.?[0-9]+)\s*([KMBT])?/i);
  if (!m) return -Infinity;

  const num = Number(m[1]);
  const unit = (m[2] || "").toUpperCase();

  const mult =
    unit === "K" ? 1e3 : unit === "M" ? 1e6 : unit === "B" ? 1e9 : unit === "T" ? 1e12 : 1;

  return num * mult;
}

function parseDate(v: string): number {
  // 支持: "2026-02-28" / "2026/02/28" / "—"
  if (!v) return -Infinity;
  const s = v.toString().trim();
  if (s === "-" || s === "—" || s === "N/A") return -Infinity;
  const t = Date.parse(s.replaceAll("/", "-"));
  return Number.isFinite(t) ? t : -Infinity;
}

function statusRank(s: string): number {
  // 你可以按产品逻辑调整排序优先级
  const map: Record<string, number> = {
    "进行中": 3,
    "传闻": 2,
    "观察中": 1,
    "已结束": 0,
  };
  return map[s] ?? 1;
}

export function AirdropTable() {
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const stats = useMemo(() => {
    const total = projects.length;
    const ongoing = projects.filter((p) => p.status === "进行中").length;
    const rumor = projects.filter((p) => p.status === "传闻").length;
    const others = total - ongoing - rumor;
    return { total, ongoing, rumor, others };
  }, []);

  const sorted = useMemo(() => {
    const arr = [...projects];

    arr.sort((a: any, b: any) => {
      let av = 0;
      let bv = 0;

      if (sortKey === "funding") {
        av = parseFunding(a.funding);
        bv = parseFunding(b.funding);
      } else if (sortKey === "status") {
        av = statusRank(a.status);
        bv = statusRank(b.status);
      } else if (sortKey === "updatedAt") {
        av = parseDate(a.updatedAt);
        bv = parseDate(b.updatedAt);
      }

      const diff = av - bv;
      return sortDir === "asc" ? diff : -diff;
    });

    return arr;
  }, [sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
      return;
    }
    setSortDir((d) => (d === "desc" ? "asc" : "desc"));
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return <span className="ml-1 opacity-40">↕</span>;
    return <span className="ml-1">{sortDir === "desc" ? "↓" : "↑"}</span>;
  };

  const statusColor = (s: string) =>
    s === "进行中" ? "text-emerald-400" : s === "传闻" ? "text-amber-300" : "text-gray-400";

  const profitColor = (p: string) =>
    p?.includes("高") ? "text-amber-300" : p?.includes("中") ? "text-yellow-300" : "text-gray-300";

  return (
    <section className="rounded-2xl border border-[#1F2A44] bg-[#0B1220] shadow-[0_0_40px_rgba(255,184,0,0.08)]">
      {/* 顶部区：标题 + 统计 */}
      <div className="px-6 pt-6 pb-4 border-b border-[#1F2A44]">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl tracking-[0.08em] text-[#E6EDF3]">
              空投项目 <span className="text-xs ml-2 text-amber-200/70">Airdrop Index</span>
            </h2>
            <p className="mt-2 text-sm text-[#9CA3AF]">
              聚合优质空投信息。
            </p>
          </div>

          {/* 统计栏 */}
          <div className="flex gap-3 flex-wrap">
            <StatCard label="总项目" value={stats.total} />
            <StatCard label="进行中" value={stats.ongoing} accent="emerald" />
            <StatCard label="传闻" value={stats.rumor} accent="amber" />
            <StatCard label="其他" value={stats.others} />
          </div>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] text-sm border-collapse">
          <thead className="bg-[#0B1220]">
            <tr className="text-[#9CA3AF] border-b border-[#1F2A44]">
              <Th>名称</Th>
              <Th>类别</Th>

              {/* 融资：可排序 */}
              <ThButton onClick={() => toggleSort("funding")}>
                融资{sortIcon("funding")}
              </ThButton>

              <Th>投资机构</Th>
              <Th>成本</Th>
              <Th>建议上号</Th>

              {/* 状态：可排序 */}
              <ThButton onClick={() => toggleSort("status")}>
                状态{sortIcon("status")}
              </ThButton>

              {/* 更新：可排序 */}
              <ThButton onClick={() => toggleSort("updatedAt")}>
                更新{sortIcon("updatedAt")}
              </ThButton>

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
                <Td className="font-medium text-[#E6EDF3]">{p.name}</Td>
                <Td className="text-[#9CA3AF]">{p.category}</Td>
                <Td className="text-amber-300 font-semibold">{p.funding}</Td>
                <Td className="text-[#9CA3AF]">{p.investors}</Td>
                <Td className="text-[#9CA3AF]">{p.cost}</Td>
                <Td className="text-[#9CA3AF]">{p.accounts}</Td>
                <Td className={statusColor(p.status)}>{p.status}</Td>
                <Td className="text-[#9CA3AF]">{p.updatedAt}</Td>
                <Td className={`${profitColor(p.profit)} font-semibold`}>{p.profit}</Td>
                <Td>
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-300 hover:text-amber-200 underline underline-offset-4"
                    >
                      打开
                    </a>
                  ) : (
                    <span className="text-[#64748B]">—</span>
                  )}
                </Td>
                <Td className="pr-6 text-[#9CA3AF]">{p.note ?? "—"}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 底部提示 */}
      <div className="px-6 py-4 text-xs text-[#64748B]">
        本站仅提供信息参考，不构成任何投资建议，请自行研究。
      </div>
    </section>
  );
}

/** 小组件：统计卡片 */
function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "amber" | "emerald";
}) {
  const accentCls =
    accent === "amber"
      ? "border-amber-300/30 text-amber-200"
      : accent === "emerald"
      ? "border-emerald-400/30 text-emerald-200"
      : "border-[#1F2A44] text-[#E6EDF3]";

  return (
    <div
      className={`rounded-xl border ${accentCls} bg-[#0D1117]/40 px-3 py-2 min-w-[92px]`}
    >
      <div className="text-[11px] tracking-wide text-[#9CA3AF]">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

/** 表头：普通 */
function Th({ children, className = "" }: any) {
  return (
    <th
      className={`py-3 px-4 text-left font-medium text-[12px] tracking-[0.06em] ${className}`}
    >
      {children}
    </th>
  );
}

/** 表头：可点击排序 */
function ThButton({ children, onClick, className = "" }: any) {
  return (
    <th className={`py-3 px-4 text-left ${className}`}>
      <button
        onClick={onClick}
        className="font-medium text-[12px] tracking-[0.06em] text-[#9CA3AF] hover:text-amber-200 transition-colors"
      >
        {children}
      </button>
    </th>
  );
}

function Td({ children, className = "" }: any) {
  return <td className={`py-4 px-4 align-middle ${className}`}>{children}</td>;
}