# 观时 · Timegaze

观时是一款在 macOS 和 Windows 本地运行的专注记录应用。它提供专注倒计时、菜单栏或系统托盘计时、历史记录、统计汇总、自动休息以及中英文界面；专注记录保存在本机。

## 下载

| 系统 | 下载入口 | 系统要求 |
| --- | --- | --- |
| macOS | [下载 Timegaze-macOS.zip](https://github.com/Appassionata9/Timegaze/releases/latest/download/Timegaze-macOS.zip) | macOS 14.0 或更高版本 |
| Windows | [下载 Timegaze-Windows-Setup-1.0.0.exe](https://github.com/Appassionata9/Timegaze/releases/latest/download/Timegaze-Windows-Setup-1.0.0.exe) | Windows 10/11，支持 x64 与 ARM64 |

两个版本位于同一个仓库和同一个 Release 页面：[查看全部下载](https://github.com/Appassionata9/Timegaze/releases/latest)。

### macOS 安装

1. 解压 `Timegaze-macOS.zip`。
2. 将“观时 · Timegaze.app”拖入“应用程序”文件夹。
3. 第一次打开时，如果 macOS 显示安全提示，请在 Finder 中右键应用并选择“打开”。

### Windows 安装

1. 运行 `Timegaze-Windows-Setup-1.0.0.exe`。
2. 按安装程序提示选择安装位置并完成安装。
3. 如果 Windows SmartScreen 出现提示，请选择“更多信息”，确认发布来源后再选择“仍要运行”。

当前版本：1.0.0

## 功能

- 25、45、60 分钟和自定义专注时长
- 记录专注内容、分类、开始时间、结束时间与实际时长
- 历史内容快速复用，无需重复输入
- macOS 菜单栏或 Windows 系统托盘计时
- 紧凑悬浮计时窗口与窗口置顶
- 自动休息和计时显示方式设置
- 日、周、月统计汇总与专注趋势
- 中文、英文界面切换
- 数据仅保存在本机

## 从源码构建

### macOS

需要 macOS 14.0 或更高版本、Xcode Command Line Tools、Node.js 和 npm。

```bash
npm install
npm run build:mac
```

### Windows

需要 Node.js 和 npm。

```powershell
cd windows
npm install
npm run build
```

## 源码结构

```text
macos/main.m              macOS 原生窗口、菜单栏与 WebKit 宿主
macos/app/                macOS 与 Windows 共用的界面和专注逻辑
macos/Info.plist          macOS 应用元数据
macos/AppIconHighRes.png.base64.*  高分辨率图标的可还原分片
macos/restore-icon.sh     还原高分辨率图标
macos/build-icon.mjs      图标生成脚本
macos/build-app.sh        macOS 应用构建脚本
windows/main.cjs          Windows 原生窗口与系统托盘宿主
windows/preload.cjs       Windows 安全通信桥接
windows/prepare-icon.cjs  从同一图标源生成 Windows 图标
windows/package.json      Windows 安装包配置
.github/workflows/        自动构建并发布两个系统的安装包
```

## 数据说明

应用使用 `localStorage` 在本机保存专注记录和设置，不会上传个人专注内容。
