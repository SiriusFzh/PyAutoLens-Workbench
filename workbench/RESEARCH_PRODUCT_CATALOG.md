# PyAutoLens 科研数据产品目录

审计日期：2026-10-06
审计对象：原便携包的 PyAutoLens 适配与 workbench 源码（原始审计记录）
已安装栈：`autolens / autoarray / autogalaxy / autofit 2026.9.15.1`
官方示例快照：`PyAutoLabs/autolens_workspace@d330982046916dea41ebe3a7e78dfd9067699d93`

## 结论先行

当前工作台是一个真实调用 PyAutoLens `Tracer` / `LensCalc` 的**正向模拟与教学快速拟合工作台**，不是完整的科研拟合前端。现在可以直接生成 31 个二维产品，分为观测与预处理（6）、模型与分量（8）、拟合诊断（4）、显示变换（1）和透镜物理量（12）；同时输出临界曲线/焦散叠加数据，并可用 `PointSolver` 生成教学点像。快速拟合仍由 SciPy `least_squares` 完成。

当前机器同时已经具备标准 `Imaging / FitImaging`、`Interferometer / FitInterferometer`、`PointDataset / AnalysisPoint`、PyAutoFit 后验、像素化反演、联合数据和灵敏度映射 API，但这些能力大多**尚未接入工作台**。目录因此区分“库能做”与“当前 UI 已做”，不把可导入类当成已完成功能。

这 31 项由 `product_registry.py` 统一声明，浏览器按当前主图或科研分组请求缺少的产品，而不是每次参数变化都传输全部数组。单图可以由原生 `float64` 数组导出 PNG、FITS 或 CSV；当前分组或全部产品可以导出 ZIP，包内含 PNG + FITS、配置快照、manifest、标量摘要、点像和临界曲线/焦散 JSON。ZIP 当前不重复收录 CSV。

研究工作流目录还列出真实成像、标准 `FitImaging`、后验搜索、像素化反演、干涉仪、点源/时延、多数据集与灵敏度映射 8 类入口。它们分别标记为“需要数据”“需要完成拟合”或“尚未适配”，不会用模拟占位图冒充结果。

最值得优先补的科研产品不是更多模型滑块，而是：

1. 标准 `al.Imaging` FITS 导入、数据/噪声/PSF 同屏质检，以及真实数据的污染物与 mask 强制确认；
2. 基于标准 `FitImaging` 的残差、归一化残差、χ²、标量似然和分量分解；
3. `LensCalc` 的 κ、μ、临界曲线、焦散和由临界曲线定义的有效爱因斯坦半径；
4. 可恢复的 PyAutoFit 搜索任务与可信后验查看器；
5. 在上述基础稳定后，再做像素化源、干涉仪、联合数据和子结构分析。

## “可即时计算”判定

| 标记 | 含义 |
| --- | --- |
| **A — 现成** | 当前工作台 API/UI 或当前文件已直接提供，无需新搜索。 |
| **B — 短算** | 当前数据或 `Tracer` 已足够，已安装真实 API 可在秒至分钟内计算；尚缺工作台适配器。 |
| **C — 演示限定** | 当前确有产物，但来自 `PYAUTO_TEST_MODE=1` 烟雾测试或教学近似，只能验证链路，不能形成科研结论。 |
| **D — 尚不可** | 需要新数据、像素化模型、正式非线性搜索或批量模拟。 |

当前状态基线：

- `workbench/lensing_engine.py` 的 `/api/simulate` 按 `requested_products` 返回上述 31 个产品中的所需子集；`/api/fit` 是 SciPy 有界最小二乘，不是 PyAutoFit 后验。
- `dataset/imaging/simple_lens/` 已有 `data.fits`、`noise_map.fits`、`psf.fits` 和 `tracer.json`。
- `output/test_mode/.../basic_fit_smoke_test/` 已有 `model.results`、`search.summary`、`samples.csv`、`samples_summary.json` 等，但生成脚本明确使用 `PYAUTO_TEST_MODE=1`；不能把其参数区间、证据或最大似然值当成收敛结果。
- 当前项目没有正式 `PointDataset`、干涉仪 visibilities、多个波段或子结构灵敏度输出。

## 1. 输入与预处理

