import React from 'react'
import {FromSaveFileResult} from '../lib/HadesSaveFile'

const defaultResult :FromSaveFileResult = {
    isSuccess: false,
    message: "未选择存档文件"
}
export const SaveDataContext = React.createContext(defaultResult);
