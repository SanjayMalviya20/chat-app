import { create } from 'zustand'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase/firebase';
export const useUserStore = create((set) => ({
  CurrentUser: null,
  isloading: true,
  fetchUserinfo: async (uid) => {
    if (!uid) {return set({ CurrentUser: null, isloading: false }) }
    try {

      const docRef = doc(db, "user", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ CurrentUser: docSnap.data(), isloading: false });
      } 
      
      else{

        set({ CurrentUser: null, isloading: false });
      }
      
    } catch (error) {
      console.log(error +"don,t come")
      return set({ CurrentUser: null, isloading: false })
    }
  }
  
}))

