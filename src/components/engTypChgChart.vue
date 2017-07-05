<template>
  <section>
      <el-row>
            <el-col>
                <el-date-picker
                    v-model="year"
                    type="year"
                    placeholder="选择年">
                </el-date-picker>
            </el-col>
            <el-col> 
                <el-select v-model="engerType" placeholder="能源类型" >
                    <el-option key="汽油" label="汽油" value="汽油"></el-option>
                    <el-option key="柴油" label="柴油" value="柴油"></el-option>
                    <el-option key="CNG" label="CNG" value="CNG"></el-option>
                    <el-option key="LPG" label="LPG" value="LPG"></el-option>
                    <el-option key="LNG" label="LNG" value="LNG"></el-option>
                    <el-option key="重油" label="重油" value="重油"></el-option>
                    <el-option key="电力" label="电力" value="电力"></el-option>
                </el-select>
            </el-col>
      </el-row>
      <el-row>
            <el-col>
                <div id="engTypChgChart"style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
      </el-row>    
  </section>
</template>


<script>
export default {
    data(){
        return {
            year:'',
            engerType : ''
        }
    },
    methods:{
          darwEngTypChgChart(){
            let engTypChgChart = echarts.init(document.getElementById('engTypChgChart'));
            let option = {
                title : {
                    text: '',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data:['2015','2016','2017']
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false}
                    }
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap: false,
                        data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name: '单位使用能耗(单位：万吨标准煤)',
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisPointer: {
                            snap: true
                        }
                    }
                ],
                series : [
                    {
                        name:'2015',
                        type:'line',
                        smooth: true,
                        data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                    },
                    {
                        name:'2016',
                        type:'line',
                        smooth: true,
                        data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                      
                    },
                    {
                        name:'2017',
                        type:'line',
                        smooth: true,
                        data:[3.2,6.6,9.3,12.4, 24.7, 67.7, 155.6, 132.2, 44.7, 20.8,13.2,7.8]
                    }
                ]
            };

            engTypChgChart.setOption(option);
       }
    },
    mounted:function(){
        this.darwEngTypChgChart();
    },
    updated:function(){

    }
}
</script>





