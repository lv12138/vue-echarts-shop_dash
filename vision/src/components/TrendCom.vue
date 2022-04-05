<template>
  <div class="com-container">
    <div class="chart-title" :style="titleStyle">
      <span>{{ '▋ ' + chartTitle }}</span>
      <span class="iconfont title-icon" @click="showSelectFlag = !showSelectFlag" :style="titleStyle">&#xe6eb;</span>
      <div class="chart-title-list" v-show="showSelectFlag" :style="itemMarginStyle">
        <div class="chart-title-item"
             v-for="item in chartTypeList" :key="item.key"
             @click="selectItem(item.key)">{{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend-ref">
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrendCom',
  data () {
    return {
      chartInstance: null,
      jsonData: null,
      showSelectFlag: false,
      selectedChartType: 'map',
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
  computed: {
    chartTitle () {
      if (!this.jsonData) {
        return ''
      } else {
        return this.jsonData[this.selectedChartType].title
      }
    },
    chartTypeList () {
      if (!this.jsonData) {
        return []
      } else {
        return this.jsonData.type.filter(item => item.key !== this.selectedChartType)
      }
    },
    titleStyle () {
      return {
        fontSize: this.titleFontSize / 1.5 + 'px',
        fontStyle: 'italic',
        fontWeight: 'bolder'
      }
    },
    itemMarginStyle () {
      return {
        marginLeft: this.titleFontSize / 1.5 + 'px'
      }
    }
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs['trend-ref'], 'chalk')
      const initOption = {
        grid: {
          top: '20%',
          right: '3%',
          left: '3%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
          // backgroundColor: '#222733',
          // backgroundColor: 'rgba(34,39,51,0.7)',
          // textStyle: {
          //   color: 'white'
          // }
        },
        legend: {
          top: '5%',
          right: '3%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false // 是否有间隙
        },
        yAxis: { type: 'value' }
      }
      this.chartInstance.setOption(initOption)
    },
    async getChartData () {
      await this.$axios.get('trend').then(res => {
        this.jsonData = res.data
        this.updateChart()
      })
    },
    updateChart () {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      const monthData = this.jsonData.common.month
      const valueData = this.jsonData[this.selectedChartType].data
      const seriesData = valueData.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.selectedChartType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      // 获取图例
      const legendData = valueData.map(item => { return item.name })
      const dataOption = {
        xAxis: { data: monthData },
        series: seriesData,
        legend: { data: legendData }
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs['trend-ref'].offsetWidth / 100 * 4.5
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2.5
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    selectItem (itemKey) {
      this.selectedChartType = itemKey
      this.updateChart()
      this.showSelectFlag = false
    }
  }
}
</script>

<style lang="less" scoped>
.chart-title {
  position: absolute;
  left: 20px;
  top: 11px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 15px;
    cursor: pointer;
  }
  .chart-title-list {
    background-color: rgba(34, 39, 51, 0.7);
  }
}
</style>
