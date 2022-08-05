import React from 'react';
import { QuestOrderData, GiftOrderData, WeaponOrderData } from './data/GameData'
import { QuestLable, GiftLable, WeaponLevel4UnlockLable } from './ViewComponents';


function QuestList() {

    return <div className='index-list'>
        <div className="index-list-col">
            <h2>命运清单</h2>
            <ul>
                {
                    QuestOrderData.map(q => <li key={q} ><QuestLable id={q} /></li>)
                }
            </ul>
        </div>
        <div className="index-list-col">
            <h2>好感度</h2>
            <ul>
                {
                    GiftOrderData.map(q => <li key={q} ><GiftLable id={q} /></li>)
                }
            </ul>
            <h2>武器第四形态解锁</h2>
            <ul>
                {
                    WeaponOrderData.map(w => <li key={w[0]} ><WeaponLevel4UnlockLable weaponId={w[0]} textLineId={w[1]} /></li>)
                }
            </ul>
        </div>
    </div>
}

function IndexList() {
    return <div>
        <QuestList />
    </div>
}

export default IndexList;