<template>
    <section>   
        <el-row v-if="$userInfo&&$userInfo.roleType&&$userInfo.roleType=='R_ADMIN'">
            <el-col :span= "6"  class="top">
                <div>
                    <el-button type="primary" @click="editSupport">修改</el-button>
                </div>
            </el-col>
        </el-row>
        <el-row class ="msg_item">
            <el-col :span= "8" >
                <div align="end"><span>联系公司：</span></div>
            </el-col>
            <el-col :span= "10" >
                <div class = "text"><span>{{com}}</span></div>
            </el-col>          
        </el-row>
        <el-row class ="msg_item">
            <el-col :span= "8" >
                <div align="end"><span>联系人：</span></div>
            </el-col>
            <el-col :span= "10" >
                <div class = "text"><span>{{name}}</span></div>
            </el-col>          
        </el-row>
                <el-row class ="msg_item">
            <el-col :span= "8" >
                <div align="end"><span>联系电话：</span></div>
            </el-col>
            <el-col :span= "10" >
                <div class = "text"><span>{{phone}}</span></div>
            </el-col>          
        </el-row>
                </el-row>
                <el-row class ="msg_item">
            <el-col :span= "8" >
                <div align="end"><span>联系地址：</span></div>
            </el-col>
            <el-col :span= "10" class = "text">
                <div ><span>{{addr}}</span></div>
            </el-col>          
        </el-row>


        		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :inline = "true":model="editForm" label-width="80px"  ref="editForm">
				<el-form-item label="联系公司" prop="com">
					<el-input v-model="editForm.com"  auto-complete="off" :maxlength = "20"></el-input>
				</el-form-item>
				<el-form-item label="联系人" prop="name">
					<el-input   v-model="editForm.name"  auto-complete="off" :maxlength = "10"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="phone">
					<el-input v-model="editForm.phone" auto-complete="off" :maxlength = "16"></el-input>
				</el-form-item>
				<el-form-item label="联系地址" prop="addr">
					<el-input v-model="editForm.addr" auto-complete="off" :maxlength = "30"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>



    </section> 
</template>

<script>
export default {
    data() {
        return {
            editLoading:false,
            com:'无',
            name:'无',
            phone:'无',
            addr:'无',
            editFormVisible:false,
            editForm:{
                com:'',
                name:'',
                phone:'',
                addr:''
            }
        }
    },
    methods:{
        checkNull(v){
            if(!v||v==''||v=='无') return '';
            else return v;
        },
        checkCtnString(c,v){
           
            if(!c||!v) return 0;
            if(c.indexOf(v)!=-1) return 1;
            else return 0;
        },
        checkEditSup(){
            if(this.checkCtnString(this.editForm.com,':')!=0||
              this.checkCtnString(this.editForm.name,':')!=0||
              this.checkCtnString(this.editForm.phone,':')!=0||
              this.checkCtnString(this.editForm.addr,':')!=0){
                  return false;
              }
              return true;
        },
        toEditSup(){
            return this.editForm.com+':'+this.editForm.name+':'+
                        this.editForm.phone+':'+this.editForm.addr;
        },
        splitSup( msg){
            var ss = ['无','无','无','无'];
            if(!msg||msg=='') return ss;
            var ts = msg.split(':');
            for(var i = 0;i<4;i++)
                ss[i] = this.checkNull(ts[i]);
            return ss;
        },
        editSupport(){
            this.editFormVisible = true;
            this.editForm.com = this.checkNull(this.com);
            this.editForm.name = this.checkNull(this.name);
            this.editForm.phone = this.checkNull(this.phone);
            this.editForm.addr = this.checkNull(this.addr);
        },
        editSubmit(){
            this.editLoading = true;
            console.log(this.editForm);
            if(!this.checkEditSup()){
                 this.editLoading = false;
                this.$message.error('错误输入，请确保未输入“:+/\[]&”等符号！'); 
                return ;
            }
            var _this = this;
            $.get(this.Constant.ajaxAddress+this.Constant.setSupport,
            {token:_this.$token,
            roleName:_this.toEditSup()})
            .done(function(data){
                _this.editLoading = false;
                console.log(data);
                if(data.errCode==20){//成功
                    _this.editFormVisible = false;
                    _this.$message('修改成功！');
                    _this.getSupport();
                }else if(data.errCode==21){//未知错误
                    _this.$message.error('修改失败，未知错误！'); 
                }else if(data.errCode==44){//
                    _this.$router.push('/login');
                }
            });


            
            
        },
        getSupport(){
            var _this = this;
            $.get(this.Constant.ajaxAddress+this.Constant.getSupport,
            {token:_this.$token})
            .done(function(data){
                console.log(data);
                if(data.errCode==20){//成功
                    //_this.$message('修改成功！');
                    var ss = _this.splitSup(data.roleName);
                    _this.com = ss[0];
                    _this.name = ss[1];
                    _this.phone = ss[2];
                    _this.addr = ss[3];
                }else if(data.errCode==21){//未知错误
                    _this.$message.error('获取失败，未知错误！'); 
                }else if(data.errCode==44){//
                    _this.$router.push('/login');
                }
            });


        }
    },
    mounted() {
        this.getSupport();
    }
 }
</script>


<style scoped lang="scss">
    .msg_item{
         margin-top: 20px
    }
    .text{
         border-bottom:1px solid black;
    }
    .grid-content{
        border-radius: 8px;
        min-height: 50px;
    }
    .top{
        margin-top: 50px
    }
</style>


