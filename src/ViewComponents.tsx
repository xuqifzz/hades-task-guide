import React, { useContext } from 'react'
import { SaveDataContext } from './context/SaveDataContext'
import { FromSaveFileResult } from './lib/HadesSaveFile';
import { Link } from 'react-router-dom'
import SaveData from './data/SaveData';
import {translateWord} from './data/GameData'
import { markAsUntransferable } from 'worker_threads';

function createSaveData(r:FromSaveFileResult){
    return r.saveData ? new SaveData(r.saveData.luaState) : undefined
}

export  function TextLineLable({id,noLink,text} : {id:string,noLink ?: boolean,text ?:string}) {
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


export  function NpcInteractionLabel({id,times} : {id:string,times : number}) {
    const saveData = createSaveData(useContext(SaveDataContext));   

    const count = saveData?.getGameStateValue<number>("NPCInteractions",id) || 0;
   
    let mark = "";
    if(count > 0) mark = ` [当前交互次数: ${count} ]`;


    return (
        <span>
            <Link to={"/Gifts/" + id} >{translateWord(id)}</Link> : {times} 
           {mark}
        </span>
    )
}

export  function TraitHasTakenLabel({id} : {id:string}) {
    const saveData = createSaveData(useContext(SaveDataContext));   
    const hasTaken = saveData?.getGameStateValue<boolean>("TraitsTaken",id) || false;  
    let mark = hasTaken ? " [已取得] " : "";
    return (
        <span>
           <span>{translateWord(id)}</span>
           {mark}
        </span>
    )
}

export  function WeaponsUnlokedLabel({id} : {id:string}) {
    const saveData = createSaveData(useContext(SaveDataContext));   
    const unlocked = saveData?.getGameStateValue<boolean>("WeaponsUnlocked",id) || false;  
    let mark = unlocked ? " [已解锁] " : "";
    return (
        <span>
           <span>{translateWord(id)}</span>
           {mark}
        </span>
    )
}

export function TextLable({id,mark,linkPrefix} : {id:string,mark:(saveData:SaveData)=>string,linkPrefix ?: string}){
    const saveData = createSaveData(useContext(SaveDataContext));  
    let m = saveData ? mark(saveData) : ""; 
    return <span>
           { linkPrefix ?   (<Link to={linkPrefix + id} >{translateWord(id)}</Link>) :(<span>{translateWord(id)}</span>)}         
           {m}
    </span>;
    


}
