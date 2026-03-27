import React,{createContext,useContext,useState,useEffect} from "react"
const AuthContext=createContext(null)
export function AuthProvider({children}){
  const [user,setUser]=useState(null)
  const [token,setToken]=useState(null)
  const [ready,setReady]=useState(false)
  useEffect(()=>{
    const t=localStorage.getItem("sf_token"),u=localStorage.getItem("sf_user")
    if(t&&u){try{setToken(t);setUser(JSON.parse(u))}catch{localStorage.removeItem("sf_token");localStorage.removeItem("sf_user")}}
    setReady(true)
  },[])
  const login=(data)=>{setToken(data.token);setUser(data);localStorage.setItem("sf_token",data.token);localStorage.setItem("sf_user",JSON.stringify(data));return data.role}
  const logout=()=>{setToken(null);setUser(null);localStorage.removeItem("sf_token");localStorage.removeItem("sf_user")}
  return <AuthContext.Provider value={{user,token,ready,isAuthenticated:!!token,role:user?.role||null,login,logout}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext)
