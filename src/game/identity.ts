export interface IdentityParams {
  id: string
  name: string
  desc: string
  riskSensitivity: number    // 行为被判定为风险的放大系数
  tolerance: number           // 系统允许的风险缓冲
  visibility: number          // 行为被注意的概率
  resourceDecay: number       // 生存资源流失速度
  meaningGain: number         // 意义资源获取效率
}

export const identities: IdentityParams[] = [
  {
    id: 'local_stable',
    name: '本地稳定阶层',
    desc: `你熟悉这里的规则。
它们并不总是清晰，但你知道什么时候该停下。
你很少被怀疑，
也很少被真正看见。`,
    riskSensitivity: 0.8,
    tolerance: 3,
    visibility: 0.6,
    resourceDecay: 0.8,
    meaningGain: 0.7
  },
  {
    id: 'marginal',
    name: '流动/边缘阶层',
    desc: `你被需要，但不被信任。
你的每一步，
都更容易被解释成一种风险。
但你知道什么是真实的连接。`,
    riskSensitivity: 1.3,
    tolerance: 1,
    visibility: 1.2,
    resourceDecay: 1.2,
    meaningGain: 1.1
  },
  {
    id: 'elite',
    name: '优势/稀缺阶层',
    desc: `你被期待得更多。
世界会给你资源，
也会更仔细地记录你的一举一动。
偏离并非不被允许，
只是代价更高。`,
    riskSensitivity: 1.0,
    tolerance: 2,
    visibility: 1.5,
    resourceDecay: 0.6,
    meaningGain: 0.5
  }
]

export function getIdentity(id: string): IdentityParams | undefined {
  return identities.find(i => i.id === id)
}
