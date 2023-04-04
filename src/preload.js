const { contextBridge, ipcRenderer } = require('electron')

// 将ipcRenderer开放给渲染进程。
// 否则在渲染进程中，window.electron里是没有ipcRenderer的。
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer,
})

// 共享给渲染进程的方法
contextBridge.exposeInMainWorld('api', {
    // 读取目录文件列表回调
    readDirReply: (callback) => {
        ipcRenderer.once('readDir-reply', (event, result)=>{callback(event, result)})
    }  
})