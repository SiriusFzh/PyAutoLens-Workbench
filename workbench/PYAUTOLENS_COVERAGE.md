# PyAutoLens 可视化工作台能力审计

审计日期：2026-10-06
运行环境：`autolens / autofit / autoarray / autogalaxy 2026.9.15.1`

## 结论

当前版本是一个真实调用 PyAutoLens `Tracer` / `LensCalc` 的正向模拟与教学拟合工作台，但还不是“完整 PyAutoLens 的无代码替代品”。界面现有 32 个参数全部接通后端，并可实时生成 31 个二维研究产品；不过模型拓扑仍固定为一个透镜星系、一个背景源和两个平面，快速拟合仍是 SciPy 有界最小二乘，而非 PyAutoFit 后验推断。

工作台现在通过 `GET /api/capabilities` 暴露机器可读的能力清单，明确区分：

- `workbench.adapters`：已有验证适配器、当前可在 UI 中可靠使用；
- `installed_catalog`：当前安装版本可以导入，但尚未接入 UI 的运行时类别；
- `not_yet_adapted`：不能在界面中假装可用的关键缺口。

`GET /api/catalog` 另行公开 5 个产品分类、31 个已接通产品和 8 个研究工作流入口。工作流入口使用 `requires_dataset`、`requires_fit` 或 `not_adapted` 状态，避免把缺少真实数据、标准 fit 或后验搜索的产品显示成可用结果。

## 当前已经接通

| 层面 | 当前实现 |
| --- | --- |
| 配置 | `SimulationConfig` 的 32 个字段全部可编辑 |
| 质量模型 | `IsothermalSph`、`Isothermal`、可选 `ExternalShear` |
| 透镜星光 | 单个 `Sersic`，可开关 |
| 背景源 | 单个 `Sersic`；或 `PointSolver` 配合教学点像渲染 |
| 场景拓扑 | 一个透镜平面 + 一个源平面；一个透镜星系 + 一个源星系 |
| 观测 | 均匀网格、Gaussian PSF σ、曝光、天空背景、泊松噪声、圆形掩膜 |
| 图像产品 | 31 个数组：观测与预处理 6 项、模型与分量 8 项、拟合诊断 4 项、显示变换 1 项、透镜物理量 12 项；完整 ID、单位和归一化规则由 `product_registry.py` 唯一声明 |
| 透镜物理 | κ、ψ、αy/αx/\|α\|、γ₁/γ₂/\|γ\|、有符号 μ、det A、λₜ、λᵣ；并输出切向/径向临界曲线与焦散叠加数据 |
| 计算策略 | `/api/simulate` 接受 `requested_products`；界面按当前主图或科研分组补算缺失产品，避免每次参数更新都传输全部 31 个数组 |
| 下载 | 单图从原生 `float64` 数组导出 PNG / FITS / CSV；当前组或全部产品导出 ZIP（PNG + FITS、配置、manifest、摘要和叠加线数据） |
| 拟合 | 7 个候选标量中选择 1–5 个；SciPy `least_squares`；最多 60 次评估 |

## 当前安装但尚未接入

运行时反射确认当前版本提供：

- 69 个当前运行时公开且可导入的质量轮廓类（尚未逐一适配或验证每个构造参数与先验）；
- 27 个标准光度轮廓；
- 23 个线性光度轮廓；
- 9 种 mesh 与 18 种 regularization；
- `Imaging`、`Interferometer`、`PointDataset`、`WeakDataset`；
- `AnalysisImaging`、`AnalysisInterferometer`、`AnalysisPoint`、`AnalysisWeak`；
- Nautilus、Dynesty Static / Dynamic、Emcee、Zeus、LBFGS、BFGS、Sensitivity 等搜索或优化入口。

“可导入”不等于“可以安全自动生成 UI”。例如 `InputDeflections` 需要数组，像素化源需要 mesh、regularization、mask 和 adapt image 配合；这些必须各自有显式验证适配器，不能把所有类反射成一排滑块。

## 当前科学边界

