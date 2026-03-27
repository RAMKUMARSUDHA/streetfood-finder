import React,{useState,useEffect} from "react"
import {FaTrash,FaSearch,FaCheck} from "react-icons/fa"
import api from "../../api/axios"
import {AdminSidebar} from "./AdminHome"
export default function AdminReviews(){
  const[reviews,setReviews]=useState([]);const[search,setSearch]=useState("");const[filter,setFilter]=useState("ALL")
  useEffect(()=>{api.get("/api/admin/reviews").then(r=>setReviews(r.data)).catch(()=>{})},[])
  const approveReview=async(id)=>{try{await api.put("/api/admin/reviews/"+id+"/approve");const r=await api.get("/api/admin/reviews");setReviews(r.data)}catch{}}
  const deleteReview=async(id)=>{if(!window.confirm("Delete?"))return;try{await api.delete("/api/admin/reviews/"+id);setReviews(p=>p.filter(r=>r.id!==id))}catch{}}
  const filtered=reviews.filter(r=>(r.comment?.toLowerCase().includes(search.toLowerCase())||r.customerName?.toLowerCase().includes(search.toLowerCase()))&&(filter==="ALL"||(filter==="PENDING"?!r.approved:filter==="APPROVED"?r.approved:r.rating===parseInt(filter))))
  return(
    <div style={{minHeight:"100vh",background:"#F0F4FF",display:"flex"}}>
      <AdminSidebar active="/admin/reviews"/>
      <div style={{marginLeft:220,flex:1,padding:"24px 28px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <div><h1 style={{fontSize:20,fontWeight:800,color:"#0F172A"}}>Review Management</h1><p style={{fontSize:13,color:"#64748B"}}>{reviews.length} reviews · {reviews.filter(r=>!r.approved).length} pending</p></div>
          <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,background:"white",border:"1.5px solid #E0EAFF",borderRadius:10,padding:"8px 13px"}}><FaSearch style={{color:"#94A3B8",fontSize:12}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:"none",border:"none",color:"#0F172A",fontSize:13,outline:"none",width:130,fontFamily:"inherit"}}/></div>
            {["ALL","PENDING","APPROVED","5","4","3","2","1"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 11px",borderRadius:7,background:filter===f?"#DBEAFE":"white",border:"1.5px solid "+(filter===f?"#BFDBFE":"#E0EAFF"),color:filter===f?"#2563EB":"#64748B",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{f==="ALL"?"All":f==="PENDING"?"⏳Pending":f==="APPROVED"?"✅Done":f+"★"}</button>)}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.map(r=>(
            <div key={r.id} style={{background:"white",border:"1.5px solid "+(r.approved?"#E0EAFF":"#BFDBFE"),borderRadius:13,padding:"13px 16px",display:"flex",alignItems:"flex-start",gap:13,boxShadow:"0 2px 8px rgba(37,99,235,0.04)"}}>
              <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#2563EB,#0EA5E9)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"white",fontSize:13,flexShrink:0}}>{(r.customerName||"U")[0].toUpperCase()}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{r.customerName||"Customer"}</span>
                  <span style={{fontSize:12,color:"#94A3B8"}}>→</span>
                  <span style={{fontSize:13,color:"#2563EB",fontWeight:600}}>{r.vendorName||"Vendor"}</span>
                  <div style={{display:"flex",gap:2,marginLeft:"auto"}}>{[1,2,3,4,5].map(s=><span key={s} style={{color:s<=r.rating?"#D97706":"#E2E8F0",fontSize:12}}>★</span>)}</div>
                </div>
                {r.comment&&<p style={{fontSize:13,color:"#334155",lineHeight:1.5}}>{r.comment}</p>}
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:5}}>
                  <span style={{fontSize:11,color:"#94A3B8"}}>{r.createdAt?new Date(r.createdAt).toLocaleDateString("en-IN"):""}</span>
                  <span style={{padding:"2px 8px",borderRadius:999,fontSize:10,fontWeight:700,background:r.approved?"#DCFCE7":"#FEF9C3",color:r.approved?"#15803D":"#A16207"}}>{r.approved?"Approved":"Pending"}</span>
                </div>
              </div>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                {!r.approved&&<button onClick={()=>approveReview(r.id)} style={{padding:"6px 12px",borderRadius:7,background:"#DCFCE7",border:"1.5px solid #BBF7D0",color:"#15803D",cursor:"pointer",fontWeight:700,fontSize:11,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}><FaCheck size={9}/> Approve</button>}
                <button onClick={()=>deleteReview(r.id)} style={{padding:"6px 9px",borderRadius:7,background:"#FEF2F2",border:"1.5px solid #FECACA",color:"#DC2626",cursor:"pointer",fontSize:12}}><FaTrash size={10}/></button>
              </div>
            </div>
          ))}
          {filtered.length===0&&<div style={{textAlign:"center",padding:"48px",color:"#94A3B8"}}><div style={{fontSize:40,marginBottom:10}}>⭐</div><p style={{fontWeight:700}}>No reviews found</p></div>}
        </div>
      </div>
    </div>
  )
}
