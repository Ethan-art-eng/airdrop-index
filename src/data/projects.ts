export type Project = {
  name: string;
  chain: string;
  stage: string; // 用 stage，不用 type
  risk: "高" | "中" | "低";
  cost: string;
  score: number;
  url: string;


  status: "进行中" | "已结束" | "传闻";
  updatedAt: string; // "2026-02-26"
  tags: string[];    // ["积分", "测试网"]

};

export const projects: Project[] = [
  {
    name: "LayerX",
    chain: "ETH",
    stage: "积分阶段",
    risk: "中",
    cost: "低",
    score: 99999,
    url: "https://example.com",

    status: "进行中",
    updatedAt: "2026-02-26",
    tags: ["积分", "交互"],
  },
  {
    name: "SolBridge",
    chain: "SOL",
    stage: "测试网",
    risk: "低",
    cost: "极低",
    score: 65,
    url: "https://example.com",

    status: "进行中",
    updatedAt: "2026-02-26",
    tags: ["测试网", "任务"],
  },
  {
    name: "OmniAI",
    chain: "ETH",
    stage: "追溯空投",
    risk: "高",
    cost: "高",
    score: 82,
    url: "https://example.com",

    status: "传闻",
    updatedAt: "2026-02-20",
    tags: ["追溯", "资金门槛高"],
  },
];