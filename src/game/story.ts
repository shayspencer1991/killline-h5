export interface StoryChoice {
  text: string
  risk: number
  survival: number      // 生存资源变化
  meaning: number       // 意义资源变化
}

export interface StoryNode {
  id: number
  text: string
  choices: StoryChoice[]
}

export const KILL_LINE = 10

export interface GameResources {
  risk: number
  survival: number
  meaning: number
}

export const worldIntro = `这个世界并不宣告善恶。
它只记录风险。

每个人出生时，都被赋予一条不可见的线。
线不会移动，但你会靠近它。

选择、沉默、顺从、反抗——
都会被系统记录为一种累积值。

当你越过那条线，世界不会审判你。
它只是不再允许你继续存在于当前叙事中。

你不是被杀死的。
你只是被判定为"不可继续"。`

export const story: StoryNode[] = [
  {
    id: 1,
    text: "你来到这里时，没有人问你来自哪里。",
    choices: [
      { text: "保持低调", risk: 0, survival: 0, meaning: 0 },
      { text: "主动结识他人", risk: 1, survival: 0, meaning: 1 }
    ]
  },
  {
    id: 2,
    text: "第一次被检查。例行流程比你预想得更细。",
    choices: [
      { text: "如实配合", risk: 1, survival: 0, meaning: 0 },
      { text: "简化叙述", risk: 2, survival: 1, meaning: 0 }
    ]
  },
  {
    id: 3,
    text: "一份不稳定但回报不错的工作机会。",
    choices: [
      { text: "接受", risk: 1, survival: 2, meaning: 0 },
      { text: "拒绝", risk: 0, survival: -1, meaning: 1 }
    ]
  },
  {
    id: 4,
    text: "有人开始真正关心你的处境。",
    choices: [
      { text: "保持距离", risk: -1, survival: 0, meaning: 0 },
      { text: "投入关系", risk: 1, survival: 0, meaning: 2 }
    ]
  },
  {
    id: 5,
    text: "规则没有改变，但执行方式变了。",
    choices: [
      { text: "调整行为", risk: -1, survival: -1, meaning: 0 },
      { text: "维持原状", risk: 2, survival: 0, meaning: 0 }
    ]
  },
  {
    id: 6,
    text: "有人提醒你：最近被关注了。",
    choices: [
      { text: "收缩存在感", risk: -2, survival: 0, meaning: -1 },
      { text: "认为是误判", risk: 2, survival: 0, meaning: 0 }
    ]
  },
  {
    id: 7,
    text: "一个可以降低风险的非正式渠道。",
    choices: [
      { text: "接受代价", risk: -3, survival: 0, meaning: -2 },
      { text: "拒绝交换", risk: 1, survival: 0, meaning: 1 }
    ]
  },
  {
    id: 8,
    text: "你发现有些关系已经无法维持。",
    choices: [
      { text: "尝试修复", risk: 0, survival: -1, meaning: 1 },
      { text: "放弃", risk: -1, survival: 0, meaning: 0 }
    ]
  },
  {
    id: 9,
    text: "系统正在重新评估你的位置。",
    choices: [
      { text: "不做任何事", risk: 0, survival: 0, meaning: 0 },
      { text: "主动申诉", risk: 2, survival: 0, meaning: 1 }
    ]
  },
  {
    id: 10,
    text: "你意识到，已经没有完全安全的选择。",
    choices: [
      { text: "继续生存", risk: 0, survival: 1, meaning: -1 },
      { text: "坚持自我", risk: 2, survival: 0, meaning: 2 }
    ]
  }
]

export function getRiskHint(risk: number): string {
  if (risk <= 2) {
    return "一切如常"
  } else if (risk <= 4) {
    return "你感到轻微的注视"
  } else if (risk <= 6) {
    return "某种不安正在累积"
  } else if (risk <= 8) {
    return "你已进入高度暴露区"
  } else {
    return "系统正在审视你"
  }
}

export interface Ending {
  type: string
  title: string
  content: string
  verdict: string
  survivalTime: 'short' | 'normal' | 'long' | 'stable'
  lifeQuality: 'broken' | 'functional' | 'connected' | 'coherent'
}

export function getEnding(risk: number, survival: number, meaning: number, identityId: string): Ending {
  // 计算生存时间（横轴）
  let survivalTime: Ending['survivalTime'] = 'normal'
  if (risk >= KILL_LINE) {
    survivalTime = 'short'
  } else if (survival >= 4) {
    survivalTime = 'stable'
  } else if (survival >= 2) {
    survivalTime = 'long'
  }
  
  // 计算生存质量（纵轴）
  let lifeQuality: Ending['lifeQuality'] = 'functional'
  if (meaning >= 6) {
    lifeQuality = 'coherent'
  } else if (meaning >= 3) {
    lifeQuality = 'connected'
  } else if (meaning <= 0) {
    lifeQuality = 'broken'
  }
  
  // 结构性斩杀
  if (risk >= KILL_LINE) {
    return {
      type: 'structural_elimination',
      title: '存在记录',
      content: '你并未失败。你只是承担了一个不被允许的位置。',
      verdict: '系统判定：不可继续',
      survivalTime,
      lifeQuality
    }
  }
  
  // 长期存活 / 低意义
  if (survivalTime === 'stable' && (lifeQuality === 'functional' || lifeQuality === 'broken')) {
    return {
      type: 'long_hollow',
      title: '评估结束',
      content: '你被系统保留，但几乎不再被任何人记得。',
      verdict: `你在系统中停留了很久。代价是什么？`,
      survivalTime,
      lifeQuality
    }
  }
  
  // 短暂存活 / 高意义
  if ((survivalTime === 'short' || survivalTime === 'normal') && (lifeQuality === 'coherent' || lifeQuality === 'connected')) {
    return {
      type: 'brief_meaningful',
      title: '评估结束',
      content: '你没有走得太远，但你知道自己是谁。',
      verdict: '这是一次真实的存在。',
      survivalTime,
      lifeQuality
    }
  }
  
  // 灰色特权结局
  if (survivalTime === 'stable' && lifeQuality === 'coherent') {
    return {
      type: 'privileged_survivor',
      title: '评估结束',
      content: '你活了下来，也知道代价是谁付的。',
      verdict: '这是少数人才能保有的平衡。',
      survivalTime,
      lifeQuality
    }
  }
  
  // 侥幸存活
  if (risk >= 7) {
    return {
      type: 'narrow_escape',
      title: '评估结束',
      content: '你活了下来，但只是侥幸。',
      verdict: '系统仍在记录。',
      survivalTime,
      lifeQuality
    }
  }
  
  // 默认：普通存活
  return {
    type: 'normal_survival',
    title: '评估结束',
    content: '你通过了这次评估。',
    verdict: `生存与意义的平衡，仍在继续。`,
    survivalTime,
    lifeQuality
  }
}
