/* StatS — núcleo, variáveis globais e arranque da aplicação. */


/* =====================================
ESTADO GLOBAL DA APLICAÇÃO
===================================== */
let total=+localStorage.getItem("total_jogadores_pasteis")||12;
let inField=+localStorage.getItem("jogadores_campo_pasteis")||5;
let dur=+localStorage.getItem("duracao_periodo_pasteis")||12;
let jogadores=JSON.parse(localStorage.getItem("jogadores_pasteis")||"[]");
let jogadorTipos=JSON.parse(localStorage.getItem("jogador_tipos_pasteis")||"{}");
if(!jogadores.length){for(let i=1;i<=total;i++)jogadores.push("Jogador "+i)}
let campo=JSON.parse(localStorage.getItem("campo_pasteis")||"null")||jogadores.slice(0,inField);
let banco=JSON.parse(localStorage.getItem("banco_pasteis")||"null")||jogadores.slice(inField);
let reg=JSON.parse(localStorage.getItem("registos_pasteis")||"[]");
let subs=JSON.parse(localStorage.getItem("subs_pasteis")||"[]");
let active=jogadores[0]||"Jogador 1";
let outTemp=null, inTemp=null, details=false, time=dur*60, timer=null, selectedEventIndex=null;
let subsOutTemp=[], subsInTemp=[];
let pendingAssistGoal=null;
let jogoMinutosAtivo=localStorage.getItem("jogo_minutos_ativo_pasteis")==="1";
let casaGoals=+localStorage.getItem("golos_casa_pasteis")||0;
let foraGoals=+localStorage.getItem("golos_fora_pasteis")||0;
let attackSide=localStorage.getItem("attack_side_pasteis")||"right";
let flow={x:null,y:null,jogador:null,acao:null,step:"idle"};
let treinoJogadores=JSON.parse(localStorage.getItem("treino_jogadores_pasteis")||"[]");
if(!treinoJogadores.length){for(let i=1;i<=10;i++)treinoJogadores.push("Jogador Treino "+i)}
let exerciciosTreino=JSON.parse(localStorage.getItem("exercicios_treino_pasteis")||"[]");
let presencasTreino=JSON.parse(localStorage.getItem("presencas_treino_pasteis")||"[]");
let departamentoMedico=JSON.parse(localStorage.getItem("departamento_medico_pasteis")||"[]");
let treinoTreinadores=JSON.parse(localStorage.getItem("treino_treinadores_pasteis")||"[]");
if(!treinoTreinadores.length)treinoTreinadores=[{nome:"Membro 1",funcao:"Equipa Técnica"}];
treinoTreinadores=treinoTreinadores.map(t=>typeof t==="string"?{nome:t,funcao:"Equipa Técnica"}:{nome:t.nome||"Membro",funcao:t.funcao||"Equipa Técnica"});
let presencasTreinadores=JSON.parse(localStorage.getItem("presencas_treinadores_pasteis")||"[]");
presencasTreinadores=presencasTreinadores.map(t=>typeof t==="string"?t:(t.nome||""));
if(!presencasTreinadores.length)presencasTreinadores=treinoTreinadores.map(t=>t.nome);
let treinoConfirmTemp=null;
let treinoEditIndex=null;
let filtroMedico="todos";
let exercicioAtualId=localStorage.getItem("exercicio_atual_pasteis")||"";
let treinoAcaoTemp={exercicioId:null,x:null,y:null};
let treinoIndividualTemp={exercicioId:null,x:null,y:null,jogador:null};
let convocatoria=JSON.parse(localStorage.getItem("convocatoria_pasteis")||"{}");
if(!convocatoria.horas)convocatoria.horas=[];
if(!convocatoria.locais)convocatoria.locais=[];
if(!convocatoria.convocadas)convocatoria.convocadas=[];
if(!convocatoria.tecnica)convocatoria.tecnica=[];


