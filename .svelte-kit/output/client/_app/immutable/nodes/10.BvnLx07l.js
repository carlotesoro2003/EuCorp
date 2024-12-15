import{a as r,t as w,c as p}from"../chunks/disclose-version.DTAQul2H.js";import{p as V,a as W,b as R,g as e,c as i,f as v,m as O,n as q,r as s,s as E,t as X}from"../chunks/runtime.B4QXH2CN.js";import{d as Z,a as $}from"../chunks/store.D_on7m4h.js";import{i as t}from"../chunks/if.DRLG6bOh.js";import{e as ee,i as re}from"../chunks/attributes.DPN48yOH.js";import{c as ae}from"../chunks/svelte-component.7O_5y5kT.js";import{s as se}from"../chunks/class.BN6JjLqI.js";import{i as ie}from"../chunks/lifecycle.DAFDPKuL.js";import{p as te}from"../chunks/preload-helper.B2IhT0O3.js";import{a as oe}from"../chunks/Icon.yFnM2WBm.js";import{M as ne,A as le,a as de,b as pe,D as ve,c as me,d as ce}from"../chunks/DeptOptMonitoring.BKmAEvb8.js";import{C as H}from"../chunks/circle-alert.DJ3oU1LY.js";import{C as fe}from"../chunks/clipboard-list.rL2HrniE.js";import{T as ge}from"../chunks/triangle-alert.BSZOOXW1.js";import{L as _e}from"../chunks/lightbulb.BQf6SH5D.js";var ue=(L,M,P)=>R(M,e(P).id),be=w("<button><!> <span> </span></button>"),xe=w('<div class="flex justify-center p-8 "><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>'),he=w('<div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg"><!> <p>You do not have the required permissions to view this page.</p></div>'),ye=w('<div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg"><!> <p>Failed to load session or profile data. Please try refreshing the page.</p></div>'),ke=w('<div class="min-h-screen "><div class="container mx-auto px-4 py-8"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3"><div class="flex items-center gap-2"><!> <h1 class="text-2xl font-bold">Mid-year Monitoring Dashboard</h1></div></div> <div class="  rounded-lg shadow-sm mb-6"><div class="flex flex-wrap gap-2 p-2"></div></div> <div class="  rounded-lg shadow-sm p-6"><!></div></div></div>');function Se(L,M){V(M,!1);let P=te(M,"data",8,null),D=O(null),f=O(null),U=O(!0),m=O("Plans");const I=[{id:"Plans",label:"Plans",icon:fe},{id:"Risks",label:"Risks",icon:ge},{id:"Opportunities",label:"Opportunities",icon:_e}];(async()=>{var c;try{if((c=P())!=null&&c.session){R(D,P().session);const{user:a}=e(D),{data:o,error:n}=await oe.from("profiles").select("role").eq("id",a.id).single();n?console.error("Error fetching user profile:",n.message):(R(f,o),console.log("Role in Opportunities: ",e(f)))}else console.warn("Session is not available or data is missing.")}catch(a){console.error("Error fetching user profile or session:",a)}finally{R(U,!1)}})(),ie();var A=ke(),F=i(A),C=i(F),S=i(C),J=i(S);ne(J,{class:"w-8 h-8 text-primary"}),q(2),s(S),s(C);var z=E(C,2),Y=i(z);ee(Y,5,()=>I,re,(c,a)=>{var o=be();o.__click=[ue,m,a];var n=i(o);ae(n,()=>e(a).icon,(x,g)=>{g(x,{size:18})});var l=E(n,2),b=i(l,!0);s(l),s(o),X(()=>{se(o,`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${(e(m)===e(a).id?"bg-primary hover:bg-primary/90 text-white":"hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300")??""}`),$(b,e(a).label)}),r(c,o)}),s(Y),s(z);var B=E(z,2),K=i(B);t(K,()=>e(U),c=>{var a=xe();r(c,a)},c=>{var a=p(),o=v(a);t(o,()=>e(D)&&e(f),n=>{var l=p(),b=v(l);t(b,()=>e(f).role==="admin"||e(f).role==="vice_president"||e(f).role==="president",x=>{var g=p(),T=v(g);t(T,()=>e(m)==="Plans",_=>{le(_,{})},_=>{var d=p(),h=v(d);t(h,()=>e(m)==="Risks",u=>{de(u,{})},u=>{var y=p(),j=v(y);t(j,()=>e(m)==="Opportunities",k=>{pe(k,{})},null,!0),r(u,y)},!0),r(_,d)}),r(x,g)},x=>{var g=p(),T=v(g);t(T,()=>e(f).role==="user",_=>{var d=p(),h=v(d);t(h,()=>e(m)==="Plans",u=>{ve(u,{})},u=>{var y=p(),j=v(y);t(j,()=>e(m)==="Risks",k=>{me(k,{})},k=>{var G=p(),N=v(G);t(N,()=>e(m)==="Opportunities",Q=>{ce(Q,{})},null,!0),r(k,G)},!0),r(u,y)}),r(_,d)},_=>{var d=he(),h=i(d);H(h,{size:24}),q(2),s(d),r(_,d)},!0),r(x,g)}),r(n,l)},n=>{var l=ye(),b=i(l);H(b,{size:24}),q(2),s(l),r(n,l)},!0),r(c,a)}),s(B),s(F),s(A),r(L,A),W()}Z(["click"]);export{Se as component};
