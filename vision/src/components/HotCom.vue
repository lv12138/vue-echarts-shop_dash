<template>
  <div class="com-container">
    <div class="com-chart" ref="hot-ref"></div>
  </div>
</template>

<script>
export default {
  name: 'HotCom',
  data () {
    return {
      chartInstance: null,
      jsonData: null
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  computed: {},
  methods: {
    initChart () {
      const initOption = {}
      this.chartInstance = this.$echarts.init(this.$refs['hot-ref'], 'chalk')
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      await this.$axios.get('hotproduct').then(res => {
        this.jsonData = res.data
        this.updateChart()
      })
    },
    updateChart () {
      const dataOption = {}
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
