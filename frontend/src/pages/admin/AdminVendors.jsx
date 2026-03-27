import React,{useState,useEffect} from "react"
import {FaCheck,FaTimes,FaTrash,FaSearch,FaEye} from "react-icons/fa"
import {useNavigate} from "react-router-dom"
import api from "../../api/axios"
import {AdminSidebar} from "./AdminHome"
export default function AdminVendors(){
  const[vendors,setVendors]=useState([]);const[search,setSearch]=useState("");const[filter,setFilter]=useState("ALL");const navigate=useNavigate()
  useEffect(()=>{api.get("/api/admin/vendors").then(r=>setVendors(r.data)).catch(()=>{})},[])
  const action=async(id,act)=>{try{if(act==="delete"){if(!window.confirm("Delete?"))return;await api.delete("/api/admin/vendors/"+id)}else await api.put("/api/admin/vendors/"+id+"/"+act);const r=await api.get("/api/admin/vendors");setVendors(r.data)}catch{}}
  const filtered=vendors.filter(v=>(v.shopName?.toLowerCase().includes(search.toLowerCase())||v.ownerName?.toLowerCase().includes(search.toLowerCase()))&&(filter==="ALL"||v.status===filter))
  const sStyle={APPROVED:{bg:"#DCFCE7",c:"#15803D",bc:"#BBF7D0"},PENDING:{bg:"#FEF9C3",c:"#A16207",bc:"#FDE68A"},REJECTED:{bg:"#FEF2F2",c:"#DC2626",bc:"#FECACA"}}
  return(
    <div style={{minHeight:"100vh",background:"#F0F4FF",display:"flex"}}>
      <AdminSidebar active="/admin/vendors"/>
      <div style={{marginLeft:220,flex:1,padding:"24px 28px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <div><h1 style={{fontSize:20,fontWeight:800,color:"#0F172A"}}>Vendor Management</h1><p style={{fontSize:13,color:"#64748B"}}>{vendors.length} vendors</p></div>
          <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,background:"white",border:"1.5px solid #E0EAFF",borderRadius:10,padding:"8px 13px"}}><FaSearch style={{color:"#94A3B8",fontSize:12}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:"none",border:"none",color:"#0F172A",fontSize:13,outline:"none",width:130,fontFamily:"inherit"}}/></div>
            {["ALL","PENDING","APPROVED","REJECTED"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 13px",borderRadius:8,background:filter===f?"#DBEAFE":"white",border:"1.5px solid "+(filter===f?"#BFDBFE":"#E0EAFF"),color:filter===f?"#2563EB":"#64748B",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{f}</button>)}
          </div>
        </div>
        <div style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 10px rgba(37,99,235,0.05)"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr>{["Shop","Owner","City","Status","Live","Rating","Actions"].map(h=><th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.7px",borderBottom:"1.5px solid #E0EAFF"}}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(v=>{const ss=sStyle[v.status]||sStyle.PENDING;return(
                  <tr key={v.id} onMouseEnter={e=>[...e.currentTarget.cells].forEach(c=>c.style.background="#F8FAFF")} onMouseLeave={e=>[...e.currentTarget.cells].forEach(c=>c.style.background="")}>
                    <td style={{padding:"12px 14px",borderBottom:"1px solid #EFF6FF"}}><div style={{fontWeight:700,color:"#0F172A"}}>{v.shopName}</div><div style={{fontSize:11,color:"#94A3B8"}}>#{v.id}</div></td>
                    <td style={{padding:"12px 14px",borderBottom:"1px solid #EFF6FF",color:"#334155"}}>{v.ownerName}</td>
                    <td style={{padding:"12px 14px",borderBottom:"1px solid #EFF6FF",color:"#64748B"}}>{v.city||"–"}</td>
                    <td style={{padding:"12px 14px",borderBottom:"1px solid #EFF6FF"}}><span style={{padding:"3px 9px",borderRadius:999,fontSize:11,fontWeight:700,background:ss.bg,color:ss.c,border:"1.5px solid "+ss.bc}}>{v.status}</span></td>
                    <td style={{padding:"12px 14px",borderBottom:"1px solid #EFF6FF"}}><span style={{fontWeight:700,fontSize:12,color:v.isLive?"#16A34A":"#94A3B8"}}>{v.isLive?"● Live":"○ Off"}</span></td>
                    <td style={{padding:"12px 14px",borderBottom:"1px solid #EFF6FF",color:"#D97706",fontWeight:700}}>{(v.avgRating||0).toFixed(1)}★</td>
                    <td style={{padding:"12px 14px",borderBottom:"1px solid #EFF6FF"}}><div style={{display:"flex",gap:5}}>
                      <button onClick={()=>navigate("/vendor/"+v.id)} style={{padding:"5px 8px",borderRadius:6,background:"#DBEAFE",border:"1.5px solid #BFDBFE",color:"#2563EB",cursor:"pointer",fontSize:11}}><FaEye/></button>
                      {v.status!=="APPROVED"&&<button onClick={()=>action(v.id,"approve")} style={{padding:"5px 8px",borderRadius:6,background:"#DCFCE7",border:"1.5px solid #BBF7D0",color:"#15803D",cursor:"pointer",fontSize:11}}><FaCheck/></button>}
                      {v.status!=="REJECTED"&&<button onClick={()=>action(v.id,"reject")} style={{padding:"5px 8px",borderRadius:6,background:"#FEF9C3",border:"1.5px solid #FDE68A",color:"#A16207",cursor:"pointer",fontSize:11}}><FaTimes/></button>}
                      <button onClick={()=>action(v.id,"delete")} style={{padding:"5px 8px",borderRadius:6,background:"#FEF2F2",border:"1.5px solid #FECACA",color:"#DC2626",cursor:"pointer",fontSize:11}}><FaTrash/></button>
                    </div></td>
                  </tr>
                )})}
              </tbody>
            </table>
            {filtered.length===0&&<div style={{textAlign:"center",padding:"40px",color:"#94A3B8"}}><div style={{fontSize:36,marginBottom:8}}>🏪</div><p style={{fontWeight:700}}>No vendors found</p></div>}
          </div>
        </div>
      </div>
    </div>
  )
}
