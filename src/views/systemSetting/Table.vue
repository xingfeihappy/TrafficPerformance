<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
				<el-form-item>
					<el-button type="primary" @click="handleAdd" class="colorPrimary">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="roleName" label="所属单位编号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="roleTypeName" label="角色" width="100" sortable>
			</el-table-column>
			<el-table-column prop="upAhth" label="注册日期" width="120" sortable>
			</el-table-column>
			<el-table-column prop="p1_p2" label="权限范围" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :inline = "true":model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" :disabled="true" auto-complete="off" class = "itemWidth"></el-input>
				</el-form-item>
				<el-form-item label="用户名" prop="userName">
					<el-input v-model="editForm.userName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password" type = "password">
					<el-input v-model="editForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="rePassword">
					<el-input v-model="editForm.rePassword" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系方式" prop="phone">
					<el-input v-model="editForm.phone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组织名称" prop="roleName">
					<el-input v-model="editForm.roleName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="注册日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="组织类型">
					<el-select v-model="addForm.roleType" placeholder = "请选择"  class = "itemWidth">
						<el-option key = "企业" label = "企业" value = "企业"></el-option>
						<el-option key = "交通厅" label = "交通厅" value = "交通厅"></el-option>
						<el-option key = "运管" label = "运管" value = "运管"></el-option>
						<el-option key = "港航" label = "港航" value = "港航"></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="行政级别">
				<div class="bottom">
					<el-tooltip class="item" effect="dark" content="Left Top 提示文字" placement="left-start">
			      		<el-select v-model="editForm.place1" placeholder = "请选择"  class = "itemWidth">
							<el-option key = "杭州市" label = "杭州市" value = "杭州市"></el-option>
							<el-option key = "宁波市" label = "宁波市" value = "宁波市"></el-option>
						</el-select>
			    	</el-tooltip>
		    		<el-tooltip class="item" effect="dark" content="Left Top 提示文字" placement="left-start">
						<el-select v-model="editForm.place2" placeholder = "请选择"  class = "itemWidth">
							<el-option key = "桐庐县" label = "桐庐县" value = "桐庐县"></el-option>
							<el-option key = "淳安县" label = "淳安县" value = "淳安县"></el-option>
							<el-option key = "宁海县" label = "宁海县" value = "宁海县"></el-option>
						</el-select>
					</el-tooltip>
		    	</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :inline= "true":model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off" class = "itemWidth"></el-input>
				</el-form-item>
				<el-form-item label="用户名" prop="userName">
					<el-input v-model="addForm.userName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password" type = "password">
					<el-input v-model="addForm.password" auto-complete="off" id = "password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="rePassword">
					<el-input v-model="addForm.rePassword" auto-complete="off" id = "rePassword"></el-input>
				</el-form-item>
				<el-form-item label="联系方式" prop="phone">
					<el-input v-model="addForm.phone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组织名称" prop="roleName">
					<el-input v-model="addForm.roleName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="注册日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="组织类型">
					<el-select v-model="addForm.roleType" placeholder = "请选择"  class = "itemWidth">
						<el-option key = "企业" label = "企业" value = "企业"></el-option>
						<el-option key = "交通厅" label = "交通厅" value = "交通厅"></el-option>
						<el-option key = "运管" label = "运管" value = "运管"></el-option>
						<el-option key = "港航" label = "港航" value = "港航"></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="行政级别">
				<div class="bottom">
					<el-tooltip class="item" effect="dark" content="Left Top 提示文字" placement="left-start">
			      		<el-select v-model="addForm.place1" placeholder = "请选择"  class = "itemWidth">
							<el-option key = "杭州市" label = "杭州市" value = "杭州市"></el-option>
							<el-option key = "宁波市" label = "宁波市" value = "宁波市"></el-option>
						</el-select>
			    	</el-tooltip>
		    		<el-tooltip class="item" effect="dark" content="Left Top 提示文字" placement="left-start">
						<el-select v-model="addForm.place2" placeholder = "请选择"  class = "itemWidth">
							<el-option key = "桐庐县" label = "桐庐县" value = "桐庐县"></el-option>
							<el-option key = "淳安县" label = "淳安县" value = "淳安县"></el-option>
							<el-option key = "宁海县" label = "宁海县" value = "宁海县"></el-option>
						</el-select>
					</el-tooltip>
		    	</div>
				</el-form-item>
				
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				users: [],
				listLoading: false,

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					// name: [
					// 	{ required: true, message: '请输入姓名', trigger: 'blur' }
					// ]
					userName: [
						{ required: true, message: '请输入用户名', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
					rePassword: [
						{ required: true, message: '请输入确认密码', trigger: 'blur' }
					],
					roleName: [
						{ required: true, message: '请输入组织名称', trigger: 'blur' }
					],
					roleType: [
						{ required: true, message: '请输入组织类型', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					password: '',
					rePassword:'',
					phone:'',
					roleName:'',
					// age: 0,
					birth: '',
					addr: '',
					place1:'',
					place2:'',
					options:'企业',
					value:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					userName: [
						{ required: true, message: '请输入用户名', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
					rePassword: [
						{ required: true, message: '请输入确认密码', trigger: 'blur' }
					],
					roleName: [
						{ required: true, message: '请输入组织名称', trigger: 'blur' }
					],
					roleType: [
						{ required: true, message: '请输入组织类型', trigger: 'blur' }
					]

				},
				//新增界面数据
				addForm: {
					name: '',
					userName:'',
					password: '',
					rePassword:'',
					phone:'',
					roleName:'',
					// age: 0,
					birth: '',
					addr: '',
					place1:'',
					place2:'',
					roleType:[{
						value:"选项1",
						label:"企业"
					},{
						value:"选项2",
						label:"交通厅"
					},{
						value:"选项3",
						label:"运管"
					},{
						value:"选项4",
						label:"港航"
					}],
					value:''
				}
			}
		},
		methods: {
			decoRoleType(roleType){
				if(!roleType) return '';
				if(roleType==='R_TRA') return '交通厅';
				else if(roleType==='R_LAN')  return '运管';
				else if(roleType==='R_WAT')  return '港行';
				else if(roleType==='R_ENT')  return '企业';
				else return roleType;
			},
			decoPlace(place1,place2){
				if((!place1||place1=='')&&(!place2||place2=='')) return '浙江省';
				else if(place1&&place2!=''&&(!place2||place2=='')) return place1;
				else if(place1&&place2&&place1!=''&&place2!='') return place1+'市'+place2;
			},
			setUserList(res){
				var usersre = res.users;
				var _this = this;
				usersre.forEach(function(user) {
					user.roleTypeName = _this.decoRoleType(user.roleType);
					user.p1_p2 = _this.decoPlace(user.place1,user.place2);
					_this.users.push(user);
				});
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				var _this = this;
				$.get(this.Constant.ajaxAddress+this.Constant.getUserListAjax,
					{token:_this.$token}).done(function(data){
						_this.listLoading = false;
						console.log(data);
						_this.setUserList(data);
					});
				
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					userName:'',
					password: '',
					rePassword:'',
					phone:'',
					place1:'',
					place2:'',
					roleName:'',
					// age: 0,
					birth: '',
					addr: '',
					roleType:[]
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		mounted() {
			this.getUsers();
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
.itemWidth{
	width:190px;
}

</style>