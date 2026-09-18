(()=>{"use strict";
const KEY="dillo_dashboard_v4";
let state=JSON.parse(localStorage.getItem(KEY)||'{"clients":[],"projects":[],"events":[],"invoices":[],"files":[]}');
const page=document.getElementById("page"),title=document.getElementById("viewTitle");
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const empty=(msg)=>'<div class="empty">'+msg+'</div>';
function shell(h,p,button){return '<div class="hero"><div><div class="eyebrow">DILLO SOCIALS</div><h1>'+h+'</h1><p>'+p+'</p></div><div class="hero-actions">'+(button||"")+"</div></div>"}
function card(h,b){return '<section class="panel"><div class="panel-head"><h2>'+h+'</h2></div><div class="panel-body">'+b+"</div></section>"}
function btn(label,action,cls="primary"){return '<button class="btn '+cls+'" data-action="'+action+'">'+label+"</button>"}
function removeButton(type,id){return '<button class="small-btn danger-btn" data-remove="'+type+'" data-id="'+id+'">Delete</button>'}
function overview(){
const active=state.clients.filter(c=>c.status==="Active").length;
const outstanding=state.invoices.filter(i=>i.status!=="Paid").reduce((n,i)=>n+(+i.amount||0),0);
const paid=state.invoices.filter(i=>i.status==="Paid").reduce((n,i)=>n+(+i.amount||0),0);
const attention=state.invoices.filter(i=>i.status==="Overdue").map(i=>'<div class="list-row"><div><b>'+esc(i.number)+' is overdue</b><small>'+esc(i.client)+' · $'+esc(i.amount)+'</small></div><span class="tag red">Action needed</span></div>').join("")+
state.files.filter(f=>f.status==="Pending").map(f=>'<div class="list-row"><div><b>'+esc(f.name)+' needs approval</b><small>'+esc(f.client)+'</small></div><span class="tag yellow">Review</span></div>').join("")||empty("Nothing needs your attention right now. ✦");
page.innerHTML=shell("Good morning, Dillo. <span>Let’s make things move.</span>","Your command center for clients, projects, content, money and the work behind the scenes.",btn("+ New client","client")+btn("+ New project","project","secondary"))+
'<div class="kpis"><div class="kpi"><div class="kpi-top">Active clients</div><strong>'+active+'</strong><small>'+state.clients.length+' total</small></div><div class="kpi"><div class="kpi-top">Projects</div><strong>'+state.projects.length+'</strong><small>Tracked in workspace</small></div><div class="kpi"><div class="kpi-top">Paid this cycle</div><strong>$'+paid.toLocaleString()+'</strong><small>Recorded payments</small></div><div class="kpi"><div class="kpi-top">Outstanding</div><strong>$'+outstanding.toLocaleString()+'</strong><small>'+state.invoices.filter(i=>i.status!=="Paid").length+' open invoices</small></div></div>'+
'<div class="overview-grid"><div class="overview-main">'+card("Needs your attention",attention)+card("Projects at a glance",state.projects.length?state.projects.slice(0,5).map(p=>'<div class="list-row"><div><b>'+esc(p.name)+'</b><small>'+esc(p.client)+' · '+esc(p.status)+'</small></div><b>'+p.progress+'%</b></div>').join(""):empty("No projects yet. Add your first project above."))+'</div><div class="overview-side">'+card("Quick actions",'<div class="quick-grid">'+['clients','projects','calendar','invoices','files'].map(v=>'<button class="quick" data-view="'+v+'"><strong>'+v.charAt(0).toUpperCase()+v.slice(1)+'</strong><span>Open workspace</span></button>').join("")+'</div>')+card("Coming up",state.events.length?state.events.slice().sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5).map(e=>'<div class="list-row"><div><b>'+esc(e.title)+'</b><small>'+esc(e.date)+'</small></div></div>').join(""):empty("No calendar items yet."))+'</div></div>';bind()}
function clients(){
const rows=state.clients.map(c=>'<tr><td><b>'+esc(c.name)+'</b><small>'+esc(c.email||"")+'</small></td><td>'+esc(c.company)+'</td><td>'+esc(c.status)+'</td><td>'+removeButton("client",c.id)+'</td></tr>').join("");
page.innerHTML=shell("Clients.","Add and manage every Dillo client in one place.",btn("+ Add client","client"))+card("Client list",rows?'<div style="overflow:auto"><table class="data-table"><thead><tr><th>Client</th><th>Business</th><th>Status</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div>':empty("No clients yet. Click “+ Add client” to create your first one."));bind()}
function projects(){
const cards=state.projects.map(p=>'<article class="project-card"><div class="project-top"><span class="tag blue">'+esc(p.status)+'</span><b>'+p.progress+'%</b></div><h3>'+esc(p.name)+'</h3><p>'+esc(p.client)+' · Due '+esc(p.due||"—")+'</p><div class="progress"><i style="width:'+p.progress+'%"></i></div><div style="margin-top:12px;display:flex;gap:6px">'+removeButton("project",p.id)+'</div></article>').join("");
page.innerHTML=shell("Projects in motion.","Create projects and track the work from start to finish.",btn("+ New project","project"))+'<div class="project-grid">'+(cards||empty("No projects yet. Click “+ New project” to add one."))+"</div>";bind()}
function calendar(){
const rows=state.events.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(e=>'<div class="list-row"><div><b>'+esc(e.title)+'</b><small>'+esc(e.date)+'</small></div>'+removeButton("event",e.id)+'</div>').join("");
page.innerHTML=shell("Calendar.","Add calls, deadlines, launches and other important dates.",btn("+ Add calendar item","event"))+card("Your calendar",rows||empty("Your calendar is empty. Click “+ Add calendar item” to add something."));bind()}
function invoices(){
const rows=state.invoices.map(i=>'<tr><td><b>'+esc(i.number)+'</b></td><td>'+esc(i.client)+'</td><td>$'+esc(i.amount)+'</td><td>'+esc(i.status)+'</td><td>'+removeButton("invoice",i.id)+'</td></tr>').join("");
page.innerHTML=shell("Invoices.","Record what you bill and what has been paid.",btn("+ Add invoice","invoice"))+card("Invoice list",rows?'<div style="overflow:auto"><table class="data-table"><thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div>':empty("No invoices yet. Click “+ Add invoice” to create one."));bind()}
function files(){
const rows=state.files.map(f=>'<div class="file-card"><span class="file-icon">'+esc(f.type)+'</span><div style="flex:1"><b>'+esc(f.name)+'</b><small>'+esc(f.client)+' · '+esc(f.size||"")+'</small></div><span class="tag '+(f.status==="Approved"?"green":"yellow")+'">'+esc(f.status)+'</span>'+removeButton("file",f.id)+'</div>').join("");
page.innerHTML=shell("Files.","Keep client assets and deliverables organized.",btn("+ Add file","file"))+card("Shared files",rows?'<div class="file-list">'+rows+"</div>":empty("No files yet. Click “+ Add file” to add file information."));bind()}
function modal(titleText,body){
const back=document.getElementById("modalBackdrop"),content=document.getElementById("modalContent");
content.innerHTML='<h2>'+titleText+'</h2>'+body;back.hidden=false;back.style.display="grid";back.classList.add("is-open");document.body.style.overflow="hidden";
content.querySelectorAll("[data-close]").forEach(b=>b.onclick=close);
const form=content.querySelector("form");if(form)form.onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(form));const type=form.dataset.type;const id=Date.now();
if(type==="client")state.clients.push({id,name:v.name,company:v.company,email:v.email,status:v.status});
if(type==="project")state.projects.push({id,name:v.name,client:v.client,status:v.status,progress:0,due:v.due});
if(type==="event")state.events.push({id,title:v.title,date:v.date});
if(type==="invoice")state.invoices.push({id,number:v.number||"INV-"+String(state.invoices.length+1).padStart(3,"0"),client:v.client,amount:+v.amount||0,status:v.status});
if(type==="file"){const file=form.file.files[0];state.files.push({id,name:file?file.name:v.name,client:v.client,type:(file?(file.name.split(".").pop()||"FILE"):"FILE").toUpperCase(),size:file?((file.size/1048576).toFixed(1)+" MB"):"",status:"Pending"})}
save();close();setView(type==="event"?"calendar":type+"s");};}
function form(type){
const clients=state.clients.map(c=>'<option>'+esc(c.company)+'</option>').join("")||'<option>No clients yet</option>';
if(type==="client")return modal("Add client",'<form data-type="client"><div class="form-grid"><div class="field"><label>Name</label><input name="name" required placeholder="Client name"></div><div class="field"><label>Business</label><input name="company" required placeholder="Business name"></div><div class="field"><label>Email</label><input name="email" type="email" placeholder="email@business.com"></div><div class="field"><label>Status</label><select name="status"><option>Active</option><option>Onboarding</option><option>Paused</option></select></div></div><div class="modal-actions"><button type="button" class="btn secondary" data-close>Cancel</button><button class="btn primary">Add client</button></div></form>');
if(type==="project")return modal("Add project",'<form data-type="project"><div class="form-grid"><div class="field full"><label>Project name</label><input name="name" required placeholder="September Content"></div><div class="field"><label>Client</label><select name="client">'+clients+'</select></div><div class="field"><label>Due date</label><input name="due" type="date"></div><div class="field"><label>Status</label><select name="status"><option>Not started</option><option>In progress</option><option>Review</option><option>Complete</option></select></div></div><div class="modal-actions"><button type="button" class="btn secondary" data-close>Cancel</button><button class="btn primary">Add project</button></div></form>');
if(type==="event")return modal("Add calendar item",'<form data-type="event"><div class="form-grid"><div class="field"><label>Date</label><input name="date" type="date" required></div><div class="field"><label>Title</label><input name="title" required placeholder="Client call"></div></div><div class="modal-actions"><button type="button" class="btn secondary" data-close>Cancel</button><button class="btn primary">Add to calendar</button></div></form>');
if(type==="invoice")return modal("Add invoice",'<form data-type="invoice"><div class="form-grid"><div class="field"><label>Invoice number</label><input name="number" placeholder="INV-001"></div><div class="field"><label>Client</label><select name="client">'+clients+'</select></div><div class="field"><label>Amount</label><input name="amount" type="number" min="0" required placeholder="0"></div><div class="field"><label>Status</label><select name="status"><option>Pending</option><option>Paid</option><option>Overdue</option></select></div></div><div class="modal-actions"><button type="button" class="btn secondary" data-close>Cancel</button><button class="btn primary">Add invoice</button></div></form>');
return modal("Add file",'<form data-type="file"><div class="form-grid"><div class="field full"><label>Choose file</label><input name="file" type="file"></div><div class="field"><label>File name (if no upload)</label><input name="name" placeholder="Brand guide.pdf"></div><div class="field"><label>Client</label><select name="client">'+clients+'</select></div></div><div class="modal-actions"><button type="button" class="btn secondary" data-close>Cancel</button><button class="btn primary">Add file</button></div></form>');
}
function close(){const b=document.getElementById("modalBackdrop");b.classList.remove("is-open");b.hidden=true;b.style.display="none";document.body.style.overflow=""}
function remove(type,id){const key=type==="event"?"events":type+"s";state[key]=state[key].filter(x=>x.id!=id);save();setView(type==="event"?"calendar":type+"s")}
function bind(){page.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>setView(b.dataset.view));page.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>form(b.dataset.action));page.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{if(confirm("Delete this item?"))remove(b.dataset.remove,b.dataset.id)})}
function setView(v){document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===v));title.textContent=v[0].toUpperCase()+v.slice(1);views[v]();window.scrollTo(0,0)}
document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.onclick=()=>setView(b.dataset.view));
document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.getElementById("notifyBtn").onclick=()=>alert("No new notifications.");
document.getElementById("profileBtn").onclick=()=>alert("Dillo workspace — data is stored in this browser.");
document.getElementById("modalClose").onclick=close;
document.getElementById("modalBackdrop").onclick=e=>{if(e.target.id==="modalBackdrop")close()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
setView("overview");
})();