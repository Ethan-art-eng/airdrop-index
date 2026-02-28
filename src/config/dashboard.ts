export type DashboardKey = "airdrop" | "earn" | "guide";

export type DashboardNavItem = {
  key: DashboardKey;
  label: string;
  icon: string; // 终端风用 ASCII/emoji 都行
  description?: string;
};

export const dashboardNav: DashboardNavItem[] = [
  { key: "airdrop", label: "空投项目", icon: "◎", description: "Airdrop Intelligence" },
  { key: "earn", label: "交易所理财", icon: "◈", description: "Exchange Earn" },
  { key: "guide", label: "币圈教程", icon: "◆", description: "Crypto Guides" },
];