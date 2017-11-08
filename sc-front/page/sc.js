// 选课模块
		var StudentCourse = {
			template:`
				<div>
				<el-tabs type="border-card">
					<el-tab-pane label="选课列表">
						<!-- 添加 -->
						<el-button type="text" @click='toSave'>单个录入</el-button>
						<el-button type="text">批量录入</el-button>
						<!-- 显示数据 -->
						 <el-table :data="scData" style="width: 100%">
						     <el-table-column
						        prop="sname"
						        label="姓名">
						     </el-table-column>
						     <el-table-column
						        prop="cname"
						        label="课程名">
						     </el-table-column>
						     <el-table-column
						        prop="credit"
						        label="课程学分">
						     </el-table-column>
						     <el-table-column
						        prop="grade"
						        label="成绩">
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
							          type="danger" @click="handleDelete(scope.$index, scope.row)">取消选课</el-button>
							    </template>
						    </el-table-column>
					    </el-table>

					</el-tab-pane>

					<el-tab-pane label="个人选课">
						<el-table :data="CourseDate" style="width: 100%">
						    <el-table-column
						        prop="name"
						        label="课程名称">
						    </el-table-column>
						    <el-table-column
						        prop="credit"
						        label="课程学分">
						    </el-table-column>
						    <el-table-column
						        prop="csum"
						        label="报名人数">
						    </el-table-column>
						    <el-table-column
						        prop="sur"
						        label="剩余名额">
						    </el-table-column>
						    <!-- 将班级编号隐藏，在element ui table中不能使用v-show -->
						    <el-table-column
						        prop="cid"
						        label="课程编号" v-if='show'>
						    </el-table-column>
						    <el-table-column label="操作">
							    <template scope="scope">
							        <el-button
							          size="small" @click="onSubmit(scope.$index, scope.row)">选修</el-button>
							    </template>
						    </el-table-column>
					    </el-table>
					</el-tab-pane>
				</el-tabs>

				</div>
			`,
			data:function(){
				return {
					show:false,
					title:'选课信息管理',
					dialogTitle:'',
					dialogFormVisible:false,
					scData:null,
					form:{},
					scform:{},
					courses:null,
					CourseDate:null,
				}
			},
			methods:{
				// 选修课程
				onSubmit:function(index,row){
					var url = 'http://127.0.0.1:3000/sc/selectCourse';
					var vm = this;
					vm.$prompt('请输入你的学号', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消'
			        }).then(({ value }) => {
			        	// 分别获取选课学生的id value和他所选修的这门课程的id cid
				        $.post(url,{sid:value,cid:row.cid},function(data){
						if(data.code){
							vm.$message({
					            type: 'success',
					            message: '操作失败！！！'
					        });
						}else{
							// 插入后刷新数据
							$.getJSON('http://127.0.0.1:3000/sc/findCourse',function(data){
								// console.log(data);
								// 已经将出生日期的类型改为varchar类型
								// 设定每门选修课的总共报名人数为60人，减去已报名人数，为剩余名额sur
								data.forEach(function(item,index){
									item.sur = 60-item.csum;
								});
								vm.CourseDate = data;
								vm.$message({
						            type: 'success',
						            message: '操作成功!'
						        });
							})
						}
					});
			        }).catch(() => {
				        vm.$message({
				            type: 'info',
				            message: '取消输入'
				        });       
			        });
				},
				toSave:function(){
					this.dialogTitle = "录入课程信息";
					this.dialogFormVisible = true;
					this.form  = {};
				},
				submit:function(){
					var url = 'http://127.0.0.1:3000/sc/update';
					if(this.dialogTitle == '录入课程信息'){
						url = 'http://127.0.0.1:3000/sc/save';
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
							$.getJSON('http://127.0.0.1:3000/sc/findAll',function(data){
								vm.scData = data;
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
					this.dialogTitle = '修改课程信息';
					this.form = row;
					
				},
				// 删除
				handleDelete:function(index,row){
					this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				        confirmButtonText: '确定',
				        cancelButtonText: '取消',
				        type: 'warning'
			        }).then(() => {
			        	var vm = this;
						$.post('http://127.0.0.1:3000/sc/cancelCourse',{
							sid:JSON.stringify([row.student_id]),
							cid:JSON.stringify([row.course_id])
						},function(data){
					        // 删除成功后，刷新数据
					        $.getJSON('http://127.0.0.1:3000/sc/findAll',function(data){
								vm.scData = data;
								vm.$message({
						            type: 'success',
						            message: '取消选课成功!'
						        });
							});
						});
			        }).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '已取消'
			          });          
			        });     
				}
				
			},
			created:function(){
				var vm = this;
				$.getJSON('http://127.0.0.1:3000/sc/findAll',function(data){
					// console.log(data);
					vm.scData = data;
				});
				$.getJSON('http://127.0.0.1:3000/course/findAll',function(data){
					// console.log(data);
					// 已经将出生日期的类型改为varchar类型
					vm.courses = data;
				});
				$.getJSON('http://127.0.0.1:3000/sc/findCourse',function(data){
					// console.log(data);
					// 已经将出生日期的类型改为varchar类型
					// 设定每门选修课的总共报名人数为60人，减去已报名人数，为剩余名额sur
					data.forEach(function(item,index){
						item.sur = 60-item.csum;
					});
					vm.CourseDate = data;

				})
			}


		};