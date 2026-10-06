"use strict";

const INITIAL_LOCALE = localStorage.getItem("pyautolens-workbench-locale") === "zh-CN" ? "zh-CN" : "en";

const I18N = {
  "zh-CN": {
    app_title: "PyAutoLens 可视化工作台",
    app_subtitle: "参数驱动的强引力透镜模拟、几何与推断",
    controls_eyebrow: "参数控制", parameters_aria: "物理和观测参数", workspace_modes_aria: "工作台模式",
    geometry_iframe_title: "三维引力透镜几何", image_products_aria: "图像产品", science_canvas_aria: "实时引力透镜图像",
    axis_x: "x（角秒）", axis_y: "y（角秒）", colourbar_aria: "当前图像的数值色条",
    science_eyebrow: "科研诊断", fit_eyebrow: "交互推断", fit_result_eyebrow: "拟合结果",
    connecting: "正在连接计算引擎…", reset: "恢复默认", export: "导出参数", import: "导入参数",
    parameters: "实验参数", parameters_summary: "先选典型构型，再按需展开参数组。左侧、三维拖动与 PyAutoLens 精确图共享同一份模型状态。",
    starting_config: "起始构型", lens_presets: "透镜预设", preset_ring: "爱因斯坦环", preset_arc: "近轴双弧",
    preset_double: "离轴双像", preset_cross: "爱因斯坦十字",
    preset_hint: "预设只填写同一份模型参数；红色预览和蓝色 PyAutoLens 图都会重新计算，不读取预制图片。",
    workspace_title: "强引力透镜实验工作区", nav_geometry: "三维几何", nav_images: "观测与诊断图", nav_science: "科研产品库", nav_fit: "快速拟合",
    geometry_eyebrow: "教学几何", geometry_title: "三维光路与红移平面",
    geometry_description: "源位置与左侧参数双向同步；蓝色科研图来自同一次 PyAutoLens 计算。光线数量只控制三维显示密度。",
    colour_map: "色表", cmap_autoarray: "AutoArray 科研（蓝→绿→黄→红）", cmap_paper: "白底教学", cmap_gray: "灰度",
    log_stretch: "对数拉伸", mask_overlay: "掩膜叠加", current_result: "当前结果",
    metric_engine: "计算引擎", metric_time: "计算耗时", metric_fov: "视场", metric_shape: "图像大小",
    coordinate_title: "坐标约定", coordinate_text: "界面使用屏幕直觉的 x 向右、y 向上；送入 PyAutoLens 时自动转换为其 <code>(y, x)</code> 顺序。",
    science_group: "产品组", science_title: "研究级数据产品", science_description: "按研究阶段选择同一组参数生成的观测、模型、诊断与透镜物理量；不可凭当前状态计算的流程会明确标注前置条件。",
    download_current_heading: "下载当前图像", download_current_help: "PNG 下载短边至少 1200 px 的高分辨率预览；FITS 与 CSV 保留原生数值数据数组。", download_current_aria: "下载当前图像",
    download_png: "PNG", download_fits: "FITS", download_csv: "CSV", download_group: "下载当前组 ZIP", download_all: "下载全部产品 ZIP",
    standard_group: "标准诊断组", workflow_title: "需要额外数据或拟合结果的研究流程", available_now: "当前可算", requires_dataset: "需要数据集", requires_fit: "需要拟合结果", not_adapted: "尚未接入",
    fit_title: "用当前模拟做快速参数恢复", fit_description: "先把当前 PyAutoLens 观测锁定为“数据”，再在左侧改变参数作为初值。运行后，最小二乘优化器会反复调用同一 PyAutoLens 正向模型。",
    fit_freeze: "① 锁定当前观测", fit_run: "② 运行快速拟合", fit_apply: "应用拟合结果", fit_unfrozen: "尚未锁定数据。",
    fit_boundary_title: "用途边界", fit_boundary: "这是交互教学用的有界最小二乘拟合，不是完整的 PyAutoFit / Nautilus 后验推断。正式科研还需要先验、采样器、残差检查和不确定度。",
    free_parameters: "自由参数", max_evaluations: "最大函数评估", fit_results: "参数恢复结果", fit_results_placeholder: "运行拟合后，这里会对比初值与恢复值。",
    local_only: "本地运行 · 参数与图像不会上传 · 系统无衬线字体界面", waiting_first_result: "等待第一次 PyAutoLens 结果",
    collapse: "收起", expand: "展开", quick_wait: "近似预览 · 等待 PyAutoLens", browser_preview: "浏览器近似预览", instant: "即时",
    params_changed: "参数已变化，正在生成新的 PyAutoLens 结果", live_raytrace: "PyAutoLens 实时光追",
    compute_failed: "计算失败 · 保留近似预览", preview_after_fail: "计算失败；当前画面是浏览器近似预览", relative_intensity: "相对强度",
    science_wait: "正在用当前参数生成同一组 PyAutoLens 科研诊断图…", array_wait: "等待精确数组", same_simulation: "同一次实时模拟",
    no_noise_note: "当前未加入泊松噪声，因此 Data 与 Model 相同，归一化残差和 χ² 接近零；打开左侧“加入泊松噪声”即可检查模拟观测的统计结构。",
    fit_wait_exact: "请先等待当前画面显示“PyAutoLens 实时光追”。", fit_choose: "请选择 1–5 个自由参数。",
    fit_running: "正在反复调用 PyAutoLens 正向模型；点源求解可能需要几秒。", service_offline: "本地服务未连接",
    launch_hint: "请通过 START_WINDOWS.cmd 或 START_MAC.command 启动工作台，不要直接双击 index.html。",
  },
  en: {
    app_title: "PyAutoLens Visual Workbench",
    app_subtitle: "Parameter-driven strong-lensing simulation, geometry and inference",
    controls_eyebrow: "Experiment controls", parameters_aria: "Physical and observational parameters", workspace_modes_aria: "Workbench modes",
    geometry_iframe_title: "3D gravitational-lensing geometry", image_products_aria: "Image products", science_canvas_aria: "Live gravitational-lensing image",
    axis_x: "x (arcsec)", axis_y: "y (arcsec)", colourbar_aria: "Numeric colour bar for the current image",
    science_eyebrow: "Scientific diagnostics", fit_eyebrow: "Interactive inference", fit_result_eyebrow: "Fit result",
    connecting: "Connecting to the compute engine…", reset: "Reset", export: "Export", import: "Import",
    parameters: "Experiment parameters", parameters_summary: "Choose a configuration, then open only the parameter group you need. The sidebar, 3D drag controls and exact PyAutoLens image share one model state.",
    starting_config: "Starting configuration", lens_presets: "Lens presets", preset_ring: "Einstein ring", preset_arc: "Near-axis double arc",
    preset_double: "Off-axis double", preset_cross: "Einstein cross",
    preset_hint: "Presets update the shared model. Both the red preview and blue PyAutoLens image are recomputed; no preset image is loaded.",
    workspace_title: "Strong-lensing laboratory", nav_geometry: "3D geometry", nav_images: "Observation & diagnostics", nav_science: "Research products", nav_fit: "Quick fit",
    geometry_eyebrow: "Teaching geometry", geometry_title: "3D light paths and redshift planes",
    geometry_description: "Source position is synchronized with the sidebar. The blue science image comes from the same PyAutoLens calculation; ray count changes display density only.",
    colour_map: "Colour map", cmap_autoarray: "AutoArray science (blue→green→yellow→red)", cmap_paper: "White teaching view", cmap_gray: "Grayscale",
    log_stretch: "Log stretch", mask_overlay: "Mask overlay", current_result: "Current result",
    metric_engine: "Engine", metric_time: "Runtime", metric_fov: "Field of view", metric_shape: "Image shape",
    coordinate_title: "Coordinate convention", coordinate_text: "The interface uses screen-intuitive x to the right and y upward; values are converted to PyAutoLens <code>(y, x)</code> order.",
    science_group: "Product group", science_title: "Research-grade data products", science_description: "Choose observation, model, diagnostic and lens-physics products derived from one parameter state. Workflows that need a dataset or completed fit state their prerequisites explicitly.",
    download_current_heading: "Download current image", download_current_help: "PNG downloads a high-resolution preview with a shorter side of at least 1200 px; FITS and CSV retain the native numeric data arrays.", download_current_aria: "Download current image",
    download_png: "PNG", download_fits: "FITS", download_csv: "CSV", download_group: "Download group ZIP", download_all: "Download all products ZIP",
    standard_group: "Standard diagnostic set", workflow_title: "Research workflows requiring extra data or fit results", available_now: "Available now", requires_dataset: "Dataset required", requires_fit: "Fit result required", not_adapted: "Not yet adapted",
    fit_title: "Recover parameters from the current simulation", fit_description: "Freeze the current PyAutoLens observation as data, alter the sidebar values as an initial guess, then repeatedly evaluate the same forward model.",
    fit_freeze: "① Freeze observation", fit_run: "② Run quick fit", fit_apply: "Apply fit", fit_unfrozen: "No dataset has been frozen.",
    fit_boundary_title: "Scope", fit_boundary: "This bounded least-squares fit is for interaction and teaching; it is not full PyAutoFit / Nautilus posterior inference. Research use also requires priors, a search, residual checks and uncertainties.",
    free_parameters: "Free parameters", max_evaluations: "Maximum evaluations", fit_results: "Recovered parameters", fit_results_placeholder: "Initial and recovered values will appear here after fitting.",
    local_only: "Runs locally · parameters and images are not uploaded · system sans-serif fonts", waiting_first_result: "Waiting for the first PyAutoLens result",
    collapse: "Collapse", expand: "Expand", quick_wait: "Approximate preview · waiting for PyAutoLens", browser_preview: "Approximate browser preview", instant: "Instant",
    params_changed: "Parameters changed; generating a new PyAutoLens result", live_raytrace: "PyAutoLens live ray tracing",
    compute_failed: "Calculation failed · keeping approximate preview", preview_after_fail: "Calculation failed; showing the approximate browser preview", relative_intensity: "Relative intensity",
    science_wait: "Generating the PyAutoLens diagnostic set from the current parameters…", array_wait: "Waiting for exact arrays", same_simulation: "Same live simulation",
    no_noise_note: "Poisson noise is off, so Data and Model match and the normalized residuals and χ² are near zero. Enable ‘Add Poisson noise’ to inspect simulated observational statistics.",
    fit_wait_exact: "Wait until the current view shows ‘PyAutoLens live ray tracing’.", fit_choose: "Choose 1–5 free parameters.",
    fit_running: "Repeatedly evaluating the PyAutoLens forward model; point-source solving may take a few seconds.", service_offline: "Local service is offline",
    launch_hint: "Start the workbench with START_WINDOWS.cmd or START_MAC.command instead of opening index.html directly.",
  },
};

const PRODUCT_DEFINITIONS_EN = {
  observed: ["Simulated Observation", "Foreground lens light, lensed source light, PSF and the selected noise model."],
  model: ["Noise-free Model", "The PSF-convolved model from the same physical parameters, without random noise."],
  lens_light: ["Foreground Lens Light", "Starlight emitted by the lens galaxy; it is not a lensed arc."],
  lensed_source: ["Lensed Background Source", "The source ray-traced through the mass distribution into rings, arcs or multiple images."],
  source_plane: ["Source-plane Brightness", "Intrinsic source brightness before lensing."],
  noise: ["Noise Map", "The one-sigma uncertainty per pixel."],
  signal_to_noise: ["Signal-to-noise Map", "Observed intensity divided by the pixel noise."],
  lens_light_subtracted: ["Lens-light Subtracted", "Observed data minus the foreground lens-light model."],
  residual: ["Residual Map", "Observed data minus the noise-free model."],
  normalized_residual: ["Normalized Residual", "Residual divided by the pixel noise, in sigma."],
  chi_squared: ["Chi-squared Contribution", "The non-negative per-pixel contribution to total chi-squared."],
  log10_model: ["Log Model", "Base-10 logarithm of the model to reveal faint outer structure."],
  mask: ["Fit Mask", "White pixels are included in the fit; outer pixels are excluded."],
  masked_observed: ["Masked Observation", "Observed data inside the circular fitting region."],
};

const PARAMETER_GROUPS_EN = {
  geometry: { title: "Planes & mass model", note: "zₗ and zₛ move the lens and source planes in the 3D scene and remain attached to the same PyAutoLens metadata. The deflection scale is set directly by θE, so changing redshift alone does not rescale the image." },
  lensLight: { title: "Foreground lens light" },
  source: { title: "Background source galaxy" },
  observation: { title: "Telescope, noise & mask" },
};

