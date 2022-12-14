import { Dict, dictLength, KeysByValueType } from './utils'
import CodexOrigin from './Codex.json' 
import { choiceDict, textLineDict } from './GameData'

const Codex = CodexOrigin as Dict<{Entries:Dict<any>,UnlockType:string,TitleText:string}>
type RunHistory = {
    Cleared?: boolean
}

type QuestStatusValue = "CashedOut" | "Unlocked" | "Locked"
type GameState = {
    RunHistory: RunHistory[],
    QuestStatus: Dict<QuestStatusValue>,
    Flags: Dict<boolean>,
    Gift: Dict<{ Value: number }>,
    WeaponUnlocks: Dict<number[]>,
    WeaponsUnlocked: Dict<boolean>,
    NPCInteractions: Dict<number>,
    TraitsTaken: Dict<boolean>,
    TimesClearedWeapon: Dict<number>,
    ClearedWithMetaUpgrades: Dict<number>,
    EnemyEliteAttributeKills: Dict<number>,
    RoomCountCache: Dict<number>,
    EnemyKills: Dict<number>,
    CosmeticsAdded: Dict<number>,
    ItemInteractions:Dict<number>,
    Cosmetics:Dict<string>
    LifetimeResourcesSpent:Dict<number>,
    TotalRequiredEnemyKills:number,
}

type GameStateDictValue<T> = KeysByValueType<GameState, Dict<T>>


type SaveDataType = {
    TextLinesRecord: Dict<boolean>,
    CurrentRun: any,
    GameState: GameState,
    SpeechRecord: Dict<boolean>,
    CodexStatus: Dict<any>,

}
type SaveDataDictValue<T> = KeysByValueType<SaveDataType, Dict<T>>

export default class SaveData {

    private saveData: SaveDataType;

    constructor(saveData: unknown) {
        this.saveData = saveData as SaveDataType;
    
    }

    getNotCompleteTextLines(){
        let notCompleteTextLines = [];
        
        let t2:Dict<boolean> = {};
        console.log(this.saveData)
        for(let k in this.saveData.TextLinesRecord){
            let k2 = choiceDict[k] || k;
            t2[k2] = this.saveData.TextLinesRecord[k];
        }
        for(let k in textLineDict){
            if(! t2[k]){
                notCompleteTextLines.push(k)
            }
        }
        return notCompleteTextLines;
    }

    checkTextLineComplete(id: string) {
        return this.saveData.TextLinesRecord[id]
    }

    getNumRunsCleared() {
        let runsCleared = 0
        if (this.saveData.CurrentRun.Cleared)
            runsCleared = runsCleared + 1;
        this.saveData.GameState.RunHistory.forEach((run: any) => {
            if (run.Cleared)
                runsCleared = runsCleared + 1
        })
        return runsCleared
    }

    getCompletedRuns(){
	   return this.saveData.GameState.RunHistory.length;	
    }

    getQuestStatus(id: string): QuestStatusValue {
        return this.saveData.GameState.QuestStatus[id] || "Locked"
    }

    getGiftValue(id: string): number {
        return this.saveData.GameState.Gift[id]?.Value || 0;
    }


    getWeaponLevel4Unlocks(id: string): number {
        const w = this.saveData.GameState.WeaponUnlocks[id];
        if (w) {
            if(Array.isArray(w))
                return w[3] || 0;
            else
                return w[4] || 0;
        }
        return 0;
    }

    getNumUnlockedWeaponUpgrades(): number {
        let count = 0;
        for (let k in this.saveData.GameState.WeaponUnlocks) {
            let w = this.saveData.GameState.WeaponUnlocks[k];
            for (let i = 1; i < w.length; i++) {
                if (w[i] > 0) count++;
            }
        }
        return count;
    }


    getGameStateValue<T extends number | boolean | string>(filedName: GameStateDictValue<T>, id: string) {
        const t = this.saveData.GameState[filedName] as Dict<T>;
        return t[id];
    }
    getGameStateDictLength<T extends number | boolean | string>(filedName: GameStateDictValue<T>) {
        const t = this.saveData.GameState[filedName] as Dict<T>;
        return dictLength(t);
    }
    getSaveDataValue<T extends number | boolean | string>(filedName: SaveDataDictValue<T>, id: string) {
        const t = this.saveData[filedName] as Dict<T>;
        return t[id];
    }

    calcNumCodexEntriesUnlocked(){
	    let unlockCount = 0;
        const CodexStatus = this.saveData.CodexStatus;
        for (let chapterName in Codex){
            for(let entryName in Codex[chapterName].Entries){
                if (CodexStatus[chapterName]  && CodexStatus[chapterName][entryName] && CodexStatus[chapterName][entryName]["1"]  && CodexStatus[chapterName][entryName]["1"].Unlocked){
                    unlockCount = unlockCount + 1
                }
            }
        }
	    return unlockCount
    }

    getGameState(){
        return this.saveData.GameState;
    }


}