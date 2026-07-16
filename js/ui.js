/* StatS — ui.js
   Módulo separado automaticamente a partir do ficheiro original.
   Carregado antes de app.js.
*/

function abrirMenu(){
 const landing=$("landingPage");
 const menu=$("menuPage");
 const main=$("main");
 const training=$("trainingPage");
 const settings=$("settingsPage");
 const conv=$("convocatoriaPage");

 if(landing)landing.classList.add("hidden");
 if(menu)menu.classList.remove("hidden");
 if(main)main.classList.add("hidden");
 if(training)training.classList.add("hidden");
 if(settings)settings.classList.add("hidden");
 if(conv)conv.classList.add("hidden");
}

function toggle(id){$(id).classList.toggle("hidden")}

function toggleAttack(ev){ev.stopPropagation();attackSide=attackSide==="right"?"left":"right";localStorage.setItem("attack_side_pasteis",attackSide);renderAttack()}

function renderAttack(){
 let b=$("attackBtn");
 if(b)b.innerHTML=attackSide==="right"?"➡️":"⬅️";

 let big=$("attackDirectionBig");
 if(big)big.innerHTML=attackSide==="right"?"→":"←";

 let gr=$("goalkeeperMarker");
 if(gr){
  if(attackSide==="right"){
   gr.style.left="8px";
   gr.style.right="auto";
  }else{
   gr.style.right="8px";
   gr.style.left="auto";
  }
 }
}

function renderFlow(){
 return;
}

function renderMap(){
 let p=$("pitch");
 if(!p)return;

 p.querySelectorAll(".mapEmoji,.tempPoint").forEach(m=>m.remove());

 if(flow.x&&flow.y){
  let tp=document.createElement("div");
  tp.className="tempPoint";
  tp.style.left=flow.x+"%";
  tp.style.top=flow.y+"%";
  p.appendChild(tp);
 }
}

function openStatEvent(i){
 selectedEventIndex=i;
 let r=reg[i];
 if(!r)return;

 let emoji=r.emoji||acaoObj(r.acao).emoji;
 let zona=(r.x!==""&&r.x!==undefined&&r.y!==""&&r.y!==undefined)
  ? getZonaCampo(Number(r.x),Number(r.y),r.attackSide||attackSide)
  : "-";

 let direcao=r.attackSide==="left"?"⬅️ Atacava para a esquerda":"➡️ Atacava para a direita";

 $("eventTitle").innerText="Detalhe da ação";

 $("eventInfo").innerHTML=`
  <div class="statPopupDetail">
   <div class="statPopupHero">
    <div class="statPopupEmoji">${emoji}</div>
    <div>
     <div class="statPopupTitle">${r.acao||"-"}</div>
     <div class="statPopupSub">${r.jogador||"Sem jogadora"} · ${r.data||""}</div>
    </div>
   </div>

   <div class="statPopupGrid">
    <div class="statPopupItem">Jogadora<b>${r.jogador||"-"}</b></div>
    <div class="statPopupItem">Ação<b>${r.acao||"-"}</b></div>
    <div class="statPopupItem">Período<b>${r.periodo||"-"}</b></div>
    <div class="statPopupItem">Tempo<b>${r.tempo||"-"}</b></div>
    <div class="statPopupItem">Zona<b>${zona}</b></div>
    <div class="statPopupItem">Local técnico<b>${r.x||"-"}% · ${r.y||"-"}%</b></div>
   </div>

   <div class="statPopupDirection">${direcao}</div>

   <div class="statPopupActions">
    <button class="danger" onclick="deleteEvent()">Apagar ação</button>
    <button class="dark" onclick="closeEvent()">Fechar</button>
   </div>
  </div>
 `;

 $("eventModal").classList.add("show");
}

function openEvent(i){
 openStatEvent(i);
}

function closeEvent(){$("eventModal").classList.remove("show");selectedEventIndex=null}

