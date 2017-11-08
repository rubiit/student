// 班级模块
		var Clazzes = {
			template:`
				<div>
				<el-tabs type="border-card">
					<el-tab-pane label="班级列表">
						<!-- 添加 -->
						<el-button type="text" @click='toSave'>单个录入</el-button>
						<el-button type="text">批量录入</el-button>
						<!-- 显示数据 -->
						 <el-table :data="clazzData" style="width: 100%">
						     <el-table-column
						        prop="cname"
						        label="班级名称">
						     </el-table-column>
						     <el-table-column
						        prop="sum"
						        label="班级总人数">
						     </el-table-column>
						     <!-- 将班级编号隐藏，在element ui table中不能使用v-show -->
						     <!-- <el-table-column
						        prop="class_id"
						        label="班级编号" v-if='show'>
						     </el-table-column> -->
						     <el-table-column label="操作">
							    <template scope="scope">
							        <el-button
							          size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							        <el-button
							          size="small"
							          type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
							    </template>
						    </el-table-column>
					    </el-table>


						<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
							<el-form :model="form">
							    <el-form-item label="班级名称">
							        <el-input v-model="form.name" auto-complete="off"></el-input>
							    </el-form-item>
							</el-form>
						    <div slot="footer" class="dialog-footer">
								<el-button @click="dialogFormVisible = false">取 消</el-button>
								<el-button type="primary" @click="submit">确 定</el-button>
						    </div>
						</el-dialog>
					</el-tab-pane>
					
					<el-tab-pane label="班级管理">班级管理</el-tab-pane>
				</el-tabs>

				</div>
			`,
			data:function(){
				return {
					show:false,
					title:'班级信息管理',
					dialogTitle:'',
					dialogFormVisible:false,
					clazzData:null,
					form:{}
				}
			},
			methods:{
				toSave:function(){
					this.dialogTitle = "录入班级信息";
					this.dialogFormVisible = true;
					this.form  = {};
				},
				submit:function(){
					var url = 'http://127.0.0.1:3000/clazz/update';
					if(this.dialogTitle == '录入班级信息'){
						url = 'http://127.0.0.1:3000/clazz/save';
					}

					var vm  = this;
					// var arr = this.form.birth.toLocaleDateString().split('/');
					// if(arr[1]<10 && arr[0]<10){
					// 	this.form.birth = arr[2]+"-0"+arr[0]+"-0"+arr[1];
					// }else if(arr[1]<10){
					// 	this.form.birth = arr[2]+"-"+arr[0]+"-0"+arr[1];
					// }else if(arr[0]<10){
					// 	this.form.birth = arr[2]+"-0"+arr[0]+"-"+arr[1];
					// }
					// this.form.birth = this.form.birth.toLocaleDateString();
					$.post(url,this.form,function(data){
						vm.dialogFormVisible = false;
						if(data.code){
							vm.$message({
					            type: 'success',
					            message: '操作失败！！！'
					        });
						}else{
							// 修改后刷新数据
							$.getJSON('http://127.0.0.1:3000/clazz/findAll',function(data){
								vm.clazzData = data;
								vm.$message({
						            type: 'success',
						            message: '操作成功!'
						        });
							});
						}
					});
				},
				// 编辑
				handleEdit:function(index,row){
					this.dialogFormVisible = true;
					this.dialogTitle = '修改班级信息';
					this.form = row;
					
				},
				// 删除  需要修后台数据库，为级联删除
				handleDelete:function(index,row){
					this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				        confirmButtonText: '确定',
				        cancelButtonText: '取消',
				        type: 'warning'
			        }).then(() => {
			        	var vm = this;
						$.post('http://127.0.0.1:3000/clazz/batchDelete',{
							ids:JSON.stringify([row.id])
						},function(data){
					        // 删除成功后，刷新数据
					        $.getJSON('http://127.0.0.1:3000/clazz/findAll',function(data){
								vm.clazzData = data;
								vm.$message({
						            type: 'success',
						            message: '删除成功!'
						        });
							});
						});
			        }).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '已取消删除'
			          });          
			        });     
				}
				
			},
			created:function(){
				var vm = this;
				$.getJSON('http://127.0.0.1:3000/clazz/findAll',function(data){
					// console.log(data);
					vm.clazzData = data;
				});
				
			}

		};