let n=!1;const t=new Set;function r(){n=!0;for(const e of t)e();t.clear()}function o(e){return n?(e(),()=>{}):(t.add(e),()=>{t.delete(e)})}export{r as m,o};
