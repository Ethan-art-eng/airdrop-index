import { projects } from "@/data/projects";

export function AirdropTable() {
  const statusColor = (s: string) =>
    s === "进行中"
      ? "text-emerald-400"
      : s === "传闻"
      ? "text-amber-400"
      : "text-gray-400";

  const profitColor = (p: string) =>
    p.includes("高")
      ? "text-amber-300"
      : p.includes("中")
      ? "text-yellow-300"
      : "text-gray-300";

  return (
    <section className="rounded-2xl border border-[#1F2A44] bg-[#0B1220] shadow-[0_0_40px_rgba(255,184,0,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] text-sm border-collapse">

          {/* ===== 表头 ===== */}
          <thead className="text-[12px] tracking-tight text-[#9CA3AF] bg-[#0F172A] border-b border-[#1F2A44]">
            <tr className="h-12">
              <th className="pl-6 text-left font-medium whitespace-nowrap">名称</th>
              <th className="px-4 text-left font-medium whitespace-nowrap">类别</th>
              <th className="px-4 text-left font-medium whitespace-nowrap">融资</th>
              <th className="px-4 text-left font-medium whitespace-nowrap">投资机构</th>
              <th className="px-4 text-left font-medium whitespace-nowrap">成本</th>
              <th className="px-4 text-left font-medium whitespace-nowrap">建议上号</th>
              <th className="px-4 text-left font-medium whitespace-nowrap">状态</th>
              <th className="px-4 text-left font-medium whitespace-nowrap">更新</th>
              <th className="px-4 text-left font-medium whitespace-nowrap">利润</th>
              <th className="px-4 text-left font-medium whitespace-nowrap">任务链接</th>
              <th className="pr-6 text-left font-medium whitespace-nowrap">备注</th>
            </tr>
          </thead>

          {/* ===== 表体 ===== */}
          <tbody className="text-[#E6EDF3]">
            {projects.map((p) => (
              <tr
                key={p.name}
                className="border-b border-[#111827] odd:bg-[#0B1220] even:bg-[#0F172A] hover:bg-[#131D2B] transition-colors duration-150"
              >
                {/* 名称 */}
                <td className="pl-6 py-4 align-middle font-medium whitespace-nowrap">
                  {p.name}
                </td>

                {/* 类别 */}
                <td className="px-4 py-4 text-[#9CA3AF] whitespace-nowrap">
                  {p.category ?? "-"}
                </td>

                {/* 融资（金色强调） */}
                <td className="px-4 py-4 font-semibold text-amber-300 whitespace-nowrap">
                  {p.funding ?? "-"}
                </td>

                {/* 投资机构 */}
                <td className="px-4 py-4 text-[#9CA3AF] whitespace-nowrap">
                  {p.investors ?? "-"}
                </td>

                {/* 成本 */}
                <td className="px-4 py-4 text-[#9CA3AF] whitespace-nowrap">
                  {p.cost ?? "-"}
                </td>

                {/* 建议上号（轻金色） */}
                <td className="px-4 py-4 text-yellow-200 whitespace-nowrap">
                  {p.accounts ?? "-"}
                </td>

                {/* 状态 */}
                <td className={`px-4 py-4 font-medium whitespace-nowrap ${statusColor(p.status ?? "")}`}>
                  {p.status ?? "-"}
                </td>

                {/* 更新 */}
                <td className="px-4 py-4 text-[#9CA3AF] whitespace-nowrap">
                  {p.updatedAt ?? "-"}
                </td>

                {/* 利润 */}
                <td className={`px-4 py-4 font-semibold whitespace-nowrap ${profitColor(p.profit ?? "-")}`}>
                  {p.profit ?? "-"}
                </td>

                {/* 任务链接（金色按钮风） */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-400/30 bg-amber-400/5 px-3 py-1 text-amber-300 hover:bg-amber-400/10 hover:border-amber-300 transition"
                    >
                      打开 →
                    </a>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>

                {/* 备注 */}
                <td className="pr-6 py-4 text-[#9CA3AF]">
                  <div className="max-w-[320px] whitespace-normal leading-5">
                    {p.note ?? "-"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 底部提示 */}
      <div className="px-6 py-4 text-xs text-[#6B7280] bg-[#0F172A] border-t border-[#1F2A44]">
        信息仅供参考，不构成投资建议。请自行研究与控制风险。
      </div>
    </section>
  );
}