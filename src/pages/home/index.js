import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { goto } from '@/api'
import './home.styl'

const { ipcRenderer } = window.electron

function Home() {
    // 创建路由钩子
    const navigate = useNavigate()

    // 读取目录文件列表
    const readDir = () => {
        // 给主进程发送消息
        ipcRenderer.send('readDir', { msg: 'test' })
        // 通过preload接收主进程的回调信息
        window.api.readDirReply((event, result) => {
            if (!result.canceled) {
                console.log(result)
            } else {
                console.log('取消选择操作。')
            }
        })
    }

    // 获取Electron版本号 - 给主进程发送消息并异步等待结果
    const getElectronVersion = () => {
        ipcRenderer.invoke('getElectronVersion').then((result) => {
            console.log(result)
        })
    }

    return (
        <div className="P-home">
            <h1>Home Page</h1>
            <div className="ipt-con">
                <Button type="primary" onClick={readDir}>
                    读取目录列表
                </Button>
            </div>
            <div className="ipt-con">
                <Button type="primary" onClick={getElectronVersion}>
                    查看Electron版本
                </Button>
            </div>
            <div className="ipt-con">
                <Button
                    onClick={() => {
                        goto('/login')
                    }}
                >
                    组件外跳转
                </Button>
            </div>
            <div className="ipt-con">
                <Button
                    onClick={() => {
                        navigate('/login')
                    }}
                >
                    返回登录
                </Button>
            </div>
        </div>
    )
}

export default Home
