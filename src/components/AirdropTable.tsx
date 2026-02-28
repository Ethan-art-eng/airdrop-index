import { projects } from "@/data/projects";
export function AirdropTable() {
  return (
    <section className="rounded-2xl border border-[#1F2A44] bg-[#0F172A] shadow-lg">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#1F2A44]">
        <table className="w-full text-sm border-collapse">
          
            <thead className="sticky top-0 bg-[#0F172A] z-10">
              <tr>
                <th className="py-4 pl-6 text-left">名称</th>
                <th className="text-left">类别</th>
                <th className="text-left">融资</th>
                <th className="text-left">投资机构</th>
                <th className="text-left">成本</th>
                <th className="text-left">建议上号</th>
                <th className="text-left">状态</th>
                <th className="text-left">更新</th>
                <th className="text-left">利润</th>
                <th className="text-left">任务链接</th>
                <th className="text-left pr-6">备注</th>
              </tr>
            </thead>

          <tbody> 
            {projects.map((p) => (
              <tr
                key={p.name}
                className="border-b border-[#111827] hover:bg-[#1A2332] transition-colors duration-150"
              >
                <td className="py-4 pl-6 font-medium text-[#E6EDF3]">{p.name}</td>
                <td className="text-[#9CA3AF]">{p.category}</td>
                <td className="text-[#FACC15]">{p.funding}</td>
                <td className="text-[#9CA3AF]">{p.investors}</td>
                <td className="text-[#9CA3AF]">{p.cost}</td>
                <td className="text-[#9CA3AF]">{p.accounts}</td>
                <td className="text-[#22C55E]">{p.status}</td>
                <td className="text-[#9CA3AF]">{p.updatedAt}</td>
                <td className="text-[#F59E0B] font-semibold">{p.profit}</td>
                <td>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#3B82F6] hover:underline"
                  >
                    打开
                  </a>
                </td>
                <td className="text-[#9CA3AF] pr-6">{p.note}</td>
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