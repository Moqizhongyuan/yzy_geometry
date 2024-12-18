# [2.3.0](https://github.com/Moqizhongyuan/yzy_geometry/compare/v2.2.0...v2.3.0) (2024-12-13)

### Bug Fixes

- 删除无用代码，增加平滑切换主题效果 ([cd672c9](https://github.com/Moqizhongyuan/yzy_geometry/commit/cd672c94b9f404b0806d7b0adc96c795265a586e))

### Features

- 对代码做降级处理 ([54fb62f](https://github.com/Moqizhongyuan/yzy_geometry/commit/54fb62f1b30d1166a9d58e93acaa7111075bf034))
- 对无法显示webp的浏览器进行兼容处理 ([d81edc7](https://github.com/Moqizhongyuan/yzy_geometry/commit/d81edc71d6c3066ffeb87d2726d0d92e05af5d86))
- 实现样式控制器的实时反馈 ([47632e6](https://github.com/Moqizhongyuan/yzy_geometry/commit/47632e6337db007d5ab0401f0044b2e134ef525d))
- 添加填充和描边样式选择接口 ([cebe89c](https://github.com/Moqizhongyuan/yzy_geometry/commit/cebe89c65bb27f7260da1dc2de824b8a6d3a54db))
- 添加椭圆类，并给用户绘制接口 ([6604825](https://github.com/Moqizhongyuan/yzy_geometry/commit/66048251f43e11cfe4c457ec7adff194a739c01f))

# [2.2.0](https://github.com/Moqizhongyuan/yzy_geometry/compare/v2.1.0...v2.2.0) (2024-12-12)

### Bug Fixes

- 添加index确保scene的render顺序正常 ([04584f8](https://github.com/Moqizhongyuan/yzy_geometry/commit/04584f849af0278bc58b6a784d6442f43442cdc1))

### Features

- 添加取色板组件 ([d901334](https://github.com/Moqizhongyuan/yzy_geometry/commit/d9013349029787e12ce46a3e94b6e265f7bd41a6))
- 添加suspense居中样式 ([eac005e](https://github.com/Moqizhongyuan/yzy_geometry/commit/eac005e99c14d96dbe3301a3ade04ed4e0ed19d7))
- 引入异步更新机制，在绘制同样图片数量的情况下inp指标提升了约20倍 ([6d65d23](https://github.com/Moqizhongyuan/yzy_geometry/commit/6d65d23c74f4ad107a3bade2ca1a28e21a303743))
- 增加404页面&icon ([709590d](https://github.com/Moqizhongyuan/yzy_geometry/commit/709590db61fb96497f12e959666da281bb28b290))

# [2.1.0](https://github.com/Moqizhongyuan/yzy_geometry/compare/v2.0.0...v2.1.0) (2024-12-10)

### Bug Fixes

- 修复了文字基线偏移之后节点绘制不准的bug ([2501ae6](https://github.com/Moqizhongyuan/yzy_geometry/commit/2501ae6e077b458b8428dc6408116482b0759544))

### Features

- 对test注入全局变量 ([59f54b1](https://github.com/Moqizhongyuan/yzy_geometry/commit/59f54b14e8b65fe56ce0e9e8dedfe9e8fef3b7b0))
- 绘制矩形类 ([e2d94e7](https://github.com/Moqizhongyuan/yzy_geometry/commit/e2d94e7113ba2746b07e07dd99e41847ff819bcc))
- 将矩形绘制接口暴露给用户，并将矩形绘制添加到图层控制 ([ad5d436](https://github.com/Moqizhongyuan/yzy_geometry/commit/ad5d436bc2398378d5a255f2d0df7a52b1d96b09))
- 设计文字类 ([c56c0c7](https://github.com/Moqizhongyuan/yzy_geometry/commit/c56c0c7c403c952b4ca680748704b8f51a0bb2ab))
- 向用户提供文字绘制接口 ([6faabac](https://github.com/Moqizhongyuan/yzy_geometry/commit/6faabac2fcc21bfb032925bbcc7507692f4ff196))
- 增加文字绘制功能 ([8d2355b](https://github.com/Moqizhongyuan/yzy_geometry/commit/8d2355b9c94e7b3ee1b89df504268ed8ab8c71da))

# [2.0.0](https://github.com/Moqizhongyuan/yzy_geometry/compare/v1.1.0...v2.0.0) (2024-12-08)

### Bug Fixes

- 将rect类添加到group子元素中，解决了缩放画布线条失真的问题 ([bf27939](https://github.com/Moqizhongyuan/yzy_geometry/commit/bf27939bd47a6cf2e62e0d4b5acece3ac70e725f))
- 解决了组件频繁刷新的问题 ([a7fbb8a](https://github.com/Moqizhongyuan/yzy_geometry/commit/a7fbb8ae175588817b79ffe2081ae89087aafdc3))
- 修复了无背景模式下重复绘制矩形的bug ([0055ec7](https://github.com/Moqizhongyuan/yzy_geometry/commit/0055ec788305e8728db49f4c0f8b15f84b83cefb))

### Features

- 对绘图逻辑进行进一步抽取 ([12b72bd](https://github.com/Moqizhongyuan/yzy_geometry/commit/12b72bd3226de60fcf298d571db5b52ca31972b9))
- 画布缩放基于鼠标位置 ([933085b](https://github.com/Moqizhongyuan/yzy_geometry/commit/933085bccb8c3ab3bfcb49f206d8c967b1ba60f3))
- 加载本地图片 ([248a746](https://github.com/Moqizhongyuan/yzy_geometry/commit/248a74631fb8d1c7b0f74ce4dc37a448478c0789))
- 可见切换 ([4ea9f2d](https://github.com/Moqizhongyuan/yzy_geometry/commit/4ea9f2d3e421d0cc69dbbbf4bbd22747800316b6))
- 设置可见按钮样式 ([943e4f8](https://github.com/Moqizhongyuan/yzy_geometry/commit/943e4f8d45c1d9e56508b149b5ac7ae704701893))
- 支持上传本地图片 ([a183401](https://github.com/Moqizhongyuan/yzy_geometry/commit/a183401f7d2dcbc85465325e18375db179e4cdbd))
- 支持图层选中和变换 ([2f42cc3](https://github.com/Moqizhongyuan/yzy_geometry/commit/2f42cc3f8a4df776b878ae42ed0775154f6d2ad0))
- 支持图层选中和删除 ([3f7c145](https://github.com/Moqizhongyuan/yzy_geometry/commit/3f7c14585993a74ffb95624688045a92fb9a1c58))

# [1.1.0](https://github.com/Moqizhongyuan/yzy_geometry/compare/v1.0.0...v1.1.0) (2024-12-06)

### Bug Fixes

- 修复矩形边框多次绘制的bug，但是无背景状态下图形绘制有误 ([d2a5b3b](https://github.com/Moqizhongyuan/yzy_geometry/commit/d2a5b3b0a3970f0798a238f65a08897e07fd5cea))
- 修复矩形在相机变换下的bug ([711556d](https://github.com/Moqizhongyuan/yzy_geometry/commit/711556df629c52c2d00cbf2a5ebed893954a201b))

### Features

- 路由搭建、修复了删除图形后drawer更新错误的bug ([22bd5d8](https://github.com/Moqizhongyuan/yzy_geometry/commit/22bd5d8971448d787dc65967332d9d86d46fcf27))
- 实现侧边栏主题切换，且页面有多个tab的时候可以做到响应 ([5c872c1](https://github.com/Moqizhongyuan/yzy_geometry/commit/5c872c111c2c1d38683ccadf9d6565b0a6e4fc6c))
- 添加路由，对鼠标样式进行调整，外加图形变换边框 ([2147e70](https://github.com/Moqizhongyuan/yzy_geometry/commit/2147e70345b3d1dafbef2eea3a07df268f2c83d8))
- 添加主题切换功能 ([57651af](https://github.com/Moqizhongyuan/yzy_geometry/commit/57651af0cd9ef23d098fe96ca178afb6e681248c))
- 通过cdn方式引入icon ([726271d](https://github.com/Moqizhongyuan/yzy_geometry/commit/726271d8e7832949d8fb9da463db175559f223c7))
- 文档编写、线上部署 ([8f6f345](https://github.com/Moqizhongyuan/yzy_geometry/commit/8f6f345fb3b36e13b990231da2aca791f471599b))
- 主题切换组件 ([847b509](https://github.com/Moqizhongyuan/yzy_geometry/commit/847b509fd040049e78774b73642a9ba7d11b0aac))
- 主题样式调整、组件封装、项目结构调整 ([c1022b0](https://github.com/Moqizhongyuan/yzy_geometry/commit/c1022b01adfb706a532ad145333f83fa3a5422eb))
- 主题主题变换 ([d736071](https://github.com/Moqizhongyuan/yzy_geometry/commit/d73607151529c881b7996a55f260e7afff9d950a))

# 1.0.0 (2024-12-05)

### Bug Fixes

- 修改release文件 ([5b486e4](https://github.com/Moqizhongyuan/yzy_geometry/commit/5b486e439b23918fddb84b43ccca34bce0f389b8))

### Features

- 背景&矩形类 ([54e9d4b](https://github.com/Moqizhongyuan/yzy_geometry/commit/54e9d4bded2ada1abbcc4b9f435dca16973050bf))
- 测试功能&基础类的构建 ([8e40630](https://github.com/Moqizhongyuan/yzy_geometry/commit/8e40630704f6be8b21c21aca44b79fe1f0ed4735))
- 搭建用户界面，实现交互绘制矩形，矩形可以变换，且不会失真 ([d6c7420](https://github.com/Moqizhongyuan/yzy_geometry/commit/d6c7420826d804baa9d8c0e2c60cd35f868781ca))
- 代码提交规范工具 ([0ba67fc](https://github.com/Moqizhongyuan/yzy_geometry/commit/0ba67fc0497615616d04b0af8be6da0f1e19c544))
- 构建项目 ([626dfb8](https://github.com/Moqizhongyuan/yzy_geometry/commit/626dfb88eb73790614f8fe76478a003c525082f7))
- 集成tailwind ([2ac221a](https://github.com/Moqizhongyuan/yzy_geometry/commit/2ac221a71f03ac30f6d434b1f5e057294c1be477))
- 矩形的变换 ([56e6b02](https://github.com/Moqizhongyuan/yzy_geometry/commit/56e6b02e167908614c38b9eecdc003006eb22638))
- 控制器类 ([3e5230d](https://github.com/Moqizhongyuan/yzy_geometry/commit/3e5230dd6a16db28f0b51c4ff8928db4d885982c))
- 数学方法封装（向量、矩阵) ([7de1ce0](https://github.com/Moqizhongyuan/yzy_geometry/commit/7de1ce03eded91bcd62e9671b2a3d29388d8468b))
- 数学工具编写、EventDispatch基类的编写（+测试案例） ([92ee229](https://github.com/Moqizhongyuan/yzy_geometry/commit/92ee229b3535069a078982ba2adc9531ed86fbba))
- 提交规范工具 ([fed7b62](https://github.com/Moqizhongyuan/yzy_geometry/commit/fed7b62333e961c23d02919e388d609871fd586e))
- 添加group类，修复了之前更新坐标轴之后子对象没有更新的bug ([28e338a](https://github.com/Moqizhongyuan/yzy_geometry/commit/28e338ac409963fece9a4ac4d1f6f39140dcd8ee))
- 新增图片类 ([2b37845](https://github.com/Moqizhongyuan/yzy_geometry/commit/2b378454b0d1751176016601ac4376ed7832bcfa))
- 增加antDesign组件库 ([c616c12](https://github.com/Moqizhongyuan/yzy_geometry/commit/c616c12d505bb57fd9e22d018114df58c64237c1))
- canvas挂载、绘制背景hook ([aaf6264](https://github.com/Moqizhongyuan/yzy_geometry/commit/aaf626407e011b9aa8dde512a62d2e1b3efa15b2))
- imgcontroller、imgtransformer、mouseshape、oribitcontroller、frame封装 ([1e06dcb](https://github.com/Moqizhongyuan/yzy_geometry/commit/1e06dcbc75ee19b1077f037c17f9f18479bf5563))
- object2d类和scene类 ([9d130a8](https://github.com/Moqizhongyuan/yzy_geometry/commit/9d130a808251263cedb81ff384b730b783051740))
