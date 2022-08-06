import TextLineDict from './TextLineDict.json'
import CueTextDict from './CueTextDict.json'
import HelpTextFullList from './HelpTextFullList.json'
import QuestOrderData from './QuestOrderData.json'
import QuestData from './QuestData.json'
import GiftData from './GiftData.json'
import ConditionalItemData from './ConditionalItemData.json'
import { Dict, Array2Dict, removeFormatSymbol } from './utils';

export { QuestOrderData }

// HelpText
interface HelpText {
    Id: string;
    DisplayName: string,
    Description?: string
}

const HelpTextDict = Array2Dict(HelpTextFullList as HelpText[], "Id");
for (let entry of HelpTextFullList) {
    let Id = entry.Id;
    let npcName;

    if (Id.startsWith("NPC_") && Id.endsWith("_01")) {
        npcName = Id.substring(4, Id.length - 3);
    }
    if (Id.startsWith("Outro_")) {
        npcName = Id.substring(6);
    }

    if (npcName && !HelpTextDict[npcName]) {
        HelpTextDict[npcName] = entry as HelpText
    }
}

const ResourceOrderData = [
    "GiftPoints",
    "MetaPoints",
    "Gems",
    "LockKeys",
    "SuperLockKeys",
    "SuperGems",
    "SuperGiftPoints",
]


ResourceOrderData.forEach(r => {
    if (!HelpTextDict[r]) {
        const r2 = r.substring(0, r.length - 1);
        HelpTextDict[r] = HelpTextDict[r2]
    }
})
const mirrorKeyWords = [
    "MoveSpeed",
	"HealthDrop",
	"RareBoonChance",
	"EpicBoonChance",
	"Reroll",
	"DashCharges",
	"DashAttack",
	"EffectVulnerability",
	"AmmoVulnerability",
	"ExtraChance",
	"ExtraChanceAlt",
	"ExtraChanceChaos",
	"Rally",
	"AmmoSupply",
	"SneakAttack",
	"StartingHealth",
	"StartingMoney",
	"HealthEncounterEndRegen",
	"DoorHeal",
	
	"AlphaAttack",
	"DarknessHeal",
	"ExtraChanceWrath",
	"ExtraChanceReplenish",
	"PerfectDash",
	"UnstoredAmmoVulnerability",
	"AmmoReload",
	"InterestMoney",
	"HighHealthDamage",
	"GodEnhancement",
	"DuoRarityBoonChance",
	"RunRewardBonusChance",
	"StoredAmmoSlow",
	"HeroicBoonChance",
	"RerollPanel"
]
const shrineKeyWords=[
    "DarknessCap",
	"HealingReduction",
	"HealingReduction_Total",
	"EnemyHealth",
	"EnemyDamage",
	"TrapDamage",
	"NoInvulnerability",
	"EnemySpeed",
	"EnemyShield",
	"EnemyCount",
	"EnemyElite",
	"MinibossCount",
	"ReducedLootChoices",
	"ShopPrices",
	"ForceSell",
	"BossDifficulty",
	"HardEncounter",
	"BiomeSpeed",
	"LockedChoice",
	"Thermometer"
]
shrineKeyWords.forEach(k=>{
    if(HelpTextDict[k] ){
        HelpTextDict[k+"ShrineUpgrade"] = HelpTextDict[k]
    }
})
mirrorKeyWords.forEach(k=>{
    if(HelpTextDict[k] ){
        HelpTextDict[k+"MetaUpgrade"] = HelpTextDict[k]
    }
})
HelpTextDict["MetaUpgradeStrikeThroughShrineUpgrade"] = HelpTextDict["DarknessCap"]

export function translateWord(word: string): string {
    let result = (HelpTextDict[word] && HelpTextDict[word].DisplayName) || word;
    return removeFormatSymbol(result);

}
export { HelpTextDict }


//GameStateEligible
export interface GameStateEligible {
    RequiredMinRunsCleared?: number,
    RequiredTextLines?: string[],
    RequiredAnyTextLines?: string[],
    RequiredMinAnyTextLines?: { Count: number, TextLines: string[] },
    RequiredWeaponsUnlocked?: string[],
    RequiredTraitsTaken?: string[],
    RequiredAnyTraitsTaken ?: string[],
    RequiredMinNPCInteractions ?: Dict<number>
    RequiredPlayed ?: string[],
    RequiredClearsWithWeapons ?:{Names:string[]}
    RequiredMinUnlockedWeaponEnchantments ?: number,
    RequiredTrueFlags ?: string[],
    RequiredFalseFlags ? : string[],
    RequiredClearedWithMetaUpgrades ?: string[],
    RequiredEliteAttributeKills ?: Dict<number>,
    RequiredSeenRooms ?: string[],
    RequiredKills ?: Dict<number>,
    RequiredNumCosmeticsMin ?: number,
    RequiredCodexEntriesMin ?: number,
    RequiredMinItemInteractions ?: Dict<number>,
    RequiredFalseTextLinesThisRun ?: string[],
    RequiredCosmetics ?: string[],
 
}


