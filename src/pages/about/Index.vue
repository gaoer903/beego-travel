<template>
  <section class="section">
    <div class="mx-auto w-[760px]">
      <div class="mb-6 flex items-center gap-4">
        <Mascot
          :size="80"
          prop="magnifier"
        />
        <div>
          <h1 class="heading-1">关于避过</h1>
          <p class="text-muted mt-1">这地方，避过吗？</p>
        </div>
      </div>

      <div class="card-padded space-y-4 text-sm leading-relaxed text-gray-700">
        <p>
          避过是一个把
          <b>真实投诉数据</b>
          变成
          <b>避雷工具</b>
          的产品。我们聚合 12315、黑猫投诉、文旅通报等公开来源，
          再由数据团队人工核实，把"避坑信息"变成你出行前 5 分钟就能用上的清单。
        </p>
        <p>
          我们不种草、不带货。
          <b>看一眼地名 / 商户名，就知道有没有坑。</b>
        </p>
        <p>
          内测期间所有「今日已核实」雷点、行前清单、应急联系卡片均免费。投诉电话、避雷地图、踩坑墙永久免费。
        </p>
        <p class="text-xs text-gray-400">
          数据仅供参考，部分信息基于用户上报，请结合实际情况理性出行。
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({ title: "关于避过 · 这地方，避过吗？" });
</script>
