import React,{useState,useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {FaHome,FaBell,FaUser,FaSignOutAlt,FaSearch,FaMapMarkerAlt,FaCrosshairs,FaFilter,FaStar,FaClock,FaPhone,FaHeart,FaRegHeart,FaTimes,FaEdit,FaSave} from "react-icons/fa"
import {useAuth} from "../../context/AuthContext"
import api from "../../api/axios"
const imgUrl = (u) => u?.startsWith('/') ? import.meta.env.VITE_URL + u : u;

function Sidebar({tab,setTab,user,onLogout}){
  const nav=[{k:"dashboard",icon:<FaHome/>,label:"Dashboard"},{k:"notifications",icon:<FaBell/>,label:"Notifications"},{k:"profile",icon:<FaUser/>,label:"Profile"}]
  return(
    <div style={{width:220,background:"white",borderRight:"1.5px solid #E0EAFF",height:"100vh",position:"fixed",top:0,left:0,display:"flex",flexDirection:"column",zIndex:50,padding:"18px 12px",boxShadow:"2px 0 16px rgba(37,99,235,0.06)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 8px 16px",borderBottom:"1.5px solid #EFF6FF",marginBottom:14}}>
        <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#2563EB,#0EA5E9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🍜</div>
        <div><div style={{fontSize:12,fontWeight:800,color:"#0F172A"}}>Street Food</div><div style={{fontSize:10,color:"#2563EB",fontWeight:600}}>Finder</div></div>
      </div>
      <div style={{background:"#F0F4FF",borderRadius:10,padding:"9px 11px",marginBottom:14,display:"flex",alignItems:"center",gap:8,border:"1.5px solid #E0EAFF"}}>
        <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#2563EB,#0EA5E9)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"white",fontSize:13,flexShrink:0}}>{(user?.name||"U")[0].toUpperCase()}</div>
        <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:700,color:"#0F172A",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user?.name||"Customer"}</div><div style={{fontSize:10,color:"#64748B"}}>Customer</div></div>
      </div>
      <div style={{flex:1}}>{nav.map(n=><button key={n.k} onClick={()=>setTab(n.k)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 13px",borderRadius:10,marginBottom:3,fontSize:13,fontWeight:600,cursor:"pointer",border:"1.5px solid transparent",fontFamily:"inherit",transition:"all 0.2s",textAlign:"left",background:tab===n.k?"#EFF6FF":"transparent",borderColor:tab===n.k?"#BFDBFE":"transparent",color:tab===n.k?"#2563EB":"#64748B"}}><span style={{fontSize:14}}>{n.icon}</span>{n.label}</button>)}</div>
      <div style={{borderTop:"1.5px solid #EFF6FF",paddingTop:12}}><button onClick={onLogout} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"9px 13px",borderRadius:10,background:"#FEF2F2",border:"1.5px solid #FECACA",color:"#DC2626",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><FaSignOutAlt size={12}/> Sign Out</button></div>
    </div>
  )
}

function VendorCard({v,userLoc,onView,onFav,isFav}){
  const dist=()=>{if(!userLoc||!v.lat||!v.lng)return null;const R=6371,dLat=(v.lat-userLoc[0])*Math.PI/180,dLon=(v.lng-userLoc[1])*Math.PI/180;const x=Math.sin(dLat/2)**2+Math.cos(userLoc[0]*Math.PI/180)*Math.cos(v.lat*Math.PI/180)*Math.sin(dLon/2)**2;return(R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))).toFixed(1)}
  const fmt=t=>{if(!t)return "--";const[h,m]=t.split(":");const hr=parseInt(h);return(hr%12||12)+":"+m+" "+(hr>=12?"PM":"AM")}
  const d=dist()
  const mainPhoto=imgUrl((v.photoUrl&&v.photoUrl.split("||")[0]))||"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"
  return(
    <div style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:16,overflow:"hidden",cursor:"pointer",transition:"all 0.22s",boxShadow:"0 2px 12px rgba(37,99,235,0.06)"}} onClick={()=>onView(v.id)} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(37,99,235,0.13)"}} onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 12px rgba(37,99,235,0.06)"}}>
      <div style={{position:"relative",height:170,overflow:"hidden"}}>
        <img src={mainPhoto} alt={v.shopName} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.3s"}} onError={e=>e.target.src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"} onMouseEnter={e=>e.target.style.transform="scale(1.05)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 55%,rgba(0,0,0,0.4) 100%)"}}/>
        <div style={{position:"absolute",top:9,left:9,display:"flex",gap:5}}>
          <span style={{padding:"3px 8px",borderRadius:999,fontSize:10,fontWeight:700,background:v.isLive?"rgba(22,163,74,0.9)":"rgba(0,0,0,0.55)",color:"white",display:"flex",alignItems:"center",gap:4}}><span style={{width:5,height:5,borderRadius:"50%",background:"white",animation:v.isLive?"pulse 1.5s infinite":"none"}}/>{v.isLive?"Open":"Closed"}</span>
          {d&&<span style={{padding:"3px 8px",borderRadius:999,fontSize:10,fontWeight:700,background:"rgba(37,99,235,0.85)",color:"white"}}>📍{d}km</span>}
        </div>
        <div style={{position:"absolute",bottom:9,left:9,padding:"2px 8px",borderRadius:999,fontSize:11,fontWeight:800,background:"rgba(255,255,255,0.9)",color:"#2563EB"}}>{v.priceRange==="BUDGET"?"₹":v.priceRange==="MEDIUM"?"₹₹":"₹₹₹"}</div>
        <button onClick={e=>{e.stopPropagation();onFav(v.id,isFav)}} style={{position:"absolute",top:9,right:9,width:30,height:30,borderRadius:"50%",background:isFav?"rgba(220,38,38,0.9)":"rgba(255,255,255,0.85)",border:"none",color:isFav?"white":"#64748B",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,transition:"all 0.2s"}}>{isFav?<FaHeart/>:<FaRegHeart/>}</button>
      </div>
      <div style={{padding:"12px 14px"}}>
        <div style={{display:"flex",gap:4,marginBottom:5,flexWrap:"wrap"}}>{(v.category||"").split(",").slice(0,2).map(c=><span key={c} style={{padding:"2px 7px",borderRadius:999,fontSize:10,fontWeight:700,background:"#DBEAFE",color:"#2563EB"}}>{c.trim()}</span>)}</div>
        <h3 style={{fontSize:14,fontWeight:800,color:"#0F172A",marginBottom:4}}>{v.shopName}</h3>
        <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6}}>{[1,2,3,4,5].map(s=><FaStar key={s} size={10} color={s<=Math.round(v.avgRating||0)?"#D97706":"#E2E8F0"}/>)}<span style={{fontSize:12,fontWeight:700,color:"#D97706"}}>{(v.avgRating||0).toFixed(1)}</span><span style={{fontSize:11,color:"#94A3B8"}}>({v.totalReviews||0})</span></div>
        <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#64748B"}}><FaMapMarkerAlt style={{color:"#2563EB",fontSize:9}}/>{v.address||v.city||"–"}</div>
          <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#64748B"}}><FaClock style={{color:"#0891B2",fontSize:9}}/>{fmt(v.openingTime)} – {fmt(v.closingTime)}</div>
        </div>
        <div style={{display:"flex",gap:7}}>
          <button onClick={e=>{e.stopPropagation();onView(v.id)}} style={{flex:1,padding:"8px",borderRadius:9,background:"linear-gradient(135deg,#2563EB,#1D4ED8)",border:"none",color:"white",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>View Details</button>
          {v.ownerPhone&&<a href={"tel:"+v.ownerPhone} onClick={e=>e.stopPropagation()} style={{padding:"8px 11px",borderRadius:9,background:"#F0FDF4",border:"1.5px solid #BBF7D0",color:"#16A34A",display:"flex",alignItems:"center",justifyContent:"center"}}><FaPhone size={11}/></a>}
        </div>
      </div>
    </div>
  )
}