/* =====================================
LISTA DE AÇÕES DO JOGO
===================================== */
const acoes=[
 {nome:"Golo corrido",emoji:"⚽"},
 {nome:"Golo de livre",emoji:"⚽"},
 {nome:"Golo acrobático",emoji:"⚽"},
 {nome:"Golo de cabeça",emoji:"⚽"},
 {nome:"Golo de pontapé de saída",emoji:"⚽"},
 {nome:"Golo sofrido",emoji:"🔴"},
 {nome:"Remate corrido fora",emoji:"❌"},
 {nome:"Remate corrido defesa",emoji:"🧤"},
 {nome:"Remate de livre fora",emoji:"❌"},
 {nome:"Remate de livre defesa",emoji:"🧤"},
 {nome:"Remate acrobático fora",emoji:"❌"},
 {nome:"Remate acrobático defesa",emoji:"🧤"},
 {nome:"Remate de cabeça fora",emoji:"❌"},
 {nome:"Remate de cabeça defesa",emoji:"🧤"},
 {nome:"Defesa",emoji:"🧤"},
 {nome:"Assistência",emoji:"🎁"},
 {nome:"Passe falhado",emoji:"⚠️"},
 {nome:"Recuperação de bola",emoji:"🔙"},
 {nome:"Perda de bola",emoji:"⛔️"},
 {nome:"Expulsão",emoji:"🟥"}
]


/* =====================================
FUNÇÕES AUXILIARES
===================================== */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* =====================================
NAVEGAÇÃO PRINCIPAL
===================================== */

/* função movida para módulo */


window.abrirMenu=abrirMenu;


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* =====================================
JOGO: MARCADOR E EQUIPAS
===================================== */

/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */



/* =====================================
JOGO: ARENA E REGISTO DE AÇÕES
===================================== */

/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */


/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */



/* =====================================
JOGO: JOGADOR ATIVO
===================================== */

/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */



/* =====================================
DEFINIÇÕES DO JOGO
===================================== */

/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */



/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */



let startersTemp=[];


/* =====================================
JOGO: TITULARES
===================================== */

/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */




/* =====================================
JOGO: SUBSTITUIÇÕES
===================================== */

/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */




/* função movida para módulo */



/* =====================================
JOGO: CRONÓMETRO
===================================== */

/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */




/* =====================================
ESTATÍSTICAS E RELATÓRIOS DO JOGO
===================================== */

/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */





/* função movida para módulo */





/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */


function calcularMinutosJogadores(){
 let periodos=periodoOrdem();
 let resultado={};
 jogadores.forEach(j=>{
  resultado[j]={total:0};
  periodos.forEach(p=>resultado[j][p]=0);
 });

 if(!jogoMinutosAtivo){
  return resultado;
 }

 let periodoAtual=$("periodo")?$("periodo").value:"1.º período";
 let emCampo=titularesIniciais().filter(j=>jogadores.includes(j));
 let timeline={};
 periodos.forEach(p=>timeline[p]=[]);

 subs.slice().reverse().forEach(s=>{
  let p=s.periodo||"1.º período";
  if(!timeline[p])timeline[p]=[];
  timeline[p].push({
   sai:s.sai,
   entra:s.entra,
   tempo:s.tempo,
   segundo:minutoJogadoNoPeriodo(s.tempo||"00:00")
  });
 });

 periodos.forEach(p=>{
  let ultimo=0;
  let eventos=(timeline[p]||[]).sort((a,b)=>a.segundo-b.segundo);

  let limitePeriodo;
  if(periodos.indexOf(p)<periodos.indexOf(periodoAtual)){
   limitePeriodo=dur*60;
  }else if(p===periodoAtual){
   limitePeriodo=minutoJogadoNoPeriodo(t());
  }else{
   limitePeriodo=0;
  }

  limitePeriodo=Math.max(0,Math.min(dur*60,limitePeriodo));

  eventos.forEach(ev=>{
   if(ev.segundo>limitePeriodo)return;

   let delta=Math.max(0,ev.segundo-ultimo);
   emCampo.forEach(j=>{
    if(resultado[j])resultado[j][p]+=delta;
   });

   emCampo=emCampo.filter(j=>j!==ev.sai);
   if(ev.entra && !emCampo.includes(ev.entra))emCampo.push(ev.entra);

   ultimo=ev.segundo;
  });

  let deltaFinal=Math.max(0,limitePeriodo-ultimo);
  emCampo.forEach(j=>{
   if(resultado[j])resultado[j][p]+=deltaFinal;
  });
 });

 Object.keys(resultado).forEach(j=>{
  resultado[j].total=periodos.reduce((acc,p)=>acc+(resultado[j][p]||0),0);
 });

 return resultado;
}


