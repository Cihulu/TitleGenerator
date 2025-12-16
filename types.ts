
export interface GeneratedTitle {
  title: string;
  reasoning: string;
}

export interface GenerationResult {
  titles: GeneratedTitle[];
  keywordsCn: string[];
  keywordsEn: string[];
}

export interface TitleState {
  content: string;
  purpose: string;
  additionalRequirements: string;
  isGenerating: boolean;
  results: GeneratedTitle[];
  keywordsCn: string[];
  keywordsEn: string[];
  selectedKeywords: string[];
  error: string | null;
}

export const PRESET_PURPOSES = [
  "小红书爆款标题",
  "微信公众号文章标题",
  "新闻标题",
  "短视频/抖音/B站 标题",
  "知乎问答标题",
  "电商产品名称/Slogan",
  "邮件主题",
  "学术论文/报告题目",
  "工作周报/PPT 标题"
];
