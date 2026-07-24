let n={index:0,total:0};const e=new Set;function s(t){n=t;for(const o of e)o(t)}function r(t){return t(n),e.add(t),()=>{e.delete(t)}}export{r as a,s};
