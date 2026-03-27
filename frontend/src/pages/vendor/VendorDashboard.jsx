import React,{useState,useEffect,useRef} from "react"
import {useNavigate} from "react-router-dom"
import {FaChartBar,FaUtensils,FaBell,FaUser,FaSignOutAlt,FaStar,FaPlus,FaEdit,FaTrash,FaToggleOn,FaToggleOff,FaSave,FaTimes,FaCheck,FaFire,FaUpload,FaMapMarkerAlt} from "react-icons/fa"
import {useAuth} from "../../context/AuthContext"
import api from "../../api/axios"
const imgUrl = (u) => u?.startsWith('/') ? import.meta.env.VITE_URL + u : u;

function PhotoUploader({photos,onPhotosChange}){
  const fileRef=useRef();const[uploading,setUploading]=useState(false);const[err,setErr]=useState("")
  const handleFiles=async(files)=>{
    if(photos.length>=4){setErr("Max 4 photos");return}
    setUploading(true);setErr("")
    const newUrls=[]
    for(const file of Array.from(files).slice(0,4-photos.length)){
      if(!file.type.startsWith("image/"))continue
      if(file.size>5*1024*1024){setErr("Max 5MB");continue}
      try{const fd=new FormData();fd.append("file",file);const res=await api.post("/api/upload/vendor-photo",fd,{headers:{"Content-Type":"multipart/form-data"}});newUrls.push(res.data.url)}
      catch{const localUrl=URL.createObjectURL(file);newUrls.push(localUrl)}
    }
    onPhotosChange([...photos,...newUrls].slice(0,4));setUploading(false)
  }
  const removePhoto=(idx)=>onPhotosChange(photos.filter((_,i)=>i!==idx))
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <label style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.4px"}}>Shop Photos ({photos.length}/4)</label>
        {photos.length<4&&<button onClick={()=>fileRef.current.click()} disabled={uploading} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 13px",borderRadius:8,background:"linear-gradient(135deg,#2563EB,#1D4ED8)",border:"none",color:"white",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{uploading?<div style={{width:12,height:12,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>:<FaUpload size={11}/>}{uploading?"Uploading...":"Add Photo"}</button>}
      </div>
      {err&&<p style={{fontSize:11,color:"#DC2626",marginBottom:8}}>{err}</p>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {photos.map((url,i)=><div key={i} style={{position:"relative",aspectRatio:"1",borderRadius:11,overflow:"hidden",border:"1.5px solid #E0EAFF"}}><img src={imgUrl(url)} alt={"p"+i} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200"}}/>{i===0&&<div style={{position:"absolute",top:5,left:5,padding:"2px 7px",borderRadius:999,background:"rgba(37,99,235,0.9)",color:"white",fontSize:9,fontWeight:700}}>MAIN</div>}<button onClick={()=>removePhoto(i)} style={{position:"absolute",top:5,right:5,width:22,height:22,borderRadius:"50%",background:"rgba(220,38,38,0.85)",border:"none",color:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}><FaTimes/></button></div>)}
        {Array.from({length:4-photos.length}).map((_,i)=><div key={"slot"+i} onClick={i===0?()=>fileRef.current.click():undefined} style={{aspectRatio:"1",borderRadius:11,border:"2px dashed "+(i===0?"#BFDBFE":"#E2E8F0"),background:i===0?"#F8FAFF":"#FAFBFF",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:i===0?"pointer":"default",transition:"all 0.2s"}} onMouseEnter={e=>{if(i===0){e.currentTarget.style.borderColor="#2563EB";e.currentTarget.style.background="#EFF6FF"}}} onMouseLeave={e=>{if(i===0){e.currentTarget.style.borderColor="#BFDBFE";e.currentTarget.style.background="#F8FAFF"}}}>{i===0&&<><FaUpload color="#93C5FD" size={16}/><span style={{fontSize:9,color:"#94A3B8",marginTop:5,fontWeight:700,textAlign:"center"}}>Click to add</span></>}</div>)}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>
    </div>
  )
}

function Sidebar({tab,setTab,shop,onLogout,onToggleLive}){
  const nav=[{k:"dashboard",icon:<FaChartBar/>,label:"Dashboard"},{k:"menu",icon:<FaUtensils/>,label:"Menu"},{k:"notifications",icon:<FaBell/>,label:"Reviews"},{k:"profile",icon:<FaUser/>,label:"Profile"}]
  return(
    <div style={{width:220,background:"white",borderRight:"1.5px solid #E0EAFF",height:"100vh",position:"fixed",top:0,left:0,display:"flex",flexDirection:"column",zIndex:50,padding:"18px 12px",boxShadow:"2px 0 16px rgba(37,99,235,0.06)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 8px 16px",borderBottom:"1.5px solid #EFF6FF",marginBottom:14}}>
        <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#16A34A,#15803D)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏪</div>
        <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:800,color:"#0F172A",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{shop?.shopName||"My Shop"}</div><div style={{fontSize:10,color:"#16A34A",fontWeight:600}}>Vendor Panel</div></div>
      </div>
      <div style={{marginBottom:12,padding:"7px 11px",borderRadius:9,background:shop?.status==="APPROVED"?"#F0FDF4":"#FEF9C3",border:"1.5px solid "+(shop?.status==="APPROVED"?"#BBF7D0":"#FDE68A"),fontSize:11,fontWeight:700,color:shop?.status==="APPROVED"?"#15803D":"#A16207",textAlign:"center"}}>{shop?.status==="APPROVED"?"✅ Approved":"⏳ Pending Approval"}</div>
      <div style={{flex:1}}>{nav.map(n=><button key={n.k} onClick={()=>setTab(n.k)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 13px",borderRadius:10,marginBottom:3,fontSize:13,fontWeight:600,cursor:"pointer",border:"1.5px solid transparent",fontFamily:"inherit",transition:"all 0.2s",textAlign:"left",background:tab===n.k?"#EFF6FF":"transparent",borderColor:tab===n.k?"#BFDBFE":"transparent",color:tab===n.k?"#2563EB":"#64748B"}}><span>{n.icon}</span>{n.label}</button>)}</div>
      <div style={{borderTop:"1.5px solid #EFF6FF",paddingTop:12,display:"flex",flexDirection:"column",gap:6}}>
        {shop?.status==="APPROVED"&&<button onClick={onToggleLive} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"9px",borderRadius:10,background:shop?.isLive?"#FEF2F2":"#F0FDF4",border:"1.5px solid "+(shop?.isLive?"#FECACA":"#BBF7D0"),color:shop?.isLive?"#DC2626":"#16A34A",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{shop?.isLive?<><FaToggleOn/> Go Offline</>:<><FaToggleOff/> Go Live</>}</button>}
        <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 13px",borderRadius:10,background:"#FEF2F2",border:"1.5px solid #FECACA",color:"#DC2626",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><FaSignOutAlt size={12}/> Sign Out</button>
      </div>
    </div>
  )
}

function StatCard({icon,label,value,sub,color}){
  return(
    <div style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:14,padding:18,position:"relative",overflow:"hidden",boxShadow:"0 2px 10px rgba(37,99,235,0.05)"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${color},transparent)`}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><p style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:7}}>{label}</p><p style={{fontSize:26,fontWeight:800,color:"#0F172A",lineHeight:1}}>{value}</p>{sub&&<p style={{fontSize:12,color:"#64748B",marginTop:5}}>{sub}</p>}</div>
        <div style={{width:40,height:40,borderRadius:10,background:color+"18",display:"flex",alignItems:"center",justifyContent:"center",color,fontSize:17}}>{icon}</div>
      </div>
    </div>
  )
}

export default function VendorDashboard(){
  const[shop,setShop]=useState(null);const[menu,setMenu]=useState([]);const[reviews,setReviews]=useState([])
  const[tab,setTab]=useState("dashboard");const[newItem,setNewItem]=useState({name:"",description:"",category:"",price:"",isAvailable:true})
  const[editItem,setEditItem]=useState(null);const[showAdd,setShowAdd]=useState(false);const[saving,setSaving]=useState(false)
  const[msg,setMsg]=useState({text:"",ok:true});const[profile,setProfile]=useState({});const[editProf,setEditProf]=useState(false)
  const[photos,setPhotos]=useState([])
  const{logout}=useAuth();const navigate=useNavigate()
  useEffect(()=>{fetchAll()},[])
  const fetchAll=async()=>{
    try{
      const[sR,mR,rR]=await Promise.all([api.get("/api/vendor/my-shop"),api.get("/api/vendor/menu"),api.get("/api/vendor/reviews")])
      setShop(sR.data);setProfile(sR.data);setMenu(mR.data);setReviews(rR.data)
      const ph=sR.data.photoUrl||"";setPhotos(ph?ph.split("||").filter(Boolean):[])
    }catch(e){console.error(e)}
  }
  const flash=(text,ok=true)=>{setMsg({text,ok});setTimeout(()=>setMsg({text:""}),3000)}
  const toggleLive=async()=>{if(shop?.status!=="APPROVED"){flash("Admin approval needed!",false);return}try{const r=await api.put("/api/vendor/toggle-live");setShop(r.data);flash(r.data.isLive?"Shop LIVE! 🟢":"Shop Offline ⏸")}catch{flash("Failed",false)}}
  const addItem=async()=>{if(!newItem.name||!newItem.price){flash("Name & price required!",false);return}setSaving(true);try{const r=await api.post("/api/vendor/menu",{...newItem,price:parseFloat(newItem.price)});setMenu(p=>[...p,r.data]);setNewItem({name:"",description:"",category:"",price:"",isAvailable:true});setShowAdd(false);flash("Added! ✅")}catch{flash("Failed",false)}setSaving(false)}
  const updateItem=async(id,data)=>{try{const r=await api.put("/api/vendor/menu/"+id,data);setMenu(p=>p.map(m=>m.id===id?r.data:m));setEditItem(null);flash("Updated! ✅")}catch{flash("Failed",false)}}
  const deleteItem=async(id)=>{if(!window.confirm("Delete?"))return;try{await api.delete("/api/vendor/menu/"+id);setMenu(p=>p.filter(m=>m.id!==id));flash("Deleted")}catch{}}
  const saveProfile=async()=>{setSaving(true);try{const updated={...profile,photoUrl:photos.join("||")};const r=await api.put("/api/vendor/shop",updated);setShop(r.data);setProfile(r.data);setPhotos(r.data.photoUrl?r.data.photoUrl.split("||").filter(Boolean):[]);setEditProf(false);flash("Saved! ✅")}catch{flash("Save failed",false)}setSaving(false)}
  const cancelEdit=()=>{setEditProf(false);setProfile(shop);setPhotos(shop?.photoUrl?shop.photoUrl.split("||").filter(Boolean):[])}
  const fmt=t=>{if(!t)return "--";const[h,m]=t.split(":");const hr=parseInt(h);return(hr%12||12)+":"+m+" "+(hr>=12?"PM":"AM")}
  const avgRating=reviews.length?(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1):"0.0"
  const ratingDist=[5,4,3,2,1].map(r=>({star:r,count:reviews.filter(rv=>rv.rating===r).length,pct:reviews.length?(reviews.filter(rv=>rv.rating===r).length/reviews.length*100).toFixed(0):0}))
  const logoUrl=photos[0]||""
  if(!shop)return<div style={{minHeight:"100vh",background:"#F0F4FF",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:40,height:40,border:"3px solid #BFDBFE",borderTop:"3px solid #2563EB",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/></div>
  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#F0F4FF"}}>
      <Sidebar tab={tab} setTab={setTab} shop={shop} onLogout={()=>{logout();navigate("/login")}} onToggleLive={toggleLive}/>
      <div style={{marginLeft:220,flex:1,padding:"24px 28px 60px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22,flexWrap:"wrap",gap:12}}>
          <div><h1 style={{fontSize:20,fontWeight:800,color:"#0F172A"}}>{tab==="dashboard"?"Dashboard":tab==="menu"?"Menu Management":tab==="notifications"?"Customer Reviews":"My Profile"}</h1><p style={{fontSize:13,color:"#64748B",marginTop:2}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p></div>
          {msg.text&&<span style={{fontSize:12,fontWeight:700,padding:"6px 12px",borderRadius:20,background:msg.ok?"#F0FDF4":"#FEF2F2",color:msg.ok?"#15803D":"#DC2626",border:"1.5px solid "+(msg.ok?"#BBF7D0":"#FECACA")}}>{msg.text}</span>}
        </div>

        {tab==="dashboard"&&<div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:13,marginBottom:22}}>
            <StatCard icon={<FaStar/>} label="Avg Rating" value={avgRating} sub={reviews.length+" reviews"} color="#D97706"/>
            <StatCard icon={<FaUtensils/>} label="Menu Items" value={menu.length} sub={menu.filter(m=>m.isAvailable).length+" available"} color="#2563EB"/>
            <StatCard icon={<FaFire/>} label="Status" value={shop.isLive?"LIVE":"OFFLINE"} sub={shop.status} color={shop.isLive?"#16A34A":"#94A3B8"}/>
            <StatCard icon={<FaStar/>} label="5★ Reviews" value={ratingDist.find(r=>r.star===5)?.count||0} sub="Top ratings" color="#7C3AED"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:16,padding:20,boxShadow:"0 2px 10px rgba(37,99,235,0.05)"}}>
              <h3 style={{fontSize:14,fontWeight:700,color:"#0F172A",marginBottom:16}}>Rating Breakdown</h3>
              <div style={{textAlign:"center",marginBottom:14}}><span style={{fontSize:36,fontWeight:800,color:"#D97706"}}>{avgRating}</span><span style={{fontSize:14,color:"#D97706",marginLeft:4}}>★</span><p style={{fontSize:12,color:"#64748B",marginTop:2}}>{reviews.length} total reviews</p></div>
              {ratingDist.map(r=><div key={r.star} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:11,fontWeight:700,color:"#D97706",minWidth:18}}>{r.star}★</span><div style={{flex:1,height:7,background:"#EFF6FF",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:r.pct+"%",background:"linear-gradient(90deg,#2563EB,#0EA5E9)",borderRadius:4,transition:"width 1s ease"}}/></div><span style={{fontSize:11,color:"#94A3B8",minWidth:16}}>{r.count}</span></div>)}
            </div>
            <div style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:16,padding:20,boxShadow:"0 2px 10px rgba(37,99,235,0.05)"}}>
              <h3 style={{fontSize:14,fontWeight:700,color:"#0F172A",marginBottom:16}}>Top Items</h3>
              {menu.length===0?<p style={{color:"#94A3B8",fontSize:13,textAlign:"center",marginTop:20}}>No items yet</p>:[...menu].sort((a,b)=>b.price-a.price).slice(0,5).map((item,i)=><div key={item.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:11}}><span style={{fontSize:16}}>{["🥇","🥈","🥉","4️⃣","5️⃣"][i]}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#0F172A"}}>{item.name}</div><div style={{fontSize:11,color:"#94A3B8"}}>{item.category||"–"}</div></div><span style={{fontSize:14,fontWeight:800,color:"#2563EB"}}>₹{item.price}</span></div>)}
            </div>
          </div>
        </div>}

        {tab==="menu"&&<div>
          <div style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:16,padding:18,marginBottom:14,boxShadow:"0 2px 10px rgba(37,99,235,0.05)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:showAdd?14:0}}>
              <h3 style={{fontSize:15,fontWeight:700,color:"#0F172A"}}>Menu Items ({menu.length})</h3>
              <button onClick={()=>setShowAdd(!showAdd)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:9,background:showAdd?"#F1F5F9":"linear-gradient(135deg,#2563EB,#1D4ED8)",border:"none",color:showAdd?"#64748B":"white",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{showAdd?<><FaTimes size={11}/> Cancel</>:<><FaPlus size={11}/> Add Item</>}</button>
            </div>
            {showAdd&&<div style={{background:"#F8FAFF",border:"1.5px solid #DBEAFE",borderRadius:11,padding:14,animation:"fadeUp 0.2s ease"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:9,marginBottom:11}}>
                {[{k:"name",ph:"Item name *"},{k:"category",ph:"Category"},{k:"price",ph:"Price ₹ *",t:"number"},{k:"description",ph:"Description"}].map(f=><input key={f.k} type={f.t||"text"} placeholder={f.ph} value={newItem[f.k]} onChange={e=>setNewItem(p=>({...p,[f.k]:e.target.value}))} style={{padding:"9px 11px",background:"white",border:"1.5px solid #DBEAFE",borderRadius:8,color:"#0F172A",fontSize:13,fontFamily:"inherit",outline:"none",width:"100%"}} onFocus={e=>{e.target.style.borderColor="#2563EB";e.target.style.boxShadow="0 0 0 3px rgba(37,99,235,0.1)"}} onBlur={e=>{e.target.style.borderColor="#DBEAFE";e.target.style.boxShadow="none"}}/>)}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}><div style={{position:"relative",width:38,height:21}}><div onClick={()=>setNewItem(p=>({...p,isAvailable:!p.isAvailable}))} style={{position:"absolute",inset:0,background:newItem.isAvailable?"#2563EB":"#CBD5E1",borderRadius:999,cursor:"pointer",transition:"all 0.2s"}}><div style={{position:"absolute",height:15,width:15,left:newItem.isAvailable?20:3,top:3,background:"white",borderRadius:"50%",transition:"left 0.2s"}}/></div></div><span style={{fontSize:12,color:"#64748B",fontWeight:600}}>Available</span></label>
                <button onClick={addItem} disabled={saving} style={{marginLeft:"auto",padding:"9px 18px",borderRadius:8,background:"linear-gradient(135deg,#2563EB,#1D4ED8)",border:"none",color:"white",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}><FaPlus size={11}/> Add</button>
              </div>
            </div>}
          </div>
          {menu.length===0?<div style={{textAlign:"center",padding:"40px",color:"#94A3B8"}}><div style={{fontSize:40,marginBottom:10}}>🍽️</div><p style={{fontWeight:700}}>No items yet</p></div>:
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {menu.map(item=><div key={item.id} style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:12,padding:"11px 14px",display:"flex",alignItems:"center",gap:11,opacity:item.isAvailable?1:0.6,boxShadow:"0 2px 8px rgba(37,99,235,0.04)"}}>
              {editItem?.id===item.id?<><div style={{width:7,height:7,borderRadius:"50%",background:"#2563EB",flexShrink:0}}/><input value={editItem.name} onChange={e=>setEditItem(p=>({...p,name:e.target.value}))} style={{flex:1,padding:"6px 10px",border:"1.5px solid #BFDBFE",borderRadius:7,fontSize:13,fontFamily:"inherit",color:"#0F172A",background:"#F8FAFF",outline:"none"}}/><input type="number" value={editItem.price} onChange={e=>setEditItem(p=>({...p,price:e.target.value}))} style={{width:80,padding:"6px 10px",border:"1.5px solid #BFDBFE",borderRadius:7,fontSize:13,fontFamily:"inherit",color:"#0F172A",background:"#F8FAFF",outline:"none"}}/><button onClick={()=>updateItem(item.id,{...editItem,price:parseFloat(editItem.price)})} style={{padding:"6px 12px",borderRadius:7,background:"#DCFCE7",border:"1.5px solid #BBF7D0",color:"#15803D",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}><FaCheck size={9}/> Save</button><button onClick={()=>setEditItem(null)} style={{padding:"6px 9px",borderRadius:7,background:"#F1F5F9",border:"1.5px solid #E2E8F0",color:"#64748B",cursor:"pointer",fontSize:12}}><FaTimes/></button></>
              :<><div style={{width:7,height:7,borderRadius:"50%",background:item.isAvailable?"#16A34A":"#DC2626",flexShrink:0}}/><div style={{flex:1}}><span style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{item.name}</span>{item.category&&<span style={{fontSize:11,color:"#94A3B8",marginLeft:7}}>{item.category}</span>}{item.description&&<div style={{fontSize:11,color:"#64748B",marginTop:2}}>{item.description}</div>}</div><span style={{fontSize:14,fontWeight:800,color:"#2563EB"}}>₹{item.price}</span><div style={{display:"flex",gap:5}}><button onClick={()=>updateItem(item.id,{...item,isAvailable:!item.isAvailable})} style={{padding:"5px 10px",borderRadius:7,background:item.isAvailable?"#FEF2F2":"#F0FDF4",border:"1.5px solid "+(item.isAvailable?"#FECACA":"#BBF7D0"),color:item.isAvailable?"#DC2626":"#16A34A",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>{item.isAvailable?"Disable":"Enable"}</button><button onClick={()=>setEditItem({...item})} style={{padding:"5px 8px",borderRadius:7,background:"#EFF6FF",border:"1.5px solid #BFDBFE",color:"#2563EB",cursor:"pointer",fontSize:12}}><FaEdit/></button><button onClick={()=>deleteItem(item.id)} style={{padding:"5px 8px",borderRadius:7,background:"#FEF2F2",border:"1.5px solid #FECACA",color:"#DC2626",cursor:"pointer",fontSize:12}}><FaTrash/></button></div></>}
            </div>)}
          </div>}
        </div>}

        {tab==="notifications"&&<div>
          <div style={{background:"linear-gradient(135deg,#2563EB,#0EA5E9)",borderRadius:14,padding:"14px 18px",marginBottom:18,display:"flex",alignItems:"center",gap:12,boxShadow:"0 4px 16px rgba(37,99,235,0.2)"}}><div style={{fontSize:26}}>⭐</div><div><div style={{fontSize:18,fontWeight:800,color:"white"}}>{reviews.length} Customer Reviews</div><div style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>Average: {avgRating} ★</div></div></div>
          {reviews.length===0?<div style={{textAlign:"center",padding:"48px",color:"#94A3B8"}}><div style={{fontSize:40,marginBottom:10}}>💬</div><p style={{fontWeight:700}}>No reviews yet</p><p style={{fontSize:12,marginTop:4}}>Approved reviews appear here</p></div>:reviews.map(r=><div key={r.id} style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:13,padding:"13px 16px",marginBottom:8,display:"flex",gap:12,boxShadow:"0 2px 8px rgba(37,99,235,0.04)"}}>
            <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#2563EB,#0EA5E9)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"white",fontSize:13,flexShrink:0}}>{(r.customerName||"U")[0].toUpperCase()}</div>
            <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}><div><span style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{r.customerName||"Customer"}</span><span style={{fontSize:11,color:"#94A3B8",marginLeft:8}}>{r.createdAt?new Date(r.createdAt).toLocaleDateString("en-IN"):""}</span></div><div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(s=><span key={s} style={{color:s<=r.rating?"#D97706":"#E2E8F0",fontSize:13}}>★</span>)}</div></div>{r.comment&&<p style={{fontSize:13,color:"#334155",lineHeight:1.5}}>{r.comment}</p>}</div>
          </div>)}
        </div>}

        {tab==="profile"&&<div style={{maxWidth:600}}>
          <div style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 10px rgba(37,99,235,0.05)"}}>
            <div style={{padding:"20px 22px 18px",borderBottom:"1.5px solid #EFF6FF",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:54,height:54,borderRadius:13,overflow:"hidden",border:"2px solid #E0EAFF",flexShrink:0,background:"#F8FAFF"}}>{logoUrl?<img src={imgUrl(logoUrl)} alt="logo" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.src=""}}/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🏪</div>}</div>
                <div><div style={{fontSize:17,fontWeight:800,color:"#0F172A"}}>{shop.shopName}</div><div style={{fontSize:12,color:"#64748B",marginTop:2}}>{shop.ownerName}</div><span style={{padding:"2px 8px",borderRadius:999,fontSize:11,fontWeight:700,background:shop.status==="APPROVED"?"#DCFCE7":"#FEF9C3",color:shop.status==="APPROVED"?"#15803D":"#A16207",marginTop:4,display:"inline-block"}}>{shop.status==="APPROVED"?"✅ Approved":"⏳ Pending"}</span></div>
              </div>
              <button onClick={()=>editProf?cancelEdit():setEditProf(true)} style={{padding:"8px 14px",borderRadius:9,background:editProf?"#F1F5F9":"#EFF6FF",border:"1.5px solid "+(editProf?"#E2E8F0":"#BFDBFE"),color:editProf?"#64748B":"#2563EB",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>{editProf?<><FaTimes size={10}/> Cancel</>:<><FaEdit size={10}/> Edit</>}</button>
            </div>
            <div style={{padding:"20px 22px"}}>
              {msg.text&&<div style={{padding:"9px 12px",borderRadius:9,background:msg.ok?"#F0FDF4":"#FEF2F2",border:"1.5px solid "+(msg.ok?"#BBF7D0":"#FECACA"),color:msg.ok?"#15803D":"#DC2626",fontSize:12,fontWeight:600,marginBottom:16}}>{msg.text}</div>}

              {/* Basic Fields */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
                {[{k:"shopName",l:"Shop Name"},{k:"city",l:"City"},{k:"address",l:"Address"},{k:"category",l:"Category"},{k:"description",l:"Description"}].map(f=><div key={f.k} style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:10,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.3px"}}>{f.l}</label>{editProf?<input type="text" value={profile[f.k]||""} onChange={e=>setProfile(p=>({...p,[f.k]:e.target.value}))} style={{padding:"9px 11px",background:"#F8FAFF",border:"1.5px solid #DBEAFE",borderRadius:8,color:"#0F172A",fontSize:13,fontFamily:"inherit",outline:"none"}} onFocus={e=>{e.target.style.borderColor="#2563EB";e.target.style.boxShadow="0 0 0 3px rgba(37,99,235,0.1)"}} onBlur={e=>{e.target.style.borderColor="#DBEAFE";e.target.style.boxShadow="none"}}/>:<div style={{padding:"9px 11px",background:"#F8FAFF",border:"1.5px solid #EFF6FF",borderRadius:8,fontSize:13,color:"#334155"}}>{profile[f.k]||"–"}</div>}</div>)}
                <div style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:10,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.3px"}}>Price Range</label>{editProf?<select value={profile.priceRange||"BUDGET"} onChange={e=>setProfile(p=>({...p,priceRange:e.target.value}))} style={{padding:"9px 11px",background:"#F8FAFF",border:"1.5px solid #DBEAFE",borderRadius:8,color:"#0F172A",fontSize:13,fontFamily:"inherit",outline:"none"}}><option value="BUDGET">₹ Budget</option><option value="MEDIUM">₹₹ Medium</option><option value="PREMIUM">₹₹₹ Premium</option></select>:<div style={{padding:"9px 11px",background:"#F8FAFF",border:"1.5px solid #EFF6FF",borderRadius:8,fontSize:13,color:"#334155"}}>{profile.priceRange||"–"}</div>}</div>
              </div>

              {/* ✅ Google Maps URL Field */}
              <div style={{marginBottom:20,padding:"14px 16px",background:"#F0FDF4",borderRadius:12,border:"1.5px solid #BBF7D0"}}>
                <label style={{fontSize:10,fontWeight:700,color:"#15803D",textTransform:"uppercase",letterSpacing:"0.3px",display:"flex",alignItems:"center",gap:5,marginBottom:8}}>
                  <FaMapMarkerAlt size={11}/> Google Maps URL
                </label>
                {editProf?(
                  <div>
                    <input
                      type="url"
                      value={profile.googleMapsUrl||""}
                      onChange={e=>setProfile(p=>({...p,googleMapsUrl:e.target.value}))}
                      placeholder="https://maps.app.goo.gl/xxxxxx (or full Google Maps link)"
                      style={{width:"100%",padding:"9px 11px",background:"white",border:"1.5px solid #BBF7D0",borderRadius:8,color:"#0F172A",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
                      onFocus={e=>{e.target.style.borderColor="#16A34A";e.target.style.boxShadow="0 0 0 3px rgba(22,163,74,0.1)"}}
                      onBlur={e=>{e.target.style.borderColor="#BBF7D0";e.target.style.boxShadow="none"}}
                    />
                    <p style={{fontSize:11,color:"#64748B",marginTop:6}}>💡 Google Maps-ல் உங்கள் shop search பண்ணி → Share → Copy link paste பண்ணுங்க</p>
                  </div>
                ):(
                  profile.googleMapsUrl
                    ?<a href={profile.googleMapsUrl} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:8,background:"#16A34A",color:"white",fontSize:12,fontWeight:700,textDecoration:"none"}}>
                        <FaMapMarkerAlt size={11}/> View on Google Maps →
                      </a>
                    :<div style={{padding:"9px 11px",background:"white",border:"1.5px solid #E0EAFF",borderRadius:8,fontSize:13,color:"#94A3B8"}}>No Google Maps URL added. Click Edit to add.</div>
                )}
              </div>

              {/* Timings */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20,padding:"14px 16px",background:"#F8FAFF",borderRadius:12,border:"1.5px solid #EFF6FF"}}>
                {[{k:"openingTime",l:"🕐 Opening Time"},{k:"closingTime",l:"🕐 Closing Time"}].map(f=><div key={f.k} style={{display:"flex",flexDirection:"column",gap:4}}><label style={{fontSize:10,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.3px"}}>{f.l}</label>{editProf?<input type="time" value={profile[f.k]||""} onChange={e=>setProfile(p=>({...p,[f.k]:e.target.value}))} style={{padding:"9px 11px",background:"white",border:"1.5px solid #DBEAFE",borderRadius:8,color:"#0F172A",fontSize:13,fontFamily:"inherit",outline:"none"}} onFocus={e=>{e.target.style.borderColor="#2563EB";e.target.style.boxShadow="0 0 0 3px rgba(37,99,235,0.1)"}} onBlur={e=>{e.target.style.borderColor="#DBEAFE";e.target.style.boxShadow="none"}}/>:<div style={{padding:"9px 11px",background:"white",border:"1.5px solid #EFF6FF",borderRadius:8,fontSize:13,color:"#334155",fontWeight:600}}>{fmt(profile[f.k])}</div>}</div>)}
              </div>

              {/* Photos */}
              <div style={{padding:"16px",background:"#F8FAFF",borderRadius:12,border:"1.5px solid #EFF6FF",marginBottom:editProf?18:0}}>
                {editProf?<PhotoUploader photos={photos} onPhotosChange={setPhotos}/>:<><label style={{fontSize:10,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.3px",display:"block",marginBottom:10}}>Shop Photos ({photos.length}/4)</label>{photos.length===0?<p style={{fontSize:12,color:"#94A3B8",textAlign:"center",padding:"16px 0"}}>No photos yet. Click Edit to add.</p>:<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>{photos.map((url,i)=><div key={i} style={{position:"relative",aspectRatio:"1",borderRadius:10,overflow:"hidden",border:"1.5px solid #E0EAFF"}}><img src={imgUrl(url)} alt={"p"+i} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200"}}/>{i===0&&<div style={{position:"absolute",top:5,left:5,padding:"2px 6px",borderRadius:999,background:"rgba(37,99,235,0.85)",color:"white",fontSize:8,fontWeight:700}}>MAIN</div>}</div>)}{Array.from({length:4-photos.length}).map((_,i)=><div key={"e"+i} style={{aspectRatio:"1",borderRadius:10,border:"1.5px dashed #E0EAFF",background:"#FAFBFF"}}/>)}</div>}</>}
              </div>

              {editProf&&<div style={{display:"flex",gap:9,marginTop:18}}><button onClick={saveProfile} disabled={saving} style={{padding:"10px 20px",borderRadius:9,background:"linear-gradient(135deg,#2563EB,#1D4ED8)",border:"none",color:"white",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,boxShadow:"0 4px 12px rgba(37,99,235,0.25)"}}>{saving?<div style={{width:13,height:13,border:"2px solid rgba(255,255,255,0.4)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>:<FaSave size={12}/>} Save Changes</button><button onClick={cancelEdit} style={{padding:"10px 16px",borderRadius:9,background:"#F1F5F9",border:"1.5px solid #E2E8F0",color:"#64748B",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button></div>}
            </div>
          </div>
        </div>}
      </div>
    </div>
  )
}