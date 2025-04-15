### 模型预测结果见文件：预测结果_oia_224_224_1.xlsx


### 程序流程图




### 程序架构图



### api接口设计
-用户模块
  1. 用户登陆接口，包括用户名和密码，返回一个jwt令牌。(完成)
  2. 用户修改个人信息接口，包括用户id，用户名，密码，电话，邮箱，住址，性别。（完成）
-患者模块
  1. 新增患者接口（患者信息）
  2. 删除患者接口（患者id）
  3. 修改患者信息接口（患者id,患者信息）
  4. 查询患者信息接口（患者id）
  5. 分页查询患者信息接口（用户id,页码,每页数量,患者名字或电话（模糊匹配））
-就诊记录模块
  1. 新增就诊记录接口（患者id,记录信息）
  2. 删除就诊记录接口（患者id,记录id）
  3. 修改就诊记录接口（患者id,记录id，修改后的记录信息）
  4. 分页查询就诊记录接口（患者id,页码,每页数量）
-管理模块
  1. 分页查看所有用户接口（用户id,页码,每页数量）
  2. 分页查看所有患者信息接口（用户id,页码,每页数量）
  3. 分页查看所有就诊记录信息接口（用户id,页码,每页数量）
-AI模块
  1. 调用AI接口（给出诊断结果，或者患者信息相关，如果要生成病历的话）。
-眼底疾病识别模块
  1.眼底识别接口（图片，患者id）

### 程序设计
#### 1. 系统架构
- 后端：nodejs(v20.5.0)+express(4.21.1)+mysql(8.0.37)
- 中间件：cors(用于跨域请求)+json(解析json格式数据)+expressJwt(用于jwt令牌验证)+bcriptjs(用于密码加密与解密)+joi(用于数据验证)+multer(用于文件上传)+使用morgan中间件，将日志信息写入文件

#### 2. 功能模块
- 用户管理：
    - 医生
      - 登陆
      - 修改个人信息
      - 查看个人信息
    - 管理员
      - 管理平台的所有数据
- 患者管理：对患者基本信息的增删改查。
- 就诊记录管理：根据眼底识别的结果，对患者的就诊记录进行增删改查。
- AI模块管理：
  - 针对患者的疾病，给出基本建议或者生成病例。
- 眼底疾病识别管理：
  - 选择入库的患者，本地上传该患者的眼底图片进行，返回检测结果。
- 大屏展示
  -展示各种眼部疾病的地区分布
  -展示眼部疾病在不同年龄阶段，不同性别的发病情况
  -展示患者的治疗过程
  -展示患者的治疗费用情况

#### 3. 数据库设计
如下：  
用户信息表：  user_info  
>
Name	Code	Data Type	Length	Precision	Primary	Foreign Key	Mandatory  
名字	name	varchar(20)	20		FALSE	FALSE	FALSE  
用户名	username	varchar(32)	32		FALSE	FALSE	FALSE（不能为空）  
密码	password	varchar(32)	32		FALSE	FALSE	FALSE（不能为空）  
用户id	id	varchar(50)	50		TRUE	FALSE	TRUE（不能为空）  
用户类型	type	smallint			FALSE	FALSE	FALSE （不能为空）（0为医生，1为管理）  
电话	phone	char(11)	11		FALSE	FALSE	FALSE  
邮箱	email	varchar(20)	20		FALSE	FALSE	FALSE  
住址	address	varchar(50)	50		FALSE	FALSE	FALSE  
性别	sex	smallint			FALSE	FALSE	FALSE （0为女，1为男）  
> 

