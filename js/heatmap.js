/* StatS — heatmap.js
   Módulo separado automaticamente a partir do ficheiro original.
   Carregado antes de app.js.
*/

function heatColor(intensity){
 intensity=Math.max(0,Math.min(1,intensity));
 if(intensity<.18)return `rgba(18,55,140,${0.30+intensity})`;
 if(intensity<.38)return `rgba(25,180,85,${0.35+intensity})`;
 if(intensity<.62)return `rgba(210,225,35,${0.38+intensity})`;
 if(intensity<.82)return `rgba(255,140,20,${0.42+intensity})`;
 return `rgba(229,28,43,${0.48+intensity})`;
}

function heatMapEvents(){
 let acaoFiltro=$("heatActionFilter")?.value||"all";
 let periodoFiltro=$("heatPeriodFilter")?.value||"all";

 return reg.filter(r=>{
  if(r.x===""||r.x===undefined||r.y===""||r.y===undefined)return false;
  if(periodoFiltro!=="all" && String(r.periodo||"")!==periodoFiltro)return false;

  let a=String(r.acao||"");
  if(acaoFiltro==="shots")return a.startsWith("Remate");
  if(acaoFiltro==="goals")return a.startsWith("Golo");
  if(acaoFiltro==="recoveries")return a==="Recuperação de bola";
  if(acaoFiltro==="losses")return a==="Perda de bola"||a==="Passe falhado";
  if(acaoFiltro==="passes")return a==="Passe certo"||a==="Passe falhado";
  return true;
 });
}

function renderHeatMap(){
 let box=$("heatMapBox");
 if(!box)return;
 let eventos=heatMapEvents();

 let html=`<div class="v53HeatPitch ${eventos.length?"hasData":"empty"}">
  <div class="v53HeatOuter"></div>
  <div class="v53HeatMid"></div>
  <div class="v53HeatCircle"></div>
  <div class="v53HeatGoal top"></div>
  <div class="v53HeatGoal bottom"></div>`;

 if(eventos.length){
  let cells=[];
  for(let gx=0;gx<6;gx++){
   for(let gy=0;gy<8;gy++){
    let cx=(gx+.5)*16.666;
    let cy=(gy+.5)*12.5;
    let val=0;
    eventos.forEach(r=>{
     let dx=(Number(r.x)-cx)/17;
     let dy=(Number(r.y)-cy)/17;
     val+=Math.exp(-(dx*dx+dy*dy));
    });
    cells.push({x:cx,y:cy,v:val});
   }
  }
  let max=Math.max(...cells.map(c=>c.v),1);
  cells.forEach(c=>{
   let i=c.v/max;
   if(i>.08){
    html+=`<span class="v53HeatBlob" style="left:${c.x}%;top:${c.y}%;background:${heatColor(i)};--s:${22+(i*46)}px"></span>`;
   }
  });
 }

 html+=`</div>`;
 box.innerHTML=html;
}