1. 蓝色图的透镜光追来自 PyAutoLens，但观测层目前不是标准 `al.Imaging` / `SimulatorImaging` / `FitImaging` 管线。
2. PSF 目前是 SciPy Gaussian 模糊，不能导入真实 FITS PSF kernel。
3. 掩膜目前只有圆形半径，不能绘制不规则掩膜、额外星系掩膜或噪声缩放区。
4. 当前残差是模拟真值和当前模型之间的诊断；关闭随机噪声时自然接近零，不能当作真实数据拟合残差。
5. 快速拟合没有先验、后验、证据、协方差、搜索恢复和 Aggregator，因此不是 PyAutoFit / Nautilus 科研推断。
6. 当前没有 FITS 数据集导入，不能据此宣称已经支持真实观测的端到端拟合。
7. 当前下载的是正向模拟产品及其参数/溯源信息；它不等同于标准 `Imaging` 数据包、已收敛后验或可恢复的 PyAutoFit 结果目录。

## 科研产品与工作流状态

`product_registry.py` 是浏览器、计算引擎、能力接口和下载器共同使用的单一产品清单。它为每个产品保存分类、单位、坐标平面、显示归一化、mask 叠加许可和下载格式；`product_export.py` 直接从后端原生数组建立文件，避免从浏览器画布或已舍入 JSON 反推科学数据。

当前可即时计算的 31 项都属于既定参数化模型的**正向产品**。真实成像导入与质检、标准 `FitImaging`、后验搜索、像素化源、干涉仪、正式点源/时延、多数据集和灵敏度映射仍需要各自的数据或已完成拟合，界面只显示其条件与状态。逐项定义和实现路线见 [科研数据产品目录](RESEARCH_PRODUCT_CATALOG.md)。

PyTorch Lightning 不是当前物理工作流的缺失依赖。它编排 PyTorch 神经网络训练；本工作台当前使用 PyAutoLens 正向计算、SciPy 教学拟合，并计划以 PyAutoFit 承担科学搜索。只有将来单独训练分类器、代理模型或学习型重建时，才应把 Lightning 放在可选的机器学习模块中。

## 正确的无代码架构

后续不应继续把每个滑块直接绑定到一个 Python 字段，而应采用版本化 `ProjectSpec`：

```text
ProjectSpec
├─ dataset: imaging | interferometer | point | simulated
├─ planes[]
│  └─ galaxies[]
│     └─ components[]
│        ├─ role: mass | light | shear | pixelization
│        ├─ profile_id
│        └─ parameters: fixed | prior | linked | linear
├─ preprocessing: psf, mask, oversampling, noise scaling
├─ likelihoods
├─ search
└─ requested_products
```

前端应使用“模型树 + 参数检查器”，选中节点后才显示相关参数，而不是继续增长左栏：

```text
数据 → 模型 → 推断 → 结果
       ├─ Plane z=0.5
       │  └─ Lens Galaxy
       │     ├─ Light: Linear Sersic
       │     ├─ Mass: PowerLaw
       │     └─ External Shear
       └─ Plane z=1.0
          └─ Source Galaxy
             └─ Light / Pixelization
```

关键深模块：

- `CapabilityRegistry`：只公布有明确状态的能力与适配器；
- `ModelCompiler.compile(ProjectSpec)`：同一规范编译为 `Tracer`、`af.Model / Collection` 和 `Analysis*`；
- `ForwardEngine`：浏览器预览和精确计算读取同一规范，并标明 `display-only`、`forward-model`、`fit-only`；
- `FitJobRunner`：正式搜索作为可取消、可恢复的后台任务运行，而不是一个同步 HTTP 请求。

## 分阶段路线

1. **统一交互状态**：左侧、三维拖动、红色预览和蓝色图共用一份模型；集中预设；标明显示参数。
2. **科学成像基础**：`ProjectSpec`、FITS 导入、真实 PSF / noise map、任意 mask、oversampling、标准 `al.Imaging / FitImaging`。
3. **参数化推断**：固定值 / 先验 / 链接 / 线性参数编辑；先接 Nautilus，再接 Dynesty / MCMC；支持进度、取消、恢复与后验图。
4. **复杂模型**：多组件、多星系、多平面、PowerLaw / NFW / MGE / 线性光度轮廓。
5. **像素化源**：mesh、regularization、adapt image、positions likelihood 与 SLaM 链式搜索。
6. **更多数据类型**：PointDataset、Interferometer、多波段、多数据集。
7. **高级研究**：子晕、势修正、弱透镜、批量项目和 Aggregator。

真实数据入口必须保留强制检查：先显示 dataset，确认污染物 / 额外星系，再明确选择 mask；不能把 mask 半径作为静默默认值直接开始拟合。
