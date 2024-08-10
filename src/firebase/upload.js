
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { toast } from "react-toastify";
const upload = async (file ) => {
  if(file.name===null) {
    toast.error("!please select profile",{closeOnClick:true})
  }
    const value = new Date()
  const storageRef = ref(storage, `images/${value}+ ${file.name}}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return new Promise((res, rej) => {      //promise return here  SyntaxError: Invalid left-hand side in assignment  wrong parentisis use 
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');

      },
      (error) => {

        rej("Somithing went wrong!", error.code)
      },
      () => {
 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          res(downloadURL)
        });
      }
    );
  })
}

export default upload