| 产品 | 定义 | 前置数据 / 状态 | 真实 API / 源码依据 | 当前可即时计算 | 建议 UI |
| --- | --- | --- | --- | --- | --- |
| Imaging 数据包与元数据 | 将科学图像、逐像素 noise map、PSF 和 `pixel_scales` 作为一个不可拆散的数据对象；同时显示 shape、视场和单位声明。 | `data.fits`、`noise_map.fits`、可选 `psf.fits`，以及可靠的角秒/像素。 | `al.Imaging.from_fits(...)`；`PyAutoArray:autoarray/dataset/imaging/dataset.py`；官方示例 `scripts/imaging/start_here.py`。 | **B**：`simple_lens` 三个 FITS 已齐；工作台尚无标准导入器。 | “数据”页四联视图：Data / Noise / PSF / Header；导入后锁定 pixel scale，缺项不得进入正式拟合。 |
| 数据完整性与数值范围 | 检查 NaN/Inf、shape 一致性、noise 是否严格为正、PSF 是否归一化、极值和动态范围。它是数据质量产品，不是美化图。 | 已加载 `Imaging` 或原始 FITS。 | `Imaging` 构造与 `from_fits(check_noise_map=True)`；`Convolver` 归一化路径见 `PyAutoArray:autoarray/dataset/imaging/dataset.py`；官方准备示例 `scripts/imaging/data_preparation/start_here.py`。 | **B**：现有 FITS 可立即审计；当前工作台没有报告页。 | 导入向导中的红/黄/绿检查卡；列出失败像素坐标、PSF 总和、noise 最小值，不自动“修好”后静默继续。 |
| S/N 图与峰值 | `signal_to_noise_map = data / noise_map`（库会把负 S/N 截为 0）以及全图最大 S/N，用于选择显示尺度和初步识别有效弧。 | 标准数据与 noise map。 | `dataset.signal_to_noise_map`、`dataset.signal_to_noise_max`；`PyAutoArray:autoarray/dataset/abstract/dataset.py`。 | **A**：模拟工作台已有 S/N 图；**B**：标准 FITS S/N 尚未接 UI。 | S/N 图与 Data 联动十字光标；显示 peak、分位数，并明确模拟 S/N 与真实 S/N 的来源。 |
| 科学 mask 与污染物审计 | mask 决定哪些像素进入似然；真实数据必须从同一张 Data 图确认额外星系、前景星、伪影，并明确 mask 形状/半径。 | 已显示真实 Data；用户确认污染物和覆盖弧的 mask 范围。 | `al.Mask2D.circular / from_fits / from_pixel_coordinates`、`dataset.apply_mask(...)`；`PyAutoArray:autoarray/mask/mask_2d.py`；项目强制门见 `autolens_assistant:AGENTS.md`。 | **A**：模拟圆形 mask；**D**：真实数据的手绘/导入 mask 与确认流程尚无。 | 必须经过“原图检查 → 污染物标注 → mask 叠加 → 用户确认”四态；保存 mask FITS 与确认记录，不能给真实数据静默默认半径。 |
| 污染区降权 / noise scaling | 用很大的 noise 或目标 S/N 对额外星系、点源等区域降权，而不是把污染像素错误解释为透镜残差。 | 污染区 mask；原始 noise map。 | `Imaging.apply_noise_scaling(mask, noise_value, signal_to_noise_value)`；`PyAutoArray:autoarray/dataset/imaging/dataset.py`；联合点源示例 `scripts/multi_dataset/features/imaging_and_point_source/modeling.py`。 | **D**：当前只有整体圆形 mask。 | 单独的“排除/降权区域”图层；悬停显示原 noise 与缩放后 noise；导出不可逆前预览受影响像素数。 |
| 光度过采样 | 在中心或高曲率区域用更多子像素评估光度轮廓，降低积分误差；它不改变观测像素数。 | 已应用 mask 的 `Imaging`；过采样规则或数组。 | `Imaging.apply_over_sampling(over_sample_size_lp, over_sample_size_pixelization)`；`PyAutoArray:autoarray/dataset/imaging/dataset.py`；`scripts/imaging/start_here.py`。 | **B**：现有数据可短算；工作台当前均匀网格未暴露过采样产品。 | 过采样热图 + 计算成本估计；默认展示而非藏在高级设置里。 |

## 2. 模型与透镜物理量

