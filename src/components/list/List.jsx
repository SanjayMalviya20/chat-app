import React ,{lazy, useState}from 'react'
import "./list.css"
import Userinfo from './userinfo/Userinfo'
import Chat from '../chat/Chat'
// import Chatlist from './chatlist/Chatlist'
const Chatlist =lazy(()=>import("./chatlist/Chatlist"))
const List = (props) => {

let {value,listtrue,setlisttrue,setfalsetruewo}=props
  return (
    <>
      {listtrue&&<div className='list'>
        <Userinfo profile={setlisttrue} detail={setfalsetruewo} />
        {/* <Suspense fallback={<h1>wait</h1>}> */}
    <Chatlist setlisttrue={setlisttrue} value={value}/>
        {/* </Suspense> */}
      </div>}

    </>
  )
}

export default List
