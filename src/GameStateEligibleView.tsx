import React from 'react'
import { GameStateEligible, translateWord } from './data/GameData'
import { TextLineLabel,TextRow,TextLabel, ConditionalItemLabel } from './ViewComponents'
import {Dict2Array} from './data/utils'

function ULView({header,child}:{header:string,child:()=>JSX.Element[]}){
    let keyIndex = 0;
    return <>
        {header}
        <ul>
            {child().map(c=> <li key={keyIndex++}>{c}</li>)}
        </ul>
    </>   
}


function TextLineList(prop: { header: string, textLines: string[] }) {

    return <>
        {prop.header}
        <ul>
            {prop.textLines.map(t =>  <li key={t}><TextLineLabel id={t} /> </li>)}
        </ul>
    </>
}



type RequireHandler<T extends keyof GameStateEligible> = (requires: GameStateEligible[T]) => JSX.Element

type GameStateEligibleHalders = {
    [P in keyof GameStateEligible]: RequireHandler<P>
}

function et<T>(v:T,f:(v:T)=>string){
    if(v){
        return f(v);
    }
    return "";
}

const gameStateEligibleHalders: GameStateEligibleHalders = {
    //TextRow -no save
    
    "RequiresRunNotCleared": r => <TextRow text={`当前逃脱行动尚未完成`} />,
    "RequiresRunCleared": r => <TextRow text={`当前逃脱行动已经成功`} />,
    "RequiresLastRunCleared": r => <TextRow text={`上次逃脱行动成功`} />,
    "MinRunsSinceSquelchedHermes": r => <TextRow text={`距离叫赫尔墨斯闭嘴至少 ${r} 次逃脱行动`} />,
    "RequiresBestClearTimeLastRun": r => <TextRow text={`上次逃脱行动通关时间为最快记录`} />,
    "RequiredRoom": r => <TextRow text={`指定房间: ${translateWord(r!)}`} />,
    "RequiredTrait": r => <TextRow text={`当前拥有祝福: ${translateWord(r!)}`} />,
    "RequiredWeapon": r => <TextRow text={`当前装备武器: ${translateWord(r!)}`} />,
    "RequiredGodLoot": r => <TextRow text={`当前拥有 ${translateWord(r!)} 的祝福`} />,
    "RequiredMaxHealthFraction": r => <TextRow text={`当前血量不超过 ${r!*100} %`} />,
    "ChanceToPlay": r => <TextRow text={`播放几率: ${r!*100} %`} />,
    "RequiredMaxLastStands": r => <TextRow text={`当前剩余起死回生数不超过 ${r}`} />,
    "HasTraitNameInRoom": r => <TextRow text={`当前房间出现祝福: ${translateWord(r!)}`} />,
    "RequiredUnitNotAlive": r => <TextRow text={ `当前不存在${translateWord(r!)}`} />,
    "RequiredRoomThisRun": r => <TextRow text={ `本次逃脱行动进入过${translateWord(r!)}房间 `} />,
    "RequiredRoomLastRun": r => <TextRow text={ `上次逃脱行动进入过${translateWord(r!)}房间 `} />,
   
    
    "RequiredMinActiveMetaUpgradeLevel": r => <TextRow text={`热度[${translateWord(r!.Name)}]至少为${r!.Count}级`} />,
    "ConsecutiveClearsOfRoom": r => <TextRow text={`连续通过房间[${translateWord(r!.Name)}] ${r!.Count} 次`} />,
    "ConsecutiveDeathsInRoom": r => <TextRow text={`连续 ${r!.Count} 次在房间[${translateWord(r!.Name)}]被击败`} />,
 
    
    //ULView string[] - no save
    "RequiredSupportAINames": r => <ULView header={`AI支持:`}  child={()=> r!.map(t => <TextLabel id={t}  />) } />,
    
    "AreIdsNotAlive": r => <ULView header={`以下ID对象不存在:`}  child={()=> r!.map(t => <TextLabel id={"" + t}  />) } />,
    "RequiredLastKilledByUnits": r => <ULView header={`上次击败你的敌人为以下单位之一`}  child={()=> r!.map(t => <TextLabel id={t}  />) } />,
    
   
    //TextRow
    "RequiredMinRunsCleared": r => <TextRow text={`至少通关 ${r} 次`} remarkFun={s=> `[已通关 ${s.getNumRunsCleared()} 次]`}/>,
    "RequiredMinCompletedRuns": r => <TextRow text={`至少进行 ${r} 次逃脱行动`} remarkFun={s=> `[逃脱行动次数: ${s.getCompletedRuns()}]`}/>,
     "RequiredMinUnlockedWeaponEnchantments": r => <TextRow  text={`至少解锁 ${r} 个武器形态`} remarkFun={s => `[已解锁 ${s.getNumUnlockedWeaponUpgrades()} 种]`}/>,
    "RequiredNumCosmeticsMin": r => <TextRow  text={`至少在承包商处购买 ${r} 项物品`} remarkFun={s => `[已购买 ${s.getGameStateDictLength("CosmeticsAdded")} 项]`}/>,
    "RequiredCodexEntriesMin": r => <TextRow  text={`至少在手稿种解锁 ${r} 个条目`} remarkFun={s => `[已解锁 ${s.calcNumCodexEntriesUnlocked()} 项]`}/>,
   
    //TextLines
    "RequiredTextLines": r => <TextLineList  header="需要达成以下所有对话" textLines={r!} />,
    "RequiredAnyTextLines": r => <TextLineList header="需要达成以下任一对话" textLines={r!} />,
    "RequiredFalseTextLines": r => <TextLineList header="需要没有发生以下对话" textLines={r!} />,
    "RequiredFalseTextLinesThisRun": r => <TextLineList header="本次逃脱行动没有发生以下对话" textLines={r!} />,
    "RequiredFalseTextLinesLastRun": r => <TextLineList header="上次逃脱行动没有发生以下对话" textLines={r!} />,
    "RequiredMinAnyTextLines": r => <TextLineList header={`需要达成以下对话中的 ${r!.Count} 项`} textLines={r!.TextLines} />,
    "MinRunsSinceAnyTextLines": r => <TextLineList header={`距离下列对话至少 ${r!.Count} 次逃脱行动`} textLines={r!.TextLines} />,
    "MaxRunsSinceAnyTextLines": r => <TextLineList header={`距离下列对话最多 ${r!.Count} 次逃脱行动`} textLines={r!.TextLines} />,
    
    //ConditionalItem
    "RequiredCosmetics": r => <ULView header={`在承包商处购买以下项目`}  child={()=> r!.map(t => <ConditionalItemLabel id={t}/>) } />,
    
 
    //ULView string[] - boolean
    "RequiredAnyTraitsTaken": r => <ULView header={`曾经取得以下任一祝福`}  child={()=> r!.map(t =>  <TextLabel id={t} mark={s => s.getGameStateValue<boolean>("TraitsTaken",t) ? " [已取得] " : ""} />) } />,
    "RequiredTraitsTaken": r => <ULView header={`曾经取得以下所有祝福`}  child={()=> r!.map(t =>  <TextLabel id={t} mark={s => s.getGameStateValue<boolean>("TraitsTaken",t) ? " [已取得] " : ""} />) } />,
    "RequiredWeaponsUnlocked": r => <ULView header={`解锁以下所有武器`}  child={()=> r!.map(t => <TextLabel id={t} mark={s => s.getGameStateValue<boolean>("WeaponsUnlocked",t) ? " [已解锁] " : ""} />) } />,
    "RequiredPlayed": r => <ULView header={`已播完以下所有语音`}  child={()=> r!.map(t => <TextLabel id={t} mark={ s =>s.getSaveDataValue<boolean>("SpeechRecord",t) ? " [已播放] " : ""} />) } />,
    "RequiredTrueFlags": r => <ULView header={`下列标志位为真`}  child={()=> r!.map(t => <TextLabel id={t} mark={ s =>s.getGameStateValue<boolean>("Flags",t) ? " [真] " : ""} />) } />,
    "RequiredFalseFlags": r => <ULView header={`下列标志位为假`}  child={()=> r!.map(t => <TextLabel id={t} mark={ s =>s.getGameStateValue<boolean>("Flags",t) === false ? " [假] " : ""} />) } />,
    
    
    
    //ULView string[] - number
    "RequiredClearsWithWeapons": r => <ULView header={`至少使用以下武器通关一次`}  child={()=> r!.Names.map(t => <TextLabel id={t} mark={ s =>et(s.getGameStateValue<number>("TimesClearedWeapon",t),v=>` [${v}次] `)} />) } />,
    "RequiredClearedWithMetaUpgrades": r => <ULView header={`使用以下镜子/热度升级至少通关一次`}  child={()=> r!.map(t => <TextLabel id={t} mark={ s =>et(s.getGameStateValue<number>("ClearedWithMetaUpgrades",t),v => ` [已通关] `)} />) } />,
    "RequiredSeenRooms": r => <ULView header={`曾到达以下房间`}  child={()=> r!.map(t => <TextLabel id={t} mark={ s =>et(s.getGameStateValue<number>("RoomCountCache",t),v => ` [${v}次] `)} />) } />,
   
    
    //ULView Dict<number> - number
    "RequiredEliteAttributeKills": r => <ULView header={`击败下列所有精英敌人指定次数`}  child={()=> Dict2Array(r!).map(t => <TextLabel id={"EliteAttribute_" + t.key} attachDescription={` ${t.value}次`} mark={ s=> et(s.getGameStateValue<number>("EnemyEliteAttributeKills",t.key),(v)=>` [已击败 ${v} 次]`) } />) } />,
    "RequiredKills": r => <ULView header={`击败下列所有敌人指定次数`}  child={()=> Dict2Array(r!).map(t => <TextLabel id={t.key} attachDescription={` ${t.value}次`} mark={ s=> et(s.getGameStateValue<number>("EnemyKills",t.key),(v)=>` [已击败 ${v} 次]`) } />) } />,
    "RequiredMinNPCInteractions": r => <ULView header={`至少需要与指定NPC交互次数`}  child={()=> Dict2Array(r!).map(t => <TextLabel linkPrefix='/Gifts/' id={t.key} attachDescription={` ${t.value} `} mark={ s =>  et(s.getGameStateValue<number>("NPCInteractions",t.key),(v)=>` [当前交互次数: ${v} ]`) } />) } />,
    "RequiredMinItemInteractions": r => <ULView header={`至少需要与指定物品交互次数`}  child={()=> Dict2Array(r!).map(t => <TextLabel  id={t.key} attachDescription={` ${t.value} `} mark={ s =>  et(s.getGameStateValue<number>("ItemInteractions",t.key),(v)=>` [当前交互次数: ${v} ]`) } />) } />,
   
  
    
    //   "RequiredSeenRooms": 
}

