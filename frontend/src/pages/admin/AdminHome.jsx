import React,{useState,useEffect} from "react"
import {Link,useNavigate} from "react-router-dom"
import {FaUsers,FaStore,FaStar,FaShieldAlt,FaSignOutAlt,FaBell,FaCheck,FaTimes,FaTrash} from "react-icons/fa"
import api from "../../api/axios"
import {useAuth} from "../../context/AuthContext"

export function AdminSidebar({active}){
  const{logout}=useAuth();const navigate=useNavigate()
  const links=[{to:"/admin",icon:"📊",label:"Dashboard"},{to:"/admin/vendors",icon:"🏪",label:"Vendors"},{to:"/admin/users",icon:"👥",label:"Users"},{to:"/admin/reviews",icon:"⭐",label:"Reviews"}]
  return(
    <div style={{width:220,background:"white",borderRight:"1.5px solid #E0EAFF",height:"100vh",position:"fixed",top:0,left:0,display:"flex",flexDirection:"column",zIndex:50,padding:"18px 12px",boxShadow:"2px 0 16px rgba(37,99,235,0.06)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 8px 18px",borderBottom:"1.5px solid #EFF6FF",marginBottom:14}}>
        <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#2563EB,#7C3AED)",display:"flex",alignItems:"center",justifyContent:"center"}}><FaShieldAlt color="white" size={16}/></div>
        <div><div style={{fontSize:12,fontWeight:800,color:"#0F172A"}}>Admin Panel</div><div style={{fontSize:10,color:"#2563EB",fontWeight:600}}>Street Food</div></div>
      </div>
      <div style={{flex:1}}>
        {links.map(l=><Link key={l.to} to={l.to} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 13px",borderRadius:10,marginBottom:3,fontSize:13,fontWeight:600,textDecoration:"none",border:"1.5px solid transparent",transition:"all 0.2s",background:active===l.to?"#EFF6FF":"transparent",borderColor:active===l.to?"#BFDBFE":"transparent",color:active===l.to?"#2563EB":"#64748B"}}><span style={{fontSize:15}}>{l.icon}</span>{l.label}</Link>)}
      </div>
      <div style={{borderTop:"1.5px solid #EFF6FF",paddingTop:12}}>
        <button onClick={()=>{logout();navigate("/login")}} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"10px 13px",borderRadius:10,background:"#FEF2F2",border:"1.5px solid #FECACA",color:"#DC2626",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><FaSignOutAlt size={12}/> Sign Out</button>
      </div>
    </div>
  )
}

function Donut({data,size=120}){
  const total=data.reduce((s,d)=>s+d.val,0)||1
  const r=44,cx=60,cy=60,circ=2*Math.PI*r;let off=0
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EFF6FF" strokeWidth={14}/>
        {data.map((d,i)=>{const dash=(d.val/total)*circ,el=<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth={14} strokeDasharray={dash+" "+(circ-dash)} strokeDashoffset={-off} style={{transform:"rotate(-90deg)",transformOrigin:`${cx}px ${cy}px`}}/>;off+=dash;return el})}
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,fontWeight:800,color:"#0F172A"}}>{total}</span><span style={{fontSize:9,color:"#94A3B8",fontWeight:700}}>TOTAL</span></div>
    </div>
  )
}

function Stat({icon,label,val,sub,color}){
  return(
    <div style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:14,padding:18,position:"relative",overflow:"hidden",boxShadow:"0 2px 10px rgba(37,99,235,0.05)"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+color+",transparent)"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><p style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:7}}>{label}</p><p style={{fontSize:28,fontWeight:800,color:"#0F172A",lineHeight:1}}>{val}</p>{sub&&<p style={{fontSize:12,color:"#64748B",marginTop:5}}>{sub}</p>}</div>
        <div style={{width:40,height:40,borderRadius:10,background:color+"18",display:"flex",alignItems:"center",justifyContent:"center",color,fontSize:17}}>{icon}</div>
      </div>
    </div>
  )
}

