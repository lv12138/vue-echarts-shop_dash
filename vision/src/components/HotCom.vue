<template>
  <div class="com-container">
    <div class="com-chart" ref="hot-ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
    <span class="chart-name" :style="comStyle">{{ chartName }}</span>
  </div>
</template>

<script>
export default {
  name: 'HotCom',
  data () {
    return {
      chartInstance: null,
      jsonData: null,
      currentIndex: 0,
      titleFontSize: 0
    }
  },
  computed: {
    chartName () {
      if (!this.jsonData) {
        return ''
      } else {
        return this.jsonData[this.currentIndex].name
      }
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
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
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs['hot-ref'], 'chalk')
      const initOption = {
        title: {
          text: '▋ 热销商品占比',
          left: 20,
          top: 20
        },
        legend: {
          top: '20%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: arg => {
            // console.log(arg)
            const thirdCategory = arg.data.children
            let total = 0
            thirdCategory.forEach(item => {
              total += item.value
            })
            let retStr = ''
            thirdCategory.forEach(item => {
              retStr += `
              ${item.name}: ${(item.value / total * 100).toFixed(2) + '%'}
              <br/>
              `
            })
            return retStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      await this.$axios.get('hotproduct').then(res => {
        this.jsonData = res.data
        // console.log(this.jsonData)
        this.updateChart()
      })
    },
    updateChart () {
      const legendData = this.jsonData[this.currentIndex].children.map(item => {
        return item.name
      })
      const seriesData = this.jsonData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs['hot-ref'].offsetWidth / 100 * 4.5
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4,
            center: ['50%', '60%']
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    toLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.jsonData.length - 1
      }
      this.updateChart()
    },
    toRight () {
      this.currentIndex++
      if (this.currentIndex > this.jsonData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    }
  }
}
</script>

<style lang="less" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.chart-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: white;
}
</style>
