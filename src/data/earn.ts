export type EarnItem = {
  platform: string; // 平台名称
  productType: string; // 理财产品类型
  apy: string; // 预期年化 APY（字符串更灵活）
  risk: "低" | "中" | "高";
  url: string; // 直达链接
};

export const earnItems: EarnItem[] = [
  {
    platform: "Binance",
    productType: "活期理财",
    apy: "2% - 6%",
    risk: "低",
    url: "https://www.binance.com/zh-CN/earn",
  },
  {
    platform: "OKX",
    productType: "定期 / 结构化",
    apy: "4% - 12%",
    risk: "中",
    url: "https://www.okx.com/zh-hans/earn",
  },
];