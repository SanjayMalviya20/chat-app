// import { useState } from 'react'
import './App.css'
import { lazy,Suspense, useState } from 'react'
const List  =lazy(()=>import ('./components/list/List'))
const Chat  =lazy(()=>import ('./components/chat/Chat'))
const Detail =lazy(()=>import ('./components/detail/Detail'))
import Login from './components/login/Login'
import Notification from './toastify/Notification'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/firebase'
import { useUserStore } from './zustand/useStore'
import { useChatStore } from './zustand/chatStore'


function App() {

  const { chatId,changeChat}=useChatStore()  //zustand  data
  const [falsetrue, setfalsetrue] = useState(false);
  const [listtrue, setlisttrue] = useState(true);
  const [falsetruetwo, setfalsetruetwo] = useState(false);
  const { CurrentUser ,fetchUserinfo ,isloading}=useUserStore()  //zustand  data

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user)=>{fetchUserinfo(user?.uid) })           //user data by  onAuthStateChanged()
          
    return () => {
      unSub()
      
    }
  }, [fetchUserinfo])

// console.log(CurrentUser)

  if(isloading) return <div className='loader'></div>
  return (
    <>
      <div className="container">
        {CurrentUser===null? (<Login setfalsetruetwo={setfalsetruetwo} setfalsetrue={setfalsetrue}/>):<> <Suspense><List setlisttrue={setlisttrue} setfalsetruewo={setfalsetruetwo} listtrue={listtrue} value={setfalsetrue}/>  { falsetrue? chatId&&<Chat setlisttrue={setlisttrue} setfalsetrue={setfalsetrue} /> :<></>}  {falsetruetwo?chatId&&<Detail back={setfalsetruetwo} list={setlisttrue}/>:<></>}</Suspense> </> }
        <Notification />
      </div>
    </>
  )
}

export default App