/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



function openIndividualDashboardModal(){
 let m=$("individualDashModal");
 let box=$("individualDashPlayers");
 if(!m||!box)return;
 box.innerHTML=jogadores.map(j=>`<button class="pbtn" onclick="exportDashboardIndividual('${esc(j)}')">${j}</button>`).join("");
 m.classList.add("show");
}

function closeIndividualDashboardModal(){
 let m=$("individualDashModal");
 if(m)m.classList.remove("show");
}


/* função movida para módulo */


function exportDashboardIndividual(jogadora){
 closeIndividualDashboardModal();

 let casa=($("casa")?$("casa").value:"AD Pastéis")||"AD Pastéis";
 let fora=($("fora")?$("fora").value:"Adversário")||"Adversário";
 let minutos=calcularMinutosJogadores()[jogadora]||{};
 let eventosJog=reg.filter(r=>r.jogador===jogadora);
 let periodos=["1.º período","2.º período","3.º período"];

 let canvas=document.createElement("canvas");
 canvas.width=1080;
 canvas.height=1920;
 let ctx=canvas.getContext("2d");

 const W=1080,H=1920;
 const red="#D71920", white="#FFFFFF", gold="#FFD21A", blue="#1E7CFF", green="#18A64A", sand="#D8BD7E";

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

 function center(t,x,y,s,c,w){tx(t,x,y,s,c,w,"center");}
 function right(t,x,y,s,c,w){tx(t,x,y,s,c,w,"right");}

 function bg(){
  let g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,"#06152B");
  g.addColorStop(1,"#020A18");
  ctx.fillStyle=g;
  ctx.fillRect(0,0,W,H);
  ctx.fillStyle="rgba(215,25,32,.12)";
  ctx.beginPath();
  ctx.arc(160,120,340,0,Math.PI*2);
  ctx.fill();
  ctx.fillStyle="rgba(30,124,255,.08)";
  ctx.beginPath();
  ctx.arc(980,1800,420,0,Math.PI*2);
  ctx.fill();
 }

 function stat(x,y,w,h,label,value){
  rr(x,y,w,h,14,"rgba(255,255,255,.045)","rgba(255,255,255,.28)",1);
  center(label,x+w/2,y+14,15,white,900);
  center(value,x+w/2,y+46,34,white,900);
 }

 function dotColor(a){
  if(String(a).startsWith("Golo"))return red;
  if(String(a).startsWith("Remate"))return gold;
  if(a==="Recuperação de bola")return blue;
  if(a==="Perda de bola"||a==="Passe falhado")return "#BFC7D5";
  if(a==="Passe certo")return green;
  return white;
 }

 function drawPitchLines(px,py,pw,ph,vertical){
  ctx.strokeStyle="rgba(255,255,255,.82)";
  ctx.lineWidth=1.4;
  ctx.strokeRect(px+8,py+8,pw-16,ph-16);
  if(vertical){
   ctx.beginPath();
   ctx.moveTo(px+8,py+ph/2);
   ctx.lineTo(px+pw-8,py+ph/2);
   ctx.stroke();

   ctx.beginPath();
   ctx.arc(px+pw/2,py+ph/2,Math.min(pw,ph)*.13,0,Math.PI*2);
   ctx.stroke();

   ctx.strokeRect(px+pw*.38,py+8,pw*.24,ph*.10);
   ctx.strokeRect(px+pw*.38,py+ph-ph*.10-8,pw*.24,ph*.10);
  }else{
   ctx.beginPath();
   ctx.moveTo(px+pw/2,py+8);
   ctx.lineTo(px+pw/2,py+ph-8);
   ctx.stroke();

   ctx.beginPath();
   ctx.arc(px+pw/2,py+ph/2,Math.min(pw,ph)*.13,0,Math.PI*2);
   ctx.stroke();

   ctx.strokeRect(px+2,py+ph/2-18,12,36);
   ctx.strokeRect(px+pw-14,py+ph/2-18,12,36);
  }
 }

 function pitch(x,y,w,h,title,events){
  rr(x,y,w,h,12,"rgba(255,255,255,.04)","rgba(255,255,255,.30)",1);
  rr(x,y,w,34,8,red,null,0);
  center(title,x+w/2,y+8,14,white,900);

  let px=x+10,py=y+44,pw=w-20,ph=h-56;
  rr(px,py,pw,ph,0,sand,"rgba(255,255,255,.70)",1);
  drawPitchLines(px,py,pw,ph,false);

  events.forEach(r=>{
   let rawX=Number(r.x||50);
   let plotX=(r.attackSide==="left")?(100-rawX):rawX;
   let plotY=Number(r.y||50);
   let cx=px+(plotX/100)*pw;
   let cy=py+(plotY/100)*ph;
   ctx.fillStyle=dotColor(r.acao);
   ctx.beginPath();
   ctx.arc(cx,cy,6,0,Math.PI*2);
   ctx.fill();
  });
 }

 function heatCol(i){
  i=Math.max(0,Math.min(1,i));
  if(i<.18)return `rgba(18,55,140,${0.30+i})`;
  if(i<.38)return `rgba(25,180,85,${0.35+i})`;
  if(i<.62)return `rgba(210,225,35,${0.38+i})`;
  if(i<.82)return `rgba(255,140,20,${0.42+i})`;
  return `rgba(229,28,43,${0.48+i})`;
 }

 function heat(x,y,w,h,title,events){
  rr(x,y,w,h,12,"rgba(255,255,255,.04)","rgba(255,255,255,.30)",1);
  rr(x,y,w,32,8,red,null,0);
  center(title,x+w/2,y+8,13,white,900);

  let px=x+10,py=y+42,pw=w-20,ph=h-54;
  rr(px,py,pw,ph,0,"#071326","rgba(255,255,255,.70)",1);

  if(events.length){
   let cells=[];
   for(let gx=0;gx<6;gx++){
    for(let gy=0;gy<8;gy++){
     let cx=(gx+.5)*16.666;
     let cy=(gy+.5)*12.5;
     let val=0;
     events.forEach(r=>{
      let dx=(Number(r.x)-cx)/17;
      let dy=(Number(r.y)-cy)/17;
      val+=Math.exp(-(dx*dx+dy*dy));
     });
     cells.push({x:cx,y:cy,v:val});
    }
   }

   let max=Math.max(...cells.map(c=>c.v),1);
   cells.forEach(c=>{
    let inten=c.v/max;
    if(inten>.08){
     let cx=px+(c.x/100)*pw;
     let cy=py+(c.y/100)*ph;
     let rad=16+(inten*36);
     let g=ctx.createRadialGradient(cx,cy,2,cx,cy,rad);
     g.addColorStop(0,heatCol(inten));
     g.addColorStop(1,"rgba(0,0,0,0)");
     ctx.fillStyle=g;
     ctx.beginPath();
     ctx.arc(cx,cy,rad,0,Math.PI*2);
     ctx.fill();
    }
   });
  }

  drawPitchLines(px,py,pw,ph,true);
 }

 function bar(x,y,w,h,label,value,max,color){
  tx(label,x,y,16,white,800);
  rr(x,y+24,w,h,999,"rgba(255,255,255,.08)",null,0);
  rr(x,y+24,w*Math.min(1,(value/(max||1))),h,999,color,null,0);
  right(value,x+w,y+16,18,white,900);
 }

 bg();

 center("AD PASTÉIS",W/2,52,42,white,950);
 center("DASHBOARD INDIVIDUAL",W/2,102,22,red,950);
 center(`${casa} ${casaGoals}-${foraGoals} ${fora}`,W/2,136,18,gold,900);
 center(jogadora,W/2,172,34,white,950);

 let golos=eventosJog.filter(r=>String(r.acao||"").startsWith("Golo")).length;
 let remates=eventosJog.filter(r=>String(r.acao||"").startsWith("Remate")).length;
 let rematesFora=eventosJog.filter(r=>String(r.acao||"").startsWith("Remate")&&String(r.acao||"").includes("fora")).length;
 let rematesDef=eventosJog.filter(r=>String(r.acao||"").startsWith("Remate")&&String(r.acao||"").includes("defesa")).length;
 let recuperacoes=eventosJog.filter(r=>r.acao==="Recuperação de bola").length;
 let perdas=eventosJog.filter(r=>r.acao==="Perda de bola"||r.acao==="Passe falhado").length;
 let passesFalhados=eventosJog.filter(r=>r.acao==="Passe falhado").length;
 let golosSofridos=eventosJog.filter(r=>r.acao==="Golo sofrido").length;
 let minTotal=minutosTexto(minutos.total||0);

 stat(50,235,210,90,"MINUTOS",minTotal);
 stat(285,235,130,90,"GOLOS",golos);
 stat(440,235,140,90,"REMATES",remates);
 stat(605,235,190,90,"RECUPERAÇÕES",recuperacoes);
 stat(820,235,210,90,"PERDAS",perdas);

 pitch(50,360,980,360,"MAPA DE AÇÕES",eventosJog);

 heat(50,760,310,360,"HEAT MAP 1.º P",eventosJog.filter(r=>r.periodo==="1.º período"));
 heat(385,760,310,360,"HEAT MAP 2.º P",eventosJog.filter(r=>r.periodo==="2.º período"));
 heat(720,760,310,360,"HEAT MAP 3.º P",eventosJog.filter(r=>r.periodo==="3.º período"));

 rr(50,1160,980,300,16,"rgba(255,255,255,.045)","rgba(255,255,255,.28)",1);
 tx("RESUMO POR PERÍODO",80,1185,20,red,950);

 let yy=1230;
 periodos.forEach(pp=>{
  let ev=eventosJog.filter(r=>r.periodo===pp);
  let mins=minutosTexto(minutos[pp]||0);
  tx(pp,80,yy,17,white,900);
  right(mins,295,yy,17,gold,900);
  bar(340,yy-4,620,16,"",ev.length,Math.max(1,eventosJog.length),red);
  right(ev.length+" ações",1000,yy-8,14,white,900);
  yy+=58;
 });

 rr(50,1495,980,300,16,"rgba(255,255,255,.045)","rgba(255,255,255,.28)",1);
 tx("DETALHE DE AÇÕES",80,1520,20,red,950);

 let vals=[
  ["Remates defendidos",rematesDef,gold],
  ["Remates fora",rematesFora,gold],
  ["Passe falhado",passesFalhados,"#BFC7D5"],
  ["Golo sofrido",golosSofridos,red]
 ];

 let mx=Math.max(1,...vals.map(v=>v[1]));
 vals.forEach((v,i)=>bar(80,1570+i*52,800,18,v[0],v[1],mx,v[2]));

 center("StatS · AD Pastéis Futebol de Praia",W/2,1845,18,"rgba(255,255,255,.65)",800);

 let a=document.createElement("a");
 a.download=`dashboard_individual_${jogadora.replaceAll(" ","_")}.png`;
 a.href=canvas.toDataURL("image/png");
 a.click();
}


