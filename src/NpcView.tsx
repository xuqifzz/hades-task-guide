import React from 'react'
import { useParams } from 'react-router-dom'
import { translateWord, getQuest,HelpTextDict, getNpc} from './data/GameData'
import JsonView from './JsonView';
import GameStateEligibleView from './GameStateEligibleView';
import { NpcLable, TextLineLabel } from './ViewComponents';



export default function NpcView() {
    
    const param = useParams<string>();
    const { id } = param;
    if(id === undefined){
        return <div>空</div>
    }

    let npc = getNpc(id);
    if(npc === undefined){
        return <div>空</div>
    }

    return <div>
        <h2>NPC: <NpcLable id={id} noLink showId /></h2>
        {npc.CanReceiveGift ? "可收礼" : undefined }
        <div>
            <h3>激活条件</h3>
            <GameStateEligibleView {...npc.ActivateRequirements} />
        </div>
        <div>
            <h3>对话清单</h3>        
             <ul>
                {npc.associateTextLines.map(t =>  <li key={t}><TextLineLabel  id={t} /> </li>)}
            </ul>
        </div>
        <h3>代码定义</h3>
        <JsonView target={npc} />
    </div>
 
}


