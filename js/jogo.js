/* StatS — jogo.js
   Módulo separado automaticamente a partir do ficheiro original.
   Carregado antes de app.js.
*/

function goal(team,v){
 if(team==="c"){
  casaGoals=Math.max(0,casaGoals+v);
  localStorage.setItem("golos_casa_pasteis",casaGoals);
  $("gc").innerText=casaGoals;
 }else{
  foraGoals=Math.max(0,foraGoals+v);
  localStorage.setItem("golos_fora_pasteis",foraGoals);
  $("gf").innerText=foraGoals;
 }
}

function goals(j){return count(r=>r.jogador===j&&r.acao&&r.acao.startsWith("Golo"))}

function abrirPopupTiposGolo(){
 let title=$("quickTitle");
 let content=$("quickContent");

 title.innerHTML="Tipo de golo";

 const golos=[
  {nome:"Golo corrido",emoji:"⚽"},
  {nome:"Golo de livre",emoji:"⚽"},
  {nome:"Golo acrobático",emoji:"⚽"},
  {nome:"Golo de cabeça",emoji:"⚽"},
  {nome:"Golo de pontapé de saída",emoji:"⚽"},
  {nome:"Golo sofrido",emoji:"🔴"}
 ];

 content.innerHTML=`
  <button class="quickFlowBack" onclick="abrirPopupAcoes()">← Voltar</button>
  <div class="quickFlowGrid">
   ${golos.map(g=>`<button class="actionBtn dark" onclick="chooseGoloFinal('${esc(g.nome)}','${esc(g.emoji)}')">${actionIconHTML(g.nome,g.emoji)}</button>`).join("")}
  </div>
 `;
}

function chooseGoloFinal(nome,emoji){
 flow.acao=nome;
 flow.emoji=emoji;
 confirmarAcaoRapida({pedirAssistencia:true});
}

function confirmStarters(){
 if(startersTemp.length!==inField){
  alert("Tens de escolher exatamente "+inField+" jogadores.");
  return;
 }

 campo=[...startersTemp];
 banco=jogadores.filter(j=>!campo.includes(j));

 saveAll();
 guardarTitularesIniciais();
 closeStarters();
 renderAll();

 alert("Titulares guardados. Não foi registada substituição.");
}

function subInfo(){
 let el=$("subInfo");
 if(!el)return;

 let sai=subsOutTemp.length?subsOutTemp.join(", "):"—";
 let entra=subsInTemp.length?subsInTemp.join(", "):"—";

 el.innerHTML=`<div class="subsBulkInfo">
  <b>Saem:</b> ${sai}<br>
  <b>Entram:</b> ${entra}<br>
  <span class="small">Seleciona o mesmo número de atletas dos dois lados.</span>
 </div>`;
}

function confirmSub(){
 if(!subsOutTemp.length || !subsInTemp.length){
  alert("Seleciona quem sai e quem entra.");
  return;
 }

 if(subsOutTemp.length!==subsInTemp.length){
  alert("Tens de selecionar o mesmo número de atletas a sair e a entrar.");
  return;
 }

 let periodoAtual=$("periodo").value;
 let tempoAtual=t();
 let dataAtual=new Date().toLocaleString("pt-PT");

 subsOutTemp.forEach((sai,i)=>{
  let entra=subsInTemp[i];

  campo=campo.filter(j=>j!==sai);
  banco=banco.filter(j=>j!==entra);

  if(!campo.includes(entra))campo.push(entra);
  if(!banco.includes(sai))banco.push(sai);

  subs.unshift({
   sai:sai,
   entra:entra,
   periodo:periodoAtual,
   tempo:tempoAtual,
   data:dataAtual
  });
 });

 subsOutTemp=[];
 subsInTemp=[];
 outTemp=null;
 inTemp=null;

 saveAll();
 closeSubs();
 renderAll();
}

function start(){
 if(timer)return;

 timer=setInterval(()=>{
  if(time>0){
   time--;
   addLiveSecond();
   updateTimer();
   renderLivePlayersPanel();
  }else{
   pause();
   alert("⚠️ Mudar período e direção do jogo");
  }
 },1000);
}

function pause(){clearInterval(timer);timer=null}

function updateTimer(){
 if($("tempo"))$("tempo").innerText=t();

 if(time<=0 && timer){
  pause();
  alert("⚠️ Mudar período e direção do jogo");
 }
}

function periodoOrdem(){
 return ["1.º período","2.º período","3.º período","Prolongamento","Penáltis"];
}

function periodoNormalizado(txt){
 txt=String(txt||"").toLowerCase().trim();
 if(txt.includes("1"))return "1.º período";
 if(txt.includes("2"))return "2.º período";
 if(txt.includes("3"))return "3.º período";
 if(txt.includes("prol"))return "Prolongamento";
 if(txt.includes("pen"))return "Penáltis";
 return "";
}