function renderPlayerCard(){
 let tipo=tipoJogador(active);
 let html=`<button class="editBtn" onclick="event.stopPropagation();openEditStats()">✏️ Editar</button>
 <div style="display:grid;grid-template-columns:92px 1fr;gap:10px;align-items:center">
  ${playerKitHTML(active)}
  <div>
   <b>${active} ${details?"▲":"▼"}</b><br>
   <span class="small">${tipo==="gr"?"🧤 Guarda-redes":"👕 Jogadora"}</span><br>
   <span class="small">⚽ ${goals(active)} | ✔️ ${count(r=>r.jogador===active&&r.acao&&r.acao.startsWith("Remate"))} | 🧤 ${count(r=>r.jogador===active&&defesaDashboard(r))} | 🎁 ${count(r=>r.jogador===active&&r.acao==="Assistência")} | 🔙 ${count(r=>r.jogador===active&&r.acao==="Recuperação de bola")} | ⛔️ ${count(r=>r.jogador===active&&r.acao==="Perda de bola")}</span>
  </div>
 </div>`;
 if(details){html+="<hr>";acoes.forEach(a=>html+=`${a.emoji} ${a.nome}: <b>${count(r=>r.jogador===active&&r.acao===a.nome)}</b><br>`)}
 $("playerCard").innerHTML=html;
}

function toggleDetails(){details=!details;renderPlayerCard()}

function openSettings(){
 flow={x:null,y:null,jogador:null,acao:null,step:"idle"};

 ["quickModal","eventModal","subsModal","startersModal","editModal"].forEach(id=>{
  let m=$(id);
  if(m)m.classList.remove("show");
 });

 renderMap();

 if($("main"))$("main").classList.add("hidden");
 if($("trainingPage"))$("trainingPage").classList.add("hidden");
 if($("convocatoriaPage"))$("convocatoriaPage").classList.add("hidden");
 if($("settingsPage"))$("settingsPage").classList.remove("hidden");

 if($("setCasa"))$("setCasa").value=$("casa")?.value||"AD Pastéis";
 if($("setFora"))$("setFora").value=$("fora")?.value||"";
 if($("setTotal"))$("setTotal").value=total;
 if($("setCampo"))$("setCampo").value=inField;
 if($("setDur"))$("setDur").value=dur;
 if($("detalhes"))$("detalhes").value=localStorage.getItem("detalhes_jogo_pasteis")||"";

 renderEditNames();
 renderStats();
 renderReport();
 renderHistory();
}

function closeSettings(){$("settingsPage").classList.add("hidden");$("main").classList.remove("hidden")}

function saveSettings(){total=Math.max(1,+$("setTotal").value||12);inField=Math.max(1,Math.min(+$("setCampo").value||5,total));dur=Math.max(1,+$("setDur").value||12);localStorage.setItem("total_jogadores_pasteis",total);localStorage.setItem("jogadores_campo_pasteis",inField);localStorage.setItem("duracao_periodo_pasteis",dur);localStorage.setItem("equipa_casa_pasteis",$("setCasa").value||"Equipa da Casa");localStorage.setItem("equipa_fora_pasteis",$("setFora").value||"");localStorage.setItem("detalhes_jogo_pasteis",$("detalhes").value||"");while(jogadores.length<total)jogadores.push("Jogador "+(jogadores.length+1));while(jogadores.length>total)jogadores.pop();campo=jogadores.slice(0,inField);banco=jogadores.slice(inField);active=jogadores[0]||"Jogador 1";time=dur*60;pause();saveAll();loadGame();updateTimer();renderAll();alert("Definições guardadas.")}

function renderEditNames(){
 let e=$("editNames");
 e.innerHTML="";
 jogadores.forEach((j,i)=>{
  let tipo=tipoJogador(j);
  e.innerHTML+=`<div class="editRow" style="grid-template-columns:1fr">
   <input id="nome${i}" value="${j}">
   <div class="athleteTypeBox">
    <button class="athleteTypeBtn ${tipo==="jogadora"?"playerActive":""}" onclick="setTipoJogador('${esc(j)}','jogadora')">👕 Jogadora</button>
    <button class="athleteTypeBtn ${tipo==="gr"?"active":""}" onclick="setTipoJogador('${esc(j)}','gr')">🧤 Guarda-redes</button>
   </div>
  </div>`;
 });
 e.innerHTML+=`<button class="green" onclick="saveNames()">Guardar nomes</button><button class="danger" onclick="resetNames()">Repor Jogador 1-${total}</button>`;
}

