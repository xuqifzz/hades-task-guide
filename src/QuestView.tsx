import React from 'react'
import { useParams } from 'react-router-dom'
import { translateWord, getQuest,HelpTextDict} from './data/GameData'
import JsonView from './JsonView';
import GameStateEligibleView from './GameStateEligibleView';
import { QuestLable } from './ViewComponents';



export default function QuestView() {
    
    const param = useParams<string>();
    const { id } = param;
    if(id === undefined){
        return <div>空</div>
    }

    let quest = getQuest(id);
    if(quest === undefined){
        return <div>空</div>
    }

    const textItem = HelpTextDict[id];

    
    return <div>
        <h2>命运清单: <QuestLable id={id} noLink showId /></h2>
        <div>{textItem.Description}</div>
        <div>奖励: {translateWord(quest.RewardResourceName)} x {quest.RewardResourceAmount}</div>
        <div>
            <h3>解锁条件</h3>
            <GameStateEligibleView {...quest.UnlockGameStateRequirements} />
        </div>
        <div>
            <h3>完成条件</h3>
            <GameStateEligibleView {...quest.CompleteGameStateRequirements} />
        </div>
        <h3>代码定义</h3>
        <JsonView target={quest} />

    </div>
 
}