const PARAMETER_LABELS_EN = {
  mass_model: "Mass profile", lens_redshift: "Lens redshift zₗ", source_redshift: "Source redshift zₛ", einstein_radius: "Einstein radius θE",
  lens_x: "Lens-galaxy x (lens plane)", lens_y: "Lens-galaxy y (lens plane)", mass_axis_ratio: "Mass axis ratio q", mass_angle: "Mass position angle",
  shear_gamma_1: "External shear γ₁", shear_gamma_2: "External shear γ₂", lens_light_enabled: "Show lens light", lens_intensity: "Central intensity",
  lens_effective_radius: "Effective radius Re", lens_sersic_index: "Sérsic index n", lens_axis_ratio: "Light axis ratio q", lens_angle: "Light position angle",
  source_model: "Source type", source_x: "Source-galaxy βx (source plane)", source_y: "Source-galaxy βy (source plane)", source_intensity: "Source intensity",
  source_effective_radius: "Source effective radius Re", source_sersic_index: "Source Sérsic index n", source_axis_ratio: "Source axis ratio q", source_angle: "Source position angle",
  image_pixels: "Image pixels", pixel_scale: "Pixel scale", psf_sigma: "PSF σ", exposure_time: "Exposure time", background_sky: "Sky background",
  add_poisson_noise: "Add Poisson noise", noise_seed: "Noise seed", mask_radius: "Circular mask radius",
};

const OPTION_TEXT_EN = {
  "球对称等温 · SIS": "Spherical isothermal · SIS", "椭圆等温 · SIE": "Elliptical isothermal · SIE", "SIE + 外部剪切": "SIE + external shear",
  "扩展 Sérsic 星系": "Extended Sérsic galaxy", "点源 / 类星体": "Point source / quasar",
  "81 × 81（快）": "81 × 81 (fast)", "101 × 101": "101 × 101", "121 × 121（细）": "121 × 121 (fine)",
};

function t(key) {
  return I18N[state?.locale || INITIAL_LOCALE]?.[key] || I18N["zh-CN"][key] || key;
}

function localizedProduct(key) {
  const product = state?.productCatalog?.find((candidate) => candidate.id === key);
  const labels = product?.labels?.[state?.locale || INITIAL_LOCALE];
  if (labels) return [labels.title, labels.description];
  return (state?.locale || INITIAL_LOCALE) === "en" ? PRODUCT_DEFINITIONS_EN[key] : PRODUCT_DEFINITIONS[key];
}

function productMetadata(key) {
  const product = state?.productCatalog?.find((candidate) => candidate.id === key);
  if (!product) return PRODUCT_METADATA[key] || { unit: t("relative_intensity"), norm: "linear" };
  return {
    category: product.category,
    unit: product.unit,
    norm: product.norm,
    floorZero: Boolean(product.floor_zero),
    preTransformed: Boolean(product.pre_transformed),
    allowMaskOverlay: Boolean(product.allow_mask_overlay),
  };
}

const PRODUCT_DEFINITIONS = {
  observed: ["合成观测图", "前景透镜光、被透镜背景源、PSF 与所选噪声共同构成的数据。"],
  model: ["无噪声模型", "同一组物理参数产生的 PSF 卷积模型，不包含随机噪声。"],
  lens_light: ["前景透镜星光", "透镜星系恒星发出的光。它不是被引力弯曲形成的弧。"],
  lensed_source: ["被透镜背景源", "背景源经质量分布射线追踪后，在像平面形成的环、弧或多像。"],
  source_plane: ["源平面亮度", "未被透镜前的背景源本征光度分布。"],
  noise: ["噪声图", "每个像素的一倍标准差不确定度；亮像素通常也带有更大的泊松绝对噪声。"],
  signal_to_noise: ["信噪比图", "每个像素的观测值除以其噪声标准差。"],
  lens_light_subtracted: ["透镜光扣除图", "观测数据减去前景透镜星光模型，保留被透镜源像以及观测噪声。"],
  residual: ["残差图", "观测数据减去无噪声模型；正负结构用于检查模型遗漏。"],
  normalized_residual: ["归一化残差", "残差除以逐像素噪声，色条单位为标准差 σ。"],
  chi_squared: ["χ² 贡献图", "归一化残差的平方；每个像素对总 χ² 的非负贡献。"],
  log10_model: ["模型对数图", "对无噪声模型取 log10，使微弱的外侧结构更容易看见。"],
  mask: ["拟合掩膜", "白色区域保留用于拟合，外侧区域被排除。"],
  masked_observed: ["掩膜后的观测图", "仅显示圆形拟合区域内的数据。"],
};

const PRODUCT_METADATA = {
  observed: { unit: "e⁻ s⁻¹", norm: "linear" },
  model: { unit: "e⁻ s⁻¹", norm: "linear", floorZero: true },
  lens_light: { unit: "e⁻ s⁻¹", norm: "linear", floorZero: true },
  lensed_source: { unit: "e⁻ s⁻¹", norm: "linear", floorZero: true },
  source_plane: { unit: "e⁻ s⁻¹", norm: "linear", floorZero: true },
  lens_light_subtracted: { unit: "e⁻ s⁻¹", norm: "linear" },
  residual: { unit: "e⁻ s⁻¹", norm: "symmetric" },
  normalized_residual: { unit: "σ", norm: "symmetric" },
  chi_squared: { unit: "χ²", norm: "linear", floorZero: true },
  noise: { unit: "e⁻ s⁻¹", norm: "linear", floorZero: true },
  signal_to_noise: { unit: "S/N", norm: "linear", floorZero: true },
  log10_model: { unit: "log₁₀(e⁻ s⁻¹)", norm: "linear", preTransformed: true },
  mask: { unit: "0 / 1", norm: "categorical" },
  masked_observed: { unit: "e⁻ s⁻¹", norm: "linear" },
};

const SCIENCE_PANELS = [
  { key: "observed", zh: "数据", en: "Data" },
  { key: "model", zh: "模型图", en: "Model Image" },
  { key: "signal_to_noise", zh: "信噪比图", en: "Signal-To-Noise Map", floorZero: true },
  { key: "source_plane", zh: "源平面（最大放大）", en: "Source Plane (Max Zoom)", zoom: 1 },
  { key: "lens_light", zh: "透镜星光模型图", en: "Lens Light Model Image" },
  { key: "lens_light_subtracted", zh: "扣除透镜星光", en: "Lens Light Subtracted", floorZero: true },
  { key: "lensed_source", zh: "背景源模型图", en: "Source Model Image", floorZero: true },
  { key: "source_plane", zh: "源平面（中等放大）", en: "Source Plane (Mid Zoom)", zoom: 2 },
  { key: "normalized_residual", zh: "归一化残差图", en: "Normalized Residual Map", symmetric: true },
  { key: "normalized_residual", zh: "归一化残差图 1σ", en: "Normalized Residual Map 1σ", minimum: -1, maximum: 1 },
  { key: "chi_squared", zh: "χ² 图", en: "Chi-Squared Map", floorZero: true },
  { key: "source_plane", zh: "源平面（未放大）", en: "Source Plane (No Zoom)" },
];

function sciencePanelsForCurrentGroup() {
  if (state.scienceGroup === "standard" || !state.productCatalog.length) return SCIENCE_PANELS;
  return state.productCatalog
    .filter((product) => product.category === state.scienceGroup)
    .map((product) => {
      const labels = product.labels || {};
      return {
        key: product.id,
        zh: labels["zh-CN"]?.title || product.id,
        en: labels.en?.title || product.id,
        symmetric: product.norm === "symmetric",
        floorZero: Boolean(product.floor_zero),
      };
    });
}

function scienceProductIds() {
  return [...new Set(sciencePanelsForCurrentGroup().map((panel) => panel.key))];
}

function buildScienceLibraryControls() {
  if (!elements.scienceGroupSelect) return;
  const options = [
    { id: "standard", labels: { "zh-CN": t("standard_group"), en: t("standard_group") } },
    ...state.productCategories,
  ];
  elements.scienceGroupSelect.replaceChildren(...options.map((group) => {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.labels?.[state.locale] || group.id;
    option.selected = group.id === state.scienceGroup;
    return option;
  }));
}

function workflowStateLabel(value) {
  if (value === "requires_dataset") return t("requires_dataset");
  if (value === "requires_fit") return t("requires_fit");
  if (value === "not_adapted") return t("not_adapted");
  return t("available_now");
}

function renderWorkflowCatalog() {
  if (!elements.workflowCatalog) return;
  elements.workflowCatalog.replaceChildren(...state.workflowModules.map((workflow) => {
    const article = document.createElement("article");
    article.className = "workflow-item";
    const heading = document.createElement("div");
    const title = document.createElement("h4");
    title.textContent = workflow.labels?.[state.locale] || workflow.id;
    const badge = document.createElement("span");
    badge.className = `availability-badge is-${workflow.state}`;
    badge.textContent = workflowStateLabel(workflow.state);
    heading.append(title, badge);
    const requirements = document.createElement("p");
    requirements.textContent = workflow.requirements.join(" · ");
    article.append(heading, requirements);
    return article;
  }));
}

const PARAMETER_GROUPS = [
  {
    id: "geometry",
    title: "平面与质量模型",
    eyebrow: "Lens geometry",
    note: "zₗ 与 zₛ 同时控制三维场景中的透镜平面、源平面前后位置和 PyAutoLens 元数据。x/y 是透镜星系在透镜平面的中心位置（当前质量与透镜星光共用）；源星系 βx/βy 在源平面内独立调整。当前直接使用角尺度 θE，因此仅改红移不会自动改变像。",
    controls: [
      { key: "mass_model", label: "质量轮廓", type: "select", options: [
        ["isothermal_sph", "球对称等温 · SIS"],
        ["isothermal", "椭圆等温 · SIE"],
        ["isothermal_shear", "SIE + 外部剪切"],
      ] },
      { key: "lens_redshift", label: "透镜平面红移 zₗ", min: 0.05, max: 2.0, step: 0.01, digits: 2 },
      { key: "source_redshift", label: "源平面红移 zₛ", min: 0.1, max: 5.0, step: 0.01, digits: 2 },
      { key: "einstein_radius", label: "爱因斯坦半径 θE", unit: "″", min: 0.1, max: 2.2, step: 0.01, digits: 2 },
      { key: "lens_x", label: "透镜星系位置 x（透镜平面）", unit: "″", min: -0.6, max: 0.6, step: 0.01, digits: 2 },
      { key: "lens_y", label: "透镜星系位置 y（透镜平面）", unit: "″", min: -0.6, max: 0.6, step: 0.01, digits: 2 },
      { key: "mass_axis_ratio", label: "质量轴比 q", min: 0.35, max: 1.0, step: 0.01, digits: 2 },
      { key: "mass_angle", label: "质量位置角", unit: "°", min: 0, max: 180, step: 1, digits: 0 },
      { key: "shear_gamma_1", label: "外部剪切 γ₁", min: -0.25, max: 0.25, step: 0.005, digits: 3 },
      { key: "shear_gamma_2", label: "外部剪切 γ₂", min: -0.25, max: 0.25, step: 0.005, digits: 3 },
    ],
  },
  {
    id: "lensLight",
    title: "前景透镜星光",
    eyebrow: "Lens light",
    controls: [
      { key: "lens_light_enabled", label: "显示透镜星光", type: "boolean" },
      { key: "lens_intensity", label: "中心强度", min: 0.0, max: 1.2, step: 0.01, digits: 2 },
      { key: "lens_effective_radius", label: "有效半径 Re", unit: "″", min: 0.08, max: 1.5, step: 0.01, digits: 2 },
      { key: "lens_sersic_index", label: "Sérsic 指数 n", min: 0.4, max: 6.0, step: 0.1, digits: 1 },
      { key: "lens_axis_ratio", label: "星光轴比 q", min: 0.3, max: 1.0, step: 0.01, digits: 2 },
      { key: "lens_angle", label: "星光位置角", unit: "°", min: 0, max: 180, step: 1, digits: 0 },
    ],
  },
  {
    id: "source",
    title: "背景源星系",
    eyebrow: "Source light",
    controls: [
      { key: "source_model", label: "源类型", type: "select", options: [
        ["sersic", "扩展 Sérsic 星系"],
        ["point", "点源 / 类星体"],
      ] },
      { key: "source_x", label: "源星系位置 βx（源平面）", unit: "″", min: -1.5, max: 1.5, step: 0.01, digits: 2 },
      { key: "source_y", label: "源星系位置 βy（源平面）", unit: "″", min: -1.5, max: 1.5, step: 0.01, digits: 2 },
      { key: "source_intensity", label: "源强度", min: 0.05, max: 2.5, step: 0.01, digits: 2 },
      { key: "source_effective_radius", label: "源有效半径 Re", unit: "″", min: 0.005, max: 0.5, step: 0.005, digits: 3 },
      { key: "source_sersic_index", label: "源 Sérsic 指数 n", min: 0.4, max: 5.0, step: 0.1, digits: 1 },
      { key: "source_axis_ratio", label: "源轴比 q", min: 0.3, max: 1.0, step: 0.01, digits: 2 },
      { key: "source_angle", label: "源位置角", unit: "°", min: 0, max: 180, step: 1, digits: 0 },
    ],
  },
  {
    id: "observation",
    title: "望远镜、噪声与掩膜",
    eyebrow: "Observation",
    controls: [
      { key: "image_pixels", label: "像素数", type: "select", options: [[81, "81 × 81（快）"], [101, "101 × 101"], [121, "121 × 121（细）"]] },
      { key: "pixel_scale", label: "像素尺度", unit: "″/pix", min: 0.02, max: 0.09, step: 0.005, digits: 3 },
      { key: "psf_sigma", label: "PSF σ", unit: "″", min: 0.0, max: 0.2, step: 0.005, digits: 3 },
      { key: "exposure_time", label: "曝光时间", unit: "s", min: 30, max: 1800, step: 10, digits: 0 },
      { key: "background_sky", label: "天空背景", unit: "e⁻/s", min: 0, max: 0.5, step: 0.005, digits: 3 },
      { key: "add_poisson_noise", label: "加入泊松噪声", type: "boolean" },
      { key: "noise_seed", label: "噪声随机种子", min: 0, max: 999, step: 1, digits: 0 },
      { key: "mask_radius", label: "圆形掩膜半径", unit: "″", min: 0.3, max: 4.0, step: 0.05, digits: 2 },
    ],
  },
];

