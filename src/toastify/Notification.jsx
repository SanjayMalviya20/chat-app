import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Notification = () => {
  return (
    <div>
      <ToastContainer   theme="colored" position="bottom-right"/>
    </div>
  )
}

export default Notification
