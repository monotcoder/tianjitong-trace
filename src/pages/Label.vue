<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  AlertTriangle,
  Package,
  Sprout,
  Share2,
  Loader2,
  ShieldCheck,
  FileCheck2,
  Sparkles,
  ListChecks,
} from 'lucide-vue-next'

const props = defineProps<{ code?: string }>()
const router = useRouter()

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:18080'

interface SkuPublicInfo {
  id: number
  name: string
  category?: string | null
  categoryTemplate?: string | null
  standardCode?: string | null
  grade?: string | null
  netContent?: string | null
  origin?: string | null
  storageCondition?: string | null
  shelfLifeDays?: number | null
  specName?: string | null
  imageUrl?: string | null
}

interface LabelPublic {
  code: string
  name: string
  status: string
  content: string | null
  sku: SkuPublicInfo
}

interface FieldDef {
  key: string
  label: string
  type: string
  required?: boolean | null
  highlight?: boolean | null
  help?: string | null
}

interface CategoryTemplate {
  key: string
  name: string
  commitments?: FieldDef[]
  reports?: FieldDef[]
  marketing?: FieldDef[]
}

type SectionKey = 'commitments' | 'reports' | 'marketing' | 'custom'

interface ParsedContent {
  commitments?: Record<string, unknown>
  reports?: Record<string, unknown>
  marketing?: Record<string, unknown>
  custom?: Array<{ key: string; label: string; value: string }>
  order?: SectionKey[]
}

const label = ref<LabelPublic | null>(null)
const template = ref<CategoryTemplate | null>(null)
const loading = ref(true)
const error = ref('')

const parsed = computed<ParsedContent>(() => {
  if (!label.value?.content) return {}
  try {
    return JSON.parse(label.value.content) as ParsedContent
  } catch {
    return {}
  }
})

const order = computed<SectionKey[]>(() => {
  return parsed.value.order && parsed.value.order.length
    ? parsed.value.order
    : ['commitments', 'reports', 'marketing', 'custom']
})

const warning = computed(() => label.value && label.value.status !== 'published')

// 承诺展示：已勾选的用"✔"突出
const commitmentFields = computed<FieldDef[]>(() => template.value?.commitments || [])
const reportFields = computed<FieldDef[]>(() => template.value?.reports || [])
const marketingFields = computed<FieldDef[]>(() => template.value?.marketing || [])

const confirmedCommitments = computed(() => {
  const vals = parsed.value.commitments || {}
  return commitmentFields.value.filter(f => !!vals[f.key])
})

function splitUrls(raw: unknown): string[] {
  if (typeof raw !== 'string') return []
  return raw.split(/[\s,，、\n]+/).map(s => s.trim()).filter(Boolean)
}

function isImageUrl(u: string) {
  return /\.(png|jpg|jpeg|webp|gif|bmp|svg)(\?.*)?$/i.test(u)
}

