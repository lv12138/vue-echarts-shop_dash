<template>
  <div class="com-container">
    <div class="com-chart" ref="map-ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'MapCom',
  data () {
    return {
      chartInstance: null,
      jsonData: null,
      titleFontSize: 0
    }
  },
  mounted () {
    this.initChart()
    this.getChartData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs['map-ref'], 'chalk')
      await axios.get('http://localhost:8999/static/map/china.json').then(res => {
        this.$echarts.registerMap('chinaMap', res.data)
      })
      const initOption = {
        geo: {
          type: 'map',
          map: 'chinaMap'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getChartData () {
      await this.$axios.get('map').then(res => {
        console.log(res.data)
      })
    },
    updateChart () {
      const updateOption = {}
      this.chartInstance.setOption(updateOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs['map-ref'].offsetWidth / 100 * 4.5
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
