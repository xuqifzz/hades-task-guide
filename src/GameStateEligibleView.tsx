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
    "RequiresLastRunNotCleared": r => <TextRow text={`上次逃脱行动失败`} />,
    "MinRunsSinceSquelchedHermes": r => <TextRow text={`距离叫赫尔墨斯闭嘴至少 ${r} 次逃脱行动`} />,
    "MaxRunsSinceSquelchedHermes": r => <TextRow text={`距离叫赫尔墨斯闭嘴不超过 ${r} 次逃脱行动`} />,
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
    "RequiredInactiveMetaUpgrade": r => <TextRow text={ `当前没有激活 ${translateWord(r!)} `} />,
    "IsIdAlive": r => <TextRow text={ `Id为 ${r} 的生物存活 `} />,
    "RequiredMaxSupportAINames": r => <TextRow text={ `当前帮手数量不超过${r} `} />,
    "RequiredActiveShrinePointsMin": r => <TextRow text={ `当前热度点数至少为${r} `} />,
    "RequiredLootChoices": r => <TextRow text={ `祝福选择面板选项数为${r} `} />,
    "RequiredAccumulatedMetaPoints": r => <TextRow text={ `积累的黑暗宝石数超过${r} `} />,
    "RequiredActiveMetaPointsMin": r => <TextRow text={ `投入在圣镜上的黑暗宝石数超过${r} `} />,
    "RequiredBiome": r => <TextRow text={ `当前区域为${translateWord(r!)} `} />,
    "RequiredDeathRoom": r => <TextRow text={ `本次逃脱行动在房间 ${translateWord(r!)} 被干掉`} />,
    "RequiredFalseSeenRoomThisRun": r => <TextRow text={ `本次逃脱未曾进入房间 ${translateWord(r!)}`} />,
    "RequiredCosmeticItemVisible": r => <TextRow  text={`装饰品 ${translateWord(r!)} 可见`}/>,
    "RequiredUnitAlive": r => <TextRow  text={`当前存在单位: ${translateWord(r!)} `}/>,
    "RequiredFalseGodLoot": r => <TextRow  text={`本次逃脱行动尚未拾取${translateWord(r!)}的祝福 `}/>,
    "RequiredLastInteractedWeaponUpgrade": r => <TextRow  text={`最后交互的武器升级为${translateWord(r!)} `}/>,
    "RequiredBossPhase": r => <TextRow  text={`Boss当前阶段: ${r} `}/>,
    "RequiredLootThisRun": r => <TextRow  text={`本次逃脱行动曾拾取 ${translateWord(r!)} 的祝福`}/>,
    "RequiredKeepsake": r => <TextRow  text={`携带信物: ${translateWord(r!)}`}/>,
   
   
   
    
    "RequiredMinActiveMetaUpgradeLevel": r => <TextRow text={`热度[${translateWord(r!.Name)}]至少为${r!.Count}级`} />,
    "RequiredMaxActiveMetaUpgradeLevel": r => <TextRow text={`热度[${translateWord(r!.Name)}]最多为${r!.Count}级`} />,
    "ConsecutiveClearsOfRoom": r => <TextRow text={`连续通过房间[${translateWord(r!.Name)}] ${r!.Count} 次`} />,
    "ConsecutiveDeathsInRoom": r => <TextRow text={`连续 ${r!.Count} 次在房间[${translateWord(r!.Name)}]被击败`} />,
 

     //ULView string[] - no save
    "RequiredSupportAINames": r => <ULView header={`当前存在下列帮手:`}  child={()=> r!.map(t => <TextLabel id={t}  />) } />,
    "RequiredFalseSupportAINames": r => <ULView header={`当前不存在下列帮手:`}  child={()=> r!.map(t => <TextLabel id={t}  />) } />,
    "RequiredKillsThisRun": r => <ULView header={`本次逃脱行动曾击败下列敌人:`}  child={()=> r!.map(t => <TextLabel id={t}  />) } />,
    "RequiredKillsLastRun": r => <ULView header={`上次逃脱行动曾击败下列敌人:`}  child={()=> r!.map(t => <TextLabel id={t}  />) } />,
    "AreIdsNotAlive": r => <ULView header={`以下ID对象不存在:`}  child={()=> r!.map(t => <TextLabel id={"" + t}  />) } />,
    "AreIdsAlive": r => <ULView header={`以下ID对象仍然存活:`}  child={()=> r!.map(t => <TextLabel id={"" + t}  />) } />,
    "RequiredLastKilledByUnits": r => <ULView header={`上次击败你的敌人为以下单位之一`}  child={()=> r!.map(t => <TextLabel id={t}  />) } />,
    "RequiredFalseTraits": r => <ULView header={`目前没有下列祝福`}  child={()=> r!.map(t => <TextLabel id={t}  />) } />,
    "RequiredFalseGodLoots": r => <ULView header={`本次逃脱行动尚未拾取下列神明的祝福`}  child={()=> r!.map(t => <TextLabel id={t}  />) } />,
    "RequiredOneOfTraits": r => <ULView header={`当前拥有以下任一祝福`}  child={()=> r!.map(t => <TextLabel id={t}  />) } />,
    "RequiredFalseSeenRooms": r => <ULView header={`本次逃脱行动未曾进入下列房间`}  child={()=> r!.map(t => <TextLabel id={t}  />) } />,
    "RequiredFalseRooms": r => <ULView header={`当前不在下列房间`}  child={()=> r!.map(t => <TextLabel id={t}  />) } />,
    "RequiredAnyEncountersThisRun": r => <ULView header={`本次逃脱行动曾经历以下任一遭遇`}  child={()=> r!.map(t => <TextLabel id={t}  />) } />,
    
   
    //TextRow
    "RequiredMinRunsCleared": r => <TextRow text={`至少通关 ${r} 次`} remarkFun={s=> `[已通关 ${s.getNumRunsCleared()} 次]`}/>,
    "RequiredMaxRunsCleared": r => <TextRow text={`最多通关 ${r} 次`} remarkFun={s=> `[已通关 ${s.getNumRunsCleared()} 次]`}/>,
    "RequiredRunsCleared": r => <TextRow text={`通关次数刚好为 ${r} 次`} remarkFun={s=> `[已通关 ${s.getNumRunsCleared()} 次]`}/>,
    "RequiredMinCompletedRuns": r => <TextRow text={`至少进行 ${r} 次逃脱行动`} remarkFun={s=> `[逃脱行动次数: ${s.getCompletedRuns()}]`}/>,
    "RequiredMaxCompletedRuns": r => <TextRow text={`最多进行 ${r} 次逃脱行动`} remarkFun={s=> `[逃脱行动次数: ${s.getCompletedRuns()}]`}/>,
    "RequiredMinUnlockedWeaponEnchantments": r => <TextRow  text={`至少解锁 ${r} 个武器形态`} remarkFun={s => `[已解锁 ${s.getNumUnlockedWeaponUpgrades()} 种]`}/>,
    "RequiredNumCosmeticsMin": r => <TextRow  text={`至少在承包商处购买 ${r} 项物品`} remarkFun={s => `[已购买 ${s.getGameStateDictLength("CosmeticsAdded")} 项]`}/>,
    "RequiredCodexEntriesMin": r => <TextRow  text={`至少在手稿种解锁 ${r} 个条目`} remarkFun={s => `[已解锁 ${s.calcNumCodexEntriesUnlocked()} 项]`}/>,
   
    //TextLines
    "RequiredTextLines": r => <TextLineList  header="需要达成以下所有对话" textLines={r!} />,
    "RequiredAnyTextLines": r => <TextLineList header="需要达成以下任一对话" textLines={r!} />,
    "RequiredAnyOtherTextLines": r => <TextLineList header="需要达成以下任一对话" textLines={r!} />,
    "RequiredFalseTextLines": r => <TextLineList header="需要没有发生以下对话" textLines={r!} />,
    "RequiredFalseTextLinesThisRun": r => <TextLineList header="本次逃脱行动没有发生以下对话" textLines={r!} />,
    "RequiredFalseTextLinesLastRun": r => <TextLineList header="上次逃脱行动没有发生以下对话" textLines={r!} />,
    "RequiredMinAnyTextLines": r => <TextLineList header={`需要达成以下对话中的 ${r!.Count} 项`} textLines={r!.TextLines} />,
    "MinRunsSinceAnyTextLines": r => <TextLineList header={`距离下列对话至少 ${r!.Count} 次逃脱行动`} textLines={r!.TextLines} />,
    "MaxRunsSinceAnyTextLines": r => <TextLineList header={`距离下列对话最多 ${r!.Count} 次逃脱行动`} textLines={r!.TextLines} />,
    "RequiredMaxAnyTextLines": r => <TextLineList header={`最多触发下列对话中的 ${r!.Count} 项`} textLines={r!.TextLines} />,
    
    "RequiredTextLinesThisRun": r => <span>本次逃脱行动触发对话: <TextLineLabel id={r!} /></span>,
    
    //ConditionalItem
    "RequiredCosmetics": r => <ULView header={`在承包商处购买以下项目`}  child={()=> r!.map(t => <ConditionalItemLabel id={t}/>) } />,
    "RequiredFalseCosmetics": r => <ULView header={`尚未在承包商处购买以下项目`}  child={()=> r!.map(t => <ConditionalItemLabel id={t}/>) } />,
    "RequiredMinAnyCosmetics": r => <ULView header={`在承包商处购买下列项目中的 ${r?.Count} 项`}  child={()=> r!.Cosmetics.map(t => <ConditionalItemLabel id={t}/>) } />,
    "RequiredAnyCosmetics": r => <ULView header={`在承包商处购买下列项目中的任意一项`}  child={()=> r!.map(t => <ConditionalItemLabel id={t}/>) } />,
    
 
    //ULView string[] - boolean
    "RequiredAnyTraitsTaken": r => <ULView header={`曾经取得以下任一祝福`}  child={()=> r!.map(t =>  <TextLabel id={t} mark={s => s.getGameStateValue<boolean>("TraitsTaken",t) ? " [已取得] " : ""} />) } />,
    "RequiredTraitsTaken": r => <ULView header={`曾经取得以下所有祝福`}  child={()=> r!.map(t =>  <TextLabel id={t} mark={s => s.getGameStateValue<boolean>("TraitsTaken",t) ? " [已取得] " : ""} />) } />,
    "RequiredWeaponsUnlocked": r => <ULView header={`解锁以下所有武器`}  child={()=> r!.map(t => <TextLabel id={t} mark={s => s.getGameStateValue<boolean>("WeaponsUnlocked",t) ? " [已解锁] " : ""} />) } />,
    "RequiredPlayed": r => <ULView header={`已播完以下所有语音`}  child={()=> r!.map(t => <TextLabel id={t} mark={ s =>s.getSaveDataValue<boolean>("SpeechRecord",t) ? " [已播放] " : ""} />) } />,
    "RequiredFalsePlayed": r => <ULView header={`尚未播放以下任一语音`}  child={()=> r!.map(t => <TextLabel id={t} mark={ s =>s.getSaveDataValue<boolean>("SpeechRecord",t) ? " [已播放] " : ""} />) } />,
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
    "RequiredLifetimeResourcesSpentMin": r => <ULView header={`需要消费以下数量的资源`}  child={()=> Dict2Array(r!).map(t => <TextLabel  id={t.key} attachDescription={` x ${t.value} `} mark={ s =>  et(s.getGameStateValue<number>("LifetimeResourcesSpent",t.key),(v)=>` [当前消费数量: ${v} ]`) } />) } />,
    "RequiredMinTimesSeenRoom": r => <ULView header={`需要到达房间至少指定次数`}  child={()=> Dict2Array(r!).map(t => <TextLabel  id={t.key} attachDescription={`  ${t.value} 次`} mark={ s =>  et(s.getGameStateValue<number>("RoomCountCache",t.key),(v)=>` [已到达: ${v} 次]`) } />) } />,
    
    "RequiredFalseValues": r => <ULView header={`下列条件不成立`}  child={()=> Dict2Array(r!).map(t => <TextLabel  id={t.key} attachDescription={` = ${translateWord(t.value)} `}  />) } />,
   
  
    
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
        if(requires !== undefined && requires != null && handler){         
            renderList.push(<li key={key}>{(handler as any)(requires)}</li>);
        }
    });

    return <ul>
        {renderList}
    </ul>

}



