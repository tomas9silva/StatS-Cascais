/* StatS — dashboardColetivo.js
   Módulo separado automaticamente a partir do ficheiro original.
   Carregado antes de app.js.
*/

function isGuardaRedesDashboard(nome){
 let n=String(nome||"").toLowerCase().trim();
 if(!n)return false;
 if(jogadorTipos && jogadorTipos[nome]==="gr")return true;
 let lista=getGuardaRedesLista();
 return lista.includes(n) || n.includes("(gr)") || n.includes(" gr") || n.includes("guarda-redes") || n.includes("guarda redes");
}

function defesaDashboard(r){
 return r && r.acao==="Defesa" && isGuardaRedesDashboard(r.jogador);
}

function renderDashboardJogo(){
 let casa=($("casa")?$("casa").value:"AD Pastéis")||"AD Pastéis";
 let fora=($("fora")?$("fora").value:"Adversário")||"Adversário";
 let r=calcularResumoJogo();

 return `<div class="dashboardBox">
  <h3>📊 Dashboard do jogo</h3>
  <div class="log"><b>${casa} ${casaGoals}-${foraGoals} ${fora}</b><br>MVP sugerido: <b>${r.mvp}</b></div>
  <div class="dashboardGrid">
   <div class="dashboardStat">Golos<b>${r.totalGolos}</b></div>
   <div class="dashboardStat">Remates<b>${r.totalRemates}</b></div>
   <div class="dashboardStat">Assistências<b>${r.totalAssist}</b></div>
   <div class="dashboardStat">Defesas GR<b>${r.totalDefesas}</b></div>
   <div class="dashboardStat">🔙 Recuperações<b>${r.totalRecuperacoes}</b></div>
   <div class="dashboardStat">⛔️ Perdas<b>${r.totalPerdas}</b></div>
   <div class="dashboardStat">🟥 Expulsões<b>${r.totalExpulsoes}</b></div>
   <div class="dashboardStat">Eficácia<b>${r.eficacia}%</b></div>
  </div>
 </div>`;
}