//TextLineDict
interface Choice {
    ChoiceText: string
}

interface Cue {
    Cue?: string;
    Choices?: Choice[];
}

export type CueText = {
    Id: string,
    Speaker: string,
    DisplayName: string,
    SpeakerDisplayName: string
};

interface TextLineExtra {
    Name: string;
    cues: Cue[];
}

type TextLine = TextLineExtra & GameStateEligible
const textLineDict = TextLineDict as unknown as Dict<TextLine>;


//CueTextDict
const choiceDict: Dict<string> = {}

export interface ChoiceInfo {
    text: string,
    id: string,
    fullId: string,
}

for (let k in textLineDict) {
    const textLine = textLineDict[k];
    textLine.cues.forEach(cue => {
        if (cue.Choices) {
            cue.Choices.forEach(choices => {
                choiceDict[k + choices.ChoiceText] = k;
            })
        }
    })
}

export function getTextLine(id: string) {
    id = choiceDict[id] || id;
    return textLineDict[id];
}
const cueTextDict = CueTextDict as unknown as Dict<CueText>;

for (let k in cueTextDict) {
    let cueText = cueTextDict[k];
    cueText.SpeakerDisplayName = translateWord(cueText.Speaker);
    cueText.DisplayName = translateWord(cueText.DisplayName);
}



export function getCueTextList(textLine: TextLine) {
    return textLine.cues
        .filter(c => c.Cue)
        .map(c => {
            let cueId = c.Cue!.substring(4);
            return cueTextDict[cueId];
        })
}

export function getChoiceInfo(textLine: TextLine): ChoiceInfo[] | undefined {
    const x = textLine.cues.filter(c => c.Choices);
    if (x.length > 0) {
        return x[0].Choices?.map(c => ({
            fullId: textLine.Name + c.ChoiceText,
            id: c.ChoiceText,
            text: translateWord(c.ChoiceText)
        }))
    }
    return undefined;
}


// QuestData

interface Quest {
    RewardResourceAmount: number,
    Name: string,
    RewardResourceName: string,
    UnlockGameStateRequirements: GameStateEligible,
    CompleteGameStateRequirements: GameStateEligible,

}
const questData = QuestData as unknown as Dict<Quest>;

export function getQuest(id: string) {
    return questData[id]
}


//GiftData

interface Gift {
    Name: string,
    Maximum: number,
    MaxedRequirement: GameStateEligible,
    UnlockGameStateRequirements: GameStateEligible,
    Locked: number
}

export const GiftOrderData: string[] = [
    'DionysusUpgrade', 
    'PoseidonUpgrade', 
    'ZeusUpgrade', 
    'DemeterUpgrade', 
    'ArtemisUpgrade', 
    'AphroditeUpgrade',
    'AresUpgrade',
    'AthenaUpgrade', 
    'HermesUpgrade',
    'TrialUpgrade',
    'NPC_Thanatos_01',  
    'NPC_Skelly_01', 
    'NPC_Dusa_01',   
    'NPC_Patroclus_01', 
    'NPC_Charon_01', 
    'NPC_Hypnos_01',   
    'NPC_Orpheus_01', 
    'NPC_Nyx_01', 
    'NPC_Cerberus_01', 
    'NPC_Eurydice_01', 
    'NPC_FurySister_01', 
    'NPC_Bouldy_01', 
    'NPC_Persephone_Home_01', 
    'NPC_Hades_01', 
    'NPC_Sisyphus_01',   
    'NPC_Achilles_01'
]


const giftData = GiftData as unknown as Dict<Gift>;

export function getGift(id: string) {
    return giftData[id]
}


//
export const WeaponOrderData:[string,string][] =[
    ["SwordWeapon","NyxRevealsArthurAspect01"],
    ["SpearWeapon","AchillesRevealsGuanYuAspect01"],
    ["BowWeapon","ArtemisRevealsRamaAspect01"],
    ["ShieldWeapon","ChaosRevealsBeowulfAspect01"],
    ["FistWeapon","MinotaurRevealsGilgameshAspect01"],
    ["GunWeapon","ZeusRevealsLuciferAspect01"]
]

//ConditionalItemData


interface ConditionalItem {
    GameStateRequirements: GameStateEligible,
    Name: string,
    ResourceName: string,
    ResourceCost: number
}
const conditionalItemData = ConditionalItemData as unknown as Dict<ConditionalItem>
export function getConditionalItem(id:string){
    return conditionalItemData[id];
}







