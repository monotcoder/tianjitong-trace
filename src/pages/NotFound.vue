<script setup lang="ts">
import { SearchX } from 'lucide-vue-next'
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center gap-4 px-6 text-center">
    <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
      <SearchX class="h-8 w-8" />
    </div>
    <div class="space-y-1">
      <h1 class="text-lg font-semibold">未找到该产品追溯信息</h1>
      <p class="text-sm text-muted-foreground">建议您联系生产者核实二维码有效性</p>
    </div>
  </div>
</template>
