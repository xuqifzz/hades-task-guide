import React from 'react'
import { useParams } from 'react-router-dom'
import { getTextLine, getCueTextList,getChoiceInfo, CueText, ChoiceInfo, translateWord} from './data/GameData'
import GameStateEligibleView from './GameStateEligibleView'
import JsonView from './JsonView'
import { TextLineLabel } from './ViewComponents'

function CueTextListView({ cueTextList}:{cueTextList:CueText[]}){
    return <div>
        <h3>对话内容</h3>
        <ul>
            {cueTextList.map(cueText=><li key={cueText.Id}>{cueText.SpeakerDisplayName}: {cueText.DisplayName} </li>)}
        </ul>
    
    </div>
}

function ChoiceInfoView({choiceInfoList}:{choiceInfoList:ChoiceInfo[]}){
    return <div>
    <h3>选择</h3>
    <ul>
        {choiceInfoList.map(c=><li key={c.id}>{c.text} <TextLineLabel id={c.fullId} noLink={true} />  </li>)}
    </ul>

</div> 
}






export default function TextLineView() {
    const param = useParams<string>();
    const { id } = param;
    if(id === undefined){
        return <div>空</div>
    }

    let textLine = getTextLine(id);
    if(textLine === undefined){
        return <div>空</div>
    }

    let choiceInfoList = getChoiceInfo(textLine);
 
    return (
        <div>
            <h2>对话ID: <TextLineLabel id={id} noLink  /> </h2>
            { textLine.PlayOnce && <div>该对话仅播放一次</div>}
            { textLine.Priority && <div>该对话优先播放</div>}
            { textLine.SuperPriority && <div>该对话超级优先播放</div>}
            { textLine.Partner && <div>同伴: {`${translateWord(textLine.Partner)}`}</div>}
            <CueTextListView cueTextList={getCueTextList(textLine)} />
            { choiceInfoList ? <ChoiceInfoView choiceInfoList={choiceInfoList} /> : undefined}
           
            <div>
            <h3>解锁条件</h3>
            <GameStateEligibleView {...textLine} />
            
            </div>
            <h3>代码定义</h3>
            <JsonView target={textLine} />
            
        </div>
    )
 
}
