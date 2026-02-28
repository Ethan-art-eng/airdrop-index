import { useMemo, useState } from "react";
import { projects } from "@/data/projects";

type SortKey = "funding" | "status" | "updatedAt";
type SortDir = "asc" | "desc";

function isEndedStatus(s: string) {
  // 你不确定“结束态”写法，所以这里做容错：
  // 只要不是“进行中”，都当作“已结束”
  return s !== "进行中";
}

function parseFundingToNumber(v: string) {
  // 支持：$120M / 120M / 27m / 3.2B / 800K / 空
  // 返回统一数值（用美元为单位的“数量级”近似即可用于排序）
  if (!v) return -1;
  const s = String(v).trim().toUpperCase().replace(/\s/g, "");
  const num = parseFloat(s.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(num)) return -1;

  if (s.includes("B")) return num * 1_000_000_000;
  if (s.includes("M")) return num * 1_000_000;
  if (s.includes("K")) return num * 1_000;

  // 纯数字
  return num;
}

function statusBadge(status: "进行中" | "已结束") {
  if (status === "进行中") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-800/40 bg-emerald-900/10 px-3 py-1 text-xs text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        进行中
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-800/40 bg-amber-900/10 px-3 py-1 text-xs text-amber-300">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      已结束
    </span>
  );
}

function SortIcon({
  active,
  dir,
}: {
  active: boolean;
  dir: SortDir;
}) {
  // 更醒目的箭头：未激活灰色，激活金色；方向上下
  if (!active) {
    return (
      <span className="ml-1 inline-flex items-center text-[10px] text-[#4B5563]">
        ▲▼
      </span>
    );
  }
  return (
    <span className="ml-1 inline-flex items-center text-[10px] text-amber-300">
      {dir === "asc" ? "▲" : "▼"}
    </span>
  );
}