onMounted(async () => {
  if (!props.code) {
    router.replace('/404')
    return
  }
  try {
    const res = await fetch(`${API_BASE}/api/label/public/${props.code}`)
    const json = await res.json()
    if (json.code !== 0 || !json.data) {
      error.value = json.message || '电子标签无效'
      loading.value = false
      return
    }
    label.value = json.data as LabelPublic

    const tplKey = label.value.sku?.categoryTemplate
    if (tplKey) {
      try {
        const tplRes = await fetch(`${API_BASE}/api/category-template/${tplKey}`)
        const tplJson = await tplRes.json()
        if (tplJson.code === 0 && tplJson.data) {
          template.value = tplJson.data as CategoryTemplate
        }
      } catch {
        // 模板拉取失败不阻塞，只是各分组会退回"无定义"
      }
    }
  } catch (e) {
    error.value = '网络请求失败，请稍后重试'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-[480px] flex-col bg-muted/30">
    <header class="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sprout class="h-4 w-4" />
        </div>
        <span class="text-sm font-semibold">电子标签</span>
      </div>
      <button class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground active:bg-muted">
        <Share2 class="h-4 w-4" />
      </button>
    </header>

    <div v-if="loading" class="flex flex-1 flex-col items-center justify-center gap-3 py-20">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
      <span class="text-sm text-muted-foreground">正在查询标签信息…</span>
    </div>

    <div v-else-if="error" class="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20">
      <AlertTriangle class="h-10 w-10 text-destructive" />
      <p class="text-center text-sm text-muted-foreground">{{ error }}</p>
    </div>

    <template v-else-if="label">
      <div
        v-if="warning"
        class="mx-4 mt-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-destructive"
      >
        <AlertTriangle class="h-5 w-5 shrink-0" />
        <div class="text-sm leading-relaxed">
          <div class="font-semibold">该电子标签未发布</div>
          <div class="mt-0.5 text-xs">可能是草稿或已归档，请与生产者核实</div>
        </div>
      </div>

      <!-- 商品顶部信息 -->
      <section class="mx-4 mt-3 overflow-hidden rounded-2xl bg-background shadow-sm">
        <div class="aspect-[4/3] w-full bg-gradient-to-br from-primary/15 via-primary/5 to-background">
          <img v-if="label.sku.imageUrl" :src="label.sku.imageUrl" class="h-full w-full object-cover" alt="" />
          <div v-else class="flex h-full items-center justify-center text-primary/40">
            <Package class="h-16 w-16" />
          </div>
        </div>
        <div class="p-4">
          <h1 class="text-xl font-semibold tracking-tight">{{ label.sku.name }}</h1>
          <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <div v-if="label.sku.specName">规格 · {{ label.sku.specName }}</div>
            <div v-if="label.sku.grade">等级 · {{ label.sku.grade }}</div>
            <div v-if="label.sku.netContent">净含量 · {{ label.sku.netContent }}</div>
          </div>
          <div v-if="label.sku.origin" class="mt-1 text-sm text-muted-foreground">产地 · {{ label.sku.origin }}</div>
        </div>
      </section>

      <!-- 分组区块：承诺 / 检测报告 / 营销 / 自定义 -->
      <div class="mx-4 mt-3 flex flex-col gap-3">
        <template v-for="sec in order" :key="sec">
          <!-- 关键承诺（顶部重点展示） -->
          <section
            v-if="sec === 'commitments' && (confirmedCommitments.length || commitmentFields.length)"
            class="overflow-hidden rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 shadow-sm"
          >
            <div class="mb-2 flex items-center gap-2 text-emerald-700">
              <ShieldCheck class="h-5 w-5" />
              <span class="text-sm font-semibold">关键承诺</span>
            </div>
            <ul class="flex flex-col gap-1.5">
              <li
                v-for="f in commitmentFields"
                :key="f.key"
                class="flex items-start gap-2 text-sm"
                :class="(parsed.commitments || {})[f.key] ? 'text-emerald-900' : 'text-muted-foreground line-through'"
              >
                <span
                  class="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  :class="(parsed.commitments || {})[f.key] ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'"
                >
                  {{ (parsed.commitments || {})[f.key] ? '✓' : '—' }}
                </span>
                <span>{{ f.label }}</span>
              </li>
            </ul>
            <p v-if="!commitmentFields.length" class="text-xs text-muted-foreground">
              该品类未定义承诺字段
            </p>
          </section>

          <!-- 检测报告 -->
          <section
            v-else-if="sec === 'reports' && Object.keys(parsed.reports || {}).length"
            class="overflow-hidden rounded-2xl bg-background p-4 shadow-sm"
          >
            <div class="mb-2 flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileCheck2 class="h-4 w-4" />
              </div>
              <span class="text-sm font-semibold">检测报告</span>
            </div>
            <div class="flex flex-col gap-3">
              <div
                v-for="f in reportFields"
                :key="f.key"
                v-show="(parsed.reports || {})[f.key]"
              >
                <div class="mb-1 text-xs text-muted-foreground">{{ f.label }}</div>
                <div class="flex flex-wrap gap-2">
                  <template v-for="u in splitUrls((parsed.reports || {})[f.key])" :key="u">
                    <a
                      v-if="isImageUrl(u)"
                      :href="u"
                      target="_blank"
                      class="block h-20 w-20 overflow-hidden rounded-lg border border-border"
                    >
                      <img :src="u" class="h-full w-full object-cover" alt="" />
                    </a>
                    <a
                      v-else
                      :href="u"
                      target="_blank"
                      class="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary"
                    >
                      <FileCheck2 class="h-3 w-3" />
                      查看文件
                    </a>
                  </template>
                </div>
              </div>
            </div>
          </section>

          <!-- 营销增强 -->
          <section
            v-else-if="sec === 'marketing' && Object.keys(parsed.marketing || {}).length"
            class="overflow-hidden rounded-2xl bg-background p-4 shadow-sm"
          >
            <div class="mb-2 flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles class="h-4 w-4" />
              </div>
              <span class="text-sm font-semibold">产品故事</span>
            </div>
            <div class="flex flex-col gap-3">
              <div
                v-for="f in marketingFields"
                :key="f.key"
                v-show="(parsed.marketing || {})[f.key]"
              >
                <div class="mb-1 text-xs text-muted-foreground">{{ f.label }}</div>
                <template v-if="f.type === 'multiimage' || f.type === 'image'">
                  <div class="flex flex-wrap gap-2">
                    <a
                      v-for="u in splitUrls((parsed.marketing || {})[f.key])"
                      :key="u"
                      :href="u"
                      target="_blank"
                      class="block h-24 w-24 overflow-hidden rounded-lg border border-border"
                    >
                      <img :src="u" class="h-full w-full object-cover" alt="" />
                    </a>
                  </div>
                </template>
                <template v-else>
                  <p class="whitespace-pre-wrap text-sm leading-relaxed">
                    {{ (parsed.marketing || {})[f.key] }}
                  </p>
                </template>
              </div>
            </div>
          </section>

          <!-- 自定义卡片 -->
          <section
            v-else-if="sec === 'custom' && parsed.custom && parsed.custom.length"
            class="overflow-hidden rounded-2xl bg-background p-4 shadow-sm"
          >
            <div class="mb-2 flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ListChecks class="h-4 w-4" />
              </div>
              <span class="text-sm font-semibold">更多信息</span>
            </div>
            <div class="flex flex-col gap-3">
              <div
                v-for="(c, idx) in parsed.custom"
                :key="idx"
                class="rounded-lg border border-border p-3"
              >
                <div class="text-sm font-semibold">{{ c.label || c.key }}</div>
                <p class="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{{ c.value }}</p>
              </div>
            </div>
          </section>
        </template>
      </div>
    </template>

    <footer class="mt-6 flex flex-col items-center gap-1 px-4 pb-8 pt-4">
      <a
        href="https://app.tianjitong.com"
        class="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs text-muted-foreground shadow-sm active:scale-95"
      >
        <Sprout class="h-3.5 w-3.5 text-primary" />
        Powered by
        <span class="font-semibold text-foreground">田迹通</span>
        <span class="text-primary">→</span>
      </a>
      <div v-if="code" class="mt-1 text-[10px] text-muted-foreground/70">
        标签编码 · {{ code }}
      </div>
    </footer>
  </div>
</template>