const PRESETS = {
  ring: {
    mass_model: "isothermal_sph", lens_x: 0, lens_y: 0, einstein_radius: 1,
    mass_axis_ratio: 1, mass_angle: 0, shear_gamma_1: 0, shear_gamma_2: 0,
    source_model: "sersic", source_x: 0, source_y: 0, source_intensity: 1,
    source_effective_radius: 0.08, source_sersic_index: 1, source_axis_ratio: 0.9, source_angle: 0,
    psf_sigma: 0.06,
  },
  arc: {
    mass_model: "isothermal_sph", lens_x: 0, lens_y: 0, einstein_radius: 1,
    mass_axis_ratio: 1, mass_angle: 0, shear_gamma_1: 0, shear_gamma_2: 0,
    source_model: "sersic", source_x: 0.23, source_y: 0.08, source_intensity: 1,
    source_effective_radius: 0.08, source_sersic_index: 1, source_axis_ratio: 0.9, source_angle: 20,
    psf_sigma: 0.06,
  },
  double: {
    mass_model: "isothermal_sph", lens_x: 0, lens_y: 0, einstein_radius: 1,
    mass_axis_ratio: 1, mass_angle: 0, shear_gamma_1: 0, shear_gamma_2: 0,
    source_model: "sersic", source_x: 0.8, source_y: 0.06, source_intensity: 1,
    source_effective_radius: 0.09, source_sersic_index: 1, source_axis_ratio: 0.82, source_angle: 35,
    psf_sigma: 0.06,
  },
  cross: {
    mass_model: "isothermal_shear", lens_x: 0, lens_y: 0, einstein_radius: 1,
    mass_axis_ratio: 0.82, mass_angle: 12,
    shear_gamma_1: 0.07, shear_gamma_2: 0.025, source_model: "point", source_x: 0, source_y: 0,
    source_intensity: 2.5, source_effective_radius: 0.012, source_sersic_index: 0.5,
    source_axis_ratio: 1.0, psf_sigma: 0.035,
  },
};

const state = {
  locale: INITIAL_LOCALE,
  defaults: null,
  config: null,
  result: null,
  preview: null,
  productCatalog: [],
  productCategories: [],
  workflowModules: [],
  activeProduct: "observed",
  activeProductCategory: "observation",
  scienceGroup: "standard",
  productController: null,
  productRequestKey: "",
  requestSequence: 0,
  timer: null,
  controller: null,
  geometryRayDensity: Math.max(20, Math.min(80, Math.round((Number(localStorage.getItem("pyautolens-workbench-ray-density")) || 48) / 4) * 4)),
  fitSnapshot: null,
  fitResult: null,
  runtimePhase: "connecting",
  runtimeError: null,
  fitPhase: "unfrozen",
  fitError: null,
};

const elements = {
  groups: document.getElementById("parameter-groups"),
  products: document.getElementById("product-tabs"),
  canvas: document.getElementById("science-canvas"),
  status: document.getElementById("engine-status"),
  footer: document.getElementById("footer-state"),
  error: document.getElementById("error-box"),
  colourMap: document.getElementById("colour-map"),
  displayLog: document.getElementById("display-log"),
  showMask: document.getElementById("show-mask"),
  productTitle: document.getElementById("product-title"),
  productDescription: document.getElementById("product-description"),
  rangeMin: document.getElementById("range-min"),
  rangeMax: document.getElementById("range-max"),
  colourbar: document.getElementById("colourbar"),
  colourbarLabels: document.getElementById("colourbar-labels"),
  colourbarUnit: document.getElementById("colourbar-unit"),
  xAxisTicks: document.getElementById("x-axis-ticks"),
  yAxisTicks: document.getElementById("y-axis-ticks"),
  scienceGrid: document.getElementById("science-grid"),
  scienceGroupSelect: document.getElementById("science-group-select"),
  workflowCatalog: document.getElementById("workflow-catalog"),
};

function translateFitParameterLabels() {
  document.querySelectorAll("#fit-parameter-list label").forEach((label) => {
    const input = label.querySelector("input");
    const textNode = Array.from(label.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
    if (!input || !textNode) return;
    if (!label.dataset.zh) label.dataset.zh = textNode.nodeValue.trim();
    const translated = state.locale === "en" ? (PARAMETER_LABELS_EN[input.value] || label.dataset.zh) : label.dataset.zh;
    textNode.nodeValue = ` ${translated}`;
  });
}

function refreshRuntimeLanguage() {
  if (state.runtimePhase === "offline") {
    elements.status.className = "status-pill is-error";
    elements.status.textContent = t("service_offline");
    elements.error.hidden = false;
    elements.error.textContent = t("launch_hint");
    return;
  }
  if (state.runtimePhase === "simulation-error") {
    elements.status.className = "status-pill is-error";
    elements.status.textContent = t("compute_failed");
    elements.error.hidden = false;
    elements.error.textContent = state.locale === "en"
      ? `PyAutoLens calculation failed: ${state.runtimeError || "unknown error"}`
      : `PyAutoLens 计算没有完成：${state.runtimeError || "未知错误"}`;
    elements.footer.textContent = t("preview_after_fail");
    return;
  }
  if (state.runtimePhase === "exact" && state.result) {
    elements.status.className = "status-pill";
    elements.status.textContent = t("live_raytrace");
    elements.footer.textContent = state.locale === "en"
      ? `Current image generated live by PyAutoLens · ${state.result.elapsed_ms.toFixed(0)} ms`
      : `当前图像由 PyAutoLens 按参数实时生成 · ${state.result.elapsed_ms.toFixed(0)} ms`;
  } else if (state.config) {
    elements.status.className = "status-pill is-loading";
    elements.status.textContent = t("quick_wait");
    elements.footer.textContent = t("params_changed");
  } else {
    elements.status.className = "status-pill is-loading";
    elements.status.textContent = t("connecting");
  }
}

function renderFitStateLanguage() {
  const status = document.getElementById("fit-snapshot-status");
  const body = document.getElementById("fit-results-body");
  if (state.fitPhase === "result" && state.fitResult) {
    renderFitResult(state.fitResult);
    status.className = state.fitResult.success || state.fitResult.improved ? "fit-status is-success" : "fit-status";
    const outcome = state.locale === "en"
      ? (state.fitResult.success ? "Fit converged" : state.fitResult.improved ? "Fit completed at the evaluation limit" : "Fit did not converge")
      : (state.fitResult.success ? "拟合已收敛" : state.fitResult.improved ? "拟合完成（达到评估上限）" : "拟合未收敛");
    status.textContent = state.locale === "en"
      ? `${outcome}: χ² decreased from ${state.fitResult.initial_chi_squared.toFixed(1)} to ${state.fitResult.final_chi_squared.toFixed(1)}.`
      : `${outcome}：χ² 从 ${state.fitResult.initial_chi_squared.toFixed(1)} 降至 ${state.fitResult.final_chi_squared.toFixed(1)}。`;
    return;
  }
  if (state.fitPhase === "running") {
    status.className = "fit-status is-running";
    status.textContent = t("fit_running");
    return;
  }
  if (state.fitPhase === "error") {
    status.className = "fit-status is-error";
    status.textContent = state.locale === "en" ? `Fit failed: ${state.fitError || "unknown error"}` : `拟合未完成：${state.fitError || "未知错误"}`;
    return;
  }
  if (state.fitPhase === "waiting-error") {
    status.className = "fit-status is-error";
    status.textContent = t("fit_wait_exact");
    return;
  }
  if (state.fitPhase === "selection-error") {
    status.className = "fit-status is-error";
    status.textContent = t("fit_choose");
    return;
  }
  if (state.fitPhase === "frozen" && state.fitSnapshot) {
    const shape = `${state.fitSnapshot.data.length} × ${state.fitSnapshot.data[0].length}`;
    status.className = "fit-status is-success";
    status.textContent = state.locale === "en"
      ? `Frozen ${shape} observation. Change sidebar values to define the initial guess.`
      : `已锁定 ${shape} 观测。现在可在左侧改变参数，作为拟合初值。`;
    body.innerHTML = state.locale === "en"
      ? "<p>Data frozen. Change sidebar parameters, then run the fit.</p>"
      : "<p>数据已锁定；改变左侧参数后运行拟合。</p>";
    return;
  }
  status.className = "fit-status";
  status.textContent = t("fit_unfrozen");
  body.innerHTML = `<p>${t("fit_results_placeholder")}</p>`;
}

function applyLocale(locale, { persist = true } = {}) {
  const nextLocale = locale === "en" ? "en" : "zh-CN";
  const openGroup = elements.groups.querySelector("details.parameter-group[open]")?.dataset.group || null;
  state.locale = nextLocale;
  if (persist) localStorage.setItem("pyautolens-workbench-locale", nextLocale);
  document.documentElement.lang = nextLocale;
  document.title = t("app_title");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    if (["engine-status", "footer-state", "fit-snapshot-status"].includes(element.id)) return;
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.setAttribute("title", t(element.dataset.i18nTitle));
  });
  const languageButton = document.getElementById("language-toggle");
  languageButton.textContent = nextLocale === "en" ? "中文" : "EN";
  languageButton.setAttribute("aria-label", nextLocale === "en" ? "切换到中文" : "Switch to English");
  translateFitParameterLabels();
  if (state.config) {
    buildControls();
    if (openGroup) elements.groups.querySelector(`[data-group="${openGroup}"]`)?.setAttribute("open", "");
    buildProductTabs();
    buildScienceLibraryControls();
    updateProductTabs();
    renderCurrentProduct();
    renderScienceGrid();
    renderWorkflowCatalog();
  }
  refreshRuntimeLanguage();
  renderFitStateLanguage();
  syncGeometryFrame();
}

function controlLabel(control) {
  return state.locale === "en" ? (PARAMETER_LABELS_EN[control.key] || control.label) : control.label;
}

function optionLabel(text) {
  return state.locale === "en" ? (OPTION_TEXT_EN[text] || text) : text;
}

function formatValue(control, value) {
  if (control.type === "select") {
    const match = control.options.find(([optionValue]) => String(optionValue) === String(value));
    return match ? optionLabel(match[1]) : String(value);
  }
  if (control.type === "boolean") return value ? (state.locale === "en" ? "On" : "开") : (state.locale === "en" ? "Off" : "关");
  return `${Number(value).toFixed(control.digits ?? 2)}${control.unit ? ` ${control.unit}` : ""}`;
}

const CONTROL_SCHEMA = new Map(PARAMETER_GROUPS.flatMap((group) => group.controls.map((control) => [control.key, control])));

function normalizeControlNumber(control, value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  const clamped = Math.min(control.max, Math.max(control.min, numeric));
  const step = Number(control.step) || 0;
  const snapped = step > 0 ? control.min + Math.round((clamped - control.min) / step) * step : clamped;
  return Number(snapped.toFixed(control.digits ?? 6));
}

function normalizeConfig(candidate) {
  const normalized = { ...state.defaults };
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return normalized;
  for (const [key, control] of CONTROL_SCHEMA) {
    if (!Object.prototype.hasOwnProperty.call(candidate, key)) continue;
    const value = candidate[key];
    if (control.type === "boolean") {
      if (typeof value === "boolean") normalized[key] = value;
      continue;
    }
    if (control.type === "select") {
      const option = control.options.find(([optionValue]) => String(optionValue) === String(value));
      if (option) normalized[key] = option[0];
      continue;
    }
    const numeric = normalizeControlNumber(control, value);
    if (numeric !== null) normalized[key] = numeric;
  }
  if (normalized.source_redshift <= normalized.lens_redshift) {
    normalized.source_redshift = Math.min(CONTROL_SCHEMA.get("source_redshift").max, normalized.lens_redshift + 0.05);
  }
  return normalized;
}

