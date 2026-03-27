import React,{useState,useEffect} from "react"
import {FaTrash,FaSearch} from "react-icons/fa"
import api from "../../api/axios"
import {AdminSidebar} from "./AdminHome"
export default function AdminUsers(){
  const[users,setUsers]=useState([]);const[search,setSearch]=useState("");const[filter,setFilter]=useState("ALL")
  useEffect(()=>{api.get("/api/admin/users").then(r=>setUsers(r.data)).catch(()=>{})},[])
  const del=async(id)=>{if(!window.confirm("Delete?"))return;try{await api.delete("/api/admin/users/"+id);setUsers(p=>p.filter(u=>u.id!==id))}catch{}}
  const filtered=users.filter(u=>(u.name?.toLowerCase().includes(search.toLowerCase())||u.email?.toLowerCase().includes(search.toLowerCase()))&&(filter==="ALL"||u.role===filter))
  const rStyle={CUSTOMER:{bg:"#DBEAFE",c:"#1D4ED8",bc:"#BFDBFE"},VENDOR:{bg:"#DCFCE7",c:"#15803D",bc:"#BBF7D0"},ADMIN:{bg:"#F5F3FF",c:"#6D28D9",bc:"#DDD6FE"}}
  return(
    <div style={{minHeight:"100vh",background:"#F0F4FF",display:"flex"}}>
      <AdminSidebar active="/admin/users"/>
      <div style={{marginLeft:220,flex:1,padding:"24px 28px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <div><h1 style={{fontSize:20,fontWeight:800,color:"#0F172A"}}>User Management</h1><p style={{fontSize:13,color:"#64748B"}}>{users.length} users</p></div>
          <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,background:"white",border:"1.5px solid #E0EAFF",borderRadius:10,padding:"8px 13px"}}><FaSearch style={{color:"#94A3B8",fontSize:12}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users..." style={{background:"none",border:"none",color:"#0F172A",fontSize:13,outline:"none",width:140,fontFamily:"inherit"}}/></div>
            {["ALL","CUSTOMER","VENDOR"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 13px",borderRadius:8,background:filter===f?"#DBEAFE":"white",border:"1.5px solid "+(filter===f?"#BFDBFE":"#E0EAFF"),color:filter===f?"#2563EB":"#64748B",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{f}</button>)}
          </div>
        </div>
        <div style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 10px rgba(37,99,235,0.05)"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr>{["User","Email","Phone","Role","Action"].map(h=><th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.7px",borderBottom:"1.5px solid #E0EAFF"}}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(u=>{const rs=rStyle[u.role]||rStyle.CUSTOMER;return(
                  <tr key={u.id} onMouseEnter={e=>[...e.currentTarget.cells].forEach(c=>c.style.background="#F8FAFF")} onMouseLeave={e=>[...e.currentTarget.cells].forEach(c=>c.style.background="")}>
                    <td style={{padding:"12px 14px",borderBottom:"1px solid #EFF6FF"}}><div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#2563EB,#0EA5E9)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"white",fontSize:13,flexShrink:0}}>{(u.name||"U")[0].toUpperCase()}</div><div><div style={{fontWeight:700,color:"#0F172A"}}>{u.name}</div><div style={{fontSize:11,color:"#94A3B8"}}>#{u.id}</div></div></div></td>
                    <td style={{padding:"12px 14px",borderBottom:"1px solid #EFF6FF",color:"#334155"}}>{u.email}</td>
                    <td style={{padding:"12px 14px",borderBottom:"1px solid #EFF6FF",color:"#64748B"}}>{u.phone||"–"}</td>
                    <td style={{padding:"12px 14px",borderBottom:"1px solid #EFF6FF"}}><span style={{padding:"3px 9px",borderRadius:999,fontSize:11,fontWeight:700,background:rs.bg,color:rs.c,border:"1.5px solid "+rs.bc}}>{u.role}</span></td>
                    <td style={{padding:"12px 14px",borderBottom:"1px solid #EFF6FF"}}>{u.role!=="ADMIN"&&<button onClick={()=>del(u.id)} style={{padding:"6px 10px",borderRadius:7,background:"#FEF2F2",border:"1.5px solid #FECACA",color:"#DC2626",cursor:"pointer",fontSize:12,fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}><FaTrash size={10}/> Delete</button>}</td>
                  </tr>
                )})}
              </tbody>
            </table>
            {filtered.length===0&&<div style={{textAlign:"center",padding:"40px",color:"#94A3B8"}}><div style={{fontSize:36,marginBottom:8}}>👥</div><p style={{fontWeight:700}}>No users found</p></div>}
          </div>
        </div>
      </div>
    </div>
  )
}
