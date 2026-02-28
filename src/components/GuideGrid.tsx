import { guideItems } from "@/data/guides";

export function GuideGrid() {
  const levelColor = (lv: string) =>
    lv === "高级" ? "text-red-400" : lv === "进阶" ? "text-yellow-300" : "text-green-400";

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {guideItems.map((g) => (
        <div key={g.title} className="border border-[#1F2A44] bg-[#0F172A] p-5 hover:bg-[#111C33] transition">
          <div className="flex items-start justify-between gap-4">
            <div className="font-semibold leading-snug">{g.title}</div>
            <div className={`text-xs ${levelColor(g.level)}`}>{g.level}</div>
          </div>
          <div className="mt-3 text-xs text-[#9CA3AF]">发布时间：{g.publishedAt}</div>

          <div className="mt-4">
            <a
              href={g.href ?? "#"}
              className="inline-block text-sm text-[#9CA3AF] hover:text-[#F59E0B]"
            >
              阅读 →
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}