import React, { useRef, useState } from 'react'
import "./login.css"
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth" //firebase sign and login
import { auth, db } from '../../firebase/firebase'     //firebase 
import { doc, setDoc } from "firebase/firestore";  //firebase 
import upload from '../../firebase/upload'  //for file img store


const Login = (props) => {

    const [toggle, setToggle] = useState(false)
    const img = useRef(null)
    const [avtar, setavtar] = useState({    //for img upload 
        file: null,
        url: ""
    });


    const [loading, setloading] = useState(false);  //for loading
    const [loadingtwo, setloadingtwo] = useState(false);  //for loading

    const handleimage = e => {
        // console.log(e.target.files[0])
        if (e.target.files[0]) {
            setavtar({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) })
        }
    }

    const handleLogin = async e => {        //login function
        e.preventDefault()
        const formdata = new FormData(e.target)
        const { email, password } = Object.fromEntries(formdata)
        setloadingtwo(true)
        props.setfalsetrue(false)
        try {
            await signInWithEmailAndPassword(auth, email, password)

            toast.success("Login successfully!", { closeOnClick: true })

        } catch (error) {
            toast.error("check email or internet", { closeOnClick: true })
            console.log("this is problem" + error.message)
        }

        finally {
            setloadingtwo(false)
        }

    }

    const handleRegister = async (e) => {           //login function
        e.preventDefault()
        const formData = new FormData(e.target) //important for form data
        const { username, email, password } = Object.fromEntries(formData)  //all input value from form
        setloading(true)
        try {

            const imgUrl = await upload(avtar.file)      //img store in database
            // console.log(imgUrl)
            const datavalue = await createUserWithEmailAndPassword(auth, email, password) //firebase part
            await setDoc(doc(db, "user", datavalue.user.uid), {
                username,
                email,
                // avatars: "",
                imgdata: imgUrl,
                id: datavalue.user.uid,
                blocked: []                                                //for user
            });


            await setDoc(doc(db, "userhats", datavalue.user.uid), {
                chat: []                                                  //for chat 
            });
            toast.success("Account created !")

        } catch (error) {
            console.log(error)
            // toast.error(error.message)
            toast.error("check email or internet", { closeOnClick: true })
        } finally {
            setloading(false)
        }
    }
    return (

        <>

            <div className="login">
                {toggle && <div className="loginitem">
                    <h2>{loadingtwo ? "Please wait.." : "welcome back,buddy"}</h2>
                    <form onSubmit={handleLogin}>
                        <input type="email" name='email' placeholder='enter your email' />
                        <input type="password" name="password" placeholder='enter password' />
                        <button disabled={loadingtwo}>{loadingtwo ? "loading" : "Sign in"}</button>

                    </form>
                    <button className='btn' onClick={() => { setToggle((toggle) => !toggle) }}>sing up</button>
                </div>}
                {/* <div className="sperate"></div> */}

                {!toggle && <div className="loginitem">
                    <h2>{loading ? "Please wait.." : "Create an Account"}</h2>
                    <form onSubmit={handleRegister}>
                        <div className='img'>
                            <img onClick={() => { img.current.click() }} style={{ cursor: "pointer" }} src={avtar.url ? avtar.url : "./user.png"} alt="" />
                            <label ref={img} className='label' htmlFor="file">Choose image</label>
                        </div>

                        <input type="file" name="file" id="file" hidden onChange={handleimage} />
                        <input type="text" name='username' placeholder='enter username' />
                        <input type="text" name='email' placeholder='enter your email' />
                        <input type="password" name="password" placeholder='enter password' />
                        <button disabled={loading}>{loading ? "loading" : "Sign up"}</button>
                    </form>
                    <button className='btn' onClick={() => { setToggle((toggle) => !toggle) }}>sing in</button>
                </div>}


            </div>
        </>
    )
}

export default Login