function createControl(control) {
  if (control.type === "boolean") {
    const row = document.createElement("div");
    row.className = "boolean-row";
    const label = controlLabel(control);
    row.innerHTML = `<span>${label}</span><button type="button" class="switch" role="switch" aria-label="${label}"></button>`;
    const button = row.querySelector("button");
    button.dataset.key = control.key;
    button.addEventListener("click", () => {
      state.config[control.key] = !state.config[control.key];
      updateAllControls();
      onConfigChanged();
    });
    return row;
  }

  const row = document.createElement("label");
  row.className = "control-row";
  const label = document.createElement("div");
  label.className = "control-label";
  label.innerHTML = `<span>${controlLabel(control)}</span><span class="control-value" data-value-for="${control.key}"></span>`;
  row.appendChild(label);

  if (control.type === "select") {
    const select = document.createElement("select");
    select.dataset.key = control.key;
    for (const [value, text] of control.options) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = optionLabel(text);
      select.appendChild(option);
    }
    select.addEventListener("change", () => {
      const selected = control.options.find(([value]) => String(value) === select.value)?.[0];
      state.config[control.key] = typeof selected === "number" ? Number(select.value) : select.value;
      onConfigChanged();
    });
    row.appendChild(select);
    return row;
  }

  const line = document.createElement("div");
  line.className = "range-line";
  const range = document.createElement("input");
  range.type = "range";
  range.min = control.min;
  range.max = control.max;
  range.step = control.step;
  range.dataset.key = control.key;
  const number = document.createElement("input");
  number.type = "number";
  number.min = control.min;
  number.max = control.max;
  number.step = control.step;
  number.dataset.numberKey = control.key;
  const setValue = (raw) => {
    const numeric = normalizeControlNumber(control, raw);
    if (numeric === null) return;
    state.config[control.key] = numeric;
    range.value = numeric;
    number.value = numeric;
    updateValueLabel(control);
    onConfigChanged();
  };
  range.addEventListener("input", () => setValue(range.value));
  number.addEventListener("change", () => setValue(number.value));
  line.append(range, number);
  row.appendChild(line);
  return row;
}

function buildControls() {
  elements.groups.replaceChildren();
  for (const group of PARAMETER_GROUPS) {
    const section = document.createElement("details");
    section.className = "parameter-group";
    section.dataset.group = group.id;
    const heading = document.createElement("summary");
    heading.className = "section-heading";
    const localizedGroup = state.locale === "en" ? PARAMETER_GROUPS_EN[group.id] : null;
    heading.innerHTML = `<h2>${localizedGroup?.title || group.title}</h2><span class="summary-meta"><span>${group.controls.length}</span><span class="collapse-button" aria-hidden="true">⌄</span></span>`;
    section.addEventListener("toggle", () => {
      heading.setAttribute("aria-expanded", String(section.open));
      if (!section.open) return;
      elements.groups.querySelectorAll("details.parameter-group[open]").forEach((other) => {
        if (other !== section) other.open = false;
      });
    });
    const list = document.createElement("div");
    list.className = "parameter-list";
    group.controls.forEach((control) => list.appendChild(createControl(control)));
    section.append(heading);
    if (group.note) {
      const note = document.createElement("p");
      note.className = "parameter-note";
      note.textContent = localizedGroup?.note || group.note;
      section.appendChild(note);
    }
    section.appendChild(list);
    elements.groups.appendChild(section);
  }
  updateAllControls();
}

function updateValueLabel(control) {
  const label = document.querySelector(`[data-value-for="${control.key}"]`);
  if (label) label.textContent = formatValue(control, state.config[control.key]);
}

function updateAllControls() {
  for (const group of PARAMETER_GROUPS) {
    for (const control of group.controls) {
      const value = state.config[control.key];
      updateValueLabel(control);
      const input = document.querySelector(`[data-key="${control.key}"]`);
      const number = document.querySelector(`[data-number-key="${control.key}"]`);
      if (control.type === "boolean") {
        input?.classList.toggle("is-on", Boolean(value));
        input?.setAttribute("aria-checked", String(Boolean(value)));
      } else if (input) {
        input.value = String(value);
      }
      if (number) number.value = String(value);
    }
  }
  const shearDisabled = state.config.mass_model !== "isothermal_shear";
  for (const key of ["shear_gamma_1", "shear_gamma_2"]) {
    document.querySelector(`[data-key="${key}"]`)?.toggleAttribute("disabled", shearDisabled);
    document.querySelector(`[data-number-key="${key}"]`)?.toggleAttribute("disabled", shearDisabled);
  }
  const sphericalMass = state.config.mass_model === "isothermal_sph";
  for (const key of ["mass_axis_ratio", "mass_angle"]) {
    document.querySelector(`[data-key="${key}"]`)?.toggleAttribute("disabled", sphericalMass);
    document.querySelector(`[data-number-key="${key}"]`)?.toggleAttribute("disabled", sphericalMass);
  }
  const pointSource = state.config.source_model === "point";
  for (const key of ["source_effective_radius", "source_sersic_index", "source_axis_ratio", "source_angle"]) {
    document.querySelector(`[data-key="${key}"]`)?.toggleAttribute("disabled", pointSource);
    document.querySelector(`[data-number-key="${key}"]`)?.toggleAttribute("disabled", pointSource);
  }
  const darkLens = !state.config.lens_light_enabled;
  for (const key of ["lens_intensity", "lens_effective_radius", "lens_sersic_index", "lens_axis_ratio", "lens_angle"]) {
    document.querySelector(`[data-key="${key}"]`)?.toggleAttribute("disabled", darkLens);
    document.querySelector(`[data-number-key="${key}"]`)?.toggleAttribute("disabled", darkLens);
  }
}

function buildProductTabs() {
  elements.products.replaceChildren();
  const catalog = state.productCatalog.length
    ? state.productCatalog
    : Object.keys(PRODUCT_DEFINITIONS).map((id) => ({ id, category: "observation" }));
  const activeSpec = catalog.find((product) => product.id === state.activeProduct);
  if (activeSpec) state.activeProductCategory = activeSpec.category;
  const categoryRow = document.createElement("div");
  categoryRow.className = "product-category-tabs";
  const categories = state.productCategories.length
    ? state.productCategories
    : [{ id: "observation", labels: { "zh-CN": "图像产品", en: "Image products" } }];
  for (const category of categories) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "product-category-tab";
    button.dataset.category = category.id;
    button.textContent = category.labels?.[state.locale] || category.id;
    button.classList.toggle("is-active", category.id === state.activeProductCategory);
    button.addEventListener("click", () => {
      state.activeProductCategory = category.id;
      const first = catalog.find((product) => product.category === category.id);
      if (first) state.activeProduct = first.id;
      buildProductTabs();
      renderCurrentProduct();
      ensureProducts([state.activeProduct]);
    });
    categoryRow.appendChild(button);
  }
  const productRow = document.createElement("div");
  productRow.className = "product-choice-row";
  for (const product of catalog.filter((candidate) => candidate.category === state.activeProductCategory)) {
    const [title] = localizedProduct(product.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "product-tab";
    button.dataset.product = product.id;
    button.textContent = title;
    button.addEventListener("click", () => {
      state.activeProduct = product.id;
      updateProductTabs();
      renderCurrentProduct();
      ensureProducts([product.id]);
    });
    productRow.appendChild(button);
  }
  elements.products.append(categoryRow, productRow);
  updateProductTabs();
}

function updateProductTabs() {
  document.querySelectorAll(".product-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.product === state.activeProduct);
  });
  document.querySelectorAll(".product-category-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === state.activeProductCategory);
  });
  const [title, description] = localizedProduct(state.activeProduct);
  elements.productTitle.textContent = title;
  elements.productDescription.textContent = description;
}

function sersic(radius, effectiveRadius, index, intensity) {
  const b = Math.max(0.6, 1.9992 * index - 0.3271);
  return intensity * Math.exp(-b * ((Math.max(radius, 1e-6) / effectiveRadius) ** (1 / index) - 1));
}

function ellipticalRadius(x, y, centerX, centerY, axisRatio, angleDegrees) {
  const angle = angleDegrees * Math.PI / 180;
  const dx = x - centerX;
  const dy = y - centerY;
  const major = dx * Math.cos(angle) + dy * Math.sin(angle);
  const minor = -dx * Math.sin(angle) + dy * Math.cos(angle);
  return Math.sqrt(major * major + (minor / Math.max(axisRatio, 0.2)) ** 2);
}

function makePreview() {
  const config = state.config;
  const size = 181;
  const fov = config.image_pixels * config.pixel_scale;
  const half = fov / 2;
  const lens = Array.from({ length: size }, () => new Array(size));
  const source = Array.from({ length: size }, () => new Array(size));
  const combined = Array.from({ length: size }, () => new Array(size));
  const angle = config.mass_angle * Math.PI / 180;
  const q = config.mass_model === "isothermal_sph" ? 1 : config.mass_axis_ratio;
  for (let row = 0; row < size; row += 1) {
    const y = half * (1 - 2 * row / (size - 1));
    for (let column = 0; column < size; column += 1) {
      const x = half * (2 * column / (size - 1) - 1);
      const dx = x - config.lens_x;
      const dy = y - config.lens_y;
      const xr = dx * Math.cos(angle) + dy * Math.sin(angle);
      const yr = -dx * Math.sin(angle) + dy * Math.cos(angle);
      const elliptical = Math.sqrt(q * xr * xr + yr * yr / q + 1e-6);
      const axr = config.einstein_radius * q * xr / elliptical;
      const ayr = config.einstein_radius * yr / q / elliptical;
      let alphaX = axr * Math.cos(angle) - ayr * Math.sin(angle);
      let alphaY = axr * Math.sin(angle) + ayr * Math.cos(angle);
      if (config.mass_model === "isothermal_shear") {
        alphaX += config.shear_gamma_1 * dx + config.shear_gamma_2 * dy;
        alphaY += config.shear_gamma_2 * dx - config.shear_gamma_1 * dy;
      }
      const betaX = x - alphaX;
      const betaY = y - alphaY;
      const sourceRadius = ellipticalRadius(betaX, betaY, config.source_x, config.source_y, config.source_axis_ratio, config.source_angle);
      const pointSigma = Math.max(config.psf_sigma, config.pixel_scale * 0.7, 0.015);
      const sourceLight = config.source_model === "point"
        ? config.source_intensity * Math.exp(-0.5 * (sourceRadius / pointSigma) ** 2)
        : sersic(sourceRadius, config.source_effective_radius, config.source_sersic_index, config.source_intensity);
      const lensRadius = ellipticalRadius(x, y, config.lens_x, config.lens_y, config.lens_axis_ratio, config.lens_angle);
      const lensLight = config.lens_light_enabled ? sersic(lensRadius, config.lens_effective_radius, config.lens_sersic_index, config.lens_intensity) : 0;
      lens[row][column] = lensLight;
      source[row][column] = sourceLight;
      combined[row][column] = lensLight + sourceLight;
    }
  }
  state.preview = { lens, source, combined, fov };
}

function percentile(values, fraction) {
  const finite = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!finite.length) return 0;
  return finite[Math.min(finite.length - 1, Math.max(0, Math.floor(fraction * (finite.length - 1))))];
}

function finiteValues(arrays) {
  const list = Array.isArray(arrays?.[0]?.[0]) ? arrays : [arrays];
  const values = [];
  for (const array of list) {
    for (const row of array || []) {
      for (const value of row || []) if (Number.isFinite(value)) values.push(value);
    }
  }
  return values;
}

function normalizer(arrays, options = {}) {
  const sourceValues = finiteValues(arrays);
  const positive = sourceValues.filter((value) => value > 0);
  const logFloor = options.logFloor ?? Math.max(positive.length ? Math.min(...positive) : 1e-8, 1e-8);
  const useLog = Boolean(options.useLog);
  const prepare = (value) => options.floorZero ? Math.max(0, value) : value;
  const transform = (value) => useLog ? Math.log10(Math.max(prepare(value), logFloor)) : prepare(value);
  const values = sourceValues.map(transform);
  let minimum;
  let maximum;
  if (Number.isFinite(options.minimum) && Number.isFinite(options.maximum)) {
    minimum = options.minimum;
    maximum = options.maximum;
  } else if (options.symmetric) {
    const absolute = values.map((value) => Math.abs(value));
    const scale = Math.max(options.robust ? percentile(absolute, 0.99) : Math.max(...absolute), 1e-8);
    minimum = -scale;
    maximum = scale;
  } else {
    minimum = values.length ? (options.robust ? percentile(values, 0.005) : Math.min(...values)) : 0;
    maximum = values.length ? (options.robust ? percentile(values, 0.995) : Math.max(...values)) : 1;
    if (options.floorZero) minimum = 0;
  }
  if (!(maximum > minimum)) {
    if (options.floorZero) {
      minimum = 0;
      maximum = Math.max(Math.abs(maximum) * 1.05, 1);
    } else {
      const padding = Math.max(Math.abs(minimum) * 0.05, 1e-8);
      minimum -= padding;
      maximum += padding;
    }
  }
  const inverse = (value) => useLog ? 10 ** value : value;
  return { minimum, maximum, transform, inverse, useLog, logFloor };
}

