import React, { useEffect, useRef, useState } from 'react'
import "./chat.css"
// import user from "./user.png"
// import info from "./info.png"
import emoji from "./happy.png"

import image from "./image.png"
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useChatStore } from '../../zustand/chatStore'
import { useUserStore } from '../../zustand/useStore'
import upload from '../../firebase/upload'

const Chat = (props) => {

  const endref = useRef(null)
  const imgsender = useRef(null)
  const [Emoji, setEmoji] = useState(false);
  const [chatdata, setChatdata] = useState();
  const [text, settext] = useState("");
  const [img, setImg] = useState({ file: null, url: "" });

  const {chatId,user,iscurrentuserblocked,isreceverblock,}=useChatStore()
  const { CurrentUser } = useUserStore()

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChatdata(res.data())
    })

    return () => {
      unsub()
    }
  }, [chatId])

  useEffect(() => {
    endref.current.scrollIntoView({ behavior: "smooth" })
  }, [])

  //  console.log(chatdata)


  const handleclick = (e) => {
    // console.log(e)
    settext((prev) => prev + e.emoji)
  }


  const handleSendimg = e => {
    if (e.target.files[0]) {
      setImg({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) })
    }


  }



  const handleSend = async () => {
    if (text === "") return;
    let imgurl = null
    try {
      if (img.file) {
        imgurl = await upload(img.file)
      }
      await updateDoc(doc(db, "chats", chatId), {
        message: arrayUnion({
          senderId: CurrentUser.id,
          text,

          createAt: new Date(),

          ...(imgurl && { img: imgurl })
        }),

      });
      const userId = [CurrentUser.id, user.id]
      userId.forEach(async (id) => {
        const userChatsref = doc(db, "userhats", id)
        const userSnapshot = await getDoc(userChatsref)

        if (userSnapshot.exists()) {
          const userChatdata = userSnapshot.data()
          const Chatindex = userChatdata.chat.findIndex(c => c.chatId === chatId)
          userChatdata.chat[Chatindex].lastMessage = text
          userChatdata.chat[Chatindex].isSeen = id === CurrentUser.id ? true : false
          userChatdata.chat[Chatindex].updateAt = Date.now()
          await updateDoc(userChatsref, {
            chat: userChatdata.chat,
          })
        }
      })
    } catch (error) {
      console.log(error)
    }

    finally{
      setImg({
        file: null,
        url: ""
      })
  
      settext("")
    }
    

  

  }
  return (
    <>
      <div className='chat'>
        <div className="top">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}} className="user ">
            <div>
            <div  className="texts">
            <img style={{borderRadius:"20px", height:"35px"}} src={user?.imgdata || "./user.png"} alt="" />
              <span>{user.username} </span>
            </div>
              <p>{navigator.onLine ?"online":"offline"}</p>
            </div>
            <div>

            <img style={{height:"25px",cursor:"pointer",backgroundColor:"#ffffff24",rotate:"-88deg",borderRadius:"20px"}}  title="go back" onClick={()=>{props.setfalsetrue(false),props.setlisttrue(true)}} className='invert' src="./arrowup.png" alt="" />
            </div>
          </div>
{/* 
          <div className="icons">
            <img className='invert' src={phone} alt="" />
            <img className='invert' src={video} alt="" />
            <img className='invert' src={info} alt="" />
          </div> */}
        </div>
        <div className="center">

          {chatdata?.message?.map((message) => {

            return <div className={message.senderId == CurrentUser.id ? "msg own" : "msg"} key={message?.createAt}>

              <div className="centertext">
                {message.img && <img src={message.img} alt="" />}
                <p>{message.text}</p>
                {/* <span>{msg.createAt}</span> */}

              </div>
            </div>
          })}

          {img.url && <div className="msg own">
            <div className="centertext">
              <img src={img.url} alt="" />
            </div>
          </div>}

          <div hidden ref={endref}></div>
        </div>

        <div className="bottom">
          <div className="mediaicons">
            <img onClick={() => { imgsender.current.click() }} src={image} alt="" />
            <input ref={imgsender} type="file" hidden onChange={handleSendimg} />

       
          </div>
          <div id='emoji' style={{ flex: 1 }}>
            <input  id='input' disabled={iscurrentuserblocked||isreceverblock } value={text} onChange={(e) => { settext(e.target.value) }} style={{ flex: "1" }} type="text" 
            placeholder ={iscurrentuserblocked||isreceverblock ? "you can,t send msg ": "send message"}/>
            <div className='epicker'>
              <EmojiPicker height={"327px"} width={"241px"} theme='dark'onEmojiClick={handleclick} open={Emoji} />
            </div> 

            <img onClick={() => { setEmoji((emoji) => !emoji) }} src={emoji} alt="" />
          </div>
          <button disabled={iscurrentuserblocked ||isreceverblock} className='sendbtn' onClick={handleSend}>send</button>
        </div>
      </div>
    </>
  )
}

export default Chat
