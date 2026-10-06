# PyAutoLens 可视化工作台

**简体中文** | [English](README.md)

基于 [PyAutoLens](https://github.com/PyAutoLabs/PyAutoLens) 的独立社区可视化工作台：在浏览器中探索强引力透镜的三维几何、调整模型参数、计算科研图像并导出原生数值数据。

由 [SiriusFzh](https://github.com/SiriusFzh) 开发和维护，支持 **macOS 与 Windows**，提供 **中文 / English 界面**。科学计算在本机 Python 环境中完成，界面通过 localhost 接收结果。

> 本项目使用 PyAutoLens 作为透镜物理计算引擎。PyAutoLens 及其科学方法的贡献属于原开发团队。本工作台是独立的社区项目，目前没有获得官方背书，也未合并到原仓库。

## 这个工作台能做什么？

把“改变质量、源位置或观测条件，会看到什么？”变成可直接操作的实验。适合课堂演示、自学强透镜、构型探索，以及在编写分析脚本前检查正向模型。

| 工作区 | 可以完成的任务 |
| --- | --- |
| 三维几何 | 旋转薄透镜教学场景、拖动源位置、观察光线和平面，比较浏览器近似预览与 PyAutoLens 数值图 |
| 观测与诊断图 | 查看模拟观测、模型、源平面、噪声、残差与逐像素 χ² |
| 科研产品库 | 按 5 类查看 31 个实时计算产品，下载单图或整组数据 |
| 快速拟合 | 锁定合成观测，选择 1–5 个参数，用有界最小二乘探索参数恢复 |

### 1. 交互式三维教学

![工作台首页与三维几何](docs/screenshots/01-geometry.jpg)

*首页把左侧模型参数、三维源位置、浏览器预览和 PyAutoLens 数值图连接在同一份模型状态中。截图为默认英文界面，右上角可切换中文。*

- 三个镜头视角：宇宙透视、偏折侧视、观察者视角。
- 控制光线数量，显示或隐藏物理平面、透镜 / 源平面、光线路径与角度距离注释。
- 在三维场景中拖动背景源；左侧参数和二维科学图同步更新。
- 并列显示快速的浏览器近似预览和本机 PyAutoLens 精确数值计算图。后端计算期间保留上一帧，显示计算状态。
- 四个起始构型：**爱因斯坦环、近轴双弧、离轴双像、爱因斯坦十字**。预设填写模型参数，随后重新计算图像。

### 2. 参数驱动的正向模拟

32 个参数分为四组，界面按需展开：

| 参数组 | 可调整内容 |
| --- | --- |
| 平面与质量模型 | 透镜 / 源红移、SIS / SIE / SIE + 外部剪切、透镜中心、爱因斯坦半径、质量轴比和位置角、剪切分量 |
| 前景透镜星光 | 是否加入透镜星光、强度、有效半径、Sérsic 指数、轴比、位置角 |
| 背景源星系 | 源模型、中心位置、强度、有效半径、Sérsic 指数、轴比、位置角 |
| 望远镜、噪声与掩膜 | 图像采样、像素尺度、高斯 PSF、曝光时间、天空背景、泊松噪声、随机种子、圆形掩膜 |

拖动时由浏览器即时预览；停止后，Python 后端调用 PyAutoLens `Tracer` 重新计算。科学图来自当前参数的模型计算。

### 3. 观测与诊断图

![观测与诊断图工作区](docs/screenshots/02-observation.jpg)

在大图中查看选中的观测、模型或透镜物理量，切换科研色表、对数拉伸与掩膜叠加，并直接导出当前图。右侧说明显示计算引擎、图像采样和视场。开启泊松噪声后，可探索合成观测与生成模型之间的差异。

### 4. 31 种科研产品

![开启泊松噪声的科研产品库](docs/screenshots/03-products.jpg)

*标准诊断组并列比较观测、模型分量、源平面视图和残差统计。这张截图开启了泊松噪声，因此出现非零残差。*

| 类别 | 数量 | 产品 |
| --- | ---: | --- |
| 观测与预处理 | 6 | 合成观测图、噪声图、信噪比、PSF、拟合掩膜、掩膜后的观测图 |
| 模型与分量 | 8 | PSF 卷积模型、未卷积理想模型、卷积前后透镜星光、卷积前后被透镜源、源平面亮度、透镜光扣除图 |
| 残差与似然诊断 | 4 | 残差、归一化残差、逐像素 χ²、残差通量分数 |
| 显示变换 | 1 | 模型 log₁₀ 图 |
| 透镜物理量 | 12 | 汇聚度 κ、透镜势 ψ、偏折角 x / y 分量与模长、剪切 γ₁ / γ₂ 与模长、有符号放大率 μ、Jacobian 行列式、切向 / 径向本征值 |

支持标准 12 图组和分类浏览；按当前视图请求产品。科学图有坐标、数值色条和单位，色表取自安装的 PyAutoArray。临界曲线和焦散叠加数据也随计算结果提供。

### 5. 科研数据导出与实验复现

- **单图 PNG**：用于展示的高分辨率预览。
- **单图 FITS / CSV**：由后端原生 `float64` 数组生成，方便进入 Python、天文数据工具或进一步分析。
- **当前组 / 全部 ZIP**：包含 PNG、FITS、参数快照、manifest、计算摘要、点像结果和临界曲线 / 焦散叠加数据。
- **参数 JSON 导入 / 导出**：保存实验构型，并在另一台电脑重新运行。
- **固定噪声种子**：便于重复同一合成观测实验。

FITS / CSV 的数据源是数值数组。PNG 的配色和预览尺寸不会改变这些原生数据。

### 6. 教学用快速拟合

![带实际合成数据拟合结果的快速拟合界面](docs/screenshots/04-quick-fit.jpg)

*截图来自本机完成的一次带噪合成观测拟合，展示收敛状态和初值 / 恢复值对比；该例没有后验可信区间。*

锁定当前合成观测，选择 1–5 个参数，由 SciPy 有界最小二乘反复调用 PyAutoLens 正向模型。可比较初值与恢复值，并检查拟合模型、残差、归一化残差和 χ²。

这适合演示参数恢复与模型敏感性。当前界面没有完整的先验编辑、后验采样和参数可信区间流程。

## 安装与启动

### 环境要求

- **Python 3.12 或更新版本**；建议首先使用已经验证的 Python 3.12。
- macOS 或 Windows 桌面环境，现代浏览器；建议窗口宽度至少 1280 像素。
- 首次安装需要联网下载 Python 依赖。没有 Node.js、npm 或前端打包步骤。
- `requirements.txt` 固定 `autolens==2026.9.15.1`；其他依赖采用版本范围，未来安装解析出的依赖组合可能不同。

推荐从 [v1.0.0 Release](https://github.com/SiriusFzh/PyAutoLens-Workbench/releases/tag/v1.0.0) 下载同一个 Mac / Windows 源码包，解压后启动。也可使用 **Code → Download ZIP**。

### 获取代码

点击本仓库 **Code → Download ZIP** 并解压，或运行：

```bash
git clone https://github.com/SiriusFzh/PyAutoLens-Workbench.git
cd PyAutoLens-Workbench
```

### macOS

双击 `workbench/START_MAC.command`。首次启动会在 `workbench/.venv` 创建环境并安装依赖，然后打开浏览器。

也可以在仓库目录运行：

```bash
bash workbench/START_MAC.command
```

若双击提示没有执行权限：

```bash
chmod +x workbench/START_MAC.command
bash workbench/START_MAC.command
```

### Windows

安装 Python 3.12（确保包含 Python Launcher），然后双击 `workbench/START_WINDOWS.cmd`。

两个平台的快捷入口调用同一个 `start.py`，创建本地 `.venv` 并安装依赖。安装中断时，下次启动自动重试。Mac 和 Windows 使用同一份程序与下载包。

### 手动创建环境

macOS：

```bash
cd workbench
python3.12 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python server.py
```

Windows PowerShell：

```powershell
cd workbench
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe server.py
```

通常打开 `http://127.0.0.1:8765/`；端口被占用时自动选择 8765–8795 中的可用端口，以终端输出为准。保持启动窗口运行，按 **Ctrl+C** 停止服务。界面右上角 **EN / 中文** 切换语言，首次打开默认英文；主动选择中文后，偏好保存在当前浏览器。

### 五分钟实验

1. 启动后选择“爱因斯坦环”，观察近轴源形成的环状像。
2. 拖动背景源或调整 `source_x` / `source_y`，比较环、弧和多像的变化。
3. 调整 θE、质量轴比或剪切，观察构型与临界曲线变化。
4. 切换“观测与诊断图”，打开泊松噪声，比较观测、模型与归一化残差。
5. 在“科研产品库”查看放大率与偏折场，下载 FITS 或 CSV。
6. 导出参数 JSON；需要时锁定合成观测，尝试快速拟合。

## 科学假设与当前边界

- **当前完成的工作**：参数化薄透镜正向模拟，以及合成数据上的教学最小二乘拟合。
- **尚未接入完整界面的工作**：真实 FITS 数据导入、真实 PSF / noise map、完整 `FitImaging` 分析、PyAutoFit / Nautilus 后验、像素化源反演、干涉仪可见度、正式点源 / 时延、多波段联合拟合、子结构灵敏度映射。
- 能力清单将这些流程标为需要数据、需要完成拟合或尚未适配，完整前端标记 `is_full_pyautolens_frontend` 为 `false`。
- 三维平滑光路和平面距离用于教学示意，不按真实宇宙尺度绘制；浏览器近似图与 PyAutoLens 数值图有不同精度。
- **θE 是直接输入的角尺度**：红移滑块更新平面和星系元数据；固定 θE 时，单独改变红移不会从物理质量重新推导偏折尺度。
- PSF 是当前工作台实现的高斯核；噪声和曝光条件用于合成观测。
- 关闭泊松噪声时，同一生成模型的观测与模型相同，因此残差和 χ² 接近零。检验实际拟合质量应使用拟合工作流与独立数据。
- 彩色科学图是定量伪彩色。放大率在临界曲线附近可能极大，残差通量分数在低信噪比区域应谨慎解释。

完整细节见 [能力覆盖报告](workbench/PYAUTOLENS_COVERAGE.md) 和 [科研产品目录](workbench/RESEARCH_PRODUCT_CATALOG.md)（目前为中文）。

## 架构与本地 API

```text
PyAutoLens-Workbench/
├── README.md / README.zh-CN.md       双语项目说明
├── LICENSE / THIRD_PARTY_NOTICES.md
├── start.py                      统一跨平台启动器
├── lessons/                      三维教学场景
└── workbench/
    ├── START_MAC.command / START_WINDOWS.cmd
    ├── requirements.txt
    ├── server.py                 localhost HTTP 服务
    ├── lensing_engine.py         参数验证、Tracer、正向模型与快速拟合
    ├── product_registry.py       产品、分类、单位与可用状态
    ├── product_export.py         PNG / FITS / CSV / ZIP 导出
    ├── capability_registry.py    能力覆盖清单
    ├── build_portable.py         构建跨平台源码 ZIP
    └── static/                   HTML / CSS / JavaScript / Three.js
```

| 方法与路径 | 用途 |
| --- | --- |
| `GET /api/health` | 引擎及教学页可用状态 |
| `GET /api/defaults` | 默认参数 |
| `GET /api/capabilities` | 已接入能力和科学边界 |
| `GET /api/catalog` | 产品、分类和研究工作流状态 |
| `GET /api/colormap` | 科学色表 |
| `POST /api/simulate` | 按参数计算全部或选定产品 |
| `POST /api/fit` | 教学快速拟合 |
| `POST /api/export/product` | 导出单图 |
| `POST /api/export/bundle` | 导出产品 ZIP |

只请求观测图与放大率的示例（服务启动后）：

```bash
curl http://127.0.0.1:8765/api/simulate \
  -H 'Content-Type: application/json' \
  -d '{"config":{"source_x":0.12,"source_y":0.05},"requested_products":["observed","magnification"]}'
```

仅在本机监听 `127.0.0.1`。应用没有上传科学参数或图像的流程；首次 pip 安装会访问包源，单独打开教学 HTML 可能请求外部脚本，工作台服务会改写 Three.js 为随包的本地版本。

开发时可以使用 `python server.py --no-browser`，或 `python server.py --port 8766` 指定端口。构建可分享的源码包：

```bash
cd workbench
python build_portable.py
```

输出到 `deliverables/`，不包含 Python 环境、缓存或本机可选字体。

## 验证与排错

2026-10-06 已在真实 Apple Silicon Mac、Python 3.12 上完成依赖安装、服务启动、英文默认、中文切换与偏好保存、三维页检查；全部 31 个产品、带噪模拟与 PNG / FITS / CSV / ZIP 导出均已验证。原便携包记录 Windows + Edge 已验证；本次发布整理未重新在 Windows 上运行。这个记录是启动与功能验证，完整的科学精度评估仍需针对研究用途进行。

- **Python 版本错误**：检查 `python3.12 --version`（Mac）或 `py -3.12 --version`（Windows）。系统自带 Python 3.9 不满足要求。
- **首次下载慢或中断**：在 `workbench` 下重新运行虚拟环境 Python 的 `-m pip install -r requirements.txt`，完成后再启动。统一启动器会自动重试未完成的安装，也可手动运行 pip。
- **未自动打开浏览器**：复制终端打印的 localhost 地址。
- **界面显示计算失败**：查看服务终端的错误，检查依赖版本和参数。请确认本地虚拟环境符合依赖要求。
- **空白三维画面**：检查浏览器 WebGL / 硬件加速，尝试现代桌面浏览器。
- **离线运行**：先完成联网安装，再从 `server.py` 启动工作台。直接打开静态 HTML 不提供 Python 计算 API。

## 来源、致谢与引用

工作台基于开源 [**PyAutoLens**](https://github.com/PyAutoLabs/PyAutoLens) 构建，感谢 James Nightingale 和 PyAutoLabs 的开发者、研究者及贡献者。PyAutoLens 提供核心强透镜建模能力；本项目提供桌面浏览器交互、三维教学视图、参数控制、产品浏览与数据导出。

- [PyAutoLens 原仓库](https://github.com/PyAutoLabs/PyAutoLens)
- [官方文档](https://pyautolens.readthedocs.io/)
- [示例工作区](https://github.com/PyAutoLabs/autolens_workspace)
- [HowToLens 教程](https://github.com/PyAutoLabs/HowToLens)
- [官方论文引用说明](https://pyautolens.readthedocs.io/en/latest/general/citations.html)
- [PyAutoLabs 社区讨论](https://github.com/orgs/PyAutoLabs/discussions)

如果研究使用了 PyAutoLens，请按照官方引用说明引用相应论文。软件归属链接不能替代学术引用。主要软件论文为 Nightingale et al. (2021), *PyAutoLens: Open-Source Strong Gravitational Lensing*, JOSS 6(58), 2825，[DOI: 10.21105/joss.02825](https://doi.org/10.21105/joss.02825)。使用工作台时也欢迎在方法说明中链接本仓库。

## 贡献与许可证

欢迎提交使用问题、科学反馈、翻译和小范围 PR。报告问题时请包含系统、Python / 依赖版本、复现步骤、参数 JSON 和错误信息。计划接入新的科学工作流时，请先说明输入数据、物理假设、验证方法和与 PyAutoLens API 的对应关系。

工作台原创代码以 [MIT License](LICENSE) 发布，版权署名为 SiriusFzh。第三方组件保留原许可证，见 [第三方说明](THIRD_PARTY_NOTICES.md)。GitHub 发行版使用系统字体，不分发原便携包中另行授权的 Satoshi / MiSans 字体文件。本项目不代表 PyAutoLabs 官方维护或认可。
