import React, { createContext } from 'react'
import { useState } from 'react'
import axios from "../config/axios.js"
import { useEffect } from 'react'
export const UserContex = createContext()
const UserProvider   = ({children}) => {
    const [user , setUser] = useState(null)
    const [frontendImage , setFrontendImage] =useState(null)
    const [backendImage , setBackendImage] = useState(null)
    const [selectedImage , setSelectedImage] = useState(null)
    const handleCurrentUser = async () => {
      try {
        const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/current`,{withCredentials : true})
        setUser(result.data)
        
    } catch (error) {
        console.error("Error fetching current user:", error);
      }
  }

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/ask` , { command } , {withCredentials : true})
      return result.data;
    } catch (error) {
      console.error(error)

    }
  }

  useEffect(() => {
    handleCurrentUser()
  } ,[])
  return (
    <UserContex.Provider value={{user , setUser , frontendImage , setBackendImage , setFrontendImage , backendImage , selectedImage , setSelectedImage , getGeminiResponse}}>
      {children}
    </UserContex.Provider>
  )
}

export default UserProvider
