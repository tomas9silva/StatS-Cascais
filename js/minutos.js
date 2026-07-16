/* StatS — minutos.js
   Módulo separado automaticamente a partir do ficheiro original.
   Carregado antes de app.js.
*/

function minutoJogadoNoPeriodo(tempoRestante){
 let jogado=(dur*60)-segundosDoTempo(tempoRestante);
 return Math.max(0,jogado);
}

function minutosTexto(seg){
 let m=Math.floor(seg/60);
 let s=seg%60;
 return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
}

function tabelaMinutosHTML(){
 let mins=calcularMinutosJogadores();
 let periodos=periodoOrdem();

 let html='<div class="dashboardBox"><h3>⏱️ Minutos jogados</h3>';
 html+='<div class="small">Contagem baseada nas titulares e nas substituições registadas.</div>';
 html+='<div style="overflow:auto"><table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:8px">';
 html+='<tr><th style="text-align:left">Atleta</th>'+periodos.map(p=>`<th>${p}</th>`).join("")+'<th>Total</th></tr>';

 Object.entries(mins).forEach(([j,m])=>{
  html+=`<tr><td>${j}</td>${periodos.map(p=>`<td style="text-align:center">${minutosTexto(m[p]||0)}</td>`).join("")}<td style="text-align:center"><b>${minutosTexto(m.total||0)}</b></td></tr>`;
 });

 html+='</table></div></div>';
 return html;
}

function proMinutesOf(nome){
 try{
  let m=calcularMinutosJogadores()[nome];
  return m?minutosTexto(m.total||0):"00:00";
 }catch(e){
  return "00:00";
 }
}

function ensureLiveMinutes(){
 const ps=periodoOrdem();
 jogadores.forEach(j=>{
  if(!liveMinutes[j])liveMinutes[j]={total:0};
  ps.forEach(p=>{if(liveMinutes[j][p]===undefined)liveMinutes[j][p]=0;});
 });
}

function addLiveSecond(){
 ensureLiveMinutes();
 let p=$("periodo") ? $("periodo").value : "1.º período";
 campo.forEach(j=>{
  if(!liveMinutes[j])liveMinutes[j]={total:0};
  if(liveMinutes[j][p]===undefined)liveMinutes[j][p]=0;
  liveMinutes[j][p]+=1;
  liveMinutes[j].total=(liveMinutes[j].total||0)+1;
 });
 localStorage.setItem("live_minutes_pasteis",JSON.stringify(liveMinutes));
}

function setMinuteViewMode(mode){
 minuteViewMode=mode;
 localStorage.setItem("minute_view_mode_pasteis",mode);
 renderLivePlayersPanel();
}

function getDisplayedMinute(j){
 ensureLiveMinutes();
 let p=$("periodo") ? $("periodo").value : "1.º período";
 let v=minuteViewMode==="total" ? (liveMinutes[j]?.total||0) : (liveMinutes[j]?.[p]||0);
 return minutosTexto(v||0);
}

function openMinutesModal(mode){
 minuteViewMode=mode;
 localStorage.setItem("minute_view_mode_pasteis",mode);
 ensureLiveMinutes();

 let title=$("minutesTitle");
 let content=$("minutesContent");
 if(!title||!content)return;

 let periodos=periodoOrdem();
 title.innerText=mode==="periodo" ? "Minutos por período" : "Minutos do jogo todo";

 if(mode==="total"){
  content.innerHTML='<div class="minutesTable">'+jogadores.map(j=>{
   let emCampo=campo.includes(j);
   return `<div class="minutesRow ${emCampo?"field":""}"><b>${j}</b><span>${minutosTexto(liveMinutes[j]?.total||0)}</span></div>`;
  }).join("")+'</div>';
 }else{
  content.innerHTML='<div class="minutesTable">'+jogadores.map(j=>{
   let emCampo=campo.includes(j);
   let cells=periodos.map(p=>`<small>${p.replace(" período","")}: <b>${minutosTexto(liveMinutes[j]?.[p]||0)}</b></small>`).join("");
   return `<div class="minutesRow period ${emCampo?"field":""}"><b>${j}</b><div>${cells}</div></div>`;
  }).join("")+'</div>';
 }

 $("minutesModal").classList.add("show");
 renderLivePlayersPanel();
}

function closeMinutesModal(){
 let m=$("minutesModal");
 if(m)m.classList.remove("show");
}

function toggleMinutePlayer(j){
 if(campo.includes(j)){
  campo=campo.filter(x=>x!==j);
  if(!banco.includes(j))banco.push(j);
 }else{
  banco=banco.filter(x=>x!==j);
  campo.push(j);
 }
 saveAll();
 renderLivePlayersPanel();
 renderProfessionalPanels();
}

function renderLivePlayersPanel(){
 let box=$("proLivePlayers");
 if(!box)return;
 ensureLiveMinutes();

 let todos=[...campo,...banco.filter(j=>!campo.includes(j))];

 if($("proLiveCount"))$("proLiveCount").innerText=campo.length+"/"+inField;

 box.innerHTML=todos.map(j=>{
  let emCampo=campo.includes(j);
  let tempo=getDisplayedMinute(j);
  return `<div class="proLiveRow ${emCampo?"field":"bench"}" onclick="toggleMinutePlayer('${esc(j)}')">
   <div class="proLiveIcon">${emCampo?"Ⅱ":"▶"}</div>
   <div class="proLiveName">${j}</div>
   <div class="proLiveTime">${tempo}</div>
  </div>`;
 }).join("");

 let bp=$("v4MinuteModePeriod"), bt=$("v4MinuteModeTotal");
 if(bp)bp.classList.toggle("active",minuteViewMode==="periodo");
 if(bt)bt.classList.toggle("active",minuteViewMode==="total");
}

function calcularMinutosJogadores(){
 let periodos = typeof periodoOrdem === "function" ? periodoOrdem() : ["1.º período","2.º período","3.º período","Prolongamento","Penáltis"];
 let resultado = {};

 if(typeof ensureLiveMinutes === "function") ensureLiveMinutes();

 jogadores.forEach(j=>{
  resultado[j]={total:0};
  periodos.forEach(p=>resultado[j][p]=0);

  if(typeof liveMinutes !== "undefined" && liveMinutes && liveMinutes[j]){
   periodos.forEach(p=>{
    resultado[j][p]=Number(liveMinutes[j][p]||0);
   });
   resultado[j].total=Number(liveMinutes[j].total||periodos.reduce((s,p)=>s+(resultado[j][p]||0),0));
  }
 });

 let soma = Object.values(resultado).reduce((acc,obj)=>acc+(obj.total||0),0);

 if(soma===0 && calcularMinutosJogadores_original_Stats){
  try{
   return calcularMinutosJogadores_original_Stats();
  }catch(e){}
 }

 return resultado;
}