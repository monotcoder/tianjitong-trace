<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  AlertTriangle,
  ChevronDown,
  Package,
  Boxes,
  FileBadge,
  SprayCan,
  Sprout,
  Building2,
  Share2,
  PenLine,
} from 'lucide-vue-next'
import { mockTrace } from '@/mock/trace'

defineProps<{ traceCode?: string }>()

const trace = mockTrace

const iconMap: Record<string, typeof Package> = {
  package: Package,
  boxes: Boxes,
  'file-badge': FileBadge,
  'spray-can': SprayCan,
  sprout: Sprout,
  'building-2': Building2,
}

const openMap = ref<Record<string, boolean>>(
  Object.fromEntries(trace.sections.map(s => [s.key, s.defaultOpen])),
)

const warning = computed(() => trace.status !== 'published')

function toggle(key: string) {
  openMap.value[key] = !openMap.value[key]
}
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-[480px] flex-col bg-muted/30">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sprout class="h-4 w-4" />
        </div>
        <span class="text-sm font-semibold">农产品追溯</span>
      </div>
      <button class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground active:bg-muted">
        <Share2 class="h-4 w-4" />
      </button>
    </header>

    <!-- 下架警告 -->
    <div
      v-if="warning"
      class="mx-4 mt-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-destructive"
    >
      <AlertTriangle class="h-5 w-5 shrink-0" />
      <div class="text-sm leading-relaxed">
        <div class="font-semibold">该产品已下架 / 召回,请勿食用</div>
        <div class="mt-0.5 text-xs">如有疑问请联系生产者</div>
      </div>
    </div>

    <!-- 固定顶部区 -->
    <section class="mx-4 mt-3 overflow-hidden rounded-2xl bg-background shadow-sm">
      <div class="aspect-[4/3] w-full bg-gradient-to-br from-primary/15 via-primary/5 to-background">
        <div class="flex h-full items-center justify-center text-primary/40">
          <Package class="h-16 w-16" />
        </div>
      </div>
      <div class="p-4">
        <h1 class="text-xl font-semibold tracking-tight">{{ trace.productName }}</h1>
        <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <div>规格 · {{ trace.spec }}</div>
          <div>生产日期 · {{ trace.produceDate }}</div>
        </div>
        <div class="mt-1 text-sm text-muted-foreground">产地 · {{ trace.origin }}</div>
        <div class="mt-3 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
          <Building2 class="h-4 w-4" />
          <span class="font-medium">{{ trace.producer }}</span>
        </div>
      </div>
    </section>

    <!-- 可折叠区块 -->
    <div class="mx-4 mt-3 flex flex-col gap-3">
      <section
        v-for="sec in trace.sections"
        :key="sec.key"
        class="overflow-hidden rounded-2xl bg-background shadow-sm"
      >
        <button
          class="flex w-full items-center justify-between px-4 py-3 text-left active:bg-muted/40"
          @click="toggle(sec.key)"
        >
          <div class="flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <component :is="iconMap[sec.icon]" class="h-4 w-4" />
            </div>
            <span class="text-sm font-semibold">{{ sec.title }}</span>
          </div>
          <ChevronDown
            class="h-4 w-4 text-muted-foreground transition-transform"
            :class="openMap[sec.key] ? 'rotate-180' : ''"
          />
        </button>

        <div v-if="openMap[sec.key]" class="border-t border-border px-4 py-3">
          <!-- 通用字段行 -->
          <div v-if="sec.rows" class="flex flex-col gap-2.5">
            <div
              v-for="row in sec.rows"
              :key="row.label"
              class="flex items-start justify-between gap-4 text-sm"
            >
              <span class="shrink-0 text-muted-foreground">{{ row.label }}</span>
              <span class="text-right font-medium">{{ row.value }}</span>
            </div>
          </div>

          <!-- 农药记录 -->
          <div v-if="sec.pesticides" class="flex flex-col gap-3">
            <div
              v-for="(p, idx) in sec.pesticides"
              :key="idx"
              class="rounded-lg border border-border p-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold">{{ p.name }}</span>
                <span class="text-xs text-muted-foreground">{{ p.date }}</span>
              </div>
              <div class="mt-2 grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                <div>登记证 · {{ p.regNo }}</div>
                <div>施用量 · {{ p.dosage }}</div>
                <div class="col-span-2">安全间隔期 · {{ p.interval }}</div>
              </div>
            </div>
          </div>

          <!-- 施肥记录 -->
          <div v-if="sec.fertilizers" class="flex flex-col gap-3">
            <div
              v-for="(f, idx) in sec.fertilizers"
              :key="idx"
              class="rounded-lg border border-border p-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold">{{ f.name }}</span>
                <span class="text-xs text-muted-foreground">{{ f.date }}</span>
              </div>
              <div class="mt-1 text-xs text-muted-foreground">施用量 · {{ f.dosage }}</div>
            </div>
          </div>

          <!-- 合格证 -->
          <div v-if="sec.certificates" class="flex flex-col gap-3">
            <div
              v-for="(c, idx) in sec.certificates"
              :key="idx"
              class="rounded-lg border border-primary/30 bg-primary/5 p-3"
            >
              <div class="flex items-center justify-between text-sm">
                <span class="font-semibold text-primary">{{ c.certNo }}</span>
                <span class="text-xs text-muted-foreground">{{ c.issueDate }}</span>
              </div>
              <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{{ c.statement }}</p>
              <div class="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <PenLine class="h-3.5 w-3.5" />
                授权人 · {{ c.issuer }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 品牌露出 -->
    <footer class="mt-6 flex flex-col items-center gap-1 px-4 pb-8 pt-4">
      <a
        href="https://app.tianjitong.com"
        class="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs text-muted-foreground shadow-sm active:scale-95"
      >
        <Sprout class="h-3.5 w-3.5 text-primary" />
        Powered by
        <span class="font-semibold text-foreground">田迹通</span>
        · 为您的农产品开具数字合格证
        <span class="text-primary">→</span>
      </a>
      <div class="mt-1 text-[10px] text-muted-foreground/70">
        追溯码 · {{ trace.traceCode }}
      </div>
    </footer>
  </div>
</template>
