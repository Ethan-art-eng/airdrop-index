import { projects } from "@/data/projects";

export function AirdropTable() {
  // 风险/状态/利润的显示颜色（按你现在的中文值来映射）
  const statusColor = (s: string) =>
    s === "进行中"
      ? "text-green-400"
      : s === "传闻"
      ? "text-yellow-300"
      : "text-gray-400";

  const profitColor = (p: string) =>
    p.includes("高") ? "text-yellow-300" : p.includes("中") ? "text-yellow-200" : "text-gray-300";

  const fundingColor = (f: string) => (f.startsWith("$") ? "text-yellow-300" : "text-gray-200");

  return (
    <section className="rounded-2xl border border-[#1F2A44] bg-[#0F172A] shadow-lg overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#1F2A44]">
        <table className="w-full min-w-[1100px] text-sm border-collapse">
          {/* 表头：更紧凑 + 更对齐 */}
          <thead className="text-[12px] tracking-tight text-[#A7B0C0] bg-[#0B1220] border-b border-[#1F2A44]">
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

          {/* 表体：斑马纹 + hover + 统一 padding/对齐 */}
          <tbody className="text-[#E6EDF3]">
            {projects.map((p) => (
              <tr
                key={p.name}
                className="border-b border-[#111827] odd:bg-[#0F172A] even:bg-[#0D1524] hover:bg-[#1A2332] transition-colors"
              >
                <td className="pl-6 py-4 align-middle font-medium whitespace-nowrap">{p.name}</td>

                <td className="px-4 py-4 align-middle text-[#9CA3AF] whitespace-nowrap">
                  {p.category ?? "-"}
                </td>

                <td className={`px-4 py-4 align-middle font-semibold whitespace-nowrap ${fundingColor(p.funding ?? "-")}`}>
                  {p.funding ?? "-"}
                </td>

                <td className="px-4 py-4 align-middle text-[#9CA3AF] whitespace-nowrap">
                  {p.investors ?? "-"}
                </td>

                <td className="px-4 py-4 align-middle text-[#9CA3AF] whitespace-nowrap">
                  {p.cost ?? "-"}
                </td>

                <td className="px-4 py-4 align-middle text-[#9CA3AF] whitespace-nowrap">
                  {p.accounts ?? "-"}
                </td>

                <td className={`px-4 py-4 align-middle font-medium whitespace-nowrap ${statusColor(p.status ?? "")}`}>
                  {p.status ?? "-"}
                </td>

                <td className="px-4 py-4 align-middle text-[#9CA3AF] whitespace-nowrap">
                  {p.updatedAt ?? "-"}
                </td>

                <td className={`px-4 py-4 align-middle font-semibold whitespace-nowrap ${profitColor(p.profit ?? "-")}`}>
                  {p.profit ?? "-"}
                </td>

                <td className="px-4 py-4 align-middle whitespace-nowrap">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-[#1F2A44] bg-[#0B1220] px-3 py-1 text-[#9CA3AF] hover:text-[#F59E0B] hover:border-[#334155] transition-colors"
                    >
                      打开 →
                    </a>
                  ) : (
                    <span className="text-[#9CA3AF]">-</span>
                  )}
                </td>

                <td className="pr-6 py-4 align-middle text-[#9CA3AF]">
                  {/* 备注允许换行，看起来更舒服 */}
                  <div className="max-w-[360px] whitespace-normal leading-5">
                    {p.note ?? "-"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 页脚提示：更产品化一点 */}
      <div className="px-6 py-4 text-xs text-[#7C8596] bg-[#0B1220]">
        信息仅供参考，不构成投资建议。请自行研究与控制风险。
      </div>
    </section>
  );
}