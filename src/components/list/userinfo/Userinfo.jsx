import React ,{useRef, useState} from 'react'
import "./user.css"
import more from "./more.png"
import edit from "./edit.png"
import video from "./video.png"
import user from "./portrait.png"
import { useUserStore } from '../../../zustand/useStore'
// import { doc, setDoc, updateDoc } from 'firebase/firestore'
// import { db } from '../../../firebase/firebase'
const Userinfo = (props) => {
 
  const { CurrentUser }=useUserStore()       //all data store in CurrentUser
  const inputRef =useRef()
  const [changePROFILE, setchangePROFILE] = useState({file:null,url:CurrentUser.imgdata});
const handleimg =(e)=>{
// console.log(e.target.files[0])

if(e.target.files[0]){
  setchangePROFILE({file:e.target.files[0],url:URL.createObjectURL(e.target.files[0])})
}

}





if(CurrentUser.imgdata){
  // changePROFILE.url?changePROFILE.url:
  CurrentUser.imgdata =changePROFILE.url
}

// const data=async()=>{
// // await updateDoc(doc("user", CurrentUser.id), {    //upadate chats
// //   aata:arrayUnion({
// //   set:"champ"
// //   })

// // })



// }




  return (
    <>
    <div className="userinfo">
      <div className='user'> 
       <img   onClick={()=>{inputRef.current.click()}} style={{borderRadius:"50px", height:"45px"}} src={CurrentUser.imgdata?CurrentUser.imgdata:"./user.png"} alt="" /> 
        <h3 style={{width:"max-content"}}>{CurrentUser.username}</h3>
         </div>
      <div  className="icons">
        {/* <img style={{filter:"invert(1)"}} src={more} alt="error" /> */}
        {/* <img style={{filter:"invert(1)"}} src={video} alt="error" /> */}
        <img onClick={()=>{props.detail(true),props.profile(false),console.log("click")}} style={{filter:"invert(1)"}} src={edit} alt="error" />
        <input ref={inputRef} type="file" name="file" id="file" hidden onChange={handleimg}/>
{/* <button onClick={data}>SET</button> */}
{/* <div>{CurrentUser.wait}</div> */}
      </div>
    </div>
    </>
  )
}

export default Userinfo
