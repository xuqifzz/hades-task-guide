import { Dict,KeysByValueType } from './utils'

type RunHistory ={
    Cleared ?: boolean
}

type QuestStatusValue = "CashedOut" | "Unlocked" | "Locked"
type GameState = {
    RunHistory: RunHistory[],
    QuestStatus: Dict<QuestStatusValue>,
    Flags: Dict<boolean>,
    Gift: Dict<{Value:number}>,
    WeaponUnlocks : Dict<number[]>,
    WeaponsUnlocked: Dict<boolean>,
    NPCInteractions:Dict<number>,
    TraitsTaken:Dict<boolean>,
    TimesClearedWeapon:Dict<number>,
    ClearedWithMetaUpgrades:Dict<number>,
}

type GameStateDictValue<T> = KeysByValueType<GameState,Dict<T>>


type SaveDataType ={
    TextLinesRecord:Dict<boolean>,
    CurrentRun:any,
    GameState:GameState,
    SpeechRecord:Dict<boolean>,

}
type SaveDataDictValue<T> = KeysByValueType<SaveDataType,Dict<T>>

export default class SaveData{

    private saveData:SaveDataType;

    constructor( saveData:unknown) { 
        this.saveData = saveData as SaveDataType;
    }

    checkTextLineComplete(id:string){
        return this.saveData.TextLinesRecord[id]
    }

    getNumRunsCleared() {
        let runsCleared = 0
        if ( this.saveData.CurrentRun.Cleared)
            runsCleared = runsCleared + 1;
            this.saveData.GameState.RunHistory.forEach((run: any) => {
            if (run.Cleared)
                runsCleared = runsCleared + 1
        })
        return runsCleared
    }

    getQuestStatus(id:string) : QuestStatusValue {
        return this.saveData.GameState.QuestStatus[id] || "Locked"
    }

    getGiftValue(id:string):number{
        return this.saveData.GameState.Gift[id]?.Value || 0;
    }

    
    getWeaponLevel4Unlocks(id:string):number{
        const w = this.saveData.GameState.WeaponUnlocks[id];
        if(w){
            return w[3] || 0;
        }
        return 0;
    }

    getNumUnlockedWeaponUpgrades():number{
        let count = 0;
        for (let k in this.saveData.GameState.WeaponUnlocks){
            let w = this.saveData.GameState.WeaponUnlocks[k];
            for(let i=1;i<w.length;i++){
                if(w[i]>0) count++;
            }
        }
        return count;      
    }


   getGameStateValue<T extends number | boolean>(filedName:GameStateDictValue<T>,id:string){
        const t =  this.saveData.GameState[filedName] as Dict<T>;
        return t[id] ;
   }
   getSaveDataValue<T extends number | boolean>(filedName:SaveDataDictValue<T>,id:string){
    const t =  this.saveData[filedName] as Dict<T>;
    return t[id] ;
}

    
}