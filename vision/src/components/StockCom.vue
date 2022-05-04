<template>
  <div class="com-container">StockCom
    <div class="com-chart" ref="stock-ref"></div>
  </div>
</template>

<script>
export default {
  name: 'StockCom',
  data () {
    return {
      jsonData: null,
      chartInstance: null
    }
  },
  computed: {},
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs['stock-ref'], 'chalk')
      const initOption = {}
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      await this.$axios.get('stock').then(res => {
        this.jsonData = res.data
        // console.log(this.jsonData)
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

<style scoped>

</style>
