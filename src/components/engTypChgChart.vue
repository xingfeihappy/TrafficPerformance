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
                
            </el-col>
            
      </el-row>
      <el-row>
            <el-col class="chart-container">
                <div class = "chart-header2">
                    <el-select v-model="engerType" filterable placeholder="能源类型" @change="selectEngType">
                        <el-option
                            v-for="item in optionSelect"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div id="engYearChgChart"style="width:100%; height:400px;" class="chart-content"></div>
                
            </el-col>
      </el-row>    
  </section>
</template>


<script>

    import {getCookie,delCookie,setCookie} from '../common/js/Cookie.js';

    var dataForEngAll=[];
    var engYearChgChart;

    var requestData = {};
    //var engType = '';
    var engYearMon3Map = {};

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

    
    var _endYear=(new Date).getFullYear();
    var _beginYear=_endYear-1;
    var _engType='汽油';

    function setData(res){
      
        
        
        res.engTypOther.forEach(function(element){
            element.engTypMo.forEach(function(e2){
                if(!engYearMon3Map[element.baseTyp])
                    engYearMon3Map[element.baseTyp]={};
                var yearMon = new Array();
                yearMon = e2.type.split('-');
                if(!engYearMon3Map[element.baseTyp][yearMon[0]]){
                    engYearMon3Map[element.baseTyp][yearMon[0]] = {};
                }        
                if(!engYearMon3Map[element.baseTyp][yearMon[0]][yearMon[1]])
                    engYearMon3Map[element.baseTyp][yearMon[0]][yearMon[1]] = e2.typDatOfAllEng;
            });     
        });
        console.log(engYearMon3Map)
        setDataByEngType();
        
    };

    function setDataByEngType(){
        var yearArr =[];
        var yearMonSeries=[];
        var monthArr = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        for(var t = _beginYear;t<=_endYear;t++)
            yearArr.push(t.toString());
        if(!engYearMon3Map[_engType])
            engYearMon3Map[_engType]={};
        yearArr.forEach(function(element){
            var tmpEngDatas = [];
            if(!engYearMon3Map[_engType][element]){
                var tmpSeriseObj = {
                    name:element,
                    type:'line',
                    data:[0,0,0,0,0,0,0,0,0,0,0,0]
                };
                yearMonSeries.push(tmpSeriseObj);
            }else{
                monthArr.forEach(function(e2){
                    var t = engYearMon3Map[_engType][element][e2];
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
      //  console.log(yearMonSeries)
        dataForEngAll.splice(0,dataForEngAll.length);
        dataForEngAll.push(yearArr);
        dataForEngAll.push(monthArr);
        dataForEngAll.push(yearMonSeries);   

        option.legend.data = dataForEngAll[0];
        // option.xAxis[0].data = dataForEngAll[1];
        option.series = dataForEngAll[2];
        engYearChgChart.clear();
        engYearChgChart.setOption(option);
    };

    function chaEngType(){
        setDataByEngType();
    };

    export default {
        data(){
            return {
                endYear:_endYear.toString(),
                beginYear:_beginYear.toString(),
                optionSelect:[{
                    value: '汽油',
                    label: '汽油'
                    }, {
                    value: '煤油',
                    label: '煤油'
                }],
                engerType : _engType,
                
            }
        },
        methods:{
            initRequestData(requestData){
                var date = new Date;
                var year = date.getFullYear().toString();
                var token = getCookie('token');
                var userInfo = JSON.parse(getCookie('userInfo'));
                requestData.token = token;
                requestData.username = userInfo.name;
                if(userInfo.roleName!=null && userInfo.roleName!="")
                    requestData.roleName = userInfo.roleName;
                requestData.roleType = userInfo.roleType;
                if(userInfo.place1!=null && userInfo.place1!="")
                    requestData.place1 =userInfo.place1;
                if(userInfo.place2!=null && userInfo.place2!="")
                    requestData.place2 = userInfo.place2;          
                requestData.timeRange = (year-1)+'-01-01:'+year+'-12-31';
            },
             
            getDataFromService(requestData){
                var _this = this;
                $.get(this.Constant.ajaxAddress+this.Constant.yearcompareAjax,requestData).
                done(function (res){
                    console.log(res)
                    _this.optionSelect  = res.xs[1].map(item => {
                        return { value: item, label: item };
                    });
                    setData(res);                
                });
            },
            selectBeginYear(by){
                _beginYear = by;
                if(_endYear==''){    
                }else{
                    if(_endYear<_beginYear){
                        alert("起始年份应该小于结束年份");
                    }else{
                        requestData.timeRange = _beginYear+'-01-01:'+_endYear+'-12-31';
                        this.getDataFromService(requestData);
                    }         
                }
                
            },
            selectEndYear(ey){
                _endYear = ey;
                if(_beginYear==''){
                }else{
                    if(_endYear<_beginYear){
                        alert("起始年份应该小于结束年份");
                    }else{
                        requestData.timeRange = _beginYear+'-01-01:'+_endYear+'-12-31';
                        this.getDataFromService(requestData);
                    }         
                }
            },
            selectEngType(et){
                _engType = et;
                 chaEngType();
            }
        },
        mounted:function(){
            engYearChgChart = echarts.init(document.getElementById('engYearChgChart'));
            engYearChgChart.setOption(option);
            this.initRequestData(requestData)
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
                margin-bottom: 10px;
               
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



