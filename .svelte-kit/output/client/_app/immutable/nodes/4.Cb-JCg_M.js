import{c as he,a as S,t as M}from"../chunks/disclose-version.DTAQul2H.js";import{f as de,p as F,c as s,r as t,s as o,t as D,a as I,b as r,d as g,g as a,F as ne,n as ce,e as V}from"../chunks/runtime.B4QXH2CN.js";import{i as ye}from"../chunks/lifecycle.DAFDPKuL.js";import{o as we}from"../chunks/index-client.Bib29rnf.js";/* empty css                         */import{I as Ce,s as ke,a as z}from"../chunks/Icon.yFnM2WBm.js";import{d as Y,a as T}from"../chunks/store.D_on7m4h.js";import{i as W}from"../chunks/if.DRLG6bOh.js";import{r as fe,e as Ee,i as Se}from"../chunks/attributes.DPN48yOH.js";import{s as je}from"../chunks/class.BN6JjLqI.js";import{b as ue}from"../chunks/input.Br29pWBN.js";import{b as Me}from"../chunks/select.CXmm0mL2.js";import{l as Pe,s as ze,p as De,a as E}from"../chunks/preload-helper.B2IhT0O3.js";import{t as Te,f as Ae}from"../chunks/index.A-vRoXhT.js";import{X as Le}from"../chunks/x.xw5d-c1A.js";import{P as Ne}from"../chunks/pencil.BlEN5tg-.js";import{T as qe}from"../chunks/trash-2.DnhmlcTU.js";import{S as Fe}from"../chunks/search.K0UJueoa.js";import{P as Ie}from"../chunks/plus.BfN9yc11.js";function Qe(u,e){const c=Pe(e,["children","$$slots","$$events","$$legacy"]);Ce(u,ze({name:"shapes"},()=>c,{iconNode:[["path",{d:"M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"}],["rect",{x:"3",y:"14",width:"7",height:"7",rx:"1"}],["circle",{cx:"17.5",cy:"17.5",r:"3.5"}]],children:(n,v)=>{var m=he(),f=de(m);ke(f,e,"default",{}),S(n,m)},$$slots:{default:!0}}))}const Ue=async(u,e,c,d)=>{r(e,!0),await c.onSubmit(d)||r(e,!1)};var Xe=M('<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"><div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border"><button class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg"><!></button> <h2 class="text-xl font-bold mb-4"> </h2> <div class="flex flex-col gap-4"><div class="flex flex-col gap-2"><label for="name">Classification Name</label> <input id="name" type="text" class="px-3 py-2 bg-secondary border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter classification name"></div> <div class="flex justify-end gap-2 mt-4"><button class="px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button> <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"> </button></div></div></div></div>');function Ze(u,e){F(e,!0);let c=De(e,"isEditing",3,!1),d=g(!1),n=E({...e.classification});var v=Xe(),m=s(v),f=s(m);f.__click=function(...C){var k;(k=e.onClose)==null||k.apply(this,C)};var x=s(f);Le(x,{size:20}),t(f);var y=o(f,2),_=s(y,!0);t(y);var p=o(y,2),b=s(p),j=o(s(b),2);fe(j),t(b);var A=o(b,2),L=s(A);L.__click=function(...C){var k;(k=e.onClose)==null||k.apply(this,C)};var w=o(L,2);w.__click=[Ue,d,e,n];var h=s(w,!0);t(w),t(A),t(p),t(m),t(v),D(()=>{T(_,c()?"Edit Classification":"Add Classification"),w.disabled=a(d)||!n.name,T(h,a(d)?"Saving...":"Save")}),ue(j,()=>n.name,C=>n.name=C),Te(3,v,()=>Ae,()=>({duration:200})),S(u,v),I()}Y(["click"]);const Be=async(u,e,c)=>{e.classification.id!==null&&(r(c,!0),await e.onDelete(e.classification.id),r(c,!1))};var Ge=(u,e)=>e.onEdit(e.classification),He=M('<div class="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"><div class="flex justify-between items-start gap-4"><h3 class="text-lg font-medium break-words flex-1"> </h3> <div class="flex gap-2 shrink-0"><button class="hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit"><!></button> <button class="hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg disabled:opacity-50" title="Delete"><!></button></div></div></div>');function Je(u,e){F(e,!0);let c=g(!1);var d=He(),n=s(d),v=s(n),m=s(v,!0);t(v);var f=o(v,2),x=s(f);x.__click=[Ge,e];var y=s(x);Ne(y,{size:18}),t(x);var _=o(x,2);_.__click=[Be,e,c];var p=s(_);qe(p,{size:18}),t(_),t(f),t(n),t(d),D(()=>{T(m,e.classification.name),_.disabled=a(c)}),S(u,d),I()}Y(["click"]);var Ke=M("<div><span> </span></div>"),Oe=(u,e)=>e(),Re=M('<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>'),Ve=(u,e)=>r(e,a(e)-1),We=(u,e)=>r(e,a(e)+1),Ye=M('<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div> <div class="flex flex-col sm:flex-row justify-between items-center gap-4"><div class="text-sm text-muted-foreground"> </div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"><option>6 per page</option><option>12 per page</option><option>24 per page</option><option>48 per page</option></select> <div class="flex gap-2"><button class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button> <button class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button></div></div></div>',1),$e=M('<div class="flex flex-col gap-4 container mx-auto "><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div class="flex items-center gap-2"><!> <h1 class="text-2xl font-bold">Classsification Management</h1></div></div> <!> <div class="flex flex-col md:flex-row gap-4 items-center justify-between"><div class="relative flex-1 w-full md:max-w-[300px]"><!> <input type="text" placeholder="Search classifications..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center whitespace-nowrap w-full md:w-auto"><!> Add Classification</button></div> <!> <!></div>');function ea(u,e){F(e,!0);let c=g(E([])),d=g(E({id:null,name:""})),n=g(!1),v=g(!1),m=g(""),f=g(!1),x=g(""),y=g("success"),_=g(!1),p=g(1),b=g(6);const j=V(()=>a(c).filter(i=>i.name.toLowerCase().includes(a(m).toLowerCase()))),A=V(()=>a(j).slice((a(p)-1)*a(b),a(p)*a(b))),L=V(()=>Math.ceil(a(j).length/a(b))),w=async()=>{r(_,!0);const{data:i,error:l}=await z.from("classification").select("id, name");l?h("Error fetching classifications.","error"):r(c,E(i||[])),r(_,!1)},h=(i,l="success")=>{r(x,E(i)),r(y,E(l)),r(f,!0),setTimeout(()=>r(f,!1),3e3)},C=(i={id:null,name:""})=>{r(d,E({...i})),r(v,i.id!==null),r(n,!0)},k=()=>{r(n,!1),r(d,E({id:null,name:""}))},ve=async i=>{if(a(v)&&i.id!==null){const{error:l}=await z.from("classification").update({name:i.name}).eq("id",i.id);if(l)return h("Error updating classification.","error"),!1;h("Classification updated successfully.")}else{const{error:l}=await z.from("classification").insert({name:i.name});if(l)return h("Error adding classification.","error"),!1;h("Classification added successfully.")}return await w(),k(),!0},me=async i=>{const{error:l}=await z.from("classification").delete().eq("id",i);l?h("Error deleting classification.","error"):(h("Classification deleted successfully."),await w())};ne(()=>{a(m)&&r(p,1)}),ne(()=>{w()});var Q=$e(),U=s(Q),$=s(U),pe=s($);Qe(pe,{class:"w-8 h-8 text-primary"}),ce(2),t($),t(U);var ee=o(U,2);W(ee,()=>a(f),i=>{var l=Ke(),P=s(l),N=s(P,!0);t(P),t(l),D(()=>{je(l,`p-4 rounded-lg ${(a(y)==="success"?"bg-green-600":"bg-red-600")??""} text-white`),T(N,a(x))}),S(i,l)});var X=o(ee,2),Z=s(X),ae=s(Z);Fe(ae,{class:"absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",size:20});var te=o(ae,2);fe(te),t(Z);var B=o(Z,2);B.__click=[Oe,C];var ge=s(B);Ie(ge,{size:20}),ce(),t(B),t(X);var se=o(X,2);W(se,()=>a(_),i=>{var l=Re();S(i,l)},i=>{var l=Ye(),P=de(l);Ee(P,21,()=>a(A),Se,(R,xe)=>{Je(R,{get classification(){return a(xe)},onEdit:C,onDelete:me})}),t(P);var N=o(P,2),G=s(N),_e=s(G);D(()=>T(_e,`Showing ${(a(p)-1)*a(b)+1} to ${Math.min(a(p)*a(b),a(j).length)??""} of ${a(j).length??""} results`)),t(G);var ie=o(G,2),q=s(ie),H=s(q);H.value=(H.__value=6)==null?"":6;var J=o(H);J.value=(J.__value=12)==null?"":12;var K=o(J);K.value=(K.__value=24)==null?"":24;var re=o(K);re.value=(re.__value=48)==null?"":48,t(q);var oe=o(q,2),O=s(oe);O.__click=[Ve,p];var le=o(O,2);le.__click=[We,p],t(oe),t(ie),t(N),D(()=>{O.disabled=a(p)===1,le.disabled=a(p)===a(L)}),Me(q,()=>a(b),R=>r(b,R)),S(i,l)});var be=o(se,2);W(be,()=>a(n),i=>{Ze(i,{get isEditing(){return a(v)},get classification(){return a(d)},onClose:k,onSubmit:ve})}),t(Q),ue(te,()=>a(m),i=>r(m,i)),S(u,Q),I()}Y(["click"]);var aa=M('<main class="container mx-auto min-h-screen p-4"><!></main>');function ya(u,e){F(e,!1);const c=async()=>{const{data:m,error:f}=await z.from("classification").select("id, name");f&&d("Error fetching classifications.","error")},d=(m,f="success")=>{setTimeout(()=>!1,3e3)};we(async()=>{await c()}),ye();var n=aa(),v=s(n);ea(v,{}),t(n),S(u,n),I()}export{ya as component};
