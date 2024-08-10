import React, { useState } from 'react'
import "./detail.css"
import { auth, db } from '../../firebase/firebase'
import { useChatStore } from '../../zustand/chatStore'
import { useUserStore } from '../../zustand/useStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
const Detail = (props) => {
  const [dataimg, setimgdata] = useState([]);
  console.log(dataimg)
const {changeBlock,chatId,user,iscurrentuserblocked,isreceverblock,}=useChatStore()
const {CurrentUser}=useUserStore()
  const handleBlock=async()=>{
if(!user){
return
}
const userDocRef= doc(db,"user",CurrentUser.id)
try {
  
  await updateDoc(userDocRef,{
    blocked:isreceverblock ? arrayRemove(user.id):arrayUnion(user.id)
  })
  changeBlock()
} catch (error) {
  console.log(error);
  
}

}




  return (
    <>
      <div className='detail'>
        <div className="detailuser">
          <div className="back">
        <img className='invert' onClick={()=>{props.list(true)  ,props.back(false)}} src="./arrowup.png" alt="" />
          </div>
          <img style={{borderRadius:"20px"}} src={user?.imgdata ||"./user.png"} alt="" />
          <h2>{user.username}</h2>
          <p>{user.email}</p>
        </div>
        <div className="detailinfo">
  
          <div className="option">
            <div className="title">
              <span>Chat settings </span>
              <img className='invert' src="./arrowup.png" alt="" />
            </div>
          </div>

          <div className="option">
            <div className="title">
              <span>Privacy & help setting</span>
              <img className='invert' src="./arrowup.png" alt="" />
            </div>
          </div>
      
          <div className="option">
            <div className="title">
              <span>Shared photos</span>
              <img className='invert' src="./down.png" alt="" />
            </div>
            <div className="photos">
            
              {/* {

 <div className="photositems">
<div className="photodetails">
  <img src= {dataimg||"./sample.png"} alt="" />
  <span>photo_3034.png</span>
</div>
<img className='invert downloadimg' src="./download.png" alt="" />
</div>
              
              } */}
            </div>
          </div>
          <div className="option">
            <div className="title">
              <span>Shared Files</span>
              <img className='invert ' style={{cursor:"pointer"}} src="./arrowup.png" alt="" />
            </div>
          </div>
          
          <button onClick={handleBlock}>{iscurrentuserblocked?"You are Blocked":isreceverblock?"User blocked":"Block User"}</button>
          <button className='logoutbtn' onClick={()=>{auth.signOut()}}>Log Out</button>
          
        </div>
      </div>
    </>
  )
}

export default Detail