function openEditStats(){$("editTitle").innerText="Editar estatísticas - "+active;let c=$("editStats");c.innerHTML="";acoes.forEach(a=>c.innerHTML+=`<div class="editRow"><span>${a.emoji} ${a.nome}: <b>${count(r=>r.jogador===active&&r.acao===a.nome)}</b></span><button class="green" onclick="adjust('${esc(a.nome)}',1)">+</button><button class="danger" onclick="adjust('${esc(a.nome)}',-1)">-</button></div>`);$("editModal").classList.add("show")}

function closeEditStats(){$("editModal").classList.remove("show")}

function openStarters(){
 startersTemp=[...campo];
 let modal=$("startersModal");
 if(modal)modal.classList.add("show");
 renderStarters();
}

function closeStarters(){
 let modal=$("startersModal");
 if(modal)modal.classList.remove("show");
 startersTemp=[];
}

function toggleStarter(j){
 if(startersTemp.includes(j)){
  startersTemp=startersTemp.filter(x=>x!==j);
 }else{
  if(startersTemp.length>=inField){
   alert("Só podes escolher "+inField+" jogadores para começar.");
   return;
  }
  startersTemp.push(j);
 }
 renderStarters();
}

function renderStarters(){
 let grid=$("startersGrid");
 let info=$("startersInfo");
 if(!grid||!info)return;

 info.innerHTML="Selecionadas: <b>"+startersTemp.length+"/"+inField+"</b><br>Esta escolha não conta como substituição.";

 grid.innerHTML="";
 jogadores.forEach(j=>{
  let b=document.createElement("button");
  b.className="pbtn"+(startersTemp.includes(j)?" starterPick":"");
  b.innerHTML=playerKitHTML(j,startersTemp.includes(j)?"active":"");
  b.onclick=()=>toggleStarter(j);
  grid.appendChild(b);
 });
}

function openSubs(){
 subsOutTemp=[];
 subsInTemp=[];
 outTemp=null;
 inTemp=null;
 $("subsModal").classList.add("show");
 renderSubs();
}

function closeSubs(){
 $("subsModal").classList.remove("show");
 subsOutTemp=[];
 subsInTemp=[];
 outTemp=null;
 inTemp=null;
}

function renderSubs(){
 let cg=$("campoGrid"),bg=$("bancoGrid");
 if(!cg||!bg)return;

 cg.innerHTML="";
 bg.innerHTML="";

 campo.forEach(j=>{
  let b=document.createElement("button");
  b.className="pbtn campo"+(subsOutTemp.includes(j)?" multiOut active":"");
  b.innerHTML=playerKitHTML(j,subsOutTemp.includes(j)?"active":"");
  b.onclick=()=>{
   subsOutTemp=subsOutTemp.includes(j)?subsOutTemp.filter(x=>x!==j):[...subsOutTemp,j];
   renderSubs();
   subInfo();
  };
  cg.appendChild(b);
 });

 banco.forEach(j=>{
  let b=document.createElement("button");
  b.className="pbtn banco"+(subsInTemp.includes(j)?" multiIn active":"");
  b.innerHTML=playerKitHTML(j,subsInTemp.includes(j)?"active":"");
  b.onclick=()=>{
   subsInTemp=subsInTemp.includes(j)?subsInTemp.filter(x=>x!==j):[...subsInTemp,j];
   renderSubs();
   subInfo();
  };
  bg.appendChild(b);
 });

 subInfo();
}

function toggleJogadorStats(id){
 let el=$("acc_"+id);
 if(el)el.classList.toggle("open");
}