function exportDashboard(){
 let casa=($("casa")?$("casa").value:"AD Pastéis")||"AD Pastéis";
 let fora=($("fora")?$("fora").value:"Adversário")||"Adversário";
 let resumo=calcularResumoJogo();
 let minutos=calcularMinutosJogadores();

 function periodoData(periodo){
  let eventos=reg.filter(r=>r.periodo===periodo);
  let golos=eventos.filter(r=>r.acao&&r.acao.startsWith("Golo")&&r.acao!=="Golo sofrido").length;
  let sofridos=eventos.filter(r=>r.acao==="Golo sofrido").length;
  let remates=eventos.filter(r=>r.acao&&r.acao.startsWith("Remate")).length;
  let defesas=eventos.filter(r=>defesaDashboard(r)).length;
  let assist=eventos.filter(r=>r.acao==="Assistência").length;
  let passes=eventos.filter(r=>r.acao==="Passe falhado").length;
  let eficacia=remates?Math.round((golos/remates)*100):0;
  return {eventos,golos,sofridos,remates,defesas,assist,passes,eficacia,lado:ladoAtaquePeriodo(periodo)};
 }

 let p1=periodoData("1.º período");
 let p2=periodoData("2.º período");
 let p3=periodoData("3.º período");

 let topRemates=Object.entries(resumo.porJogador).sort((a,b)=>b[1].remates-a[1].remates).slice(0,3);
 let topAcoes=Object.entries(resumo.porJogador).sort((a,b)=>b[1].total-a[1].total).slice(0,3);
 let minsTop=Object.entries(minutos).sort((a,b)=>(b[1].total||0)-(a[1].total||0)).slice(0,12);

 let dist=[
  ["Golos",resumo.totalGolos,"#E31B2F"],
  ["Remates",resumo.totalRemates,"#FFD21A"],
  ["Assist.",resumo.totalAssist,"#1E7CFF"],
  ["Defesas",resumo.totalDefesas,"#18A64A"],
  ["Recup.",resumo.totalRecuperacoes,"#1E7CFF"],
  ["Perdas",resumo.totalPerdas,"#BFC7D5"],
  ["Expuls.",resumo.totalExpulsoes,"#8C1D40"]
 ];
 let distTotal=dist.reduce((a,b)=>a+(+b[1]||0),0)||1;

 let canvas=document.createElement("canvas");
 canvas.width=1080;
 canvas.height=1920;
 let ctx=canvas.getContext("2d");

 const W=1080,H=1920;
 const navy="#06152B", red="#D71920", white="#FFFFFF", gold="#FFD21A", blue="#1E7CFF", green="#18A64A", sand="#D8BD7E";

 function rr(x,y,w,h,r,fill,stroke,lw){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
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

 function fit(t,x,y,maxW,s,c,w,a){
  ctx.fillStyle=c||white;
  ctx.font=(w||700)+" "+s+"px Arial";
  ctx.textAlign=a||"left";
  ctx.textBaseline="top";
  let txt=String(t||"");
  while(ctx.measureText(txt).width>maxW && txt.length>4){
   txt=txt.slice(0,-2)+"…";
  }
  ctx.fillText(txt,x,y);
 }

 function center(t,x,y,s,c,w){tx(t,x,y,s,c,w,"center");}
 function right(t,x,y,s,c,w){tx(t,x,y,s,c,w,"right");}

 function bg(){
  let g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,"#06152B");
  g.addColorStop(1,"#020A18");
  ctx.fillStyle=g;
  ctx.fillRect(0,0,W,H);

  ctx.save();
  ctx.globalAlpha=.9;
  ctx.strokeStyle=red;
  ctx.lineWidth=18;
  for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-30,60+i*18);ctx.lineTo(210,5+i*28);ctx.stroke();}
  ctx.strokeStyle=white;
  ctx.lineWidth=9;
  for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-20,145+i*16);ctx.lineTo(185,95+i*24);ctx.stroke();}
  ctx.restore();

  ctx.save();
  ctx.translate(W,0);
  ctx.scale(-1,1);
  ctx.globalAlpha=.75;
  ctx.strokeStyle=red;
  ctx.lineWidth=15;
  for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-25,65+i*18);ctx.lineTo(185,10+i*28);ctx.stroke();}
  ctx.restore();

  ctx.save();
  ctx.translate(0,H);
  ctx.globalAlpha=.85;
  ctx.strokeStyle=red;
  ctx.lineWidth=18;
  for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-30,-70-i*18);ctx.lineTo(230,-12-i*28);ctx.stroke();}
  ctx.strokeStyle=white;
  ctx.lineWidth=9;
  for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-20,-145-i*16);ctx.lineTo(185,-95-i*24);ctx.stroke();}
  ctx.restore();

  ctx.save();
  ctx.translate(W,H);
  ctx.scale(-1,1);
  ctx.globalAlpha=.75;
  ctx.strokeStyle=red;
  ctx.lineWidth=18;
  for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-25,-70-i*18);ctx.lineTo(230,-16-i*28);ctx.stroke();}
  ctx.restore();
 }

 function statCard(x,y,w,h,label,value,sub){
  rr(x,y,w,h,12,"rgba(255,255,255,.045)","rgba(255,255,255,.38)",1.2);
  center(label,x+w/2,y+16,18,white,900);
  center(value,x+w/2,y+45,42,white,900);
  if(sub)center(sub,x+w/2,y+94,13,"rgba(255,255,255,.78)",700);
 }

 function cleanResultCell(x,y,w,h,title,a,b){
  center(title,x+w/2,y,14,white,900);
  right(a,x+w/2-16,y+28,36,white,900);
  center("-",x+w/2,y+32,25,white,900);
  tx(b,x+w/2+16,y+28,36,red,900);
 }

 function cleanEffCell(x,y,w,h,title,pct){
  center(title,x+w/2,y,14,white,900);
  ctx.strokeStyle="rgba(255,255,255,.18)";
  ctx.lineWidth=9;
  ctx.beginPath();
  ctx.arc(x+w/2-28,y+42,18,0,Math.PI*2);
  ctx.stroke();
  ctx.strokeStyle=red;
  ctx.beginPath();
  ctx.arc(x+w/2-28,y+42,18,-Math.PI/2,-Math.PI/2+(Math.PI*2*(pct/100)));
  ctx.stroke();
  tx(pct+"%",x+w/2+4,y+28,28,white,900);
 }

 function drawAppPitch(x,y,w,h,title,data,events){
  rr(x,y,w,h,12,"rgba(255,255,255,.04)","rgba(255,255,255,.34)",1);
  rr(x,y,w,38,8,red,null,0);
  let ladoTitulo=data.lado||ladoAtaquePeriodo(title.includes("1")?"1.º período":title.includes("2")?"2.º período":title.includes("3")?"3.º período":title.includes("PRO")?"Prolongamento":title.includes("PEN")?"Penáltis":$("periodo")?.value);
  center(title+"  "+(ladoTitulo==="left"?"←":"→"),x+w/2,y+8,16,white,900);

  let px=x+10, py=y+48, pw=w-20, ph=h-118;
  rr(px,py,pw,ph,0,sand,"rgba(255,255,255,.78)",1);

  ctx.strokeStyle="rgba(255,255,255,.88)";
  ctx.lineWidth=1.4;

  // Apenas quatro linhas laterais + balizas à esquerda e direita
  ctx.beginPath();
  ctx.moveTo(px+8,py+8);
  ctx.lineTo(px+pw-8,py+8);
  ctx.lineTo(px+pw-8,py+ph-8);
  ctx.lineTo(px+8,py+ph-8);
  ctx.closePath();
  ctx.stroke();

  // Baliza esquerda
  ctx.strokeRect(px+2,py+ph/2-20,12,40);
  // Baliza direita
  ctx.strokeRect(px+pw-14,py+ph/2-20,12,40);

  // emojis iguais à aplicação, respeitando a direção
  events.forEach(r=>{
   let rawX=Number(r.x||50);
   let plotX=(r.attackSide==="left")?(100-rawX):rawX;
   let ex=px+(plotX/100)*pw;
   let ey=py+(Number(r.y||50)/100)*ph;
   ctx.font="14px Arial";
   ctx.textAlign="center";
   ctx.textBaseline="middle";
   ctx.fillText(r.emoji||acaoObj(r.acao).emoji,ex,ey);
  });

  let by=y+h-55;
  let cols=[["GOLOS",data.golos],["REMATES",data.remates],["DEFESAS",data.defesas],["SOFR.",data.sofridos]];
  cols.forEach((c,i)=>{
   let cx=x+22+i*((w-44)/4);
   center(c[0],cx,by,9,"rgba(255,255,255,.78)",800);
   center(c[1],cx,by+18,22,white,900);
  });
 }

 function leaderboard(x,y,w,h,title,rows,kind){
  rr(x,y,w,h,12,"rgba(255,255,255,.045)","rgba(255,255,255,.34)",1);
  rr(x,y,w,42,8,red,null,0);
  center(title,x+w/2,y+10,19,white,900);

  if(!rows.length){center("Sem dados",x+w/2,y+82,20,"rgba(255,255,255,.75)",700);return;}

  rows.forEach(([j,s],i)=>{
   let val=kind==="remates"?s.remates:s.total;
   let yy=y+64+i*54;
   tx((i+1)+"º",x+18,yy,20,white,900);
   fit(j,x+60,yy,130,20,white,800);
   rr(x+w-48,yy-4,34,28,5,red,null,0);
   center(val,x+w-31,yy+1,19,white,900);
   ctx.strokeStyle="rgba(255,255,255,.22)";
   ctx.beginPath();ctx.moveTo(x+16,yy+39);ctx.lineTo(x+w-16,yy+39);ctx.stroke();
  });
 }

 function coletivoBox(x,y,w,h){
  rr(x,y,w,h,12,"rgba(255,255,255,.045)","rgba(255,255,255,.34)",1);
  rr(x,y,w,42,8,red,null,0);
  center("COLETIVO",x+w/2,y+10,19,white,900);
  let rows=[["REMATES",resumo.totalRemates],["GOLOS",resumo.totalGolos],["PERDAS",resumo.totalPerdas],["EFICÁCIA",resumo.eficacia+"%"]];
  rows.forEach((r,i)=>{
   let yy=y+62+i*41;
   tx(r[0],x+18,yy,17,white,800);
   right(r[1],x+w-18,yy-4,24,white,900);
   ctx.strokeStyle="rgba(255,255,255,.18)";
   ctx.beginPath();ctx.moveTo(x+16,yy+29);ctx.lineTo(x+w-16,yy+29);ctx.stroke();
  });
 }

 function minutosWide(x,y,w,h){
  // sem rebordo exterior, apenas barra de título
  rr(x,y,w,42,8,red,null,0);
  center("MINUTOS JOGADOS",x+w/2,y+10,19,white,900);

  let c1=x+20, c2=x+320, c3=x+440, c4=x+560, c5=x+680, c6=x+w-25;
  tx("JOGADORA",c1,y+58,14,white,900);
  center("1.º",c2,y+58,14,white,900);
  center("2.º",c3,y+58,14,white,900);
  center("3.º",c4,y+58,14,white,900);
  center("PROL.",c5,y+58,14,white,900);
  right("TOTAL",c6,y+58,14,red,900);

  minsTop.forEach(([j,m],i)=>{
   let yy=y+84+i*26;
   fit((i+1)+". "+j,c1,yy,260,15,white,700);
   center(minutosTexto(m["1.º período"]||0),c2,yy,14,white,700);
   center(minutosTexto(m["2.º período"]||0),c3,yy,14,white,700);
   center(minutosTexto(m["3.º período"]||0),c4,yy,14,white,700);
   center(minutosTexto(m["Prolongamento"]||0),c5,yy,14,white,700);
   right(minutosTexto(m.total||0),c6,yy,14,red,900);
  });
 }

 function distributionCompact(x,y,w,h){
  // sem título e sem rebordo para ganhar espaço
  let cx=x+115,cy=y+88,r=48,start=-Math.PI/2;
  dist.forEach(d=>{
   let a=(d[1]/distTotal)*Math.PI*2;
   ctx.beginPath();ctx.moveTo(cx,cy);ctx.fillStyle=d[2];ctx.arc(cx,cy,r,start,start+a);ctx.closePath();ctx.fill();
   start+=a;
  });
  ctx.fillStyle=navy;ctx.beginPath();ctx.arc(cx,cy,25,0,Math.PI*2);ctx.fill();

  dist.forEach((d,i)=>{
   let yy=y+34+i*24;
   ctx.fillStyle=d[2];ctx.fillRect(x+220,yy,16,16);
   tx(d[0],x+246,yy-2,14,white,700);
   right(d[1],x+w-75,yy-2,14,white,800);
   right(Math.round((d[1]/distTotal)*100)+"%",x+w-25,yy-2,14,"rgba(255,255,255,.7)",700);
  });
 }

 bg();

 // Cabeçalho
 center("— RELATÓRIO DE JOGO —",540,34,28,white,900);
 fit(casa,96,92,310,50,white,900);
 center(casaGoals,470,78,82,white,900);
 center("-",540,95,48,white,900);
 center(foraGoals,610,78,82,red,900);
 fit(fora,720,92,300,50,white,900);
 rr(420,174,240,36,4,red,null,0);
 center("RESULTADO FINAL",540,181,23,white,900);

 // Estatísticas principais
 let topY=230;
 statCard(30,topY,168,122,"GOLOS",resumo.totalGolos,(resumo.totalGolos/3).toFixed(2).replace(".",",")+" / PERÍODO");
 statCard(198,topY,168,122,"REMATES",resumo.totalRemates,(resumo.totalRemates/3).toFixed(2).replace(".",",")+" / PERÍODO");
 statCard(366,topY,168,122,"ASSISTÊNCIAS",resumo.totalAssist,(resumo.totalAssist/3).toFixed(2).replace(".",",")+" / PERÍODO");
 statCard(534,topY,168,122,"DEFESAS",resumo.totalDefesas,(resumo.totalDefesas/3).toFixed(2).replace(".",",")+" / PERÍODO");
 statCard(702,topY,168,122,"EFICÁCIA",resumo.eficacia+"%",resumo.totalGolos+" G / "+resumo.totalRemates+" R");
 statCard(870,topY,180,122,"GOLOS SOFR.",resumo.totalGolosSofridos,(resumo.totalGolosSofridos/3).toFixed(2).replace(".",",")+" / PERÍODO");

 // Resultado — sem texto longo
 rr(30,372,1020,84,12,"rgba(255,255,255,.03)","rgba(255,255,255,.28)",1);
 rr(55,394,138,40,5,red,null,0);
 center("RESULTADO",124,403,21,white,900);
 cleanResultCell(290,390,120,56,"1.º",p1.golos,p1.sofridos);
 cleanResultCell(480,390,120,56,"2.º",p2.golos,p2.sofridos);
 cleanResultCell(670,390,120,56,"3.º",p3.golos,p3.sofridos);
 cleanResultCell(860,390,130,56,"TOTAL",resumo.totalGolos,resumo.totalGolosSofridos);

 // Eficácia — sem bordas internas e só percentagem
 rr(30,470,1020,84,12,"rgba(255,255,255,.03)","rgba(255,255,255,.28)",1);
 rr(55,492,178,40,5,red,null,0);
 center("EFICÁCIA REMATE",144,501,19,white,900);
 cleanEffCell(290,488,120,54,"1.º",p1.eficacia);
 cleanEffCell(480,488,120,54,"2.º",p2.eficacia);
 cleanEffCell(670,488,120,54,"3.º",p3.eficacia);
 cleanEffCell(860,488,130,54,"TOTAL",resumo.eficacia);

 // Arenas
 center("ARENAS POR PERÍODO",540,584,24,white,900);
 drawAppPitch(30,620,245,285,"1.º PERÍODO",p1,p1.eventos);
 drawAppPitch(295,620,245,285,"2.º PERÍODO",p2,p2.eventos);
 drawAppPitch(560,620,245,285,"3.º PERÍODO",p3,p3.eventos);
 drawAppPitch(825,620,225,285,"COLETIVO",{
  golos:resumo.totalGolos,remates:resumo.totalRemates,defesas:resumo.totalDefesas,sofridos:resumo.totalGolosSofridos,lado:attackSide
 },reg);

 // Blocos centrados
 leaderboard(90,938,260,250,"TOP 3 REMATES",topRemates,"remates");
 leaderboard(410,938,260,250,"TOP 3 AÇÕES",topAcoes,"acoes");
 coletivoBox(730,938,260,250);

 // Minutos sem rebordo
 minutosWide(30,1220,1020,340);

 // Distribuição compacta sem título
 distributionCompact(30,1590,1020,155);

 center("PAIXÃO  •  ENTREGA  •  FAMÍLIA",540,1848,22,white,900);

 let nome="dashboard_"+casa+"_vs_"+fora+".png";
 if(canvas.toBlob){
  canvas.toBlob(blob=>{
   let url=URL.createObjectURL(blob);
   let a=document.createElement("a");
   a.href=url;
   a.download=nome;
   document.body.appendChild(a);
   a.click();
   a.remove();
   URL.revokeObjectURL(url);
  },"image/png");
 }else{
  let a=document.createElement("a");
  a.href=canvas.toDataURL("image/png");
  a.download=nome;
  a.click();
 }
}