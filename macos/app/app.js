const STORAGE_KEY = "local.chenjin.focus.sessions.v1";
const PREFERENCES_KEY = "local.chenjin.focus.preferences.v1";
const TRANSLATIONS = {
  "zh-CN": {
    appName: "观时 · Timegaze", language: "语言", heroTitle: "把注意力，留给此刻重要的事。", focusMode: "专注模式",
    focusPrompt: "这次要专注什么？", focusPlaceholder: "例如：完成报告的结论部分", category: "分类",
    custom: "自定义", minutesUnit: "分钟", autoBreak: "自动休息", breakDuration: "休息时长",
    alwaysOnTop: "紧凑窗口置顶", timerDisplay: "计时显示", timerDisplayMode: "计时显示方式",
    floatingWindow: "悬浮窗口", menuBar: "菜单栏", todayFocus: "今日投入",
    todayCaption: "每一小段投入，都在累积。", todayCount: "今日次数", totalFocus: "累计专注",
    goalProgress: "目标进度", editable: "可直接修改", dailyGoal: "每日目标", weeklyGoal: "每周目标",
    lastSevenDays: "近 7 天", focusHistory: "专注记录", focusCalendar: "专注日历",
    lastTwelveWeeks: "近 12 周", less: "少", more: "多", weeklyReview: "本周回顾",
    completedCount: "完成次数", bestDay: "最高效日期", topCategory: "主要投入",
    idleStatus: "准备好后，开始一段不被打扰的时间。", runningStatus: "正在专注 · 已投入 {duration}",
    pausedStatus: "计时已暂停，可以继续或结束并保存。", restingStatus: "休息中 · 剩余 {duration}",
    resting: "休息中", restPrefix: "休 ", startFocus: "开始专注", pause: "暂停", finishAndSave: "结束并保存",
    discard: "放弃", resumeFocus: "继续专注", endBreak: "结束休息", minimizeToMenuBar: "收至菜单栏",
    customDurationError: "自定义时长应为 1 至 240 分钟", contentRequired: "请先写下这次要专注的内容",
    minutes: "{count} 分钟", hours: "{count} 小时", hoursMinutes: "{hours} 小时 {minutes} 分",
    goalValue: "{current} / {goal} 分钟", recordCount: "共 {count} 次记录", chartMinutes: "{count} 分钟",
    emptyHistory: "还没有记录。完成第一次专注后，它会出现在这里。", startTime: "开始 {time}",
    endTime: "结束 {time}", notRecorded: "未记录", times: "{count} 次", none: "暂无",
    unchanged: "与上周持平", comparedLastWeek: "{change}% 较上周", startedThisWeek: "本周开始记录",
    statusTooltip: "观时 · Timegaze · 点击展开", showContentHistory: "查看历史内容", recentContent: "最近使用", noContentHistory: "还没有历史内容",
    category_work: "工作", category_study: "学习", category_reading: "阅读", category_creative: "创作", category_other: "其他",
  },
  en: {
    appName: "观时 · Timegaze", language: "Language", heroTitle: "Give your attention to what matters now.", focusMode: "Focus mode",
    focusPrompt: "What will you focus on?", focusPlaceholder: "e.g. Finish the report conclusion", category: "Category",
    custom: "Custom", minutesUnit: "min", autoBreak: "Auto break", breakDuration: "Break duration",
    alwaysOnTop: "Keep compact window on top", timerDisplay: "Timer", timerDisplayMode: "Timer display mode",
    floatingWindow: "Floating", menuBar: "Menu bar", todayFocus: "Today",
    todayCaption: "Every focused moment adds up.", todayCount: "Sessions today", totalFocus: "Total focus",
    goalProgress: "Goal progress", editable: "Editable", dailyGoal: "Daily goal", weeklyGoal: "Weekly goal",
    lastSevenDays: "Last 7 days", focusHistory: "Focus history", focusCalendar: "Focus calendar",
    lastTwelveWeeks: "Last 12 weeks", less: "Less", more: "More", weeklyReview: "Weekly review",
    completedCount: "Sessions", bestDay: "Best day", topCategory: "Top category",
    idleStatus: "When you're ready, begin an uninterrupted focus session.", runningStatus: "Focusing · {duration} invested",
    pausedStatus: "Timer paused. Resume or finish and save.", restingStatus: "On break · {duration} remaining",
    resting: "BREAK", restPrefix: "Break ", startFocus: "Start focus", pause: "Pause", finishAndSave: "Finish & save",
    discard: "Discard", resumeFocus: "Resume", endBreak: "End break", minimizeToMenuBar: "Minimize to menu bar",
    customDurationError: "Custom duration must be between 1 and 240 minutes", contentRequired: "Describe what you want to focus on first",
    minutes: "{count} min", hours: "{count} hr", hoursMinutes: "{hours} hr {minutes} min",
    goalValue: "{current} / {goal} min", recordCount: "{count} sessions", chartMinutes: "{count} min",
    emptyHistory: "No records yet. Your first completed focus session will appear here.", startTime: "Start {time}",
    endTime: "End {time}", notRecorded: "Not recorded", times: "{count}", none: "None",
    unchanged: "No change from last week", comparedLastWeek: "{change}% vs last week", startedThisWeek: "Started tracking this week",
    statusTooltip: "观时 · Timegaze · Click to open", showContentHistory: "Show content history", recentContent: "Recently used", noContentHistory: "No content history yet",
    category_work: "Work", category_study: "Study", category_reading: "Reading", category_creative: "Creative", category_other: "Other",
  },
};
const nativeHost = window.timegazeNative;
if (nativeHost?.platform === "win32") {
  TRANSLATIONS["zh-CN"].menuBar = "系统托盘";
  TRANSLATIONS["zh-CN"].minimizeToMenuBar = "最小化到系统托盘";
  TRANSLATIONS["zh-CN"].statusTooltip = "观时 · Timegaze · 点击打开";
  TRANSLATIONS.en.menuBar = "System tray";
  TRANSLATIONS.en.minimizeToMenuBar = "Minimize to system tray";
  TRANSLATIONS.en.statusTooltip = "观时 · Timegaze · Click to open";
}
const CATEGORY_KEYS = { "工作": "category_work", "学习": "category_study", "阅读": "category_reading", "创作": "category_creative", "其他": "category_other" };
const state = {
  content: "",
  category: "工作",
  plannedMinutes: 25,
  timerTotalSeconds: 25 * 60,
  remainingSeconds: 25 * 60,
  elapsedSeconds: 0,
  elapsedAtStart: 0,
  startedAt: null,
  focusStartedAt: null,
  phase: "idle",
  presentationExpanded: true,
  nativePresentationSignature: "",
  sessions: [],
  contentHistory: [],
  hasSavedContentPreference: false,
  preferences: {
    autoBreak: true,
    breakMinutes: 5,
    alwaysOnTop: true,
    timerDisplayMode: "floating",
    dailyGoalMinutes: 120,
    weeklyGoalMinutes: 600,
    language: "zh-CN",
    lastContent: "",
  },
};

