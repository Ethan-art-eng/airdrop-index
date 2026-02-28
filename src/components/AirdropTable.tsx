import { projects } from "@/data/projects";

export function AirdropTable() {
  const riskColor = (r: string) =>
    r === "高" ? "text-red-400" : r === "中" ? "text-yellow-300" : "text-green-400";

  const statusColor = (s: string) =>
    s === "进行中" ? "text-green-400" : s === "传闻" ? "text-yellow-300" : "text-gray-400";

  return (
    <section className="border border-[#1F2A44] bg-[#0F172A]">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#1F2A44]">
        <table className="w-full text-sm border-collapse">
          <thead className="text-[#9CA3AF] border-b border-[#1F2A44]">
            <tr>
              <th className="text-left py-3 pl-4">项目名称</th>
              <th className="text-left">公链</th>
              <th className="text-left">阶段</th>
              <th className="text-left">风险等级</th>
              <th className="text-left">参与成本</th>
              <th className="text-left">综合评分</th>
              <th className="text-left">状态</th>
              <th className="text-left">更新</th>
              <th className="text-left">标签</th>
              <th className="text-left pr-4">访问链接</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p) => (
              <tr key={p.name} className="border-b border-[#0A0F1A] hover:bg-[#111C33]">
                <td className="py-4 pl-4 font-medium">{p.name}</td>
                <td>{p.chain}</td>
                <td>{p.stage}</td>
                <td className={riskColor(p.risk)}>{p.risk}</td>
                <td>{p.cost}</td>
                <td className="text-[#F59E0B] font-semibold">{p.score}</td>
                <td className={statusColor(p.status)}>{p.status}</td>
                <td className="text-[#9CA3AF]">{p.updatedAt}</td>
                <td className="text-[#9CA3AF]">{p.tags.join(" / ")}</td>
                <td className="pr-4">
                  <a
                    href={p.url}
                    target="_blank"
                    className="text-[#9CA3AF] hover:text-[#F59E0B]"
                    rel="noreferrer"
                  >
                    打开 →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 text-xs text-[#9CA3AF]">
        本站仅提供信息参考，不构成任何投资建议，请自行研究。
      </div>
    </section>
  );
}