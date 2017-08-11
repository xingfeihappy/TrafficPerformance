<template>
	<section>

		<!--列表-->
		<el-table :data="dataDict" style="width: 100%;">
			<el-table-column type="index" label="类型ID" width="200" sortable>
			</el-table-column>
			<el-table-column prop="name" label="字典名称" width="200" sortable>
			</el-table-column>
			<el-table-column prop="typeS" label="字典含义" width="350" sortable>
			</el-table-column>
			
			<el-table-column label="操作" min-width="250">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="字典名称" prop="name">
					<el-input v-model="editForm.name":disabled = "true" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="字典含义">
					<el-input type="textarea" v-model="editForm.typeS"></el-input>
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
	import util from '../../common/js/util'
	//import { removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
	export default {
      data() {
        return {
			dataDict: [{
			  	index:'1',
			  	name:'货车',
			  	typeS:'小型（1-3），中型（3-5），大型（5-7）',
				token:''
          	}],
			editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入字典名称', trigger: 'blur' }
					]
			},
			//编辑界面数据
				editForm: {
					index: 0,
					name: '',
					typeS: '',
					token:''
				},
				
				
        }
      },
	  methods: {
		  //显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			
			//编辑
			editSubmit: function () {
				/*this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							this.para=para;
							editUser(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								//this.getUsers();
							});
						});
					}
				});*/
				var _this = this;
				this.$confirm('确认提交吗?', '提示', {
					type: 'info'
				}).then(() => {
				this.editLoading = true;
           		 $.get(this.Constant.ajaxAddress+this.Constant.getDataDictAjax,
				{ 
				  token:_this.$token}).done(function(data){
					if(data.errCode==20){
						_this.$token = null;
					}else{
						window.alert("提交失败")
					}
				})
				}).catch(() => {

				});
			},
		

		getDataFromService(){

		}


	  }
    }

</script>

<style scoped lang="scss">
@import '~scss_vars';

.colorPrimary{
	color: #fff;
	background-color: $color-primary;
    border-color: $color-primary;
}
.colorPrimary:hover{
	color: #fff;
	background-color: $color-primary-hover;
    border-color: $color-primary-hover;
}
</style>