export default function CustomerDashboard(){
  const[tab,setTab]=useState("dashboard");const[vendors,setVendors]=useState([]);const[filtered,setFiltered]=useState([])
  const[loading,setLoading]=useState(true);const[search,setSearch]=useState("");const[location,setLocation]=useState("")
  const[sugg,setSugg]=useState([]);const[showSugg,setShowSugg]=useState(false);const[userLoc,setUserLoc]=useState(null)
  const[locLoading,setLocLoading]=useState(false);const[showF,setShowF]=useState(false);const[favs,setFavs]=useState([])
  const[filters,setFilters]=useState({rating:"",price:"",sort:"default",live:false});const[liveVendors,setLiveVendors]=useState([])
  const[profile,setProfile]=useState({name:"",email:"",phone:""});const[editMode,setEditMode]=useState(false);const[profMsg,setProfMsg]=useState("")
  const FOOD_SUGGEST=["Biryani","Dosa","Idli","Parotta","Noodles","Juice","Tea","Samosa","Pizza","Kothu Parotta","Pongal","Fried Rice","Vadai","Momos"]
  const{user,logout}=useAuth();const navigate=useNavigate()
  useEffect(()=>{fetchVendors()},[])
  useEffect(()=>{applyFilters()},[vendors,search,location,filters,userLoc])
  useEffect(()=>{if(user)setProfile({name:user.name||"",email:user.email||"",phone:user.phone||""})},[user])
  const fetchVendors=async()=>{
    try{const r=await api.get("/api/vendors");setVendors(r.data);setLiveVendors(r.data.filter(v=>v.isLive));try{const fr=await api.get("/api/favorites");setFavs(fr.data.map(v=>v.id))}catch{}}catch(e){console.error(e)}
    setLoading(false)
  }
  const calcDist=(a,b)=>{if(!a||!b[0]||!b[1])return null;const R=6371,dLat=(b[0]-a[0])*Math.PI/180,dLon=(b[1]-a[1])*Math.PI/180;const x=Math.sin(dLat/2)**2+Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*Math.sin(dLon/2)**2;return parseFloat((R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))).toFixed(1))}
  const applyFilters=()=>{
    let d=[...vendors];const q=search.trim().toLowerCase();const loc=location.trim().toLowerCase()
    if(q)d=d.filter(v=>v.shopName?.toLowerCase().includes(q)||v.category?.toLowerCase().includes(q))
    if(loc)d=d.filter(v=>v.city?.toLowerCase().includes(loc)||v.address?.toLowerCase().includes(loc))
    if(filters.live)d=d.filter(v=>v.isLive)
    if(filters.rating)d=d.filter(v=>(v.avgRating||0)>=parseFloat(filters.rating))
    if(filters.price)d=d.filter(v=>v.priceRange===filters.price)
    if(filters.sort==="rating")d.sort((a,b)=>(b.avgRating||0)-(a.avgRating||0))
    else if(filters.sort==="distance"&&userLoc)d.sort((a,b)=>(calcDist(userLoc,[a.lat,a.lng])||999)-(calcDist(userLoc,[b.lat,b.lng])||999))
    setFiltered(d)
  }
  const getLocation=()=>{setLocLoading(true);navigator.geolocation.getCurrentPosition(pos=>{setUserLoc([pos.coords.latitude,pos.coords.longitude]);setLocLoading(false)},()=>setLocLoading(false))}
  const onSearch=v=>{setSearch(v);if(v.length>1){const s=[...new Set([...FOOD_SUGGEST.filter(f=>f.toLowerCase().includes(v.toLowerCase())),...vendors.filter(x=>x.shopName?.toLowerCase().includes(v.toLowerCase())).map(x=>x.shopName)])].slice(0,7);setSugg(s);setShowSugg(true)}else{setSugg([]);setShowSugg(false)}}
  const toggleFav=async(vendorId,currentlyFav)=>{try{if(currentlyFav){await api.delete("/api/favorites/"+vendorId);setFavs(prev=>prev.filter(id=>id!==vendorId))}else{await api.post("/api/favorites/"+vendorId);setFavs(prev=>[...prev,vendorId])}}catch(e){console.error(e)}}
  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#F0F4FF"}}>
      <Sidebar tab={tab} setTab={setTab} user={user} onLogout={()=>{logout();navigate("/login")}}/>
      <div style={{marginLeft:220,flex:1,padding:"24px 28px 60px",minHeight:"100vh"}}>
        {tab==="dashboard"&&<div>
          <div style={{marginBottom:20}}><h1 style={{fontSize:21,fontWeight:800,color:"#0F172A"}}>Good {new Date().getHours()<12?"Morning":new Date().getHours()<17?"Afternoon":"Evening"}, {user?.name?.split(" ")[0]||"there"}! 👋</h1><p style={{color:"#64748B",fontSize:13,marginTop:3}}>Find your favourite street food</p></div>
          <div style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:16,padding:16,marginBottom:18,boxShadow:"0 2px 16px rgba(37,99,235,0.07)"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <div><label style={{fontSize:11,fontWeight:700,color:"#64748B",display:"block",marginBottom:5}}>WHAT TO EAT?</label>
                <div style={{position:"relative"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,background:"#F8FAFF",border:"1.5px solid #E0EAFF",borderRadius:10,padding:"9px 12px"}}><FaSearch style={{color:"#2563EB",fontSize:13,flexShrink:0}}/><input value={search} onChange={e=>onSearch(e.target.value)} onFocus={()=>sugg.length&&setShowSugg(true)} onBlur={()=>setTimeout(()=>setShowSugg(false),150)} placeholder="Biryani, Dosa, Parotta..." style={{flex:1,background:"none",border:"none",color:"#0F172A",fontSize:14,outline:"none",fontFamily:"inherit"}}/>{search&&<button onClick={()=>{setSearch("");setSugg([]);setShowSugg(false)}} style={{background:"none",border:"none",color:"#94A3B8",cursor:"pointer",padding:0}}><FaTimes size={11}/></button>}</div>
                  {showSugg&&sugg.length>0&&<div style={{position:"absolute",top:"calc(100%+4px)",left:0,right:0,background:"white",border:"1.5px solid #E0EAFF",borderRadius:10,overflow:"hidden",zIndex:200,boxShadow:"0 8px 24px rgba(37,99,235,0.1)",marginTop:4}}>
                    {sugg.map((s,i)=><div key={i} onMouseDown={()=>{setSearch(s);setShowSugg(false)}} style={{padding:"9px 13px",cursor:"pointer",fontSize:13,color:"#334155",borderBottom:i<sugg.length-1?"1px solid #EFF6FF":"none",display:"flex",alignItems:"center",gap:8}} onMouseEnter={e=>e.currentTarget.style.background="#EFF6FF"} onMouseLeave={e=>e.currentTarget.style.background="white"}><FaSearch style={{color:"#2563EB",fontSize:10}}/>{s}</div>)}
                  </div>}
                </div>
              </div>
              <div><label style={{fontSize:11,fontWeight:700,color:"#64748B",display:"block",marginBottom:5}}>WHERE?</label>
                <div style={{display:"flex",gap:7}}>
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:8,background:"#F8FAFF",border:"1.5px solid #E0EAFF",borderRadius:10,padding:"9px 12px"}}><FaMapMarkerAlt style={{color:"#2563EB",fontSize:13,flexShrink:0}}/><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Salem, Erode..." style={{flex:1,background:"none",border:"none",color:"#0F172A",fontSize:14,outline:"none",fontFamily:"inherit"}}/></div>
                  <button onClick={getLocation} disabled={locLoading} style={{padding:"9px 12px",borderRadius:10,background:userLoc?"#DCFCE7":"#EFF6FF",border:"1.5px solid "+(userLoc?"#BBF7D0":"#BFDBFE"),color:userLoc?"#16A34A":"#2563EB",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:700,fontFamily:"inherit",flexShrink:0}}>{locLoading?<div style={{width:12,height:12,border:"2px solid currentColor",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>:<FaCrosshairs size={12}/>}{userLoc?"✓":"Near"}</button>
                </div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <button onClick={()=>setShowF(!showF)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 13px",borderRadius:8,background:showF?"#DBEAFE":"#F8FAFF",border:"1.5px solid "+(showF?"#BFDBFE":"#E0EAFF"),color:showF?"#2563EB":"#64748B",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><FaFilter size={10}/> Filters</button>
              {userLoc&&<span style={{fontSize:12,color:"#16A34A",fontWeight:600}}>✅ Location set</span>}
              <span style={{fontSize:12,color:"#94A3B8",marginLeft:"auto"}}>{filtered.length} stalls found</span>
            </div>
            {showF&&<div style={{marginTop:12,paddingTop:12,borderTop:"1.5px solid #EFF6FF",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,animation:"fadeUp 0.2s ease"}}>
              {[{label:"Rating",key:"rating",opts:[["","Any"],["4","4+ ★"],["3","3+ ★"]]},{label:"Budget",key:"price",opts:[["","Any"],["BUDGET","₹ Budget"],["MEDIUM","₹₹ Medium"],["PREMIUM","₹₹₹ Premium"]]},{label:"Sort",key:"sort",opts:[["default","Default"],["rating","Top Rated"],["distance","Nearest"]]}].map(f=>(
                <div key={f.key}><label style={{fontSize:11,fontWeight:700,color:"#94A3B8",display:"block",marginBottom:5}}>{f.label}</label><select value={filters[f.key]} onChange={e=>setFilters(p=>({...p,[f.key]:e.target.value}))} style={{width:"100%",padding:"8px 10px",background:"#F8FAFF",border:"1.5px solid #E0EAFF",borderRadius:8,color:"#0F172A",fontSize:13,fontFamily:"inherit",outline:"none"}}>{f.opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>
              ))}
              <div><label style={{fontSize:11,fontWeight:700,color:"#94A3B8",display:"block",marginBottom:8}}>Status</label><label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}><div style={{position:"relative",width:38,height:21}}><div onClick={()=>setFilters(p=>({...p,live:!p.live}))} style={{position:"absolute",inset:0,background:filters.live?"#2563EB":"#CBD5E1",borderRadius:999,cursor:"pointer",transition:"all 0.2s"}}><div style={{position:"absolute",height:15,width:15,left:filters.live?20:3,top:3,background:"white",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/></div></div><span style={{fontSize:12,color:filters.live?"#2563EB":"#64748B",fontWeight:600}}>Open Only</span></label></div>
              <div style={{display:"flex",alignItems:"flex-end"}}><button onClick={()=>setFilters({rating:"",price:"",sort:"default",live:false})} style={{width:"100%",padding:"8px",borderRadius:8,background:"#FEF2F2",border:"1.5px solid #FECACA",color:"#DC2626",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Clear All</button></div>
            </div>}
          </div>
          {loading?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>{[1,2,3,4].map(i=><div key={i} style={{background:"white",borderRadius:16,overflow:"hidden",border:"1.5px solid #E0EAFF"}}><div style={{height:170,background:"linear-gradient(90deg,#EEF2FF 25%,#E0E7FF 50%,#EEF2FF 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"}}/><div style={{padding:12,display:"flex",flexDirection:"column",gap:7}}><div style={{height:13,width:"55%",borderRadius:6,background:"#EEF2FF"}}/><div style={{height:10,width:"35%",borderRadius:6,background:"#EEF2FF"}}/></div></div>)}</div>
          :filtered.length===0?<div style={{textAlign:"center",padding:"48px",color:"#94A3B8"}}><div style={{fontSize:48,marginBottom:12}}>🍽️</div><h3 style={{fontSize:16,fontWeight:700,color:"#0F172A",marginBottom:4}}>No stalls found</h3><p style={{fontSize:13}}>Try different food or location</p></div>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>{filtered.map((v,i)=><div key={v.id} style={{animation:"fadeUp 0.4s ease "+(i*0.05)+"s both"}}><VendorCard v={v} userLoc={userLoc} onView={id=>navigate("/vendor/"+id)} onFav={toggleFav} isFav={favs.includes(v.id)}/></div>)}</div>}
        </div>}
        {tab==="notifications"&&<div>
          <div style={{marginBottom:20}}><h1 style={{fontSize:20,fontWeight:800,color:"#0F172A"}}>Notifications 🔔</h1><p style={{color:"#64748B",fontSize:13,marginTop:2}}>Stalls open right now</p></div>
          <div style={{background:"linear-gradient(135deg,#2563EB,#0EA5E9)",borderRadius:14,padding:"14px 18px",marginBottom:18,display:"flex",alignItems:"center",gap:12,boxShadow:"0 4px 16px rgba(37,99,235,0.2)"}}><div style={{fontSize:28}}>🔥</div><div><div style={{fontSize:18,fontWeight:800,color:"white"}}>{liveVendors.length} Stalls Live Now!</div><div style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>Go grab your food!</div></div></div>
          {liveVendors.length===0?<div style={{textAlign:"center",padding:"48px",color:"#94A3B8"}}><div style={{fontSize:40,marginBottom:10}}>😴</div><p style={{fontWeight:700}}>No stalls live right now</p></div>:liveVendors.map((v,i)=>(
            <div key={v.id} onClick={()=>navigate("/vendor/"+v.id)} style={{background:"white",border:"1.5px solid #BFDBFE",borderRadius:13,padding:"13px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",transition:"all 0.2s",marginBottom:8,boxShadow:"0 2px 8px rgba(37,99,235,0.06)"}} onMouseEnter={e=>{e.currentTarget.style.background="#EFF6FF"}} onMouseLeave={e=>{e.currentTarget.style.background="white"}}>
              <div style={{width:44,height:44,borderRadius:10,overflow:"hidden",flexShrink:0}}><img src={imgUrl(v.photoUrl&&v.photoUrl.split("||")[0])||"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100"} alt={v.shopName} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100"}/></div>
              <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}><span style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{v.shopName}</span><span style={{padding:"2px 7px",borderRadius:999,fontSize:10,fontWeight:700,background:"#DCFCE7",color:"#15803D"}}>● Live</span></div><div style={{fontSize:12,color:"#64748B",display:"flex",gap:10}}><span>📍 {v.city||"–"}</span><span>⭐ {(v.avgRating||0).toFixed(1)}</span></div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:800,color:"#2563EB"}}>{v.priceRange==="BUDGET"?"₹":v.priceRange==="MEDIUM"?"₹₹":"₹₹₹"}</div><div style={{fontSize:11,color:"#94A3B8"}}>Tap to view</div></div>
            </div>
          ))}
        </div>}
        {tab==="profile"&&<div style={{maxWidth:480}}>
          <div style={{marginBottom:20}}><h1 style={{fontSize:20,fontWeight:800,color:"#0F172A"}}>My Profile</h1><p style={{color:"#64748B",fontSize:13,marginTop:2}}>Your account details</p></div>
          <div style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:16,padding:22,boxShadow:"0 2px 12px rgba(37,99,235,0.06)",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,paddingBottom:16,borderBottom:"1.5px solid #EFF6FF"}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#2563EB,#0EA5E9)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"white",fontSize:24,flexShrink:0,boxShadow:"0 4px 14px rgba(37,99,235,0.25)"}}>{(user?.name||"U")[0].toUpperCase()}</div>
              <div style={{flex:1}}><div style={{fontSize:17,fontWeight:800,color:"#0F172A"}}>{user?.name}</div><div style={{fontSize:12,color:"#64748B",marginTop:2}}>{user?.email}</div><span style={{padding:"3px 9px",borderRadius:999,fontSize:11,fontWeight:700,background:"#DBEAFE",color:"#1D4ED8",border:"1px solid #BFDBFE",marginTop:5,display:"inline-block"}}>Customer</span></div>
              <button onClick={()=>setEditMode(!editMode)} style={{padding:"8px 14px",borderRadius:9,background:editMode?"#F1F5F9":"#EFF6FF",border:"1.5px solid "+(editMode?"#E2E8F0":"#BFDBFE"),color:editMode?"#64748B":"#2563EB",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>{editMode?<><FaTimes size={10}/> Cancel</>:<><FaEdit size={10}/> Edit</>}</button>
            </div>
            {profMsg&&<div style={{padding:"9px 12px",borderRadius:9,background:"#F0FDF4",border:"1.5px solid #BBF7D0",color:"#15803D",fontSize:12,fontWeight:600,marginBottom:14}}>{profMsg}</div>}
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              {[{k:"name",l:"Full Name",t:"text"},{k:"email",l:"Email Address",t:"email"},{k:"phone",l:"Phone Number",t:"tel"}].map(f=>(
                <div key={f.k}><label style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.4px",display:"block",marginBottom:5}}>{f.l}</label><input type={f.t} value={profile[f.k]||""} onChange={e=>setProfile(p=>({...p,[f.k]:e.target.value}))} disabled={!editMode} style={{width:"100%",padding:"11px 13px",background:editMode?"white":"#F8FAFF",border:"1.5px solid "+(editMode?"#BFDBFE":"#EFF6FF"),borderRadius:10,color:"#0F172A",fontSize:14,fontFamily:"inherit",outline:"none",cursor:editMode?"text":"default",transition:"all 0.2s"}} onFocus={e=>editMode&&(e.target.style.borderColor="#2563EB",e.target.style.boxShadow="0 0 0 3px rgba(37,99,235,0.1)")} onBlur={e=>{e.target.style.borderColor=editMode?"#BFDBFE":"#EFF6FF";e.target.style.boxShadow="none"}}/></div>
              ))}
            </div>
            {editMode&&<div style={{display:"flex",gap:9,marginTop:16}}>
              <button onClick={()=>{setProfMsg("Profile updated! ✅");setEditMode(false);setTimeout(()=>setProfMsg(""),3000)}} style={{padding:"10px 20px",borderRadius:9,background:"linear-gradient(135deg,#2563EB,#1D4ED8)",border:"none",color:"white",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}><FaSave size={12}/> Save Changes</button>
              <button onClick={()=>{setEditMode(false);setProfile({name:user?.name||"",email:user?.email||"",phone:user?.phone||""})}} style={{padding:"10px 16px",borderRadius:9,background:"#F1F5F9",border:"1.5px solid #E2E8F0",color:"#64748B",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
            </div>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[{icon:"❤️",label:"Favourites",val:favs.length,color:"#DC2626"},{icon:"🔥",label:"Live Stalls",val:liveVendors.length,color:"#D97706"}].map((s,i)=>(
              <div key={i} style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:12,padding:"16px",textAlign:"center",boxShadow:"0 2px 8px rgba(37,99,235,0.05)"}}><div style={{fontSize:28,marginBottom:6}}>{s.icon}</div><div style={{fontSize:24,fontWeight:800,color:s.color}}>{s.val}</div><div style={{fontSize:12,color:"#64748B",fontWeight:600,marginTop:3}}>{s.label}</div></div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  )
}
