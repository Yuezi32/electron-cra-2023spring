// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow, Menu, globalShortcut, dialog } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

const createWindow = () => {
    // 创建浏览窗口
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 620,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // 禁用同源策略，允许跨域请求
            webSecurity: false,
        },
        icon: 'public/favicon.ico',
    })

    // 加载项目页面
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    )
    if (isDev) {
        // 只有开发环境才打开开发者工具
        mainWindow.webContents.openDevTools()
    }

    createMenu()

    // 在开发环境和生产环境均可通过快捷键打开devTools
    // 此段代码最好在createMenu()之后，否则在macOS可能导致createMenu()失效。
    globalShortcut.register('CommandOrControl+Shift+i', function () {
        mainWindow.webContents.openDevTools()
    })

    return mainWindow
}

// 设置菜单栏
function createMenu() {
    // darwin表示macOS，针对macOS的设置
    if (process.platform === 'darwin') {
        const template = [
            {
                label: 'App Demo',
                submenu: [
                    {
                        role: 'about',
                    },
                    {
                        role: 'quit',
                    },
                ],
            },
        ]
        let menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)
    } else {
        // windows及linux系统
        Menu.setApplicationMenu(null)
    }
}

// 程序单例模式
let myWindow = null
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    // 如果已经有同样的该程序正在运行，则不启动
    app.quit()
} else {
    // 如果检测到有同样的该程序正在试图启动...
    app.on(
        'second-instance',
        (event, commandLine, workingDirectory, additionalData) => {
            if (myWindow) {
                // 弹出系统提示对话框
                dialog.showMessageBox({
                    message: '此程序已经正在运行',
                })
                // 如果该程序窗口处于最小化状态，则恢复窗口
                if (myWindow.isMinimized()) myWindow.restore()
                // 将该程序窗口置为当前聚焦态
                myWindow.focus()
            }
        }
    )

    // 这段程序将会在 Electron 结束初始化
    // 和创建浏览器窗口的时候调用
    // 部分 API 在 ready 事件触发后才能使用。
    app.whenReady().then(() => {
        myWindow = createWindow()

        app.on('activate', () => {
            // 在 macOS 系统内, 如果没有已开启的应用窗口
            // 点击托盘图标时通常会重新创建一个新窗口
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    })

    // 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
    // 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
    // 直到用户使用 Cmd + Q 明确退出
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })
}
// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。
require('./ipcMain/readDir')
require('./ipcMain/version')
