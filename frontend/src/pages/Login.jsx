import React,{useState,useEffect} from "react"
import {Link,useNavigate} from "react-router-dom"
import {FaEye,FaEyeSlash,FaExclamationCircle} from "react-icons/fa"
import {useAuth} from "../context/AuthContext"
import api from "../api/axios"

export default function Login(){
  const [role,setRole]=useState("customer")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [showPass,setShowPass]=useState(false)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")
  const [mounted,setMounted]=useState(false)
  const {login}=useAuth()
  const navigate=useNavigate()
  useEffect(()=>{setTimeout(()=>setMounted(true),60)},[])
  useEffect(()=>{setEmail("");setPassword("");setError("")},[role])
  const handleSubmit=async(e)=>{
    e.preventDefault();setLoading(true);setError("")
    try{
      const res=await api.post("/api/auth/login",{email:email.trim(),password})
      const r=login(res.data)
      if(r==="ADMIN")navigate("/admin",{replace:true})
      else if(r==="VENDOR")navigate("/vendor/dashboard",{replace:true})
      else navigate("/dashboard",{replace:true})
    }catch(err){
      if(err.code==="ERR_NETWORK")setError("Cannot connect to server. Backend running on port 8080?")
      else setError(err.response?.data?.message||"Invalid email or password.")
    }
    setLoading(false)
  }
  const tabs=[
    {key:"customer",label:"Customer",icon:"👤",color:"#2563EB",bg:"#2563EB",lightBg:"rgba(37,99,235,0.1)"},
    {key:"vendor",label:"Vendor",icon:"🏪",color:"#15803D",bg:"#15803D",lightBg:"rgba(21,128,61,0.1)"},
    {key:"admin",label:"Admin",icon:"🛡️",color:"#6D28D9",bg:"#6D28D9",lightBg:"rgba(109,40,217,0.1)"},
  ]
  const active=tabs.find(t=>t.key===role)
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#EFF6FF 0%,#F0F9FF 55%,#F5F3FF 100%)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",padding:20}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",top:"-200px",left:"-150px",background:"radial-gradient(circle,rgba(37,99,235,0.08),transparent 70%)",animation:"float 9s ease-in-out infinite"}}/>
        <div style={{position:"absolute",width:350,height:350,borderRadius:"50%",bottom:"-100px",right:"-80px",background:"radial-gradient(circle,rgba(14,165,233,0.07),transparent 70%)",animation:"float 11s 2s ease-in-out infinite reverse"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(37,99,235,0.07) 1px,transparent 1px)",backgroundSize:"30px 30px"}}/>
      </div>
      <div style={{width:"100%",maxWidth:400,background:"rgba(255,255,255,0.97)",border:"1.5px solid rgba(37,99,235,0.12)",borderRadius:24,padding:"34px 28px",backdropFilter:"blur(20px)",boxShadow:"0 20px 60px rgba(37,99,235,0.12)",transform:mounted?"translateY(0) scale(1)":"translateY(28px) scale(0.96)",opacity:mounted?1:0,transition:"all 0.55s cubic-bezier(0.34,1.56,0.64,1)",position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{width:58,height:58,borderRadius:16,background:"linear-gradient(135deg,#2563EB,#0EA5E9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:25,boxShadow:"0 8px 24px rgba(37,99,235,0.3)",margin:"0 auto 10px",animation:"float 3s ease-in-out infinite"}}>🍜</div>
          <h1 style={{fontSize:21,fontWeight:800,color:"#0F172A",marginBottom:2}}>Street Food Finder</h1>
          <p style={{color:"#64748B",fontSize:13}}>Sign in to your account</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:22,background:"#F1F5F9",borderRadius:12,padding:4}}>
          {tabs.map(t=>(
            <button key={t.key} onClick={()=>setRole(t.key)}
              style={{padding:"10px 4px",borderRadius:9,background:role===t.key?t.bg:"transparent",border:"none",color:role===t.key?"white":t.color,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:5,boxShadow:role===t.key?"0 3px 10px rgba(0,0,0,0.15)":"none"}}>
              <span style={{fontSize:14}}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
        {error&&<div style={{background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:9,padding:"9px 12px",marginBottom:13,display:"flex",gap:7,alignItems:"flex-start"}}><FaExclamationCircle color="#DC2626" size={13} style={{flexShrink:0,marginTop:1}}/><span style={{fontSize:12,color:"#DC2626",fontWeight:600}}>{error}</span></div>}
        <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:11,fontWeight:700,color:"#64748B",letterSpacing:"0.4px"}}>EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setError("")}} required
              style={{padding:"11px 13px",background:"#F8FAFF",border:"1.5px solid #E0EAFF",borderRadius:10,color:"#0F172A",fontSize:14,outline:"none",fontFamily:"inherit",transition:"all 0.2s",width:"100%"}}
              onFocus={e=>{e.target.style.borderColor=active.color;e.target.style.background="white";e.target.style.boxShadow="0 0 0 3px "+active.lightBg}}
              onBlur={e=>{e.target.style.borderColor="#E0EAFF";e.target.style.background="#F8FAFF";e.target.style.boxShadow="none"}}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:11,fontWeight:700,color:"#64748B",letterSpacing:"0.4px"}}>PASSWORD</label>
            <div style={{position:"relative"}}>
              <input type={showPass?"text":"password"} value={password} onChange={e=>{setPassword(e.target.value);setError("")}} required
                style={{width:"100%",padding:"11px 42px 11px 13px",background:"#F8FAFF",border:"1.5px solid #E0EAFF",borderRadius:10,color:"#0F172A",fontSize:14,outline:"none",fontFamily:"inherit",transition:"all 0.2s"}}
                onFocus={e=>{e.target.style.borderColor=active.color;e.target.style.background="white";e.target.style.boxShadow="0 0 0 3px "+active.lightBg}}
                onBlur={e=>{e.target.style.borderColor="#E0EAFF";e.target.style.background="#F8FAFF";e.target.style.boxShadow="none"}}/>
              <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#94A3B8",cursor:"pointer",fontSize:14,padding:0}}>
                {showPass?<FaEyeSlash/>:<FaEye/>}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            style={{width:"100%",padding:"12px",background:loading?"#93C5FD":`linear-gradient(135deg,${active.color},${active.bg})`,color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",transition:"all 0.2s",marginTop:2,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {loading?<><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>Signing in...</>:`Sign In as ${active.label} →`}
          </button>
        </form>
        <div style={{marginTop:16,textAlign:"center"}}>
          {role==="customer"&&<Link to="/register/customer" style={{display:"block",padding:"10px",background:"#F8FAFF",border:"1.5px solid #E0EAFF",borderRadius:10,color:"#64748B",fontSize:13,fontWeight:600,textDecoration:"none"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#BFDBFE";e.currentTarget.style.color="#2563EB"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#E0EAFF";e.currentTarget.style.color="#64748B"}}>New customer? Create account →</Link>}
          {role==="vendor"&&<Link to="/register/vendor" style={{display:"block",padding:"10px",background:"#F0FDF4",border:"1.5px solid #BBF7D0",borderRadius:10,color:"#15803D",fontSize:13,fontWeight:600,textDecoration:"none"}} onMouseEnter={e=>e.currentTarget.style.background="#DCFCE7"} onMouseLeave={e=>e.currentTarget.style.background="#F0FDF4"}>New vendor? Register your stall →</Link>}
          {role==="admin"&&<p style={{fontSize:12,color:"#94A3B8",padding:"8px 0"}}>Admin access only. No registration.</p>}
        </div>
      </div>
    </div>
  )
}