// PyAutoArray's current scientific colour sequence, sampled from its bundled
// ``autoarray`` LUT.  Low values are deep blue and high values are red; unlike
// the teaching palette every colour maps to one scalar intensity.
const PALETTES = {
  autoarray: [
    [4, 0, 108], [11, 24, 193], [29, 80, 235], [48, 155, 80], [138, 194, 4],
    [234, 223, 2], [252, 169, 20], [254, 88, 15], [215, 5, 13],
  ],
  paper: [[255, 255, 255], [244, 194, 214], [190, 35, 101]],
  gray: [[255, 255, 255], [145, 145, 145], [15, 18, 28]],
  mask: [[18, 21, 28], [252, 252, 252]],
  magma: [[8, 7, 24], [75, 16, 107], [181, 54, 122], [251, 136, 97], [252, 245, 170]],
  viridis: [[68, 1, 84], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]],
};

function paletteColour(value, paletteName) {
  const palette = PALETTES[paletteName] || PALETTES.autoarray;
  const t = Math.max(0, Math.min(1, value));
  const scaled = t * (palette.length - 1);
  const left = Math.floor(scaled);
  const right = Math.min(palette.length - 1, left + 1);
  const mix = scaled - left;
  return palette[left].map((channel, index) => Math.round(channel * (1 - mix) + palette[right][index] * mix));
}

function paletteGradient(paletteName, direction = "to top") {
  const palette = PALETTES[paletteName] || PALETTES.autoarray;
  const stops = palette.map((colour, index) => (
    `rgb(${colour.join(",")}) ${100 * index / (palette.length - 1)}%`
  ));
  return `linear-gradient(${direction}, ${stops.join(",")})`;
}

function paintArray(canvas, array, options = {}) {
  const rows = array.length;
  const columns = array[0].length;
  const offscreen = document.createElement("canvas");
  offscreen.width = columns;
  offscreen.height = rows;
  const offContext = offscreen.getContext("2d", { alpha: false });
  const image = offContext.createImageData(columns, rows);
  const normalization = options.normalization || normalizer(array, options);
  const paletteName = options.paletteName || "autoarray";
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const value = array[row][column];
      let colour = [226, 229, 235];
      if (Number.isFinite(value)) {
        const transformed = normalization.transform(value);
        const normalized = (transformed - normalization.minimum) / (normalization.maximum - normalization.minimum);
        colour = paletteColour(normalized, paletteName);
      }
      const offset = 4 * (row * columns + column);
      image.data[offset] = colour[0];
      image.data[offset + 1] = colour[1];
      image.data[offset + 2] = colour[2];
      image.data[offset + 3] = 255;
    }
  }
  offContext.putImageData(image, 0, 0);
  const context = canvas.getContext("2d", { alpha: false });
  context.imageSmoothingEnabled = options.smoothing ?? false;
  context.imageSmoothingQuality = "high";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
  return normalization;
}

function formatScaleValue(value) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) < 1e-12) return "0.00";
  const absolute = Math.abs(value);
  if (absolute >= 1000 || absolute < 0.01) return value.toExponential(2).replace("e+", "e");
  if (absolute >= 100) return value.toFixed(0);
  if (absolute >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

function formatAxisValue(value) {
  const clean = Math.abs(value) < 5e-4 ? 0 : value;
  return `${clean.toFixed(2)}″`;
}

function fullExtent() {
  const fieldOfView = state.result?.field_of_view || state.preview?.fov || 1;
  const half = fieldOfView / 2;
  return [-half, half, -half, half];
}

function productExtent(productId, array = null) {
  if (productId !== "psf" || !array?.length || !array[0]?.length) return fullExtent();
  const pixelScale = state.result?.pixel_scale || state.config?.pixel_scale || 1;
  const halfX = array[0].length * pixelScale / 2;
  const halfY = array.length * pixelScale / 2;
  return [-halfX, halfX, -halfY, halfY];
}

function setAxisTickElements(xElement, yElement, extent) {
  if (!xElement || !yElement) return;
  const [xMin, xMax, yMin, yMax] = extent;
  xElement.replaceChildren(...[xMin, (xMin + xMax) / 2, xMax].map((value) => {
    const span = document.createElement("span");
    span.textContent = formatAxisValue(value);
    return span;
  }));
  yElement.replaceChildren(...[yMax, (yMin + yMax) / 2, yMin].map((value) => {
    const span = document.createElement("span");
    span.textContent = formatAxisValue(value);
    return span;
  }));
}

function updateMainScale(normalization, unit, paletteName, extent = fullExtent()) {
  const inverse = normalization.inverse || ((value) => value);
  if (elements.rangeMin) elements.rangeMin.textContent = formatScaleValue(inverse(normalization.minimum));
  if (elements.rangeMax) elements.rangeMax.textContent = formatScaleValue(inverse(normalization.maximum));
  if (elements.colourbar) elements.colourbar.style.background = paletteGradient(paletteName);
  if (elements.colourbarLabels) {
    const step = (normalization.maximum - normalization.minimum) / 4;
    const values = Array.from({ length: 5 }, (_, index) => inverse(normalization.maximum - index * step));
    elements.colourbarLabels.replaceChildren(...values.map((value) => {
      const span = document.createElement("span");
      span.textContent = formatScaleValue(value);
      return span;
    }));
  }
  if (elements.colourbarUnit) elements.colourbarUnit.textContent = unit;
  setAxisTickElements(elements.xAxisTicks, elements.yAxisTicks, extent);
}

function drawArray(array, options = {}) {
  const metadata = productMetadata(state.activeProduct);
  const extent = productExtent(state.activeProduct, array);
  const signed = metadata.norm === "symmetric";
  const useLog = options.useLog ?? (elements.displayLog.checked && !signed && !metadata.preTransformed && metadata.norm !== "categorical");
  const paletteName = metadata.norm === "categorical" ? "mask" : elements.colourMap.value;
  const normalization = paintArray(elements.canvas, array, {
    useLog,
    symmetric: signed,
    floorZero: metadata.floorZero,
    minimum: metadata.norm === "categorical" ? 0 : undefined,
    maximum: metadata.norm === "categorical" ? 1 : undefined,
    robust: metadata.category === "lens_physics",
    paletteName,
    smoothing: false,
  });
  updateMainScale(normalization, metadata.unit, paletteName, extent);
  if (elements.showMask.checked && state.result?.products?.mask && metadata.allowMaskOverlay !== false) drawMaskOverlay();
  drawPhysicalOverlays(elements.canvas, state.activeProduct, extent);
}

function drawComposite(lens, source, displayed = null) {
  const canvas = elements.canvas;
  const context = canvas.getContext("2d", { alpha: false });
  const rows = lens.length;
  const columns = lens[0].length;
  const offscreen = document.createElement("canvas");
  offscreen.width = columns;
  offscreen.height = rows;
  const offContext = offscreen.getContext("2d", { alpha: false });
  const image = offContext.createImageData(columns, rows);
  const intensity = displayed || lens.map((row, rowIndex) => row.map((value, columnIndex) => value + source[rowIndex][columnIndex]));
  const normalization = normalizer(intensity, { useLog: elements.displayLog.checked });
  const componentFloor = Math.max(
    percentile(lens.flat().concat(source.flat()).filter(Number.isFinite).map(Math.abs), 0.35),
    1e-10,
  );
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const raw = intensity[row][column];
      const transformed = Number.isFinite(raw) ? normalization.transform(raw) : normalization.minimum;
      const normalized = Math.max(0, Math.min(1, (transformed - normalization.minimum) / (normalization.maximum - normalization.minimum)));
      const alpha = normalized ** 0.62;
      const lensValue = Math.max(0, lens[row][column]);
      const sourceValue = Math.max(0, source[row][column]);
      const componentTotal = lensValue + sourceValue;
      const sourceFraction = componentTotal > componentFloor ? sourceValue / componentTotal : 0.5;
      const signalColour = [224, 142, 52].map((channel, index) => (
        channel * (1 - sourceFraction) + [188, 35, 101][index] * sourceFraction
      ));
      const colour = [252, 252, 251].map((base, index) => base * (1 - alpha) + signalColour[index] * alpha);
      const offset = 4 * (row * columns + column);
      image.data[offset] = Math.round(colour[0]);
      image.data[offset + 1] = Math.round(colour[1]);
      image.data[offset + 2] = Math.round(colour[2]);
      image.data[offset + 3] = 255;
    }
  }
  offContext.putImageData(image, 0, 0);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
  updateMainScale(normalization, t("relative_intensity"), "paper");
  if (elements.showMask.checked && state.result?.products?.mask) drawMaskOverlay();
}

function drawMaskOverlay(canvas = elements.canvas) {
  if (!state.config || !canvas) return;
  const context = canvas.getContext("2d");
  const fieldOfView = state.result?.field_of_view || state.preview?.fov || 1;
  const radius = state.config.mask_radius / fieldOfView * Math.min(canvas.width, canvas.height);
  if (!(radius > 0) || radius >= Math.hypot(canvas.width, canvas.height)) return;
  context.save();
  context.strokeStyle = "rgba(10, 15, 25, 0.9)";
  context.lineWidth = Math.max(1, canvas.width / 320);
  context.setLineDash([2.5 * context.lineWidth, 3 * context.lineWidth]);
  context.beginPath();
  context.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
  context.stroke();
  context.restore();
}

function drawPendingProduct() {
  const canvas = elements.canvas;
  const context = canvas.getContext("2d", { alpha: false });
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#667085";
  context.font = "500 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(state.locale === "en" ? "Waiting for PyAutoLens to regenerate this image…" : "等待 PyAutoLens 重新生成此科学图像…", canvas.width / 2, canvas.height / 2);
  if (elements.rangeMin) elements.rangeMin.textContent = "—";
  if (elements.rangeMax) elements.rangeMax.textContent = "—";
  if (elements.colourbarLabels) elements.colourbarLabels.replaceChildren();
  if (elements.colourbarUnit) elements.colourbarUnit.textContent = t("array_wait");
  setAxisTickElements(elements.xAxisTicks, elements.yAxisTicks, fullExtent());
}

function updateColourbar() {
  if (elements.colourbar) elements.colourbar.style.background = paletteGradient(elements.colourMap.value);
}

function cropArray(array, zoom, extent) {
  if (!zoom) return { array, extent };
  const rows = array.length;
  const columns = array[0].length;
  const values = finiteValues(array);
  const peak = values.length ? Math.max(...values) : 0;
  const threshold = peak * 0.01;
  let rowMin = rows - 1;
  let rowMax = 0;
  let columnMin = columns - 1;
  let columnMax = 0;
  let found = false;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (Number.isFinite(array[row][column]) && array[row][column] >= threshold) {
        found = true;
        rowMin = Math.min(rowMin, row);
        rowMax = Math.max(rowMax, row);
        columnMin = Math.min(columnMin, column);
        columnMax = Math.max(columnMax, column);
      }
    }
  }
  if (!found) return { array, extent };
  const centerRow = (rowMin + rowMax) / 2;
  const centerColumn = (columnMin + columnMax) / 2;
  const side = Math.max(7, Math.ceil(Math.max(rowMax - rowMin + 3, columnMax - columnMin + 3) * zoom));
  const boundedWindow = (center, length) => {
    let start = Math.max(0, Math.floor(center - side / 2));
    let end = Math.min(length, start + side);
    start = Math.max(0, end - side);
    return [start, end];
  };
  const [startRow, endRow] = boundedWindow(centerRow, rows);
  const [startColumn, endColumn] = boundedWindow(centerColumn, columns);
  const cropped = array.slice(startRow, endRow).map((row) => row.slice(startColumn, endColumn));
  const [xMin, xMax, yMin, yMax] = extent;
  const xWidth = xMax - xMin;
  const yHeight = yMax - yMin;
  return {
    array: cropped,
    extent: [
      xMin + xWidth * startColumn / columns,
      xMin + xWidth * endColumn / columns,
      yMax - yHeight * endRow / rows,
      yMax - yHeight * startRow / rows,
    ],
  };
}

function makeAxisTicks(className, values) {
  const container = document.createElement("div");
  container.className = className;
  for (const value of values) {
    const span = document.createElement("span");
    span.textContent = formatAxisValue(value);
    container.appendChild(span);
  }
  return container;
}

