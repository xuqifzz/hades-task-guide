import React, { useContext, useState } from 'react'
import { SaveDataContext } from './context/SaveDataContext'
import { FromSaveFileResult } from './lib/HadesSaveFile';
import { Link } from 'react-router-dom'
import SaveData from './data/SaveData';
import {translateWord,textLineDict} from './data/GameData'

function createSaveData(r:FromSaveFileResult){
    return r.saveData ? new SaveData(r.saveData.luaState) : undefined
}

export  function TextLineLabel({id,noLink,text} : {id:string,noLink ?: boolean,text ?:string}) {
    const saveData = createSaveData(useContext(SaveDataContext));   
    const mark = saveData?.checkTextLineComplete(id) ? " [已完成]" : undefined;
    text = text || id;
    return (
        <span>
          { noLink ? <span>{id}</span> : <Link to={"/TextLines/" + id} >{text}</Link> }
        {mark}</span>
    )
}

export  function QuestLable({id,noLink,showId} : {id:string,noLink ?: boolean,showId ?: boolean}) {
    const saveData = createSaveData(useContext(SaveDataContext));   
    const questStatus = saveData?.getQuestStatus(id) || "Locked";
   
    let mark = "";
    if(questStatus === "CashedOut") mark = " [已完成]";
    if(questStatus === "Unlocked") mark = " [已解锁]";
    const textId = showId ? (" " + id + " ") : undefined;
    return (
        <span>
           { noLink ? <span>{translateWord(id)}</span> : <Link to={"/Quests/" + id} >{translateWord(id)}</Link> }
           {textId}
           {mark}
        </span>
    )
}


export  function NpcLable({id,noLink,showId} : {id:string,noLink ?: boolean,showId ?: boolean}) {

   
    const textId = showId ? (" " + id + " ") : undefined;
    return (
        <span>
           { noLink ? <span>{translateWord(id)}</span> : <Link to={"/Npcs/" + id} >{translateWord(id)}</Link> }
           {textId}
        </span>
    )
}

export  function ConditionalItemLabel({id,noLink,showId} : {id:string,noLink ?: boolean,showId ?: boolean}) {
    const saveData = createSaveData(useContext(SaveDataContext));   
    const itemStatus = saveData?.getGameStateValue<string>("Cosmetics",id);
   
    let mark = itemStatus ? " [已购买] " : "";
    const textId = showId ? (" " + id + " ") : undefined;

    return (
        <span>
           { noLink ? <span>{translateWord(id)}</span> : <Link to={"/ConditionalItems/" + id} >{translateWord(id)}</Link> }
           {textId}
           {mark}
        </span>
    )
}

export  function GiftLable({id,noLink} : {id:string,noLink ?: boolean}) {
    const saveData = createSaveData(useContext(SaveDataContext));   

    const giftValue = saveData?.getGiftValue(id) || 0;
   
    let mark = "";
    if(giftValue > 0) mark = ` [当前好感度: ${giftValue} ]`;


    return (
        <span>
           { noLink ? <span>{translateWord(id)}</span> : <Link to={"/Gifts/" + id} >{translateWord(id)}</Link> }         
           {mark}
        </span>
    )
}

export  function WeaponLevel4UnlockLable({weaponId,textLineId} : {weaponId:string,textLineId:string}) {
    const saveData = createSaveData(useContext(SaveDataContext));   
    const weaponValue = saveData?.getWeaponLevel4Unlocks(weaponId) || 0;
    let mark = weaponValue > 0 ? " [已解锁] " : "";

    return (
        <span>
            <Link to={"/TextLines/" + textLineId} >{translateWord(weaponId)}</Link> 
        {mark}</span>
    )
}



export interface TextRowProps {
    text:string,
    remarkFun ?: (saveData:SaveData)=>string
}

export function TextRow({text, remarkFun}:TextRowProps) {
    const saveData = createSaveData(useContext(SaveDataContext));   
    let remark = (saveData && remarkFun) ? remarkFun(saveData) : undefined;
    return <span>{text} {remark}</span>
}



export function TextLabel({id,attachDescription, mark,linkPrefix} : {id:string,attachDescription ?:string,  mark?:(saveData:SaveData)=>string,linkPrefix ?: string}){
    const saveData = createSaveData(useContext(SaveDataContext));  
    let m = "";
    if(saveData && mark){
        m = mark(saveData) || ""
    }
    return <span>
           { linkPrefix ?   (<Link to={linkPrefix + id} >{translateWord(id)}</Link>) :(<span>{translateWord(id)}</span>)}   
           {attachDescription}      
           {m}
    </span>;
}


export function SaveDataStatusLabel({notCompleteTextline,refreshNextNotCompleteTextline,notCompleteTextlineCount}:{refreshNextNotCompleteTextline : ()=>void,notCompleteTextline?:string,notCompleteTextlineCount:number} ){

   // const [notCompleteTextline,setNotCompleteTextline] = useState<string>();

    // return r.saveData ? new SaveData(r.saveData.luaState) : undefined
    const r = useContext(SaveDataContext);
    if(!r.isSuccess && r.message === ""){
        return <span>存档目录:文档\Saved Games\Hades, 其中1号存档名为Profile1.sav</span>
    }
    if(!r.isSuccess){
        return <span>{`存档载入失败: ${r.message}`}</span>
    }

    const totalTextlineCount = Object.keys(textLineDict).length;
  
    let hasComplete = totalTextlineCount- notCompleteTextlineCount;
    let percent = (hasComplete * 100 / totalTextlineCount).toFixed(2);




    return <span>
        <span>{`存档载入成功,已完成 ${percent}% 的对话 ( ${hasComplete}/${totalTextlineCount} )`}</span> &nbsp;
        { notCompleteTextline ? <Link to={`/TextLines/${notCompleteTextline}`} onClick={refreshNextNotCompleteTextline} >随机跳转到一条未完成对话</Link>  : undefined}
    </span>

}
