import React,{useState} from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import IndexList from './IndexList';
import TextLineView from './TextLineView';
import QuestView from './QuestView';
import HeaderView from './HeaderView';
import GiftView from './GiftView';
import {FromSaveFileResult } from './lib/HadesSaveFile'
import { SaveDataContext } from './context/SaveDataContext'
import { Github } from "styled-icons/fa-brands/Github";
import {ForkButton} from './styled'




function App() {
  const [saveDataResult,SetSaveDataResult] = useState<FromSaveFileResult>(
    {
      isSuccess:false,
      message:"未选择存档文件"
    }
  )

  const onChangeSaveDataResult =(s:FromSaveFileResult)=>{
    console.log(s);
    SetSaveDataResult(s);
  }

  return <SaveDataContext.Provider value={saveDataResult}>
    <BrowserRouter basename='/hades'>
    <div className='main-container'>
    <HeaderView onChangeSaveDataResult={onChangeSaveDataResult} />
    <ForkButton href="https://github.com/xuqifzz/hades-task-guide">
          <Github />
        </ForkButton>
  
    <Routes>
      <Route path ='/' element ={<IndexList />} />
      <Route path = "/Quests/:id" element = {<QuestView />} />
      <Route path = "/TextLines/:id" element = {<TextLineView />} />
      <Route path = "/Gifts/:id" element = {<GiftView />} />
  
    </Routes>
    </div>
  </BrowserRouter>
  </SaveDataContext.Provider>
}

export default App;
