const H=[["M","H","H","VH","VH"],["L","M","H","H","VH"],["L","L","M","H","H"],["L","L","M","M","H"],["L","L","L","M","M"]],a={A:0,B:1,C:2,D:3,E:4},l={L:"Low",M:"Medium",H:"High",VH:"Very High"};function c(t,e){const i=a[t],o=e-1;if(i===void 0||o<0||o>4)throw new Error("Invalid likelihood symbol or severity value");const n=H[i][o],r=l[n]||"Undefined";return{controlRating:n,monitoringRating:r}}export{c};