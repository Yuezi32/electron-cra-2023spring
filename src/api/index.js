import {globalRouters} from '@/router'

export const goto = (path) => {
    globalRouters.navigate(path)
}