/* função movida para módulo */


/* função movida para módulo */



/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* =====================================
EXPORTAÇÕES
===================================== */

/* função movida para módulo */






/* =====================================
ENTRADA NO JOGO
===================================== */

/* função movida para módulo */




/* =====================================
TREINO: ENTRADA
===================================== */

/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */






/* =====================================
TREINO: ESTADO E NAVEGAÇÃO
===================================== */
let tipoTreinoAtual=localStorage.getItem("tipo_treino_pasteis") || "Técnico";



/* =====================================
TREINO: ABAS
===================================== */

/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* =====================================
TREINO: DADOS GERAIS
===================================== */

/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */




/* =====================================
TREINO: DEPARTAMENTO MÉDICO
===================================== */

/* função movida para módulo */



/* =====================================
TREINO: GRUPO DE ATLETAS
===================================== */

/* função movida para módulo */




/* =====================================
TREINO: TREINADORES
===================================== */

/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* =====================================
TREINO: PRESENÇAS
===================================== */

/* função movida para módulo */



/* =====================================
TREINO: EXERCÍCIOS
===================================== */

/* função movida para módulo */



/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */




/* =====================================
TREINO: EXERCÍCIO COLETIVO
===================================== */

/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */




/* função movida para módulo */






/* função movida para módulo */