const $ = id => document.getElementById(id);
const pad = value => String(value).padStart(2, "0");
const dateKey = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const formatClock = seconds => `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
const locale = () => state.preferences.language === "en" ? "en-AU" : "zh-CN";

function t(key, values = {}) {
  const template = TRANSLATIONS[state.preferences.language][key] || TRANSLATIONS["zh-CN"][key] || key;
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), template);
}

function formatCategory(category) {
  return CATEGORY_KEYS[category] ? t(CATEGORY_KEYS[category]) : category;
}

function formatDuration(seconds) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return t("minutes", { count: minutes });
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? t("hoursMinutes", { hours, minutes: rest }) : t("hours", { count: hours });
}

function escapeHTML(value) {
  return value.replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

function loadSessions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    state.sessions = saved ? JSON.parse(saved) : [];
  } catch {
    state.sessions = [];
  }
}

function saveSessions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.sessions));
}

function loadPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "null");
    if (!saved || typeof saved !== "object") return;
    if (typeof saved.autoBreak === "boolean") state.preferences.autoBreak = saved.autoBreak;
    if ([5, 10].includes(saved.breakMinutes)) state.preferences.breakMinutes = saved.breakMinutes;
    if (typeof saved.alwaysOnTop === "boolean") state.preferences.alwaysOnTop = saved.alwaysOnTop;
    if (["floating", "menuBar"].includes(saved.timerDisplayMode)) state.preferences.timerDisplayMode = saved.timerDisplayMode;
    if (Number.isInteger(saved.dailyGoalMinutes) && saved.dailyGoalMinutes >= 1 && saved.dailyGoalMinutes <= 1440) state.preferences.dailyGoalMinutes = saved.dailyGoalMinutes;
    if (Number.isInteger(saved.weeklyGoalMinutes) && saved.weeklyGoalMinutes >= 1 && saved.weeklyGoalMinutes <= 10080) state.preferences.weeklyGoalMinutes = saved.weeklyGoalMinutes;
    if (["zh-CN", "en"].includes(saved.language)) state.preferences.language = saved.language;
    if (Object.prototype.hasOwnProperty.call(saved, "lastContent") && typeof saved.lastContent === "string") {
      state.preferences.lastContent = saved.lastContent.slice(0, 120);
      state.hasSavedContentPreference = true;
    }
  } catch {
    state.preferences = { autoBreak: true, breakMinutes: 5, alwaysOnTop: true, timerDisplayMode: "floating", dailyGoalMinutes: 120, weeklyGoalMinutes: 600, language: "zh-CN", lastContent: "" };
  }
}

function savePreferences() {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(state.preferences));
}

function restoreLastContent() {
  if (!state.hasSavedContentPreference) {
    const recentSession = state.sessions.find(session => typeof session.content === "string" && session.content.trim());
    state.preferences.lastContent = recentSession ? recentSession.content.trim().slice(0, 120) : "";
    state.hasSavedContentPreference = true;
    savePreferences();
  }
  $("content").value = state.preferences.lastContent;
  state.content = state.preferences.lastContent;
}

function renderContentHistory(query = "") {
  const seen = new Set();
  const values = [state.preferences.lastContent, ...state.sessions.map(session => session.content)]
    .filter(value => typeof value === "string")
    .map(value => value.trim())
    .filter(value => {
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  const normalizedQuery = query.trim().toLocaleLowerCase(locale());
  state.contentHistory = values
    .filter(value => !normalizedQuery || value.toLocaleLowerCase(locale()).includes(normalizedQuery))
    .slice(0, 8);
  const menu = $("content-history-menu");
  menu.innerHTML = state.contentHistory.length
    ? `<strong>${t("recentContent")}</strong>${state.contentHistory.map((value, index) => `<button type="button" class="content-history-option" data-history-index="${index}" title="${escapeHTML(value)}">${escapeHTML(value)}</button>`).join("")}`
    : `<span class="content-history-empty">${t("noContentHistory")}</span>`;
  $("content-history-trigger").disabled = state.phase !== "idle" || values.length === 0;
}

function toggleContentHistory(show) {
  const trigger = $("content-history-trigger");
  const canShow = show && !trigger.disabled && state.phase === "idle";
  $("content-history-menu").classList.toggle("open", canShow);
  trigger.setAttribute("aria-expanded", String(canShow));
}

function applyLanguage() {
  document.documentElement.lang = state.preferences.language;
  document.title = t("appName");
  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-duration-label]").forEach(element => {
    element.textContent = t("minutes", { count: element.dataset.durationLabel });
  });
  document.querySelectorAll("[data-category]").forEach(element => {
    element.textContent = formatCategory(element.dataset.category);
  });
  document.querySelectorAll("[data-weekday]").forEach(element => {
    const reference = new Date(2026, 6, 12 + Number(element.dataset.weekday));
    element.textContent = new Intl.DateTimeFormat(locale(), { weekday: "narrow" }).format(reference);
  });
  $("language-select").value = state.preferences.language;
  $("language-select").setAttribute("aria-label", t("language"));
  $("today-label").textContent = new Intl.DateTimeFormat(locale(), { month: "long", day: "numeric", weekday: "long" }).format(new Date());
  renderContentHistory();
  renderPreferences();
  renderTimer();
  renderSummary();
  updateNativePresentation(true);
}

function renderPreferences() {
  $("auto-break").checked = state.preferences.autoBreak;
  $("break-minutes").value = String(state.preferences.breakMinutes);
  $("break-minutes").disabled = !state.preferences.autoBreak || state.phase !== "idle";
  $("always-on-top").checked = state.preferences.alwaysOnTop;
  $("always-on-top").disabled = state.phase !== "idle" || state.preferences.timerDisplayMode === "menuBar";
  $("timer-display-mode").value = state.preferences.timerDisplayMode;
  $("daily-goal").value = String(state.preferences.dailyGoalMinutes);
  $("weekly-goal").value = String(state.preferences.weeklyGoalMinutes);
}

function setControlsDisabled(disabled) {
  $("content").disabled = disabled;
  $("content-history-trigger").disabled = disabled || state.contentHistory.length === 0;
  if (disabled) toggleContentHistory(false);
  $("category").disabled = disabled;
  $("custom-minutes").disabled = disabled;
  $("auto-break").disabled = disabled;
  $("always-on-top").disabled = disabled || state.preferences.timerDisplayMode === "menuBar";
  $("timer-display-mode").disabled = disabled;
  document.querySelectorAll("[data-minutes]").forEach(button => { button.disabled = disabled; });
  $("break-minutes").disabled = disabled || !state.preferences.autoBreak;
}

function updateNativePresentation(force = false) {
  const timerActive = ["running", "resting"].includes(state.phase);
  const compact = timerActive && !state.presentationExpanded;
  const usesFloatingWindow = state.preferences.timerDisplayMode === "floating";
  document.body.classList.toggle("compact-mode", compact && usesFloatingWindow);
  const timeText = `${state.phase === "resting" ? t("restPrefix") : ""}${formatClock(state.remainingSeconds)}`;
  const signature = JSON.stringify({ compact, timerActive, timeText, mode: state.preferences.timerDisplayMode, top: state.preferences.alwaysOnTop, language: state.preferences.language });
  if (!force && signature === state.nativePresentationSignature) return;
  state.nativePresentationSignature = signature;
  if (window.webkit?.messageHandlers?.windowMode) {
    window.webkit.messageHandlers.windowMode.postMessage({
      compact,
      alwaysOnTop: state.preferences.alwaysOnTop,
      timerActive,
      displayMode: state.preferences.timerDisplayMode,
      timeText,
      language: state.preferences.language,
      appName: t("appName"),
      statusTooltip: t("statusTooltip"),
    });
  }
  nativeHost?.updatePresentation?.({
    compact,
    alwaysOnTop: state.preferences.alwaysOnTop,
    timerActive,
    displayMode: state.preferences.timerDisplayMode,
    timeText,
    language: state.preferences.language,
    appName: t("appName"),
    statusTooltip: t("statusTooltip"),
  });
}

function setCompactMode(compact) {
  state.presentationExpanded = !compact;
  updateNativePresentation(true);
}

window.restoreFromMenuBar = function restoreFromMenuBar() {
  state.presentationExpanded = true;
  updateNativePresentation(true);
};
nativeHost?.onRestore?.(() => window.restoreFromMenuBar());

function renderTimer() {
  $("timer").textContent = formatClock(state.remainingSeconds);
  $("timer-mode-label").textContent = state.phase === "resting" ? t("resting") : "";
  document.body.classList.toggle("rest-mode", state.phase === "resting");
  const progress = Math.min(state.elapsedSeconds / Math.max(state.timerTotalSeconds, 1), 1) * 360;
  $("timer-ring").style.setProperty("--progress", `${progress}deg`);

  const statuses = {
    idle: t("idleStatus"),
    running: t("runningStatus", { duration: formatDuration(state.elapsedSeconds) }),
    paused: t("pausedStatus"),
    resting: t("restingStatus", { duration: formatDuration(state.remainingSeconds) }),
  };
  $("status").textContent = statuses[state.phase];
  setControlsDisabled(state.phase !== "idle");
  const menuBarAction = state.preferences.timerDisplayMode === "menuBar"
    ? `<button class="secondary" data-action="hide-to-menu-bar">${t("minimizeToMenuBar")}</button>`
    : "";

  if (state.phase === "idle") {
    $("actions").innerHTML = `<button class="primary" data-action="start">${t("startFocus")}</button>`;
  } else if (state.phase === "running") {
    $("actions").innerHTML = `<button class="primary" data-action="pause">${t("pause")}</button><button class="secondary" data-action="finish">${t("finishAndSave")}</button>${menuBarAction}<button class="text-button" data-action="reset">${t("discard")}</button>`;
  } else if (state.phase === "paused") {
    $("actions").innerHTML = `<button class="primary" data-action="start">${t("resumeFocus")}</button><button class="secondary" data-action="finish">${t("finishAndSave")}</button><button class="text-button" data-action="reset">${t("discard")}</button>`;
  } else {
    $("actions").innerHTML = `<button class="secondary" data-action="end-rest">${t("endBreak")}</button>${menuBarAction}`;
  }
  updateNativePresentation();
}

function selectDuration(minutes, selectedButton = null) {
  state.plannedMinutes = minutes;
  state.timerTotalSeconds = minutes * 60;
  state.remainingSeconds = state.timerTotalSeconds;
  document.querySelectorAll("[data-minutes]").forEach(button => {
    button.classList.toggle("active", button === selectedButton);
  });
  renderTimer();
}

function applyCustomDuration() {
  if (state.phase !== "idle") return;
  const minutes = Number($("custom-minutes").value);
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 240) {
    $("error").textContent = $("custom-minutes").value ? t("customDurationError") : "";
    return;
  }
  $("error").textContent = "";
  selectDuration(minutes);
}

function start() {
  if (state.phase === "paused") {
    state.elapsedAtStart = state.elapsedSeconds;
    state.startedAt = Date.now();
    state.phase = "running";
    renderTimer();
    setCompactMode(true);
    return;
  }

  state.content = $("content").value.trim();
  state.category = $("category").value;
  if (!state.content) {
    $("error").textContent = t("contentRequired");
    return;
  }
  state.preferences.lastContent = state.content;
  state.hasSavedContentPreference = true;
  savePreferences();
  $("error").textContent = "";
  state.elapsedAtStart = 0;
  state.elapsedSeconds = 0;
  state.focusStartedAt = new Date().toISOString();
  state.timerTotalSeconds = state.plannedMinutes * 60;
  state.remainingSeconds = state.timerTotalSeconds;
  state.startedAt = Date.now();
  state.phase = "running";
  renderTimer();
  setCompactMode(true);
}

function pause() {
  state.startedAt = null;
  state.elapsedAtStart = state.elapsedSeconds;
  state.phase = "paused";
  setCompactMode(false);
  renderTimer();
}

function returnToIdle() {
  state.startedAt = null;
  state.focusStartedAt = null;
  state.elapsedAtStart = 0;
  state.elapsedSeconds = 0;
  state.timerTotalSeconds = state.plannedMinutes * 60;
  state.remainingSeconds = state.timerTotalSeconds;
  state.phase = "idle";
  $("error").textContent = "";
  setCompactMode(false);
  renderPreferences();
  renderTimer();
}

function reset() {
  returnToIdle();
}

function startBreak() {
  state.startedAt = Date.now();
  state.elapsedAtStart = 0;
  state.elapsedSeconds = 0;
  state.timerTotalSeconds = state.preferences.breakMinutes * 60;
  state.remainingSeconds = state.timerTotalSeconds;
  state.phase = "resting";
  renderTimer();
  setCompactMode(true);
}

function endRest() {
  returnToIdle();
}

function hideToMenuBar() {
  if (state.preferences.timerDisplayMode !== "menuBar" || !["running", "resting"].includes(state.phase)) return;
  setCompactMode(true);
}

function finishFocus() {
  if (state.elapsedSeconds < 1) return;
  const endedAt = new Date().toISOString();
  state.sessions.unshift({
    id: crypto.randomUUID(),
    content: state.content,
    category: state.category,
    plannedMinutes: state.plannedMinutes,
    durationSeconds: state.elapsedSeconds,
    startedAt: state.focusStartedAt,
    endedAt,
    completedAt: endedAt,
  });
  state.focusStartedAt = null;
  saveSessions();
  renderContentHistory();
  renderSummary();
  if (state.preferences.autoBreak) startBreak();
  else returnToIdle();
}

function startOfWeek(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  return date;
}

function sessionsBetween(start, end) {
  return state.sessions.filter(session => {
    const completedAt = new Date(session.completedAt);
    return completedAt >= start && completedAt < end;
  });
}

function sessionSeconds(sessions) {
  return sessions.reduce((sum, session) => sum + (Number(session.durationSeconds) || 0), 0);
}

function renderGoals() {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekStart = startOfWeek(now);
  const nextWeek = new Date(weekStart);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const todayMinutes = Math.round(sessionSeconds(sessionsBetween(todayStart, tomorrow)) / 60);
  const weekMinutes = Math.round(sessionSeconds(sessionsBetween(weekStart, nextWeek)) / 60);
  const dailyProgress = Math.min(todayMinutes / state.preferences.dailyGoalMinutes * 100, 100);
  const weeklyProgress = Math.min(weekMinutes / state.preferences.weeklyGoalMinutes * 100, 100);
  $("daily-goal-bar").style.width = `${dailyProgress}%`;
  $("weekly-goal-bar").style.width = `${weeklyProgress}%`;
  $("daily-goal-copy").textContent = t("goalValue", { current: todayMinutes, goal: state.preferences.dailyGoalMinutes });
  $("weekly-goal-copy").textContent = t("goalValue", { current: weekMinutes, goal: state.preferences.weeklyGoalMinutes });
}

function renderHeatmap() {
  const weekStart = startOfWeek(new Date());
  weekStart.setDate(weekStart.getDate() - 77);
  const dailyGoalSeconds = state.preferences.dailyGoalMinutes * 60;
  const cells = [];
  for (let index = 0; index < 84; index += 1) {
    const dayStart = new Date(weekStart);
    dayStart.setDate(weekStart.getDate() + index);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const seconds = sessionSeconds(sessionsBetween(dayStart, dayEnd));
    const ratio = seconds / dailyGoalSeconds;
    const level = seconds === 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 0.75 ? 3 : 4;
    const label = `${dayStart.toLocaleDateString(locale(), { month: "long", day: "numeric" })} · ${formatDuration(seconds)}`;
    cells.push(`<i data-level="${level}" title="${label}"></i>`);
  }
  $("heatmap").innerHTML = cells.join("");
}

function renderWeeklyReport() {
  const currentStart = startOfWeek(new Date());
  const currentEnd = new Date(currentStart);
  currentEnd.setDate(currentEnd.getDate() + 7);
  const previousStart = new Date(currentStart);
  previousStart.setDate(previousStart.getDate() - 7);
  const currentSessions = sessionsBetween(currentStart, currentEnd);
  const previousSessions = sessionsBetween(previousStart, currentStart);
  const currentSeconds = sessionSeconds(currentSessions);
  const previousSeconds = sessionSeconds(previousSessions);
  let changeText = t("unchanged");
  if (previousSeconds > 0) {
    const change = Math.round((currentSeconds - previousSeconds) / previousSeconds * 100);
    changeText = t("comparedLastWeek", { change: `${change >= 0 ? "+" : ""}${change}` });
  } else if (currentSeconds > 0) {
    changeText = t("startedThisWeek");
  }

  const dayTotals = new Map();
  const categoryTotals = new Map();
  currentSessions.forEach(session => {
    const key = dateKey(new Date(session.completedAt));
    dayTotals.set(key, (dayTotals.get(key) || 0) + (Number(session.durationSeconds) || 0));
    categoryTotals.set(session.category, (categoryTotals.get(session.category) || 0) + (Number(session.durationSeconds) || 0));
  });
  const bestDay = [...dayTotals.entries()].sort((a, b) => b[1] - a[1])[0];
  const topCategory = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1])[0];
  const reportEnd = new Date(currentEnd);
  reportEnd.setDate(reportEnd.getDate() - 1);
  $("report-range").textContent = `${currentStart.getMonth() + 1}/${currentStart.getDate()}–${reportEnd.getMonth() + 1}/${reportEnd.getDate()}`;
  $("report-total").textContent = formatDuration(currentSeconds);
  $("report-change").textContent = changeText;
  $("report-count").textContent = t("times", { count: currentSessions.length });
  $("report-best").textContent = bestDay ? new Date(`${bestDay[0]}T00:00:00`).toLocaleDateString(locale(), { weekday: "long" }) : t("none");
  $("report-category").textContent = topCategory ? formatCategory(topCategory[0]) : t("none");
}

function renderSummary() {
  const now = new Date();
  const today = dateKey(now);
  let todaySeconds = 0;
  let totalSeconds = 0;
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return {
      key: dateKey(date),
      label: new Intl.DateTimeFormat(locale(), { weekday: "narrow" }).format(date),
      seconds: 0,
    };
  });
  const totals = {};
  state.sessions.forEach(session => {
    const seconds = Number(session.durationSeconds) || 0;
    totalSeconds += seconds;
    const key = dateKey(new Date(session.completedAt));
    if (key === today) todaySeconds += seconds;
    const day = week.find(item => item.key === key);
    if (day) day.seconds += seconds;
    totals[session.category] = (totals[session.category] || 0) + seconds;
  });
  $("today-minutes").textContent = Math.round(todaySeconds / 60);
  $("today-count").textContent = state.sessions.filter(session => dateKey(new Date(session.completedAt)) === today).length;
  $("total-time").textContent = formatDuration(totalSeconds);
  $("record-count").textContent = t("recordCount", { count: state.sessions.length });
  const maximum = Math.max(...week.map(day => day.seconds), 1);
  $("week-chart").innerHTML = week.map(day => `<div class="bar-item ${day.key === today ? "today" : ""}" title="${t("chartMinutes", { count: Math.round(day.seconds / 60) })}"><div class="bar-track"><div class="bar-fill" style="height:${Math.max(day.seconds / maximum * 100, 3)}%"></div></div><span>${day.label}</span></div>`).join("");
  $("category-list").innerHTML = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name, seconds]) => `<div class="category-row"><span class="dot"></span><span class="name">${escapeHTML(formatCategory(name))}</span><span>${formatDuration(seconds)}</span></div>`).join("");
  $("history-list").innerHTML = state.sessions.length ? state.sessions.slice(0, 20).map(session => {
    const endedAt = new Date(session.endedAt || session.completedAt);
    const startedAt = session.startedAt ? new Date(session.startedAt) : null;
    const timeOptions = { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false };
    const startText = startedAt && !Number.isNaN(startedAt.getTime()) ? startedAt.toLocaleString(locale(), timeOptions) : t("notRecorded");
    const endText = endedAt.toLocaleString(locale(), timeOptions);
    return `<div class="history-row"><div class="history-date">${endedAt.toLocaleDateString(locale(), { month: "numeric", day: "numeric" })}</div><div><div class="history-title">${escapeHTML(session.content)}</div><div class="history-meta"><span>${t("startTime", { time: startText })}</span><i></i><span>${t("endTime", { time: endText })}</span></div></div><div class="history-category">${escapeHTML(formatCategory(session.category))}</div><div class="history-duration">${formatDuration(session.durationSeconds)}</div></div>`;
  }).join("") : `<div class="empty">${t("emptyHistory")}</div>`;
  renderGoals();
  renderHeatmap();
  renderWeeklyReport();
}

$("duration-row").addEventListener("click", event => {
  const button = event.target.closest("[data-minutes]");
  if (!button || state.phase !== "idle") return;
  $("custom-minutes").value = "";
  selectDuration(Number(button.dataset.minutes), button);
});
$("content").addEventListener("focus", () => {
  renderContentHistory();
  toggleContentHistory(true);
});
$("content").addEventListener("input", event => {
  state.preferences.lastContent = event.target.value.slice(0, 120);
  state.hasSavedContentPreference = true;
  savePreferences();
  renderContentHistory(event.target.value);
  toggleContentHistory(true);
});
$("content-history-trigger").addEventListener("click", event => {
  event.stopPropagation();
  const willOpen = !$("content-history-menu").classList.contains("open");
  renderContentHistory();
  toggleContentHistory(willOpen);
});
$("content-history-menu").addEventListener("click", event => {
  const option = event.target.closest("[data-history-index]");
  if (!option) return;
  const value = state.contentHistory[Number(option.dataset.historyIndex)];
  if (typeof value !== "string") return;
  $("content").value = value;
  state.content = value;
  state.preferences.lastContent = value;
  state.hasSavedContentPreference = true;
  savePreferences();
  renderContentHistory();
  $("content").focus();
  toggleContentHistory(false);
});
document.addEventListener("click", event => {
  if (!event.target.closest(".content-field")) toggleContentHistory(false);
});
$("custom-minutes").addEventListener("change", applyCustomDuration);
$("custom-minutes").addEventListener("input", applyCustomDuration);
$("auto-break").addEventListener("change", event => {
  state.preferences.autoBreak = event.target.checked;
  savePreferences();
  renderPreferences();
});
$("break-minutes").addEventListener("change", event => {
  const minutes = Number(event.target.value);
  if ([5, 10].includes(minutes)) state.preferences.breakMinutes = minutes;
  savePreferences();
});
$("always-on-top").addEventListener("change", event => {
  state.preferences.alwaysOnTop = event.target.checked;
  savePreferences();
});
$("timer-display-mode").addEventListener("change", event => {
  if (!["floating", "menuBar"].includes(event.target.value)) return;
  state.preferences.timerDisplayMode = event.target.value;
  savePreferences();
  renderPreferences();
  updateNativePresentation(true);
});
$("language-select").addEventListener("change", event => {
  if (!["zh-CN", "en"].includes(event.target.value)) return;
  state.preferences.language = event.target.value;
  savePreferences();
  applyLanguage();
});
$("daily-goal").addEventListener("change", event => {
  const minutes = Number(event.target.value);
  if (Number.isInteger(minutes) && minutes >= 1 && minutes <= 1440) {
    state.preferences.dailyGoalMinutes = minutes;
    savePreferences();
  }
  renderPreferences();
  renderSummary();
});
$("weekly-goal").addEventListener("change", event => {
  const minutes = Number(event.target.value);
  if (Number.isInteger(minutes) && minutes >= 1 && minutes <= 10080) {
    state.preferences.weeklyGoalMinutes = minutes;
    savePreferences();
  }
  renderPreferences();
  renderSummary();
});
$("actions").addEventListener("click", event => {
  const action = event.target.dataset.action;
  if (action === "start") start();
  if (action === "pause") pause();
  if (action === "finish") finishFocus();
  if (action === "reset") reset();
  if (action === "end-rest") endRest();
  if (action === "hide-to-menu-bar") hideToMenuBar();
});
$("timer-ring").addEventListener("click", () => {
  if (document.body.classList.contains("compact-mode")) setCompactMode(false);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && document.body.classList.contains("compact-mode")) setCompactMode(false);
});

setInterval(() => {
  if (!["running", "resting"].includes(state.phase) || state.startedAt === null) return;
  state.elapsedSeconds = state.elapsedAtStart + Math.floor((Date.now() - state.startedAt) / 1000);
  state.remainingSeconds = Math.max(state.timerTotalSeconds - state.elapsedSeconds, 0);
  renderTimer();
  if (state.remainingSeconds !== 0) return;
  if (state.phase === "running") finishFocus();
  else endRest();
}, 250);

loadSessions();
loadPreferences();
restoreLastContent();
applyLanguage();
