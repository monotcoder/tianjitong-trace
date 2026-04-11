export interface TraceSection {
  key: string
  title: string
  icon: string
  defaultOpen: boolean
  rows?: Array<{ label: string, value: string }>
  pesticides?: Array<{ name: string, regNo: string, date: string, dosage: string, interval: string }>
  fertilizers?: Array<{ name: string, date: string, dosage: string }>
  certificates?: Array<{ certNo: string, issueDate: string, issuer: string, statement: string, signatureUrl?: string }>
}

export interface TraceData {
  traceCode: string
  status: 'published' | 'unpublished' | 'expired'
  productName: string
  imageUrl?: string
  spec: string
  origin: string
  produceDate: string
  producer: string
  sections: TraceSection[]
}

export const mockTrace: TraceData = {
  traceCode: 'TJT240315ABCDEF',
  status: 'published',
  productName: '有机水蜜桃',
  spec: '500g / 盒',
  origin: '浙江省杭州市淳安县千岛湖镇',
  produceDate: '2026-03-15',
  producer: '千岛湖果蔬合作社',
  sections: [
    {
      key: 'product',
      title: '产品详情',
      icon: 'package',
      defaultOpen: true,
      rows: [
        { label: '产品类别', value: '水果' },
        { label: '执行标准', value: 'GB 2763 食品安全国家标准' },
        { label: '等级', value: '优等品' },
        { label: '储存条件', value: '冷藏 2-8℃ 避光保存' },
        { label: '保质期', value: '7 天' },
      ],
    },
    {
      key: 'batch',
      title: '批次信息',
      icon: 'boxes',
      defaultOpen: true,
      rows: [
        { label: '批次号', value: 'B-20260315-001' },
        { label: '采收日期', value: '2026-03-14' },
        { label: '数量', value: '320 kg' },
        { label: '产地地块', value: '3 号基地 · 东园' },
        { label: '负责人', value: '张伟' },
      ],
    },
    {
      key: 'certificate',
      title: '承诺达标合格证',
      icon: 'file-badge',
      defaultOpen: true,
      certificates: [
        {
          certNo: 'HGZ-2026-03-0012',
          issueDate: '2026-03-15',
          issuer: '千岛湖果蔬合作社',
          statement: '本生产经营主体承诺对所生产销售的食用农产品严格执行农药安全间隔期、休药期规定,不使用禁用药物,不超范围超剂量使用农药兽药。',
        },
      ],
    },
    {
      key: 'pesticide',
      title: '农药使用记录',
      icon: 'spray-can',
      defaultOpen: false,
      pesticides: [
        { name: '苦参碱', regNo: 'PD20080123', date: '2026-02-28', dosage: '50 ml / 亩', interval: '14 天' },
        { name: '印楝素', regNo: 'PD20110456', date: '2026-03-05', dosage: '30 ml / 亩', interval: '7 天' },
      ],
    },
    {
      key: 'fertilizer',
      title: '施肥记录',
      icon: 'sprout',
      defaultOpen: false,
      fertilizers: [
        { name: '有机堆肥', date: '2026-01-10', dosage: '800 kg / 亩' },
        { name: '复合微生物菌肥', date: '2026-02-20', dosage: '60 kg / 亩' },
      ],
    },
    {
      key: 'producer',
      title: '生产者信息',
      icon: 'building-2',
      defaultOpen: true,
      rows: [
        { label: '企业名称', value: '千岛湖果蔬专业合作社' },
        { label: '联系电话', value: '0571-64800000' },
        { label: '经营地址', value: '浙江省杭州市淳安县千岛湖镇东园村 3 号' },
      ],
    },
  ],
}
