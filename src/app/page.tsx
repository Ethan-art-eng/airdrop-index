import { projects } from "@/data/projects";

export default function Home() {

  const riskColor = (r: string) =>
    r === "高" ? "text-red-400" : r === "中" ? "text-yellow-300" : "text-green-400";

  return (
    <main className="min-h-screen bg-[#0A0F1A] text-[#E5E7EB] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-[#1F2A44] pb-5">
          <h1 className="text-2xl tracking-[0.22em]">
            空投指数 <span className="ml-3 text-sm text-[#9CA3AF]">终端版</span>
          </h1>
          <p className="mt-2 text-sm text-[#9CA3AF]">
            精选空投资讯，过滤噪音，只保留有效信号。
          </p>
        </header>
        <section className="border border-[#1F2A44] bg-[#0F172A]">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#1F2A44]">
            <table className="min-w-[900px] text-sm border-collapse">
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
                    <td
                      className={
                        p.status === "进行中"
                          ? "text-green-400"
                          : p.status === "传闻"
                          ? "text-yellow-300"
                          : "text-gray-400"
                      }
                    >
                      {p.status}
                    </td>
                    <td className="text-[#9CA3AF]">{p.updatedAt}</td>

                    <td className="text-[#9CA3AF]">{p.tags.join(" / ")}</td>
                    <td className="pr-4">
                      <a href={p.url} target="_blank" className="text-[#9CA3AF] hover:text-[#F59E0B]">
                        打开 →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 text-xs text-[#9CA3AF] flex justify-between border-t border-[#1F2A44]">
            <span>本站仅提供信息参考，不构成任何投资建议，请自行研究。</span>
          </div>
        </section>
      </div>
    </main>
  );
}