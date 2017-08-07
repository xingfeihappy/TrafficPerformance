<template>
  <section class = "chart">
      <el-row>
            <el-col class = 'chart-container'>
                <div class="chart-header">
                    <el-date-picker
                        v-model="beginYear"
                        type="year"
                        placeholder="起始年份"
                        @change="selectBeginYear">
                    </el-date-picker>
                </div>
                <div class="chart-header">
                    <el-date-picker
                        v-model="endYear"
                        type="year"
                        placeholder="结束年份"
                        @change="selectEndYear">
                    </el-date-picker>
                </div>
                <div class = "chart-header2">
                    <el-select v-model="engerType" placeholder="能源类型" @change="selectEngType">
                    <el-option key="汽油" label="汽油" value="汽油"></el-option>
                    <el-option key="柴油" label="柴油" value="柴油"></el-option>
                    <el-option key="煤油" label="煤油" value="煤油"></el-option>
                    <el-option key="电能" label="电能" value="电能"></el-option> 
                   <!-- <el-option key="混合燃料" label="混合燃料" value="混合燃料"></el-option>
                    <el-option key="液化石油气" label="液化石油气" value="液化石油气"></el-option>
                    <el-option key="液化天然气" label="液化天然气" value="液化天然气"></el-option>-->
                    <el-option key="其他" label="其他" value="其他"></el-option>
                </el-select>
                </div>
            </el-col>
            
      </el-row>
      <el-row>
            <el-col class="chart-container">
                <div id="engYearChgChart"style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
      </el-row>    
  </section>
</template>


<script>

    var dataForEngAll=[];
    var engYearChgChart;

    var requestData = {
        username:'zwp',
        roleName:'enterprice',
        roleType:'R_TRA',
        timeRange:'2017-01-01:2017-12-30',
        engerType:'汽油'
    };
    var engType = '汽油';

    var option = {
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
            data:[]
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
                name: '能耗(单位：万吨标准煤)',
                axisLabel: {
                    formatter: '{value}'
                },
                axisPointer: {
                    snap: true
                }
            }
        ],
        series : []
    };

    var _beginYear="";
    var _endYear="";
    var _engType="";

    function setData(res){
        console.log(res)
        var yearMonMap={};
        var yearMonSeries=[];
        var monthArr = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        var yearArr =[];
        res.engTypOther.forEach(function(element){
            if(element.baseTyp==engType){
                element.engTypMo.forEach(function(e2){
                    var yearMon = new Array();
                    yearMon = e2.type.split('-');
                    if(!yearMonMap[yearMon[0]]){
                        yearMonMap[yearMon[0]] = {};
                        yearArr.push(yearMon[0]);
                    }
                    if(!yearMonMap[yearMon[0]][yearMon[1]])
                        yearMonMap[yearMon[0]][yearMon[1]] = e2.typDatOfAllEng;
                });
            }     
        });
        console.log(yearMonMap);
        yearArr.forEach(function(element){
            var tmpEngDatas = [];
            if(!yearMonMap[element]){
                var tmpSeriseObj = {
                    name:element,
                    type:'bar',
                    data:[]
                };
                yearMonSeries.push(tmpSeriseObj);
            }else{
                monthArr.forEach(function(e2){
                    var t = yearMonMap[element][e2];
                    if(t){
                        tmpEngDatas.push(t);
                    }else{
                        tmpEngDatas.push(0);
                    }
                });
                var tmpSeriseObj={
                    name:element,
                    type:'line',
                    data:tmpEngDatas
                };
                yearMonSeries.push(tmpSeriseObj);
            }
            
        });

        dataForEngAll.splice(0,dataForEngAll.length);
        dataForEngAll.push(yearArr);
        dataForEngAll.push(monthArr);
        dataForEngAll.push(yearMonSeries);

        
    };

    export default {
        data(){
            return {
                beginYear:'',
                engerType : '汽油',
                endYear:''
            }
        },
        methods:{
            getDataFromService(requestData){
                $.get(this.Constant.ajaxAddress+this.Constant.yearcompareAjax,requestData).
                done(function (res){
                    setData(res);
                    option.legend.data = dataForEngAll[0];
                   // option.xAxis[0].data = dataForEngAll[1];
                    option.series = dataForEngAll[2];
                    engYearChgChart.clear();
                    engYearChgChart.setOption(option);
                });
                
            },
            selectBeginYear(by){
                _beginYear = by;
                if(_endYear!=""||_engType!=""){

                }
            },
            selectEndYear(ey){
                _endYear = ey;
                if(_beginYear!=""||_engType!=""){

                }
            },
            selectEngType(et){
                _engType = et;
                if(_beginYear!=""||_beginYear!=""){
                    
                }
            }
        },
        mounted:function(){
            engYearChgChart = echarts.init(document.getElementById('engYearChgChart'));
            engYearChgChart.setOption(option);
            this.getDataFromService(requestData);
        },
        updated:function(){
            console.log("update");
        }
    }
</script>

<style scoped lang="scss">
    .chart {
        width: 100%;
        float: left;
        .chart-container{
             background-color: #F2F2F2; 
             border-radius: 8px;
            .chart-header{
                float: left;
                margin-left: 20px;
                position: relative;
            }
            .chart-header2{
                float: right;
                margin-right: 20px;
                position: relative;
            }
            .chart-content{
                overflow: hidden;
            }
        }
        
    }
    .el-row {
        margin-bottom: 15px;
        &:last-child {
        margin-bottom: 0;
        }
    }

    .el-col {
        padding: 20px 20px;
    }
</style>



