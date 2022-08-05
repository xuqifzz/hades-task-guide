import React from 'react'
import { GameStateEligible } from './data/GameData'
import { TextLineLabel,TextRow, TraitHasTakenLabel, WeaponsUnlokedLabel,TextLabel } from './ViewComponents'
import {Dict,Dict2Array,dictLength} from './data/utils'

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
    //TextRow
    "RequiredMinRunsCleared": r => <TextRow text={`至少通关 ${r} 次`} remarkFun={s=> `[已通关 ${s.getNumRunsCleared()} 次]`}/>,
    "RequiredMinUnlockedWeaponEnchantments": r => <TextRow  text={`至少解锁 ${r} 个武器形态`} remarkFun={s => `[已解锁 ${s.getNumUnlockedWeaponUpgrades()} 种]`}/>,
    "RequiredNumCosmeticsMin": r => <TextRow  text={`至少在承包商处购买 ${r} 项物品`} remarkFun={s => `[已购买 ${s.getGameStateDictLength("CosmeticsAdded")} 项]`}/>,
    "RequiredCodexEntriesMin": r => <TextRow  text={`至少在手稿种解锁 ${r} 个条目`} remarkFun={s => `[已解锁 ${s.calcNumCodexEntriesUnlocked()} 项]`}/>,
   
    //TextLines
    "RequiredTextLines": r => <TextLineList  header="需要达成以下所有对话" textLines={r!} />,
    "RequiredAnyTextLines": r => <TextLineList header="需要达成以下所有对话" textLines={r!} />,
    "RequiredMinAnyTextLines": r => <TextLineList header={`需要达成以下对话中的 ${r!.Count} 项`} textLines={r!.TextLines} />,
    
 
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

function getGameStateEligibleKeyCount(p:GameStateEligible){
    let count = 0;
    for(let k in p) count++;
    return count;
}

export default function GameStateEligibleView(prop: GameStateEligible) {

    const renderList: JSX.Element[] = [];
    let requiresCount = getGameStateEligibleKeyCount(prop);
    if(requiresCount == 0){
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



