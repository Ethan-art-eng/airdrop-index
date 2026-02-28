import { earnItems } from "@/data/earn";

export function EarnTable() {
  const riskColor = (r: string) =>
    r === "高" ? "text-red-400" : r === "中" ? "text-yellow-300" : "text-green-400";

  return (
    <section className="border border-[#1F2A44] bg-[#0F172A]">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#1F2A44]">
        <table className="w-full text-sm border-collapse">
          <thead className="text-[#9CA3AF] border-b border-[#1F2A44]">
            <tr>
              <th className="text-left py-3 pl-4">平台名称</th>
              <th className="text-left">理财产品类型</th>
              <th className="text-left">预期年化 APY</th>
              <th className="text-left">风险提示</th>
              <th className="text-left pr-4">直达链接</th>
            </tr>
          </thead>

          <tbody>
            {earnItems.map((it) => (
              <tr key={`${it.platform}-${it.productType}`} className="border-b border-[#0A0F1A] hover:bg-[#111C33]">
                <td className="py-4 pl-4 font-medium">{it.platform}</td>
                <td>{it.productType}</td>
                <td className="text-[#F59E0B] font-semibold">{it.apy}</td>
                <td className={riskColor(it.risk)}>{it.risk}</td>
                <td className="pr-4">
                  <a
                    href={it.url}
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
        APY 为预期值，可能随平台活动与资金费率变化。
      </div>
    </section>
  );
}