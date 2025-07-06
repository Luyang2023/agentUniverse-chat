
// TODO 迁移过来的4E相关定义，后续再整理下，通用化一下

export enum IndustryMode {
  RAG = 'RAG',    // 快速解读
  PEER = 'PEER',  // 深度解读
  URL = 'url',    // URL解读
  YUQUE = 'yuque',// 语雀解读
  File = 'file'   // 文档解读
}

// 完整的答案类型定义
export type MessageCardRecords = [
  Process4E,
  Answer,
  RelateQuestion
];

// 完整的答案卡片类型枚举
export enum RecordType {
  Process4E = 'process4E',
  Answer = 'answer',
  Preprocess = 'preprocess',
  RelateQuestion = 'relate_question',
}

/**
/* Process4E 类型定义 
**/
export type Process4E = {
  type: RecordType.Process4E;
  status: Process4EStatus;
  data: [EngineeringStage, ExecutingStage, ExpressingStage, relateActionStage];
};


// 4E各阶段状态
export enum Process4EStatus  {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

// 4E策划阶段
export type EngineeringStage = {
  stage_code: 'engineering';
  stage_name: string; // 策划
  status: Process4EStatus;
  framework_enable: boolean;
  framework: string[];
  guiding_framework?: Array<{
    // 如果没有，代表未匹配到框架
    name: string; // 框架名
    introduction: string; // 框架介绍
  }>;
};

// 4E执行阶段
// 执行阶段的问题任务
export type ExecutingTask = {
  task: string; // 拆分出的子问题名
  task_result: string; // 问题的答案
  task_source: {
    // 溯源列表
    title: string;
    url?: string; // 有的溯源没有url
    content?: string;
  }[];
  sub_task?: Array<ExecutingTask>; // 子任务
};

export type ExecutingStage = {
  stage_code: 'executing';
  stage_name: string; // 分析
  status: Process4EStatus;
  tasks: Array<ExecutingTask>;
};

// 适配后的文件信息
export type IndustryInfo = {
  industryType: IndustryMode.URL | IndustryMode.PDF | IndustryMode.YUQUE | 'yuque_selected';
  sourceName: string;
  id: string;
};

// 4E表达阶段
type ExpressingStage = {
  stage_code: 'expressing';
  stage_name: string; // 回答
  status: Process4EStatus;
};

type TextAlign = 'left' | 'right' | 'center' | 'justify';

// 确认阶段
type relateActionStage =  {
  stage_code: 'relate_action';
  stage_name: string; // 确认
  status: Process4EStatus;
  data: {
    location?: TextAlign | undefined; // 按钮位置
    name: string; // 按钮名称
    order: string; // 发送内容
    service_id: string; // agent_id
  };
};

/**
/* Answer 类型定义 
**/
export type Answer = {
  type: RecordType.Answer;
  status: Process4EStatus;
  data: {
    answer: string; // 具体的答案内容
    hint?: string; // 预处理回答
    source_map: any; // TODO 溯源列表
    file_info: Array<IndustryInfo>;
  };
};

/**
/* RelateQuestion 类型定义 
**/
export type RelateQuestion = {
  type: RecordType.RelateQuestion;
  status: Process4EStatus;
  data: string[];
};