function makeScientificColourbar(normalization, unit) {
  const wrap = document.createElement("div");
  wrap.className = "scientific-colourbar-wrap";
  const bar = document.createElement("div");
  bar.className = "scientific-colourbar";
  bar.style.background = paletteGradient("autoarray");
  const labels = document.createElement("div");
  labels.className = "scientific-colourbar-labels";
  const inverse = normalization.inverse || ((value) => value);
  const midpoint = (normalization.minimum + normalization.maximum) / 2;
  for (const value of [normalization.maximum, midpoint, normalization.minimum].map(inverse)) {
    const span = document.createElement("span");
    span.textContent = formatScaleValue(value);
    labels.appendChild(span);
  }
  wrap.append(bar, labels);
  wrap.title = `${formatScaleValue(normalization.minimum)} … ${formatScaleValue(normalization.maximum)} ${unit}`;
  return wrap;
}

function triggerBlobDownload(blob, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
}

function downloadCanvas(canvas, productId, suffix = "") {
  const minimumExportDimension = 1200;
  const scale = Math.max(1, minimumExportDimension / Math.min(canvas.width, canvas.height));
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = Math.round(canvas.width * scale);
  exportCanvas.height = Math.round(canvas.height * scale);
  const exportContext = exportCanvas.getContext("2d");
  if (!exportContext) return;
  exportContext.imageSmoothingEnabled = true;
  exportContext.imageSmoothingQuality = "high";
  exportContext.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
  exportCanvas.toBlob((blob) => {
    if (blob) triggerBlobDownload(blob, `pyautolens-${productId}${suffix}.png`);
  }, "image/png");
}

function filenameFromResponse(response, fallback) {
  const match = response.headers.get("Content-Disposition")?.match(/filename="?([^";]+)"?/i);
  return match?.[1] || fallback;
}

async function requestArtifact(path, payload, fallbackFilename, button = null) {
  const originalText = button?.textContent;
  if (button) {
    button.disabled = true;
    button.textContent = "…";
  }
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const error = await response.json();
        message = error.detail || error.error || message;
      } catch (_error) {}
      throw new Error(message);
    }
    triggerBlobDownload(await response.blob(), filenameFromResponse(response, fallbackFilename));
  } catch (error) {
    elements.error.hidden = false;
    elements.error.textContent = state.locale === "en" ? `Download failed: ${error.message}` : `下载失败：${error.message}`;
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

function downloadProductArtifact(productId, format, button = null) {
  return requestArtifact(
    "/api/export/product",
    { config: state.config, product_id: productId, format },
    `pyautolens-${productId}.${format}`,
    button,
  );
}

function downloadProductBundle(productIds, button = null) {
  return requestArtifact(
    "/api/export/bundle",
    { config: state.config, product_ids: productIds },
    "pyautolens-research-products.zip",
    button,
  );
}

function drawPolylineSet(canvas, curves, extent, colour) {
  if (!curves?.length) return;
  const [xMin, xMax, yMin, yMax] = extent;
  const context = canvas.getContext("2d");
  context.save();
  context.lineJoin = "round";
  context.lineCap = "round";
  for (const curve of curves) {
    if (!curve?.length) continue;
    context.beginPath();
    curve.forEach(([y, x], index) => {
      const px = (x - xMin) / (xMax - xMin) * canvas.width;
      const py = (yMax - y) / (yMax - yMin) * canvas.height;
      if (index === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    });
    context.closePath();
    context.strokeStyle = "rgba(0,0,0,.72)";
    context.lineWidth = Math.max(2.4, canvas.width / 130);
    context.stroke();
    context.strokeStyle = colour;
    context.lineWidth = Math.max(1.1, canvas.width / 260);
    context.stroke();
  }
  context.restore();
}

function drawPhysicalOverlays(canvas, productId, extent) {
  const overlays = state.result?.overlays;
  if (!overlays) return;
  if (productId === "source_plane") {
    drawPolylineSet(canvas, overlays.tangential_caustics, extent, "#ffe43a");
    drawPolylineSet(canvas, overlays.radial_caustics, extent, "#ffffff");
    return;
  }
  if (productMetadata(productId).category === "lens_physics") {
    drawPolylineSet(canvas, overlays.tangential_critical_curves, extent, "#ffe43a");
    drawPolylineSet(canvas, overlays.radial_critical_curves, extent, "#ffffff");
  }
}

function renderScienceGrid() {
  if (!elements.scienceGrid) return;
  if (document.getElementById("mode-science")?.hidden) return;
  const products = state.result?.products;
  const panels = sciencePanelsForCurrentGroup();
  if (!products) {
    elements.scienceGrid.innerHTML = `<p class="science-pending">${t("science_wait")}</p>`;
    return;
  }
  const missing = [...new Set(panels.map((panel) => panel.key).filter((key) => !products[key]))];
  if (missing.length) {
    elements.scienceGrid.innerHTML = `<p class="science-pending">${t("science_wait")}</p>`;
    ensureProducts(missing);
    return;
  }
  const sourceNormalization = products.source_plane ? normalizer(products.source_plane, { floorZero: true }) : null;
  const sourceImages = [products.lensed_source, products.lens_light_subtracted].filter(Boolean);
  const sourceImageNormalization = sourceImages.length ? normalizer(sourceImages, { floorZero: true }) : null;
  elements.scienceGrid.replaceChildren();
  const noiseSensitiveProducts = new Set(["observed", "model", "residual", "normalized_residual", "chi_squared", "residual_flux_fraction"]);
  if (!state.result.config.add_poisson_noise && panels.some((panel) => noiseSensitiveProducts.has(panel.key))) {
    const note = document.createElement("p");
    note.className = "science-mode-note";
    note.textContent = t("no_noise_note");
    elements.scienceGrid.appendChild(note);
  }
  for (const panel of panels) {
    const panelTitle = state.locale === "en" ? panel.en : panel.zh;
    const metadata = productMetadata(panel.key);
    const panelExtent = productExtent(panel.key, products[panel.key]);
    const cropped = cropArray(products[panel.key], panel.zoom, panelExtent);
    let normalization;
    if (panel.key === "source_plane" && sourceNormalization) normalization = sourceNormalization;
    else if (["lensed_source", "lens_light_subtracted"].includes(panel.key) && sourceImageNormalization) normalization = sourceImageNormalization;
    else normalization = normalizer(cropped.array, {
      symmetric: panel.symmetric,
      floorZero: panel.floorZero || metadata.floorZero,
      minimum: panel.minimum,
      maximum: panel.maximum,
      robust: metadata.category === "lens_physics",
    });

    const figure = document.createElement("figure");
    figure.className = "scientific-panel";
    figure.dataset.product = panel.key;
    const figureHeader = document.createElement("div");
    figureHeader.className = "scientific-panel-header";
    const heading = document.createElement("h3");
    heading.textContent = panelTitle;
    const actions = document.createElement("div");
    actions.className = "plot-card-actions";
    for (const format of ["png", "fits", "csv"]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button compact plot-download-button";
      button.textContent = format.toUpperCase();
      if (format === "png") {
        button.addEventListener("click", () => downloadCanvas(canvas, panel.key, panel.zoom ? `-zoom-${panel.zoom}` : ""));
      } else {
        button.addEventListener("click", () => downloadProductArtifact(panel.key, format, button));
      }
      actions.appendChild(button);
    }
    figureHeader.append(heading, actions);
    const plot = document.createElement("div");
    plot.className = "scientific-plot";
    const [xMin, xMax, yMin, yMax] = cropped.extent;
    const yTicks = makeAxisTicks("scientific-axis-ticks scientific-y-ticks", [yMax, (yMin + yMax) / 2, yMin]);
    const canvasColumn = document.createElement("div");
    canvasColumn.className = "scientific-canvas-column";
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    canvas.setAttribute("aria-label", state.locale === "en" ? `${panelTitle}; both axes are in arcseconds` : `${panelTitle}，纵横坐标均为角秒`);
    const xTicks = makeAxisTicks("scientific-axis-ticks scientific-x-ticks", [xMin, (xMin + xMax) / 2, xMax]);
    canvasColumn.append(canvas, xTicks);
    const colourbar = makeScientificColourbar(normalization, metadata.unit);
    plot.append(yTicks, canvasColumn, colourbar);
    const caption = document.createElement("figcaption");
    const unit = document.createElement("span");
    unit.className = "scientific-unit";
    unit.textContent = metadata.unit;
    const origin = document.createElement("span");
    origin.textContent = t("same_simulation");
    caption.append(unit, origin);
    figure.append(figureHeader, plot, caption);
    elements.scienceGrid.appendChild(figure);
    paintArray(canvas, cropped.array, { normalization, paletteName: "autoarray", smoothing: false });
    if (metadata.allowMaskOverlay !== false) drawMaskOverlay(canvas);
    drawPhysicalOverlays(canvas, panel.key, cropped.extent);
  }
  renderWorkflowCatalog();
}

function renderCurrentProduct() {
  updateProductTabs();
  const exactProducts = state.result?.products;
  if (exactProducts?.[state.activeProduct]) {
    if (elements.colourMap.value === "paper" && ["observed", "model"].includes(state.activeProduct)) {
      drawComposite(exactProducts.lens_light, exactProducts.lensed_source, exactProducts[state.activeProduct]);
    } else {
      drawArray(exactProducts[state.activeProduct], { useLog: state.activeProduct === "log10_model" ? false : undefined });
    }
    return;
  }
  if (state.result && !exactProducts?.[state.activeProduct]) ensureProducts([state.activeProduct]);
  if (!state.preview) return;
  if (["observed", "model"].includes(state.activeProduct)) {
    if (elements.colourMap.value === "paper") drawComposite(state.preview.lens, state.preview.source, state.preview.combined);
    else drawArray(state.preview.combined);
  } else if (state.activeProduct === "lens_light") drawArray(state.preview.lens);
  else if (state.activeProduct === "lensed_source") drawArray(state.preview.source);
  else drawPendingProduct();
}

function showPreviewState() {
  state.runtimePhase = "preview";
  state.runtimeError = null;
  elements.status.className = "status-pill is-loading";
  elements.status.textContent = t("quick_wait");
  document.getElementById("metric-engine").textContent = t("browser_preview");
  document.getElementById("metric-time").textContent = t("instant");
  document.getElementById("metric-fov").textContent = `${state.preview.fov.toFixed(2)}″`;
  document.getElementById("metric-shape").textContent = "181 × 181";
  elements.footer.textContent = t("params_changed");
}

const CORE_PRODUCTS = ["observed", "model", "lens_light", "lensed_source", "noise", "mask"];

function activeMode() {
  return document.querySelector(".mode-tab.is-active")?.dataset.mode || "geometry";
}

function requestedProductsForCurrentView() {
  const requested = new Set(CORE_PRODUCTS);
  const mode = activeMode();
  if (mode === "images") requested.add(state.activeProduct);
  if (mode === "science") scienceProductIds().forEach((productId) => requested.add(productId));
  return [...requested];
}

function mergeSimulationPayload(current, incoming) {
  const overlays = { ...(current?.overlays || {}) };
  for (const [key, curves] of Object.entries(incoming.overlays || {})) {
    if (Array.isArray(curves) && curves.length) overlays[key] = curves;
    else if (!(key in overlays)) overlays[key] = curves;
  }
  return {
    ...current,
    ...incoming,
    products: { ...(current?.products || {}), ...(incoming.products || {}) },
    ranges: { ...(current?.ranges || {}), ...(incoming.ranges || {}) },
    overlays,
  };
}

async function ensureProducts(productIds) {
  if (!state.result || !state.config) return;
  const missing = [...new Set(productIds)].filter((productId) => !state.result.products?.[productId]).sort();
  if (!missing.length) return;
  const configSignature = JSON.stringify(state.config);
  const requestKey = `${configSignature}|${missing.join(",")}`;
  if (state.productRequestKey === requestKey) return;
  state.productController?.abort();
  const controller = new AbortController();
  state.productController = controller;
  state.productRequestKey = requestKey;
  try {
    let response;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: state.config, requested_products: missing }),
        signal: controller.signal,
      });
      if (response.status !== 429 || attempt === 5) break;
      await new Promise((resolve) => setTimeout(resolve, 180 + attempt * 140));
      if (controller.signal.aborted) throw new DOMException("Superseded", "AbortError");
    }
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.detail || payload.error || `HTTP ${response.status}`);
    if (controller.signal.aborted || JSON.stringify(state.config) !== configSignature || !state.result) return;
    state.result = mergeSimulationPayload(state.result, payload);
    state.productRequestKey = "";
    renderCurrentProduct();
    renderScienceGrid();
    syncGeometryFrame();
  } catch (error) {
    if (error.name === "AbortError") return;
    state.productRequestKey = "";
    elements.error.hidden = false;
    elements.error.textContent = state.locale === "en"
      ? `Could not compute the selected research product: ${error.message}`
      : `所选科研产品计算失败：${error.message}`;
  }
}

function onConfigChanged() {
  if (state.config.source_redshift <= state.config.lens_redshift) {
    state.config.source_redshift = Math.min(5, state.config.lens_redshift + 0.05);
    updateAllControls();
  }
  localStorage.setItem("pyautolens-workbench-config", JSON.stringify(state.config));
  state.requestSequence += 1;
  state.controller?.abort();
  state.productController?.abort();
  state.productRequestKey = "";
  state.result = null;
  makePreview();
  showPreviewState();
  renderCurrentProduct();
  renderScienceGrid();
  syncGeometryFrame();
  clearTimeout(state.timer);
  state.timer = setTimeout(requestSimulation, 350);
}