/* função movida para módulo */



/* =====================================
TREINO: EXERCÍCIO INDIVIDUAL
===================================== */

/* função movida para módulo */





/* =====================================
TREINO: EDIÇÃO DE REMATES
===================================== */

/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* =====================================
TREINO: EXPORTAÇÕES
===================================== */

/* função movida para módulo */



/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* =====================================
RENDERIZAÇÃO GERAL
===================================== */

/* =====================================
CONVOCATÓRIA
===================================== */

/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */




let minuteViewMode=localStorage.getItem("minute_view_mode_pasteis")||"periodo";
let liveMinutes=JSON.parse(localStorage.getItem("live_minutes_pasteis")||"{}");

/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */




/* função movida para módulo */


/* função movida para módulo */




/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */






function openIndividualDashboardModal(){
 let old=$('dashboardIndividualPage')||$('individualDashboardPage')||$('dashIndividualPage');
 if(old){old.classList.add('show');old.style.display='block';return;}
 let m=$('v50IndividualModal');
 if(!m){document.body.insertAdjacentHTML('beforeend',`<div id="v50IndividualModal" class="v50DashModal"><div class="v50DashBox"><button class="v50DashClose" onclick="openIndividualDashboardModal()">×</button><h2>Dashboard Individual</h2><div id="v50IndividualContent"></div></div></div>`);m=$('v50IndividualModal');}
 let jogador=active||jogadores[0]||'Jogadora';let dados=reg.filter(r=>r.jogador===jogador);
 let rem=dados.filter(r=>String(r.acao||'').startsWith('Remate')).length;
 let gol=dados.filter(r=>String(r.acao||'').startsWith('Golo')).length;
 let rec=dados.filter(r=>r.acao==='Recuperação de bola').length;
 let perd=dados.filter(r=>r.acao==='Perda de bola'||r.acao==='Passe falhado').length;
 let faltas=dados.filter(r=>r.acao==='Falta').length;
 $('v50IndividualContent').innerHTML=`<div class="v50DashPlayer">${jogador}</div><div class="v50DashGrid"><div><span>Remates</span><b>${rem}</b></div><div><span>Golos</span><b>${gol}</b></div><div><span>Recuperações</span><b>${rec}</b></div><div><span>Perdas</span><b>${perd}</b></div><div><span>Faltas</span><b>${faltas}</b></div></div>`;
 m.classList.add('show');
}