function calcularResumoJogo(){
 let totalGolos=reg.filter(r=>r.acao&&r.acao.startsWith("Golo")&&r.acao!=="Golo sofrido").length;
 let totalGolosSofridos=reg.filter(r=>r.acao==="Golo sofrido").length;
 let totalRemates=reg.filter(r=>r.acao&&r.acao.startsWith("Remate")).length;
 let totalAssist=reg.filter(r=>r.acao==="Assistência").length;
 let totalDefesas=reg.filter(r=>defesaDashboard(r)).length;
 let totalPassesFalhados=reg.filter(r=>r.acao==="Passe falhado").length;
 let totalRecuperacoes=reg.filter(r=>r.acao==="Recuperação de bola").length;
 let totalPerdas=reg.filter(r=>r.acao==="Perda de bola").length;
 let totalExpulsoes=reg.filter(r=>r.acao==="Expulsão").length;
 let eficacia=totalRemates?Math.round((totalGolos/totalRemates)*100):0;

 let porJogador={};
 reg.forEach(r=>{
  if(!porJogador[r.jogador])porJogador[r.jogador]={golos:0,remates:0,assist:0,defesas:0,passesFalhados:0,recuperacoes:0,perdas:0,expulsoes:0,total:0};
  porJogador[r.jogador].total++;
  if(r.acao&&r.acao.startsWith("Golo")&&r.acao!=="Golo sofrido")porJogador[r.jogador].golos++;
  if(r.acao&&r.acao.startsWith("Remate"))porJogador[r.jogador].remates++;
  if(r.acao==="Assistência")porJogador[r.jogador].assist++;
  if(defesaDashboard(r))porJogador[r.jogador].defesas++;
  if(r.acao==="Passe falhado")porJogador[r.jogador].passesFalhados++;
  if(r.acao==="Recuperação de bola")porJogador[r.jogador].recuperacoes++;
  if(r.acao==="Perda de bola")porJogador[r.jogador].perdas++;
  if(r.acao==="Expulsão")porJogador[r.jogador].expulsoes++;
 });

 let mvp="-";
 let best=-1;
 Object.entries(porJogador).forEach(([j,s])=>{
  let score=s.golos*4+s.assist*3+s.defesas*2+s.recuperacoes*1.5+s.remates+s.total*.1-s.passesFalhados-s.perdas-s.expulsoes*3;
  if(score>best){best=score;mvp=j;}
 });

 return {totalGolos,totalGolosSofridos,totalRemates,totalAssist,totalDefesas,totalPassesFalhados,totalRecuperacoes,totalPerdas,totalExpulsoes,eficacia,mvp,porJogador};
}

function importarSubstituicoesTexto(){
 let txt=($("subsImportText")?.value||"").trim();
 if(!txt){
  alert("Cola primeiro o texto das substituições.");
  return;
 }

 let linhas=txt.split(/\n+/).map(l=>l.trim()).filter(Boolean);
 let periodoAtual="1.º período";
 let novas=[];

 linhas.forEach(l=>{
  let p=periodoNormalizado(l);
  if(p && !l.includes(">") && !l.includes("→") && !l.includes("->")){
   periodoAtual=p;
   return;
  }

  let m=l.match(/(\d{1,2}:\d{2})\s+(.+?)\s*(?:>|->|→|entra|por)\s*(.+)$/i);
  if(!m)return;

  novas.push({
   sai:m[2].trim(),
   entra:m[3].trim(),
   periodo:periodoAtual,
   tempo:m[1],
   data:"Importado"
  });
 });

 if(!novas.length){
  alert("Não consegui encontrar substituições. Usa o formato: 03:12 Jamila > Crespo");
  return;
 }

 if(!confirm("Importar "+novas.length+" substituições? As substituições atuais serão mantidas."))return;

 subs=[...novas.reverse(),...subs];
 localStorage.setItem("subs_pasteis",JSON.stringify(subs));
 closeImportSubsModal();
 renderAll();
 alert("Substituições importadas e minutos recalculados.");
}

function entrarJogo(){
 garantirTitularesIniciais();
 localStorage.setItem("modo_pasteis","jogo");

 if($("landingPage"))$("landingPage").classList.add("hidden");
 if($("menuPage"))$("menuPage").classList.add("hidden");
 if($("trainingPage"))$("trainingPage").classList.add("hidden");
 if($("settingsPage"))$("settingsPage").classList.add("hidden");
 if($("convocatoriaPage"))$("convocatoriaPage").classList.add("hidden");
 if($("main"))$("main").classList.remove("hidden");

 aplicarModoVisual();
}