const requestOrder : (keyof GameStateEligible)[] =[];
for(let k in gameStateEligibleHalders){
    requestOrder.push(k as keyof GameStateEligible);
}

// const requestOrder: (keyof GameStateEligible)[] =[
//     "RequiredMinRunsCleared",
//     "RequiredTextLines",
//     "RequiredAnyTextLines",
//     "RequiredMinAnyTextLines",
//     "RequiredMinNPCInteractions",
//     "RequiredAnyTraitsTaken",
//     "RequiredTraitsTaken",
//     "RequiredWeaponsUnlocked",
//     "RequiredPlayed",
//     "RequiredClearsWithWeapons",
//     "RequiredMinUnlockedWeaponEnchantments",
//     "RequiredTrueFlags",
//     "RequiredClearedWithMetaUpgrades",
// ] 



export default function GameStateEligibleView(prop: GameStateEligible) {

    const renderList: JSX.Element[] = [];
    let requiresCount = Object.keys(prop).length;
    if(requiresCount === 0){
        return <div>无</div>
    }
    requestOrder.forEach(key => {
        const requires = prop[key];
        const handler = gameStateEligibleHalders[key]
        if(requires && handler){         
            renderList.push(<li key={key}>{(handler as any)(requires)}</li>);
        }
    });

    return <ul>
        {renderList}
    </ul>

}