function renderRelatorioPercentual(){
 let golosTotal=contarComecaCom("Golo");
 let golosLivre=contarAcaoPorTexto("Golo de livre");
 let rematesLivre=contarAcaoPorTexto("Remate livre");
 let rematesFora=contarAcaoPorTexto("Remate fora");
 let defesas=contarAcaoPorTexto("Defesa");
 let golosSofridos=contarAcaoPorTexto("Golo sofrido");

 let rematesJogo=contarAcaoPorTexto("Remate jogo corrido");
 let totalRemates=golosTotal+rematesJogo+rematesLivre+rematesFora;
 let rematesBaliza=Math.max(0,totalRemates-rematesFora);
 let eficacia=percentagem(golosTotal,totalRemates);
 let acertoBaliza=percentagem(rematesBaliza,totalRemates);
 let eficaciaLivre=percentagem(golosLivre,golosLivre+rematesLivre);

 let rematesEnquadradosContra=defesas+golosSofridos;
 let eficaciaDefensiva=percentagem(defesas,rematesEnquadradosContra);
 let golosSofridosPct=percentagem(golosSofridos,rematesEnquadradosContra);

 function item(titulo,valor,sub,pct){
  return `<div class="percentItem">
   ${titulo}<br>
   <b>${valor}</b>
   <div class="small">${sub}</div>
   <div class="percentBar"><div class="percentFill" style="width:${Math.min(100,Math.max(0,pct))}%"></div></div>
  </div>`;
 }

 return `<div class="percentReport">
  <h3>📊 Relatório percentual</h3>
  <b>Resumo do jogo:</b> ${($("casa")?$("casa").value:"AD Pastéis")||"AD Pastéis"} ${casaGoals}-${foraGoals} ${$("fora").value||"Adversário"}<br>
  <div class="percentGrid">
   ${item("Eficácia de finalização",eficacia+"%","Golos / total de remates",eficacia)}
   ${item("Remates à baliza",acertoBaliza+"%","Remates que não foram fora",acertoBaliza)}
   ${item("Golos de livre / Remates de livre",eficaciaLivre+"%",`${golosLivre} golos / ${golosLivre+rematesLivre} ações`,eficaciaLivre)}
   ${item("Defesas / Golos sofridos",eficaciaDefensiva+"%",`${defesas} defesas / ${golosSofridos} golos sofridos`,eficaciaDefensiva)}

  </div>
  <br>
  <b>Destaques:</b><br>
  Melhor marcador: ${jogadorTopo(r=>r.acao&&r.acao.startsWith("Golo"))}<br>
  Mais remates: ${jogadorTopo(r=>r.acao&&r.acao.startsWith("Remate"))}<br>
  Mais assistências: ${jogadorTopo(r=>r.acao==="Assistência")}<br>
  Mais defesas: ${jogadorTopo(r=>r.acao==="Defesa")}<br>
  Zona mais usada: ${zonaMaisUsada()}
 </div>`;
}

function renderStats(){
 let st=$("stats");
 if(!st)return;

 let filtro=$("filtroPeriodoStats")?.value || "Todos";
 let dados=filtro==="Todos"?reg:reg.filter(r=>r.periodo===filtro);

 st.innerHTML=`
  <label>Período das estatísticas</label>
  <select id="filtroPeriodoStats" onchange="renderStats()">
   <option value="Todos" ${filtro==="Todos"?"selected":""}>Todos</option>
   <option value="1.º período" ${filtro==="1.º período"?"selected":""}>1.º período</option>
   <option value="2.º período" ${filtro==="2.º período"?"selected":""}>2.º período</option>
   <option value="3.º período" ${filtro==="3.º período"?"selected":""}>3.º período</option>
   <option value="Prolongamento" ${filtro==="Prolongamento"?"selected":""}>Prolongamento</option>
   <option value="Penáltis" ${filtro==="Penáltis"?"selected":""}>Penáltis</option>
  </select>
 `;

 // 1) MAPA COLETIVO NO TOPO
 let eventosColetivos=dados
  .map((r)=>({r,regIndex:reg.indexOf(r)}))
  .filter(obj=>obj.r.x!==""&&obj.r.x!==undefined&&obj.r.y!==""&&obj.r.y!==undefined);

 st.innerHTML+=`
 <div class="collectiveBox">
  <h3>📍 Mapa coletivo da equipa</h3>
  <div class="small">Filtro: <b>${filtro}</b> · Clica num emoji para apagar essa ação.</div>
  ${desenharCampoEventos(eventosColetivos)}
 </div>`;

 // 2) JOGADORES FECHADOS POR DEFEITO
 jogadores.forEach((p,idx)=>{
  let eventosJogador=dados
   .map((r)=>({r,regIndex:reg.indexOf(r)}))
   .filter(obj=>obj.r.jogador===p&&obj.r.x!==""&&obj.r.x!==undefined&&obj.r.y!==""&&obj.r.y!==undefined);

  let totalGolos=dados.filter(r=>r.jogador===p&&r.acao&&r.acao.startsWith("Golo")).length;
  let totalRemates=dados.filter(r=>r.jogador===p&&r.acao&&r.acao.startsWith("Remate")).length;
  let totalDefesas=dados.filter(r=>r.jogador===p&&defesaDashboard(r)).length;
  let totalAssist=dados.filter(r=>r.jogador===p&&r.acao==="Assistência").length;

  let bloco=`<div class="playerAccordion" id="acc_${idx}">
   <button class="playerAccordionHeader" onclick="toggleJogadorStats(${idx})">
    ▶️ ${p} — ⚽ ${totalGolos} | ✔️ ${totalRemates} | 🧤 ${totalDefesas} | 🎁 ${totalAssist}
   </button>
   <div class="playerAccordionBody">
    <div class="small">Filtro: <b>${filtro}</b> · Clica num emoji do mapa para apagar essa ação.</div>
    ${desenharCampoEventos(eventosJogador)}
    <h4>Ações</h4>`;

  acoes.forEach(a=>{
   let n=dados.filter(r=>r.jogador===p&&r.acao===a.nome).length;
   bloco+=`<div class="stat"><span>${a.emoji} ${a.nome}</span><b>${n}</b></div>`;
  });

  bloco+=`</div></div>`;
  st.innerHTML+=bloco;
 });
}

