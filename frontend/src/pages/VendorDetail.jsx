import React,{useState,useEffect} from "react"
import {useParams,useNavigate} from "react-router-dom"
import {FaStar,FaMapMarkerAlt,FaClock,FaPhone,FaArrowLeft,FaRoute,FaHeart,FaRegHeart,FaImages,FaDirections} from "react-icons/fa"
import {useAuth} from "../context/AuthContext"
import api from "../api/axios"

const imgUrl = (u) => u?.startsWith('/') ? import.meta.env.VITE_URL + u : u;
const fmt=t=>{if(!t)return "--";const[h,m]=t.split(":");const hr=parseInt(h);return(hr%12||12)+":"+m+" "+(hr>=12?"PM":"AM")}
const Stars=({rating,size=13})=><div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(i=><FaStar key={i} size={size} color={i<=Math.round(rating)?"#D97706":"#E2E8F0"}/>)}</div>

export default function VendorDetail(){
  const{id}=useParams();const navigate=useNavigate();const{isAuthenticated,role}=useAuth()
  const[vendor,setVendor]=useState(null);const[menu,setMenu]=useState([]);const[reviews,setReviews]=useState([])
  const[photos,setPhotos]=useState([]);const[tab,setTab]=useState("menu");const[fav,setFav]=useState(false)
  const[userLoc,setUserLoc]=useState(null);const[showMap,setShowMap]=useState(false);const[locLoad,setLocLoad]=useState(false)
  const[MapComp,setMapComp]=useState(null);const[rev,setRev]=useState({rating:5,comment:""})
  const[submitting,setSubmitting]=useState(false);const[revMsg,setRevMsg]=useState("");const[loading,setLoading]=useState(true)
  const[lightbox,setLightbox]=useState(null)

  useEffect(()=>{fetchAll()},[id])

  const fetchAll=async()=>{
    setLoading(true)
    try{
      const[vR,mR,rR]=await Promise.all([
        api.get("/api/vendors/"+id),
        api.get("/api/vendors/"+id+"/menu"),
        api.get("/api/vendors/"+id+"/reviews")
      ])
      setVendor(vR.data);setMenu(mR.data);setReviews(rR.data)
      const ph=vR.data.photoUrl||"";setPhotos(ph?ph.split("||").filter(Boolean):[])
      if(isAuthenticated&&role==="CUSTOMER"){
        try{const fR=await api.get("/api/favorites/check/"+id);setFav(fR.data?.favorited||false)}catch{}
      }
    }catch(e){console.error(e)}
    setLoading(false)
  }

  const vendorLat=vendor?.latitude||vendor?.lat
  const vendorLng=vendor?.longitude||vendor?.lng

  const loadMap=async()=>{
    if(MapComp)return
    try{
      const L=(await import("leaflet")).default;await import("leaflet/dist/leaflet.css")
      const{MapContainer,TileLayer,Marker,Popup,Polyline}=await import("react-leaflet")
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({iconUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"})
      const youIcon=L.divIcon({className:"",html:'<div style="width:13px;height:13px;border-radius:50%;background:#2563EB;border:3px solid white;box-shadow:0 0 0 5px rgba(37,99,235,0.2)"></div>',iconSize:[13,13],iconAnchor:[6,6]})
      setMapComp({MapContainer,TileLayer,Marker,Popup,Polyline,youIcon})
    }catch(e){console.error(e)}
  }

  const handleShowMap=async()=>{
    await loadMap()
    if(!userLoc){setLocLoad(true);navigator.geolocation.getCurrentPosition(pos=>{setUserLoc([pos.coords.latitude,pos.coords.longitude]);setLocLoad(false);setShowMap(true)},()=>{setLocLoad(false);setShowMap(true)})}
    else setShowMap(!showMap)
  }

  const openGoogleMapsDirections=()=>{
    const parts=[vendor.address,vendor.city,vendor.shopName].filter(Boolean)
    if(!parts.length){alert("No address found!");return}
    const dest=encodeURIComponent(parts.join(", "))
    if(navigator.geolocation){navigator.geolocation.getCurrentPosition(pos=>window.open(`https://www.google.com/maps/dir/${pos.coords.latitude},${pos.coords.longitude}/${dest}`,"_blank"),()=>window.open(`https://www.google.com/maps/search/?api=1&query=${dest}`,"_blank"))}
    else window.open(`https://www.google.com/maps/search/?api=1&query=${dest}`,"_blank")
  }

  const calcDist=(a,b)=>{
    if(!a||!b||!b[0]||!b[1])return null
    const R=6371,dLat=(b[0]-a[0])*Math.PI/180,dLon=(b[1]-a[1])*Math.PI/180
    const x=Math.sin(dLat/2)**2+Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*Math.sin(dLon/2)**2
    return(R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))).toFixed(1)
  }

  const toggleFav=async()=>{
    if(!isAuthenticated||role!=="CUSTOMER"){navigate("/login");return}
    try{if(fav){await api.delete("/api/favorites/"+id);setFav(false)}else{await api.post("/api/favorites/"+id);setFav(true)}}catch{}
  }

  const submitReview=async()=>{
    if(!isAuthenticated||role!=="CUSTOMER"){navigate("/login");return}
    if(!rev.comment.trim())return;setSubmitting(true)
    try{
      await api.post("/api/reviews",{vendorId:parseInt(id),rating:rev.rating,comment:rev.comment})
      setRevMsg("Review submitted! ✅");setRev({rating:5,comment:""})
      const rR=await api.get("/api/vendors/"+id+"/reviews");setReviews(rR.data)
    }catch{setRevMsg("Failed to submit")}
    setSubmitting(false);setTimeout(()=>setRevMsg(""),4000)
  }

  const distance=userLoc&&vendorLat&&vendorLng?calcDist(userLoc,[vendorLat,vendorLng]):null
  const menuCats=[...new Set(menu.map(m=>m.category||"Other"))]
  const mainPhoto=photos[0]||"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"
  const extraPhotos=photos.slice(1)

  if(loading)return(<div style={{minHeight:"100vh",background:"#F0F4FF",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14}}><div style={{width:42,height:42,border:"3px solid #BFDBFE",borderTop:"3px solid #2563EB",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><p style={{color:"#64748B",fontSize:14}}>Loading...</p></div>)
  if(!vendor)return(<div style={{minHeight:"100vh",background:"#F0F4FF",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}><div style={{fontSize:48}}>😕</div><p style={{fontSize:16,fontWeight:700,color:"#0F172A"}}>Vendor not found</p><button onClick={()=>navigate(-1)} style={{padding:"9px 20px",borderRadius:9,background:"#2563EB",border:"none",color:"white",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Go Back</button></div>)

  return(
    <div style={{minHeight:"100vh",background:"#F0F4FF"}}>
      {/* Hero */}
      <div style={{position:"relative",height:260,overflow:"hidden"}}>
        <img src={imgUrl(mainPhoto)} alt={vendor.shopName} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.15),rgba(15,23,42,0.85))"}}/>
        <button onClick={()=>navigate(-1)} style={{position:"absolute",top:14,left:14,background:"rgba(255,255,255,0.92)",border:"none",borderRadius:10,padding:"8px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,color:"#0F172A",fontFamily:"inherit"}}><FaArrowLeft size={11}/> Back</button>
        <div style={{position:"absolute",top:14,right:14,display:"flex",gap:8}}>
          <button onClick={toggleFav} style={{background:fav?"rgba(220,38,38,0.9)":"rgba(255,255,255,0.92)",border:"none",borderRadius:10,padding:"8px 12px",cursor:"pointer",color:fav?"white":"#64748B",fontSize:16}}>{fav?<FaHeart/>:<FaRegHeart/>}</button>
        </div>
        <div style={{position:"absolute",bottom:16,left:18,right:18}}>
          <div style={{display:"flex",gap:7,marginBottom:7,flexWrap:"wrap"}}>
            <span style={{padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700,background:vendor.isLive?"rgba(22,163,74,0.85)":"rgba(0,0,0,0.5)",color:"white",display:"flex",alignItems:"center",gap:4}}><span style={{width:5,height:5,borderRadius:"50%",background:"white",animation:vendor.isLive?"pulse 1.5s infinite":"none"}}/>{vendor.isLive?"Open Now":"Closed"}</span>
            {distance&&<span style={{padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700,background:"rgba(37,99,235,0.85)",color:"white"}}>📍 {distance} km</span>}
            <span style={{padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700,background:"rgba(255,255,255,0.15)",color:"white"}}>{vendor.priceRange==="BUDGET"?"₹":vendor.priceRange==="MEDIUM"?"₹₹":"₹₹₹"}</span>
          </div>
          <h1 style={{fontSize:22,fontWeight:800,color:"white",marginBottom:5}}>{vendor.shopName}</h1>
          <div style={{display:"flex",alignItems:"center",gap:8}}><Stars rating={vendor.avgRating||0}/><span style={{color:"#FCD34D",fontWeight:700,fontSize:14}}>{(vendor.avgRating||0).toFixed(1)}</span><span style={{color:"rgba(255,255,255,0.6)",fontSize:12}}>({vendor.totalReviews||0} reviews) · {vendor.category}</span></div>
        </div>
      </div>

      <div style={{maxWidth:720,margin:"0 auto",padding:"18px 18px 80px"}}>
        {/* Info Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:9,marginBottom:18}}>
          {[{icon:<FaMapMarkerAlt/>,label:"Location",val:vendor.address||vendor.city||"–",color:"#2563EB"},{icon:<FaClock/>,label:"Hours",val:fmt(vendor.openingTime)+" – "+fmt(vendor.closingTime),color:"#0891B2"},{icon:<FaPhone/>,label:"Phone",val:vendor.ownerPhone||"N/A",color:"#16A34A"}].map((item,i)=>(
            <div key={i} style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:11,padding:"11px 13px",display:"flex",alignItems:"center",gap:9,boxShadow:"0 2px 8px rgba(37,99,235,0.05)"}}>
              <div style={{width:32,height:32,borderRadius:8,background:item.color+"15",display:"flex",alignItems:"center",justifyContent:"center",color:item.color,fontSize:13,flexShrink:0}}>{item.icon}</div>
              <div><div style={{fontSize:10,color:"#94A3B8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.4px"}}>{item.label}</div><div style={{fontSize:12,color:"#334155",fontWeight:600,marginTop:2}}>{item.val}</div></div>
            </div>
          ))}
          <button onClick={openGoogleMapsDirections} style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:11,padding:"11px 13px",display:"flex",alignItems:"center",gap:9,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",boxShadow:"0 2px 8px rgba(37,99,235,0.05)"}}>
            <div style={{width:32,height:32,borderRadius:8,background:"#7C3AED15",display:"flex",alignItems:"center",justifyContent:"center",color:"#7C3AED",fontSize:13,flexShrink:0}}><FaDirections/></div>
            <div><div style={{fontSize:10,color:"#94A3B8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.4px"}}>Direction</div><div style={{fontSize:12,color:"#7C3AED",fontWeight:700,marginTop:2}}>Get Directions →</div></div>
          </button>
        </div>

        {/* Map */}
        {showMap&&MapComp&&vendorLat&&vendorLng&&(
          <div style={{borderRadius:14,overflow:"hidden",border:"1.5px solid #E0EAFF",marginBottom:18,boxShadow:"0 4px 16px rgba(37,99,235,0.08)"}}>
            <div style={{background:"white",padding:"9px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1.5px solid #EFF6FF"}}>
              <span style={{fontSize:13,fontWeight:700,color:"#0F172A",display:"flex",alignItems:"center",gap:6}}><FaRoute color="#2563EB" size={12}/>{distance?distance+" km from you":"Shop Location"}</span>
              <div style={{display:"flex",gap:8}}>
                <button onClick={openGoogleMapsDirections} style={{padding:"5px 12px",background:"#EFF6FF",border:"1.5px solid #BFDBFE",borderRadius:7,color:"#2563EB",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}><FaDirections size={11}/> Get Directions</button>
                <button onClick={()=>setShowMap(false)} style={{padding:"5px 10px",background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:7,color:"#DC2626",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>✕</button>
              </div>
            </div>
            <MapComp.MapContainer center={[vendorLat,vendorLng]} zoom={14} style={{height:220}} zoomControl={false}>
              <MapComp.TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
              <MapComp.Marker position={[vendorLat,vendorLng]}><MapComp.Popup>{vendor.shopName}</MapComp.Popup></MapComp.Marker>
              {userLoc&&<><MapComp.Marker position={userLoc} icon={MapComp.youIcon}><MapComp.Popup>You are here</MapComp.Popup></MapComp.Marker><MapComp.Polyline positions={[userLoc,[vendorLat,vendorLng]]} pathOptions={{color:"#2563EB",weight:3,dashArray:"8,6",opacity:0.9}}/></>}
            </MapComp.MapContainer>
          </div>
        )}

        {/* Tabs */}
        <div style={{display:"flex",gap:4,background:"#EFF6FF",border:"1.5px solid #DBEAFE",borderRadius:11,padding:3,marginBottom:18}}>
          {[{k:"menu",l:`Menu (${menu.length})`},{k:"reviews",l:`Reviews (${reviews.length})`},{k:"about",l:"About"}].map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:"9px 12px",borderRadius:8,fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",background:tab===t.k?"#2563EB":"transparent",color:tab===t.k?"white":"#64748B",boxShadow:tab===t.k?"0 3px 10px rgba(37,99,235,0.25)":"none"}}>{t.l}</button>
          ))}
        </div>

        {/* Menu Tab */}
        {tab==="menu"&&(menu.length===0
          ?<div style={{textAlign:"center",padding:"40px",color:"#94A3B8"}}><div style={{fontSize:40,marginBottom:10}}>🍽️</div><p style={{fontWeight:700}}>No menu yet</p></div>
          :menuCats.map(cat=>(
            <div key={cat} style={{marginBottom:18}}>
              <p style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:9}}>{cat}</p>
              {menu.filter(m=>(m.category||"Other")===cat).map(item=>(
                <div key={item.id} style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:11,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,opacity:item.isAvailable?1:0.55,boxShadow:"0 2px 8px rgba(37,99,235,0.04)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <span style={{width:7,height:7,borderRadius:"50%",background:item.isAvailable?"#16A34A":"#DC2626",flexShrink:0}}/>
                    <div><div style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{item.name||item.itemName}</div>{item.description&&<div style={{fontSize:11,color:"#64748B",marginTop:2}}>{item.description}</div>}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:15,fontWeight:800,color:"#2563EB"}}>₹{item.price}</div>
                    <div style={{fontSize:10,color:item.isAvailable?"#16A34A":"#DC2626",fontWeight:600}}>{item.isAvailable?"Available":"Sold out"}</div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

        {/* Reviews Tab */}
        {tab==="reviews"&&<div>
          {isAuthenticated&&role==="CUSTOMER"&&(
            <div style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:14,padding:16,marginBottom:16,boxShadow:"0 2px 8px rgba(37,99,235,0.05)"}}>
              <p style={{fontSize:14,fontWeight:700,color:"#0F172A",marginBottom:11}}>Write a Review</p>
              <div style={{display:"flex",gap:6,marginBottom:10}}>{[1,2,3,4,5].map(s=><button key={s} onClick={()=>setRev(p=>({...p,rating:s}))} style={{background:"none",border:"none",cursor:"pointer",padding:2,fontSize:22}}><FaStar color={s<=rev.rating?"#D97706":"#E2E8F0"}/></button>)}</div>
              <textarea value={rev.comment} onChange={e=>setRev(p=>({...p,comment:e.target.value}))} placeholder="Share your experience..." rows={3} style={{width:"100%",background:"#F8FAFF",border:"1.5px solid #E0EAFF",borderRadius:9,color:"#0F172A",fontSize:13,padding:11,resize:"none",fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} onFocus={e=>{e.target.style.borderColor="#2563EB";e.target.style.boxShadow="0 0 0 3px rgba(37,99,235,0.1)"}} onBlur={e=>{e.target.style.borderColor="#E0EAFF";e.target.style.boxShadow="none"}}/>
              {revMsg&&<div style={{marginTop:9,padding:"8px 12px",borderRadius:8,background:revMsg.includes("Failed")?"#FEF2F2":"#F0FDF4",color:revMsg.includes("Failed")?"#DC2626":"#15803D",fontSize:12,fontWeight:600,border:"1.5px solid "+(revMsg.includes("Failed")?"#FECACA":"#BBF7D0")}}>{revMsg}</div>}
              <button onClick={submitReview} disabled={submitting||!rev.comment.trim()} style={{marginTop:10,padding:"9px 20px",borderRadius:9,background:submitting||!rev.comment.trim()?"#93C5FD":"linear-gradient(135deg,#2563EB,#1D4ED8)",border:"none",color:"white",fontWeight:700,fontSize:13,cursor:submitting||!rev.comment.trim()?"not-allowed":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:7}}>{submitting?<><div style={{width:13,height:13,border:"2px solid rgba(255,255,255,0.4)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>Submitting...</>:"Submit Review"}</button>
            </div>
          )}
          {reviews.length===0?<div style={{textAlign:"center",padding:"40px",color:"#94A3B8"}}><div style={{fontSize:40,marginBottom:10}}>⭐</div><p style={{fontWeight:700}}>No reviews yet</p></div>:reviews.map(r=>(
            <div key={r.id} style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:12,padding:14,marginBottom:8,boxShadow:"0 2px 8px rgba(37,99,235,0.04)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#2563EB,#0EA5E9)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"white",fontSize:13}}>{(r.customerName||"U")[0].toUpperCase()}</div>
                  <div><div style={{fontSize:13,fontWeight:700,color:"#0F172A"}}>{r.customerName||"Customer"}</div><div style={{fontSize:11,color:"#94A3B8"}}>{r.createdAt?new Date(r.createdAt).toLocaleDateString("en-IN"):""}</div></div>
                </div>
                <Stars rating={r.rating} size={11}/>
              </div>
              {r.comment&&<p style={{fontSize:13,color:"#334155",lineHeight:1.5,marginLeft:41}}>{r.comment}</p>}
            </div>
          ))}
        </div>}

        {/* About Tab */}
        {tab==="about"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[["Shop Name",vendor.shopName],["Owner",vendor.ownerName],["Category",vendor.category],["City",vendor.city],["Address",vendor.address],["Hours",fmt(vendor.openingTime)+" – "+fmt(vendor.closingTime)],["Price",vendor.priceRange==="BUDGET"?"₹ Budget":vendor.priceRange==="MEDIUM"?"₹₹ Medium":"₹₹₹ Premium"],["About",vendor.description||"–"]].map(([k,v])=>(
            <div key={k} style={{background:"white",border:"1.5px solid #E0EAFF",borderRadius:10,padding:"10px 14px",display:"flex",gap:14,boxShadow:"0 2px 6px rgba(37,99,235,0.04)"}}><span style={{fontSize:11,fontWeight:700,color:"#94A3B8",minWidth:90,textTransform:"uppercase",letterSpacing:"0.3px",flexShrink:0}}>{k}</span><span style={{fontSize:13,color:"#334155"}}>{v||"–"}</span></div>
          ))}
          {extraPhotos.length>0&&<div style={{marginTop:6}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}><FaImages color="#2563EB" size={13}/><span style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.5px"}}>Shop Photos ({extraPhotos.length})</span></div><div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(extraPhotos.length,3)},1fr)`,gap:10}}>{extraPhotos.map((url,i)=><div key={i} onClick={()=>setLightbox(i+1)} style={{aspectRatio:"4/3",borderRadius:12,overflow:"hidden",cursor:"pointer",border:"1.5px solid #E0EAFF",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"} onMouseLeave={e=>e.currentTarget.style.transform="none"}><img src={imgUrl(url)} alt={"shop"+i} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"}/></div>)}</div></div>}
        </div>}
      </div>

      {/* Lightbox */}
      {lightbox!==null&&(
        <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,cursor:"zoom-out"}}>
          <button onClick={()=>setLightbox(null)} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.1)",border:"none",color:"white",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:16}}>✕</button>
          {lightbox>0&&<button onClick={e=>{e.stopPropagation();setLightbox(l=>l-1)}} style={{position:"absolute",left:16,background:"rgba(255,255,255,0.1)",border:"none",color:"white",borderRadius:8,padding:"10px 16px",cursor:"pointer",fontSize:20}}>‹</button>}
          <img src={imgUrl(photos[lightbox])} alt="full" onClick={e=>e.stopPropagation()} style={{maxWidth:"90vw",maxHeight:"88vh",objectFit:"contain",borderRadius:12}} onError={e=>e.target.src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"}/>
          {lightbox<photos.length-1&&<button onClick={e=>{e.stopPropagation();setLightbox(l=>l+1)}} style={{position:"absolute",right:16,background:"rgba(255,255,255,0.1)",border:"none",color:"white",borderRadius:8,padding:"10px 16px",cursor:"pointer",fontSize:20}}>›</button>}
          <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.5)",color:"white",padding:"5px 14px",borderRadius:999,fontSize:12,fontWeight:700}}>{lightbox+1} / {photos.length}</div>
        </div>
      )}
    </div>
  )
}