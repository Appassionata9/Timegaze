# 观时 · Timegaze for Windows

Windows 版本复用 macOS 版本的专注界面、记录格式与统计逻辑，并提供 Windows 原生窗口和系统托盘支持。

## 本地开发

```powershell
cd windows
npm install
npm start
```

## 生成安装包

```powershell
cd windows
npm install
npm run build
```

安装包输出到 `release/windows`。生成的通用安装包同时包含 x64 和 ARM64 版本，并在安装时选择对应架构。