function tableHTML(headers,rows){
 return `<table border="1"><thead><tr>${headers.map(h=>`<th>${escapeExcel(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${escapeExcel(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function renderReport(){
 let r=$("report");
 if(!r)return;

 r.innerHTML=
  renderDashboardJogo()+
  tabelaMinutosHTML()+
  renderRelatorioPercentual();
}

function renderHistory(){
 let h=$("history");
 if(!h)return;

 h.innerHTML="";

 periodoOrdem().forEach(p=>{
  let eventos=reg.filter(r=>r.periodo===p);

  h.innerHTML+=`<div class="periodBlock"><h3>${p}</h3>`;

  if(!eventos.length){
   h.innerHTML+=`<div class="small">Sem ações registadas.</div>`;
  }else{
   eventos.forEach(r=>{
    let originalIndex=reg.indexOf(r);
    let zona=zonaEvento(r);
    let atk=r.attackSide==="left"?" · ataque esquerda":" · ataque direita";
    h.innerHTML+=`<div class="log" onclick="openStatEvent(${originalIndex})"><b>${r.emoji||acaoObj(r.acao).emoji} ${r.acao}</b><br>${r.jogador} · ${r.periodo} · ${r.tempo} · ${zona}${atk}<br>${r.data}</div>`;
   });
  }

  h.innerHTML+=`</div>`;
 });
}

function openSessoes(){
 let modal=$("sessoesModal");
 let content=$("sessoesContent");
 if(!modal||!content)return;
 let lista=getSessoes();
 if(!lista.length){
  content.innerHTML="<div class='log'>Ainda não tens jogos ou treinos guardados.</div>";
 }else{
  content.innerHTML=lista.map(s=>{
   let tipo=s.tipo==="treino"?"🏖️ Treino":"⚽ Jogo";
   let resultado=s.tipo==="treino"?"":`<br>Resultado: <b>${s.resultado?.casa??0}-${s.resultado?.fora??0}</b>`;
   return `<div class="sessionItem">
    <b>${tipo}</b><br>
    ${s.nome}<br>
    <span class="small">${s.data}</span>
    ${resultado}
    <div class="sessionActions">
      <button class="green" onclick="carregarSessao(${s.id})">Abrir</button>
      <button class="danger" onclick="apagarSessao(${s.id})">🗑️</button>
    </div>
   </div>`;
  }).join("");
 }
 modal.classList.add("show");
}

function closeSessoes(){
 let modal=$("sessoesModal");
 if(modal)modal.classList.remove("show");
}

function openImportSubsModal(){
 let m=$("importSubsModal");
 if(m)m.classList.add("show");
}

function closeImportSubsModal(){
 let m=$("importSubsModal");
 if(m)m.classList.remove("show");
}

function openTrainingTab(tab){
 const tabs=["grupo","presencas","exercicios","resumo"];

 const secAtual=$("trainingSection"+tab.charAt(0).toUpperCase()+tab.slice(1));
 const btnAtual=$("tab"+tab.charAt(0).toUpperCase()+tab.slice(1));
 const jaAberta=btnAtual && btnAtual.classList.contains("active");

 tabs.forEach(t=>{
  const sec=$("trainingSection"+t.charAt(0).toUpperCase()+t.slice(1));
  const btn=$("tab"+t.charAt(0).toUpperCase()+t.slice(1));
  if(sec) sec.classList.add("hidden");
  if(btn) btn.classList.remove("active");
 });

 if(jaAberta) return;

 if(secAtual) secAtual.classList.remove("hidden");
 if(btnAtual) btnAtual.classList.add("active");

 renderTreinoJogadores();
 renderPresencas();
 renderTreinadores();
 renderMedicalSelect();
 renderMedicalList();
 renderExerciciosTreino();
 atualizarTreinoResumo();
}

function voltarMenu(){
 pause();

 if($("trainingPage"))$("trainingPage").classList.add("hidden");
 if($("main"))$("main").classList.add("hidden");
 if($("settingsPage"))$("settingsPage").classList.add("hidden");
 if($("convocatoriaPage"))$("convocatoriaPage").classList.add("hidden");
 if($("menuPage"))$("menuPage").classList.remove("hidden");
}

function renderMedicalSelect(){
 let sel=$("medJogador");
 if(!sel)return;

 let atual=sel.value;
 let lista=treinoJogadores&&treinoJogadores.length?treinoJogadores:[];

 if(!lista.length){
  sel.innerHTML="<option value=''>Sem jogadores no grupo</option>";
  return;
 }

 sel.innerHTML=lista.map(j=>`<option value="${j}">${j}</option>`).join("");

 if(atual && lista.includes(atual)){
  sel.value=atual;
 }
}

function renderTreinadores(){
 let grid=$("coachPresenceGrid");
 let lista=$("treinadoresLista");

 if(grid){
  grid.innerHTML="";
  treinoTreinadores.forEach(m=>{
   let b=document.createElement("button");
   b.className="presenceBtn"+(presencasTreinadores.includes(m.nome)?" active":"");
   b.innerHTML=m.nome+"<br><span style='font-size:10px;opacity:.8'>"+(m.funcao||"Equipa Técnica")+"</span>";
   b.onclick=()=>{
    presencasTreinadores=presencasTreinadores.includes(m.nome)
     ? presencasTreinadores.filter(x=>x!==m.nome)
     : [...presencasTreinadores,m.nome];

    localStorage.setItem("presencas_treinadores_pasteis",JSON.stringify(presencasTreinadores));
    renderTreinadores();
    atualizarTreinoResumo();
   };
   grid.appendChild(b);
  });
 }

 if(lista){
  if(!treinoTreinadores.length){
   lista.innerHTML="<div class='log'>Ainda não adicionaste membros da equipa técnica.</div>";
   return;
  }

  lista.innerHTML=treinoTreinadores.map(m=>`
   <div class="coachRow">
    <div>
     <b>${m.nome}</b><br>
     <span class="small">${m.funcao||"Equipa Técnica"}</span>
    </div>
    <button class="exerciseDeleteBtn" onclick="removeTreinadorTreino('${esc(m.nome)}')">🗑️</button>
   </div>
  `).join("");
 }
}

function renderPresencas(){
 let grid=$("presenceGrid");
 if(!grid)return;

 grid.innerHTML="";
 treinoJogadores.forEach(j=>{
  let b=document.createElement("button");
  b.className="presenceBtn"+(presencasTreino.includes(j)?" active":"");
  b.textContent=j;
  b.onclick=()=>{
   presencasTreino=presencasTreino.includes(j)?presencasTreino.filter(x=>x!==j):[...presencasTreino,j];
   localStorage.setItem("presencas_treino_pasteis",JSON.stringify(presencasTreino));
   renderPresencas();
   atualizarTreinoResumo();
  };
  grid.appendChild(b);
 });
}

function renderMedicalList(){
 let box=$("medicalList");
 if(!box)return;

 let lista=departamentoMedico.filter(r=>filtroMedico==="todos"||r.estado===filtroMedico);

 if(!lista.length){
  box.innerHTML="<div class='medicalEmptyTitle'>Registos médicos</div>";
  return;
 }

 box.innerHTML=lista.map(r=>`
  <div class="medicalRow">
   <b>${r.jogador}</b><br>
   <span class="medicalStatus ${classeEstadoMedico(r.estado)}">${r.estado}</span><br>
   <div class="small">${r.data}</div>
   <div>${r.causa}</div>
   ${r.descricao?`<div class="medicalDescription"><b>Atualização:</b><br>${r.descricao}</div>`:""}
   <div class="medicalActions">
    <button class="exerciseSmallBtn" onclick="editarRegistoMedico(${r.id})">Editar</button>
    <button class="exerciseDeleteBtn" onclick="apagarRegistoMedico(${r.id})">🗑️</button>
   </div>
  </div>
 `).join("");
}

function renderMiniArenaIndividual(ex,eventos){
 let html=`<div class="trainingMiniArena" onclick="openIndividualDashboardModal()">
  <div class="trainingMiniArea leftMini"></div>
  <div class="trainingMiniArea rightMini"></div>`;

 // As ações já guardadas não ficam desenhadas no campo.
 // Ficam editáveis na lista de remates em baixo, mantendo a mini arena limpa.

 if(String(treinoIndividualTemp.exercicioId)===String(ex.id)&&treinoIndividualTemp.x&&treinoIndividualTemp.y){
  html+=`<span class="trainingTempPoint" style="left:${treinoIndividualTemp.x}%;top:${treinoIndividualTemp.y}%"></span>`;
 }

 html+=`</div>`;
 return html;
}

function toggleExerciseReport(id){
 let el=$(id);
 if(el)el.classList.toggle("hidden");
}

function toggleSidebar(){
 let main=$("main");
 if(!main)return;
 main.classList.toggle("sidebarOpen");
}

function renderProfessionalPanels(){
 let qs=$("proQuickStats");
 if(qs){
  let remates=reg.filter(r=>r.acao&&String(r.acao).startsWith("Remate")).length;
  let remDefendidos=reg.filter(r=>r.acao&&String(r.acao).startsWith("Remate")&&String(r.acao).endsWith("defesa")).length;
  let remFora=reg.filter(r=>r.acao&&String(r.acao).startsWith("Remate")&&String(r.acao).endsWith("fora")).length;
  let rec=reg.filter(r=>r.acao==="Recuperação de bola").length;
  let perdas=reg.filter(r=>r.acao==="Perda de bola").length;

  let tiles=[
   ["Remates",remates],
   ["Remates defendidos",remDefendidos],
   ["Remates fora",remFora],
   ["Recuperações",rec],
   ["Perdas de bola",perdas]
  ];

  qs.innerHTML=tiles.map(t=>`<div class="proStatTile"><span>${t[0]}</span><b>${t[1]}</b></div>`).join("");
 }

 if($("proFieldCount"))$("proFieldCount").innerHTML=`<span class="small">● ${campo.length}/${inField}</span>`;
 if($("proBenchCount"))$("proBenchCount").innerHTML=`<span class="small">${banco.length}</span>`;

 let fp=$("proFieldPlayers");
 if(fp){
  fp.innerHTML=campo.map(j=>`<div class="proPlayerCard ${active===j?"active":""}" onclick="active='${esc(j)}';renderAll()">
   ${playerKitHTML(j)}
   <div class="proPlayerName">${j}</div>
   <div class="proPlayerMeta"><span class="proGreenDot"></span>${getDisplayedMinute(j)}</div>
  </div>`).join("");
 }

 let bp=$("proBenchPlayers");
 if(bp){
  bp.innerHTML=banco.map(j=>`<div class="proPlayerCard ${active===j?"active":""}" onclick="active='${esc(j)}';renderAll()">
   ${playerKitHTML(j)}
   <div class="proPlayerName">${j}</div>
   <div class="proPlayerMeta">${tipoJogador(j)==="gr"?"GR":"SUP"} · ${getDisplayedMinute(j)}</div>
  </div>`).join("");
 }

 renderLivePlayersPanel();
}

function renderAll(){renderAttack();renderMap();renderFlow();renderPlayerCard();renderStats();renderReport();renderHistory();renderSubs();atualizarTreinoResumo();aplicarModoVisual();renderProfessionalPanels();renderLivePlayersPanel();renderHeatMap()}