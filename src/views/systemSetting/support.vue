<template>
    <section>
        <el-row>
            <el-col :span= 8><div class="grid-content"></div></el-col>
            <el-col :span= 8>               
                <el-card>
                    <div slot="header" >
                        <span style="line-height: 15px;">技术支持</span>
                    </div>
                    <div class="item">
                        {{'名称：浙江电子口岸有限公司' }}
                    </div>
                    <div class="item">
                        {{'电话：967209' }}
                    </div>
                    <div class="item">
                        {{'邮箱：cs@zjport.gov.cn' }}
                    </div>
                </el-card>       
            </el-col>
            <el-col :span= 8><div class="grid-content"></div></el-col>
        </el-row>
    </section> 
</template>

<script>
export default {
    data() {
        return {
        }
    },
    methods:{}
 }
</script>

<style scoped lang="scss">
    .grid-content{
         min-height: 36px;
    }
    .el-row{
        margin-top:100px;
    }
    .item{
        padding: 15px 5px;
    }
</style>
