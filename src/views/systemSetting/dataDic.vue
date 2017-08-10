<template>
<section>
	<!-- 工具条 -->
	<el-col :span = "24" class = "toolbar" style = "padding-bottom:0">
		<el-form :inline = "true" >
			<el-form-item><el-input placeholder = "字典"></el-input></el-form-item>
			<el-form-item><el-button type = "primary" class="colorPrimary">查询</el-button></el-form-item>
			<el-form-item><el-button type="primary" @click="handleAdd" class="colorPrimary">新增</el-button>
			</el-form-item>
		</el-form>
	</el-col>
	<!-- 列表 -->
	<el-table highlight-current-row v-loading = "listLoading"  @selection-change="selsChange" style="width: 100%;">
		<el-table-column type = "index" width = "60px"></el-table-column>
		<el-table-column prop = "name" label = "类型名称" width = "120px" sortable></el-table-column>
		<el-table-column prop = "dicValue" label = "类型值" width = "120px" sortable></el-table-column>
		<el-table-column label="操作" width="150">
			<template scope="scope">
				<el-button size="small" >编辑</el-button>
				<el-button type="danger" size="small" >删除</el-button>
			</template>
		</el-table-column>
	</el-table>
</section>
</template>
<script>
	import util from '../../common/js/util'
	export default{
		data(){
			
		},
		methods: {

		},
		mounted(){

		}
	}
</script>
<style scoped lang = "scss">
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