async function requestSimulation() {
  const sequence = ++state.requestSequence;
  const simulationConfig = { ...state.config };
  state.controller?.abort();
  const controller = new AbortController();
  state.controller = controller;
  elements.error.hidden = true;
  try {
    let response;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: simulationConfig,
          requested_products: requestedProductsForCurrentView(),
        }),
        signal: controller.signal,
      });
      if (response.status !== 429 || attempt === 5) break;
      await new Promise((resolve) => setTimeout(resolve, 180 + attempt * 140));
      if (sequence !== state.requestSequence || controller.signal.aborted) throw new DOMException("Superseded", "AbortError");
    }
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.detail || payload.error || `HTTP ${response.status}`);
    if (sequence !== state.requestSequence) return;
    state.result = payload;
    state.runtimePhase = "exact";
    state.runtimeError = null;
    elements.status.className = "status-pill";
    elements.status.textContent = t("live_raytrace");
    document.getElementById("metric-engine").textContent = payload.engine;
    document.getElementById("metric-time").textContent = `${payload.elapsed_ms.toFixed(0)} ms`;
    document.getElementById("metric-fov").textContent = `${payload.field_of_view.toFixed(2)}″`;
    document.getElementById("metric-shape").textContent = payload.shape.join(" × ");
    elements.footer.textContent = state.locale === "en"
      ? `Current image generated live by PyAutoLens · ${payload.elapsed_ms.toFixed(0)} ms`
      : `当前图像由 PyAutoLens 按参数实时生成 · ${payload.elapsed_ms.toFixed(0)} ms`;
    renderCurrentProduct();
    renderScienceGrid();
    syncGeometryFrame();
  } catch (error) {
    if (error.name === "AbortError") return;
    state.runtimePhase = "simulation-error";
    state.runtimeError = error.message;
    elements.status.className = "status-pill is-error";
    elements.status.textContent = t("compute_failed");
    elements.error.hidden = false;
    elements.error.textContent = state.locale === "en" ? `PyAutoLens calculation failed: ${error.message}` : `PyAutoLens 计算没有完成：${error.message}`;
    elements.footer.textContent = t("preview_after_fail");
    syncGeometryFrame();
  }
}

function applyPreset(name) {
  Object.assign(state.config, PRESETS[name]);
  document.querySelectorAll(".preset-button").forEach((button) => button.classList.toggle("is-active", button.dataset.preset === name));
  updateAllControls();
  onConfigChanged();
}

function geometryModelFromConfig() {
  const gamma1 = Number(state.config?.shear_gamma_1) || 0;
  const gamma2 = Number(state.config?.shear_gamma_2) || 0;
  return {
    sourceX: Number(state.config.source_x) - Number(state.config.lens_x),
    sourceY: Number(state.config.source_y) - Number(state.config.lens_y),
    rayDensity: state.geometryRayDensity,
    lensModel: state.config.mass_model === "isothermal_shear" ? "cross" : "point",
    massModel: state.config.mass_model,
    einsteinRadius: state.config.einstein_radius,
    lensX: state.config.lens_x,
    lensY: state.config.lens_y,
    lensRedshift: state.config.lens_redshift,
    sourceRedshift: state.config.source_redshift,
    massAxisRatio: state.config.mass_axis_ratio,
    massAngle: state.config.mass_angle,
    shearGamma1: gamma1,
    shearGamma2: gamma2,
    externalShear: Math.min(0.3, Math.hypot(gamma1, gamma2)),
    sourceModel: state.config.source_model,
    sourceIntensity: state.config.source_intensity,
    sourceEffectiveRadius: state.config.source_effective_radius,
    sourceSersicIndex: state.config.source_sersic_index,
    sourceAxisRatio: state.config.source_axis_ratio,
    sourceAngle: state.config.source_angle,
    lensLightEnabled: state.config.lens_light_enabled,
    lensLightIntensity: state.config.lens_intensity,
    lensLightEffectiveRadius: state.config.lens_effective_radius,
    lensLightSersicIndex: state.config.lens_sersic_index,
    lensLightAxisRatio: state.config.lens_axis_ratio,
    lensLightAngle: state.config.lens_angle,
    language: state.locale,
  };
}

function syncGeometryFrame() {
  const frame = document.getElementById("geometry-frame");
  if (!frame?.contentWindow || !frame.getAttribute("src")) return;
  frame.contentWindow.postMessage({
    type: "pyautolens-workbench-sync",
    model: state.config ? geometryModelFromConfig() : { language: state.locale },
    products: state.result?.products || null,
    palette: PALETTES.autoarray,
    exactScale: {
      range: state.result?.ranges?.observed || null,
      unit: productMetadata("observed").unit,
      norm: productMetadata("observed").norm,
    },
    exactStatus: state.runtimePhase,
    exactError: state.runtimeError,
    locale: state.locale,
  }, "*");
}

function applyGeometryChange(model, changed) {
  if (!state.config || !model) return;
  if (changed === "density") {
    const density = Math.max(20, Math.min(80, Math.round((Number(model.rayDensity) || 48) / 4) * 4));
    if (density !== state.geometryRayDensity) {
      state.geometryRayDensity = density;
      localStorage.setItem("pyautolens-workbench-ray-density", String(density));
    }
    return;
  }
  const next = {};
  if (changed === "source") {
    next.source_x = Math.max(-1.5, Math.min(1.5, state.config.lens_x + Number(model.sourceX)));
    next.source_y = Math.max(-1.5, Math.min(1.5, state.config.lens_y + Number(model.sourceY)));
  } else if (changed === "lens-model" && model.lensModel === "point") {
    Object.assign(next, { mass_model: "isothermal_sph", mass_axis_ratio: 1, shear_gamma_1: 0, shear_gamma_2: 0 });
  } else if (changed === "lens-model" && model.lensModel === "cross") {
    Object.assign(next, {
      mass_model: "isothermal_shear",
      mass_axis_ratio: 1,
      mass_angle: 0,
      shear_gamma_1: Number(model.externalShear) || 0,
      shear_gamma_2: 0,
    });
  } else if (changed === "shear") {
    const nextMagnitude = Math.max(0, Math.min(0.3, Number(model.externalShear) || 0));
    const currentGamma1 = Number(state.config.shear_gamma_1) || 0;
    const currentGamma2 = Number(state.config.shear_gamma_2) || 0;
    const currentMagnitude = Math.hypot(currentGamma1, currentGamma2);
    Object.assign(next, {
      mass_model: "isothermal_shear",
      shear_gamma_1: currentMagnitude > 1e-9 ? currentGamma1 * nextMagnitude / currentMagnitude : nextMagnitude,
      shear_gamma_2: currentMagnitude > 1e-9 ? currentGamma2 * nextMagnitude / currentMagnitude : 0,
    });
  }
  const hasChanges = Object.entries(next).some(([key, value]) => (
    typeof value === "number"
      ? Math.abs(Number(state.config[key]) - value) > 1e-6
      : state.config[key] !== value
  ));
  if (!hasChanges) return;
  Object.assign(state.config, next);
  updateAllControls();
  onConfigChanged();
}

function setupGeometryBridge() {
  const frame = document.getElementById("geometry-frame");
  frame.addEventListener("load", () => setTimeout(syncGeometryFrame, 80));
  window.addEventListener("message", (event) => {
    if (event.source !== frame.contentWindow || typeof event.data !== "object") return;
    if (event.data?.type === "pyautolens-3d-ready") syncGeometryFrame();
    if (event.data?.type === "pyautolens-3d-change") applyGeometryChange(event.data.model, event.data.changed);
  });
}

function geometryCanvasContext() {
  const frame = document.getElementById("geometry-frame");
  const outerDocument = frame?.contentDocument;
  const innerFrame = outerDocument?.getElementById("codex-visualization");
  const innerDocument = innerFrame?.contentDocument;
  const stage = innerDocument?.getElementById("lp3d-stage");
  const canvas = stage?.querySelector(":scope > canvas");
  return { innerDocument, stage, canvas };
}

function freezeGeometryFrame() {
  const { innerDocument, stage, canvas } = geometryCanvasContext();
  if (!innerDocument || !stage || !canvas || canvas.width < 2 || canvas.height < 2) return;
  let snapshot = innerDocument.getElementById("workbench-geometry-snapshot");
  if (!snapshot) {
    snapshot = innerDocument.createElement("canvas");
    snapshot.id = "workbench-geometry-snapshot";
    snapshot.setAttribute("aria-hidden", "true");
    stage.appendChild(snapshot);
  }
  const stageBounds = stage.getBoundingClientRect();
  const canvasBounds = canvas.getBoundingClientRect();
  snapshot.width = canvas.width;
  snapshot.height = canvas.height;
  const snapshotContext = snapshot.getContext("2d");
  snapshotContext.clearRect(0, 0, snapshot.width, snapshot.height);
  snapshotContext.drawImage(canvas, 0, 0);
  Object.assign(snapshot.style, {
    position: "absolute",
    left: `${canvasBounds.left - stageBounds.left}px`,
    top: `${canvasBounds.top - stageBounds.top}px`,
    width: `${canvasBounds.width}px`,
    height: `${canvasBounds.height}px`,
    zIndex: "1",
    pointerEvents: "none",
    display: "block",
  });
  snapshot.dataset.canvasVisibility = canvas.style.visibility || "";
  canvas.style.visibility = "hidden";
}