function ThButton({
  children,
  onClick,
  active,
  dir,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  dir: SortDir;
  className?: string;
}) {
  return (
    <th className={`py-3 px-4 text-left ${className}`}>
      <button
        onClick={onClick}
        className={`group inline-flex items-center font-medium text-[12px] tracking-[0.06em] ${
          active ? "text-amber-200" : "text-[#9CA3AF]"
        } hover:text-amber-200 transition-colors`}
        type="button"
      >
        {children}
        <SortIcon active={active} dir={dir} />
      </button>
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-4 px-4 align-middle ${className}`}>{children}</td>;
}

export function AirdropTable() {
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const normalized = useMemo(() => {
    return projects.map((p: any) => {
      const status: "进行中" | "已结束" = isEndedStatus(String(p.status || "")) ? "已结束" : "进行中";
      return {
        ...p,
        _statusNorm: status,
        _fundingNum: parseFundingToNumber(String(p.funding ?? "")),
      };
    });
  }, []);

  const stats = useMemo(() => {
    const total = normalized.length;
    const inProgress = normalized.filter((p: any) => p._statusNorm === "进行中").length;
    const ended = total - inProgress;
    return { total, inProgress, ended };
  }, [normalized]);

  const sorted = useMemo(() => {
    const arr = [...normalized];

    arr.sort((a: any, b: any) => {
      let av: any;
      let bv: any;

      if (sortKey === "funding") {
        av = a._fundingNum;
        bv = b._fundingNum;
      } else if (sortKey === "status") {
        // 进行中排前（desc时），已结束排后
        av = a._statusNorm === "进行中" ? 1 : 0;
        bv = b._statusNorm === "进行中" ? 1 : 0;
      } else {
        // updatedAt：按字符串日期排序（YYYY-MM-DD 形式）
        av = String(a.updatedAt ?? "");
        bv = String(b.updatedAt ?? "");
      }

      if (av === bv) return 0;
      const res = av > bv ? 1 : -1;
      return sortDir === "asc" ? res : -res;
    });

    return arr;
  }, [normalized, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("desc");
  };

  return (
    <div className="w-full">
      {/* 只保留一个标题 */}
      <div className="mb-6">
        <h1 className="text-3xl tracking-[0.12em] text-[#E5E7EB]">空投项目</h1>
        <p className="mt-2 text-sm text-[#9CA3AF]">
          聚合优质空投信息，筛掉噪音，只保留可执行的任务线索。
        </p>
      </div>

      {/* 卡片：右边不留白的关键是外层容器本身要 w-full 且不固定 min-width */}
      <section className="w-full rounded-2xl border border-[#1F2A44] bg-[#0B1220] shadow-[0_0_40px_rgba(255,184,0,0.06)]">
        {/* 统计栏（3个：总项目/进行中/已结束） */}
        <div className="flex w-full items-start justify-end gap-3 px-6 pt-6">
          <div className="rounded-xl border border-[#1F2A44] bg-[#0B1220] px-4 py-3 min-w-[92px]">
            <div className="text-[11px] text-[#9CA3AF]">总项目</div>
            <div className="mt-1 text-xl font-semibold text-[#E5E7EB]">{stats.total}</div>
          </div>

          <div className="rounded-xl border border-emerald-800/40 bg-[#0B1220] px-4 py-3 min-w-[92px]">
            <div className="text-[11px] text-[#9CA3AF]">进行中</div>
            <div className="mt-1 text-xl font-semibold text-emerald-300">{stats.inProgress}</div>
          </div>

          <div className="rounded-xl border border-amber-800/40 bg-[#0B1220] px-4 py-3 min-w-[92px]">
            <div className="text-[11px] text-[#9CA3AF]">已结束</div>
            <div className="mt-1 text-xl font-semibold text-amber-300">{stats.ended}</div>
          </div>
        </div>

        <div className="mt-5 border-t border-[#1F2A44]" />

        {/* 表格 */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-[#0B1220]">
              <tr className="border-b border-[#1F2A44]">
                <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.06em] text-[#9CA3AF]">
                  名称
                </th>
                <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.06em] text-[#9CA3AF]">
                  类别
                </th>

                <ThButton
                  onClick={() => toggleSort("funding")}
                  active={sortKey === "funding"}
                  dir={sortDir}
                >
                  融资
                </ThButton>

                <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.06em] text-[#9CA3AF]">
                  投资机构
                </th>
                <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.06em] text-[#9CA3AF]">
                  成本
                </th>
                <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.06em] text-[#9CA3AF]">
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

                <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.06em] text-[#9CA3AF]">
                  利润
                </th>
                <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.06em] text-[#9CA3AF]">
                  任务链接
                </th>
                <th className="py-3 px-4 text-left font-medium text-[12px] tracking-[0.06em] text-[#9CA3AF]">
                  备注
                </th>
              </tr>
            </thead>

            <tbody>
              {sorted.map((p: any) => (
                <tr
                  key={p.name}
                  className="border-b border-[#111827] hover:bg-[#0F1A2B] transition-colors"
                >
                  <Td className="font-semibold text-[#E5E7EB]">{p.name}</Td>
                  <Td className="text-[#9CA3AF]">{p.category ?? "-"}</Td>
                  <Td className="font-semibold text-amber-300">{p.funding ?? "-"}</Td>
                  <Td className="text-[#9CA3AF]">{p.investors ?? "-"}</Td>
                  <Td className="text-[#9CA3AF]">{p.cost ?? "-"}</Td>
                  <Td className="text-[#9CA3AF]">{p.accounts ?? "-"}</Td>
                  <Td>{statusBadge(p._statusNorm)}</Td>
                  <Td className="text-[#9CA3AF]">{p.updatedAt ?? "-"}</Td>
                  <Td className="font-semibold text-amber-200">{p.profit ?? "-"}</Td>
                  <Td>
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-amber-300 hover:text-amber-200 underline underline-offset-4 decoration-amber-300/40"
                      >
                        打开
                      </a>
                    ) : (
                      <span className="text-[#4B5563]">-</span>
                    )}
                  </Td>
                  <Td className="text-[#9CA3AF]">{p.note ?? "-"}</Td>
                </tr>
              ))}

              {sorted.length === 0 && (
                <tr>
                  <td className="py-10 px-6 text-center text-[#6B7280]" colSpan={11}>
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 text-xs text-[#6B7280]">
          本站仅提供信息参考，不构成任何投资建议，请自行研究。
        </div>
      </section>
    </div>
  );
}