/* função movida para módulo */






/* função movida para módulo */


/* função movida para módulo */


/* função movida para módulo */



/* função movida para módulo */


/* função movida para módulo */


bindEntradaInicial();

try{
 loadGame();
 updateTimer();
 renderAll();
 aplicarEntradaInicial();
}catch(err){
 console.error("Erro ao iniciar aplicação:",err);
 bindEntradaInicial();
}


/* =========================================================
PATCH FINAL — apenas Dashboard Individual
Mantém todo o resto igual. Ao clicar em Dashboard Individual:
1) abre pop-up para escolher jogadora;
2) ao escolher, descarrega o Dashboard Individual em PNG.
========================================================= */
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


/* PATCH FINAL 2 — corrige só o PNG do Dashboard Individual */
function exportDashboardIndividual(jogadora){
 closeIndividualDashboardModal();
 const casa=($("casa")?$("casa").value:"AD Pastéis")||"AD Pastéis";
 const fora=($("fora")?$("fora").value:"Adversário")||"Adversário";
 const min=calcularMinutosJogadores()[jogadora]||{};
 const ev=reg.filter(r=>r.jogador===jogadora);
 const canvas=document.createElement("canvas"); canvas.width=1080; canvas.height=1920;
 const ctx=canvas.getContext("2d");
 const W=1080,H=1920,red="#D71920",white="#fff",gold="#FFD21A",blue="#1E7CFF",green="#18A64A",sand="#D8BD7E";

 function rr(x,y,w,h,r,f,s,l){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();if(f){ctx.fillStyle=f;ctx.fill()}if(s){ctx.strokeStyle=s;ctx.lineWidth=l||2;ctx.stroke()}}
 function t(v,x,y,s,c,w,a){ctx.fillStyle=c||white;ctx.font=(w||700)+" "+s+"px Arial";ctx.textAlign=a||"left";ctx.textBaseline="top";ctx.fillText(String(v),x,y)}
 function c(v,x,y,s,col,w){t(v,x,y,s,col,w,"center")} function r(v,x,y,s,col,w){t(v,x,y,s,col,w,"right")}
 function bg(){let g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#06152B");g.addColorStop(1,"#020A18");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.fillStyle="rgba(215,25,32,.10)";ctx.beginPath();ctx.arc(120,120,310,0,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(30,124,255,.08)";ctx.beginPath();ctx.arc(980,1760,360,0,Math.PI*2);ctx.fill()}
 function stat(x,y,w,h,label,val){rr(x,y,w,h,14,"rgba(255,255,255,.045)","rgba(255,255,255,.28)",1);c(label,x+w/2,y+14,15,white,900);c(val,x+w/2,y+46,34,white,900)}
 function color(a){if(String(a).startsWith("Golo"))return red;if(String(a).startsWith("Remate"))return gold;if(a==="Recuperação de bola")return blue;if(a==="Perda de bola"||a==="Passe falhado")return "#BFC7D5";if(a==="Passe certo")return green;return white}
 function lines(px,py,pw,ph,vert){ctx.strokeStyle="rgba(255,255,255,.82)";ctx.lineWidth=1.4;ctx.strokeRect(px+8,py+8,pw-16,ph-16);if(vert){ctx.beginPath();ctx.moveTo(px+8,py+ph/2);ctx.lineTo(px+pw-8,py+ph/2);ctx.stroke();ctx.beginPath();ctx.arc(px+pw/2,py+ph/2,Math.min(pw,ph)*.13,0,Math.PI*2);ctx.stroke();ctx.strokeRect(px+pw*.38,py+8,pw*.24,ph*.10);ctx.strokeRect(px+pw*.38,py+ph-ph*.10-8,pw*.24,ph*.10)}else{ctx.beginPath();ctx.moveTo(px+pw/2,py+8);ctx.lineTo(px+pw/2,py+ph-8);ctx.stroke();ctx.beginPath();ctx.arc(px+pw/2,py+ph/2,Math.min(pw,ph)*.13,0,Math.PI*2);ctx.stroke();ctx.strokeRect(px+2,py+ph/2-18,12,36);ctx.strokeRect(px+pw-14,py+ph/2-18,12,36)}}
 function pitch(x,y,w,h,title,arr){rr(x,y,w,h,12,"rgba(255,255,255,.04)","rgba(255,255,255,.30)",1);rr(x,y,w,34,8,red,null,0);c(title,x+w/2,y+8,14,white,900);let px=x+10,py=y+44,pw=w-20,ph=h-56;rr(px,py,pw,ph,0,sand,"rgba(255,255,255,.70)",1);lines(px,py,pw,ph,false);arr.forEach(o=>{let raw=Number(o.x||50),xx=(o.attackSide==="left")?(100-raw):raw,yy=Number(o.y||50);ctx.fillStyle=color(o.acao);ctx.beginPath();ctx.arc(px+(xx/100)*pw,py+(yy/100)*ph,6,0,Math.PI*2);ctx.fill()})}
 function heatCol(i){i=Math.max(0,Math.min(1,i));if(i<.18)return `rgba(18,55,140,${.30+i})`;if(i<.38)return `rgba(25,180,85,${.35+i})`;if(i<.62)return `rgba(210,225,35,${.38+i})`;if(i<.82)return `rgba(255,140,20,${.42+i})`;return `rgba(229,28,43,${.48+i})`}
 function heat(x,y,w,h,title,arr){rr(x,y,w,h,12,"rgba(255,255,255,.04)","rgba(255,255,255,.30)",1);rr(x,y,w,32,8,red,null,0);c(title,x+w/2,y+8,13,white,900);let px=x+10,py=y+42,pw=w-20,ph=h-54;rr(px,py,pw,ph,0,"#071326","rgba(255,255,255,.70)",1);if(arr.length){let cells=[];for(let gx=0;gx<6;gx++)for(let gy=0;gy<8;gy++){let cx=(gx+.5)*16.666,cy=(gy+.5)*12.5,val=0;arr.forEach(o=>{let dx=(Number(o.x)-cx)/17,dy=(Number(o.y)-cy)/17;val+=Math.exp(-(dx*dx+dy*dy))});cells.push({x:cx,y:cy,v:val})}let mx=Math.max(...cells.map(q=>q.v),1);cells.forEach(q=>{let i=q.v/mx;if(i>.08){let cx=px+(q.x/100)*pw,cy=py+(q.y/100)*ph,rad=16+i*36,g=ctx.createRadialGradient(cx,cy,2,cx,cy,rad);g.addColorStop(0,heatCol(i));g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.fill()}})}lines(px,py,pw,ph,true)}
 function bar(x,y,w,h,label,val,mx,col){t(label,x,y,16,white,800);rr(x,y+24,w,h,999,"rgba(255,255,255,.08)",null,0);rr(x,y+24,w*Math.min(1,val/(mx||1)),h,999,col,null,0);r(val,x+w,y+16,18,white,900)}

 bg();
 c("AD PASTÉIS",W/2,52,42,white,950); c("DASHBOARD INDIVIDUAL",W/2,102,22,red,950); c(`${casa} ${casaGoals}-${foraGoals} ${fora}`,W/2,136,18,gold,900); c(jogadora,W/2,172,34,white,950);
 const golos=ev.filter(o=>String(o.acao||"").startsWith("Golo")).length, rem=ev.filter(o=>String(o.acao||"").startsWith("Remate")).length, remFora=ev.filter(o=>String(o.acao||"").startsWith("Remate")&&String(o.acao||"").includes("fora")).length, remDef=ev.filter(o=>String(o.acao||"").startsWith("Remate")&&String(o.acao||"").includes("defesa")).length, rec=ev.filter(o=>o.acao==="Recuperação de bola").length, perd=ev.filter(o=>o.acao==="Perda de bola"||o.acao==="Passe falhado").length, passFal=ev.filter(o=>o.acao==="Passe falhado").length, golSof=ev.filter(o=>o.acao==="Golo sofrido").length;
 stat(50,235,210,90,"MINUTOS",minutosTexto(min.total||0)); stat(285,235,130,90,"GOLOS",golos); stat(440,235,140,90,"REMATES",rem); stat(605,235,190,90,"RECUPERAÇÕES",rec); stat(820,235,210,90,"PERDAS",perd);
 pitch(50,360,980,360,"MAPA DE AÇÕES",ev);
 heat(50,760,310,360,"HEAT MAP 1.º P",ev.filter(o=>o.periodo==="1.º período")); heat(385,760,310,360,"HEAT MAP 2.º P",ev.filter(o=>o.periodo==="2.º período")); heat(720,760,310,360,"HEAT MAP 3.º P",ev.filter(o=>o.periodo==="3.º período"));
 rr(50,1160,980,300,16,"rgba(255,255,255,.045)","rgba(255,255,255,.28)",1); t("RESUMO POR PERÍODO",80,1185,20,red,950);
 let yy=1230, ps=["1.º período","2.º período","3.º período"]; ps.forEach(p=>{let a=ev.filter(o=>o.periodo===p), mins=minutosTexto(min[p]||0);t(p,80,yy,17,white,900);r(mins,295,yy,17,gold,900);bar(340,yy-4,620,16,"",a.length,Math.max(1,ev.length),red);r(a.length+" ações",1000,yy-8,14,white,900);yy+=58});
 rr(50,1495,980,300,16,"rgba(255,255,255,.045)","rgba(255,255,255,.28)",1); t("DETALHE DE AÇÕES",80,1520,20,red,950);
 let vals=[["Remates defendidos",remDef,gold],["Remates fora",remFora,gold],["Passe falhado",passFal,"#BFC7D5"],["Golo sofrido",golSof,red]], mx=Math.max(1,...vals.map(v=>v[1])); vals.forEach((v,i)=>bar(80,1570+i*52,800,18,v[0],v[1],mx,v[2]));
 c("StatS · AD Pastéis Futebol de Praia",W/2,1845,18,"rgba(255,255,255,.65)",800);
 let a=document.createElement("a"); a.download=`dashboard_individual_${jogadora.replaceAll(" ","_")}.png`; a.href=canvas.toDataURL("image/png"); a.click();
}


/* =========================================================
PATCH FINAL 3 — Dashboard Individual igual ao estilo do coletivo
Escolher jogadora -> descarrega PNG com arenas por período.
Sem heat maps.
========================================================= */

/* função movida para módulo */



/* função movida para módulo */



/* função movida para módulo */



/* PATCH FINAL 4 — minutos do Dashboard a partir da lista "Em campo agora" */
const calcularMinutosJogadores_original_Stats = typeof calcularMinutosJogadores === "function" ? calcularMinutosJogadores : null;


/* função movida para módulo */