| 产品 | 定义 | 前置数据 / 状态 | 真实 API / 源码依据 | 当前可即时计算 | 建议 UI |
| --- | --- | --- | --- | --- | --- |
| 模型树与参数状态 | 透镜平面、星系和 mass/light/shear/source 组件的结构；每个参数标明 fixed、prior、linked 或 linear。 | 一个可编译的模型规范或当前 `Tracer`。 | `af.Model`、`af.Collection`；`PyAutoFit:autofit/mapper/prior_model/`；联合数据使用 `AnalysisFactor / FactorGraphModel`。 | **A**：当前固定“一透镜 + 一源”及 32 字段；通用模型树尚无。 | 树形模型编辑器 + 右侧参数检查器；状态徽标替代无限增长的滑块栏。 |
| 分量图与逐平面图 | 总模型图拆成 lens light、lensed source、每个 galaxy/plane 的贡献；用于查错与解释。 | `Tracer` 与评估 grid；拟合时可用 `FitImaging`。 | `Tracer.image_2d_from / image_2d_list_from / galaxy_image_2d_dict_from`；`PyAutoLens:autolens/lens/tracer.py`；`FitImaging.galaxy_model_image_dict`。 | **A**：Lens Light、Lensed Source、Model 已有；逐星系字典为 **B**。 | 图层开关和可加总图例；鼠标悬停显示该分量在像素处的值。 |
| 偏折角、势与会聚 κ | 偏折角 α、透镜势 ψ，以及 `κ = Σ/Σcrit` 的二维图；是后续 Jacobian 与放大率的基础。 | 质量模型和计算 grid。 | `Tracer.deflections_yx_2d_from / potential_2d_from / convergence_2d_from`；`PyAutoLens:autolens/lens/tracer.py`。 | **A**：当前实时返回 κ、ψ、αy、αx 与 \|α\|。 | “透镜物理”标签页：α 分量/模长、ψ 与 κ 色图；统一角秒坐标。 |
| 剪切、Jacobian 与放大率 μ | 由偏折角导数得到 Hessian/Jacobian、剪切与 `μ = 1/det(A)`；临界曲线附近会发散并改变符号。 | `Tracer` 或 mass object；足够细的 grid。 | 当前 API 是 `al.LensCalc.from_tracer(tracer)`，再调用 `shear_yx_2d_via_hessian_from`、`jacobian_from`、`magnification_2d_from`；`PyAutoGalaxy:autogalaxy/operate/lens_calc.py`；[官方 LensCalc API](https://pyautolens.readthedocs.io/en/latest/api/_autosummary/autolens.LensCalc.html)。 | **A**：当前返回 γ₁、γ₂、\|γ\|、有符号 μ、det A、λₜ 与 λᵣ；非有限 μ 不写入 JSON 范围。 | μ 使用带符号色图并对发散值截屏显示；旁边同时显示 det(A)，避免把数值峰当精确无穷大。 |
| 临界曲线与焦散 | image plane 上 `det(A)=0` 的临界曲线及其映到 source plane 的焦散；决定高放大和多像区域。 | `LensCalc` 与覆盖完整临界结构的细 grid。 | `tangential/radial_critical_curve_list_from`、`tangential/radial_caustic_list_from`；同一 LensCalc 源码；官方示例 `scripts/guides/lens_calc.py`。 | **A**：当前返回切向/径向临界曲线和焦散 polyline，用于图层叠加与 ZIP 导出。 | 在 image/source 两张图上同步叠加；按 tangential/radial 分色，显示 grid 分辨率与是否触边。 |
| 有效爱因斯坦半径与角爱因斯坦质量 | 从切向临界曲线包围面积求等效半径；角质量单位为 arcsec²。物理质量还需红移、宇宙学与临界面密度。 | 临界曲线完整闭合；若转物理质量还需 lens/source redshift 与 cosmology。 | `LensCalc.einstein_radius_from / einstein_mass_angular_from`；`PyAutoGalaxy:autogalaxy/operate/lens_calc.py`；`scripts/guides/lens_calc.py`。 | **A**：当前显示的是模型输入 `einstein_radius`；由曲线测得的量为 **B**。 | 并列显示“输入参数 θE”与“临界曲线等效 θE”，禁止混为一项；物理质量注明宇宙学。 |
| 孔径光度与角质量 | 给定半径内的模型光度与角质量，适合模型比较和派生量；它们高度依赖所选 profile 与半径。 | 拟合或当前 galaxy 模型；明确孔径。 | `Galaxy.luminosity_within_circle_from / mass_angular_within_circle_from`；`PyAutoGalaxy:autogalaxy/galaxy/galaxy.py`。 | **B**：当前 galaxy 可立即评估。 | 可拖动圆孔径 + 半径曲线；结果卡必须列 profile、单位和孔径。 |
| 源总流量与整体放大率 | 在足够大且足够细的 source/image grids 上分别积分源光，整体放大率为 lensed flux / intrinsic flux。 | 参数化源或像素化重建；收敛的积分范围与分辨率。 | 官方 `scripts/imaging/source_science.py` 和 `scripts/interferometer/source_science.py`。 | **B**：当前 Sérsic 源可算；科研值需做 grid 收敛测试。 | 显示 intrinsic flux、lensed flux、ratio，并提供 grid-size 收敛小图。 |

> API 防漂移：2026.9.15.1 中，κ/ψ/α 可直接从 `Tracer` 得到；μ、临界曲线、焦散、有效爱因斯坦半径等二级量应从 `al.LensCalc.from_tracer(...)` 得到，不能沿用旧版本中“全部直接挂在 Tracer 上”的写法。

## 3. 拟合诊断

| 产品 | 定义 | 前置数据 / 状态 | 真实 API / 源码依据 | 当前可即时计算 | 建议 UI |
| --- | --- | --- | --- | --- | --- |
| Data / Model / Residual | `residual = data - model_data`，是所有拟合诊断的第一层。 | 同一 mask、PSF 和 grid 下的数据与模型。 | `FitImaging.data / model_data / residual_map`；`PyAutoArray:autoarray/fit/fit_dataset.py`；`PyAutoLens:autolens/imaging/fit_imaging.py`。 | **A（模拟限定）**：当前 Residual 是模拟观测与正向模型的差；标准 FitImaging 为 **B/C**。 | 固定三联图，共享坐标与 Data/Model 色标；标明“模拟诊断”或“FitImaging”。 |
| 归一化残差与逐像素 χ² | `normalized_residual = residual/noise`，`chi_squared_map = normalized_residual²`，用于找空间相关失配。 | 可信 noise map 和 mask。 | `FitImaging.normalized_residual_map / chi_squared_map`；公式在 `PyAutoArray:autoarray/fit/fit_dataset.py`。 | **A（模拟限定）**：当前有两图；正式标准管线为 **B/C**。 | 对称残差色标；χ² 非负色标；提供阈值筛选和连通热点，而非只报总 χ²。 |
| χ²、reduced χ²、noise normalization、log likelihood | 标量拟合优度。`log_likelihood = -0.5(χ² + noise_normalization)`；reduced χ² 还依赖自由度定义。 | 完整 `FitImaging` 或 `FitInterferometer`。 | `chi_squared / reduced_chi_squared / noise_normalization / log_likelihood / figure_of_merit`；`PyAutoArray:autoarray/fit/fit_dataset.py`。 | **C**：快速拟合只给 initial/final χ²；烟雾测试可重建标准 fit，但不是可信科研后验。 | 顶部指标条 + 公式提示；显示未掩膜像素数、参数数和 likelihood 类型。 |
| 透镜光扣除与逐星系扣除 | 从 Data 中扣除 lens light 或指定 galaxy/plane 后查看弧；用于暴露污染和分量退化。 | 包含 lens/source light 的 `FitImaging`。 | `profile_subtracted_image`、`subtracted_images_of_galaxies_dict`、`subtracted_images_of_planes_list`；`PyAutoLens:autolens/imaging/fit_imaging.py`。 | **A**：已有 Lens-light-subtracted；更一般的逐星系扣除为 **B**。 | 分量选择器 + 原图/扣除图擦拭比较；记录被扣除组件。 |
| 残差通量比例 | 当前正向产品为 `(data-model)/data`，适合比较不同亮度区域，但 data 接近 0 时必须遮罩或裁剪；标准 `FitImaging` 定义仍以对应 API 为准。 | 可信 data/model；标准研究拟合需 `FitImaging`。 | `FitImaging.residual_flux_fraction_map`；基式见 `PyAutoArray:autoarray/fit/fit_dataset.py`。 | **A（模拟限定）**：当前可实时计算；标准 FitImaging 产品仍需正式适配。 | 发散像素单独标记，不允许自动缩放掩盖；与 S/N 图并排。 |
| 最大似然 Fit 快照 | 完整 `ResultImaging.max_log_likelihood_fit`，可统一派生所有空间诊断和模型分量。 | 已完成或可恢复的 PyAutoFit 搜索。 | `PyAutoLens:autolens/imaging/model/result.py`；官方 `aplt.subplot_fit_imaging(...)`。 | **C**：当前仅 test-mode 搜索产物。 | 结果页固定保留一个“最大似然快照”，旁边标注搜索是否 production/converged。 |

## 4. 后验与搜索

| 产品 | 定义 | 前置数据 / 状态 | 真实 API / 源码依据 | 当前可即时计算 | 建议 UI |
| --- | --- | --- | --- | --- | --- |
| 搜索配置与进度 | 搜索器、先验数、live points/walkers、样本数、运行时间、完成/恢复状态。 | 一个 PyAutoFit `NonLinearSearch` 输出目录。 | `af.Nautilus`；`model.info`、`search.summary`、`files/search.json`；`PyAutoFit:autofit/non_linear/paths/`。 | **C**：当前烟雾测试文件齐全；工作台未展示。 | 后台任务卡：运行/暂停/取消/恢复，显示输出路径和最后更新时间；不要用同步 HTTP 长请求。 |
| 最大似然 / 最大后验实例 | 最优样本构成的模型实例，以及对应 tracer/fit；适合空间诊断，不代表边际后验中心。 | 有 `Result`/`Samples`。 | `Result.max_log_likelihood_instance`、`Samples.max_log_likelihood / max_log_posterior`；`PyAutoFit:autofit/non_linear/result.py`、`samples/samples.py`。 | **C**：仅 smoke output。 | “Best fit”与“Posterior summary”分栏，禁止只显示一个 best-fit 就称为参数测量。 |
| 后验中位数与可信区间 | 每个自由参数的边际 PDF 中位数、上下 σ 区间和非对称误差。 | 收敛的 nested/MCMC samples；模型映射信息。 | `SamplesPDF.median_pdf / values_at_lower_sigma / values_at_upper_sigma / errors_at_*`；`PyAutoFit:autofit/non_linear/samples/pdf.py`。 | **C（不可解释）**：当前 retained samples 不足且 test mode。 | 参数表 + 1D PDF；显示 prior 区间、单位、边界触碰与收敛警告。 |
| 协方差与 corner 图 | 参数间联合后验、退化和相关性；不能由单个最优点替代。 | 足够后验样本。 | `SamplesPDF.covariance_matrix`、`aplt.corner_anesthetic(samples=...)`；`samples/pdf.py`、官方 results 示例。 | **D**：当前 smoke 样本不具科研意义。 | 可筛选参数的 corner 图；默认突出质量斜率—θE—剪切—源尺度等科学退化。 |
| Bayesian evidence 与模型比较 | nested sampling 的 log evidence；同一数据、似然和可比 prior 下才可比较模型。 | 可比的收敛 nested-search 结果。 | `SamplesNest.log_evidence`；`PyAutoFit:autofit/non_linear/samples/nest.py`。 | **C（不可比较）**：烟雾测试虽写值但不能用于模型选择。 | 证据差表必须同时列数据版本、mask、noise、prior 和搜索配置；不单独显示“胜负数”。 |
| 采样质量与收敛 | Nested 的 acceptance/pdf convergence；MCMC 的 R-hat、ESS、divergence、链长度等。 | 完整 search-specific samples 信息。 | `SamplesNest.acceptance_ratio / pdf_converged`；`SamplesMCMC.rhat / ess_bulk / ess_tail / n_divergent`；`samples/nest.py`、`samples/mcmc.py`。 | **D**：当前不是 production run。 | 搜索类型自适应 QC 卡；未通过时给后验加全局“不宜解释”水印。 |

## 5. 源重建与反演

| 产品 | 定义 | 前置数据 / 状态 | 真实 API / 源码依据 | 当前可即时计算 | 建议 UI |
| --- | --- | --- | --- | --- | --- |
| 源平面 mesh 与映射 | image-plane 数据像素如何 ray-trace 到 source-plane mesh；mesh 可为矩形、Delaunay、KNN 等。 | mask、质量模型、`Pixelization(mesh, regularization)`；自适应方案还需 adapt image。 | `al.Pixelization`、`al.mesh.*`、`Mapper.source_plane_data_grid / source_plane_mesh_grid / mapping_matrix`；`PyAutoArray:autoarray/inversion/`。 | **D**：当前源是 Sérsic/Point，无 pixelization。 | image/source 双窗 linked brushing：点选数据像素高亮其源像素；显示 mesh density。 |
| 源重建亮度 | 线性反演求得的 source pixel flux 向量及其二维/不规则网格表达。 | 成功的 pixelized `FitImaging` 或 `FitInterferometer`。 | `fit.inversion.reconstruction`、`reconstruction_dict`；`PyAutoArray:autoarray/inversion/inversion/abstract.py`；官方 `scripts/imaging/features/pixelization/fit.py`。 | **D**。 | 源重建图必须带 mesh、单位、正值约束状态和动态范围；不能只插值成漂亮图片。 |
| 映回观测平面的重建 | 将 source reconstruction 经 lensing + PSF/transformer 映回 data domain；是判断重建是否解释数据的关键。 | 同一 inversion。 | `mapped_reconstructed_data / mapped_reconstructed_operated_data`；同一 Inversion 源码。 | **D**。 | Source / mapped reconstruction / residual 三联图；imaging 标 PSF，interferometer 标 uv domain。 |
| 重建不确定度与协方差 | 线性反演解的 covariance/noise map，显示哪些源像素受数据约束。 | inversion 矩阵可用；明确 solver 与正则化。 | `reconstruction_covariance_matrix`、`reconstruction_noise_map(_with_covariance)`；`Inversion` 源码。 | **D**。 | 重建 S/N 图 + 单像素误差查询；避免只展示亮度而隐藏低约束区域。 |
| 正则化与 evidence 分解 | regularization penalty、`log det(F+H)`、`log det(H)` 等项说明拟合与平滑复杂度的权衡。 | pixelized inversion 与 regularization。 | `regularization_term`、`log_det_curvature_reg_matrix_term`、`log_det_regularization_matrix_term`；`PyAutoArray:autoarray/inversion/inversion/abstract.py`。 | **D**。 | evidence 分解条形图 + regularization 参数；附“更低残差不一定更高 evidence”的解释。 |
| 像素化源科学量 | 从重建计算 intrinsic flux、lensed flux、整体 magnification，并用不同 grid/mesh 设置评估稳定性。 | 收敛的像素化 fit；定义积分区域。 | 官方 pixelization/source-science 示例：`scripts/imaging/features/pixelization/fit.py`、`scripts/imaging/source_science.py`。 | **D**。 | 派生量卡 + posterior draws / mesh 变化误差，而非只从最大似然重建报一个数。 |

## 6. 干涉仪

| 产品 | 定义 | 前置数据 / 状态 | 真实 API / 源码依据 | 当前可即时计算 | 建议 UI |
| --- | --- | --- | --- | --- | --- |
| Visibilities 与 uv coverage | 复数 visibility、逐 visibility noise 和 `(u,v)` 波长坐标；amplitude/phase 随 uv distance 是首要质检。 | `data.fits`、`noise_map.fits`、`uv_wavelengths.fits`、real-space mask。 | `al.Interferometer.from_fits(...)`、`amplitudes / phases / uv_distances`；`PyAutoArray:autoarray/dataset/interferometer/dataset.py`。 | **D**：当前项目无这类数据。 | 复平面散点、amp/phase-vs-uv-distance、uv coverage；支持选择基线并联动 residual。 |
| Dirty image / noise / S/N | visibility 逆变换到 real-space 的诊断图；不是去卷积后的真实天空图。 | `Interferometer` 与 transformer。 | `dirty_image / dirty_noise_map / dirty_signal_to_noise_map`；同一 dataset 源码；`aplt.subplot_interferometer_dirty_images`。 | **D**。 | 三联 dirty 图，明显标注“diagnostic / dirty”，不与重建图混称。 |
| Model visibilities 与复残差 | 在 uv domain 比较 data 与 model，分别看实部/虚部或 amplitude/phase 的残差。 | `FitInterferometer`。 | `model_data`、`residual_map`、`normalized_residual_map`、`chi_squared_map`；`PyAutoArray:autoarray/fit/fit_interferometer.py`、`PyAutoLens:autolens/interferometer/fit_interferometer.py`。 | **D**。 | uv-domain residual 主视图；允许按 uv distance 分箱统计，避免只看 dirty image。 |
| Dirty fit 诊断 | 将 model/residual/normalized residual/χ² 投影到 dirty image 便于空间解释。 | `FitInterferometer`。 | `dirty_model_image / dirty_residual_map / dirty_normalized_residual_map / dirty_chi_squared_map`；`FitInterferometer`；`aplt.subplot_fit_dirty_images`。 | **D**。 | 与 uv residual 同页上下联动；每图明确变换和单位。 |
| 干涉仪源反演 | 在 visibility likelihood 中对 pixelized source 做线性反演；mapped reconstruction 的原生比较域仍是 uv。 | visibilities + transformer + mask + pixelization。 | `FitInterferometer.inversion`；`PyAutoArray:autoarray/inversion/inversion/interferometer/`；官方 `scripts/interferometer/features/pixelization/fit.py`。 | **D**。 | Source reconstruction、model visibilities、dirty diagnostics 三组，而不是复用 imaging 页标签。 |

## 7. 点源与时延

| 产品 | 定义 | 前置数据 / 状态 | 真实 API / 源码依据 | 当前可即时计算 | 建议 UI |
| --- | --- | --- | --- | --- | --- |
| 点像位置与求解 | 给定 source-plane coordinate，通过 `PointSolver` 找到全部 image-plane 解；数量与位置约束质量模型。 | lens `Tracer`、搜索 grid、precision 和 magnification threshold。 | `al.PointSolver.for_grid(...).solve(...)`；`PyAutoLens:autolens/point/solver/point_solver.py`。 | **A（教学）**：当前十字预设返回 4 个点像。 | image plane 上编号点像，source plane 显示源点/焦散；暴露 precision 与漏像警告。 |
| 标准 PointDataset | 观测位置、位置误差、可选 flux/time delay 及其误差；`name` 与模型中的 point component 配对。 | 观测表或 JSON/CSV。 | `al.PointDataset(name, positions, positions_noise_map, fluxes, ..., time_delays, ...)`；`PyAutoLens:autolens/point/dataset.py`；[官方 API](https://pyautolens.readthedocs.io/en/latest/api/_autosummary/autolens.PointDataset.html)。 | **D**：当前没有正式 point dataset。 | 可编辑表格 + 天球位置图；每行 image ID，校验同组 redshift 和缺失误差。 |
| 位置拟合残差 / χ² | 按指定 pairing 规则比较观测点像与模型点像，汇总 point likelihood。 | `PointDataset`、`PointSolver`、`FitPointDataset`。 | `FitPositionsImagePairAll/Repeat/Source`、`FitPointDataset.log_likelihood`；`PyAutoLens:autolens/point/fit/`。 | **D**。 | 观测—预测连线图 + pairing 表；必须显示采用的 pairing class。 |
| 放大率、flux 与 flux ratio | 在点像位置由 Hessian 求 μ，以源 flux 预测每像 flux；微透镜、消光等会使真实 flux ratio 偏离光滑模型。 | 点像位置、source flux、mass model；若拟合需 flux noise。 | `LensCalc.magnification_2d_via_hessian_from`、`FitFluxes`；`PyAutoLens:autolens/point/fit/fluxes.py`；官方 `scripts/point_source/start_here.py`。 | **A（近似）**：当前返回自算 `absolute_magnification`；标准 flux likelihood 为 **D**。 | 每像 μ 符号、|μ|、predicted/observed flux 表；提示异常 flux ratio 不能自动等同子结构。 |
| Fermat potential 与模型时延 | Fermat potential 表示几何项与 Shapiro 项之和；`Tracer.time_delays_from` 结合两平面红移和 cosmology 输出天。 | 恰好两红移平面、质量势、image positions、cosmology；观测拟合还需时延误差。 | `LensCalc.fermat_potential_from`、`Tracer.time_delays_from`；`PyAutoLens:autolens/lens/tracer.py`、`tracer_util.py`。当前源码明确只支持两平面时延。 | **B**：当前两平面模型可短算；工作台未输出；正式时延拟合为 **D**。 | arrival-time surface + 每像相对时延表；明确参考零点、cosmology 与“两平面限定”。 |
| 时延 likelihood | 将模型相对时延与观测天数及 noise 比较，并与位置/flux likelihood 合并。 | 带 time delays 的 `PointDataset`。 | `FitTimeDelays / FitTimeDelaysSolved`、`FitPointDataset`；`PyAutoLens:autolens/point/fit/times_delays.py`。 | **D**。 | 观测/模型/残差/error-bar 图；不要只显示绝对到达时间。 |

## 8. 多波段与联合数据

| 产品 | 定义 | 前置数据 / 状态 | 真实 API / 源码依据 | 当前可即时计算 | 建议 UI |
| --- | --- | --- | --- | --- | --- |
| 多波段数据立方视图 | 每个 band 保持自己的 data/noise/PSF/pixel scale，同时共享坐标和 mask 审计。 | 两个以上 `Imaging` datasets 及 band 元数据。 | 官方 `scripts/multi_dataset/start_here.py`。 | **D**。 | band tabs + RGB composite + 同坐标光标；绝不把不同 PSF 的图直接逐像素比较。 |
| 配准 offset / rotation | 每个 dataset 的 grid offset/rotation 可固定或作为先验拟合，避免把配准误差吸收到 mass/source。 | 多数据集和一个参考 band。 | `al.DatasetModel`；`dataset_model.grid_offset`（以及示例中的 rotation）；`scripts/multi_dataset/features/dataset_offsets/`。 | **D**。 | 参考 band 锁定，其他 band 显示亚像素向量/角度与后验。 |
| 共享与 band-specific 参数图 | 质量模型通常跨 band 共享，lens/source light 可每 band 独立或按 wavelength 函数关联。 | 每个 dataset 的 model view；明确物理共享假设。 | `af.AnalysisFactor`、`af.FactorGraphModel`；`PyAutoFit:autofit/graphical/declarative/`；官方 multi-dataset 示例。 | **D**。 | factor graph 可视化；点击参数显示“共享给哪些 datasets / 独立在哪些 datasets”。 |
| 联合 likelihood 与逐数据集结果 | 同一次搜索采样共享参数，总 log likelihood 是各 analysis factor 之和；仍保留每个 dataset 的 `Result`/fit。 | factor graph + 搜索。 | `search.fit(model=factor_graph.global_prior_model, analysis=factor_graph)`；`scripts/multi_dataset/start_here.py`。 | **D**。 | 总 likelihood 与各 band 贡献并列；每 band 残差可独立检查，防止一个 band 掩盖另一个。 |
| Imaging + Interferometer 联合 | 共享质量参数，但各自在 image/uv domain 建模；光分量可不同，像素化源可共享 source-plane mesh 而保持独立线性代数。 | 两类数据、各自 mask/PSF/uv、factor graph。 | `AnalysisImaging` + `AnalysisInterferometer` + `AnalysisFactor`；`scripts/multi_dataset/features/imaging_and_interferometer/modeling.py`。 | **D**。 | 数据类型专属诊断页 + 共享参数总览；禁止把 dirty image 当普通 imaging likelihood。 |
| Imaging + Point/Time-delay 联合 | 弧像素和点像位置/时延共同约束同一 mass/shear，二者各自有独立 likelihood。 | Imaging 与 PointDataset；共享 mass model。 | `AnalysisImaging` + `AnalysisPoint` + factor graph；`scripts/multi_dataset/features/imaging_and_point_source/modeling.py`。 | **D**。 | “Arc likelihood / Positions / Delays”贡献分解，显示共享 mass 参数。 |

## 9. 子结构与灵敏度

| 产品 | 定义 | 前置数据 / 状态 | 真实 API / 源码依据 | 当前可即时计算 | 建议 UI |
| --- | --- | --- | --- | --- | --- |
| 无子晕 vs 有子晕证据差 | 在同一数据、prior 设计与主透镜模型下比较 base 和 subhalo 模型 log evidence；不是只看残差变小。 | 稳定主透镜模型、pixelized source、两次可比的 production nested fits。 | `samples.log_evidence`；官方 `scripts/imaging/features/advanced/subhalo/detect/start_here.py`；[官方功能说明](https://pyautolens.readthedocs.io/en/latest/overview/overview_3_features.html)。 | **D**。 | 模型比较卡同时列 ΔlogZ、ΔlogL、prior volume、mask 和 source model；不给无上下文“检测”徽章。 |
| 子晕位置网格图 | 每个 image-plane grid cell 限制 subhalo centre，分别运行搜索，映射相对 evidence/likelihood。 | 完成 base/SLaM 结果；子晕 mass profile 与 grid-search 设置。 | `af.SearchGridSearch`、`al.subhalo.SubhaloGridSearchResult.figure_of_merit_array`；官方 detect 示例。 | **D**。 | evidence heatmap 叠加弧与 mask；点 cell 打开对应 fit residual 与参数后验。 |
| 子晕质量与位置后验 | 最佳网格附近 refine 后的 centre、`mass_at_200` 等后验；其解释依赖 profile/redshift/cosmology。 | 网格搜索与 refine 搜索完成。 | `SubhaloGridSearchResult.subhalo_mass_array / subhalo_centres_grid / attribute_grid`；官方 detect 示例。 | **D**。 | 位置—质量联合视图；清楚标注 profile、redshift 和 prior。 |
| 灵敏度 / 可探测性图 | 在许多位置和质量注入模拟子晕，再分别拟合 base/perturbed 模型；Δlog evidence/likelihood 给出该数据能检测什么，而非是否真有子晕。 | 可信 base model、模拟器、base/perturb fit classes、大量计算。 | `af.Sensitivity.run`、`SensitivityResult.log_evidence_differences / log_likelihood_differences`；`PyAutoFit:autofit/non_linear/grid/sensitivity/`；官方 sensitivity 示例。 | **D**。 | position × mass 可探测性切片、阈值可调但必须显示原始 ΔlogZ/ΔlogL；用 `aplt.subplot_sensitivity` 做基准布局。 |
| 注入前后形态差 | 比较 perturbed/no-perturb tracer 的 lensed source、κ、临界曲线、焦散和 residual，解释灵敏度来源。 | 单个 sensitivity cell 的两 tracer 与 source image。 | `aplt.subplot_sensitivity_tracer_images(...)`；[官方 API](https://pyautolens.readthedocs.io/en/latest/api/_autosummary/autolens.plot.subplot_sensitivity_tracer_images.html)。 | **D**。 | 选中灵敏度 cell 后展开六联解释图；与统计热图保持 cell ID。 |

## 10. 导出与溯源

| 产品 | 定义 | 前置数据 / 状态 | 真实 API / 源码依据 | 当前可即时计算 | 建议 UI |
| --- | --- | --- | --- | --- | --- |
| 工作台配置快照 | 当前 32 字段、随机种子、工作台 schema/version 与时间戳；用于重现同一正向模拟。 | 当前 UI state。 | 当前 `SimulationConfig`、JSON 导入/导出；`workbench/lensing_engine.py`。 | **A**。 | 每次导出包含 `schema_version`、软件版本、生成时间；导入前显示 diff。 |
| 标准数据导出 | Imaging 用 FITS 保存 data/noise/PSF；PointDataset 用 JSON 精确 round-trip，CSV 用于表格编辑。 | 标准 dataset object。 | `al.output_to_fits`、`al.output_to_json / from_json`、`PointDataset.to_csv / from_csv`；`PyAutoNerves` I/O 与 PointDataset 源码。 | **A/B**：模拟产品已有单图 FITS/CSV 下载；`simple_lens` 三个 FITS 已有，但工作台尚无标准 `Imaging` / `PointDataset` 导入后 round-trip。 | “科研包”按原始/处理后分目录；CSV/JSON 明确精度与 round-trip 用途。 |
| 原始搜索结果包 | 保存 model、search、samples、summary、covariance、dataset 和 maximum-likelihood tracer；是可复算的基础，不只是 PNG。 | PyAutoFit 搜索输出。 | `model.info`、`model.results`、`search.summary`、`files/model.json`、`samples.csv`、`samples_summary.json`、`covariance.csv`、`tracer.json`、`image/dataset.fits`；`PyAutoFit:autofit/non_linear/paths/`。 | **C**：当前只有 test-mode 包。 | 结果目录浏览器 + 完整性检查；压缩包名含 run ID，不覆盖旧结果。 |
| 派生科研产品导出 | 将 κ、μ、residual、source-plane brightness 等保存为科学数组和预览图，并保留单位、像素尺度、坐标平面和生成参数。 | 已计算的正向产品及元数据。 | 当前 `product_export.py`；FITS 头写入 `PRODUCT / BUNIT / PIXSCALE / FRAME / ENGINE`。 | **A（正向产品）**：31 项均可单独下载 PNG/FITS/CSV；当前组或全部下载为 ZIP，包含每项 PNG+FITS、`config.json`、`manifest.json` 与临界曲线/焦散 JSON。尚无天球 WCS，也不宣称导出未适配的 fit/posterior/inversion 产品。 | PNG 用于预览，FITS 保留原生 `float64`；CSV 是单图入口，ZIP 当前不重复收录 CSV。 |
| 多结果 Aggregator / 数据库 | 扫描许多已完成输出，按模型/搜索/标签查询，并重建 samples、dataset、fit、tracer；适合样本研究。 | 多个完整输出目录或 SQLite。 | 文件聚合器 `from autofit.aggregator.aggregator import Aggregator; Aggregator.from_directory(...)`；数据库聚合器 `af.Aggregator.from_database(...)`；官方 `scripts/guides/results/`。 | **D**：当前只有一次 smoke fit。 | 结果表格 + 查询构建器 + 批量导出；查询条件和软件版本写入 report。 |
| 可验证 provenance manifest | 输入文件 hashes、软件版本、工作台/示例 commit、模型/先验、mask、搜索配置、随机种子和父 run ID。现有输出覆盖其中多数，但 hash/父子关系应由工作台补齐。 | 任一可保存 run。 | PyAutoFit `DirectoryPaths` 输出、`files/*.json`、`.identifier`；当前 `GET /api/capabilities` 提供 runtime 版本。 | **B**：版本与配置已有，完整 manifest 尚无。 | Run 详情页固定“Provenance”标签；一键复制机器可读 JSON，缺字段显示 unknown 而非猜测。 |

## PyTorch Lightning 的真实相关性

**结论：当前工作台不应引入 PyTorch Lightning；它对上述 PyAutoLens 科研数据产品没有直接作用。**

第一方证据如下：

- Lightning 官方把 `LightningModule` 定义为组织 PyTorch 模型的 training/validation/test/predict steps，并由 `Trainer` 自动化训练循环、设备、精度和分布式执行；它是深度学习训练工程框架，而不是强透镜似然、nested sampling 或线性反演引擎。见 [LightningModule 官方源码文档](https://github.com/Lightning-AI/pytorch-lightning/blob/master/docs/source-pytorch/common/lightning_module.rst) 与 [Trainer 官方文档](https://lightning.ai/docs/pytorch/stable/common/trainer)。
- 本机 `lightning` 与 `pytorch_lightning` 都未安装；`workbench/requirements.txt` 只有 `autolens`、NumPy 和 SciPy。
- 在 `autolens_assistant`、`autolens_workspace` 和 `pyautolens_teacher_project` 的运行代码中没有 Lightning/PyTorch import。
- 当前快速拟合使用 `scipy.optimize.least_squares`；正式 PyAutoLens 路线使用 `AnalysisImaging / AnalysisInterferometer / AnalysisPoint` 配合 PyAutoFit 的 `Nautilus`、其他搜索器或 `FactorGraphModel`。PyAutoLens 官方文档也将自身定位为 JAX 加速的物理 lens modeling 库，而不是 PyTorch 训练项目。

只有在另立明确的机器学习子项目时，Lightning 才可能合理，例如：

- 用大量 PyAutoLens 模拟图训练 lens/non-lens 分类器；
- 训练神经网络代理模型、初值估计器或 amortized posterior；
- 学习型去噪/源重建，并有独立的 train/validation/test 数据、loss、校准和 domain-shift 验证。

即便如此，Lightning 也只负责**神经网络训练编排**；PyAutoLens 仍负责物理模拟、最终似然与科学验证。建议未来把它做成可选的 “ML 实验”边界，输出 checkpoint、训练曲线、数据版本和 model card，不要塞进当前工作台的核心依赖、搜索任务或科研产品菜单。

## 建议实施顺序

| 优先级 | 实施包 | 完成判据 |
| --- | --- | --- |
| P0 | 真实数据 gate + 标准 Imaging 导入 | Data/noise/PSF 可视检查；污染物和 mask 均被显式确认并保存。 |
| P1 | `FitImaging` 诊断适配器 + `LensCalc` | 标准 fit 的 residual/χ²/logL 与 κ/μ/critical curves/caustics 可导出，且与直接 API 数值一致。 |
| P2 | PyAutoFit 后台搜索与结果查看器 | 可取消/恢复；区分 best fit、posterior、evidence 和 convergence；test-mode 结果有醒目标记。 |
| P3 | Pixelization / inversion | mesh、reconstruction、mapped reconstruction、uncertainty 和 regularization terms 同时可查。 |
| P4 | PointDataset / time delay 与 Interferometer | 每类数据有原生 likelihood-domain 诊断，不能只显示渲染图。 |
| P5 | Multi-dataset factor graph | 参数共享关系可视化；总似然和各 dataset 贡献均可追踪。 |
| P6 | Subhalo detect / sensitivity 与 Aggregator | 以 production base fit 为前提；每个统计图能回溯到对应 run、prior 和注入配置。 |

## 一手来源索引

本目录没有使用博客、论坛或二手教程。API 名称以本机 2026.9.15.1 的 `dir()`、`inspect.signature()` 和已安装源码为准，再用官方 workspace/RTD 交叉核验。

### 已安装源码

- `PyAutoArray:autoarray/dataset/imaging/dataset.py`
- `PyAutoArray:autoarray/dataset/abstract/dataset.py`
- `PyAutoArray:autoarray/dataset/interferometer/dataset.py`
- `PyAutoArray:autoarray/fit/fit_dataset.py`
- `PyAutoArray:autoarray/fit/fit_interferometer.py`
- `PyAutoArray:autoarray/inversion/inversion/abstract.py`
- `PyAutoLens:autolens/lens/tracer.py`
- `PyAutoLens:autolens/lens/tracer_util.py`
- `PyAutoLens:autolens/imaging/fit_imaging.py`
- `PyAutoLens:autolens/imaging/model/result.py`
- `PyAutoLens:autolens/interferometer/fit_interferometer.py`
- `PyAutoLens:autolens/point/dataset.py`
- `PyAutoLens:autolens/point/solver/point_solver.py`
- `PyAutoLens:autolens/point/fit/`
- `PyAutoGalaxy:autogalaxy/operate/lens_calc.py`
- `PyAutoGalaxy:autogalaxy/galaxy/galaxy.py`
- `PyAutoFit:autofit/non_linear/result.py`
- `PyAutoFit:autofit/non_linear/samples/`
- `PyAutoFit:autofit/non_linear/grid/sensitivity/`
- `PyAutoFit:autofit/non_linear/paths/`
- `PyAutoFit:autofit/graphical/declarative/`

### 官方 PyAutoLens 文档与 workspace

- [PyAutoLens 官方首页](https://pyautolens.readthedocs.io/en/latest/)
- [LensCalc 官方 API](https://pyautolens.readthedocs.io/en/latest/api/_autosummary/autolens.LensCalc.html)
- [PointDataset 官方 API](https://pyautolens.readthedocs.io/en/latest/api/_autosummary/autolens.PointDataset.html)
- [Features：subhalo、sensitivity、graphical models](https://pyautolens.readthedocs.io/en/latest/overview/overview_3_features.html)
- `autolens_workspace:scripts/imaging/data_preparation/start_here.py`
- `autolens_workspace:scripts/imaging/start_here.py`
- `autolens_workspace:scripts/guides/lens_calc.py`
- `autolens_workspace:scripts/guides/results/start_here.py`
- `autolens_workspace:scripts/guides/results/aggregator/`
- `autolens_workspace:scripts/imaging/features/pixelization/fit.py`
- `autolens_workspace:scripts/interferometer/start_here.py`
- `autolens_workspace:scripts/point_source/start_here.py`
- `autolens_workspace:scripts/multi_dataset/`
- `autolens_workspace:scripts/imaging/features/advanced/subhalo/`

### 官方 Lightning 来源

- [Lightning-AI/pytorch-lightning 官方仓库](https://github.com/Lightning-AI/pytorch-lightning)
- [LightningModule 官方源码文档](https://github.com/Lightning-AI/pytorch-lightning/blob/master/docs/source-pytorch/common/lightning_module.rst)
- [Trainer 官方文档](https://lightning.ai/docs/pytorch/stable/common/trainer)
