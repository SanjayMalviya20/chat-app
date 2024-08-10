import React, { Suspense, useState } from 'react'
import "./addlist.css"
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from '../../../firebase/firebase';
import { useUserStore } from '../../../zustand/useStore';

const Addlist = (props) => {
  const {setadd}=props
const [userdata ,setuserdata]=useState(null)

const {CurrentUser} =useUserStore()
  const addvalues=async(e)=>{
    e.preventDefault()
    const formdata =new FormData(e.target)
    const username =formdata.get("username")
    
try {
  
  //  collection(db, "user");   //database collection
const q = query( collection(db, "user"), where("username", "==", username));
const querysnapShot =await getDocs(q)
if(!querysnapShot.empty){
setuserdata(querysnapShot.docs[0].data())
}

} catch (error) {
  console.log(error)
}
}
 const addUser = async () => {
    let Chatref = collection(db, "chats")
    let userchatRef = collection(db, "userhats")
    try {
      const newChatref = doc(Chatref)
      await setDoc(newChatref, {                  //chats create
        createdAt: serverTimestamp(),
        message: []

      })
     
      // console.log(newChatref.id)

      await updateDoc(doc(userchatRef, userdata.id), {    //upadate chats

        chat:arrayUnion({
          chatId: newChatref.id,
          lastMessage: "",
          receiverId: CurrentUser.id,
          updateAt: Date.now()
        })
      })
      await updateDoc(doc(userchatRef, CurrentUser.id), {    //upadate chats

        chat:arrayUnion({
          chatId: newChatref.id,
          lastMessage: "",
          receiverId: userdata.id,
          updateAt: Date.now()
        })
      })

setadd(false)
    
    } 
    catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className='adduser'>
        
        <form  onSubmit={addvalues}>
          <input type="text" placeholder='Username' name='username' />
          <button className='searchbtn'>Search</button>
        </form>
<Suspense fallback={<h5>loading</h5>}>
        {userdata && <div className="users">
          <div className="details">
            <div style={{display:"flex" ,justifyContent:"center",alignContent:"center"}} className='userdetails'>
              {/* <img  src={  userdata.imgdata ||"./user.png"} alt="" /> */}
              <h1 style={{backgroundColor:"#00254b", paddingLeft:"10px", paddingRight:"10px",border: "3px solid #0095ff", borderRadius:"22px"}}>{userdata.username.slice(0,1)}</h1>
              <span>{userdata.username}</span>
            </div>
            <button onClick={addUser} >adduser</button>
          </div>
        </div>}
        </Suspense>
      </div>
    </>
  )
}

export default Addlist
 


  // const [user, setuser] = useState(null);
  // const { CurrentUser } = useUserStore()

  // const addUservalue = async(e) => {
  //   e.preventDefault()
  //   let formdata = new FormData(e.target)
  //   const  username  = formdata.get("username")

  //   try {
  //     const userRef = collection(db, "user");   //database collection
      
  //     const q = query(userRef, where("username", "==", username));

  //     const querysnapShot = await getDocs(q)          //!getDoc ==getDocs //'_DocumentReference', but it was: a custom _Query object
      
  //     if (!querysnapShot.empty) {
  //       setuser(querysnapShot.docs[0].data())
      
  //     }
      
  //   } catch (error) {
  //     console.log(error)
  //   }
    
  // }