function revealLiveGeometryWhenStable() {
  let stableFrames = 0;
  let attempts = 0;
  const inspect = () => {
    const { innerDocument, canvas } = geometryCanvasContext();
    const snapshot = innerDocument?.getElementById("workbench-geometry-snapshot");
    if (!snapshot || !canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const bufferReady = canvas.width >= bounds.width * 0.95 && canvas.height >= bounds.height * 0.95;
    stableFrames = bufferReady ? stableFrames + 1 : 0;
    attempts += 1;
    if (stableFrames >= 2 || attempts >= 30) {
      snapshot.style.display = "none";
      canvas.style.visibility = snapshot.dataset.canvasVisibility || "";
      return;
    }
    requestAnimationFrame(inspect);
  };
  requestAnimationFrame(inspect);
}

function restoreGeometryFrameLayout() {
  const frame = document.getElementById("geometry-frame");
  requestAnimationFrame(() => {
    frame?.contentWindow?.dispatchEvent(new Event("resize"));
    syncGeometryFrame();
    revealLiveGeometryWhenStable();
  });
}

function activateMode(mode) {
  const previousMode = document.querySelector(".mode-tab.is-active")?.dataset.mode;
  if (previousMode === "geometry" && mode !== "geometry") freezeGeometryFrame();
  document.querySelectorAll(".mode-tab").forEach((tab) => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.querySelectorAll(".mode-view").forEach((view) => {
    const active = view.id === `mode-${mode}`;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
    view.toggleAttribute("inert", !active);
    view.setAttribute("aria-hidden", String(!active));
  });
  if (mode === "geometry") {
    const frame = document.getElementById("geometry-frame");
    if (!frame.getAttribute("src")) frame.src = "/lesson/3d";
    else restoreGeometryFrameLayout();
  }
  if (mode === "images") renderCurrentProduct();
  if (mode === "science") renderScienceGrid();
}

function setupModeTabs() {
  const tabs = Array.from(document.querySelectorAll(".mode-tab"));
  document.querySelector(".mode-tabs")?.setAttribute("role", "tablist");
  tabs.forEach((button, index) => {
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", `mode-${button.dataset.mode}`);
    button.addEventListener("click", () => activateMode(button.dataset.mode));
    button.addEventListener("keydown", (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      next.focus();
      activateMode(next.dataset.mode);
    });
  });
}

function exportConfig() {
  const blob = new Blob([JSON.stringify(state.config, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "pyautolens-workbench-config.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function fitParameterLabel(key) {
  for (const group of PARAMETER_GROUPS) {
    const control = group.controls.find((candidate) => candidate.key === key);
    if (control) return controlLabel(control);
  }
  return key;
}

function drawFitDiagnostic(canvas, array, diverging = false) {
  const rows = array.length;
  const columns = array[0].length;
  const offscreen = document.createElement("canvas");
  offscreen.width = columns;
  offscreen.height = rows;
  const context = offscreen.getContext("2d", { alpha: false });
  const pixels = context.createImageData(columns, rows);
  const finite = array.flat().filter(Number.isFinite);
  const scale = diverging ? Math.max(percentile(finite.map((value) => Math.abs(value)), 0.99), 1e-8) : null;
  const minimum = diverging ? -scale : percentile(finite, 0.01);
  const maximum = diverging ? scale : Math.max(percentile(finite, 0.995), minimum + 1e-8);
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const value = array[row][column];
      let colour = [238, 241, 247];
      if (Number.isFinite(value)) {
        const normalized = Math.max(0, Math.min(1, (value - minimum) / (maximum - minimum)));
        if (diverging) {
          const left = [43, 94, 168];
          const middle = [249, 249, 247];
          const right = [190, 45, 76];
          const t = normalized < 0.5 ? normalized * 2 : (normalized - 0.5) * 2;
          const start = normalized < 0.5 ? left : middle;
          const end = normalized < 0.5 ? middle : right;
          colour = start.map((channel, index) => Math.round(channel * (1 - t) + end[index] * t));
        } else {
          colour = paletteColour(normalized, "autoarray");
        }
      }
      const offset = 4 * (row * columns + column);
      pixels.data[offset] = colour[0];
      pixels.data[offset + 1] = colour[1];
      pixels.data[offset + 2] = colour[2];
      pixels.data[offset + 3] = 255;
    }
  }
  context.putImageData(pixels, 0, 0);
  const output = canvas.getContext("2d", { alpha: false });
  output.imageSmoothingEnabled = true;
  output.imageSmoothingQuality = "high";
  output.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
}

function freezeFitData() {
  if (!state.result?.products?.observed || !state.result?.products?.noise) {
    state.fitPhase = "waiting-error";
    const status = document.getElementById("fit-snapshot-status");
    status.className = "fit-status is-error";
    status.textContent = t("fit_wait_exact");
    return;
  }
  state.fitSnapshot = {
    data: state.result.products.observed,
    noise: state.result.products.noise,
    config: { ...state.result.config },
  };
  state.fitResult = null;
  state.fitPhase = "frozen";
  state.fitError = null;
  const status = document.getElementById("fit-snapshot-status");
  status.className = "fit-status is-success";
  status.textContent = state.locale === "en"
    ? `Frozen ${state.result.shape.join(" × ")} observation. Change sidebar values to define the initial guess.`
    : `已锁定 ${state.result.shape.join(" × ")} 观测。现在可在左侧改变参数，作为拟合初值。`;
  document.getElementById("fit-run").disabled = false;
  document.getElementById("fit-apply").disabled = true;
  document.getElementById("fit-results-body").innerHTML = state.locale === "en"
    ? "<p>Data frozen. Change sidebar parameters, then run the fit.</p>"
    : "<p>数据已锁定；改变左侧参数后运行拟合。</p>";
}

function renderFitResult(payload) {
  const rows = payload.free_parameters.map((key) => {
    const initial = payload.initial[key];
    const fitted = payload.fitted[key];
    return `<tr><td>${fitParameterLabel(key)}</td><td>${initial.toFixed(5)}</td><td>${fitted.toFixed(5)}</td><td>${(fitted - initial).toFixed(5)}</td></tr>`;
  }).join("");
  const headers = state.locale === "en" ? ["Parameter", "Initial", "Recovered", "Change"] : ["参数", "初值", "恢复值", "变化"];
  const fitState = payload.success
    ? (state.locale === "en" ? "Converged" : "已收敛")
    : payload.improved
      ? (state.locale === "en" ? "Improved" : "显著改善")
      : (state.locale === "en" ? "Not converged" : "未收敛");
  const captions = state.locale === "en"
    ? ["Frozen data", "Fitted model", "Residual data − model", "Normalized residual", "Per-pixel χ²"]
    : ["锁定数据", "拟合模型", "残差 data − model", "归一化残差", "逐像素 χ²"];
  document.getElementById("fit-results-body").innerHTML = `
    <table class="fit-result-table">
      <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="fit-summary-line">
      <span>${state.locale === "en" ? "Initial" : "初始"} χ² <strong>${payload.initial_chi_squared.toFixed(2)}</strong></span>
      <span>${state.locale === "en" ? "Final" : "最终"} χ² <strong>${payload.final_chi_squared.toFixed(2)}</strong></span>
      <span>${state.locale === "en" ? "Evaluations" : "模型评估"} <strong>${payload.evaluations}</strong></span>
      <span>${state.locale === "en" ? "Status" : "状态"} <strong>${fitState}</strong></span>
    </div>
    <div class="fit-diagnostic-grid">
      <figure><canvas data-fit-view="data" width="280" height="280"></canvas><figcaption>${captions[0]}</figcaption></figure>
      <figure><canvas data-fit-view="model" width="280" height="280"></canvas><figcaption>${captions[1]}</figcaption></figure>
      <figure><canvas data-fit-view="residual" width="280" height="280"></canvas><figcaption>${captions[2]}</figcaption></figure>
      <figure><canvas data-fit-view="normalized" width="280" height="280"></canvas><figcaption>${captions[3]}</figcaption></figure>
      <figure><canvas data-fit-view="chi2" width="280" height="280"></canvas><figcaption>${captions[4]}</figcaption></figure>
    </div>`;
  const data = state.fitSnapshot.data;
  const noise = state.fitSnapshot.noise;
  const model = payload.simulation.products.model;
  const mask = payload.simulation.products.mask;
  const residual = data.map((row, rowIndex) => row.map((value, columnIndex) => (
    mask[rowIndex][columnIndex] > 0 ? value - model[rowIndex][columnIndex] : NaN
  )));
  const normalized = residual.map((row, rowIndex) => row.map((value, columnIndex) => (
    Number.isFinite(value) ? value / Math.max(noise[rowIndex][columnIndex], 1e-8) : NaN
  )));
  const chi2 = normalized.map((row) => row.map((value) => (Number.isFinite(value) ? value * value : NaN)));
  drawFitDiagnostic(document.querySelector('[data-fit-view="data"]'), data);
  drawFitDiagnostic(document.querySelector('[data-fit-view="model"]'), model);
  drawFitDiagnostic(document.querySelector('[data-fit-view="residual"]'), residual, true);
  drawFitDiagnostic(document.querySelector('[data-fit-view="normalized"]'), normalized, true);
  drawFitDiagnostic(document.querySelector('[data-fit-view="chi2"]'), chi2);
  document.getElementById("fit-runtime").textContent = `${(payload.elapsed_ms / 1000).toFixed(1)} s`;
}

async function runQuickFit() {
  if (!state.fitSnapshot) return;
  const selected = [...document.querySelectorAll("#fit-parameter-list input:checked")].map((input) => input.value);
  const status = document.getElementById("fit-snapshot-status");
  if (!selected.length || selected.length > 5) {
    state.fitPhase = "selection-error";
    status.className = "fit-status is-error";
    status.textContent = t("fit_choose");
    return;
  }
  const runButton = document.getElementById("fit-run");
  runButton.disabled = true;
  document.getElementById("fit-apply").disabled = true;
  status.className = "fit-status is-running";
  status.textContent = t("fit_running");
  state.fitPhase = "running";
  state.fitError = null;
  const frozen = state.fitSnapshot.config;
  const fitConfig = {
    ...state.config,
    image_pixels: frozen.image_pixels,
    pixel_scale: frozen.pixel_scale,
    psf_sigma: frozen.psf_sigma,
    exposure_time: frozen.exposure_time,
    background_sky: frozen.background_sky,
    noise_seed: frozen.noise_seed,
  };
  try {
    const response = await fetch("/api/fit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: state.fitSnapshot.data,
        noise: state.fitSnapshot.noise,
        config: fitConfig,
        free_parameters: selected,
        max_nfev: Number(document.getElementById("fit-max-evaluations").value),
      }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.detail || payload.error || `HTTP ${response.status}`);
    state.fitResult = payload;
    state.fitPhase = "result";
    renderFitResult(payload);
    status.className = payload.success || payload.improved ? "fit-status is-success" : "fit-status";
    const outcome = state.locale === "en"
      ? (payload.success ? "Fit converged" : payload.improved ? "Fit completed at the evaluation limit" : "Fit did not converge")
      : (payload.success ? "拟合已收敛" : payload.improved ? "拟合完成（达到评估上限）" : "拟合未收敛");
    status.textContent = state.locale === "en"
      ? `${outcome}: χ² decreased from ${payload.initial_chi_squared.toFixed(1)} to ${payload.final_chi_squared.toFixed(1)}.`
      : `${outcome}：χ² 从 ${payload.initial_chi_squared.toFixed(1)} 降至 ${payload.final_chi_squared.toFixed(1)}。`;
    document.getElementById("fit-apply").disabled = false;
  } catch (error) {
    state.fitPhase = "error";
    state.fitError = error.message;
    status.className = "fit-status is-error";
    status.textContent = state.locale === "en" ? `Fit failed: ${error.message}` : `拟合未完成：${error.message}`;
  } finally {
    runButton.disabled = false;
  }
}

function applyFitResult() {
  if (!state.fitResult) return;
  Object.assign(state.config, state.fitResult.fitted);
  updateAllControls();
  onConfigChanged();
  document.querySelector('[data-mode="images"]').click();
}

async function importConfig(file) {
  try {
    const imported = JSON.parse(await file.text());
    state.config = normalizeConfig(imported);
    updateAllControls();
    onConfigChanged();
  } catch (error) {
    elements.error.hidden = false;
    elements.error.textContent = state.locale === "en" ? `Could not import the parameter file: ${error.message}` : `无法导入参数文件：${error.message}`;
  }
}

async function initialize() {
  setupModeTabs();
  setupGeometryBridge();
  applyLocale(state.locale, { persist: false });
  activateMode("geometry");
  updateColourbar();
  document.querySelectorAll(".preset-button").forEach((button) => button.addEventListener("click", () => applyPreset(button.dataset.preset)));
  document.getElementById("language-toggle").addEventListener("click", () => applyLocale(state.locale === "en" ? "zh-CN" : "en"));
  document.getElementById("reset-all").addEventListener("click", () => {
    state.config = { ...state.defaults };
    updateAllControls();
    onConfigChanged();
  });
  document.getElementById("export-config").addEventListener("click", exportConfig);
  document.getElementById("import-config").addEventListener("change", (event) => {
    if (event.target.files[0]) importConfig(event.target.files[0]);
  });
  elements.colourMap.addEventListener("change", () => { updateColourbar(); renderCurrentProduct(); });
  elements.displayLog.addEventListener("change", renderCurrentProduct);
  elements.showMask.addEventListener("change", renderCurrentProduct);
  elements.scienceGroupSelect.addEventListener("change", () => {
    state.scienceGroup = elements.scienceGroupSelect.value;
    renderScienceGrid();
    ensureProducts(scienceProductIds());
  });
  document.getElementById("download-current-png").addEventListener("click", (event) => downloadProductArtifact(state.activeProduct, "png", event.currentTarget));
  document.getElementById("download-current-fits").addEventListener("click", (event) => downloadProductArtifact(state.activeProduct, "fits", event.currentTarget));
  document.getElementById("download-current-csv").addEventListener("click", (event) => downloadProductArtifact(state.activeProduct, "csv", event.currentTarget));
  document.getElementById("download-science-group").addEventListener("click", (event) => downloadProductBundle(scienceProductIds(), event.currentTarget));
  document.getElementById("download-science-all").addEventListener("click", (event) => downloadProductBundle(state.productCatalog.map((product) => product.id), event.currentTarget));
  document.getElementById("fit-freeze").addEventListener("click", freezeFitData);
  document.getElementById("fit-run").addEventListener("click", runQuickFit);
  document.getElementById("fit-apply").addEventListener("click", applyFitResult);

  try {
    const [response, colourResponse, catalogResponse] = await Promise.all([
      fetch("/api/defaults"),
      fetch("/api/colormap"),
      fetch("/api/catalog"),
    ]);
    if (!response.ok || !colourResponse.ok || !catalogResponse.ok) {
      throw new Error(`HTTP ${response.status}/${colourResponse.status}/${catalogResponse.status}`);
    }
    const colourPayload = await colourResponse.json();
    if (colourPayload.name === "autoarray" && Array.isArray(colourPayload.colours) && colourPayload.colours.length === 256) {
      PALETTES.autoarray = colourPayload.colours;
      updateColourbar();
    }
    const catalogPayload = await catalogResponse.json();
    state.productCatalog = catalogPayload.products || [];
    state.productCategories = catalogPayload.categories || [];
    state.workflowModules = catalogPayload.workflow_modules || [];
    state.defaults = await response.json();
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem("pyautolens-workbench-config") || "null");
    } catch (_error) {
      localStorage.removeItem("pyautolens-workbench-config");
    }
    state.config = normalizeConfig(saved);
    buildControls();
    buildProductTabs();
    buildScienceLibraryControls();
    renderWorkflowCatalog();
    makePreview();
    showPreviewState();
    syncGeometryFrame();
    renderCurrentProduct();
    renderScienceGrid();
    requestSimulation();
  } catch (error) {
    state.runtimePhase = "offline";
    state.runtimeError = error.message;
    elements.status.className = "status-pill is-error";
    elements.status.textContent = t("service_offline");
    elements.error.hidden = false;
    elements.error.textContent = t("launch_hint");
  }
}

initialize();
