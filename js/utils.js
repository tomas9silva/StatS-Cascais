/* StatS — utils.js
   Módulo separado automaticamente a partir do ficheiro original.
   Carregado antes de app.js.
*/

function tipoJogador(nome){
 return jogadorTipos[nome] || (isGuardaRedesDashboard(nome)?"gr":"jogadora");
}

function setTipoJogador(nome,tipo){
 jogadorTipos[nome]=tipo;
 localStorage.setItem("jogador_tipos_pasteis",JSON.stringify(jogadorTipos));
 renderAll();
 renderEditNames();
}

function numeroJogadora(nome){
 let n=String(nome||"").match(/\d+/);
 if(n)return n[0];
 let idx=jogadores.indexOf(nome);
 return idx>=0?String(idx+1):"";
}

function playerKitHTML(nome,extraClasse){
 let tipo=tipoJogador(nome);
 let nr=numeroJogadora(nome);
 let cls="playerKitCard "+(tipo==="gr"?"grKit ":"")+(extraClasse||"");
 let role=tipo==="gr"?"Guarda-redes":"Jogadora";
 return `<div class="${cls}">
  <span class="playerKitNumber">${nr}</span>
  <span class="playerKitName">${nome}</span>
  <span class="playerKitRole">${role}</span>
 </div>`;
}

function $(id){return document.getElementById(id)}

