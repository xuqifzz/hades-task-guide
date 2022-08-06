import React from 'react'
import { useParams } from 'react-router-dom'
import { getConditionalItem,translateWord } from './data/GameData'
import GameStateEligibleView from './GameStateEligibleView'
import JsonView from './JsonView'
import { ConditionalItemLabel } from './ViewComponents'


export default function ConditionalItemView() {
    const param = useParams<string>();
    const { id } = param;
    if(id === undefined){
        return <div>空</div>
    }

    let item = getConditionalItem(id);
    if(item === undefined){
        return <div>空</div>
    }
 
    return <div>
    <h2>承包商: <ConditionalItemLabel id={id} noLink showId /></h2>

    <div>价格: {translateWord(item.ResourceName)} x {item.ResourceCost}</div>
    <div>
        <h3>解锁条件</h3>
        <GameStateEligibleView {...item.GameStateRequirements} />
    </div>

    <h3>代码定义</h3>
    <JsonView target={item} />

</div>
 
}