export default function AdminHome(){
  const[stats,setStats]=useState({customers:0,vendors:0,pending:0,approved:0,reviews:0,live:0,total:0})
  const[pending,setPending]=useState([]);const[pReviews,setPReviews]=useState([]);const[loading,setLoading]=useState(true)
  useEffect(()=>{fetchAll()},[])
  const fetchAll=async()=>{
    try{
      const[sR,vR,rR]=await Promise.all([api.get("/api/admin/stats"),api.get("/api/admin/vendors"),api.get("/api/admin/reviews/pending")])
      setStats(sR.data);setPending(vR.data.filter(v=>v.status==="PENDING"));setPReviews(rR.data)
    }catch(e){console.error(e)}
    setLoading(false)
  }
  const vendorAction=async(id,act)=>{try{if(act==="delete"){if(!window.confirm("Delete?"))return;await api.delete("/api/admin/vendors/"+id)}else await api.put("/api/admin/vendors/"+id+"/"+act);fetchAll()}catch{}}
  const approveReview=async(id)=>{try{await api.put("/api/admin/reviews/"+id+"/approve");fetchAll()}catch{}}
  const deleteReview=async(id)=>{try{await api.delete("/api/admin/reviews/"+id);fetchAll()}catch{}}
  return(
    <div style={{minHeight:"100vh",background:"#F0F4FF",display:"flex"}}>
      <AdminSidebar active="/admin"/>
      <div style={{marginLeft:220,flex:1,padding:"24px 28px 60px"}}>
        <div style={{marginBottom:22}}><h1 style={{fontSize:21,fontWeight:800,color:"#0F172A"}}>Dashboard</h1><p style={{color:"#64748B",fontSize:13,marginTop:2}}>Platform overview & pending actions</p></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:13,marginBottom:22}}>
          <Stat icon={<FaUsers/>} label="Total Users" val={stats.total} sub={stats.customers+" customers"} color="#2563EB"/>
          <Stat icon={<FaStore/>} label="Vendors" val={stats.vendors} sub={stats.live+" live"} color="#0891B2"/>
          <Stat icon={<FaStar/>} label="Reviews" val={stats.reviews} sub="All time" color="#D97706"/>
          <Stat icon={<FaBell/>} label="Pending" val={stats.pending} sub="Need action" color="#DC2626"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:22}}>
          {[{title:"User Breakdown",data:[{label:"Customers",val:stats.customers,color:"#2563EB"},{label:"Vendors",val:stats.vendors,color:"#0891B2"}]},{title:"Vendor Status",data:[{label:"Approved",val:stats.approved,color:"#16A34A"},{label:"Pending",val:stats.pending,color:"#D97706"}]}].map((ch,ci)=>(
            <div key={ci} style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:16,padding:20,boxShadow:"0 2px 10px rgba(37,99,235,0.05)"}}>
              <h3 style={{fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:16}}>{ch.title}</h3>
              <div style={{display:"flex",alignItems:"center",gap:20}}>
                <Donut data={ch.data.filter(d=>d.val>0).length?ch.data:[{val:1,color:"#E2E8F0"}]}/>
                <div style={{flex:1}}>{ch.data.map(d=><div key={d.label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}><div style={{width:10,height:10,borderRadius:"50%",background:d.color,flexShrink:0}}/><span style={{fontSize:12,color:"#64748B",flex:1}}>{d.label}</span><span style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{d.val}</span></div>)}</div>
              </div>
            </div>
          ))}
        </div>
        {pending.length>0&&<div style={{background:"white",border:"1.5px solid #FDE68A",borderRadius:16,padding:20,marginBottom:16,boxShadow:"0 2px 10px rgba(37,99,235,0.05)"}}>
          <h3 style={{fontSize:14,fontWeight:700,color:"#0F172A",marginBottom:14}}>⏳ Vendor Approvals ({pending.length})</h3>
          {pending.map(v=><div key={v.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:"#FFFBEB",borderRadius:10,border:"1.5px solid #FDE68A",marginBottom:7}}>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{v.shopName}</div><div style={{fontSize:12,color:"#64748B"}}>{v.ownerName} · {v.city||"–"}</div></div>
            <button onClick={()=>vendorAction(v.id,"approve")} style={{padding:"7px 14px",borderRadius:8,background:"#F0FDF4",border:"1.5px solid #BBF7D0",color:"#15803D",cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}><FaCheck size={10}/> Approve</button>
            <button onClick={()=>vendorAction(v.id,"reject")} style={{padding:"7px 14px",borderRadius:8,background:"#FEF2F2",border:"1.5px solid #FECACA",color:"#DC2626",cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}><FaTimes size={10}/> Reject</button>
          </div>)}
        </div>}
        {pReviews.length>0&&<div style={{background:"white",border:"1.5px solid #BFDBFE",borderRadius:16,padding:20,boxShadow:"0 2px 10px rgba(37,99,235,0.05)"}}>
          <h3 style={{fontSize:14,fontWeight:700,color:"#0F172A",marginBottom:14}}>💬 Review Approvals ({pReviews.length})</h3>
          {pReviews.slice(0,5).map(r=><div key={r.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"11px 14px",background:"#EFF6FF",borderRadius:10,border:"1.5px solid #BFDBFE",marginBottom:7}}>
            <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:13,fontWeight:700,color:"#0F172A"}}>{r.customerName||"Customer"}</span><span style={{fontSize:11,color:"#64748B"}}>→ {r.vendorName}</span><span style={{marginLeft:"auto",color:"#D97706",fontWeight:700,fontSize:13}}>{r.rating}★</span></div>{r.comment&&<p style={{fontSize:12,color:"#334155",lineHeight:1.4}}>{r.comment}</p>}</div>
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              <button onClick={()=>approveReview(r.id)} style={{padding:"6px 12px",borderRadius:7,background:"#F0FDF4",border:"1.5px solid #BBF7D0",color:"#15803D",cursor:"pointer",fontWeight:700,fontSize:11,fontFamily:"inherit"}}>✓ Approve</button>
              <button onClick={()=>deleteReview(r.id)} style={{padding:"6px 10px",borderRadius:7,background:"#FEF2F2",border:"1.5px solid #FECACA",color:"#DC2626",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}><FaTrash size={9}/></button>
            </div>
          </div>)}
        </div>}
        {!loading&&pending.length===0&&pReviews.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#94A3B8"}}><div style={{fontSize:40,marginBottom:10}}>✅</div><p style={{fontSize:14,fontWeight:700}}>All caught up! No pending actions.</p></div>}
      </div>
    </div>
  )
}
