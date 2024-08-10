import { create } from 'zustand'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase/firebase';
import { useUserStore } from './useStore';
export const useChatStore = create((set) => ( {
    chatId: null,
    user: null,
    iscurrentuserblocked: false,
    isreceverblock: false,
changeChat:(chatId,user)=>{
const  CurrentUser= useUserStore.getState().CurrentUser
        // console.log(CurrentUser.id)
        console.log(user)
if (user.blocked.includes(CurrentUser.id)) {
    return set({
        chatId,
        user: null,
        iscurrentuserblocked: true,
        isreceverblock: false,
    })
    
}
// // console.log(chatId,user)


   else if (CurrentUser.blocked.includes(user.id)) {
        return set({
            chatId,
            user: user,
            iscurrentuserblocked: false,
            isreceverblock: true,
         
        })
    }
    else {

    return set({

            chatId,
            user,
            iscurrentuserblocked: false,
            isreceverblock: false,
          
    
        })
    }
},

    changeBlock:()=>{
        set(state=>({...state,isreceverblock:!state.isreceverblock}))
    }
}))