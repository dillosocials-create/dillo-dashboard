(()=>{"use strict";
const KEY="dillo_dashboard_v6";
const SUPABASE_URL="https://wkvkqdjtlazpcuxpbbqz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_L_tfxYAWnjIpNRG8gOsz4Q_lviqp4Fm";
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
let currentUser=null;
const seed={clients:[
{id:1,name:"Mia Santos",company:"Bloom Wellness",email:"mia@bloomwellness.com",phone:"+1 555 0101",website:"bloomwellness.com",package:"Consistency & Growth",status:"Active",notes:"Monthly social management."},
{id:2,name:"Lucas Reed",company:"Northstar Finance",email:"lucas@northstarfinance.com",phone:"+1 555 0102",website:"northstarfinance.com",package:"Starter Presence",status:"Active",notes:"Brand refresh support."},
{id:3,name:"Sofia Cruz",company:"Casa Migration",email:"sofia@casamigration.com",phone:"+1 555 0103",website:"",package:"Growth Partner",status:"Onboarding",notes:"Spanish content and TikTok launch."},
{id:4,name:"Eli Parker",company:"Good Energy Co.",email:"eli@goodenergy.co",phone:"+1 555 0104",website:"goodenergy.co",package:"Starter Presence",status:"Paused",notes:"Paused until further notice."}],
projects:[
{id:11,name:"Bloom — September Content",client:"Bloom Wellness",status:"In progress",progress:72,start:"2026-09-01",due:"2026-09-24",notes:"Monthly content batch."},
{id:12,name:"Northstar Brand Refresh",client:"Northstar Finance",status:"Review",progress:88,start:"2026-09-05",due:"2026-09-20",notes:"Logo and visual direction."},
{id:13,name:"Casa TikTok Launch",client:"Casa Migration",status:"In progress",progress:41,start:"2026-09-10",due:"2026-09-29",notes:"Launch content and profile setup."}],
events:[
{id:21,title:"Northstar review",date:"2026-09-20",time:"10:00",type:"Client call",client:"Northstar Finance",notes:"Review brand direction."},
{id:22,title:"Bloom strategy call",date:"2026-09-22",time:"14:00",type:"Strategy",client:"Bloom Wellness",notes:"Monthly planning."},
{id:23,title:"Bloom content due",date:"2026-09-24",time:"17:00",type:"Deadline",client:"Bloom Wellness",notes:"September batch."},
{id:24,title:"Casa launch",date:"2026-09-29",time:"09:00",type:"Launch",client:"Casa Migration",notes:"TikTok launch."}],
invoices:[
{id:31,number:"INV-104",client:"Bloom Wellness",amount:650,issue:"2026-09-01",due:"2026-09-10",status:"Paid",notes:"September management."},
{id:32,number:"INV-105",client:"Northstar Finance",amount:900,issue:"2026-09-05",due:"2026-09-20",status:"Pending",notes:"Brand refresh."},
{id:33,number:"INV-106",client:"Casa Migration",amount:750,issue:"2026-09-01",due:"2026-09-15",status:"Overdue",notes:"Launch package."}],
files:[
{id:41,name:"Bloom Brand Kit.pdf",client:"Bloom Wellness",category:"Brand assets",type:"PDF",size:"2.4 MB",status:"Approved",notes:"Current brand kit."},
{id:42,name:"Northstar Logo Pack.zip",client:"Northstar Finance",category:"Brand assets",type:"ZIP",size:"8.1 MB",status:"Pending",notes:"Awaiting approval."},
{id:43,name:"Casa Content Brief.docx",client:"Casa Migration",category:"Content",type:"DOCX",size:"0.8 MB",status:"Approved",notes:"Launch brief."}]};
let state=JSON.parse(localStorage.getItem(KEY)||JSON.stringify(seed));
async function loadCloudState(){
  const {data,error}=await sb.from("dillo_workspace").select("data").eq("id",1).maybeSingle();
  if(error)throw error;
  if(data?.data){state=data.data;localStorage.setItem(KEY,JSON.stringify(state));return}
  state=JSON.parse(JSON.stringify(seed));
  const {error:insertError}=await sb.from("dillo_workspace").upsert({id:1,data:state,updated_by:currentUser.id});
  if(insertError)throw insertError;
  localStorage.setItem(KEY,JSON.stringify(state));
}
async function saveCloudState(){
  localStorage.setItem(KEY,JSON.stringify(state));
  if(!currentUser)return;
  const {error}=await sb.from("dillo_workspace").upsert({id:1,data:state,updated_by:currentUser.id});
  if(error)throw error;
}
function showLogin(message=""){
  let el=document.getElementById("authScreen");
  if(!el){el=document.createElement("div");el.id="authScreen";document.body.appendChild(el)}
  document.querySelector(".app-shell").style.display="none";
  el.hidden=false;
  el.innerHTML='<div class="auth-card"><div class="auth-logo"><img src="assets/dillo-socials-logo.svg" alt="Dillo Socials"></div><div class="eyebrow">DILLO HQ</div><h1>Welcome back.</h1><p>Sign in to the private Dillo Socials workspace.</p><form id="loginForm"><label>Email<input name="email" type="email" autocomplete="username" required placeholder="you@dillosocials.com"></label><label>Password<input name="password" type="password" autocomplete="current-password" required placeholder="••••••••"></label><button class="btn primary" type="submit">Sign in</button><div class="auth-error" id="authError">'+esc(message)+'</div></form><small class="auth-note">Private workspace · Aya & Jam</small></div>';
  document.getElementById("loginForm").onsubmit=async e=>{
    e.preventDefault();
    const form=e.currentTarget,button=form.querySelector("button"),errorBox=document.getElementById("authError");
    button.disabled=true;button.textContent="Signing in…";errorBox.textContent="";
    const {error}=await sb.auth.signInWithPassword({email:form.email.value.trim(),password:form.password.value});
    if(error){errorBox.textContent=error.message;button.disabled=false;button.textContent="Sign in"}
  };
}
function hideLogin(){const el=document.getElementById("authScreen");if(el)el.hidden=true;document.querySelector(".app-shell").style.display="flex"}
async function startApp(){
  hideLogin();
  document.querySelector(".mini-card small").textContent="Supabase cloud";
  try{await loadCloudState();setView("overview")}
  catch(error){console.error(error);showLogin("The Supabase workspace is not set up yet. Run supabase-setup.sql, then sign in again.")}
}
async function boot(){
  const {data}=await sb.auth.getSession();
  if(data.session){currentUser=data.session.user;await startApp()}else showLogin();
  sb.auth.onAuthStateChange(async (_event,session)=>{
    if(session){currentUser=session.user;await startApp()}
    else{currentUser=null;showLogin()}
  });
}

const page=document.getElementById("page"),title=document.getElementById("viewTitle"),back=document.getElementById("modalBackdrop"),content=document.getElementById("modalContent");
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
async function uploadCloudFile(file){
  const path=currentUser.id+"/"+Date.now()+"-"+safeName(file.name);
  const {error}=await sb.storage.from("dillo-files").upload(path,file,{upsert:false,contentType:file.type||"application/octet-stream"});
  if(error)throw error;
  return path;
}
function safeName(name){return String(name||"file").replace(/[^a-zA-Z0-9._-]+/g,"-")}
async function replaceCloudFile(oldPath,file){
  if(oldPath)await sb.storage.from("dillo-files").remove([oldPath]);
  return uploadCloudFile(file);
}
async function deleteCloudFile(path){
  if(path)await sb.storage.from("dillo-files").remove([path]);
}
async function downloadUpload(id,name){
  const item=state.files.find(f=>f.id==id);
  if(!item?.storage_path){alert("This demo file has no cloud upload yet.");return}
  const {data,error}=await sb.storage.from("dillo-files").download(item.storage_path);
  if(error){alert("Unable to download this file.");return}
  const url=URL.createObjectURL(data);
  const a=document.createElement("a");a.href=url;a.download=name||item.name||"download";document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const btn=(label,action,cls="primary")=>'<button class="btn '+cls+'" data-action="'+action+'">'+label+"</button>";
const del=(type,id)=>'<button class="small-btn danger-btn" data-remove="'+type+'" data-id="'+id+'">Delete</button>';
const empty=t=>'<div class="empty">'+t+"</div>";
function shell(h,p,actions=""){return '<div class="hero"><div><div class="eyebrow">DILLO SOCIALS</div><h1>'+h+'</h1><p>'+p+'</p></div><div class="hero-actions">'+actions+"</div></div>"}
function card(h,b){return '<section class="panel"><div class="panel-head"><h2>'+h+'</h2></div><div class="panel-body">'+b+"</div></section>"}
function clientOptions(value=""){return state.clients.map(c=>'<option value="'+esc(c.company)+'" '+(c.company===value?"selected":"")+'>'+esc(c.company)+'</option>').join("")||'<option value="">Add a client first</option>'}
function select(name,items,value){return '<select name="'+name+'">'+items.map(x=>'<option '+(x===value?"selected":"")+'>'+esc(x)+'</option>').join("")+"</select>"}
function overview(){const active=state.clients.filter(c=>c.status==="Active").length,paid=state.invoices.filter(i=>i.status==="Paid").reduce((a,i)=>a+i.amount,0),out=state.invoices.filter(i=>i.status!=="Paid").reduce((a,i)=>a+i.amount,0),attention=state.invoices.filter(i=>i.status==="Overdue").map(i=>'<div class="list-row"><div><b>'+esc(i.number)+' is overdue</b><small>'+esc(i.client)+' · $'+i.amount+'</small></div><span class="tag red">Action needed</span></div>').join("")+state.files.filter(f=>f.status==="Pending").map(f=>'<div class="list-row"><div><b>'+esc(f.name)+' needs approval</b><small>'+esc(f.client)+'</small></div><span class="tag yellow">Review</span></div>').join("");page.innerHTML=shell("Good morning, Dillo. <span>Let’s make things move.</span>","Your command center for clients, projects, calendar, invoices and files.",btn("+ New client","client")+btn("+ New project","project","secondary"))+'<div class="kpis"><div class="kpi"><div class="kpi-top">Active clients</div><strong>'+active+'</strong><small>'+state.clients.length+' total</small></div><div class="kpi"><div class="kpi-top">Projects</div><strong>'+state.projects.length+'</strong><small>Tracked in workspace</small></div><div class="kpi"><div class="kpi-top">Paid this cycle</div><strong>$'+paid.toLocaleString()+'</strong><small>Recorded payments</small></div><div class="kpi"><div class="kpi-top">Outstanding</div><strong>$'+out.toLocaleString()+'</strong><small>'+state.invoices.filter(i=>i.status!=="Paid").length+' open invoices</small></div></div><div class="overview-grid"><div class="overview-main">'+card("Needs your attention",attention||empty("Nothing needs your attention right now. ✦"))+card("Projects at a glance",state.projects.length?state.projects.map(p=>'<div class="list-row"><div><b>'+esc(p.name)+'</b><small>'+esc(p.client)+' · '+esc(p.status)+'</small></div><b>'+p.progress+'%</b></div>').join(""):empty("No projects yet."))+'</div><div class="overview-side">'+card("Quick actions",'<div class="quick-grid"><button class="quick" data-view="clients"><strong>Clients</strong><span>Manage relationships</span></button><button class="quick" data-view="projects"><strong>Projects</strong><span>Track work</span></button><button class="quick" data-view="calendar"><strong>Calendar</strong><span>Schedule work</span></button><button class="quick" data-view="invoices"><strong>Invoices</strong><span>Track billing</span></button><button class="quick" data-view="files"><strong>Files</strong><span>Client assets</span></button></div>')+card("Coming up",state.events.length?state.events.slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,5).map(e=>'<div class="list-row"><div><b>'+esc(e.title)+'</b><small>'+esc(e.date)+' '+esc(e.time||"")+'</small></div></div>').join(""):empty("Your calendar is empty."))+'</div></div>';bind()}
function clients(){const rows=state.clients.map(c=>'<tr><td><b>'+esc(c.name)+'</b><small>'+esc(c.email)+'</small></td><td>'+esc(c.company)+'</td><td><span class="tag '+(c.status==="Active"?"green":c.status==="Onboarding"?"yellow":"blue")+'">'+esc(c.status)+'</span></td><td><button class="small-btn" data-edit="client" data-id="'+c.id+'">Edit</button> '+del("client",c.id)+'</td></tr>').join("");page.innerHTML=shell("Clients.","Your client directory, contact details and package information.",btn("+ Add client","client"))+card("Client list",rows?'<div style="overflow:auto"><table class="data-table"><thead><tr><th>Client</th><th>Business</th><th>Status</th><th></th></tr></thead><tbody>'+rows+"</tbody></table></div>":empty("No clients yet. Click “+ Add client”."));bind()}
function projects(){const rows=state.projects.map(p=>'<article class="project-card"><div class="project-top"><span class="tag blue">'+esc(p.status)+'</span><b>'+p.progress+'%</b></div><h3>'+esc(p.name)+'</h3><p>'+esc(p.client)+' · Due '+esc(p.due||"—")+'</p><div class="progress"><i style="width:'+p.progress+'%"></i></div><div style="margin-top:12px"><button class="small-btn" data-edit="project" data-id="'+p.id+'">Edit</button> '+del("project",p.id)+'</div></article>').join("");page.innerHTML=shell("Projects in motion.","Plan deliverables, deadlines, status and progress.",btn("+ New project","project"))+'<div class="project-grid">'+(rows||empty("No projects yet. Click “+ New project”."))+"</div>";bind()}
function calendar(){const rows=state.events.slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).map(e=>'<div class="list-row"><div><b>'+esc(e.title)+'</b><small>'+esc(e.date)+' · '+esc(e.time||"")+' · '+esc(e.type||"")+(e.client?" · "+esc(e.client):"")+'</small></div><span><button class="small-btn" data-edit="event" data-id="'+e.id+'">Edit</button> '+del("event",e.id)+'</span></div>').join("");page.innerHTML=shell("Calendar.","Calls, deadlines, launches and reminders in one place.",btn("+ Add calendar item","event"))+card("Upcoming calendar",rows||empty("Your calendar is empty. Click “+ Add calendar item”."));bind()}
function invoices(){const rows=state.invoices.map(i=>'<tr><td><b>'+esc(i.number)+'</b><small>Due '+esc(i.due)+'</small></td><td>'+esc(i.client)+'</td><td>$'+Number(i.amount).toLocaleString()+'</td><td><span class="tag '+(i.status==="Paid"?"green":i.status==="Overdue"?"red":"yellow")+'">'+esc(i.status)+'</span></td><td><button class="small-btn" data-edit="invoice" data-id="'+i.id+'">Edit</button> '+del("invoice",i.id)+'</td></tr>').join("");page.innerHTML=shell("Invoices.","Track billing, due dates and payment status.",btn("+ Add invoice","invoice"))+card("Invoice list",rows?'<div style="overflow:auto"><table class="data-table"><thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>'+rows+"</tbody></table></div>":empty("No invoices yet. Click “+ Add invoice”."));bind()}
function files(){const rows=state.files.map(f=>'<div class="file-card"><span class="file-icon">'+esc(f.type)+'</span><div style="flex:1"><b>'+esc(f.name)+'</b><small>'+esc(f.client)+' · '+esc(f.category||"")+' · '+esc(f.size||"")+'</small></div><span class="tag '+(f.status==="Approved"?"green":"yellow")+'">'+esc(f.status)+'</span><button class="small-btn" data-edit="file" data-id="'+f.id+'">Edit</button> <button class="small-btn" data-download="'+f.id+'" data-name="'+esc(f.name)+'">Download</button> '+del("file",f.id)+'</div>').join("");page.innerHTML=shell("Files.","Organize client assets, briefs and deliverables.",btn("+ Add file","file"))+card("Shared files",rows?'<div class="file-list">'+rows+"</div>":empty("No files yet. Click “+ Add file”."));page.querySelectorAll("[data-download]").forEach(b=>b.onclick=()=>downloadUpload(b.dataset.download,b.dataset.name));bind()}
function actions(type){return '<div class="modal-actions"><button type="button" class="btn secondary" data-close>Cancel</button><button class="btn primary">Save</button></div>'}
function modal(type,id){const key=type==="event"?"events":type+"s",item=id?state[key].find(x=>x.id==id):null,companies=clientOptions(item?.client||"");let body="",heading={client:"Client",project:"Project",event:"Calendar item",invoice:"Invoice",file:"File"}[type];
if(type==="client")body='<p class="lead">Add the contact and business details you want available inside Dillo HQ.</p><form data-type="client"><div class="form-grid"><div class="field"><label>Client name *</label><input name="name" required value="'+esc(item?.name)+'" placeholder="Jane Smith"></div><div class="field"><label>Business name *</label><input name="company" required value="'+esc(item?.company)+'" placeholder="Business name"></div><div class="field"><label>Email</label><input name="email" type="email" value="'+esc(item?.email)+'" placeholder="hello@business.com"></div><div class="field"><label>Phone</label><input name="phone" value="'+esc(item?.phone)+'" placeholder="+1 555..."></div><div class="field"><label>Website</label><input name="website" value="'+esc(item?.website)+'" placeholder="website.com"></div><div class="field"><label>Package</label>'+select("package",["Starter Presence","Consistency & Growth","Growth Partner"],item?.package)+'</div><div class="field"><label>Status</label>'+select("status",["Active","Onboarding","Paused"],item?.status||"Active")+'</div><div class="field full"><label>Notes</label><textarea name="notes" rows="3" placeholder="Important client notes...">'+esc(item?.notes)+'</textarea></div></div>'+actions(type)+'</form>';
if(type==="project")body='<p class="lead">Set the owner, dates, status and current progress for this project.</p><form data-type="project"><div class="form-grid"><div class="field full"><label>Project name *</label><input name="name" required value="'+esc(item?.name)+'" placeholder="September Content"></div><div class="field"><label>Client</label><select name="client">'+companies+'</select></div><div class="field"><label>Status</label>'+select("status",["Not started","In progress","Review","Complete"],item?.status||"Not started")+'</div><div class="field"><label>Start date</label><input name="start" type="date" value="'+esc(item?.start)+'"></div><div class="field"><label>Due date</label><input name="due" type="date" value="'+esc(item?.due)+'"></div><div class="field"><label>Progress %</label><input name="progress" type="number" min="0" max="100" value="'+(item?.progress??0)+'"></div><div class="field full"><label>Notes</label><textarea name="notes" rows="3">'+esc(item?.notes)+'</textarea></div></div>'+actions(type)+'</form>';
if(type==="event")body='<p class="lead">Put meetings, deadlines and launch moments on your Dillo calendar.</p><form data-type="event"><div class="form-grid"><div class="field"><label>Title *</label><input name="title" required value="'+esc(item?.title)+'" placeholder="Client call"></div><div class="field"><label>Type</label>'+select("type",["Client call","Strategy","Deadline","Launch","Reminder","Other"],item?.type||"Client call")+'</div><div class="field"><label>Date *</label><input name="date" type="date" required value="'+esc(item?.date)+'"></div><div class="field"><label>Time</label><input name="time" type="time" value="'+esc(item?.time)+'"></div><div class="field"><label>Client</label><select name="client"><option value="">No client</option>'+companies+'</select></div><div class="field full"><label>Notes</label><textarea name="notes" rows="3">'+esc(item?.notes)+'</textarea></div></div>'+actions(type)+'</form>';
if(type==="invoice")body='<p class="lead">Record the invoice and keep its payment status current.</p><form data-type="invoice"><div class="form-grid"><div class="field"><label>Invoice # *</label><input name="number" required value="'+esc(item?.number||"")+'" placeholder="INV-001"></div><div class="field"><label>Client</label><select name="client">'+companies+'</select></div><div class="field"><label>Amount *</label><input name="amount" type="number" min="0" step="0.01" required value="'+(item?.amount??"")+'" placeholder="0.00"></div><div class="field"><label>Status</label>'+select("status",["Pending","Paid","Overdue"],item?.status||"Pending")+'</div><div class="field"><label>Issue date</label><input name="issue" type="date" value="'+esc(item?.issue)+'"></div><div class="field"><label>Due date</label><input name="due" type="date" value="'+esc(item?.due)+'"></div><div class="field full"><label>Notes</label><textarea name="notes" rows="3">'+esc(item?.notes)+'</textarea></div></div>'+actions(type)+'</form>';
if(type==="file")body='<p class="lead">Choose a file from your computer. The file is stored locally in this browser for this workspace.</p><form data-type="file"><div class="form-grid"><div class="field full"><label>Browse computer *</label><input name="upload" type="file" '+(id?"":"required ")+'accept="*/*"><small class="field-help">'+(id?"Choose a replacement file or leave this blank to keep the current file.":"Select the file you want to add to Dillo Files.")+'</small></div><div class="field full"><label>File name *</label><input name="name" required value="'+esc(item?.name||"")+'" placeholder="Brand guide.pdf"></div><div class="field"><label>Client</label><select name="client">'+companies+'</select></div><div class="field"><label>Category</label>'+select("category",["Brand assets","Content","Contract","Invoice","Brief","Deliverable","Other"],item?.category||"Brand assets")+'</div><div class="field"><label>Status</label>'+select("status",["Pending","Approved"],item?.status||"Pending")+'</div><div class="field"><label>Size</label><input name="size" value="'+esc(item?.size||"")+'" placeholder="2.4 MB" readonly></div><div class="field full"><label>Notes</label><textarea name="notes" rows="3">'+esc(item?.notes)+'</textarea></div></div>'+actions(type)+'</form>';content.innerHTML='<h2 id="modalTitle">'+(id?"Edit ":"Add ")+heading+'</h2>'+body;back.hidden=false;back.style.display="grid";back.classList.add("is-open");document.body.style.overflow="hidden";const form=content.querySelector("form");content.querySelectorAll("[data-close]").forEach(b=>b.onclick=close);form.onsubmit=async e=>{e.preventDefault();const v=Object.fromEntries(new FormData(form));const upload=form.querySelector("input[type=file]")?.files?.[0]||null;if(type==="file"&&upload){v.name=upload.name;v.size=(upload.size/1024/1024).toFixed(1)+" MB"}delete v.upload;if(id){const x=state[key].find(x=>x.id==id);Object.keys(v).forEach(k=>x[k]=(k==="amount"||k==="progress")?Number(v[k]):v[k]);if(type==="file"&&upload)await saveUpload(x.id,upload)}else{const x={id:Date.now(),...v};if(type==="project")x.progress=Number(v.progress)||0;if(type==="invoice")x.amount=Number(v.amount)||0;if(type==="file"){x.type=(v.name.split(".").pop()||"FILE").toUpperCase();if(upload)await saveUpload(x.id,upload)}state[key].push(x)}save();close();setView(type==="event"?"calendar":type+"s")}}
function settings(){content.innerHTML='<h2 id="modalTitle">Settings</h2><p class="lead">Your dashboard currently stores demo/workspace data in this browser.</p><div class="panel" style="box-shadow:none"><div class="panel-body"><b>Workspace data</b><p style="font-size:11px;color:#777;line-height:1.6">This front-end version is local to this browser. For real client data, we should later add authentication, a database and secure file storage.</p><button class="btn secondary" id="resetData">Restore demo data</button></div></div>';back.hidden=false;back.style.display="grid";back.classList.add("is-open");document.body.style.overflow="hidden";document.getElementById("resetData").onclick=()=>{if(confirm("Restore the original Dillo demo data? Your current browser data will be replaced.")){state=JSON.parse(JSON.stringify(seed));save();close();setView("overview")}}}
function notifications(){content.innerHTML='<h2 id="modalTitle">Notifications</h2><p class="lead">Current items that may need attention.</p>'+((state.invoices.some(i=>i.status==="Overdue")||state.files.some(f=>f.status==="Pending"))?'<div class="list-row"><div><b>'+state.invoices.filter(i=>i.status==="Overdue").length+' overdue invoice(s)</b><small>Review the Invoices section.</small></div></div><div class="list-row"><div><b>'+state.files.filter(f=>f.status==="Pending").length+' file(s) awaiting approval</b><small>Review the Files section.</small></div></div>':empty("You're all caught up. ✦"));back.hidden=false;back.style.display="grid";back.classList.add("is-open");document.body.style.overflow="hidden"}
function profile(){content.innerHTML='<h2 id="modalTitle">Aya & Jam</h2><p class="lead">Admin workspace profile.</p><div class="list-row"><div><b>Dillo Socials</b><small>Workspace administrator</small></div><span class="tag green">Admin</span></div>';back.hidden=false;back.style.display="grid";back.classList.add("is-open");document.body.style.overflow="hidden"}
function close(){back.classList.remove("is-open");back.hidden=true;back.style.display="none";document.body.style.overflow=""}
async function remove(type,id){const key=type==="event"?"events":type+"s";state[key]=state[key].filter(x=>x.id!=id);if(type==="file")try{await deleteUpload(id)}catch(e){}save();setView(type==="event"?"calendar":type+"s")}
function bind(){page.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>setView(b.dataset.view));page.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>{b.dataset.action==="settings"?settings():modal(b.dataset.action)});page.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>modal(b.dataset.edit,b.dataset.id));page.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{if(confirm("Delete this item?"))remove(b.dataset.remove,b.dataset.id)})}
const views={overview,clients,projects,calendar,invoices,files};
function setView(v){if(!views[v])return;document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===v));title.textContent=v[0].toUpperCase()+v.slice(1);views[v]();window.scrollTo(0,0)}
document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.onclick=()=>setView(b.dataset.view));
document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.getElementById("notifyBtn").onclick=notifications;
document.getElementById("profileBtn").onclick=profile;
document.querySelector('.sidebar-bottom [data-action="settings"]').onclick=settings;
document.getElementById("modalClose").onclick=close;
back.onclick=e=>{if(e.target===back)close()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
setView("overview");
})();