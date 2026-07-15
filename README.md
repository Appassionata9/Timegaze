# 观时 · Timegaze

观时是一款本地运行的 macOS 专注记录应用。它提供专注倒计时、菜单栏计时、历史记录、统计汇总、自动休息以及中英文界面；专注记录保存在本机。

## 下载安装

[下载 macOS 版（ZIP）](https://github.com/Appassionata9/Timegaze/releases/latest/download/Timegaze-macOS.zip)

1. 解压 `Timegaze-macOS.zip`。
2. 将“观时 · Timegaze.app”拖入“应用程序”文件夹。
3. 第一次打开时，如果 macOS 显示安全提示，请在 Finder 中右键应用并选择“打开”。

当前版本：1.0.0（10）

最低系统版本：macOS 14.0

## 功能

- 25、45、60 分钟和自定义专注时长
- 记录专注内容、分类、开始时间、结束时间与实际时长
- 历史内容快速复用，无需重复输入
- 菜单栏倒计时与紧凑悬浮计时窗口
- 自动休息、窗口置顶和计时显示方式设置
- 日、周、月统计汇总与专注趋势
- 中文、英文界面切换
- 数据仅保存在本机

## 从源码构建

需要 macOS 14.0 或更高版本、Xcode Command Line Tools、Node.js 和 npm。

```bash
npm install
npm run build:mac
```

构建结果位于 `release/观时 · Timegaze.app`。

## 源码结构

```text
macos/main.m              macOS 原生窗口、菜单栏与 WebKit 宿主
macos/app/                应用界面与专注逻辑
macos/Info.plist          应用元数据
macos/AppIconHighRes.png.base64.*  高分辨率图标的可还原分片
macos/restore-icon.sh     还原高分辨率图标
macos/build-icon.mjs      图标生成脚本
macos/build-app.sh        macOS 应用构建脚本
.github/workflows/        自动构建并发布可下载的 macOS 压缩包
```

## 数据说明

应用使用 `localStorage` 在本机保存专注记录和设置。为了兼容此前版本的数据，应用标识符保留为 `local.chenjin.focus`。
