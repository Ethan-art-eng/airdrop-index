export type GuideItem = {
  title: string;
  level: "入门" | "进阶" | "高级";
  publishedAt: string; // "2026-02-28"
  href?: string; // 未来可以做站内详情页或外链
};

export const guideItems: GuideItem[] = [
  {
    title: "新手必读：现货 / 合约 / 杠杆一次讲清楚",
    level: "入门",
    publishedAt: "2026-02-28",
    href: "#",
  },
  {
    title: "如何看链上数据：常用指标与避坑",
    level: "进阶",
    publishedAt: "2026-02-28",
    href: "#",
  },
];