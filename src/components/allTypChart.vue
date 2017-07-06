<template>
  <section class = "chart">
      <el-row>
            <el-col class="chart-container">
                <el-date-picker
                    v-model="timeRange"
                    type="daterange"
                    placeholder="选择日期范围">
                </el-date-picker>
            </el-col>
      </el-row>
      <el-row>
            <el-col class="chart-container">
                <div id="allTypChart"style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
      </el-row>    
  </section>
</template>

<script>
export default {
    data(){
      return {
            timeRange:''
      }
    },
    methods:{
          darwAlltypChart(){
            let allTypChart = echarts.init(document.getElementById('allTypChart'));
            let option = {
                title : {
                    text: '',
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['油耗','气耗','电耗']
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : ['道路客运','道路货运','公交客运','出租车运输','内河运输','海洋货运','海洋客运']
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                         name: '单位使用能耗(单位：万吨标准煤)'
                    }
                ],
                series : [
                    {
                        name:'油耗',
                        type:'bar',
                        data:[7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6]
                    },
                    {
                        name:'气耗',
                        type:'bar',
                        data:[26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8,]
                      
                    },
                    {
                        name:'电耗',
                        type:'bar',
                        data:[12.4, 24.7, 67.7, 155.6, 132.2, 44.7, 20.8]
                    }
                ]
            };

            allTypChart.setOption(option);
       }
    },
    mounted:function(){
     this.darwAlltypChart();
    },
    updated: function () {
           
    }
}
</script>

<style scoped lang="scss">
    .chart {
        width: 100%;
        float: left;
        .chart-container{
             background-color: #F2F2F2; 
            .chart-header{
                float: right;
                margin-bottom: 20px;
                position: relative;
            }
            .chart-content{
                overflow: hidden;
            }
        }
        
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 20px 20px;
    }
</style>




