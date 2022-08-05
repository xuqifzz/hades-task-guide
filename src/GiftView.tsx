import React from 'react'
import { useParams } from 'react-router-dom'
import { translateWord, getGift,HelpTextDict} from './data/GameData'
import JsonView from './JsonView';
import GameStateEligibleView from './GameStateEligibleView';
import { GiftLable } from './ViewComponents';



export default function GiftView() {
    
    const param = useParams<string>();
    const { id } = param;
    if(id === undefined){
        return <div>空</div>
    }

    let gift = getGift(id);
    if(gift === undefined){
        return <div>空</div>
    }
    
 
    return <div>
        <h2>好感度: <GiftLable id={id} noLink /></h2>

      
       
        <div>
            <h3>好感度设置</h3>
            <ul>
                <li>锁定等级: {gift.Locked}</li>
                <li>最大好感度: {gift.Maximum}</li>
            </ul>
        </div>
        <div>
            <h3>好感度解锁条件</h3>
            <GameStateEligibleView {...gift.UnlockGameStateRequirements} />
        </div>
        <div>
            <h3>最大好感度条件</h3>
            <GameStateEligibleView {...gift.MaxedRequirement} />
        </div>
        <h3>代码定义</h3>
        <JsonView target={gift} />

    </div>
 
}


