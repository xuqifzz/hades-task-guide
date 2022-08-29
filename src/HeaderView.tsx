import React, { useRef,useState } from 'react';
import { fromFile } from './lib/HadesSaveFile'
import { Buffer } from "buffer";
import { FromSaveFileResult } from './lib/HadesSaveFile'
import { Link } from 'react-router-dom'
import { SaveDataStatusLabel } from './ViewComponents';
import SaveData from './data/SaveData';
export default function HeaderView(props: { onChangeSaveDataResult: (s: FromSaveFileResult) => void }) {

   // const [saveDataTip,setSaveDataTip] = useState("存档目录:文档\\Saved Games\\Hades, 其中1号存档名为Profile1.sav")
    const { onChangeSaveDataResult } = props;
    const inputEl = useRef<HTMLInputElement>(null);
    const [notCompleteTextline,setNotCompleteTextline] = useState<string>();
    const [notCompleteTextlines,setNotCompleteTextlines] = useState<string[]>([]);


    const refreshNextNotCompleteTextline = ()=>{
        if(notCompleteTextlines && notCompleteTextlines.length > 0){
            setNotCompleteTextline(notCompleteTextlines[Math.floor(notCompleteTextlines.length* Math.random())]);
        }
    }

    const onFileChange = () => {
        const fr = new FileReader();
        fr.onload = () => {
            const buffer = Buffer.from(fr.result as string, "ascii");    
            const result = fromFile(buffer)          
            if(result.isSuccess && result.saveData){
                const sd = new SaveData(result.saveData.luaState);
                const ncs = sd.getNotCompleteTextLines()
                setNotCompleteTextlines(ncs);
                if(ncs.length > 0){
                    setNotCompleteTextline(ncs[Math.floor(ncs.length* Math.random())]);
                }
                
            }
        
            onChangeSaveDataResult(result);
        }
        if (inputEl.current && inputEl.current.files) {
            fr.readAsBinaryString(inputEl.current.files![0])
        }

    }

    const handleOpenFileInput = () => {
        inputEl.current?.click();
    };

    return (
        <div>
            <div className='logo-title-block'>
                <Link className='logo-text' to={"/"}> Hades 任务攻略 {" & "} 指引</Link>
                <span>
                    Powered by: <a href='https://space.bilibili.com/15883813' target="_blank">艾加加</a> &nbsp; Q群:4557024
                </span>
            </div>
            <div >
                <label onClick={handleOpenFileInput}>
                    <button className='file-upload-button'>点此载入存档</button>
                </label>
                <input
                    ref={inputEl}
                    accept=".sav"
                    style={{ display: "none" }}
                    type="file"
                    onChange={onFileChange}
                /><span>&nbsp;<SaveDataStatusLabel 
                    notCompleteTextline={notCompleteTextline} 
                    refreshNextNotCompleteTextline={refreshNextNotCompleteTextline}
                    notCompleteTextlineCount ={notCompleteTextlines.length}
                    /> </span>
            </div>
            <hr />

        </div>
    )
}