患者信息表：  patient_info  
>
Name	Code	Data Type	Length	Precision	Primary	Foreign Key	Mandatory  
患者id	patient_id	varchar(50)	50		TRUE	FALSE	TRUE （不能为空）  
用户id	id	varchar(50)	50		FALSE	TRUE	FALSE （不能为空）  
姓名	patient_name	varchar(20)	20		FALSE	FALSE	FALSE （不能为空）  
电话	patient_phone	char(11)	11		FALSE	FALSE	FALSE  
住址	patient_address	varchar(50)	50		FALSE	FALSE	FALSE （不能为空）  
性别	patient_sex	smallint			FALSE	FALSE	FALSE （不能为空）  
年龄	patient_age	numeric(8,0)	8		FALSE	FALSE	FALSE （不能为空）  
>

就诊记录表：medical_record
>
Name	Code	Data Type	Length	Precision	Primary	Foreign Key	Mandatory
诊断结果	result	varchar(5000)	5,000		FALSE	FALSE	FALSE
治疗意见	advice	varchar(5000)	5,000		FALSE	FALSE	FALSE
费用	cost	varchar(50)	50		FALSE	FALSE	FALSE
就诊时间	record_time	varchar(32)	32		FALSE	FALSE	FALSE
治疗状态	cure_state	varchar(32)	32		FALSE	FALSE	FALSE
记录ID	record_id	varchar(50)	50		TRUE	FALSE	TRUE
患者id	patient_id	varchar(50)	50		FALSE	TRUE	FALSE
检查项目	check_items	varchar(32)	32		FALSE	FALSE	FALSE
眼底照片左	left_eye	varchar(100)	100		FALSE	FALSE	FALSE
眼底照片右	right_eye	varchar(100)	100		FALSE	FALSE	FALSE

### 问题记录
1. 未授权问题  
好像是token认证unless函数里面写出不需要token的路由  
2. 用户角色权限认证，自定义中间件，
    注意jwt.vertify可以验证token，进行解析，注意此时token不需要包含bearer，所以需要去掉
3. multer中间件，上传文件，需要指定文件类型，否则会报错.
4. 存储引擎为本地磁盘，当前端要数据的时候，查询到所有信息之后，把图片的url存储到数据库中，然后前端通过url来获取图片，但是url是相对路径，所以需要把url拼接上服务器地址，这样前端才能获取到图片。或者使用base64的格式直接返回给前端，这样更加方便。
5. 部署问题，版本最好一致，此次对于mysql版本不一致，导致编码识别失败,需要将编码中的utf8mb4_0900_ai_ci 全部 utf8mb4_unicode_ci，数据库失败，另外对于node的包的问题，最好也一致使用20.5.0的版本，pcakage.json中script标签用于指定启动命令。最后记得开放服务器端口  。还有node里面的地址要写成0.0.0.0，同时端口号改成81。
6.  

### 编写记录
- 2025.3.3
  - 今天完成了项目的部署，同时把用户对于自身信息的更新包括身份信息更新等以及密码修改功能完成。
  - 完成眼底图库的批量上传，以及单个上传，还有批量删除等功能，以及对于眼底图库的查询功能。
- 3.10
  - 简单完成智GLMai的接入
- 3.23
  - todolist
    - 修改数据库，给患者多加一个治疗建议的字段，同时修改相应的接口。ok
    - 给所有的分页查询都带上totals。ok
    - 把前端数据可视化需要的接口写了。ok
- 3.24
  - 部署



### 学习记录
- 2025.3.3
  - 今天学习了multer如何配置文件上传的中间件，首先定义存储引擎，存储引擎的定义包括文件名的存储格式，以及存储地址。然后配置上传的文件大小和文件个数的限制，最后将对象暴露出去，在路由中使用该中间件
  - 学习了如何使用base64格式将图片返回给前端，这样前端就可以直接使用base64的格式来展示图片，不需要使用url来获取图片。
  - 学习怎么用fs模块将本地文件删除，主要在于fs.unlinkSync(path)函数的使用，其中path为文件的路径，使用该函数可以删除指定路径的文件。
  - 学习了如何将项目部署到云服务器，主要是将项目文件（不包括nodeMoudels文件）上传，同时使用npm init命令下载依赖包。同时将数据库内容转换为sql语句，上传数据库。

