import React, { Suspense, useEffect, useState } from 'react'
import "./chatlist.css"
// import user from "./user.png"
import Addlist from '../addlist/Addlist'
import { useUserStore } from '../../../zustand/useStore'
import { doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { db } from '../../../firebase/firebase'
import { useChatStore } from '../../../zustand/chatStore'
const Chatlist = (props) => {
    const {value,setlisttrue} =props
    const [addbtn, setadd] = useState(false);
    const [input, setinput] = useState("");
    const [chats, setChats] = useState([]);
    const { CurrentUser } = useUserStore()
    const { chatId, changeChat } = useChatStore()
    // console.log(chatId)

    // console.log(chats)
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "userhats", CurrentUser.id), async (res) => {   //for fetching chats 
            // console.log("Current data: ", doc.data());
            // setChats(doc.data())
            const items = res.data().chat;
            const promises = items.map(async (item) => {

                const UserdocRef = doc(db, "user", item.receiverId);     //for fecting user 
                const UserdocSnap = await getDoc(UserdocRef);

                const user = UserdocSnap.data()
                return { ...item, user }       //users me user ka data


            }
            )
            const chatData = await Promise.all(promises)
            setChats(chatData.sort((a, b) => { b.updateAt - a.updateAt }))
        }
        );

        return () => {

            unsub()
        }
    }, [CurrentUser.id])

    const handleSelect = async (chat) => {
        const userchatData = chats.map(items => {
            const { user, ...rest } = items
            return rest

        })

       const chatindexs= userchatData.findIndex((itemdata) =>itemdata.chatId===chat.chatId)
     userchatData[chatindexs].isSeen =false
        const userChatsRef = doc(db, "userhats", CurrentUser.id)

        try {
            await updateDoc(userChatsRef, {
                chat: userchatData
    })

    // console.log(chatId)
    console.log(chat.chatId)
        changeChat(chat.chatId, chat.user)
        } catch (error) {
            console.log(error)
        }

    }


const filterchats =chats.filter((c)=>c.user.username.toLowerCase().includes(input.toLowerCase()))
// console.log(filterchats)
// console.log(chats)
    return (
        <div className='chatlist'>
            <div className="search">
                <div className="searchbar">
                    <img className='invert' src={"./search.png"} alt="" />
                    <input type="search" placeholder='search' onChange={(e)=>setinput(e.target.value)}/>
                </div>
                <img loading="lazy" className='invert' src={addbtn ? "./remove.ppng" : "./new.png"} alt="" onClick={() => { setadd((prev) => !prev) }} />
            </div>
            <div className="listuser">
<Suspense fallback={<h4>Wait...</h4>}>
                {filterchats.map((chatValue) => {
                    return (<div key={chatValue.chatId} style={{cursor:"pointer", backgroundColor: chatValue?.isSeen ? "#5183fe" :"transparent"  }} className="items" onClick={() =>{value(true) ,setlisttrue(false) ,handleSelect(chatValue)}}>
                        <img style={{width:"40px", borderRadius:"20px"}}  src={chatValue.user.blocked.includes(CurrentUser.id)?"./user.png": chatValue.user.imgdata || "./user.png"} alt="" />
                        {/* <h1 style={{ backgroundColor: "#00254b", paddingLeft: "15px", paddingRight: "15px", paddingTop: "1px", paddingBottom: "1px", fontFamily: "cursive", border: "3px solid #0095ff", borderRadius: "50%" }}>{chatValue.user.username.slice(0, 1)}</h1> */}
                        <div className="text">
                            <span>{chatValue.user.blocked.includes(CurrentUser.id)?"User":chatValue.user.username}</span>
                            <p>{chatValue.lastMessage}</p>
                        </div>
                    </div>)
                })}
</Suspense>
                {addbtn && <Addlist setadd={setadd} />}
            </div>
        </div>
    )
}

export default Chatlist
