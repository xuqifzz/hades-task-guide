import React from 'react'
import { GameStateEligible } from './data/GameData'
import { TextLineLable,TextRow,NpcInteractionLabel, TraitHasTakenLabel, WeaponsUnlokedLabel,TextLable } from './ViewComponents'
import {Dict,Dict2Array} from './data/utils'

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
            {prop.textLines.map(t =>  <li key={t}><TextLineLable id={t} /> </li>)}
        </ul>
    </>
}

function NPCInteractions(prop: { header: string, interactions: Dict<number> }) {
    return <>
    {prop.header}
    <ul>
        {
            Dict2Array(prop.interactions).map(t=> <li key={t.key}>
                <NpcInteractionLabel id={t.key} times={t.value} />
            </li> )
        }
    </ul>
</> 
}


type RequireHandler<T extends keyof GameStateEligible> = (requires: GameStateEligible[T]) => JSX.Element

type GameStateEligibleHalders = {
    [P in keyof GameStateEligible]: RequireHandler<P>
}


const gameStateEligibleHalders: GameStateEligibleHalders = {
    "RequiredMinRunsCleared": (requires) => <TextRow text={`至少通关 ${requires} 次`} remarkFun={(saveData)=> `[已通关 ${saveData.getNumRunsCleared()} 次]`}/>,
    "RequiredMinUnlockedWeaponEnchantments": (requires) => <TextRow  text={`至少解锁 ${requires} 个武器形态`} remarkFun={(saveData)=> `[已解锁 ${saveData.getNumUnlockedWeaponUpgrades()} 种]`}/>,
    "RequiredTextLines": requires => <TextLineList  header="需要达成以下所有对话" textLines={requires!} />,
    "RequiredAnyTextLines": requires => <TextLineList header="需要达成以下所有对话" textLines={requires!} />,
    "RequiredMinAnyTextLines": requires => <TextLineList header={`需要达成以下对话中的 ${requires!.Count} 项`} textLines={requires!.TextLines} />,
    "RequiredMinNPCInteractions": requires => <NPCInteractions header={`至少需要与指定NPC交互次数`} interactions={requires!} />,
    "RequiredAnyTraitsTaken": (requires) => <ULView header={`曾经取得以下任一祝福`}  child={()=> requires!.map(t => <TraitHasTakenLabel id={t} />) } />,
    "RequiredTraitsTaken": (requires) => <ULView header={`曾经取得以下所有祝福`}  child={()=> requires!.map(t => <TraitHasTakenLabel id={t} />) } />,
    "RequiredWeaponsUnlocked": (requires) => <ULView header={`解锁以下所有武器`}  child={()=> requires!.map(t => <TextLable id={t} mark={(saveData)=>saveData.getGameStateValue<boolean>("WeaponsUnlocked",t) ? " [已解锁] " : ""} />) } />,
    "RequiredClearsWithWeapons": (requires) => <ULView header={`至少使用以下武器通关一次`}  child={()=> requires!.Names.map(t => <TextLable id={t} mark={(saveData)=>{const times = saveData.getGameStateValue<number>("TimesClearedWeapon",t); return times > 0 ? ` [${times}次] ` : ""}} />) } />,
    "RequiredClearedWithMetaUpgrades": (requires) => <ULView header={`使用以下热度升级至少通关一次`}  child={()=> requires!.map(t => <TextLable id={t} mark={(saveData)=>{const times = saveData.getGameStateValue<number>("ClearedWithMetaUpgrades",t); return times > 0 ? ` [${times}次] ` : ""}} />) } />,
    "RequiredPlayed": (requires) => <ULView header={`已播完以下所有语音`}  child={()=> requires!.map(t => <TextLable id={t} mark={(saveData)=>saveData.getSaveDataValue<boolean>("SpeechRecord",t) ? " [已播放] " : ""} />) } />,
    "RequiredTrueFlags": (requires) => <ULView header={`下列标志位为真`}  child={()=> requires!.map(t => <TextLable id={t} mark={(saveData)=>saveData.getGameStateValue<boolean>("Flags",t) ? " [真] " : ""} />) } />,
   
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



