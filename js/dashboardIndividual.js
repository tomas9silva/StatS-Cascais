/* StatS — dashboardIndividual.js
   Módulo separado automaticamente a partir do ficheiro original.
   Carregado antes de app.js.
*/

function closeDashboardIndividualV50(){let m=$('v50IndividualModal');if(m)m.classList.remove('show');}

function openIndividualDashboardModal(){
 let m=$("individualDashModal");
 let box=$("individualDashPlayers");
 if(!m){
  document.body.insertAdjacentHTML("beforeend",`
   <div id="individualDashModal" class="modal">
    <div class="modalContent">
     <h2>Dashboard Individual</h2>
     <div id="individualDashPlayers"></div>
     <button class="danger" onclick="closeIndividualDashboardModal()">Fechar</button>
    </div>
   </div>`);
  m=$("individualDashModal");
  box=$("individualDashPlayers");
 }
 if(!box)return;
 box.innerHTML=jogadores.map(j=>`<button class="pbtn" onclick="exportDashboardIndividual('${esc(j)}')">${j}</button>`).join("");
 m.classList.add("show");
}

function closeIndividualDashboardModal(){
 let m=$("individualDashModal");
 if(m)m.classList.remove("show");
}

function exportDashboardIndividual(jogadora){
 closeIndividualDashboardModal();

 const casa=($("casa")?$("casa").value:"AD Pastéis")||"AD Pastéis";
 const fora=($("fora")?$("fora").value:"Adversário")||"Adversário";
 const minutos=calcularMinutosJogadores()[jogadora]||{};
 const eventosJog=reg.filter(r=>r.jogador===jogadora);
 const periodos=["1.º período","2.º período","3.º período","Prolongamento","Penáltis"];

 const canvas=document.createElement("canvas");
 canvas.width=1080;
 canvas.height=1920;
 const ctx=canvas.getContext("2d");

 const W=1080,H=1920;
 const navy="#06152B", navy2="#020A18", red="#D71920", white="#FFFFFF", gold="#FFD21A", sand="#D8BD7E";

 function rr(x,y,w,h,r,fill,stroke,lw){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||2;ctx.stroke();}
 }
 function tx(t,x,y,s,c,w,a){
  ctx.fillStyle=c||white;
  ctx.font=(w||700)+" "+s+"px Arial";
  ctx.textAlign=a||"left";
  ctx.textBaseline="top";
  ctx.fillText(String(t),x,y);
 }
 function center(t,x,y,s,c,w){tx(t,x,y,s,c,w,"center");}
 function right(t,x,y,s,c,w){tx(t,x,y,s,c,w,"right");}
 function fit(t,x,y,maxW,s,c,w,a){
  ctx.fillStyle=c||white;ctx.font=(w||700)+" "+s+"px Arial";ctx.textAlign=a||"left";ctx.textBaseline="top";
  let txt=String(t||"");
  while(ctx.measureText(txt).width>maxW&&txt.length>4){txt=txt.slice(0,-2)+"…";}
  ctx.fillText(txt,x,y);
 }

 function bg(){
  let g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,navy);
  g.addColorStop(1,navy2);
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle="rgba(255,255,255,.018)";
  for(let i=0;i<8;i++){ctx.beginPath();ctx.arc(100+i*135,160+i*205,230,0,Math.PI*2);ctx.fill();}
 }

 function stat(x,y,w,h,label,value){
  rr(x,y,w,h,11,"rgba(255,255,255,.045)","rgba(255,255,255,.22)",1.4);
  center(label,x+w/2,y+15,16,white,900);
  center(value,x+w/2,y+52,39,white,900);
 }

 function actionIcon(a){
  if(String(a).startsWith("Golo"))return "⚽";
  if(a==="Assistência")return "🎁";
  if(String(a).startsWith("Remate"))return "✓";
  if(a==="Defesa"||a==="Defesa GR"||a==="Defesa do GR"||a==="Remate defendido")return "🧤";
  if(a==="Recuperação de bola")return "↩";
  if(a==="Perda de bola")return "⛔";
  if(a==="Passe falhado")return "⚠";
  if(a==="Golo sofrido")return "🔴";
  if(a==="Expulsão")return "🟥";
  return "•";
 }
 function actionColor(a){
  if(String(a).startsWith("Golo"))return "#FFFFFF";
  if(a==="Assistência")return "#FFD21A";
  if(String(a).startsWith("Remate"))return "#BFC7D5";
  if(a==="Defesa"||a==="Defesa GR"||a==="Defesa do GR"||a==="Remate defendido")return "#24CE55";
  if(a==="Recuperação de bola")return "#9AA6B8";
  if(a==="Perda de bola")return "#FF4D4D";
  if(a==="Passe falhado")return "#FFD21A";
  if(a==="Golo sofrido")return "#E31B2F";
  if(a==="Expulsão")return "#E31B2F";
  return "#FFFFFF";
 }
 function drawPitch(x,y,w,h,title,events,lado){
  rr(x,y,w,h,11,"rgba(255,255,255,.035)","rgba(255,255,255,.22)",1.2);
  rr(x,y,w,38,8,red,null,0);
  center(title+" "+(lado==="left"?"←":"→"),x+w/2,y+10,16,white,900);

  const px=x+12, py=y+50, pw=w-24, ph=h-64;
  rr(px,py,pw,ph,0,sand,"rgba(255,255,255,.70)",1.2);

  ctx.strokeStyle="rgba(255,255,255,.82)";
  ctx.lineWidth=1.4;
  ctx.strokeRect(px+8,py+8,pw-16,ph-16);
  ctx.beginPath();ctx.moveTo(px+pw/2,py+8);ctx.lineTo(px+pw/2,py+ph-8);ctx.stroke();
  ctx.beginPath();ctx.arc(px+pw/2,py+ph/2,Math.min(pw,ph)*.13,0,Math.PI*2);ctx.stroke();
  ctx.strokeRect(px+2,py+ph/2-18,12,36);
  ctx.strokeRect(px+pw-14,py+ph/2-18,12,36);

  events.forEach(r=>{
   let rawX=Number(r.x||50);
   let plotX=(r.attackSide==="left"||lado==="left")?(100-rawX):rawX;
   let plotY=Number(r.y||50);
   let cx=px+(plotX/100)*pw;
   let cy=py+(plotY/100)*ph;

   ctx.fillStyle=actionColor(r.acao);
   ctx.font="20px Arial";
   ctx.textAlign="center";
   ctx.textBaseline="middle";
   ctx.fillText(actionIcon(r.acao),cx,cy);

   if(r.acao==="Recuperação de bola"){
    ctx.fillStyle="#9AA6B8";ctx.font="9px Arial";ctx.fillText("BACK",cx,cy+15);
   }
  });
 }

 function count(periodo, pred){
  return eventosJog.filter(r=>(!periodo||r.periodo===periodo)&&pred(r)).length;
 }
 function total(pred){return count(null,pred);}
 function periodoLine(pp){
  let g=count(pp,r=>String(r.acao||"").startsWith("Golo"));
  let rem=count(pp,r=>String(r.acao||"").startsWith("Remate"));
  let ass=count(pp,r=>r.acao==="Assistência");
  let def=count(pp,r=>r.acao==="Defesa"||r.acao==="Defesa GR"||r.acao==="Defesa do GR"||r.acao==="Remate defendido");
  let rec=count(pp,r=>r.acao==="Recuperação de bola");
  let per=count(pp,r=>r.acao==="Perda de bola");
  let pf=count(pp,r=>r.acao==="Passe falhado");
  let gs=count(pp,r=>r.acao==="Golo sofrido");
  return `G ${g}   R ${rem}   A ${ass}   D ${def}   REC ${rec}   PER ${per}   PF ${pf}   GS ${gs}`;
 }

 bg();

 center("DASHBOARD INDIVIDUAL",W/2,42,28,white,900);
 fit(jogadora,68,103,500,56,white,900);
 right(`${casaGoals}-${foraGoals}`,1010,105,56,white,900);
 fit(`${casa} vs ${fora}`,70,180,720,26,gold,900);

 const golos=total(r=>String(r.acao||"").startsWith("Golo"));
 const remates=total(r=>String(r.acao||"").startsWith("Remate"));
 const assist=total(r=>r.acao==="Assistência");
 const defesas=total(r=>r.acao==="Defesa"||r.acao==="Defesa GR"||r.acao==="Defesa do GR"||r.acao==="Remate defendido");
 const recuperacoes=total(r=>r.acao==="Recuperação de bola");
 const perdas=total(r=>r.acao==="Perda de bola");
 const passeFalhado=total(r=>r.acao==="Passe falhado");
 const golosSofridos=total(r=>r.acao==="Golo sofrido");
 const eficacia=remates?Math.round((golos/remates)*100):0;

 stat(40,235,155,110,"MINUTOS",minutosTexto(minutos.total||0));
 stat(205,235,125,110,"GOLOS",golos);
 stat(345,235,150,110,"REMATES",remates);
 stat(505,235,150,110,"ASSIST.",assist);
 stat(665,235,145,110,"DEFESAS",defesas);
 stat(820,235,220,110,"EFICÁCIA",eficacia+"%");
 stat(40,360,160,110,"RECUP.",recuperacoes);
 stat(210,360,160,110,"PERDAS",perdas);
 stat(385,360,195,110,"PASSE FALH.",passeFalhado);
 stat(590,360,190,110,"GOLO SOFR.",golosSofridos);
 stat(790,360,250,110,"TOTAL AÇÕES",eventosJog.length);

 const cards=[
  ["1.º PERÍODO",40,515,"1.º período"],
  ["2.º PERÍODO",385,515,"2.º período"],
  ["3.º PERÍODO",730,515,"3.º período"],
  ["PROLONGAMENTO",40,775,"Prolongamento"],
  ["PENÁLTIS",385,775,"Penáltis"],
  ["TOTAL",730,775,null]
 ];
 cards.forEach(([title,x,y,pp])=>{
  let arr=pp?eventosJog.filter(r=>r.periodo===pp):eventosJog;
  drawPitch(x,y,310,220,title,arr,pp?ladoAtaquePeriodo(pp):attackSide);
 });

 rr(40,1055,1000,450,14,"rgba(255,255,255,.045)","rgba(255,255,255,.22)",1.2);
 center("AÇÕES POR PERÍODO",W/2,1085,28,white,900);

 let y=1145;
 periodos.forEach(pp=>{
  tx(pp,70,y,20,white,900);
  tx(periodoLine(pp),70,y+34,18,white,800);
  right((minutosTexto(minutos[pp]||0))+" min",690,y+34,28,white,900);
  y+=70;
 });

 rr(40,1535,1000,175,14,"rgba(255,255,255,.045)","rgba(255,255,255,.22)",1.2);
 center("LEGENDA",W/2,1570,24,white,900);
 tx("⚽ Golo    ✓ Remate    🎁 Assistência    🧤 Defesa    ↩ Recuperação",70,1625,22,white,800);
 tx("⛔ Perda de bola    ⚠ Passe falhado    🔴 Golo sofrido    🟥 Expulsão",70,1670,22,white,800);

 center("PAIXÃO  •  ENTREGA  •  FAMÍLIA",W/2,1835,22,white,900);

 let a=document.createElement("a");
 a.download=`dashboard_individual_${jogadora.replaceAll(" ","_")}.png`;
 a.href=canvas.toDataURL("image/png");
 a.click();
}