function t(){let m=Math.floor(time/60),s=time%60;return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")}

function count(f){return reg.filter(f).length}

function acaoObj(nome){return acoes.find(a=>a.nome===nome)||{nome,emoji:"✅"}}

function esc(str){return String(str).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/"/g,"&quot;")}

function choosePlayer(j){
 flow.jogador=j;
 active=j;
 flow.step="action";
 renderPlayerCard();
 abrirPopupAcoes();
}

function abrirPopupTiposRemate(){
 let title=$("quickTitle");
 let content=$("quickContent");

 title.innerHTML="Tipo de remate";

 const remates=[
  "Remate corrido",
  "Remate de livre",
  "Remate acrobático",
  "Remate de cabeça"
 ];

 content.innerHTML=`
  <button class="quickFlowBack" onclick="abrirPopupAcoes()">← Voltar</button>
  <div class="quickFlowGrid">
   ${remates.map(r=>`<button class="actionBtn dark" onclick="chooseTipoRemate('${esc(r)}')">${actionIconHTML(r,"✔️")}</button>`).join("")}
  </div>
 `;
}

function chooseTipoRemate(tipo){
 flow.tipoRemate=tipo;
 abrirPopupResultadoRemate();
}

function abrirPopupResultadoRemate(){
 let title=$("quickTitle");
 let content=$("quickContent");

 title.innerHTML=flow.tipoRemate;

 content.innerHTML=`
  <button class="quickFlowBack" onclick="abrirPopupTiposRemate()">← Voltar</button>
  <div class="quickFlowGrid">
   <button class="actionBtn dark" onclick="chooseResultadoRemate('fora')">❌ Fora</button>
   <button class="actionBtn dark" onclick="chooseResultadoRemate('defesa')">🧤 Defesa</button>
  </div>
 `;
}

function chooseResultadoRemate(resultado){
 const emoji=resultado==="fora"?"❌":"🧤";
 const sufixo=resultado==="fora"?"fora":"defesa";

 flow.acao=flow.tipoRemate+" "+sufixo;
 flow.emoji=emoji;
 confirmarAcaoRapida();
}

function abrirPopupJogadores(){
 let modal=$("quickModal");
 let title=$("quickTitle");
 let content=$("quickContent");

 title.innerHTML="Escolher jogador";

 content.innerHTML="<div class='players'>"+
  jogadores.map(j=>`<button class="pbtn" onclick="choosePlayer('${esc(j)}')">${j}</button>`).join("")+
 "</div>";

 modal.classList.add("show");
}

function abrirPopupAssistencia(){
 let modal=$("quickModal");
 let title=$("quickTitle");
 let content=$("quickContent");

 if(!pendingAssistGoal){
  $("quickModal").classList.remove("show");
  return;
 }

 title.innerHTML="Assistência do golo";

 let lista=jogadores.filter(j=>j!==pendingAssistGoal.marcador);

 content.innerHTML=`
  <div class="small">Quem fez a assistência?</div>
  <div class="players">
   ${lista.map(j=>`<button class="pbtn" onclick="chooseAssistencia('${esc(j)}')">${j}</button>`).join("")}
  </div>
  <button class="dark" onclick="skipAssistencia()">Sem assistência</button>
 `;

 modal.classList.add("show");
}

function chooseAssistencia(jogador){
 if(!pendingAssistGoal)return;

 reg.unshift({
  jogador:jogador,
  periodo:pendingAssistGoal.periodo,
  tempo:pendingAssistGoal.tempo,
  acao:"Assistência",
  emoji:"🎁",
  data:new Date().toLocaleString("pt-PT"),
  x:pendingAssistGoal.x,
  y:pendingAssistGoal.y,
  attackSide:pendingAssistGoal.attackSide,
  relacionadaCom:"Golo de "+pendingAssistGoal.marcador
 });

 localStorage.setItem("registos_pasteis",JSON.stringify(reg));

 pendingAssistGoal=null;
 flow={x:null,y:null,jogador:null,acao:null,step:"idle"};
 $("quickModal").classList.remove("show");
 renderAll();
}

function skipAssistencia(){
 pendingAssistGoal=null;
 flow={x:null,y:null,jogador:null,acao:null,step:"idle"};
 $("quickModal").classList.remove("show");
 renderAll();
}

function abrirPopupAcoes(){
 let title=$("quickTitle");
 let content=$("quickContent");

 title.innerHTML=flow.jogador;

 const principais=[
  {nome:"Golo",emoji:"⚽"},
  {nome:"Remate",emoji:"✔️"},
  {nome:"Defesa",emoji:"🧤"},
  {nome:"Assistência",emoji:"🎁"},
  {nome:"Passe falhado",emoji:"⚠️"},
  {nome:"Recuperação de bola",emoji:"🔙"},
  {nome:"Perda de bola",emoji:"⛔️"},
  {nome:"Expulsão",emoji:"🟥"}
 ];

 content.innerHTML="<div class='quickFlowGrid'>"+
  principais.map(a=>`<button class="actionBtn dark" onclick="chooseActionPrincipal('${esc(a.nome)}')">${actionIconHTML(a.nome,a.emoji)}</button>`).join("")+
 "</div>";
}

function confirmarAcaoRapida(opts){
 opts=opts||{};

 if(!flow.x || !flow.jogador || !flow.acao){
  alert("Falta local, jogador ou ação.");
  return;
 }

 let obj=acaoObj(flow.acao);

 let novoRegisto={
  jogador:flow.jogador,
  periodo:$("periodo").value,
  tempo:t(),
  acao:flow.acao,
  emoji:flow.emoji || obj.emoji,
  data:new Date().toLocaleString("pt-PT"),
  x:flow.x,
  y:flow.y,
  attackSide:attackSide,
  exercicioId:exercicioAtualId
 };

 reg.unshift(novoRegisto);
 localStorage.setItem("registos_pasteis",JSON.stringify(reg));

 let devePedirAssistencia=opts.pedirAssistencia && novoRegisto.acao && novoRegisto.acao.startsWith("Golo") && novoRegisto.acao!=="Golo sofrido";

 if(devePedirAssistencia){
  pendingAssistGoal={
   periodo:novoRegisto.periodo,
   tempo:novoRegisto.tempo,
   x:novoRegisto.x,
   y:novoRegisto.y,
   attackSide:novoRegisto.attackSide,
   marcador:novoRegisto.jogador
  };

  flow={x:null,y:null,jogador:null,acao:null,step:"assist"};
  abrirPopupAssistencia();
  renderAll();
  return;
 }

 flow={x:null,y:null,jogador:null,acao:null,step:"idle"};

 $("quickModal").classList.remove("show");

 renderAll();
}

function confirmMapFlow(){
 if(flow.step!=="confirm"||!flow.x||!flow.jogador||!flow.acao){alert("Seleciona local, jogador e ação.");return}
 let obj=acaoObj(flow.acao);
 reg.unshift({jogador:flow.jogador,periodo:$("periodo").value,tempo:t(),acao:flow.acao,emoji:obj.emoji,data:new Date().toLocaleString("pt-PT"),x:flow.x,y:flow.y,attackSide:attackSide});
 localStorage.setItem("registos_pasteis",JSON.stringify(reg));
 flow={x:null,y:null,jogador:null,acao:null,step:"idle"};
 renderAll();
}

function cancelMapFlow(){
 pendingAssistGoal=null;
 flow={x:null,y:null,jogador:null,acao:null,step:"idle"};

 let modal=$("quickModal");
 if(modal)modal.classList.remove("show");

 renderMap();
}

function deleteEvent(){
 if(selectedEventIndex===null)return;

 if(confirm("Apagar esta ação?")){
  reg.splice(selectedEventIndex,1);
  localStorage.setItem("registos_pasteis",JSON.stringify(reg));
  closeEvent();
  renderAll();
 }
}

function undo(){if(!reg.length){alert("Não há ações para desfazer.");return}reg.shift();localStorage.setItem("registos_pasteis",JSON.stringify(reg));renderAll()}

function adjust(a,v){let obj=acaoObj(a);if(v>0)reg.unshift({jogador:active,periodo:$("periodo").value,tempo:t(),acao:a,emoji:obj.emoji,data:"Correção manual",x:"",y:"",attackSide:attackSide});else{let i=reg.findIndex(r=>r.jogador===active&&r.acao===a);if(i>=0)reg.splice(i,1)}localStorage.setItem("registos_pasteis",JSON.stringify(reg));renderAll();openEditStats()}

function setActiveControl(tipo){
 document.querySelectorAll(".matchControls button").forEach(b=>b.classList.remove("controlActive"));
 let btn=$("ctrl_"+tipo);
 if(btn)btn.classList.add("controlActive");
}

function eventosComLocal(){
 return reg.filter(r=>r.x!==""&&r.x!==undefined&&r.y!==""&&r.y!==undefined);
}

function apagarAcaoPorIndice(idx){
 if(idx<0 || idx>=reg.length)return;
 let r=reg[idx];
 if(confirm("Eliminar esta ação?\\n\\n"+(r.emoji||acaoObj(r.acao).emoji)+" "+r.acao+" - "+r.jogador)){
  reg.splice(idx,1);
  localStorage.setItem("registos_pasteis",JSON.stringify(reg));
  renderAll();
 }
}

function percentagem(parte,total){
 if(!total || total<=0)return 0;
 return Math.round((parte/total)*100);
}

function contarAcaoPorTexto(texto){
 return reg.filter(r=>r.acao===texto).length;
}

function contarComecaCom(texto){
 return reg.filter(r=>r.acao&&r.acao.startsWith(texto)).length;
}

function jogadorTopo(filtro){
 let arr=jogadores
  .map(j=>({j,n:reg.filter(r=>r.jogador===j&&filtro(r)).length}))
  .sort((a,b)=>b.n-a.n);
 return arr[0]&&arr[0].n>0?`${arr[0].j} (${arr[0].n})`:"-";
}

function segundosDoTempo(str){
 if(!str || !String(str).includes(":"))return 0;
 let p=String(str).split(":");
 return (+p[0]||0)*60+(+p[1]||0);
}

function titularesIniciais(){
 let saved=JSON.parse(localStorage.getItem("titulares_iniciais_pasteis")||"null");
 if(saved && Array.isArray(saved) && saved.length)return saved;

 saved=campo.slice();
 localStorage.setItem("titulares_iniciais_pasteis",JSON.stringify(saved));
 return saved;
}

function garantirTitularesIniciais(){
 if(!localStorage.getItem("titulares_iniciais_pasteis")){
  localStorage.setItem("titulares_iniciais_pasteis",JSON.stringify(campo.slice()));
 }
}

function escapeExcel(v){
 return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function getSessoes(){
 return JSON.parse(localStorage.getItem("sessoes_pasteis")||"[]");
}

function setSessoes(lista){
 localStorage.setItem("sessoes_pasteis",JSON.stringify(lista));
}

function modoAtual(){
 return localStorage.getItem("modo_pasteis") || "jogo";
}

function nomeSessaoAutomatica(){
 let tipo=modoAtual()==="treino"?"Treino":"Jogo";
 let casa=($("casa")?$("casa").value:"AD Pastéis")||"AD Pastéis";
 let fora=($("fora")?$("fora").value:"Adversário")||"Adversário";
 let data=new Date().toLocaleDateString("pt-PT");
 if(tipo==="Treino"){let tn=localStorage.getItem("nome_treino_pasteis")||"Treino"; return `${tn} - ${data}`;}
 return `${casa} ${casaGoals}-${foraGoals} ${fora} - ${data}`;
}

function guardarSessaoAtual(){
 let nome=prompt("Nome para guardar:",nomeSessaoAutomatica());
 if(!nome)return;
 let sessao={
  id:Date.now(),
  nome:nome,
  tipo:modoAtual(),
  data:new Date().toLocaleString("pt-PT"),
  equipaCasa:($("casa")?$("casa").value:"AD Pastéis")||"AD Pastéis",
  equipaFora:($("fora")?$("fora").value:"")||"",
  resultado:{casa:casaGoals,fora:foraGoals},
  detalhes:localStorage.getItem("detalhes_jogo_pasteis")||"",
  total:total,
  inField:inField,
  dur:dur,
  jogadores:[...jogadores],
  campo:[...campo],
  banco:[...banco],
  reg:JSON.parse(JSON.stringify(reg)),
  subs:JSON.parse(JSON.stringify(subs)),
  attackSide:attackSide,
  jogoMinutosAtivo:jogoMinutosAtivo,
  titularesIniciais:titularesIniciais(),
  treino:{tipo:tipoTreinoAtual,nome:localStorage.getItem("nome_treino_pasteis")||"",data:localStorage.getItem("data_treino_pasteis")||"",duracao:localStorage.getItem("duracao_treino_pasteis")||"",objetivo:localStorage.getItem("objetivo_treino_pasteis")||"",jogadores:treinoJogadores,exercicios:exerciciosTreino,presencas:presencasTreino,treinadores:treinoTreinadores,presencasTreinadores:presencasTreinadores,medico:departamentoMedico}
 };
 let lista=getSessoes();
 lista.unshift(sessao);
 setSessoes(lista);
 alert("Guardado com sucesso.");
 openSessoes();
}

function carregarSessao(id){
 let lista=getSessoes();
 let s=lista.find(x=>x.id===id);
 if(!s)return;
 if(!confirm("Abrir esta sessão? Os dados atuais não guardados serão substituídos."))return;
 localStorage.setItem("modo_pasteis",s.tipo||"jogo");
 localStorage.setItem("equipa_casa_pasteis",s.equipaCasa||"AD Pastéis");
 localStorage.setItem("equipa_fora_pasteis",s.equipaFora||"");
 localStorage.setItem("golos_casa_pasteis",s.resultado?.casa||0);
 localStorage.setItem("golos_fora_pasteis",s.resultado?.fora||0);
 localStorage.setItem("detalhes_jogo_pasteis",s.detalhes||"");
 localStorage.setItem("total_jogadores_pasteis",s.total||12);
 localStorage.setItem("jogadores_campo_pasteis",s.inField||5);
 localStorage.setItem("duracao_periodo_pasteis",s.dur||12);
 localStorage.setItem("jogadores_pasteis",JSON.stringify(s.jogadores||[]));
 localStorage.setItem("campo_pasteis",JSON.stringify(s.campo||[]));
 localStorage.setItem("banco_pasteis",JSON.stringify(s.banco||[]));
 localStorage.setItem("registos_pasteis",JSON.stringify(s.reg||[]));
 localStorage.setItem("subs_pasteis",JSON.stringify(s.subs||[]));
 localStorage.setItem("attack_side_pasteis",s.attackSide||"right");
 localStorage.setItem("jogo_minutos_ativo_pasteis",s.jogoMinutosAtivo?"1":"0");
 if(s.titularesIniciais)localStorage.setItem("titulares_iniciais_pasteis",JSON.stringify(s.titularesIniciais));
 localStorage.setItem("abrir_direto_pasteis","1");
 location.reload();
}

function apagarSessao(id){
 if(!confirm("Apagar esta sessão guardada?"))return;
 let lista=getSessoes().filter(s=>s.id!==id);
 setSessoes(lista);
 openSessoes();
}

function estatisticasJogadora(jogadora,dados){
 let ev=dados||reg.filter(r=>r.jogador===jogadora);
 let golos=ev.filter(r=>r.acao&&r.acao.startsWith("Golo")&&r.acao!=="Golo sofrido").length;
 let remates=ev.filter(r=>r.acao&&r.acao.startsWith("Remate")).length;
 let assist=ev.filter(r=>r.acao==="Assistência").length;
 let defesas=ev.filter(r=>defesaDashboard(r)).length;
 let rec=ev.filter(r=>r.acao==="Recuperação de bola").length;
 let perdas=ev.filter(r=>r.acao==="Perda de bola").length;
 let exp=ev.filter(r=>r.acao==="Expulsão").length;
 let eficacia=remates?Math.round((golos/remates)*100):0;
 return {ev,golos,remates,assist,defesas,rec,perdas,exp,eficacia,total:ev.length};
}

function clearGame(){if(confirm("Apagar todos os registos deste jogo/treino?")){reg=[];subs=[];casaGoals=0;foraGoals=0;localStorage.removeItem("registos_pasteis");localStorage.removeItem("subs_pasteis");localStorage.removeItem("live_minutes_pasteis");liveMinutes={};localStorage.removeItem("jogo_minutos_ativo_pasteis");localStorage.removeItem("titulares_iniciais_pasteis");jogoMinutosAtivo=false;localStorage.setItem("golos_casa_pasteis",0);localStorage.setItem("golos_fora_pasteis",0);loadGame();renderAll()}}

function clearMapOnly(){if(confirm("Apagar apenas ações com localização no campo?")){reg=reg.filter(r=>r.x===""||r.x===undefined);localStorage.setItem("registos_pasteis",JSON.stringify(reg));renderAll()}}

function aplicarEntradaInicial(){
 if(localStorage.getItem("abrir_direto_pasteis")==="1"){
  localStorage.removeItem("abrir_direto_pasteis");

  if($("landingPage"))$("landingPage").classList.add("hidden");
  if($("menuPage"))$("menuPage").classList.add("hidden");
  if($("trainingPage"))$("trainingPage").classList.add("hidden");
  if($("settingsPage"))$("settingsPage").classList.add("hidden");
  if($("convocatoriaPage"))$("convocatoriaPage").classList.add("hidden");
  if($("main"))$("main").classList.remove("hidden");
 }
}

function addRegistoMedico(){
 let jogador=($("medJogador")?.value||"").trim();
 let causa=($("medCausa")?.value||"").trim();
 let descricao=($("medDescricao")?.value||"").trim();
 let estado=$("medEstado")?.value||"Não treina";

 if(!jogador){alert("Escolhe um jogador do grupo de treino.");return;}
 if(!causa){alert("Escreve a causa.");return;}

 departamentoMedico.unshift({
  id:Date.now(),
  jogador,
  causa,
  descricao,
  estado,
  data:new Date().toLocaleString("pt-PT")
 });

 localStorage.setItem("departamento_medico_pasteis",JSON.stringify(departamentoMedico));

 $("medJogador").value="";
 $("medCausa").value="";
 if($("medDescricao"))$("medDescricao").value="";
 $("medEstado").value="Não treina";

 renderMedicalList();
}

function setFiltroMedico(filtro){
 filtroMedico=filtro;
 renderMedicalList();
}

function classeEstadoMedico(estado){
 if(estado==="Não treina")return "medRed";
 if(estado==="Treina condicionado")return "medYellow";
 if(estado==="Disponível")return "medGreen";
 return "medBlue";
}

function apagarRegistoMedico(id){
 if(!confirm("Apagar este registo médico?"))return;
 departamentoMedico=departamentoMedico.filter(r=>r.id!==id);
 localStorage.setItem("departamento_medico_pasteis",JSON.stringify(departamentoMedico));
 renderMedicalList();
}

function editarRegistoMedico(id){
 let r=departamentoMedico.find(x=>x.id===id);
 if(!r)return;
 $("medJogador").value=r.jogador;
 $("medCausa").value=r.causa;
 if($("medDescricao"))$("medDescricao").value=r.descricao||"";
 $("medEstado").value=r.estado;
 apagarRegistoMedico(id);
}

function gravarIndividualEvento(exId,resultado,guardaRedes,jogador){
 if(!treinoIndividualTemp.x || !treinoIndividualTemp.y){
  alert("Marca primeiro o local do remate na mini arena.");
  return;
 }

 let emoji=resultado==="golo"?"⚽":(resultado==="fora"?"❌":"🧤");
 let acao=resultado==="golo"?"Golo":(resultado==="fora"?"Remate fora":"Defendido por "+guardaRedes);

 reg.unshift({
  jogador:jogador,
  periodo:"Treino",
  tempo:"",
  acao:acao,
  emoji:emoji,
  data:new Date().toLocaleString("pt-PT"),
  x:treinoIndividualTemp.x,
  y:treinoIndividualTemp.y,
  attackSide:"",
  exercicioId:String(exId),
  tipoRegisto:"treino",
  tipoIndividual:"individual",
  resultadoIndividual:resultado,
  guardaRedes:guardaRedes||""
 });

 localStorage.setItem("registos_pasteis",JSON.stringify(reg));

 treinoIndividualTemp={exercicioId:null,x:null,y:null,jogador:null};

 let modal=$("quickModal");
 if(modal)modal.classList.remove("show");

 renderExerciciosTreino();
 atualizarTreinoResumo();
}

function addIndividualEvento(exId,resultado,guardaRedes,jogador){
 confirmIndividualResultado(exId,resultado,guardaRedes,jogador);
}

function aplicarModoVisual(){
 let modo=localStorage.getItem("modo_pasteis") || "jogo";
 if(modo==="treino" && $("fora"))$("fora").placeholder="Treino";
}

function bindEntradaInicial(){
 const btn=$("enterMainBtn");
 if(btn){
  btn.onclick=function(e){
   if(e)e.preventDefault();
   abrirMenu();
   return false;
  };
 }
}