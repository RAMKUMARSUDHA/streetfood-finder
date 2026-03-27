import React,{useState,useEffect} from "react"
import {Link,useNavigate} from "react-router-dom"
import {FaEye,FaEyeSlash,FaCheck,FaTimes} from "react-icons/fa"
import {useAuth} from "../context/AuthContext"
import api from "../api/axios"

export default function RegisterCustomer(){
  const [form,setForm]=useState({name:"",email:"",phone:"",password:"",confirm:""})
  const [showPass,setShowPass]=useState(false)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")
  const [mounted,setMounted]=useState(false)
  const {login}=useAuth()
  const navigate=useNavigate()
  useEffect(()=>{setTimeout(()=>setMounted(true),60)},[])
  const p=form.password
  const strength=[p.length>=8,/[A-Z]/.test(p),/[0-9]/.test(p),form.confirm===p&&p.length>0].filter(Boolean).length
  const strengthColors=["","#FF4757","#FF4757","#FFD32A","#16A34A"]
  const handleSubmit=async(e)=>{
    e.preventDefault()
    if(form.password!==form.confirm){setError("Passwords do not match");return}
    if(p.length<8){setError("Password must be at least 8 characters");return}
    setLoading(true);setError("")
    try{
      const res=await api.post("/api/auth/register-customer",{name:form.name,email:form.email,phone:form.phone,password:form.password})
      login(res.data);navigate("/dashboard",{replace:true})
    }catch(err){setError(err.response?.data?.message||"Registration failed")}
    setLoading(false)
  }
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#EFF6FF,#F0F9FF,#F5F3FF)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:440,background:"rgba(255,255,255,0.97)",border:"1.5px solid rgba(37,99,235,0.12)",borderRadius:24,padding:"36px 32px",boxShadow:"0 20px 60px rgba(37,99,235,0.12)",transform:mounted?"translateY(0)":"translateY(28px)",opacity:mounted?1:0,transition:"all 0.55s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:10,animation:"float 3s ease-in-out infinite"}}>🍜</div>
          <h1 style={{fontSize:22,fontWeight:800,color:"#0F172A",marginBottom:4}}>Create Account</h1>
          <p style={{color:"#64748B",fontSize:13}}>Join Street Food Finder</p>
        </div>
        {error&&<div style={{background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:9,padding:"9px 12px",marginBottom:14,fontSize:12,color:"#DC2626",fontWeight:600}}>{error}</div>}
        <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:13}}>
          {[{k:"name",l:"Full Name",t:"text",ph:"Ravi Kumar"},{k:"email",l:"Email Address",t:"email",ph:"you@gmail.com"},{k:"phone",l:"Phone (Optional)",t:"tel",ph:"9876543210"}].map(f=>(
            <div key={f.k}>
              <label style={{fontSize:11,fontWeight:700,color:"#64748B",display:"block",marginBottom:5}}>{f.l}</label>
              <input type={f.t} placeholder={f.ph} value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} required={f.k!=="phone"}
                style={{width:"100%",padding:"11px 13px",background:"#F8FAFF",border:"1.5px solid #E0EAFF",borderRadius:10,color:"#0F172A",fontSize:14,fontFamily:"inherit",outline:"none"}}
                onFocus={e=>{e.target.style.borderColor="#2563EB";e.target.style.boxShadow="0 0 0 3px rgba(37,99,235,0.1)"}}
                onBlur={e=>{e.target.style.borderColor="#E0EAFF";e.target.style.boxShadow="none"}}/>
            </div>
          ))}
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#64748B",display:"block",marginBottom:5}}>Password</label>
            <div style={{position:"relative"}}>
              <input type={showPass?"text":"password"} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} required
                style={{width:"100%",padding:"11px 42px 11px 13px",background:"#F8FAFF",border:"1.5px solid #E0EAFF",borderRadius:10,color:"#0F172A",fontSize:14,fontFamily:"inherit",outline:"none"}}
                onFocus={e=>{e.target.style.borderColor="#2563EB";e.target.style.boxShadow="0 0 0 3px rgba(37,99,235,0.1)"}}
                onBlur={e=>{e.target.style.borderColor="#E0EAFF";e.target.style.boxShadow="none"}}/>
              <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#94A3B8",cursor:"pointer",fontSize:14}}>{showPass?<FaEyeSlash/>:<FaEye/>}</button>
            </div>
            {form.password&&<div style={{display:"flex",gap:4,marginTop:7}}>{[1,2,3,4].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=strength?strengthColors[strength]:"#E0EAFF",transition:"all 0.3s"}}/>)}</div>}
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#64748B",display:"block",marginBottom:5}}>Confirm Password</label>
            <input type="password" value={form.confirm} onChange={e=>setForm(p=>({...p,confirm:e.target.value}))} required
              style={{width:"100%",padding:"11px 13px",background:"#F8FAFF",border:"1.5px solid "+(form.confirm&&form.confirm!==form.password?"#FECACA":form.confirm&&form.confirm===form.password?"#BBF7D0":"#E0EAFF"),borderRadius:10,color:"#0F172A",fontSize:14,fontFamily:"inherit",outline:"none"}}
              onFocus={e=>{e.target.style.boxShadow="0 0 0 3px rgba(37,99,235,0.1)"}} onBlur={e=>{e.target.style.boxShadow="none"}}/>
          </div>
          <button type="submit" disabled={loading}
            style={{width:"100%",padding:"12px",background:loading?"#93C5FD":"linear-gradient(135deg,#2563EB,#1D4ED8)",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:4}}>
            {loading?<><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>Creating...</>:"🎉 Create Account"}
          </button>
        </form>
        <p style={{textAlign:"center",marginTop:18,fontSize:13,color:"#94A3B8"}}>Already have an account? <Link to="/login" style={{color:"#2563EB",fontWeight:700}}>Sign in</Link></p>
      </div>
    </div>
  )
}
