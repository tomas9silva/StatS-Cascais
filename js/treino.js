/* StatS — treino.js
   Módulo separado automaticamente a partir do ficheiro original.
   Carregado antes de app.js.
*/

function abrirTreinoPage(){
 pause();
 localStorage.setItem("modo_pasteis","treino");

 if($("landingPage"))$("landingPage").classList.add("hidden");
 if($("menuPage"))$("menuPage").classList.add("hidden");
 if($("main"))$("main").classList.add("hidden");
 if($("settingsPage"))$("settingsPage").classList.add("hidden");
 if($("convocatoriaPage"))$("convocatoriaPage").classList.add("hidden");
 if($("trainingPage"))$("trainingPage").classList.remove("hidden");

 carregarDadosTreino();

 ["grupo","presencas","exercicios","resumo"].forEach(t=>{
  const sec=$("trainingSection"+t.charAt(0).toUpperCase()+t.slice(1));
  const btn=$("tab"+t.charAt(0).toUpperCase()+t.slice(1));
  if(sec)sec.classList.add("hidden");
  if(btn)btn.classList.remove("active");
 });
}

function entrarTreino(){
 abrirTreinoPage();
}

function setTipoTreino(tipo,btn){
 tipoTreinoAtual=tipo;
 localStorage.setItem("tipo_treino_pasteis",tipo);
 document.querySelectorAll(".trainingModeBtn").forEach(b=>b.classList.remove("active"));
 if(btn)btn.classList.add("active");
}

function carregarDadosTreino(){
 if($("treinoData") && !$("treinoData").value)$("treinoData").value=localStorage.getItem("data_treino_pasteis") || new Date().toISOString().slice(0,10);
 if($("treinoNome") && !$("treinoNome").value)$("treinoNome").value=localStorage.getItem("nome_treino_pasteis") || ("Treino - "+new Date().toLocaleDateString("pt-PT"));
 if($("treinoDuracao") && !$("treinoDuracao").value)$("treinoDuracao").value=localStorage.getItem("duracao_treino_pasteis") || "";
 if($("treinoObjetivo") && !$("treinoObjetivo").value)$("treinoObjetivo").value=localStorage.getItem("objetivo_treino_pasteis") || "";

 if(!presencasTreino.length){
  presencasTreino=[...treinoJogadores];
  localStorage.setItem("presencas_treino_pasteis",JSON.stringify(presencasTreino));
 }

 renderTreinoJogadores();
 renderPresencas();
 renderTreinadores();
 renderExerciciosTreino();
 renderMedicalSelect();
 renderMedicalList();
}

function addTreinoJogador(){
 let nome=($("novoTreinoJogador")?.value||"").trim();
 if(!nome){alert("Escreve o nome do jogador.");return;}
 if(treinoJogadores.includes(nome)){alert("Esse jogador já existe no grupo de treino.");return;}

 treinoJogadores.push(nome);
 presencasTreino.push(nome);

 localStorage.setItem("treino_jogadores_pasteis",JSON.stringify(treinoJogadores));
 localStorage.setItem("presencas_treino_pasteis",JSON.stringify(presencasTreino));

 $("novoTreinoJogador").value="";
 renderTreinoJogadores();
 renderPresencas();
 renderTreinadores();
 renderMedicalSelect();
 atualizarTreinoResumo();
}

function removeTreinoJogador(nome){
 if(!confirm("Remover este jogador do grupo de treino?"))return;
 treinoJogadores=treinoJogadores.filter(j=>j!==nome);
 presencasTreino=presencasTreino.filter(j=>j!==nome);

 localStorage.setItem("treino_jogadores_pasteis",JSON.stringify(treinoJogadores));
 localStorage.setItem("presencas_treino_pasteis",JSON.stringify(presencasTreino));

 renderTreinoJogadores();
 renderPresencas();
 renderTreinadores();
 renderMedicalSelect();
 atualizarTreinoResumo();
}

function renderTreinoJogadores(){
 let box=$("treinoJogadoresLista");
 if(!box)return;

 if(!treinoJogadores.length){
  box.innerHTML="<div class='log'>Ainda não tens jogadores no treino.</div>";
  return;
 }

 box.innerHTML=treinoJogadores.map(j=>`
  <div class="trainingPlayerRow">
   <b>${j}</b>
   <div class="trainingPlayerActions" style="grid-template-columns:44px;justify-content:end">
    <button class="exerciseDeleteBtn" onclick="removeTreinoJogador('${esc(j)}')">🗑️</button>
   </div>
  </div>
 `).join("");
}

function addTreinadorTreino(){
 let nome=($("novoTreinador")?.value||"").trim();
 let funcao=($("novaFuncaoTreinador")?.value||"").trim() || "Equipa Técnica";

 if(!nome){alert("Escreve o nome do membro da equipa técnica.");return;}
 if(treinoTreinadores.some(t=>t.nome===nome)){alert("Esse membro já existe.");return;}

 treinoTreinadores.push({nome,funcao});
 presencasTreinadores.push(nome);

 localStorage.setItem("treino_treinadores_pasteis",JSON.stringify(treinoTreinadores));
 localStorage.setItem("presencas_treinadores_pasteis",JSON.stringify(presencasTreinadores));

 $("novoTreinador").value="";
 if($("novaFuncaoTreinador"))$("novaFuncaoTreinador").value="";

 renderTreinadores();
 atualizarTreinoResumo();
}

function removeTreinadorTreino(nome){
 if(!confirm("Remover este membro da equipa técnica?"))return;

 treinoTreinadores=treinoTreinadores.filter(t=>t.nome!==nome);
 presencasTreinadores=presencasTreinadores.filter(t=>t!==nome);

 localStorage.setItem("treino_treinadores_pasteis",JSON.stringify(treinoTreinadores));
 localStorage.setItem("presencas_treinadores_pasteis",JSON.stringify(presencasTreinadores));

 renderTreinadores();
 atualizarTreinoResumo();
}

function addExercicioTreino(){
 let nome=($("exNome")?.value||"").trim();
 if(!nome){alert("Escreve o nome do exercício.");return;}

 let ex={
  id:Date.now(),
  nome,
  formato:$("exFormato")?.value||"Coletivo",
  arena:$("exArena")?.value||"sim",
  tipo:"",
  intensidade:"",
  duracao:$("exDuracao")?.value||"",
  criado:new Date().toLocaleString("pt-PT")
 };

 exerciciosTreino.push(ex);
 localStorage.setItem("exercicios_treino_pasteis",JSON.stringify(exerciciosTreino));
 $("exNome").value="";
 $("exDuracao").value="";
 renderExerciciosTreino();
 atualizarTreinoResumo();
}

function renderExerciciosTreino(){
 let box=$("exerciciosLista");
 if(!box)return;

 if(!exerciciosTreino.length){
  box.innerHTML="<div class='log'>Ainda não criaste exercícios.</div>";
  return;
 }

 box.innerHTML=exerciciosTreino.map(ex=>{
  let arena=ex.arena==="sim"?"Com mini arena":"Sem mini arena";
  let ativo=String(ex.id)===String(exercicioAtualId)?" · ativo":"";
  let aberto=ex.aberto?" open":"";
  let detalhes=ex.aberto?renderExercicioAberto(ex):"";

  return `<div class="trainingExercise${aberto}" id="treinoEx_${ex.id}">
   <button class="exerciseEditBtn" onclick="toggleEditExercicio(${ex.id})">✏️</button>
   <b>${ex.nome}${ativo}</b>
   <div class="exerciseMeta">
    <span>${ex.formato}</span><span>${arena}</span><span>${ex.duracao?ex.duracao+" min":"Sem duração"}</span>
   </div>
   <div id="editEx_${ex.id}" class="exerciseEditPanel hidden">
    <label>Nome</label><input id="editExNome_${ex.id}" value="${ex.nome}">
    <div class="trainingSelectRow">
     <div><label>Formato</label><select id="editExFormato_${ex.id}"><option ${ex.formato==="Coletivo"?"selected":""}>Coletivo</option><option ${ex.formato==="Individual"?"selected":""}>Individual</option><option ${ex.formato==="Grupos"?"selected":""}>Grupos</option><option ${ex.formato==="Guarda-redes"?"selected":""}>Guarda-redes</option></select></div>
     <div><label>Arena</label><select id="editExArena_${ex.id}"><option value="sim" ${ex.arena==="sim"?"selected":""}>Com mini arena</option><option value="nao" ${ex.arena==="nao"?"selected":""}>Sem mini arena</option></select></div>
    </div>
    <label>Duração</label><input id="editExDuracao_${ex.id}" type="number" min="1" value="${ex.duracao||""}">
    <button class="trainingStartBtn" onclick="saveEditExercicio(${ex.id})">Guardar alterações</button>
   </div>
   <div class="exerciseActions">
    <button class="exerciseSmallBtn" onclick="abrirExercicio(${ex.id})">${ex.aberto?"Fechar":"Abrir"}</button>
    <button class="exerciseDeleteBtn" onclick="apagarExercicio(${ex.id})">Apagar</button>
   </div>
   ${detalhes}
  </div>`;
 }).join("");
}

function toggleEditExercicio(id){
 let el=$("editEx_"+id);
 if(el)el.classList.toggle("hidden");
}

function saveEditExercicio(id){
 let ex=exerciciosTreino.find(e=>String(e.id)===String(id));
 if(!ex)return;

 ex.nome=$("editExNome_"+id)?.value||ex.nome;
 ex.formato=$("editExFormato_"+id)?.value||ex.formato;
 ex.arena=$("editExArena_"+id)?.value||ex.arena;
 ex.duracao=$("editExDuracao_"+id)?.value||ex.duracao;

 localStorage.setItem("exercicios_treino_pasteis",JSON.stringify(exerciciosTreino));
 renderExerciciosTreino();
}

function abrirExercicio(id){
 let ex=exerciciosTreino.find(e=>e.id===id);
 if(!ex)return;

 exercicioAtualId=String(id);
 localStorage.setItem("exercicio_atual_pasteis",exercicioAtualId);

 // Fica sempre dentro da página Treino.
 // Se tiver mini arena, o cartão abre ali mesmo.
 ex.aberto=!ex.aberto;

 localStorage.setItem("exercicios_treino_pasteis",JSON.stringify(exerciciosTreino));
 renderExerciciosTreino();
}

function apagarExercicio(id){
 if(!confirm("Apagar este exercício?"))return;
 exerciciosTreino=exerciciosTreino.filter(e=>e.id!==id);
 localStorage.setItem("exercicios_treino_pasteis",JSON.stringify(exerciciosTreino));
 if(String(exercicioAtualId)===String(id)){
  exercicioAtualId="";
  localStorage.removeItem("exercicio_atual_pasteis");
 }
 renderExerciciosTreino();
 atualizarTreinoResumo();
}

function treinoEventosDoExercicio(exId){
 return reg.filter(r=>String(r.exercicioId)===String(exId));
}

function renderExercicioAberto(ex){
 if(ex.formato==="Coletivo"){
  return renderExercicioColetivo(ex);
 }
 if(ex.formato==="Individual"){
  return renderExercicioIndividual(ex);
 }

 let eventos=treinoEventosDoExercicio(ex.id);

 let stats=[
  {nome:"Golos",valor:eventos.filter(r=>r.acao&&r.acao.startsWith("Golo")).length},
  {nome:"Remates",valor:eventos.filter(r=>r.acao&&r.acao.startsWith("Remate")).length},
  {nome:"Defesas",valor:eventos.filter(r=>r.acao==="Defesa").length},
  {nome:"Assistências",valor:eventos.filter(r=>r.acao==="Assistência").length},
  {nome:"Falhados",valor:eventos.filter(r=>r.acao==="Remate fora"||r.acao==="Passe falhado").length},
  {nome:"Total",valor:eventos.length}
 ];

 let html=`<div class="trainingExerciseStats">`+
  stats.map(s=>`<div class="trainingExerciseStat"><b>${s.valor}</b>${s.nome}</div>`).join("")+
 `</div>`;

 if(ex.arena==="sim"){
  html+=renderMiniArenaTreino(ex,eventos);
  html+=`<div class="trainingActionGrid">`+
   acoes.map(a=>`<button onclick="addTreinoActionSemPonto(${ex.id},'${esc(a.nome)}')">${a.emoji} ${a.nome}</button>`).join("")+
  `</div>`;
 }else{
  html+=`<div class="log">Exercício sem mini arena. Podes registar ações rápidas em baixo.</div>`;
  html+=`<div class="trainingActionGrid">`+
   acoes.map(a=>`<button onclick="addTreinoActionSemPonto(${ex.id},'${esc(a.nome)}')">${a.emoji} ${a.nome}</button>`).join("")+
  `</div>`;
 }

 html+=`<label>Observações do exercício</label>
 <textarea class="trainingObs" onchange="saveObsExercicio(${ex.id},this.value)">${ex.observacoes||""}</textarea>`;

 return html;
}

function renderExercicioColetivo(ex){
 let eventos=treinoEventosDoExercicio(ex.id).filter(r=>r.tipoColetivo==="coletivo");
 let total=eventos.length;
 let acertos=eventos.filter(r=>r.resultadoColetivo==="acerto").length;
 let falhou=eventos.filter(r=>r.resultadoColetivo==="falhou").length;
 let jamila=eventos.filter(r=>r.resultadoColetivo==="defendido"&&r.guardaRedes==="Jamila").length;
 let crespo=eventos.filter(r=>r.resultadoColetivo==="defendido"&&r.guardaRedes==="Crespo").length;
 let outro=eventos.filter(r=>r.resultadoColetivo==="defendido"&&r.guardaRedes==="Outro").length;
 let defendidos=jamila+crespo+outro;
 let eficiencia=total?Math.round((acertos/total)*100):0;

 return `<div class="collectiveCounterBox">
  <div class="collectiveTotal">
   Tentativas totais
   <b>${total}</b>
  </div>

  <div class="collectiveBreakdown">
   <div class="collectiveStat"><b>${acertos}</b>🟢 Acertos</div>
   <div class="collectiveStat"><b>${falhou}</b>🔴 Falhou</div>
   <div class="collectiveStat"><b>${jamila}</b>🧤 Jamila</div>
   <div class="collectiveStat"><b>${crespo}</b>🧤 Crespo</div>
   <div class="collectiveStat"><b>${outro}</b>🧤 Outro GR</div>
   <div class="collectiveStat"><b>${defendidos}</b>Defendidos</div>
  </div>

  <div class="collectiveEfficiency">
   Eficiência: <b>${eficiencia}%</b>
   <div class="collectiveBar"><div class="collectiveFill" style="width:${eficiencia}%"></div></div>
  </div>

  <div class="collectiveButtons">
   <button class="collectiveHit" onclick="addColetivoAcerto(${ex.id})">🟢 Acerto</button>
   <button class="collectiveMiss" onclick="openFalhaColetivo(${ex.id})">🔴 Falha</button>
  </div>

  ${renderRelatoriosExercicio(ex)}

  <label>Observações do exercício</label>
  <textarea class="trainingObs" onchange="saveObsExercicio(${ex.id},this.value)">${ex.observacoes||""}</textarea>
 </div>`;
}

function addColetivoAcerto(exId){
 openConfirmTreinoEvento({
  tipo:"coletivo",
  exId:String(exId),
  resultado:"acerto",
  guardaRedes:"",
  jogador:"Coletivo",
  acao:"Tentativa acertada",
  emoji:"🟢"
 });
}

function openFalhaColetivo(exId){
 let modal=$("quickModal");
 let title=$("quickTitle");
 let content=$("quickContent");

 title.innerHTML="Como terminou a tentativa?";

 content.innerHTML=`
  <div class="grid">
   <button class="actionBtn dark" onclick="confirmFalhaColetivo(${exId},'falhou','')">🔴 Falhou</button>
   <button class="actionBtn dark" onclick="confirmFalhaColetivo(${exId},'defendido','Jamila')">🧤 Jamila defendeu</button>
   <button class="actionBtn dark" onclick="confirmFalhaColetivo(${exId},'defendido','Crespo')">🧤 Crespo defendeu</button>
   <button class="actionBtn dark" onclick="confirmFalhaColetivo(${exId},'defendido','Outro')">🧤 Outro defendeu</button>
  </div>
 `;

 modal.classList.add("show");
}

function confirmFalhaColetivo(exId,resultado,guardaRedes){
 let emoji=resultado==="falhou"?"🔴":"🧤";
 let acao=resultado==="falhou"?"Tentativa falhada":guardaRedes+" defendeu";
 openConfirmTreinoEvento({
  tipo:"coletivo",
  exId:String(exId),
  resultado,
  guardaRedes:guardaRedes||"",
  jogador:"Coletivo",
  acao,
  emoji
 });
}

function openConfirmTreinoEvento(dados){
 treinoConfirmTemp=dados;
 let modal=$("quickModal");
 let title=$("quickTitle");
 let content=$("quickContent");

 title.innerHTML="Confirmar seleção";

 content.innerHTML=`
  <div class="confirmBox">
   <b>${dados.emoji||""} ${dados.acao}</b><br>
   <span>Jogador: <b>${dados.jogador||"Coletivo"}</b></span>
   ${dados.guardaRedes?`<br><span>Guarda-redes: <b>${dados.guardaRedes}</b></span>`:""}
  </div>
  <div class="confirmActions">
   <button class="green" onclick="guardarTreinoConfirmado()">Confirmar</button>
   <button class="danger" onclick="cancelMapFlow()">Cancelar</button>
  </div>
 `;

 modal.classList.add("show");
}

function guardarTreinoConfirmado(){
 if(!treinoConfirmTemp)return;

 if(treinoConfirmTemp.tipo==="coletivo"){
  gravarColetivoEvento(treinoConfirmTemp.exId,treinoConfirmTemp.resultado,treinoConfirmTemp.guardaRedes);
 }

 if(treinoConfirmTemp.tipo==="individual"){
  gravarIndividualEvento(
   treinoConfirmTemp.exId,
   treinoConfirmTemp.resultado,
   treinoConfirmTemp.guardaRedes,
   treinoConfirmTemp.jogador
  );
 }

 treinoConfirmTemp=null;
}

function gravarColetivoEvento(exId,resultado,guardaRedes){
 let emoji=resultado==="acerto"?"🟢":(resultado==="falhou"?"🔴":"🧤");
 let acao=resultado==="acerto"?"Tentativa acertada":(resultado==="falhou"?"Tentativa falhada":guardaRedes+" defendeu");

 reg.unshift({
  jogador:"Coletivo",
  periodo:"Treino",
  tempo:"",
  acao:acao,
  emoji:emoji,
  data:new Date().toLocaleString("pt-PT"),
  x:"",
  y:"",
  attackSide:"",
  exercicioId:String(exId),
  tipoRegisto:"treino",
  tipoColetivo:"coletivo",
  resultadoColetivo:resultado,
  guardaRedes:guardaRedes||""
 });

 localStorage.setItem("registos_pasteis",JSON.stringify(reg));

 let modal=$("quickModal");
 if(modal)modal.classList.remove("show");

 renderExerciciosTreino();
 atualizarTreinoResumo();
}

function addColetivoEvento(exId,resultado,guardaRedes){
 confirmFalhaColetivo(exId,resultado,guardaRedes);
}

function eventosIndividuaisDoExercicio(exId){
 return treinoEventosDoExercicio(exId).filter(r=>r.tipoIndividual==="individual");
}

function renderExercicioIndividual(ex){
 let eventos=eventosIndividuaisDoExercicio(ex.id);
 let total=eventos.length;
 let golos=eventos.filter(r=>r.resultadoIndividual==="golo").length;
 let fora=eventos.filter(r=>r.resultadoIndividual==="fora").length;
 let jamila=eventos.filter(r=>r.guardaRedes==="Jamila").length;
 let crespo=eventos.filter(r=>r.guardaRedes==="Crespo").length;
 let outro=eventos.filter(r=>r.guardaRedes==="Outro").length;
 let eficiencia=total?Math.round((golos/total)*100):0;

 return `<div class="individualBox">
  <div class="collectiveTotal">
   Tentativas individuais
   <b>${total}</b>
  </div>

  <div class="collectiveBreakdown">
   <div class="collectiveStat"><b>${golos}</b>⚽ Golos</div>
   <div class="collectiveStat"><b>${fora}</b>❌ Fora</div>
   <div class="collectiveStat"><b>${jamila}</b>🧤 Jamila</div>
   <div class="collectiveStat"><b>${crespo}</b>🧤 Crespo</div>
   <div class="collectiveStat"><b>${outro}</b>🧤 Outro</div>
   <div class="collectiveStat"><b>${eficiencia}%</b>Eficiência</div>
  </div>

  <div class="collectiveEfficiency">
   Eficiência: <b>${eficiencia}%</b>
   <div class="collectiveBar"><div class="collectiveFill" style="width:${eficiencia}%"></div></div>
  </div>

  <div class="individualArenaHint">Clica na mini arena para marcar o local do remate.</div>
  ${renderMiniArenaIndividual(ex,eventos)}

  ${renderRelatoriosExercicio(ex)}

  <label>Observações do exercício</label>
  <textarea class="trainingObs" onchange="saveObsExercicio(${ex.id},this.value)">${ex.observacoes||""}</textarea>
 </div>`;
}

function renderListaTentativasExercicio(ex){
 let eventos=treinoEventosDoExercicio(ex.id);
 if(!eventos.length)return "<div class='log'>Sem tentativas registadas.</div>";

 let html="<div class='trainingAttemptsList'>";
 eventos.forEach(r=>{
  let idx=reg.indexOf(r);
  html+=`<div class="trainingAttemptRow">
    <span>${r.emoji||acaoObj(r.acao).emoji} <b>${r.jogador||"Coletivo"}</b> · ${r.acao}</span>
    <button class="exerciseSmallBtn" onclick="openEditTreinoRemate(${idx})">✏️</button>
  </div>`;
 });
 html+="</div>";
 return html;
}

function openEditTreinoRemate(idx){
 treinoEditIndex=idx;
 let r=reg[idx];
 if(!r)return;

 let modal=$("quickModal");
 let title=$("quickTitle");
 let content=$("quickContent");

 title.innerHTML="Editar remate";

 let jogadoresBase=treinoJogadores&&treinoJogadores.length?treinoJogadores:jogadores;
 let jogadorOptions=jogadoresBase.map(j=>`<option ${r.jogador===j?"selected":""}>${j}</option>`).join("");

 content.innerHTML=`
  <label>Jogador</label>
  <select id="editTreinoJogador">
    <option ${r.jogador==="Coletivo"?"selected":""}>Coletivo</option>
    ${jogadorOptions}
  </select>

  <label>Resultado</label>
  <select id="editTreinoResultado">
    <option value="golo" ${r.resultadoIndividual==="golo"||r.resultadoColetivo==="acerto"?"selected":""}>Golo / Acerto</option>
    <option value="fora" ${r.resultadoIndividual==="fora"||r.resultadoColetivo==="falhou"?"selected":""}>Remate fora / Falhou</option>
    <option value="Jamila" ${r.guardaRedes==="Jamila"?"selected":""}>Defendido por Jamila</option>
    <option value="Crespo" ${r.guardaRedes==="Crespo"?"selected":""}>Defendido por Crespo</option>
    <option value="Outro" ${r.guardaRedes==="Outro"?"selected":""}>Defendido por outro</option>
  </select>

  <div class="confirmActions">
   <button class="green" onclick="saveEditTreinoRemate()">Guardar</button>
   <button class="danger" onclick="deleteEditTreinoRemate()">Apagar</button>
  </div>
 `;

 modal.classList.add("show");
}

function saveEditTreinoRemate(){
 if(treinoEditIndex===null)return;
 let r=reg[treinoEditIndex];
 if(!r)return;

 let jogador=$("editTreinoJogador").value;
 let resultado=$("editTreinoResultado").value;

 r.jogador=jogador;

 if(resultado==="golo"){
  r.acao=jogador==="Coletivo"?"Tentativa acertada":"Golo";
  r.emoji=jogador==="Coletivo"?"🟢":"⚽";
  r.resultadoColetivo=jogador==="Coletivo"?"acerto":"";
  r.resultadoIndividual=jogador==="Coletivo"?"":"golo";
  r.guardaRedes="";
 }

 if(resultado==="fora"){
  r.acao=jogador==="Coletivo"?"Tentativa falhada":"Remate fora";
  r.emoji="❌";
  r.resultadoColetivo=jogador==="Coletivo"?"falhou":"";
  r.resultadoIndividual=jogador==="Coletivo"?"":"fora";
  r.guardaRedes="";
 }

 if(["Jamila","Crespo","Outro"].includes(resultado)){
  r.acao=resultado+" defendeu";
  r.emoji="🧤";
  r.resultadoColetivo=jogador==="Coletivo"?"defendido":"";
  r.resultadoIndividual=jogador==="Coletivo"?"":"defendido";
  r.guardaRedes=resultado;
 }

 localStorage.setItem("registos_pasteis",JSON.stringify(reg));
 treinoEditIndex=null;
 $("quickModal").classList.remove("show");
 renderExerciciosTreino();
 atualizarTreinoResumo();
}

function deleteEditTreinoRemate(){
 if(treinoEditIndex===null)return;
 if(!confirm("Apagar este remate?"))return;

 reg.splice(treinoEditIndex,1);
 localStorage.setItem("registos_pasteis",JSON.stringify(reg));
 treinoEditIndex=null;
 $("quickModal").classList.remove("show");
 renderExerciciosTreino();
 atualizarTreinoResumo();
}

function openIndividualJogador(exId){
 let modal=$("quickModal");
 let title=$("quickTitle");
 let content=$("quickContent");

 title.innerHTML="Quem rematou?";

 let jogadoresBase=treinoJogadores&&treinoJogadores.length?treinoJogadores:jogadores;

 content.innerHTML="<div class='players'>"+
  jogadoresBase.map(j=>`<button class="pbtn" onclick="openIndividualDashboardModal()">${j}</button>`).join("")+
 "</div>";

 modal.classList.add("show");
}

function openIndividualResultado(exId,jogador){
 treinoIndividualTemp.jogador=jogador;

 let modal=$("quickModal");
 let title=$("quickTitle");
 let content=$("quickContent");

 title.innerHTML=jogador+" — resultado do remate";

 content.innerHTML=`
  <div class="grid">
   <button class="actionBtn dark" onclick="openIndividualDashboardModal()">⚽ Golo</button>
   <button class="actionBtn dark" onclick="openIndividualDashboardModal()">❌ Remate fora</button>
   <button class="actionBtn dark" onclick="openIndividualDashboardModal()">🧤 Defendido por Jamila</button>
   <button class="actionBtn dark" onclick="openIndividualDashboardModal()">🧤 Defendido por Crespo</button>
   <button class="actionBtn dark" onclick="openIndividualDashboardModal()">🧤 Defendido por outro</button>
  </div>
 `;
}

function confirmIndividualResultado(exId,resultado,guardaRedes,jogador){
 let emoji=resultado==="golo"?"⚽":(resultado==="fora"?"❌":"🧤");
 let acao=resultado==="golo"?"Golo":(resultado==="fora"?"Remate fora":"Defendido por "+guardaRedes);
 openConfirmTreinoEvento({
  tipo:"individual",
  exId:String(exId),
  resultado,
  guardaRedes:guardaRedes||"",
  jogador,
  acao,
  emoji
 });
}

function renderRelatoriosExercicio(ex){
 return `<div class="exerciseReportTabs">
  <button onclick="toggleExerciseReport('tentativas_${ex.id}')">Tentativas registadas</button>
  <button onclick="toggleExerciseReport('coletivo_${ex.id}')">Relatório coletivo</button>
  <button onclick="openIndividualDashboardModal()">Relatório individual</button>
 </div>
 <div id="tentativas_${ex.id}" class="exerciseReportBox hidden">${renderListaTentativasExercicio(ex)}</div>
 <div id="coletivo_${ex.id}" class="exerciseReportBox hidden">${renderRelatorioColetivoExercicio(ex)}</div>
 <div id="individual_${ex.id}" class="exerciseReportBox hidden">${renderRelatorioIndividualExercicio(ex)}</div>`;
}

function renderRelatorioColetivoExercicio(ex){
 let eventos=treinoEventosDoExercicio(ex.id);
 let total=eventos.length;
 let golos=eventos.filter(r=>r.resultadoIndividual==="golo"||r.resultadoColetivo==="acerto").length;
 let falhas=eventos.filter(r=>r.resultadoIndividual==="fora"||r.resultadoColetivo==="falhou").length;
 let defendidos=eventos.filter(r=>r.resultadoIndividual==="defendido"||r.resultadoColetivo==="defendido").length;
 let eficiencia=total?Math.round((golos/total)*100):0;

 return `<b>${ex.nome}</b><br>
 Tentativas: <b>${total}</b><br>
 Acertos/Golos: <b>${golos}</b><br>
 Falhas: <b>${falhas}</b><br>
 Defendidos: <b>${defendidos}</b><br>
 Eficiência: <b>${eficiencia}%</b>`;
}

function renderRelatorioIndividualExercicio(ex){
 let eventos=eventosIndividuaisDoExercicio(ex.id);
 if(!eventos.length)return "Ainda não há dados individuais neste exercício.";

 let jogadoresBase=[...new Set(eventos.map(r=>r.jogador))];

 return jogadoresBase.map(j=>{
  let ev=eventos.filter(r=>r.jogador===j);
  let total=ev.length;
  let golos=ev.filter(r=>r.resultadoIndividual==="golo").length;
  let fora=ev.filter(r=>r.resultadoIndividual==="fora").length;
  let jamila=ev.filter(r=>r.guardaRedes==="Jamila").length;
  let crespo=ev.filter(r=>r.guardaRedes==="Crespo").length;
  let outro=ev.filter(r=>r.guardaRedes==="Outro").length;
  let eficiencia=total?Math.round((golos/total)*100):0;

  return `<div class="exercisePlayerReport">
   <b>${j}</b><br>
   Tentativas: ${total}<br>
   ⚽ Golos: ${golos}<br>
   ❌ Fora: ${fora}<br>
   🧤 Jamila: ${jamila} · Crespo: ${crespo} · Outro: ${outro}<br>
   Eficiência: <b>${eficiencia}%</b>
   ${renderMiniMapaJogadorExercicio(ex.id,j)}
  </div>`;
 }).join("");
}

function renderMiniMapaJogadorExercicio(exId,jogador){
 let eventos=eventosIndividuaisDoExercicio(exId).filter(r=>r.jogador===jogador&&r.x!==""&&r.x!==undefined&&r.y!==""&&r.y!==undefined);
 if(!eventos.length)return "";
 let html=`<div class="miniPitch">`;
 eventos.forEach(r=>{
  let idx=reg.indexOf(r);
  html+=`<span class="miniEmoji" onclick="apagarAcaoPorIndice(${idx})" style="left:${r.x}%;top:${r.y}%" title="${r.acao}">${r.emoji||"•"}</span>`;
 });
 html+=`</div>`;
 return html;
}

function renderMiniArenaTreino(ex,eventos){
 let html=`<div class="trainingMiniArena" onclick="pickMiniArena(event,${ex.id})">
  <div class="trainingMiniArea leftMini"></div>
  <div class="trainingMiniArea rightMini"></div>`;

 // As ações já guardadas não ficam desenhadas no campo.
 // Ficam editáveis na lista de ações do exercício.

 if(String(treinoAcaoTemp.exercicioId)===String(ex.id)&&treinoAcaoTemp.x&&treinoAcaoTemp.y){
  html+=`<span class="trainingTempPoint" style="left:${treinoAcaoTemp.x}%;top:${treinoAcaoTemp.y}%"></span>`;
 }

 html+=`</div>`;
 return html;
}

function addTreinoActionComPonto(exId,acao){
 let obj=acaoObj(acao);

 reg.unshift({
  jogador:"Treino",
  periodo:"Treino",
  tempo:"",
  acao:acao,
  emoji:obj.emoji,
  data:new Date().toLocaleString("pt-PT"),
  x:treinoAcaoTemp.x,
  y:treinoAcaoTemp.y,
  attackSide:"",
  exercicioId:String(exId),
  tipoRegisto:"treino"
 });

 localStorage.setItem("registos_pasteis",JSON.stringify(reg));
 treinoAcaoTemp={exercicioId:null,x:null,y:null};
 $("quickModal").classList.remove("show");
 renderExerciciosTreino();
 atualizarTreinoResumo();
}

function addTreinoActionSemPonto(exId,acao){
 let obj=acaoObj(acao);

 reg.unshift({
  jogador:"Treino",
  periodo:"Treino",
  tempo:"",
  acao:acao,
  emoji:obj.emoji,
  data:new Date().toLocaleString("pt-PT"),
  x:"",
  y:"",
  attackSide:"",
  exercicioId:String(exId),
  tipoRegisto:"treino"
 });

 localStorage.setItem("registos_pasteis",JSON.stringify(reg));
 renderExerciciosTreino();
 atualizarTreinoResumo();
}

function saveObsExercicio(exId,valor){
 let ex=exerciciosTreino.find(e=>String(e.id)===String(exId));
 if(!ex)return;
 ex.observacoes=valor;
 localStorage.setItem("exercicios_treino_pasteis",JSON.stringify(exerciciosTreino));
}

function exportCSVTreino(){
 let nome=localStorage.getItem("nome_treino_pasteis")||($("treinoNome")?.value)||"Treino";
 let data=localStorage.getItem("data_treino_pasteis")||($("treinoData")?.value)||"";
 let csv="Treino,Data,Exercicio,Tipo,Formato,Intensidade,Duracao,Acao,Emoji,ResultadoColetivo,ResultadoIndividual,GuardaRedes,X,Y,DataRegisto,Observacoes\n";

 exerciciosTreino.forEach(ex=>{
  let eventos=treinoEventosDoExercicio(ex.id);
  if(!eventos.length){
   csv+=`"${nome}","${data}","${ex.nome}","${ex.tipo}","${ex.formato}","${ex.intensidade}","${ex.duracao||""}","","","","","","","","${ex.observacoes||""}"\n`;
  }else{
   eventos.forEach(r=>{
    csv+=`"${nome}","${data}","${ex.nome}","${ex.tipo}","${ex.formato}","${ex.intensidade}","${ex.duracao||""}","${r.acao}","${r.emoji||acaoObj(r.acao).emoji}","${r.resultadoColetivo||""}","${r.resultadoIndividual||""}","${r.guardaRedes||""}","${r.x||""}","${r.y||""}","${r.data}","${ex.observacoes||""}"\n`;
   });
  }
 });

 let blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
 let url=URL.createObjectURL(blob);
 let a=document.createElement("a");
 a.href=url;
 a.download="treino_stats.csv";
 a.click();
 URL.revokeObjectURL(url);
}

function exportPDFTreino(){
 let nome=localStorage.getItem("nome_treino_pasteis")||($("treinoNome")?.value)||"Treino";
 let data=localStorage.getItem("data_treino_pasteis")||($("treinoData")?.value)||"";
 let objetivo=localStorage.getItem("objetivo_treino_pasteis")||($("treinoObjetivo")?.value)||"";
 let win=window.open("","_blank");

 let body=`<h1>Relatório de Treino</h1>
 <h2>${nome}</h2>
 <p><b>Data:</b> ${data}</p>
 <p><b>Objetivo:</b> ${objetivo}</p>
 <p><b>Atletas presentes:</b> ${presencasTreino.length}/${treinoJogadores.length}</p>
 <p><b>Equipa técnica presente:</b> ${presencasTreinadores.length}/${treinoTreinadores.length}</p>
 <p>${presencasTreinadores.map(n=>{
   let m=treinoTreinadores.find(t=>t.nome===n);
   return m?`${m.nome} (${m.funcao})`:n;
 }).join(" · ")}</p>
 <hr>`;

 exerciciosTreino.forEach((ex,i)=>{
  let eventos=treinoEventosDoExercicio(ex.id);
  body+=`<h3>Exercício ${i+1}: ${ex.nome}</h3>
  <p>${ex.tipo} · ${ex.formato} · ${ex.intensidade} · ${ex.duracao||"-"} min</p>
  <p><b>Ações:</b> ${eventos.length}</p>
  <ul>`;
  if(ex.formato==="Coletivo"){
   let acertos=eventos.filter(r=>r.resultadoColetivo==="acerto").length;
   let falhou=eventos.filter(r=>r.resultadoColetivo==="falhou").length;
   let jamila=eventos.filter(r=>r.guardaRedes==="Jamila").length;
   let crespo=eventos.filter(r=>r.guardaRedes==="Crespo").length;
   let outro=eventos.filter(r=>r.guardaRedes==="Outro").length;
   body+=`<li>Acertos: ${acertos}</li><li>Falhou: ${falhou}</li><li>Jamila defendeu: ${jamila}</li><li>Crespo defendeu: ${crespo}</li><li>Outro defendeu: ${outro}</li>`;
  }else{
   acoes.forEach(a=>{
    let n=eventos.filter(r=>r.acao===a.nome).length;
    if(n>0)body+=`<li>${a.emoji} ${a.nome}: ${n}</li>`;
   });
  }
  body+=`</ul><p><b>Observações:</b> ${ex.observacoes||"-"}</p><hr>`;
 });

 win.document.write(`<html><head><title>Relatório Treino</title><style>body{font-family:Arial;padding:24px;color:#111}h1,h2{margin-bottom:4px}hr{margin:18px 0}
/* =====================================
STATS V2 — VISUAL PROFISSIONAL
Camada visual apenas. Não altera funcionalidades.
===================================== */
:root{
 --stats-bg:#050B16;
 --stats-bg2:#071326;
 --stats-panel:rgba(12,24,44,.78);
 --stats-panel2:rgba(255,255,255,.055);
 --stats-border:rgba(255,255,255,.10);
 --stats-border2:rgba(255,255,255,.18);
 --stats-text:#F8FAFC;
 --stats-muted:rgba(248,250,252,.68);
 --stats-red:#D71920;
 --stats-red2:#F0444C;
 --stats-gold:#F3C969;
 --stats-blue:#2F80ED;
 --stats-green:#21B26F;
 --stats-shadow:0 18px 46px rgba(0,0,0,.34);
 --stats-radius:22px;
 --stats-radius2:16px;
}
*{-webkit-tap-highlight-color:transparent}
html{background:var(--stats-bg)}
body{
 background:
  radial-gradient(circle at 16% 4%,rgba(215,25,32,.16),transparent 28%),
  radial-gradient(circle at 90% 0%,rgba(47,128,237,.10),transparent 26%),
  linear-gradient(180deg,var(--stats-bg),var(--stats-bg2) 45%,#030812)!important;
 color:var(--stats-text)!important;
 font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,Helvetica,sans-serif!important;
 letter-spacing:-.01em;
}
body:before{opacity:.035!important;filter:grayscale(1);background-size:68%!important}
.app,.trainingPage,.convocatoriaPage{max-width:540px!important;padding:12px 12px 95px!important}
.gameBrandMain,.trainingBrandMain,.convBrandMain,.landingContent h1{
 font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif!important;
 font-weight:950!important;letter-spacing:.04em!important;text-transform:none!important
}
.gameBrandMain,.trainingBrandMain,.convBrandMain{font-size:31px!important}
.gameBrandSub,.trainingBrandSub,.convBrandSub,.landingSub{
 color:var(--stats-muted)!important;letter-spacing:.12em!important;text-transform:uppercase;font-weight:750!important
}
.landingPage{
 background:
  radial-gradient(circle at 50% 22%,rgba(215,25,32,.18),transparent 26%),
  radial-gradient(circle at 50% 78%,rgba(47,128,237,.08),transparent 30%),
  linear-gradient(180deg,#050B16,#071326 55%,#030812)!important
}
.landingPage::before{opacity:.035!important;background-size:310px!important}
.landingContent{width:min(92vw,420px);padding:26px 18px}
.landingContent h1{font-size:64px!important;line-height:.92!important;margin-bottom:8px!important}
.landingSub{font-size:12px!important;margin-bottom:24px!important}
.landingVersion{color:rgba(255,255,255,.32)!important}
.enterBtn{
 width:100%!important;min-height:66px!important;border-radius:22px!important;
 border:1px solid var(--stats-border2)!important;
 background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.035))!important;
 color:var(--stats-text)!important;font-size:15px!important;letter-spacing:.12em!important;text-transform:uppercase!important;
 box-shadow:var(--stats-shadow)!important;margin-top:10px!important;
 transition:transform .15s ease,border-color .15s ease,background .15s ease!important
}
.enterBtn:hover,.enterBtn:active{
 transform:translateY(-1px);border-color:rgba(215,25,32,.65)!important;
 background:linear-gradient(180deg,rgba(215,25,32,.26),rgba(255,255,255,.045))!important;color:white!important
}
.gameHeader,.trainingHeader,.convHeader,.settingsHeader{
 background:rgba(255,255,255,.035);border:1px solid var(--stats-border);border-radius:20px;
 padding:9px 10px;box-shadow:0 10px 28px rgba(0,0,0,.18);
 backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)
}
.gameBack,.trainingBack,.convBack,.settingsBack{
 background:rgba(255,255,255,.055)!important;border:1px solid var(--stats-border)!important;
 color:var(--stats-text)!important;border-radius:14px!important;min-width:44px
}
.card,.pitchCard,.trainingCard,.convCard,.dashboardBox,.playerCard,.collectiveBox,.playerAccordion,.percentReport,.trainingExercise,.individualBox,.collectiveCounterBox,.convPreviewBox,.sessionItem,.medicalRow,.trainingPlayerRow,.coachRow,.playerStatBlock,.stat,.log{
 background:var(--stats-panel2)!important;border:1px solid var(--stats-border)!important;border-radius:var(--stats-radius2)!important;
 box-shadow:0 10px 30px rgba(0,0,0,.18)!important;color:var(--stats-text)!important
}
.card h2,.card h3,.pitchCard h3,.trainingCard h3,.convCard h3{
 margin-top:0!important;font-weight:900!important;letter-spacing:-.02em!important
}
.small{color:var(--stats-muted)!important;opacity:1!important}
input,select,textarea{
 background:rgba(255,255,255,.075)!important;border:1px solid var(--stats-border)!important;color:var(--stats-text)!important;
 border-radius:14px!important;outline:none!important;box-shadow:none!important
}
input::placeholder,textarea::placeholder{color:rgba(255,255,255,.42)!important}
label{color:rgba(255,255,255,.72);font-size:12px;text-transform:uppercase;letter-spacing:.06em;font-weight:800}
button{border-radius:15px!important;font-weight:850!important;letter-spacing:-.01em;transition:transform .12s ease,background .12s ease,border-color .12s ease!important}
button:active{transform:scale(.985)}
.dark,.trainingSecondaryBtn,.exerciseSmallBtn,.trainingModeBtn,.trainingTabs button,.trainingSubTabs button,.medicalFilter button,.presenceBtn,.pbtn,.convCheck{
 background:rgba(255,255,255,.065)!important;border:1px solid var(--stats-border)!important;color:var(--stats-text)!important
}
.red,.danger{background:linear-gradient(180deg,var(--stats-red2),var(--stats-red))!important;color:white!important;border:1px solid rgba(255,255,255,.10)!important}
.green,.trainingStartBtn,.collectiveHit{background:linear-gradient(180deg,#2ED081,#1A9F5E)!important;color:white!important;border:1px solid rgba(255,255,255,.10)!important}
.blue{background:linear-gradient(180deg,#3B8CFF,#1766D8)!important;color:white!important}
.yellow{background:linear-gradient(180deg,#FFE08A,#F3C969)!important;color:#08101F!important}
.matchBoard{
 border-radius:28px!important;border:1px solid rgba(255,255,255,.12)!important;
 background:radial-gradient(circle at 50% 0%,rgba(215,25,32,.22),transparent 24%),linear-gradient(180deg,rgba(14,29,54,.96),rgba(5,13,27,.96))!important;
 box-shadow:0 24px 64px rgba(0,0,0,.42),inset 0 0 0 1px rgba(255,255,255,.04)!important
}
.matchBoard:before{background:linear-gradient(180deg,transparent,rgba(255,255,255,.035))!important}
.matchTeam input{font-size:12px!important;letter-spacing:.08em!important;color:rgba(255,255,255,.92)!important;text-transform:uppercase}
.matchScoreline{font-size:72px!important;letter-spacing:-.07em!important}
.matchTimer{font-size:36px!important;color:var(--stats-gold)!important}
.matchGlow,.teamUnderline{background:linear-gradient(90deg,transparent,var(--stats-red),transparent)!important;box-shadow:0 0 20px rgba(215,25,32,.8)!important}
.teamUnderline.away{background:linear-gradient(90deg,transparent,var(--stats-blue),transparent)!important;box-shadow:0 0 20px rgba(47,128,237,.65)!important}
.matchControls button{background:rgba(255,255,255,.06)!important;border:1px solid rgba(255,255,255,.12)!important;color:white!important}
.matchControls button.controlActive{border-color:rgba(215,25,32,.72)!important;background:rgba(215,25,32,.18)!important}
.pitchCard{padding:13px!important}
.fieldTitleRow h3{font-size:14px!important;letter-spacing:.14em!important;text-transform:uppercase;color:rgba(255,255,255,.78)!important}
.pitch{border-radius:22px!important;border:2px solid rgba(0,87,184,.88)!important;box-shadow:0 20px 48px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.20)!important}
.attackTinyOutside{border-radius:13px!important;background:rgba(255,255,255,.08)!important;border:1px solid rgba(255,255,255,.14)!important}
.modal{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.modalContent{background:linear-gradient(180deg,#F8FAFC,#E8EDF5)!important;color:#071326!important;border-radius:26px!important;box-shadow:0 30px 90px rgba(0,0,0,.48)!important}
.modalContent h2{margin-top:0!important;letter-spacing:-.03em}
.modalContent .small{color:rgba(7,19,38,.65)!important}
.modalContent input,.modalContent select,.modalContent textarea{background:white!important;color:#071326!important;border:1px solid rgba(7,19,38,.14)!important}
.quickFlowGrid button,.players button{min-height:48px!important}
.dashboardGrid,.percentGrid{gap:8px!important}
.dashboardStat,.percentItem,.trainingExerciseStat,.collectiveStat{
 background:rgba(255,255,255,.065)!important;border:1px solid var(--stats-border)!important;border-radius:16px!important
}
.dashboardStat b,.percentItem b,.trainingExerciseStat b,.collectiveStat b{color:var(--stats-gold)!important}
.playerAccordionHeader{background:rgba(255,255,255,.07)!important;border-bottom:1px solid var(--stats-border)!important}
.convPreview{
 background:radial-gradient(circle at 50% 0%,rgba(215,25,32,.18),transparent 24%),linear-gradient(160deg,#061225,#101B31)!important;
 border:1px solid rgba(215,25,32,.44)!important;border-radius:26px!important;box-shadow:var(--stats-shadow)!important
}
.convPreviewTitle{font-size:28px!important}
.trainingTabs.verticalTabs button{min-height:54px;text-transform:uppercase;letter-spacing:.06em}
.trainingTabs button.active,.trainingSubTabs button.active,.trainingModeBtn.active,.presenceBtn.active,.convCheck.active,.pbtn.active,.pbtn.choose,.starterPick{
 background:linear-gradient(180deg,var(--stats-red2),var(--stats-red))!important;color:white!important;border-color:rgba(255,255,255,.14)!important
}
.sessionActions,.exerciseActions,.trainingPlayerActions,.medicalActions,.confirmActions{gap:8px!important}
@media(max-width:420px){
 .landingContent h1{font-size:58px!important}
 .matchBoard{border-radius:24px!important}
 .matchScoreline{font-size:62px!important}
 .matchTimer{font-size:31px!important}
 .gameBrandMain,.trainingBrandMain,.convBrandMain{font-size:28px!important}
 .players{grid-template-columns:repeat(3,1fr)!important}
}


/* =====================================
STATS V2.1 — EQUIPAMENTOS + TIPO ATLETA
Visual apenas + suporte GR/Jogadora
===================================== */
:root{
 --kit-blue:#0647A8;
 --kit-blue2:#032B73;
 --kit-gold:#D8B45B;
 --kit-yellow:#F5D02E;
 --kit-yellow2:#E2A900;
}

.playerKitCard{
 position:relative;
 display:flex;
 flex-direction:column;
 align-items:center;
 justify-content:center;
 gap:5px;
 min-height:96px;
 padding:9px 6px 8px!important;
 overflow:hidden;
}

.playerKitCard:before{
 content:"";
 width:44px;
 height:44px;
 display:block;
 background:
  linear-gradient(90deg,transparent 0 18%,rgba(255,255,255,.14) 18% 22%,transparent 22% 78%,rgba(255,255,255,.14) 78% 82%,transparent 82%),
  linear-gradient(180deg,var(--kit-blue),var(--kit-blue2));
 clip-path:polygon(18% 0,36% 0,42% 10%,58% 10%,64% 0,82% 0,100% 20%,88% 38%,82% 28%,82% 100%,18% 100%,18% 28%,12% 38%,0 20%);
 border:1px solid rgba(216,180,91,.75);
 border-radius:8px;
 box-shadow:0 10px 20px rgba(0,0,0,.28);
}

.playerKitCard.grKit:before{
 background:
  linear-gradient(90deg,transparent 0 18%,rgba(0,0,0,.14) 18% 22%,transparent 22% 78%,rgba(0,0,0,.14) 78% 82%,transparent 82%),
  linear-gradient(180deg,var(--kit-yellow),var(--kit-yellow2));
 border-color:rgba(255,255,255,.42);
}

.playerKitNumber{
 position:absolute;
 top:26px;
 left:50%;
 transform:translateX(-50%);
 font-size:20px;
 font-weight:950;
 color:white;
 text-shadow:0 2px 4px rgba(0,0,0,.55);
 letter-spacing:-.04em;
}

.playerKitCard.grKit .playerKitNumber{
 color:#101010;
 text-shadow:0 1px 0 rgba(255,255,255,.4);
}

.playerKitName{
 width:100%;
 text-align:center;
 font-size:11px;
 font-weight:850;
 line-height:1.05;
 overflow:hidden;
 text-overflow:ellipsis;
 white-space:nowrap;
}

.playerKitRole{
 font-size:9px;
 font-weight:900;
 letter-spacing:.08em;
 text-transform:uppercase;
 color:rgba(255,255,255,.55);
}

.playerKitStatus{
 width:7px;
 height:7px;
 border-radius:50%;
 background:#25D366;
 display:inline-block;
 margin-right:4px;
 box-shadow:0 0 10px rgba(37,211,102,.65);
}

.playerKitTime{
 font-size:10px;
 color:rgba(255,255,255,.70);
}

.athleteTypeBox{
 display:grid;
 grid-template-columns:1fr 1fr;
 gap:8px;
 margin-top:8px;
}

.athleteTypeBtn{
 min-height:48px;
 background:rgba(255,255,255,.065)!important;
 border:1px solid rgba(255,255,255,.12)!important;
 color:white!important;
}

.athleteTypeBtn.active{
 background:linear-gradient(180deg,#F5D02E,#E2A900)!important;
 color:#071326!important;
 border-color:rgba(255,255,255,.28)!important;
}

.athleteTypeBtn.playerActive{
 background:linear-gradient(180deg,#0B63D8,#032B73)!important;
 color:white!important;
 border-color:rgba(216,180,91,.45)!important;
}

/* Grelhas de campo/banco em cartões de equipamento */
#campoGrid.players,
#bancoGrid.players,
#startersGrid.players{
 grid-template-columns:repeat(3,1fr)!important;
 gap:8px!important;
}

#campoGrid .pbtn,
#bancoGrid .pbtn,
#startersGrid .pbtn{
 min-height:98px!important;
}

/* Cartão da jogadora ativa mais premium */
#playerCard{
 background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035))!important;
}

/* visual mais próximo do mockup nas ações */
.quickFlowGrid .actionBtn{
 min-height:60px!important;
 border-radius:16px!important;
 text-transform:uppercase;
 letter-spacing:.03em;
}


/* =====================================
STATS V2.2 — UI TIPO APP PROFISSIONAL
Transforma formato, cartões e ícones. Mantém lógica.
===================================== */
:root{
 --ui-bg:#020713;--ui-bg2:#061326;--ui-card:#071528;--ui-card2:#0B1B33;
 --ui-line:rgba(255,255,255,.13);--ui-red:#E51C2B;--ui-red2:#9D101A;
 --ui-blue:#064EA8;--ui-blue2:#032C6C;--ui-yellow:#F2C230;--ui-gold:#CFA85A;
 --ui-cyan:#18AEB6;--ui-purple:#6435A8;--ui-orange:#BF5A16;--ui-green:#198C3D;
 --ui-text:#F8FAFC;--ui-muted:rgba(248,250,252,.62);--ui-shadow:0 18px 55px rgba(0,0,0,.38);
}
.statsShell{
 max-width:none!important;width:100%!important;min-height:100vh;padding:0!important;
 display:grid;grid-template-columns:220px minmax(0,1fr);
 background:radial-gradient(circle at 58% 0%,rgba(229,28,43,.12),transparent 28%),linear-gradient(180deg,#020713,#061326 60%,#020713)!important;
}
.statsMain{width:100%;max-width:1280px;margin:0 auto;padding:26px 28px 28px;display:grid;grid-template-columns:minmax(0,1.45fr) minmax(300px,.75fr);gap:18px;}
.statsSidebar{position:sticky;top:0;height:100vh;background:linear-gradient(180deg,rgba(5,16,31,.98),rgba(2,7,19,.98));border-right:1px solid rgba(255,255,255,.10);padding:22px 12px;display:flex;flex-direction:column;gap:24px;z-index:10;}
.statsLogoBox{display:grid;grid-template-columns:64px 1fr;align-items:center;gap:12px}
.statsSidebarLogo{width:62px;height:62px;object-fit:contain;filter:drop-shadow(0 12px 20px rgba(0,0,0,.35))}
.statsLogoText{font-size:34px;font-weight:950;line-height:.9;letter-spacing:-.06em}.statsLogoText span{color:var(--ui-red)}
.statsLogoSub{margin-top:5px;color:white;font-size:12px;font-weight:900;letter-spacing:.22em}
.statsSideNav{display:flex;flex-direction:column;gap:10px}.statsSideNav button{width:100%;min-height:54px;text-align:left;padding:0 14px!important;margin:0!important;background:transparent!important;border:1px solid transparent!important;color:rgba(255,255,255,.78)!important;border-radius:14px!important;font-size:13px!important;letter-spacing:.03em}
.statsSideNav button.active,.statsSideNav button:hover{background:linear-gradient(90deg,rgba(229,28,43,.45),rgba(229,28,43,.12))!important;border-color:rgba(229,28,43,.72)!important;color:white!important}
.statsSidebarFooter{margin-top:auto;opacity:.55;text-align:center;color:white;display:flex;flex-direction:column;align-items:center;gap:4px;text-transform:uppercase;letter-spacing:.08em}
.statsSidebarFooter img{width:76px;opacity:.45;filter:grayscale(1)}.statsSidebarFooter span{font-size:11px}.statsSidebarFooter small{font-size:10px;margin-top:18px}
.statsShell>.statsMain>.gameHeader{display:none!important}
.matchBoard{grid-column:1 / -1;display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:18px;align-items:stretch;background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;overflow:visible!important}
.matchBoard:before{display:none!important}
.matchScore{padding:0!important;border-radius:18px;border:1px solid rgba(255,255,255,.13);background:linear-gradient(180deg,rgba(8,22,42,.88),rgba(4,12,24,.88))!important;box-shadow:var(--ui-shadow);min-height:128px;align-items:center!important}
.matchTeam{min-height:96px;justify-content:center!important}.matchTeam input{font-size:18px!important;letter-spacing:.02em!important;text-transform:uppercase}
.teamUnderline{display:none!important}.teamGoalBtns{position:absolute;opacity:0;pointer-events:none}
.matchCenter{gap:7px!important}.matchScoreline{font-size:62px!important;color:white!important;letter-spacing:-.08em!important}#gf{color:var(--ui-red)!important}
.matchGlow{display:none!important}.matchTimer{font-size:38px!important;color:var(--ui-red)!important;background:linear-gradient(180deg,rgba(9,25,48,.95),rgba(5,13,26,.95));border:1px solid rgba(255,255,255,.13);border-radius:18px;min-height:128px;display:flex;align-items:center;justify-content:center;width:100%}
.matchPeriodRow select{color:var(--ui-red)!important;font-size:14px!important;font-weight:950!important}
.matchControls{grid-column:1 / -1;display:grid!important;grid-template-columns:1fr 1fr 1fr 1.35fr 1.35fr!important;gap:12px!important;margin-top:0!important}
.matchControls button{min-height:58px!important;border-radius:14px!important;background:linear-gradient(180deg,rgba(11,27,51,.95),rgba(5,15,30,.95))!important;border:1px solid rgba(255,255,255,.13)!important;color:white!important;text-transform:uppercase;letter-spacing:.04em}
#subMini{background:linear-gradient(180deg,var(--ui-red),var(--ui-red2))!important;font-size:15px!important;width:100%!important}
#startMini{font-size:15px!important;width:100%!important}#startMini:after{content:" TITULARES";font-size:12px}#subMini:after{content:" SUBS";font-size:12px}
.statsMain>.pitchCard{grid-column:1}.statsMain>.card{grid-column:1 / -1}
.pitchCard{min-height:455px;padding:18px!important;border-radius:18px!important;background:linear-gradient(180deg,rgba(8,22,42,.88),rgba(4,12,24,.88))!important;border:1px solid rgba(255,255,255,.13)!important;box-shadow:var(--ui-shadow)!important}
.fieldTitleRow h3{color:var(--ui-red)!important;font-size:18px!important;letter-spacing:.04em!important}
.pitch{aspect-ratio:1.9/1!important;border-radius:14px!important;border-color:rgba(255,255,255,.65)!important;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.05),transparent 18%),linear-gradient(135deg,#DABF82,#CFA76A)!important}
.statsMain>.card{background:linear-gradient(180deg,rgba(8,22,42,.88),rgba(4,12,24,.88))!important;border-color:rgba(255,255,255,.13)!important}
.iconBadge{width:34px;height:34px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:white;font-weight:950;font-size:14px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.22),0 8px 18px rgba(0,0,0,.24);margin-right:8px}
.iconGoal{background:linear-gradient(180deg,#1DA849,#07551F)}.iconShot{background:linear-gradient(180deg,#2677D8,#073E91)}.iconAssist{background:linear-gradient(180deg,#7B45D8,#3E176E)}.iconDefense{background:linear-gradient(180deg,#E4802A,#8B3707)}.iconRecover{background:linear-gradient(180deg,#21B7BE,#0B6670)}.iconLoss{background:linear-gradient(180deg,#E14B58,#8B0E17)}.iconFail{background:linear-gradient(180deg,#B6BBC7,#4A5263)}.iconRed{background:linear-gradient(180deg,#FF3B4E,#A80E1B)}
.actionLabel{display:flex;align-items:center;justify-content:flex-start;gap:0;text-align:left}
.quickFlowGrid .actionBtn{min-height:70px!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;padding:12px 14px!important;font-size:14px!important;text-transform:uppercase;border-radius:14px!important;background:linear-gradient(180deg,rgba(11,27,51,.96),rgba(5,15,30,.96))!important;border:1px solid rgba(255,255,255,.13)!important}
.playerKitCard:before{width:54px!important;height:54px!important;background:radial-gradient(circle at 50% 9%,rgba(255,255,255,.20),transparent 10%),linear-gradient(90deg,transparent 0 13%,var(--ui-gold) 13% 18%,transparent 18% 82%,var(--ui-gold) 82% 87%,transparent 87%),linear-gradient(180deg,#0755B8,#032C70)!important;border:1px solid rgba(207,168,90,.88)!important}
.playerKitCard.grKit:before{background:radial-gradient(circle at 50% 9%,rgba(0,0,0,.18),transparent 10%),linear-gradient(90deg,transparent 0 13%,#101010 13% 18%,transparent 18% 82%,#101010 82% 87%,transparent 87%),linear-gradient(180deg,#F6D338,#E2AB05)!important;border:1px solid rgba(255,255,255,.72)!important}
.playerKitCard{background:linear-gradient(180deg,rgba(9,25,48,.96),rgba(5,13,26,.96))!important;border:1px solid rgba(255,255,255,.13)!important;border-radius:12px!important;min-height:118px!important}
.playerKitNumber{top:28px!important;font-size:23px!important}.playerKitName{font-size:12px!important}.playerKitRole{font-size:9px!important;color:#42FF7B!important}
#campoGrid.players,#bancoGrid.players,#startersGrid.players{grid-template-columns:repeat(4,1fr)!important}
#playerCard .playerKitCard{max-width:92px}.modalContent{background:linear-gradient(180deg,#F8FAFC,#DEE5EF)!important;border-radius:24px!important}
.modalContent .quickFlowGrid .actionBtn{color:#071326!important;background:white!important;border-color:rgba(7,19,38,.12)!important}
@media(max-width:760px){.statsShell{display:block}.statsSidebar{display:none}.statsMain{display:block!important;padding:12px!important}.matchBoard{display:block!important}.matchScore{margin-bottom:10px}.matchTimer{min-height:72px;margin-bottom:10px}.matchControls{grid-template-columns:1fr 1fr 1fr 1fr 1fr!important}.pitchCard{min-height:auto}#campoGrid.players,#bancoGrid.players,#startersGrid.players{grid-template-columns:repeat(3,1fr)!important}}


/* =====================================
STATS V2.3 — FORMATO DASHBOARD REAL
Reorganiza visualmente a página do jogo.
===================================== */
.statsShell{
 grid-template-columns:230px minmax(0,1fr)!important;
}
.statsMain{
 max-width:1500px!important;
 display:grid!important;
 grid-template-columns:minmax(520px,1.4fr) minmax(320px,.72fr)!important;
 gap:18px!important;
 align-content:start;
}
.statsMain>.matchBoard{
 grid-column:1 / -1!important;
 grid-row:auto!important;
}
.statsMain>.pitchCard{
 grid-column:1!important;
 grid-row:auto!important;
 min-height:auto!important;
}
.proPanel{
 background:linear-gradient(180deg,rgba(8,22,42,.92),rgba(4,12,24,.92))!important;
 border:1px solid rgba(255,255,255,.13)!important;
 border-radius:18px!important;
 box-shadow:0 18px 55px rgba(0,0,0,.28)!important;
 padding:16px!important;
 color:white!important;
}
.proPanelTitle{
 color:#ff2c3a;
 font-size:16px;
 font-weight:950;
 letter-spacing:.04em;
 text-transform:uppercase;
 margin-bottom:12px;
}
.proActionsPanel{
 grid-column:2!important;
 grid-row:2!important;
}
.proStatsPanel{
 grid-column:2!important;
 grid-row:3!important;
}
.proFieldPanel{
 grid-column:1!important;
}
.proBenchPanel{
 grid-column:1!important;
}
.proSubsPanel{
 grid-column:2!important;
}
.proIndividualCard{
 grid-column:1!important;
}
.proCollectiveCard{
 grid-column:2!important;
}
.proActionsGrid{
 display:grid;
 grid-template-columns:1fr 1fr;
 gap:10px;
}
.proActionBtn{
 min-height:82px!important;
 margin:0!important;
 padding:12px!important;
 border-radius:14px!important;
 display:flex!important;
 flex-direction:column;
 align-items:center;
 justify-content:center;
 gap:8px;
 text-transform:uppercase;
 border:1px solid rgba(255,255,255,.14)!important;
 color:white!important;
}
.proActionBtn .iconBadge{
 margin:0!important;
 width:38px;
 height:38px;
}
.proActionBtn.goal{background:linear-gradient(180deg,rgba(29,168,73,.85),rgba(7,85,31,.92))!important}
.proActionBtn.shot{background:linear-gradient(180deg,rgba(38,119,216,.85),rgba(7,62,145,.92))!important}
.proActionBtn.assist{background:linear-gradient(180deg,rgba(123,69,216,.85),rgba(62,23,110,.92))!important}
.proActionBtn.defense{background:linear-gradient(180deg,rgba(228,128,42,.85),rgba(139,55,7,.92))!important}
.proActionBtn.recover{background:linear-gradient(180deg,rgba(33,183,190,.85),rgba(11,102,112,.92))!important}
.proActionBtn.loss{background:linear-gradient(180deg,rgba(225,75,88,.85),rgba(139,14,23,.92))!important}
.proStatsGrid{
 display:grid;
 grid-template-columns:1fr 1fr 1fr;
 gap:10px;
}
.proStatTile{
 min-height:86px;
 border-radius:12px;
 border:1px solid rgba(255,255,255,.13);
 background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.025));
 padding:10px;
 display:flex;
 flex-direction:column;
 justify-content:space-between;
}
.proStatTile span{
 font-size:10px;
 text-transform:uppercase;
 color:rgba(255,255,255,.72);
 font-weight:900;
}
.proStatTile b{
 font-size:28px;
 line-height:1;
 color:white;
}
.proPlayersRow{
 display:grid;
 grid-template-columns:repeat(7,minmax(84px,1fr));
 gap:10px;
}
.proPlayerCard{
 position:relative;
 min-height:132px;
 border-radius:13px;
 border:1px solid rgba(255,255,255,.13);
 background:linear-gradient(180deg,rgba(10,27,50,.95),rgba(5,14,28,.95));
 display:flex;
 flex-direction:column;
 align-items:center;
 justify-content:center;
 gap:5px;
 padding:8px;
 overflow:hidden;
 cursor:pointer;
}
.proPlayerCard.active{
 border-color:rgba(229,28,43,.75);
 box-shadow:0 0 0 1px rgba(229,28,43,.32),0 12px 28px rgba(0,0,0,.32);
}
.proPlayerCard .playerKitCard{
 background:transparent!important;
 border:0!important;
 box-shadow:none!important;
 min-height:72px!important;
 padding:0!important;
}
.proPlayerCard .playerKitCard:before{
 width:62px!important;
 height:62px!important;
}
.proPlayerCard .playerKitNumber{
 top:23px!important;
 font-size:26px!important;
}
.proPlayerName{
 width:100%;
 text-align:center;
 font-size:12px;
 font-weight:850;
 white-space:nowrap;
 overflow:hidden;
 text-overflow:ellipsis;
}
.proPlayerMeta{
 font-size:10px;
 color:rgba(255,255,255,.70);
}
.proGreenDot{
 width:7px;height:7px;background:#21d65f;border-radius:50%;display:inline-block;margin-right:4px;
 box-shadow:0 0 10px rgba(33,214,95,.65);
}
.proSubsRow{
 display:grid;
 grid-template-columns:42px 1fr 22px 1fr 46px;
 align-items:center;
 gap:8px;
 padding:9px 10px;
 border-radius:10px;
 border:1px solid rgba(255,255,255,.11);
 background:rgba(255,255,255,.035);
 margin-bottom:7px;
 font-size:12px;
}
.proSubsRow .arrow{
 color:#32e05f;
 font-weight:950;
 text-align:center;
}
.proPrimaryMini{
 width:auto!important;
 min-height:44px!important;
 margin-top:10px!important;
 padding:0 18px!important;
 border-radius:10px!important;
 background:linear-gradient(180deg,#E51C2B,#9D101A)!important;
 color:white!important;
 text-transform:uppercase;
 font-size:12px!important;
}
.proDashboardCard{
 min-height:130px;
 display:flex;
 align-items:center;
 justify-content:space-between;
 gap:16px;
}
.proBarChart{
 width:120px;height:82px;display:flex;align-items:end;gap:8px;padding:8px;border-bottom:1px solid rgba(255,255,255,.18);
}
.proBarChart i{display:block;width:18px;background:linear-gradient(180deg,#E51C2B,#064EA8);border-radius:5px 5px 0 0}
.proBarChart i:nth-child(1){height:34px}.proBarChart i:nth-child(2){height:56px}.proBarChart i:nth-child(3){height:42px}.proBarChart i:nth-child(4){height:74px}
.proDonut{
 width:90px;height:90px;border-radius:50%;
 background:conic-gradient(#E51C2B 0 36%,#064EA8 36% 66%,#fff 66% 82%,#2b3551 82% 100%);
 position:relative;
}
.proDonut:after{
 content:"";position:absolute;inset:24px;border-radius:50%;background:#061326;
}
.legacyActiveCard{
 display:none!important;
}

/* scoreboard mais parecido com mockup */
.matchScore{
 grid-template-columns:1fr auto 1fr!important;
 padding:18px!important;
}
.matchCenter:before{
 content:"● EM JOGO";
 color:#ff2c3a;
 font-size:12px;
 font-weight:950;
 letter-spacing:.05em;
}
.matchTimer:before{
 content:"TEMPO DE JOGO";
 position:absolute;
 top:18px;
 color:#ff2c3a;
 font-size:12px;
 font-weight:950;
}
.matchTimer{
 position:relative;
 padding-top:22px;
}

/* areia e escudo subtil */
.pitch:before{
 border-color:rgba(255,255,255,.75)!important;
}
.pitch:after,.pitchQuarter{
 border-color:rgba(255,255,255,.38)!important;
}
.pitch{
 background:
  url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAYAAAE6pORyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0RUIzOThCQzkxQzJFOTExQUIwMUExNzc0NTg5RTMyQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyQzVGMzBBQzkyMTIxMUVBOTI0Qzk5N0IxNzFEMEYyNiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyQzVGMzBBQjkyMTIxMUVBOTI0Qzk5N0IxNzFEMEYyNiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhFMzA2RUQwNERDN0U5MTFBMzY3OUI1OUNGQUJFOTlCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjRFQjM5OEJDOTFDMkU5MTFBQjAxQTE3NzQ1ODlFMzJBIi8+IDwvcmRmOkRlc2NyaXB0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") center center/210px no-repeat,
  radial-gradient(circle at 50% 50%,rgba(255,255,255,.08),transparent 14%),
  linear-gradient(135deg,#DABF82,#CFA76A)!important;
 background-blend-mode:soft-light,normal,normal;
}

/* esconder elementos que poluem o formato */
.goalkeeperMarker,.attackDirectionBig{
 opacity:.11!important;
}
.card:not(.legacyActiveCard){
 border-radius:18px!important;
}

/* no telemóvel mantém formato mobile, mas agora com blocos */
@media(max-width:760px){
 .statsMain{
  display:block!important;
 }
 .proPanel{
  margin:10px 0!important;
 }
 .proActionsGrid,.proStatsGrid{
  grid-template-columns:1fr 1fr!important;
 }
 .proPlayersRow{
  grid-template-columns:repeat(3,1fr)!important;
 }
 .proIndividualCard,.proCollectiveCard{
  margin:10px 0!important;
 }
}


/* =====================================
STATS V2.4 — COMPACT DESKTOP / MENOS SCROLL
Coloca mais blocos lado a lado e reduz alturas.
===================================== */
@media(min-width:761px){
 .statsShell{
  grid-template-columns:190px minmax(0,1fr)!important;
  height:100vh!important;
  overflow:hidden!important;
 }
 .statsSidebar{
  height:100vh!important;
  padding:14px 10px!important;
  gap:14px!important;
 }
 .statsLogoBox{
  grid-template-columns:48px 1fr!important;
  gap:9px!important;
 }
 .statsSidebarLogo{
  width:48px!important;
  height:48px!important;
 }
 .statsLogoText{
  font-size:28px!important;
 }
 .statsLogoSub{
  font-size:10px!important;
 }
 .statsSideNav{
  gap:6px!important;
 }
 .statsSideNav button{
  min-height:42px!important;
  font-size:11px!important;
  padding:0 10px!important;
 }
 .statsSidebarFooter img{
  width:54px!important;
 }
 .statsSidebarFooter span,
 .statsSidebarFooter small{
  font-size:9px!important;
 }

 .statsMain{
  height:100vh!important;
  overflow:auto!important;
  max-width:none!important;
  padding:14px 16px!important;
  gap:10px!important;
  grid-template-columns:1.25fr .66fr .66fr!important;
  grid-auto-flow:dense!important;
  align-content:start!important;
 }

 .matchBoard{
  grid-column:1 / -1!important;
  grid-template-columns:1fr 180px!important;
  gap:10px!important;
 }
 .matchScore{
  min-height:92px!important;
  padding:10px!important;
 }
 .matchCenter:before{
  font-size:10px!important;
 }
 .matchScoreline{
  font-size:46px!important;
 }
 .matchTeam{
  min-height:70px!important;
 }
 .matchTeam input{
  font-size:14px!important;
 }
 .matchTimer{
  min-height:92px!important;
  font-size:30px!important;
  border-radius:14px!important;
 }
 .matchTimer:before{
  top:10px!important;
  font-size:10px!important;
 }
 .matchPeriodRow select{
  font-size:12px!important;
 }
 .matchControls{
  grid-column:1 / -1!important;
  grid-template-columns:repeat(5,1fr)!important;
  gap:8px!important;
 }
 .matchControls button{
  min-height:42px!important;
  font-size:11px!important;
  border-radius:11px!important;
 }

 .pitchCard{
  grid-column:1 / 3!important;
  min-height:0!important;
  padding:12px!important;
 }
 .fieldTitleRow h3{
  font-size:14px!important;
 }
 .pitch{
  aspect-ratio:2.15/1!important;
  max-height:330px!important;
 }

 .proActionsPanel{
  grid-column:3!important;
  grid-row:auto!important;
  padding:12px!important;
 }
 .proActionsGrid{
  grid-template-columns:1fr 1fr!important;
  gap:7px!important;
 }
 .proActionBtn{
  min-height:62px!important;
  padding:7px!important;
  font-size:10px!important;
  gap:4px!important;
 }
 .proActionBtn .iconBadge{
  width:28px!important;
  height:28px!important;
  font-size:10px!important;
 }

 .proStatsPanel{
  grid-column:3!important;
  grid-row:auto!important;
  padding:12px!important;
 }
 .proStatsGrid{
  grid-template-columns:1fr 1fr 1fr!important;
  gap:6px!important;
 }
 .proStatTile{
  min-height:58px!important;
  padding:7px!important;
 }
 .proStatTile span{
  font-size:8px!important;
 }
 .proStatTile b{
  font-size:20px!important;
 }

 .proPanel{
  padding:12px!important;
  border-radius:14px!important;
 }
 .proPanelTitle{
  font-size:13px!important;
  margin-bottom:8px!important;
 }

 .proFieldPanel{
  grid-column:1 / 3!important;
 }
 .proBenchPanel{
  grid-column:1 / 2!important;
 }
 .proSubsPanel{
  grid-column:2 / 4!important;
 }
 .proIndividualCard{
  grid-column:1 / 2!important;
 }
 .proCollectiveCard{
  grid-column:2 / 4!important;
 }

 .proPlayersRow{
  grid-template-columns:repeat(7,minmax(58px,1fr))!important;
  gap:7px!important;
 }
 .proPlayerCard{
  min-height:92px!important;
  padding:5px!important;
  border-radius:10px!important;
 }
 .proPlayerCard .playerKitCard{
  min-height:48px!important;
 }
 .proPlayerCard .playerKitCard:before{
  width:42px!important;
  height:42px!important;
 }
 .proPlayerCard .playerKitNumber{
  top:18px!important;
  font-size:19px!important;
 }
 .proPlayerName{
  font-size:9px!important;
 }
 .proPlayerMeta{
  font-size:8px!important;
 }

 .proSubsRow{
  grid-template-columns:36px 1fr 20px 1fr 42px!important;
  padding:6px 8px!important;
  margin-bottom:5px!important;
  font-size:10px!important;
 }
 .proPrimaryMini{
  min-height:34px!important;
  padding:0 12px!important;
  font-size:10px!important;
  margin-top:7px!important;
 }

 .proDashboardCard{
  min-height:90px!important;
  padding:12px!important;
 }
 .proBarChart{
  width:86px!important;
  height:56px!important;
 }
 .proBarChart i{
  width:13px!important;
 }
 .proDonut{
  width:64px!important;
  height:64px!important;
 }
 .proDonut:after{
  inset:18px!important;
 }

 .legacyActiveCard{
  display:none!important;
 }

 .card,
 .pitchCard,
 .proPanel{
  margin:0!important;
 }

 .app{
  padding-bottom:0!important;
 }
}

/* Tablets/laptops pequenos: duas colunas compactas */
@media(min-width:761px) and (max-width:1150px){
 .statsShell{
  grid-template-columns:150px minmax(0,1fr)!important;
 }
 .statsMain{
  grid-template-columns:1fr 1fr!important;
  padding:10px!important;
  gap:8px!important;
 }
 .matchBoard{
  grid-column:1 / -1!important;
  grid-template-columns:1fr!important;
 }
 .matchTimer{
  min-height:58px!important;
 }
 .pitchCard{
  grid-column:1 / -1!important;
 }
 .proActionsPanel,
 .proStatsPanel,
 .proFieldPanel,
 .proBenchPanel,
 .proSubsPanel,
 .proIndividualCard,
 .proCollectiveCard{
  grid-column:auto!important;
 }
 .proPlayersRow{
  grid-template-columns:repeat(4,1fr)!important;
 }
}


/* =====================================
STATS V2.5 — COMPACT FORÇADO
Esta camada força mesmo o layout horizontal.
===================================== */

/* O bloco principal deixa de ser coluna e passa a grelha real */
#main.statsShell{
 max-width:none!important;
 width:100vw!important;
 height:100vh!important;
 min-height:100vh!important;
 padding:0!important;
 margin:0!important;
 overflow:hidden!important;
 display:grid!important;
 grid-template-columns:170px minmax(0,1fr)!important;
}

/* Painel lateral mais estreito */
#main .statsSidebar{
 display:flex!important;
 width:170px!important;
 height:100vh!important;
 padding:12px 8px!important;
 gap:10px!important;
 overflow:hidden!important;
}

#main .statsLogoBox{
 grid-template-columns:42px 1fr!important;
 gap:8px!important;
}
#main .statsSidebarLogo{
 width:42px!important;
 height:42px!important;
}
#main .statsLogoText{
 font-size:24px!important;
}
#main .statsLogoSub{
 font-size:9px!important;
}
#main .statsSideNav{
 gap:5px!important;
}
#main .statsSideNav button{
 min-height:36px!important;
 height:36px!important;
 font-size:10px!important;
 padding:0 8px!important;
 border-radius:10px!important;
}
#main .statsSidebarFooter img{
 width:46px!important;
}
#main .statsSidebarFooter{
 font-size:9px!important;
}

/* Conteúdo ocupa o resto e divide-se em 4 colunas */
#main .statsMain{
 width:100%!important;
 height:100vh!important;
 max-width:none!important;
 overflow:auto!important;
 padding:10px!important;
 display:grid!important;
 grid-template-columns:1.1fr 1.1fr .8fr .8fr!important;
 grid-auto-rows:min-content!important;
 gap:8px!important;
 align-content:start!important;
}

/* Scoreboard compacto no topo */
#main .matchBoard{
 grid-column:1 / -1!important;
 display:grid!important;
 grid-template-columns:1fr 160px!important;
 gap:8px!important;
 margin:0!important;
 padding:0!important;
}

#main .matchScore{
 min-height:72px!important;
 height:72px!important;
 padding:6px 10px!important;
 border-radius:14px!important;
}

#main .matchTeam{
 min-height:48px!important;
 gap:4px!important;
}
#main .matchTeam input{
 font-size:12px!important;
 height:auto!important;
}
#main .matchCenter{
 gap:2px!important;
 min-width:86px!important;
}
#main .matchCenter:before{
 font-size:8px!important;
}
#main .matchScoreline{
 font-size:38px!important;
 line-height:.85!important;
}
#main .matchPeriodRow select{
 font-size:10px!important;
}
#main .matchTimer{
 min-height:72px!important;
 height:72px!important;
 font-size:26px!important;
 border-radius:14px!important;
 padding-top:18px!important;
}
#main .matchTimer:before{
 top:8px!important;
 font-size:8px!important;
}

#main .matchControls{
 grid-column:1 / -1!important;
 grid-template-columns:repeat(5,1fr)!important;
 gap:6px!important;
 margin:0!important;
}
#main .matchControls button{
 min-height:34px!important;
 height:34px!important;
 font-size:10px!important;
 padding:0 6px!important;
 border-radius:10px!important;
}

/* Arena fica grande mas baixa, ocupando duas colunas */
#main .pitchCard{
 grid-column:1 / 3!important;
 grid-row:auto!important;
 min-height:0!important;
 height:auto!important;
 padding:10px!important;
 margin:0!important;
 border-radius:14px!important;
}

#main .fieldTitleRow{
 margin-bottom:6px!important;
}
#main .fieldTitleRow h3{
 font-size:13px!important;
}
#main .attackOutsideWrap span{
 font-size:8px!important;
}
#main .attackTinyOutside{
 width:34px!important;
 height:28px!important;
 font-size:16px!important;
}

#main .pitch{
 aspect-ratio:2.25/1!important;
 max-height:260px!important;
 border-radius:12px!important;
}

/* Ações e estatísticas ficam à direita da arena */
#main .proActionsPanel{
 grid-column:3!important;
 grid-row:2!important;
 padding:10px!important;
 margin:0!important;
}
#main .proStatsPanel{
 grid-column:4!important;
 grid-row:2!important;
 padding:10px!important;
 margin:0!important;
}
#main .proPanelTitle{
 font-size:11px!important;
 margin-bottom:6px!important;
}
#main .proActionsGrid{
 grid-template-columns:1fr 1fr!important;
 gap:5px!important;
}
#main .proActionBtn{
 min-height:48px!important;
 height:48px!important;
 padding:4px!important;
 font-size:8.5px!important;
 gap:3px!important;
}
#main .proActionBtn .iconBadge{
 width:23px!important;
 height:23px!important;
 font-size:8px!important;
}
#main .proStatsGrid{
 grid-template-columns:1fr 1fr 1fr!important;
 gap:5px!important;
}
#main .proStatTile{
 min-height:46px!important;
 padding:5px!important;
}
#main .proStatTile span{
 font-size:7px!important;
}
#main .proStatTile b{
 font-size:17px!important;
}

/* Jogadoras, banco e subs na linha seguinte */
#main .proFieldPanel{
 grid-column:1 / 3!important;
 padding:10px!important;
 margin:0!important;
}
#main .proBenchPanel{
 grid-column:3!important;
 padding:10px!important;
 margin:0!important;
}
#main .proSubsPanel{
 grid-column:4!important;
 padding:10px!important;
 margin:0!important;
}

/* Cartões de jogadoras mais pequenos */
#main .proPlayersRow{
 grid-template-columns:repeat(7,minmax(48px,1fr))!important;
 gap:5px!important;
}

#main .proBenchPanel .proPlayersRow{
 grid-template-columns:repeat(3,1fr)!important;
}

#main .proPlayerCard{
 min-height:74px!important;
 height:74px!important;
 padding:4px!important;
 border-radius:9px!important;
 gap:2px!important;
}
#main .proPlayerCard .playerKitCard{
 min-height:36px!important;
 height:36px!important;
 padding:0!important;
}
#main .proPlayerCard .playerKitCard:before{
 width:34px!important;
 height:34px!important;
}
#main .proPlayerCard .playerKitNumber{
 top:14px!important;
 font-size:15px!important;
}
#main .proPlayerName{
 font-size:8px!important;
}
#main .proPlayerMeta{
 font-size:7px!important;
}

/* Substituições compactas */
#main .proSubsRow{
 grid-template-columns:30px 1fr 14px 1fr 34px!important;
 gap:4px!important;
 padding:4px 5px!important;
 margin-bottom:4px!important;
 font-size:8px!important;
 border-radius:8px!important;
}
#main .proPrimaryMini{
 min-height:28px!important;
 height:28px!important;
 font-size:8px!important;
 padding:0 10px!important;
 margin-top:5px!important;
}

/* Dashboards em baixo, lado a lado */
#main .proIndividualCard{
 grid-column:1 / 3!important;
 min-height:76px!important;
 padding:10px!important;
 margin:0!important;
}
#main .proCollectiveCard{
 grid-column:3 / 5!important;
 min-height:76px!important;
 padding:10px!important;
 margin:0!important;
}
#main .proBarChart{
 width:70px!important;
 height:44px!important;
}
#main .proBarChart i{
 width:10px!important;
}
#main .proDonut{
 width:52px!important;
 height:52px!important;
}
#main .proDonut:after{
 inset:15px!important;
}

/* Cartão antigo escondido */
#main .legacyActiveCard{
 display:none!important;
}

/* Modal substituições pode continuar normal */
#campoGrid.players,#bancoGrid.players,#startersGrid.players{
 grid-template-columns:repeat(4,1fr)!important;
}

/* Em ecrãs mesmo pequenos volta a uma coluna legível */
@media(max-width:760px){
 #main.statsShell{
  display:block!important;
  height:auto!important;
  overflow:auto!important;
 }
 #main .statsSidebar{
  display:none!important;
 }
 #main .statsMain{
  display:block!important;
  height:auto!important;
  overflow:auto!important;
  padding:8px!important;
 }
 #main .matchBoard{
  display:block!important;
 }
 #main .matchScore{
  height:auto!important;
  min-height:88px!important;
  margin-bottom:8px!important;
 }
 #main .matchTimer{
  height:60px!important;
  min-height:60px!important;
  margin-bottom:8px!important;
 }
 #main .matchControls{
  display:grid!important;
  grid-template-columns:repeat(5,1fr)!important;
 }
 #main .pitchCard,
 #main .proPanel,
 #main .proDashboardCard{
  margin:8px 0!important;
 }
 #main .proPlayersRow{
  grid-template-columns:repeat(3,1fr)!important;
 }
}


/* STATS V2.6 — SUBSTITUIÇÕES VISÍVEIS + CORES CORRIGIDAS */
.proLivePanel{grid-column:1 / 3!important;padding:12px!important;margin:0!important}
.proLivePanel .proPanelTitle{display:flex;justify-content:space-between;align-items:center}
#proLiveCount{color:#ffd24a;margin-left:auto;font-size:13px}
.proLiveList{display:flex;flex-direction:column;gap:6px}
.proLiveRow{display:grid;grid-template-columns:42px 1fr 64px;align-items:center;gap:8px;min-height:42px;padding:5px 8px;border-radius:12px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.045);color:white}
.proLiveRow.field{background:linear-gradient(90deg,rgba(25,140,61,.38),rgba(25,140,61,.12));border-color:rgba(48,220,91,.45)}
.proLiveRow.bench{background:rgba(255,255,255,.035);border-color:rgba(255,255,255,.10)}
.proLiveIcon{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:950;color:white;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.16)}
.proLiveRow.field .proLiveIcon{background:linear-gradient(180deg,#45d96f,#138b3d)}
.proLiveRow.bench .proLiveIcon{background:linear-gradient(180deg,#374151,#111827)}
.proLiveName{font-size:13px;font-weight:850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.proLiveTime{text-align:right;font-size:12px;font-weight:900;color:rgba(255,255,255,.88)}
.proSummaryBtn{width:100%!important;min-height:42px!important;margin-top:8px!important;border-radius:12px!important;font-size:13px!important;text-transform:none!important}
.proSummaryBtn.period{background:linear-gradient(180deg,rgba(255,210,74,.10),rgba(255,210,74,.035))!important;border:1px solid rgba(255,210,74,.55)!important;color:#ffd24a!important}
.proSummaryBtn.final{background:linear-gradient(180deg,rgba(47,128,237,.14),rgba(47,128,237,.04))!important;border:1px solid rgba(47,128,237,.55)!important;color:#8bb8ff!important}
@media(min-width:761px){
 #main .proLivePanel{grid-column:1!important;grid-row:auto!important}
 #main .pitchCard{grid-column:2 / 4!important}
 #main .proActionsPanel{grid-column:4!important}
 #main .proStatsPanel{grid-column:4!important}
 #main .proLiveRow{min-height:36px!important;grid-template-columns:34px 1fr 52px!important;padding:4px 6px!important}
 #main .proLiveIcon{width:28px!important;height:28px!important;border-radius:8px!important;font-size:11px!important}
 #main .proLiveName{font-size:11px!important}
 #main .proLiveTime{font-size:10px!important}
 #main .proSummaryBtn{min-height:32px!important;font-size:10px!important;margin-top:6px!important}
}
.modalContent .pbtn,.modalContent .actionBtn,.modalContent .quickFlowGrid button,.modalContent .players button{background:#e8edf5!important;color:#071326!important;border:1px solid rgba(7,19,38,.14)!important;text-shadow:none!important}
.modalContent .pbtn.active,.modalContent .pbtn.choose,.modalContent .starterPick{background:linear-gradient(180deg,#e51c2b,#9d101a)!important;color:white!important}
.modalContent .danger,.modalContent .green{color:white!important}
.modalContent h2,.modalContent h3,.modalContent h4,.modalContent label{color:#071326!important}
.modalContent .small{color:rgba(7,19,38,.70)!important}
@media(max-width:760px){
 #main .proLivePanel{margin:8px 0!important}
 #main .proLiveRow{min-height:48px;grid-template-columns:42px 1fr 62px}
 #main .proLiveName{font-size:14px}
}


/* STATS V2.8 — LIMPO SEM AÇÕES RÁPIDAS/SUBSTITUIÇÕES */
#main .proActionsPanel,
#main .proSubsPanel{
 display:none!important;
}
#main .proStatsPanel{
 grid-column:4!important;
 grid-row:auto!important;
}
#main .proStatsGrid{
 grid-template-columns:1fr 1fr!important;
}
#main .proLivePanel{
 grid-column:1!important;
}
#main .pitchCard{
 grid-column:2 / 4!important;
}
#main .proFieldPanel{
 grid-column:1 / 3!important;
}
#main .proBenchPanel{
 grid-column:3 / 5!important;
}
@media(max-width:760px){
 #main .proStatsGrid{
  grid-template-columns:1fr 1fr!important;
 }
}


/* STATS V2.9 — RESTAURAR ACESSOS IMPORTANTES */
.proTopTools{
 grid-column:1 / -1!important;
 display:flex;
 justify-content:flex-end;
 gap:8px;
 margin-bottom:-4px;
}
.proToolBtn{
 width:42px!important;
 height:42px!important;
 min-height:42px!important;
 padding:0!important;
 margin:0!important;
 border-radius:14px!important;
 background:linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.035))!important;
 border:1px solid rgba(255,255,255,.16)!important;
 color:white!important;
 font-size:18px!important;
 box-shadow:0 10px 24px rgba(0,0,0,.22)!important;
}
.proToolBtn:active{
 transform:scale(.96);
}
.statsSideNav button:nth-child(6){
 display:block!important;
}
@media(max-width:760px){
 .proTopTools{
  position:sticky;
  top:0;
  z-index:90;
  padding:8px 0;
  margin:0 0 6px 0;
  background:linear-gradient(180deg,rgba(5,11,22,.96),rgba(5,11,22,.72));
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
 }
 .proToolBtn{
  width:46px!important;
  height:46px!important;
 }
}

/* As páginas antigas continuam acessíveis e não são escondidas pela V2 */
#settingsPage,
#trainingPage,
#convocatoriaPage,
#menuPage{
 z-index:100;
}


/* =====================================
STATS V3.0 — BASE DE NAVEGAÇÃO E IDENTIDADE
- Voltar ao menu no canto esquerdo
- Roda de definições no canto direito
- Logo StatS no centro
- Treino e Jogo visualmente separados
===================================== */

.v3TopBar{
 grid-column:1 / -1!important;
 display:grid!important;
 grid-template-columns:48px 1fr 48px!important;
 align-items:center!important;
 gap:10px!important;
 margin:0 0 8px 0!important;
 padding:8px 10px!important;
 border-radius:18px!important;
 background:linear-gradient(180deg,rgba(8,22,42,.96),rgba(4,12,24,.92))!important;
 border:1px solid rgba(255,255,255,.13)!important;
 box-shadow:0 16px 38px rgba(0,0,0,.26)!important;
}

.proNavBtn{
 width:44px!important;
 height:44px!important;
 min-height:44px!important;
 padding:0!important;
 margin:0!important;
 display:flex!important;
 align-items:center!important;
 justify-content:center!important;
 border-radius:14px!important;
 background:rgba(255,255,255,.065)!important;
 border:1px solid rgba(255,255,255,.14)!important;
 color:white!important;
 font-size:22px!important;
}

.v3Brand{
 display:flex;
 align-items:center;
 justify-content:center;
 gap:10px;
 min-width:0;
}

.v3Logo{
 width:42px;
 height:42px;
 object-fit:contain;
 filter:drop-shadow(0 8px 16px rgba(0,0,0,.35));
}

.v3BrandMain{
 font-size:28px;
 font-weight:950;
 line-height:.9;
 letter-spacing:-.05em;
 color:white;
}

.v3BrandMain span{
 color:#e51c2b;
}

.v3BrandSub{
 margin-top:4px;
 color:rgba(255,255,255,.58);
 font-size:10px;
 font-weight:850;
 letter-spacing:.16em;
 text-transform:uppercase;
}

.v3MenuLogo{
 width:112px;
 height:112px;
 object-fit:contain;
 margin:0 auto 14px;
 display:block;
 filter:drop-shadow(0 18px 32px rgba(0,0,0,.35));
}

/* A roda antiga dentro do header do jogo fica escondida; a v3TopBar substitui-a */
.statsShell>.statsMain>.gameHeader{
 display:none!important;
}

/* Definições: continuam exatamente no painel antigo */
#settingsPage{
 background:
  radial-gradient(circle at 14% 0%,rgba(215,25,32,.14),transparent 25%),
  linear-gradient(180deg,#050b16,#071326)!important;
}

/* Treino: módulo separado, sem aparência de jogo */
#trainingPage{
 background:
  radial-gradient(circle at 80% 0%,rgba(47,128,237,.14),transparent 26%),
  linear-gradient(180deg,#050b16,#071326)!important;
 min-height:100vh;
}

#trainingPage .trainingHeader{
 display:flex!important;
}

#trainingPage .trainingBrandMain::after{
 content:"";
}

#trainingPage .trainingCard{
 background:linear-gradient(180deg,rgba(8,22,42,.88),rgba(4,12,24,.88))!important;
 border:1px solid rgba(255,255,255,.12)!important;
}

/* Convocatória também fica módulo próprio */
#convocatoriaPage{
 background:
  radial-gradient(circle at 50% 0%,rgba(215,25,32,.16),transparent 24%),
  linear-gradient(180deg,#050b16,#071326)!important;
 min-height:100vh;
}

/* Correção final de contraste nos popups */
.modalContent,
.modalContent *{
 text-shadow:none!important;
}

.modalContent button{
 color:#071326!important;
}

.modalContent .danger,
.modalContent .green,
.modalContent .red{
 color:white!important;
}

.modalContent .pbtn,
.modalContent .actionBtn,
.modalContent .quickFlowGrid button,
.modalContent .players button{
 background:#eef2f7!important;
 color:#071326!important;
 border:1px solid rgba(7,19,38,.14)!important;
}

.modalContent .pbtn.active,
.modalContent .pbtn.choose,
.modalContent .starterPick{
 background:linear-gradient(180deg,#e51c2b,#9d101a)!important;
 color:white!important;
}

/* Mobile: mantém barra visível no topo */
@media(max-width:760px){
 .v3TopBar{
  position:sticky;
  top:0;
  z-index:80;
  grid-template-columns:46px 1fr 46px!important;
  padding:7px 8px!important;
  margin-bottom:8px!important;
  border-radius:16px!important;
 }
 .v3Logo{
  width:36px;
  height:36px;
 }
 .v3BrandMain{
  font-size:23px;
 }
 .v3BrandSub{
  font-size:8px;
 }
 .proNavBtn{
  width:42px!important;
  height:42px!important;
  min-height:42px!important;
 }
}


/* STATS V3.1 — DEFINIÇÕES EM PÁGINA INDIVIDUAL */
.hidden,
#main.hidden,
#settingsPage.hidden,
#trainingPage.hidden,
#convocatoriaPage.hidden,
#menuPage.hidden,
#landingPage.hidden{
 display:none!important;
}

#settingsPage:not(.hidden){
 position:fixed!important;
 inset:0!important;
 z-index:99999!important;
 display:block!important;
 max-width:none!important;
 width:100vw!important;
 height:100vh!important;
 overflow:auto!important;
 padding:12px 12px 90px!important;
 margin:0!important;
 background:
  radial-gradient(circle at 16% 0%,rgba(215,25,32,.16),transparent 26%),
  linear-gradient(180deg,#050b16,#071326)!important;
}

#settingsPage:not(.hidden) .settingsHeader{
 max-width:540px!important;
 margin:0 auto 10px!important;
}

#settingsPage:not(.hidden) > .card{
 max-width:540px!important;
 margin:10px auto!important;
}

#settingsPage:not(.hidden) .settingsTitle{
 color:white!important;
}


/* STATS V3.2 — REMOVER QUADRADOS CAMPO/BANCO */
.proFieldPanel,
.proBenchPanel,
#proFieldPlayers,
#proBenchPlayers{
 display:none!important;
}


/* STATS V3.2 — REORGANIZAR ESPAÇO SEM CAMPO/BANCO */
@media(min-width:761px){
 #main .proLivePanel{
  grid-column:1!important;
 }
 #main .pitchCard{
  grid-column:2 / 4!important;
 }
 #main .proStatsPanel{
  grid-column:4!important;
 }
 #main .proIndividualCard{
  grid-column:1 / 3!important;
 }
 #main .proCollectiveCard{
  grid-column:3 / 5!important;
 }
}


/* STATS V3.3 — CORREÇÕES VISUAIS E LANDSCAPE */

/* Marcador e cronómetro a branco */
#main .matchScoreline,
#main .matchScoreline span,
#main #gc,
#main #gf{
 color:#ffffff!important;
}

#main .matchTimer,
#main #tempo{
 color:#ffffff!important;
}

/* Remover botão SUBS junto de iniciar/pausar/reset */
#main #subMini{
 display:none!important;
}

#main .matchControls{
 grid-template-columns:1fr 1fr 1fr 1fr!important;
}

/* Logo sempre visível e com o símbolo real embutido */
.v3Logo,
.statsSidebarLogo,
.v3MenuLogo,
.statsSidebarFooter img{
 object-fit:contain!important;
 opacity:1!important;
 filter:drop-shadow(0 8px 16px rgba(0,0,0,.35))!important;
}

/* Definições: corrigir branco sobre branco */
#settingsPage:not(.hidden) input,
#settingsPage:not(.hidden) select,
#settingsPage:not(.hidden) textarea,
#settingsPage:not(.hidden) #editNames input,
#settingsPage:not(.hidden) #stats select,
#settingsPage:not(.hidden) #filtroPeriodoStats{
 background:rgba(255,255,255,.08)!important;
 color:#ffffff!important;
 border:1px solid rgba(255,255,255,.20)!important;
}

#settingsPage:not(.hidden) input::placeholder,
#settingsPage:not(.hidden) textarea::placeholder{
 color:rgba(255,255,255,.45)!important;
}

#settingsPage:not(.hidden) option{
 background:#071326!important;
 color:#ffffff!important;
}

#settingsPage:not(.hidden) label,
#settingsPage:not(.hidden) .small,
#settingsPage:not(.hidden) .stat,
#settingsPage:not(.hidden) .log{
 color:#ffffff!important;
}

/* Linhas de edição dentro das definições */
#settingsPage:not(.hidden) .editRow{
 background:rgba(255,255,255,.06)!important;
 border:1px solid rgba(255,255,255,.12)!important;
 color:#ffffff!important;
}

/* Modal: corrigir contraste onde ainda apareça branco sobre branco */
.modalContent input,
.modalContent select,
.modalContent textarea{
 background:#ffffff!important;
 color:#071326!important;
 border:1px solid rgba(7,19,38,.20)!important;
}
.modalContent option{
 background:#ffffff!important;
 color:#071326!important;
}

/* LANDSCAPE: telemóvel/iPad horizontal com layout lado a lado */
@media (orientation: landscape) and (max-width:1180px){
 #main.statsShell{
  display:grid!important;
  grid-template-columns:128px minmax(0,1fr)!important;
  width:100vw!important;
  height:100vh!important;
  overflow:hidden!important;
 }

 #main .statsSidebar{
  display:flex!important;
  width:128px!important;
  height:100vh!important;
  padding:8px 6px!important;
  gap:8px!important;
  overflow:hidden!important;
 }

 #main .statsLogoBox{
  grid-template-columns:34px 1fr!important;
  gap:6px!important;
 }
 #main .statsSidebarLogo{
  width:34px!important;
  height:34px!important;
 }
 #main .statsLogoText{
  font-size:20px!important;
 }
 #main .statsLogoSub{
  font-size:7px!important;
  letter-spacing:.10em!important;
 }
 #main .statsSideNav{
  gap:4px!important;
 }
 #main .statsSideNav button{
  min-height:30px!important;
  height:30px!important;
  font-size:8px!important;
  padding:0 6px!important;
  border-radius:8px!important;
 }
 #main .statsSidebarFooter{
  display:none!important;
 }

 #main .statsMain{
  display:grid!important;
  grid-template-columns:.72fr 1.5fr .70fr!important;
  grid-auto-rows:min-content!important;
  gap:7px!important;
  height:100vh!important;
  overflow:auto!important;
  padding:7px!important;
  max-width:none!important;
  align-content:start!important;
 }

 #main .v3TopBar{
  grid-column:1 / -1!important;
  min-height:42px!important;
  height:42px!important;
  padding:4px 7px!important;
  margin:0!important;
  border-radius:12px!important;
 }
 #main .proNavBtn{
  width:34px!important;
  height:34px!important;
  min-height:34px!important;
  font-size:18px!important;
 }
 #main .v3Logo{
  width:31px!important;
  height:31px!important;
 }
 #main .v3BrandMain{
  font-size:20px!important;
 }
 #main .v3BrandSub{
  font-size:7px!important;
 }

 #main .matchBoard{
  grid-column:1 / -1!important;
  display:grid!important;
  grid-template-columns:1fr 130px!important;
  gap:7px!important;
  margin:0!important;
 }
 #main .matchScore{
  min-height:58px!important;
  height:58px!important;
  padding:5px 8px!important;
  border-radius:12px!important;
 }
 #main .matchTeam{
  min-height:42px!important;
 }
 #main .matchTeam input{
  font-size:11px!important;
 }
 #main .matchCenter{
  min-width:72px!important;
  gap:1px!important;
 }
 #main .matchCenter:before{
  font-size:7px!important;
 }
 #main .matchScoreline{
  font-size:31px!important;
 }
 #main .matchPeriodRow select{
  font-size:8px!important;
 }
 #main .matchTimer{
  min-height:58px!important;
  height:58px!important;
  font-size:22px!important;
  padding-top:16px!important;
  border-radius:12px!important;
 }
 #main .matchTimer:before{
  top:7px!important;
  font-size:7px!important;
 }
 #main .matchControls{
  grid-column:1 / -1!important;
  grid-template-columns:1fr 1fr 1fr 1fr!important;
  gap:5px!important;
 }
 #main .matchControls button{
  min-height:30px!important;
  height:30px!important;
  font-size:8px!important;
  padding:0 4px!important;
  border-radius:8px!important;
 }

 #main .proLivePanel{
  grid-column:1!important;
  grid-row:auto!important;
  padding:7px!important;
 }
 #main .proLiveRow{
  min-height:30px!important;
  grid-template-columns:26px 1fr 42px!important;
  gap:4px!important;
  padding:3px 5px!important;
  border-radius:8px!important;
 }
 #main .proLiveIcon{
  width:22px!important;
  height:22px!important;
  font-size:9px!important;
  border-radius:7px!important;
 }
 #main .proLiveName{
  font-size:9px!important;
 }
 #main .proLiveTime{
  font-size:8px!important;
 }

 #main .pitchCard{
  grid-column:2!important;
  grid-row:auto!important;
  padding:8px!important;
  min-height:0!important;
  margin:0!important;
 }
 #main .fieldTitleRow{
  margin-bottom:4px!important;
 }
 #main .fieldTitleRow h3{
  font-size:11px!important;
 }
 #main .pitch{
  aspect-ratio:2.05/1!important;
  max-height:calc(100vh - 170px)!important;
  min-height:235px!important;
 }

 #main .proStatsPanel{
  grid-column:3!important;
  grid-row:auto!important;
  padding:7px!important;
 }
 #main .proStatsGrid{
  grid-template-columns:1fr 1fr!important;
  gap:5px!important;
 }
 #main .proStatTile{
  min-height:46px!important;
  padding:5px!important;
 }
 #main .proStatTile span{
  font-size:7px!important;
 }
 #main .proStatTile b{
  font-size:17px!important;
 }

 #main .proIndividualCard{
  grid-column:1 / 2!important;
  min-height:62px!important;
  padding:8px!important;
 }
 #main .proCollectiveCard{
  grid-column:2 / 4!important;
  min-height:62px!important;
  padding:8px!important;
 }
 #main .proPanelTitle{
  font-size:10px!important;
  margin-bottom:4px!important;
 }
 #main .small{
  font-size:9px!important;
 }
 #main .proPrimaryMini{
  min-height:26px!important;
  height:26px!important;
  font-size:8px!important;
  margin-top:4px!important;
 }
}

/* iPad horizontal mais largo: arena ainda maior */
@media (orientation: landscape) and (min-width:900px) and (max-width:1366px){
 #main.statsShell{
  grid-template-columns:160px minmax(0,1fr)!important;
 }
 #main .statsMain{
  grid-template-columns:.62fr 1.7fr .64fr!important;
 }
 #main .pitch{
  min-height:330px!important;
  max-height:calc(100vh - 170px)!important;
 }
}


/* =========================================================
STATS V3.4 — LAYOUT FINAL RESPONSIVO
PC: sidebar + lista à esquerda + arena grande + dashboards à direita.
iPad horizontal: formato horizontal compacto.
Telemóvel: uma coluna limpa.
========================================================= */

/* ---------- PC / LAPTOP ---------- */
@media(min-width:1025px){
 #main.statsShell{
  display:grid!important;
  grid-template-columns:220px 1fr!important;
  width:100vw!important;
  height:100vh!important;
  overflow:hidden!important;
  background:radial-gradient(circle at 30% -10%,rgba(229,28,43,.10),transparent 35%),linear-gradient(180deg,#050A13,#02050B)!important;
 }

 #main .statsSidebar{
  display:flex!important;
  width:220px!important;
  height:100vh!important;
  padding:18px!important;
  background:linear-gradient(180deg,rgba(8,15,28,.98),rgba(3,7,14,.98))!important;
  border-right:1px solid rgba(255,255,255,.13)!important;
 }

 #main .statsLogoBox{grid-template-columns:50px 1fr!important}
 #main .statsSidebarLogo{width:46px!important;height:46px!important}
 #main .statsLogoText{font-size:34px!important}
 #main .statsLogoSub{font-size:12px!important}

 #main .statsSideNav button{
  min-height:56px!important;
  border-radius:13px!important;
  font-size:13px!important;
  font-weight:900!important;
  padding:0 14px!important;
  color:white!important;
 }

 #main .statsMain{
  height:100vh!important;
  overflow:auto!important;
  padding:22px!important;
  max-width:none!important;
  display:grid!important;
  grid-template-columns:280px minmax(560px,1fr) 300px!important;
  grid-template-rows:auto auto minmax(380px,1fr) auto!important;
  gap:14px!important;
  align-content:start!important;
 }

 #main .v3TopBar{
  grid-column:1 / -1!important;
  grid-row:1!important;
  min-height:60px!important;
  margin:0!important;
  padding:8px 14px!important;
  border-radius:16px!important;
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
 }

 #main .v3Logo{width:48px!important;height:48px!important}
 #main .v3BrandMain{font-size:36px!important}
 #main .v3BrandSub{font-size:12px!important}
 #main .proNavBtn{width:54px!important;height:54px!important;min-height:54px!important}

 #main .matchBoard{
  grid-column:1 / -1!important;
  grid-row:2!important;
  display:grid!important;
  grid-template-columns:1fr!important;
  gap:10px!important;
  margin:0!important;
 }

 #main .matchScore{
  min-height:120px!important;
  padding:12px 18px!important;
  border-radius:16px!important;
  background:linear-gradient(180deg,rgba(8,15,28,.82),rgba(4,8,16,.82))!important;
  border:1px solid rgba(255,255,255,.13)!important;
  box-shadow:0 18px 50px rgba(0,0,0,.35)!important;
 }

 #main .matchScoreline{font-size:56px!important;color:#fff!important}
 #main .matchScoreline span,#main #gc,#main #gf{color:#fff!important}

 #main .matchTimer{
  position:static!important;
  width:auto!important;
  min-height:0!important;
  height:auto!important;
  background:transparent!important;
  border:0!important;
  padding:0!important;
  font-size:22px!important;
  color:#fff!important;
 }
 #main .matchTimer:before{display:none!important}

 #main .matchControls{
  grid-column:1 / -1!important;
  grid-template-columns:1fr 1fr 1fr!important;
  gap:10px!important;
 }
 #main #startMini,#main #subMini{display:none!important}
 #main .matchControls button{min-height:58px!important;font-size:14px!important;border-radius:12px!important}

 #main .proLivePanel{
  grid-column:1!important;
  grid-row:3 / span 2!important;
  padding:14px!important;
  margin:0!important;
 }

 #main .pitchCard{
  grid-column:2!important;
  grid-row:3!important;
  padding:14px!important;
  margin:0!important;
 }

 #main .pitch{
  aspect-ratio:1.72/1!important;
  min-height:420px!important;
  max-height:540px!important;
 }

 #main .proStatsPanel{
  grid-column:2!important;
  grid-row:4!important;
  padding:14px!important;
 }

 #main .proStatsGrid{
  grid-template-columns:repeat(4,1fr)!important;
  gap:10px!important;
 }

 #main .proStatTile{min-height:88px!important}

 #main .proIndividualCard{
  grid-column:3!important;
  grid-row:3!important;
  min-height:250px!important;
 }

 #main .proCollectiveCard{
  grid-column:3!important;
  grid-row:4!important;
  min-height:250px!important;
 }

 #main .proFieldPanel,#main .proBenchPanel,#main .proActionsPanel,#main .proSubsPanel{display:none!important}
}

/* ---------- iPAD / TABLET HORIZONTAL ---------- */
@media(min-width:761px) and (max-width:1024px) and (orientation:landscape){
 #main.statsShell{
  display:grid!important;
  grid-template-columns:150px 1fr!important;
  width:100vw!important;
  height:100vh!important;
  overflow:hidden!important;
 }

 #main .statsSidebar{
  display:flex!important;
  width:150px!important;
  height:100vh!important;
  padding:10px!important;
 }

 #main .statsSideNav button{
  min-height:40px!important;
  font-size:10px!important;
  padding:0 8px!important;
 }

 #main .statsMain{
  height:100vh!important;
  overflow:auto!important;
  padding:10px!important;
  display:grid!important;
  grid-template-columns:210px minmax(420px,1fr) 210px!important;
  gap:8px!important;
  max-width:none!important;
 }

 #main .v3TopBar,#main .matchBoard{grid-column:1 / -1!important}
 #main .matchScore{min-height:82px!important;padding:8px!important}
 #main .matchScoreline{font-size:38px!important;color:#fff!important}
 #main #gc,#main #gf{color:#fff!important}

 #main .matchTimer{
  background:transparent!important;
  border:0!important;
  height:auto!important;
  min-height:0!important;
  font-size:18px!important;
  padding:0!important;
  color:white!important;
 }
 #main .matchTimer:before{display:none!important}

 #main .matchControls{grid-template-columns:1fr 1fr 1fr!important}
 #main #startMini,#main #subMini{display:none!important}

 #main .proLivePanel{grid-column:1!important}
 #main .pitchCard{grid-column:2!important}
 #main .pitch{min-height:330px!important;max-height:calc(100vh - 190px)!important;aspect-ratio:1.75/1!important}
 #main .proStatsPanel{grid-column:3!important}
 #main .proStatsGrid{grid-template-columns:1fr 1fr!important}
 #main .proIndividualCard{grid-column:1 / 2!important}
 #main .proCollectiveCard{grid-column:2 / 4!important}
}

/* ---------- TELEMÓVEL / TABLET VERTICAL ---------- */
@media(max-width:760px), (orientation:portrait) and (max-width:1024px){
 #main.statsShell{
  display:block!important;
  width:100vw!important;
  height:auto!important;
  min-height:100vh!important;
  overflow:auto!important;
  padding:0!important;
 }

 #main .statsSidebar{display:none!important}

 #main .statsMain{
  display:flex!important;
  flex-direction:column!important;
  gap:10px!important;
  height:auto!important;
  overflow:visible!important;
  padding:10px!important;
  max-width:none!important;
 }

 #main .v3TopBar{
  order:1!important;
  position:sticky!important;
  top:0!important;
  z-index:80!important;
  margin:0!important;
 }

 #main .matchBoard{
  order:2!important;
  display:flex!important;
  flex-direction:column!important;
  gap:8px!important;
  margin:0!important;
 }

 #main .matchScore{
  min-height:210px!important;
  padding:16px 10px!important;
  display:grid!important;
  grid-template-columns:1fr auto 1fr!important;
  align-items:center!important;
 }

 #main .matchScoreline{font-size:70px!important;color:#fff!important}
 #main #gc,#main #gf{color:#fff!important}
 #main .matchTeam input{font-size:14px!important}

 #main .matchTimer{
  background:transparent!important;
  border:0!important;
  min-height:0!important;
  height:auto!important;
  padding:0!important;
  font-size:26px!important;
  color:#fff!important;
 }
 #main .matchTimer:before{display:none!important}

 #main .matchControls{
  display:grid!important;
  grid-template-columns:1fr 1fr 1fr!important;
  gap:8px!important;
 }

 #main #startMini,#main #subMini{display:none!important}

 #main .proLivePanel{order:3!important;margin:0!important}
 #main .pitchCard{order:4!important;margin:0!important}
 #main .pitch{aspect-ratio:1.62/1!important;min-height:245px!important;max-height:none!important}
 #main .proStatsPanel{order:5!important;margin:0!important}
 #main .proStatsGrid{grid-template-columns:1fr 1fr!important}
 #main .proIndividualCard{order:6!important;margin:0!important}
 #main .proCollectiveCard{order:7!important;margin:0!important}
 #main .proFieldPanel,#main .proBenchPanel,#main .proActionsPanel,#main .proSubsPanel{display:none!important}
}

/* ---------- AJUSTES GERAIS ---------- */
#main .proPanel,#main .pitchCard,#main .matchScore,#main .proDashboardCard{
 background:linear-gradient(180deg,rgba(8,15,28,.88),rgba(3,7,14,.88))!important;
 border:1px solid rgba(255,255,255,.13)!important;
 box-shadow:0 18px 55px rgba(0,0,0,.32)!important;
}

#main .proPanelTitle,#main .fieldTitleRow h3{color:#ff2b37!important}


/* =========================================================
STATS V4.0 — INTERFACE FINAL PARA GITHUB
Responsiva PC/iPad/telemóvel, sidebar recolhível, minutos reais.
========================================================= */
:root{
 --v4-bg:#050A13;
 --v4-panel:#07101D;
 --v4-panel2:#0A1424;
 --v4-border:rgba(255,255,255,.13);
 --v4-red:#E51C2B;
 --v4-blue:#0D5BE1;
 --v4-green:#24CE55;
 --v4-muted:rgba(255,255,255,.68);
}

/* sidebar fechada por defeito */
#main.statsShell{
 background:radial-gradient(circle at 28% -10%,rgba(229,28,43,.10),transparent 34%),linear-gradient(180deg,#050A13,#02050B)!important;
}

#main .statsSidebar{
 transition:width .22s ease, transform .22s ease;
 overflow:hidden!important;
}

#main .v4Hamb{
 width:46px!important;
 height:46px!important;
 min-height:46px!important;
 padding:0!important;
 margin:0 0 16px 0!important;
 border-radius:12px!important;
 background:rgba(255,255,255,.08)!important;
 border:1px solid rgba(255,255,255,.16)!important;
 color:white!important;
 font-size:24px!important;
}

/* Remover itens da sidebar */
#main .statsSideNav button:nth-child(3),
#main .statsSideNav button:nth-child(5){
 display:none!important;
}

/* ---------- PC ---------- */
@media(min-width:1025px){
 #main.statsShell{
  display:grid!important;
  grid-template-columns:76px 1fr!important;
  width:100vw!important;
  height:100vh!important;
  overflow:hidden!important;
 }
 #main.sidebarOpen{
  grid-template-columns:220px 1fr!important;
 }
 #main .statsSidebar{
  display:flex!important;
  width:76px!important;
  height:100vh!important;
  padding:18px 14px!important;
  background:linear-gradient(180deg,rgba(8,15,28,.98),rgba(3,7,14,.98))!important;
  border-right:1px solid var(--v4-border)!important;
 }
 #main.sidebarOpen .statsSidebar{
  width:220px!important;
  padding:18px!important;
 }
 #main .statsLogoBox,
 #main .statsSideNav,
 #main .statsSidebarFooter{
  opacity:0;
  pointer-events:none;
  width:0;
  height:0;
  overflow:hidden;
 }
 #main.sidebarOpen .statsLogoBox,
 #main.sidebarOpen .statsSideNav,
 #main.sidebarOpen .statsSidebarFooter{
  opacity:1;
  pointer-events:auto;
  width:auto;
  height:auto;
  overflow:visible;
 }

 #main .statsMain{
  height:100vh!important;
  overflow:auto!important;
  padding:18px!important;
  max-width:none!important;
  display:grid!important;
  grid-template-columns:280px minmax(620px,1fr) 250px!important;
  grid-template-rows:auto auto minmax(410px,1fr) auto!important;
  gap:12px!important;
  align-content:start!important;
 }

 #main .v3TopBar{
  grid-column:1 / -1!important;
  grid-row:1!important;
  min-height:58px!important;
  margin:0!important;
  padding:8px 12px!important;
  border-radius:16px!important;
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
 }

 #main .v3Brand{justify-content:flex-start!important}
 #main .v3Logo{width:46px!important;height:46px!important}
 #main .v3BrandMain{font-size:34px!important}
 #main .v3BrandSub{font-size:11px!important}
 #main .proNavBtn{width:50px!important;height:50px!important;min-height:50px!important}

 #main .matchBoard{
  grid-column:1 / -1!important;
  grid-row:2!important;
  display:grid!important;
  grid-template-columns:1fr 1fr 1fr!important;
  gap:12px!important;
  align-items:center!important;
  margin:0!important;
 }
 #main .matchScore{
  grid-column:2!important;
  min-height:120px!important;
  padding:10px 16px!important;
  border-radius:16px!important;
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
 }
 #main .matchScoreline{font-size:58px!important;color:#fff!important}
 #main .matchScoreline span,#main #gc,#main #gf{color:#fff!important}
 #main .matchTimer{
  background:transparent!important;
  border:0!important;
  height:auto!important;
  min-height:0!important;
  padding:0!important;
  font-size:38px!important;
  color:#fff!important;
 }
 #main .matchTimer:before{display:none!important}
 #main .matchControls{
  grid-column:3!important;
  grid-row:1!important;
  display:grid!important;
  grid-template-columns:1fr 1fr!important;
  gap:10px!important;
  align-self:start!important;
 }
 #main .matchControls button{
  min-height:58px!important;
  font-size:13px!important;
  border-radius:12px!important;
 }
 #main #ctrl_start{grid-column:1}
 #main #ctrl_pause{grid-column:2}
 #main #ctrl_reset{grid-column:1 / 3}
 #main #startMini,#main #subMini{display:none!important}

 #main .proLivePanel{
  grid-column:1!important;
  grid-row:3 / span 2!important;
  padding:14px!important;
  margin:0!important;
 }
 #main .pitchCard{
  grid-column:2!important;
  grid-row:3!important;
  padding:14px!important;
  margin:0!important;
 }
 #main .pitch{
  aspect-ratio:1.72/1!important;
  min-height:430px!important;
  max-height:560px!important;
 }
 #main .proStatsPanel{
  grid-column:2!important;
  grid-row:4!important;
  padding:14px!important;
 }
 #main .proStatsGrid{
  grid-template-columns:repeat(5,1fr)!important;
  gap:10px!important;
 }
 #main .proStatTile{
  min-height:92px!important;
 }
 #main .proStatTile span{
  min-height:26px!important;
  display:block!important;
  line-height:1.15!important;
 }

 #main .proIndividualCard{
  grid-column:3!important;
  grid-row:3!important;
  min-height:260px!important;
  padding:14px!important;
 }
 #main .proCollectiveCard{
  display:none!important;
 }
 #main .v4HeatMapCard{
  grid-column:3!important;
  grid-row:4!important;
  min-height:260px!important;
  padding:14px!important;
 }

 #main .proFieldPanel,#main .proBenchPanel,#main .proActionsPanel,#main .proSubsPanel{
  display:none!important;
 }
}

/* ---------- iPad / horizontal ---------- */
@media(min-width:761px) and (max-width:1024px) and (orientation:landscape){
 #main.statsShell{
  display:grid!important;
  grid-template-columns:62px 1fr!important;
  height:100vh!important;
  overflow:hidden!important;
 }
 #main.sidebarOpen{
  grid-template-columns:180px 1fr!important;
 }
 #main .statsSidebar{
  display:flex!important;
  width:62px!important;
  height:100vh!important;
  padding:8px!important;
 }
 #main.sidebarOpen .statsSidebar{width:180px!important}
 #main .statsLogoBox,#main .statsSideNav,#main .statsSidebarFooter{display:none!important}
 #main.sidebarOpen .statsLogoBox,#main.sidebarOpen .statsSideNav{display:grid!important}

 #main .statsMain{
  height:100vh!important;
  overflow:auto!important;
  padding:8px!important;
  display:grid!important;
  grid-template-columns:210px minmax(420px,1fr) 210px!important;
  gap:8px!important;
  max-width:none!important;
 }
 #main .v3TopBar,#main .matchBoard{grid-column:1 / -1!important}
 #main .matchBoard{grid-template-columns:1fr 1fr 1fr!important}
 #main .matchScore{grid-column:2!important;min-height:76px!important;background:transparent!important;border:0!important;box-shadow:none!important}
 #main .matchScoreline{font-size:38px!important;color:#fff!important}
 #main #gc,#main #gf{color:#fff!important}
 #main .matchTimer{background:transparent!important;border:0!important;color:#fff!important;font-size:20px!important;height:auto!important;min-height:0!important;padding:0!important}
 #main .matchTimer:before{display:none!important}
 #main .matchControls{grid-column:3!important;grid-template-columns:1fr 1fr!important}
 #main #startMini,#main #subMini{display:none!important}
 #main .proLivePanel{grid-column:1!important}
 #main .pitchCard{grid-column:2!important}
 #main .pitch{min-height:330px!important;max-height:calc(100vh - 170px)!important;aspect-ratio:1.75/1!important}
 #main .proStatsPanel{grid-column:2!important}
 #main .proStatsGrid{grid-template-columns:repeat(5,1fr)!important}
 #main .proIndividualCard{grid-column:3!important}
 #main .v4HeatMapCard{grid-column:3!important}
 #main .proCollectiveCard,#main .proFieldPanel,#main .proBenchPanel,#main .proActionsPanel,#main .proSubsPanel{display:none!important}
}

/* ---------- Telemóvel / vertical ---------- */
@media(max-width:760px), (orientation:portrait) and (max-width:1024px){
 #main.statsShell{
  display:block!important;
  width:100vw!important;
  min-height:100vh!important;
  height:auto!important;
  overflow:auto!important;
  padding:0!important;
 }
 #main .statsSidebar{
  position:fixed!important;
  left:0!important;
  top:0!important;
  bottom:0!important;
  width:74px!important;
  z-index:100!important;
  transform:translateX(-74px);
  display:flex!important;
  padding:10px!important;
 }
 #main.sidebarOpen .statsSidebar{
  transform:translateX(0);
  width:210px!important;
 }
 #main .statsLogoBox,#main .statsSideNav,#main .statsSidebarFooter{display:none!important}
 #main.sidebarOpen .statsLogoBox,#main.sidebarOpen .statsSideNav{display:grid!important}
 #main .v4Hamb{
  position:fixed!important;
  left:10px!important;
  top:10px!important;
  z-index:120!important;
 }

 #main .statsMain{
  display:flex!important;
  flex-direction:column!important;
  gap:10px!important;
  padding:10px!important;
  max-width:none!important;
 }
 #main .v3TopBar{
  order:1!important;
  padding-left:58px!important;
  position:sticky!important;
  top:0!important;
  z-index:80!important;
 }
 #main .matchBoard{order:2!important;display:flex!important;flex-direction:column!important;gap:8px!important}
 #main .matchScore{min-height:185px!important;background:linear-gradient(180deg,rgba(8,15,28,.88),rgba(3,7,14,.88))!important}
 #main .matchScoreline{font-size:64px!important;color:#fff!important}
 #main #gc,#main #gf{color:#fff!important}
 #main .matchTimer{background:transparent!important;border:0!important;color:#fff!important;font-size:28px!important;height:auto!important;min-height:0!important;padding:0!important}
 #main .matchTimer:before{display:none!important}
 #main .matchControls{grid-template-columns:1fr 1fr 1fr!important;gap:8px!important}
 #main #startMini,#main #subMini{display:none!important}
 #main .proLivePanel{order:3!important}
 #main .pitchCard{order:4!important}
 #main .pitch{min-height:250px!important;aspect-ratio:1.62/1!important}
 #main .proStatsPanel{order:5!important}
 #main .proStatsGrid{grid-template-columns:1fr 1fr!important}
 #main .proIndividualCard{order:6!important}
 #main .v4HeatMapCard{order:7!important}
 #main .proCollectiveCard,#main .proFieldPanel,#main .proBenchPanel,#main .proActionsPanel,#main .proSubsPanel{display:none!important}
}

/* Campo: seta por baixo do símbolo */
#main .attackDirectionBig{
 top:58%!important;
 align-items:flex-end!important;
 padding-bottom:18px!important;
 opacity:.30!important;
 z-index:3!important;
}
#main .pitch:before,#main .pitch:after,#main .pitchQuarter,.area{
 z-index:4!important;
}
#main .mapEmoji,.tempPoint{
 z-index:10!important;
}

/* Heat map reservado */
.v4HeatMapPlaceholder{
 width:100%;
 aspect-ratio:1.45/1;
 border-radius:12px;
 overflow:hidden;
 border:1px solid rgba(255,255,255,.16);
 background:#071326;
}
.v4HeatPitch{
 position:relative;
 width:100%;
 height:100%;
 background:
  radial-gradient(circle at 45% 55%,rgba(229,28,43,.95),transparent 14%),
  radial-gradient(circle at 35% 44%,rgba(255,210,36,.88),transparent 16%),
  radial-gradient(circle at 62% 39%,rgba(36,206,85,.75),transparent 18%),
  radial-gradient(circle at 54% 70%,rgba(13,91,225,.55),transparent 20%),
  linear-gradient(180deg,#06235B,#061326);
}
.v4HeatPitch:before{
 content:"";
 position:absolute;
 inset:8%;
 border:1px solid rgba(255,255,255,.75);
}
.v4HeatPitch:after{
 content:"";
 position:absolute;
 left:50%;
 top:8%;
 bottom:8%;
 border-left:1px solid rgba(255,255,255,.55);
}
.v4HeatPitch span:nth-child(1){position:absolute;left:8%;top:38%;width:10%;height:24%;border:1px solid rgba(255,255,255,.7)}
.v4HeatPitch span:nth-child(2){position:absolute;right:8%;top:38%;width:10%;height:24%;border:1px solid rgba(255,255,255,.7)}
.v4HeatPitch span:nth-child(3){position:absolute;left:50%;top:50%;width:20%;height:36%;transform:translate(-50%,-50%);border:1px solid rgba(255,255,255,.45);border-radius:50%}
.v4HeatPitch span:nth-child(4){display:none}

/* Botões minutos */
.v4MinuteTabs{
 display:grid;
 grid-template-columns:1fr 1fr;
 gap:8px;
 margin-top:12px;
}
.v4MinuteTabs button{
 min-height:40px!important;
 border-radius:10px!important;
 margin:0!important;
 padding:0 8px!important;
 background:transparent!important;
 border:1px solid rgba(255,255,255,.18)!important;
 color:white!important;
 font-size:12px!important;
 text-transform:uppercase;
}
.v4MinuteTabs button.active{
 background:linear-gradient(180deg,#E51C2B,#9D101A)!important;
 border-color:rgba(229,28,43,.75)!important;
}

/* Correções gerais */
#main .proPanel,#main .pitchCard,#main .matchScore,#main .proDashboardCard{
 background:linear-gradient(180deg,rgba(8,15,28,.88),rgba(3,7,14,.88))!important;
 border:1px solid rgba(255,255,255,.13)!important;
 box-shadow:0 18px 55px rgba(0,0,0,.32)!important;
}
#main .proPanelTitle,#main .fieldTitleRow h3{color:#ff2b37!important}
#main .proStatTile span{text-align:center!important}
#main .proStatTile b{text-align:center!important}


/* =========================================================
STATS V4.1 — ECRÃ ÚNICO, SEM SCROLL PRINCIPAL
========================================================= */

/* base: a página do jogo cabe no viewport */
#main.statsShell{
 width:100vw!important;
 height:100dvh!important;
 min-height:100dvh!important;
 overflow:hidden!important;
}

#main .statsMain{
 height:100dvh!important;
 overflow:hidden!important;
}

/* botão menu recolhível não bloqueia cliques */
#main .v4Hamb{
 pointer-events:auto!important;
}

/* botões dos minutos sempre clicáveis */
#main .v4MinuteTabs,
#main .v4MinuteTabs button,
#main .proLiveRow{
 pointer-events:auto!important;
 position:relative!important;
 z-index:20!important;
}

/* retirar dashboards/heatmap do ecrã de jogo para ganhar espaço */
#main .proIndividualCard,
#main .proCollectiveCard,
#main .v4HeatMapCard{
 display:none!important;
}

/* marcador: tudo dentro do mesmo quadrado */
#main .matchBoard{
 background:linear-gradient(180deg,rgba(8,15,28,.94),rgba(3,7,14,.94))!important;
 border:1px solid rgba(255,255,255,.13)!important;
 border-radius:18px!important;
 box-shadow:0 18px 55px rgba(0,0,0,.32)!important;
 padding:10px!important;
}

#main .matchScore{
 background:transparent!important;
 border:0!important;
 box-shadow:none!important;
}

#main .matchControls{
 background:transparent!important;
}

/* o período nunca sai do quadrado */
#main .matchPeriodRow{
 width:100%!important;
 justify-content:center!important;
 overflow:hidden!important;
}

#main .matchPeriodRow select,
#main #periodo{
 max-width:150px!important;
 width:auto!important;
 overflow:hidden!important;
 text-overflow:ellipsis!important;
 white-space:nowrap!important;
 color:rgba(255,255,255,.82)!important;
 background:transparent!important;
}

/* PC/laptop: tudo em 1 ecrã */
@media(min-width:1025px){
 #main.statsShell{
  display:grid!important;
  grid-template-columns:66px minmax(0,1fr)!important;
 }
 #main.sidebarOpen{
  grid-template-columns:190px minmax(0,1fr)!important;
 }

 #main .statsSidebar{
  width:66px!important;
  height:100dvh!important;
  padding:10px!important;
 }
 #main.sidebarOpen .statsSidebar{
  width:190px!important;
 }

 #main .statsMain{
  display:grid!important;
  grid-template-columns:245px minmax(560px,1fr) 210px!important;
  grid-template-rows:50px 122px minmax(0,1fr) 76px!important;
  gap:8px!important;
  padding:8px!important;
  align-content:stretch!important;
 }

 #main .v3TopBar{
  grid-column:1 / -1!important;
  grid-row:1!important;
  min-height:50px!important;
  height:50px!important;
  padding:4px 8px!important;
  margin:0!important;
 }

 #main .v3Logo{width:34px!important;height:34px!important}
 #main .v3BrandMain{font-size:24px!important}
 #main .v3BrandSub{font-size:8px!important}
 #main .proNavBtn{width:38px!important;height:38px!important;min-height:38px!important}

 #main .matchBoard{
  grid-column:1 / -1!important;
  grid-row:2!important;
  display:grid!important;
  grid-template-columns:1fr 330px!important;
  gap:10px!important;
  height:122px!important;
  margin:0!important;
 }

 #main .matchScore{
  min-height:0!important;
  height:100%!important;
  padding:0!important;
  display:grid!important;
  grid-template-columns:1fr auto 1fr!important;
  align-items:center!important;
 }

 #main .matchTeam{min-height:0!important}
 #main .matchTeam input{font-size:15px!important}
 #main .matchScoreline{font-size:58px!important;line-height:.9!important;color:#fff!important}
 #main #gc,#main #gf,#main .matchScoreline span{color:#fff!important}
 #main .matchTimer{
  font-size:24px!important;
  color:#fff!important;
  background:transparent!important;
  border:0!important;
  min-height:0!important;
  height:auto!important;
  padding:0!important;
 }
 #main .matchTimer:before{display:none!important}

 #main .matchControls{
  grid-column:2!important;
  display:grid!important;
  grid-template-columns:1fr 1fr 1fr!important;
  gap:6px!important;
  align-content:center!important;
  margin:0!important;
 }

 #main .matchControls button{
  min-height:44px!important;
  height:44px!important;
  font-size:11px!important;
  padding:0 8px!important;
  border-radius:11px!important;
 }

 #main #startMini,#main #subMini{
  display:none!important;
 }

 #main .proLivePanel{
  grid-column:1!important;
  grid-row:3 / 5!important;
  overflow:hidden!important;
  padding:9px!important;
  margin:0!important;
 }

 #main .proLiveList{
  max-height:calc(100dvh - 282px)!important;
  overflow:auto!important;
  padding-right:2px!important;
 }

 #main .proLiveRow{
  min-height:34px!important;
  grid-template-columns:30px 1fr 52px!important;
  padding:3px 5px!important;
  margin:0!important;
 }
 #main .proLiveIcon{width:24px!important;height:24px!important;font-size:9px!important}
 #main .proLiveName{font-size:10px!important}
 #main .proLiveTime{font-size:9px!important}
 #main .v4MinuteTabs{gap:5px!important;margin-top:6px!important}
 #main .v4MinuteTabs button{min-height:28px!important;font-size:9px!important}

 #main .pitchCard{
  grid-column:2!important;
  grid-row:3!important;
  overflow:hidden!important;
  padding:9px!important;
  margin:0!important;
 }
 #main .fieldTitleRow{margin-bottom:5px!important}
 #main .fieldTitleRow h3{font-size:12px!important}
 #main .pitch{
  width:100%!important;
  height:calc(100dvh - 276px)!important;
  min-height:340px!important;
  max-height:none!important;
  aspect-ratio:auto!important;
 }

 #main .proStatsPanel{
  grid-column:2 / 4!important;
  grid-row:4!important;
  padding:8px!important;
  margin:0!important;
  overflow:hidden!important;
 }
 #main .proStatsGrid{
  grid-template-columns:repeat(5,1fr)!important;
  gap:6px!important;
 }
 #main .proStatTile{
  min-height:54px!important;
  height:54px!important;
  padding:5px!important;
 }
 #main .proStatTile span{
  font-size:8px!important;
  min-height:18px!important;
  line-height:1.1!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
 }
 #main .proStatTile b{
  font-size:20px!important;
  line-height:1!important;
 }

 /* coluna direita só reservada para futuramente, não ocupa conteúdo agora */
}

/* iPad horizontal: layout fixo sem scroll horizontal */
@media(min-width:761px) and (max-width:1024px) and (orientation:landscape){
 #main.statsShell{
  display:grid!important;
  grid-template-columns:58px minmax(0,1fr)!important;
  height:100dvh!important;
  overflow:hidden!important;
 }
 #main.sidebarOpen{
  grid-template-columns:165px minmax(0,1fr)!important;
 }

 #main .statsSidebar{
  display:flex!important;
  width:58px!important;
  height:100dvh!important;
  padding:7px!important;
 }
 #main.sidebarOpen .statsSidebar{width:165px!important}

 #main .statsMain{
  height:100dvh!important;
  overflow:hidden!important;
  display:grid!important;
  grid-template-columns:205px minmax(430px,1fr)!important;
  grid-template-rows:46px 102px minmax(0,1fr) 70px!important;
  gap:7px!important;
  padding:7px!important;
 }

 #main .v3TopBar{
  grid-column:1 / -1!important;
  grid-row:1!important;
  height:46px!important;
  min-height:46px!important;
  padding:4px 7px!important;
 }

 #main .v3Logo{width:31px!important;height:31px!important}
 #main .v3BrandMain{font-size:21px!important}
 #main .v3BrandSub{font-size:7px!important}
 #main .proNavBtn{width:34px!important;height:34px!important;min-height:34px!important}

 #main .matchBoard{
  grid-column:1 / -1!important;
  grid-row:2!important;
  height:102px!important;
  display:grid!important;
  grid-template-columns:1fr 260px!important;
  gap:7px!important;
  margin:0!important;
  padding:7px!important;
 }

 #main .matchScore{
  min-height:0!important;
  height:100%!important;
  padding:0!important;
 }
 #main .matchScoreline{font-size:43px!important;color:#fff!important}
 #main #gc,#main #gf,#main .matchScoreline span{color:#fff!important}
 #main .matchTeam input{font-size:11px!important}
 #main .matchTimer{font-size:19px!important;color:#fff!important;background:transparent!important;border:0!important;padding:0!important;min-height:0!important;height:auto!important}
 #main .matchTimer:before{display:none!important}
 #main #periodo{font-size:8px!important;max-width:112px!important}

 #main .matchControls{
  grid-column:2!important;
  grid-template-columns:1fr 1fr 1fr!important;
  gap:5px!important;
  align-content:center!important;
  margin:0!important;
 }
 #main .matchControls button{height:34px!important;min-height:34px!important;font-size:8px!important;padding:0 4px!important}
 #main #startMini,#main #subMini{display:none!important}

 #main .proLivePanel{
  grid-column:1!important;
  grid-row:3 / 5!important;
  padding:7px!important;
  overflow:hidden!important;
 }
 #main .proLiveList{max-height:calc(100dvh - 250px)!important;overflow:auto!important}
 #main .proLiveRow{min-height:30px!important;grid-template-columns:26px 1fr 42px!important;padding:3px 4px!important}
 #main .proLiveIcon{width:22px!important;height:22px!important;font-size:8px!important}
 #main .proLiveName{font-size:9px!important}
 #main .proLiveTime{font-size:8px!important}
 #main .v4MinuteTabs button{min-height:26px!important;font-size:8px!important}

 #main .pitchCard{
  grid-column:2!important;
  grid-row:3!important;
  padding:7px!important;
  overflow:hidden!important;
 }
 #main .pitch{
  height:calc(100dvh - 236px)!important;
  min-height:300px!important;
  aspect-ratio:auto!important;
 }

 #main .proStatsPanel{
  grid-column:2!important;
  grid-row:4!important;
  padding:7px!important;
  overflow:hidden!important;
 }
 #main .proStatsGrid{grid-template-columns:repeat(5,1fr)!important;gap:5px!important}
 #main .proStatTile{height:50px!important;min-height:50px!important;padding:4px!important}
 #main .proStatTile span{font-size:7px!important;line-height:1.05!important}
 #main .proStatTile b{font-size:17px!important}

 #main .proIndividualCard,#main .proCollectiveCard,#main .v4HeatMapCard,#main .proFieldPanel,#main .proBenchPanel,#main .proActionsPanel,#main .proSubsPanel{
  display:none!important;
 }
}

/* telemóvel vertical: sem scroll horizontal, só o mínimo vertical */
@media(max-width:760px), (orientation:portrait) and (max-width:1024px){
 #main.statsShell{
  width:100vw!important;
  overflow-x:hidden!important;
 }
 #main .statsMain{
  width:100%!important;
  overflow-x:hidden!important;
  padding:8px!important;
 }
 #main .matchScoreline{font-size:58px!important;color:#fff!important}
 #main #gc,#main #gf,#main .matchScoreline span{color:#fff!important}
 #main .matchTimer{color:#fff!important}
 #main #startMini,#main #subMini{display:none!important}
 #main .proIndividualCard,#main .proCollectiveCard,#main .v4HeatMapCard{
  display:none!important;
 }
 #main .proStatsGrid{
  grid-template-columns:1fr 1fr!important;
 }
 #main .v4MinuteTabs button{
  min-height:34px!important;
 }
}

/* clique nos minutos e jogadores */
#main .proLiveRow,
#main .v4MinuteTabs,
#main .v4MinuteTabs button{
 pointer-events:auto!important;
 cursor:pointer!important;
}

/* seta no campo: por baixo do símbolo */
#main .attackDirectionBig{
 top:auto!important;
 bottom:12px!important;
 align-items:flex-end!important;
 justify-content:center!important;
 opacity:.22!important;
 z-index:3!important;
 height:auto!important;
 font-size:82px!important;
}

/* período sempre visível dentro do bloco */
#main .matchPeriodRow{
 overflow:hidden!important;
}
#main #periodo{
 overflow:hidden!important;
 text-overflow:ellipsis!important;
 white-space:nowrap!important;
 color:rgba(255,255,255,.82)!important;
}

/* estatísticas identificadas */
#main .proStatTile span{
 color:rgba(255,255,255,.78)!important;
 text-transform:uppercase!important;
 font-weight:950!important;
 text-align:center!important;
}
#main .proStatTile b{
 color:#fff!important;
 text-align:center!important;
}


/* =========================================================
STATS V4.2 — SCROLL CONTROLADO + MARCADOR CORRIGIDO
========================================================= */

/* Permitir scroll vertical, impedir scroll horizontal */
#main.statsShell{
 height:auto!important;
 min-height:100dvh!important;
 overflow-x:hidden!important;
 overflow-y:auto!important;
}
#main .statsMain{
 height:auto!important;
 min-height:100dvh!important;
 overflow-x:hidden!important;
 overflow-y:visible!important;
}

/* Marcador limpo e centrado */
#main .matchBoard{
 display:grid!important;
 grid-template-columns:1fr!important;
 background:linear-gradient(180deg,rgba(8,15,28,.94),rgba(3,7,14,.94))!important;
 border:1px solid rgba(255,255,255,.13)!important;
 border-radius:18px!important;
 box-shadow:0 18px 55px rgba(0,0,0,.32)!important;
 padding:12px!important;
 gap:10px!important;
}

#main .matchScore{
 display:grid!important;
 grid-template-columns:1fr minmax(150px,auto) 1fr!important;
 align-items:center!important;
 justify-items:center!important;
 width:100%!important;
 min-height:118px!important;
 padding:0!important;
 background:transparent!important;
 border:0!important;
 box-shadow:none!important;
}

#main .matchTeam{
 position:relative!important;
 width:100%!important;
 min-height:88px!important;
 display:flex!important;
 align-items:center!important;
 justify-content:center!important;
 text-align:center!important;
}

#main .matchTeam input{
 width:100%!important;
 max-width:240px!important;
 font-size:15px!important;
 color:#fff!important;
 text-align:center!important;
 background:transparent!important;
 border:0!important;
}

#main .matchCenter{
 min-width:150px!important;
 display:flex!important;
 flex-direction:column!important;
 align-items:center!important;
 justify-content:center!important;
 gap:6px!important;
}

#main .matchCenter:before{
 content:""!important;
 display:none!important;
}

#main .matchScoreline{
 font-size:62px!important;
 line-height:.9!important;
 color:#fff!important;
 letter-spacing:-.06em!important;
 white-space:nowrap!important;
}

#main #gc,#main #gf,#main .matchScoreline span{
 color:#fff!important;
}

#main .matchTimer{
 color:#fff!important;
 background:transparent!important;
 border:0!important;
 padding:0!important;
 height:auto!important;
 min-height:0!important;
 font-size:30px!important;
 line-height:1!important;
}

#main .matchTimer:before{
 display:none!important;
}

#main .matchPeriodRow{
 width:100%!important;
 height:auto!important;
 overflow:hidden!important;
 justify-content:center!important;
}

#main #periodo,
#main .matchPeriodRow select{
 max-width:160px!important;
 width:auto!important;
 font-size:12px!important;
 color:rgba(255,255,255,.82)!important;
 background:transparent!important;
 border:0!important;
 text-align:center!important;
 overflow:hidden!important;
 white-space:nowrap!important;
 text-overflow:ellipsis!important;
}

/* Botões dentro do bloco, sem sobreposição */
#main .matchControls{
 width:100%!important;
 display:grid!important;
 grid-template-columns:1fr 1fr 1fr!important;
 gap:8px!important;
 margin:0!important;
 align-items:center!important;
}

#main .matchControls button{
 min-height:46px!important;
 height:46px!important;
 border-radius:12px!important;
 font-size:12px!important;
 padding:0 8px!important;
}

#main #startMini,
#main #subMini{
 display:none!important;
}

/* PC: layout com scroll vertical leve, sem sobreposição */
@media(min-width:1025px){
 #main.statsShell{
  display:grid!important;
  grid-template-columns:70px minmax(0,1fr)!important;
 }
 #main.sidebarOpen{
  grid-template-columns:200px minmax(0,1fr)!important;
 }
 #main .statsSidebar{
  width:70px!important;
  height:100dvh!important;
  position:sticky!important;
  top:0!important;
 }
 #main.sidebarOpen .statsSidebar{
  width:200px!important;
 }

 #main .statsMain{
  display:grid!important;
  grid-template-columns:260px minmax(620px,1fr)!important;
  grid-template-rows:auto auto auto auto!important;
  gap:10px!important;
  padding:10px!important;
  align-content:start!important;
 }

 #main .v3TopBar{
  grid-column:1 / -1!important;
  grid-row:1!important;
  height:56px!important;
  min-height:56px!important;
  margin:0!important;
 }

 #main .matchBoard{
  grid-column:1 / -1!important;
  grid-row:2!important;
 }

 #main .proLivePanel{
  grid-column:1!important;
  grid-row:3 / 5!important;
  padding:10px!important;
  margin:0!important;
 }

 #main .proLiveList{
  max-height:520px!important;
  overflow-y:auto!important;
 }

 #main .pitchCard{
  grid-column:2!important;
  grid-row:3!important;
  padding:10px!important;
  margin:0!important;
 }

 #main .pitch{
  height:auto!important;
  min-height:430px!important;
  aspect-ratio:1.72/1!important;
  max-height:none!important;
 }

 #main .proStatsPanel{
  grid-column:2!important;
  grid-row:4!important;
  padding:10px!important;
  margin:0!important;
 }

 #main .proStatsGrid{
  grid-template-columns:repeat(5,1fr)!important;
  gap:8px!important;
 }

 #main .proStatTile{
  min-height:64px!important;
  padding:7px!important;
 }

 #main .proStatTile span{
  font-size:9px!important;
  line-height:1.1!important;
 }

 #main .proStatTile b{
  font-size:23px!important;
 }
}

/* iPad horizontal: lado a lado, scroll vertical leve */
@media(min-width:761px) and (max-width:1024px) and (orientation:landscape){
 #main.statsShell{
  display:grid!important;
  grid-template-columns:62px minmax(0,1fr)!important;
 }
 #main.sidebarOpen{
  grid-template-columns:170px minmax(0,1fr)!important;
 }
 #main .statsSidebar{
  width:62px!important;
  height:100dvh!important;
  position:sticky!important;
  top:0!important;
 }
 #main.sidebarOpen .statsSidebar{
  width:170px!important;
 }

 #main .statsMain{
  display:grid!important;
  grid-template-columns:220px minmax(470px,1fr)!important;
  grid-template-rows:auto auto auto auto!important;
  gap:8px!important;
  padding:8px!important;
 }

 #main .v3TopBar{
  grid-column:1 / -1!important;
  grid-row:1!important;
 }

 #main .matchBoard{
  grid-column:1 / -1!important;
  grid-row:2!important;
  padding:8px!important;
 }

 #main .matchScore{
  min-height:86px!important;
 }
 #main .matchScoreline{
  font-size:42px!important;
 }
 #main .matchTimer{
  font-size:19px!important;
 }

 #main .matchControls button{
  height:34px!important;
  min-height:34px!important;
  font-size:9px!important;
 }

 #main .proLivePanel{
  grid-column:1!important;
  grid-row:3 / 5!important;
  padding:8px!important;
 }

 #main .proLiveList{
  max-height:400px!important;
  overflow-y:auto!important;
 }

 #main .pitchCard{
  grid-column:2!important;
  grid-row:3!important;
  padding:8px!important;
 }

 #main .pitch{
  min-height:330px!important;
  aspect-ratio:1.72/1!important;
 }

 #main .proStatsPanel{
  grid-column:2!important;
  grid-row:4!important;
  padding:8px!important;
 }

 #main .proStatsGrid{
  grid-template-columns:repeat(5,1fr)!important;
  gap:6px!important;
 }

 #main .proStatTile{
  min-height:54px!important;
  padding:5px!important;
 }

 #main .proStatTile span{
  font-size:7px!important;
 }

 #main .proStatTile b{
  font-size:18px!important;
 }
}

/* telemóvel vertical */
@media(max-width:760px), (orientation:portrait) and (max-width:1024px){
 #main .statsMain{
  display:flex!important;
  flex-direction:column!important;
  gap:10px!important;
  padding:8px!important;
  overflow-x:hidden!important;
 }

 #main .matchBoard{
  order:2!important;
  padding:10px!important;
 }

 #main .matchScore{
  min-height:150px!important;
  grid-template-columns:1fr auto 1fr!important;
 }

 #main .matchScoreline{
  font-size:52px!important;
 }

 #main .matchTimer{
  font-size:24px!important;
 }

 #main .matchControls{
  grid-template-columns:1fr 1fr 1fr!important;
 }

 #main .proLivePanel{
  order:3!important;
 }

 #main .pitchCard{
  order:4!important;
 }

 #main .pitch{
  min-height:245px!important;
  aspect-ratio:1.62/1!important;
 }

 #main .proStatsPanel{
  order:5!important;
 }

 #main .proStatsGrid{
  grid-template-columns:1fr 1fr!important;
 }
}

/* Minutos modal */
.minutesTable{
 display:flex;
 flex-direction:column;
 gap:7px;
}
.minutesRow{
 display:grid;
 grid-template-columns:1fr auto;
 gap:10px;
 align-items:center;
 padding:9px;
 border-radius:10px;
 background:#eef2f7;
 color:#071326;
 border:1px solid rgba(7,19,38,.10);
}
.minutesRow.field{
 background:#dff8e7;
 border-color:#24ce55;
}
.minutesRow.period{
 grid-template-columns:1fr;
}
.minutesRow.period div{
 display:grid;
 grid-template-columns:1fr 1fr;
 gap:5px;
}
.minutesRow small{
 color:#071326;
}

/* Garantir clique e visibilidade */
#main .proLiveRow,
#main .v4MinuteTabs button{
 cursor:pointer!important;
 pointer-events:auto!important;
 z-index:20!important;
}

/* Remover dashboards da tela principal */
#main .proIndividualCard,
#main .proCollectiveCard,
#main .v4HeatMapCard{
 display:none!important;
}


/* =========================================================
STATS V4.3 — TOGGLE MINUTOS SEM POPUPS + LAYOUT IPAD CORRIGIDO
========================================================= */

/* Clique direto nas jogadoras: verde pausa, play começa */
#main .proLiveRow{
 cursor:pointer!important;
 pointer-events:auto!important;
}
#main .proLiveRow:active{
 transform:scale(.985);
}

/* Marcador nunca fica por cima da arena */
@media(min-width:761px) and (max-width:1180px) and (orientation:landscape){
 #main.statsShell{
  height:100dvh!important;
  overflow-x:hidden!important;
  overflow-y:auto!important;
 }

 #main .statsMain{
  display:grid!important;
  grid-template-columns:230px minmax(450px,1fr)!important;
  grid-template-rows:46px 112px auto auto!important;
  gap:8px!important;
  padding:8px!important;
  height:auto!important;
  min-height:100dvh!important;
  overflow:visible!important;
  align-content:start!important;
 }

 #main .v3TopBar{
  grid-column:1 / -1!important;
  grid-row:1!important;
  height:46px!important;
  min-height:46px!important;
  margin:0!important;
  padding:4px 8px!important;
 }

 #main .matchBoard{
  grid-column:1 / -1!important;
  grid-row:2!important;
  height:112px!important;
  min-height:112px!important;
  margin:0!important;
  padding:8px!important;
  display:grid!important;
  grid-template-columns:1fr 260px!important;
  gap:8px!important;
  position:relative!important;
  z-index:5!important;
 }

 #main .matchScore{
  height:100%!important;
  min-height:0!important;
  display:grid!important;
  grid-template-columns:1fr auto 1fr!important;
  align-items:center!important;
  padding:0!important;
 }

 #main .matchScoreline{
  font-size:46px!important;
  line-height:.9!important;
  color:#fff!important;
 }

 #main #gc,#main #gf,#main .matchScoreline span{
  color:#fff!important;
 }

 #main .matchTimer{
  font-size:20px!important;
  color:#fff!important;
  background:transparent!important;
  border:0!important;
  min-height:0!important;
  height:auto!important;
  padding:0!important;
 }

 #main .matchPeriodRow select,
 #main #periodo{
  max-width:130px!important;
  font-size:9px!important;
 }

 #main .matchControls{
  grid-column:2!important;
  display:grid!important;
  grid-template-columns:1fr 1fr!important;
  gap:5px!important;
  align-content:center!important;
  margin:0!important;
 }

 #main .matchControls button{
  min-height:32px!important;
  height:32px!important;
  font-size:8px!important;
  padding:0 4px!important;
 }

 #main #ctrl_reset{
  grid-column:1 / 3!important;
 }

 #main #startMini,#main #subMini{
  display:none!important;
 }

 #main .proLivePanel{
  grid-column:1!important;
  grid-row:3 / 5!important;
  padding:8px!important;
  margin:0!important;
  overflow:hidden!important;
  min-height:0!important;
 }

 #main .proLiveList{
  max-height:calc(100dvh - 230px)!important;
  overflow-y:auto!important;
 }

 #main .proLiveRow{
  min-height:31px!important;
  grid-template-columns:28px 1fr 46px!important;
  padding:3px 5px!important;
 }

 #main .proLiveIcon{
  width:23px!important;
  height:23px!important;
  font-size:8px!important;
 }

 #main .proLiveName{
  font-size:9px!important;
 }

 #main .proLiveTime{
  font-size:8px!important;
 }

 #main .v4MinuteTabs{
  gap:5px!important;
  margin-top:7px!important;
 }

 #main .v4MinuteTabs button{
  min-height:28px!important;
  font-size:8px!important;
 }

 #main .pitchCard{
  grid-column:2!important;
  grid-row:3!important;
  padding:8px!important;
  margin:0!important;
  position:relative!important;
  z-index:1!important;
 }

 #main .pitch{
  height:auto!important;
  min-height:280px!important;
  max-height:360px!important;
  aspect-ratio:1.72/1!important;
 }

 #main .proStatsPanel{
  grid-column:2!important;
  grid-row:4!important;
  padding:8px!important;
  margin:0!important;
 }

 #main .proStatsGrid{
  grid-template-columns:repeat(5,1fr)!important;
  gap:5px!important;
 }

 #main .proStatTile{
  height:48px!important;
  min-height:48px!important;
  padding:4px!important;
 }

 #main .proStatTile span{
  font-size:6.8px!important;
  line-height:1.05!important;
 }

 #main .proStatTile b{
  font-size:16px!important;
 }

 #main .proIndividualCard,
 #main .proCollectiveCard,
 #main .v4HeatMapCard,
 #main .proFieldPanel,
 #main .proBenchPanel,
 #main .proActionsPanel,
 #main .proSubsPanel{
  display:none!important;
 }
}

/* PC: ligeiro ajuste para não sobrepor */
@media(min-width:1181px){
 #main .matchBoard{
  position:relative!important;
  z-index:5!important;
 }
 #main .pitchCard{
  position:relative!important;
  z-index:1!important;
 }
}

/* Telemóvel: mesma lógica de clique */
@media(max-width:760px){
 #main .proLiveRow{
  min-height:44px!important;
 }
 #main .pitch{
  max-height:310px!important;
 }
}

/* Indicadores visuais claros */
#main .proLiveRow.field .proLiveIcon{
 background:linear-gradient(180deg,#2fdc64,#138b3d)!important;
}
#main .proLiveRow.bench .proLiveIcon{
 background:linear-gradient(180deg,#374151,#111827)!important;
}


/* =========================================================
STATS V4.4 — MARCADOR FINAL
Marcador limpo, centrado, sem sobreposição, responsivo.
========================================================= */

/* Estrutura geral do cartão do marcador */
#main .matchBoard{
 background:linear-gradient(180deg,rgba(7,15,28,.96),rgba(3,7,14,.96))!important;
 border:1px solid rgba(255,255,255,.14)!important;
 border-radius:18px!important;
 box-shadow:0 16px 45px rgba(0,0,0,.34)!important;
 padding:12px!important;
 gap:10px!important;
 position:relative!important;
 z-index:10!important;
 overflow:hidden!important;
}

/* Linhas internas */
#main .matchBoard:before{
 content:"";
 position:absolute;
 left:16px;
 right:16px;
 top:50%;
 height:1px;
 background:linear-gradient(90deg,transparent,rgba(255,255,255,.10),transparent);
 pointer-events:none;
}

/* Zona principal do marcador */
#main .matchScore{
 background:transparent!important;
 border:0!important;
 box-shadow:none!important;
 width:100%!important;
 display:grid!important;
 grid-template-columns:minmax(120px,1fr) minmax(150px,auto) minmax(120px,1fr)!important;
 align-items:center!important;
 justify-items:center!important;
 gap:14px!important;
 padding:0!important;
}

/* Equipas */
#main .matchTeam{
 width:100%!important;
 min-height:72px!important;
 display:flex!important;
 flex-direction:column!important;
 align-items:center!important;
 justify-content:center!important;
 gap:8px!important;
}

#main .matchTeam input{
 width:100%!important;
 max-width:230px!important;
 padding:0!important;
 margin:0!important;
 background:transparent!important;
 border:0!important;
 color:#fff!important;
 text-align:center!important;
 font-size:15px!important;
 font-weight:950!important;
 text-transform:uppercase!important;
 letter-spacing:.02em!important;
}

#main .teamUnderline{
 width:120px!important;
 max-width:80%!important;
 height:4px!important;
 border-radius:99px!important;
 background:#e51c2b!important;
 box-shadow:0 0 14px rgba(229,28,43,.60)!important;
}

#main .teamUnderline.away{
 background:#1e7cff!important;
 box-shadow:0 0 14px rgba(30,124,255,.60)!important;
}

/* Botões + e - discretos */
#main .teamGoalBtns{
 display:flex!important;
 justify-content:center!important;
 gap:24px!important;
 margin:0!important;
}

#main .teamGoalBtns button{
 width:auto!important;
 height:auto!important;
 min-height:0!important;
 padding:0!important;
 margin:0!important;
 background:transparent!important;
 border:0!important;
 color:white!important;
 font-size:34px!important;
 line-height:1!important;
 font-weight:950!important;
}

/* Centro: resultado, tempo, período */
#main .matchCenter{
 min-width:160px!important;
 display:flex!important;
 flex-direction:column!important;
 align-items:center!important;
 justify-content:center!important;
 gap:8px!important;
}

#main .matchScoreline{
 color:#fff!important;
 font-size:72px!important;
 font-weight:950!important;
 line-height:.82!important;
 letter-spacing:-.07em!important;
 white-space:nowrap!important;
 text-shadow:0 8px 28px rgba(0,0,0,.42)!important;
}

#main .matchScoreline span,
#main #gc,
#main #gf{
 color:#fff!important;
}

#main .matchGlow{
 width:92px!important;
 height:5px!important;
 background:#e51c2b!important;
 border-radius:99px!important;
 margin:0!important;
 box-shadow:0 0 18px rgba(229,28,43,.80)!important;
}

#main .matchTimer,
#main #tempo{
 color:#fff!important;
 background:transparent!important;
 border:0!important;
 height:auto!important;
 min-height:0!important;
 padding:0!important;
 margin:0!important;
 font-size:28px!important;
 line-height:1!important;
 font-weight:950!important;
 letter-spacing:.02em!important;
}

#main .matchTimer:before{
 display:none!important;
}

#main .matchPeriodRow{
 width:100%!important;
 display:flex!important;
 justify-content:center!important;
 align-items:center!important;
 margin:0!important;
 height:auto!important;
 overflow:visible!important;
}

#main .matchPeriodRow select,
#main #periodo{
 width:auto!important;
 max-width:170px!important;
 min-width:120px!important;
 padding:5px 24px 5px 12px!important;
 margin:0!important;
 border-radius:999px!important;
 background:rgba(229,28,43,.10)!important;
 border:1px solid rgba(229,28,43,.45)!important;
 color:#ff2b37!important;
 font-size:12px!important;
 font-weight:950!important;
 text-align:center!important;
 text-transform:uppercase!important;
}

/* Controlos dentro do cartão */
#main .matchControls{
 width:100%!important;
 display:grid!important;
 grid-template-columns:1fr 1fr 1fr!important;
 gap:10px!important;
 margin:0!important;
}

#main .matchControls button{
 min-height:48px!important;
 height:48px!important;
 border-radius:13px!important;
 background:rgba(255,255,255,.045)!important;
 border:1px solid rgba(255,255,255,.16)!important;
 color:#fff!important;
 font-size:13px!important;
 font-weight:950!important;
 letter-spacing:.01em!important;
}

#main .matchControls button.controlActive{
 background:rgba(229,28,43,.14)!important;
 border-color:rgba(229,28,43,.48)!important;
}

#main #startMini,
#main #subMini{
 display:none!important;
}

/* PC */
@media(min-width:1025px){
 #main .matchBoard{
  grid-column:1 / -1!important;
  grid-row:2!important;
  display:grid!important;
  grid-template-columns:1fr!important;
  height:auto!important;
  min-height:198px!important;
 }

 #main .matchScore{
  min-height:128px!important;
 }

 #main .matchControls{
  max-width:760px!important;
  justify-self:center!important;
 }

 #main .matchControls button{
  min-height:50px!important;
  height:50px!important;
 }
}

/* iPad horizontal */
@media(min-width:761px) and (max-width:1180px) and (orientation:landscape){
 #main .matchBoard{
  grid-column:1 / -1!important;
  grid-row:2!important;
  display:grid!important;
  grid-template-columns:1fr!important;
  height:auto!important;
  min-height:142px!important;
  padding:8px!important;
  gap:6px!important;
 }

 #main .matchScore{
  min-height:86px!important;
  grid-template-columns:minmax(100px,1fr) minmax(128px,auto) minmax(100px,1fr)!important;
  gap:8px!important;
 }

 #main .matchTeam{
  min-height:58px!important;
  gap:5px!important;
 }

 #main .matchTeam input{
  font-size:11px!important;
  max-width:170px!important;
 }

 #main .teamUnderline{
  width:84px!important;
  height:3px!important;
 }

 #main .teamGoalBtns{
  gap:16px!important;
 }

 #main .teamGoalBtns button{
  font-size:24px!important;
 }

 #main .matchCenter{
  min-width:128px!important;
  gap:5px!important;
 }

 #main .matchScoreline{
  font-size:46px!important;
 }

 #main .matchGlow{
  width:58px!important;
  height:4px!important;
 }

 #main .matchTimer,
 #main #tempo{
  font-size:20px!important;
 }

 #main .matchPeriodRow select,
 #main #periodo{
  max-width:130px!important;
  min-width:105px!important;
  padding:4px 18px 4px 10px!important;
  font-size:9px!important;
 }

 #main .matchControls{
  grid-template-columns:1fr 1fr 1fr!important;
  gap:6px!important;
  max-width:520px!important;
  justify-self:center!important;
 }

 #main .matchControls button{
  min-height:32px!important;
  height:32px!important;
  font-size:9px!important;
  border-radius:9px!important;
 }
}

/* Telemóvel */
@media(max-width:760px), (orientation:portrait) and (max-width:1024px){
 #main .matchBoard{
  display:grid!important;
  grid-template-columns:1fr!important;
  padding:10px!important;
  gap:8px!important;
 }

 #main .matchScore{
  min-height:154px!important;
  grid-template-columns:minmax(86px,1fr) minmax(128px,auto) minmax(86px,1fr)!important;
  gap:6px!important;
 }

 #main .matchTeam input{
  font-size:11px!important;
 }

 #main .teamUnderline{
  width:70px!important;
  height:3px!important;
 }

 #main .teamGoalBtns{
  gap:14px!important;
 }

 #main .teamGoalBtns button{
  font-size:28px!important;
 }

 #main .matchScoreline{
  font-size:54px!important;
 }

 #main .matchTimer,
 #main #tempo{
  font-size:23px!important;
 }

 #main .matchControls{
  grid-template-columns:1fr 1fr 1fr!important;
  gap:7px!important;
 }

 #main .matchControls button{
  min-height:40px!important;
  height:40px!important;
  font-size:10px!important;
 }
}


/* =========================================================
STATS V4.5 — MARCADOR CENTRADO COM LARGURA MÁXIMA
O marcador deixa de esticar pela página toda.
========================================================= */

/* O bloco do marcador fica centrado e com largura máxima */
#main .matchBoard{
 width:min(860px,100%)!important;
 max-width:860px!important;
 justify-self:center!important;
 align-self:start!important;
 margin:0 auto!important;
 box-sizing:border-box!important;
}

/* No PC, o marcador ocupa a linha toda da grelha, mas o cartão não estica */
@media(min-width:1025px){
 #main .matchBoard{
  grid-column:1 / -1!important;
  grid-row:2!important;
  width:min(860px,100%)!important;
  max-width:860px!important;
  justify-self:center!important;
  margin:0 auto!important;
 }

 #main .matchScore{
  grid-template-columns:1fr 170px 1fr!important;
  gap:18px!important;
 }

 #main .matchScoreline{
  font-size:62px!important;
 }

 #main .matchTimer,
 #main #tempo{
  font-size:26px!important;
 }

 #main .matchControls{
  width:100%!important;
  max-width:650px!important;
  justify-self:center!important;
 }
}

/* iPad horizontal: cartão mais compacto e sempre centrado */
@media(min-width:761px) and (max-width:1180px) and (orientation:landscape){
 #main .matchBoard{
  width:min(720px,100%)!important;
  max-width:720px!important;
  justify-self:center!important;
  margin:0 auto!important;
 }

 #main .matchScore{
  grid-template-columns:1fr 135px 1fr!important;
  gap:10px!important;
 }

 #main .matchScoreline{
  font-size:44px!important;
 }

 #main .matchTimer,
 #main #tempo{
  font-size:19px!important;
 }

 #main .matchControls{
  max-width:500px!important;
  justify-self:center!important;
 }
}

/* Telemóvel: ocupa quase tudo, mas sem rebentar */
@media(max-width:760px), (orientation:portrait) and (max-width:1024px){
 #main .matchBoard{
  width:100%!important;
  max-width:100%!important;
  margin:0 auto!important;
 }

 #main .matchScore{
  grid-template-columns:1fr 128px 1fr!important;
 }

 #main .matchScoreline{
  font-size:50px!important;
 }
}

/* Evitar que nomes das equipas façam o marcador crescer */
#main .matchTeam{
 min-width:0!important;
 overflow:hidden!important;
}

#main .matchTeam input{
 min-width:0!important;
 overflow:hidden!important;
 text-overflow:ellipsis!important;
 white-space:nowrap!important;
}


/* =========================================================
STATS V4.6 — MARCADOR COMPACTO E LINEAR
- bloco menor e centrado
- resultado, tempo e período alinhados
- iniciar / pausar / reset por baixo, pequenos
========================================================= */

#main .matchBoard{
 width:min(620px,100%)!important;
 max-width:620px!important;
 min-height:auto!important;
 height:auto!important;
 justify-self:center!important;
 margin:0 auto!important;
 padding:10px 12px!important;
 display:flex!important;
 flex-direction:column!important;
 align-items:center!important;
 gap:8px!important;
 border-radius:16px!important;
}

#main .matchBoard:before{
 display:none!important;
}

#main .matchScore{
 width:100%!important;
 min-height:82px!important;
 height:auto!important;
 display:grid!important;
 grid-template-columns:1fr 140px 1fr!important;
 gap:10px!important;
 align-items:center!important;
 justify-items:center!important;
 padding:0!important;
}

#main .matchTeam{
 min-height:48px!important;
 height:auto!important;
 gap:5px!important;
 justify-content:center!important;
}

#main .matchTeam input{
 max-width:165px!important;
 font-size:12px!important;
 line-height:1.1!important;
}

#main .teamUnderline{
 width:82px!important;
 height:3px!important;
}

#main .teamGoalBtns{
 gap:16px!important;
}

#main .teamGoalBtns button{
 font-size:24px!important;
}

#main .matchCenter{
 min-width:140px!important;
 gap:4px!important;
}

#main .matchScoreline{
 font-size:48px!important;
 line-height:.86!important;
 letter-spacing:-.06em!important;
}

#main .matchGlow{
 width:58px!important;
 height:4px!important;
}

#main .matchTimer,
#main #tempo{
 font-size:21px!important;
 line-height:1!important;
}

#main .matchPeriodRow select,
#main #periodo{
 min-width:102px!important;
 max-width:126px!important;
 padding:3px 18px 3px 9px!important;
 font-size:9px!important;
 border-radius:999px!important;
}

/* botões pequenos por baixo do marcador */
#main .matchControls{
 width:100%!important;
 max-width:430px!important;
 display:grid!important;
 grid-template-columns:1fr 1fr 1fr!important;
 gap:7px!important;
 margin:0 auto!important;
 justify-self:center!important;
}

#main .matchControls button{
 min-height:30px!important;
 height:30px!important;
 padding:0 6px!important;
 border-radius:9px!important;
 font-size:9px!important;
 line-height:1!important;
}

/* PC */
@media(min-width:1025px){
 #main .matchBoard{
  width:min(620px,100%)!important;
  max-width:620px!important;
  grid-column:1 / -1!important;
  grid-row:2!important;
 }

 #main .matchScore{
  min-height:82px!important;
  grid-template-columns:1fr 140px 1fr!important;
 }

 #main .matchScoreline{
  font-size:48px!important;
 }

 #main .matchTimer,
 #main #tempo{
  font-size:21px!important;
 }

 #main .matchControls{
  max-width:430px!important;
 }

 #main .matchControls button{
  min-height:30px!important;
  height:30px!important;
  font-size:9px!important;
 }
}

/* iPad horizontal: ainda mais compacto */
@media(min-width:761px) and (max-width:1180px) and (orientation:landscape){
 #main .matchBoard{
  width:min(520px,100%)!important;
  max-width:520px!important;
  padding:7px 9px!important;
  gap:5px!important;
 }

 #main .matchScore{
  min-height:62px!important;
  grid-template-columns:1fr 112px 1fr!important;
  gap:7px!important;
 }

 #main .matchTeam{
  min-height:42px!important;
  gap:3px!important;
 }

 #main .matchTeam input{
  max-width:130px!important;
  font-size:9px!important;
 }

 #main .teamUnderline{
  width:58px!important;
  height:2px!important;
 }

 #main .teamGoalBtns{
  gap:12px!important;
 }

 #main .teamGoalBtns button{
  font-size:18px!important;
 }

 #main .matchCenter{
  min-width:112px!important;
  gap:3px!important;
 }

 #main .matchScoreline{
  font-size:36px!important;
 }

 #main .matchGlow{
  width:42px!important;
  height:3px!important;
 }

 #main .matchTimer,
 #main #tempo{
  font-size:16px!important;
 }

 #main .matchPeriodRow select,
 #main #periodo{
  min-width:88px!important;
  max-width:105px!important;
  padding:2px 14px 2px 7px!important;
  font-size:7px!important;
 }

 #main .matchControls{
  max-width:330px!important;
  gap:5px!important;
 }

 #main .matchControls button{
  min-height:24px!important;
  height:24px!important;
  font-size:7px!important;
  border-radius:7px!important;
 }

 /* compensar: como o marcador fica menor, a arena sobe melhor */
 #main .statsMain{
  grid-template-rows:46px auto auto auto!important;
 }
}

/* telemóvel */
@media(max-width:760px), (orientation:portrait) and (max-width:1024px){
 #main .matchBoard{
  width:100%!important;
  max-width:100%!important;
  padding:9px!important;
 }

 #main .matchScore{
  min-height:98px!important;
  grid-template-columns:1fr 120px 1fr!important;
 }

 #main .matchScoreline{
  font-size:42px!important;
 }

 #main .matchTimer,
 #main #tempo{
  font-size:19px!important;
 }

 #main .matchControls{
  max-width:100%!important;
 }

 #main .matchControls button{
  min-height:34px!important;
  height:34px!important;
  font-size:9px!important;
 }
}

/* impedir que regras antigas estiquem novamente o marcador */
#main .matchBoard .matchControls{
 grid-column:auto!important;
 grid-row:auto!important;
}


/* =========================================================
STATS V4.7 — MARCADOR FINAL COM +/− E HEAT MAP RESERVADO
========================================================= */

/* Marcador: pequeno, centrado e "encostado" no topo da área útil */
#main .matchBoard{
 width:min(620px,100%)!important;
 max-width:620px!important;
 margin:0 auto 4px auto!important;
 padding:8px 10px!important;
 display:flex!important;
 flex-direction:column!important;
 align-items:center!important;
 justify-content:center!important;
 gap:6px!important;
 border-radius:16px!important;
 background:linear-gradient(180deg,rgba(7,15,28,.96),rgba(3,7,14,.96))!important;
 border:1px solid rgba(255,255,255,.16)!important;
 box-shadow:0 16px 46px rgba(0,0,0,.36)!important;
 overflow:hidden!important;
 position:relative!important;
 z-index:10!important;
}

#main .matchBoard:before{display:none!important}

#main .matchScore{
 width:100%!important;
 min-height:74px!important;
 height:auto!important;
 display:grid!important;
 grid-template-columns:1fr 130px 1fr!important;
 gap:8px!important;
 align-items:center!important;
 justify-items:center!important;
 padding:0!important;
 background:transparent!important;
 border:0!important;
 box-shadow:none!important;
}

#main .matchTeam{
 width:100%!important;
 min-width:0!important;
 min-height:58px!important;
 display:flex!important;
 flex-direction:column!important;
 align-items:center!important;
 justify-content:center!important;
 gap:4px!important;
 overflow:hidden!important;
}

#main .matchTeam input{
 width:100%!important;
 max-width:150px!important;
 padding:0!important;
 margin:0!important;
 background:transparent!important;
 border:0!important;
 color:white!important;
 text-align:center!important;
 font-size:10px!important;
 font-weight:950!important;
 text-transform:uppercase!important;
 overflow:hidden!important;
 text-overflow:ellipsis!important;
 white-space:nowrap!important;
}

/* botões + e - visíveis e compactos */
#main .teamGoalBtns{
 display:flex!important;
 align-items:center!important;
 justify-content:center!important;
 gap:8px!important;
 margin:0!important;
 width:auto!important;
}

#main .teamGoalBtns button{
 display:flex!important;
 align-items:center!important;
 justify-content:center!important;
 width:34px!important;
 height:24px!important;
 min-height:24px!important;
 padding:0!important;
 margin:0!important;
 border-radius:8px!important;
 font-size:18px!important;
 line-height:1!important;
 font-weight:950!important;
 color:white!important;
 border:1px solid rgba(255,255,255,.22)!important;
 background:linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.035))!important;
}

#main .matchTeam:first-child .teamGoalBtns button:first-child,
#main .matchTeam:last-child .teamGoalBtns button:first-child{
 background:linear-gradient(180deg,#e51c2b,#9d101a)!important;
 border-color:rgba(229,28,43,.70)!important;
}

/* inverter visualmente para ficar - e + como no mockup */
#main .teamGoalBtns{
 flex-direction:row-reverse!important;
}

#main .teamUnderline{
 display:none!important;
}

#main .matchCenter{
 min-width:130px!important;
 display:flex!important;
 flex-direction:column!important;
 align-items:center!important;
 justify-content:center!important;
 gap:3px!important;
}

#main .matchScoreline{
 color:white!important;
 font-size:42px!important;
 line-height:.86!important;
 font-weight:950!important;
 letter-spacing:-.06em!important;
 white-space:nowrap!important;
 text-shadow:0 8px 26px rgba(0,0,0,.45)!important;
}

#main .matchScoreline span,
#main #gc,
#main #gf{color:white!important}

#main .matchGlow{
 display:none!important;
}

#main .matchTimer,
#main #tempo{
 color:white!important;
 font-size:16px!important;
 line-height:1!important;
 font-weight:950!important;
 background:transparent!important;
 border:0!important;
 height:auto!important;
 min-height:0!important;
 padding:0!important;
 margin:0!important;
}

#main .matchTimer:before{display:none!important}

#main .matchPeriodRow{
 width:100%!important;
 display:flex!important;
 justify-content:center!important;
 margin:0!important;
}

#main .matchPeriodRow select,
#main #periodo{
 width:auto!important;
 min-width:86px!important;
 max-width:110px!important;
 padding:2px 14px 2px 8px!important;
 margin:0!important;
 border-radius:999px!important;
 background:rgba(229,28,43,.14)!important;
 border:1px solid rgba(229,28,43,.55)!important;
 color:#ff2b37!important;
 font-size:7px!important;
 font-weight:950!important;
 text-align:center!important;
 text-transform:uppercase!important;
}

/* Iniciar / Pausar / Reset pequenos e alinhados por baixo */
#main .matchControls{
 width:100%!important;
 max-width:370px!important;
 display:grid!important;
 grid-template-columns:1fr 1fr 1fr!important;
 gap:5px!important;
 margin:0 auto!important;
}

#main .matchControls button{
 min-height:24px!important;
 height:24px!important;
 padding:0 5px!important;
 border-radius:7px!important;
 font-size:7px!important;
 line-height:1!important;
 font-weight:950!important;
 background:rgba(255,255,255,.045)!important;
 border:1px solid rgba(255,255,255,.18)!important;
 color:white!important;
}

#main #startMini,
#main #subMini{display:none!important}

/* Heat map reservado do lado direito */
#main .v47HeatMapDock{
 display:flex!important;
 flex-direction:column!important;
 align-items:center!important;
 justify-content:center!important;
 min-height:120px!important;
 padding:12px!important;
 border-radius:16px!important;
 background:linear-gradient(180deg,rgba(7,15,28,.70),rgba(3,7,14,.70))!important;
 border:1px solid rgba(255,255,255,.12)!important;
 box-shadow:0 14px 40px rgba(0,0,0,.28)!important;
}

#main .v47HeatTitle{
 color:white!important;
 font-size:34px!important;
 font-weight:950!important;
 letter-spacing:.06em!important;
 transform:rotate(8deg);
 opacity:.95;
}

#main .v47HeatMini{
 width:100%!important;
 height:68px!important;
 margin-top:8px!important;
 border-radius:12px!important;
 background:
  radial-gradient(circle at 35% 55%,rgba(229,28,43,.9),transparent 20%),
  radial-gradient(circle at 62% 44%,rgba(255,210,36,.8),transparent 22%),
  radial-gradient(circle at 52% 70%,rgba(13,91,225,.65),transparent 24%),
  linear-gradient(135deg,#071326,#0a1424)!important;
 border:1px solid rgba(255,255,255,.13)!important;
 opacity:.78;
}

/* PC: layout com heat map à direita e arena no centro */
@media(min-width:1025px){
 #main .statsMain{
  display:grid!important;
  grid-template-columns:250px minmax(560px,1fr) 190px!important;
  grid-template-rows:50px auto minmax(0,1fr) auto!important;
  gap:8px!important;
  padding:8px!important;
 }

 #main .v3TopBar{
  grid-column:1 / -1!important;
  grid-row:1!important;
 }

 #main .matchBoard{
  grid-column:2!important;
  grid-row:2!important;
  justify-self:center!important;
  align-self:start!important;
 }

 #main .proLivePanel{
  grid-column:1!important;
  grid-row:3 / 5!important;
 }

 #main .pitchCard{
  grid-column:2!important;
  grid-row:3!important;
 }

 #main .v47HeatMapDock{
  grid-column:3!important;
  grid-row:2 / 4!important;
  align-self:stretch!important;
  margin:0!important;
 }

 #main .proStatsPanel{
  grid-column:2 / 4!important;
  grid-row:4!important;
 }

 #main .pitch{
  min-height:390px!important;
  max-height:none!important;
 }
}

/* iPad horizontal */
@media(min-width:761px) and (max-width:1180px) and (orientation:landscape){
 #main .statsMain{
  display:grid!important;
  grid-template-columns:220px minmax(420px,1fr) 135px!important;
  grid-template-rows:44px auto minmax(0,1fr) auto!important;
  gap:6px!important;
  padding:6px!important;
 }

 #main .v3TopBar{
  grid-column:1 / -1!important;
  grid-row:1!important;
 }

 #main .matchBoard{
  grid-column:2!important;
  grid-row:2!important;
  width:min(500px,100%)!important;
  max-width:500px!important;
  padding:6px 8px!important;
  gap:4px!important;
 }

 #main .matchScore{
  min-height:58px!important;
  grid-template-columns:1fr 102px 1fr!important;
  gap:6px!important;
 }

 #main .matchTeam{
  min-height:46px!important;
 }

 #main .matchTeam input{
  max-width:110px!important;
  font-size:8px!important;
 }

 #main .teamGoalBtns button{
  width:26px!important;
  height:19px!important;
  min-height:19px!important;
  font-size:14px!important;
  border-radius:6px!important;
 }

 #main .matchScoreline{
  font-size:32px!important;
 }

 #main .matchTimer,
 #main #tempo{
  font-size:13px!important;
 }

 #main #periodo{
  min-width:76px!important;
  max-width:92px!important;
  font-size:6px!important;
  padding:2px 12px 2px 6px!important;
 }

 #main .matchControls{
  max-width:285px!important;
  gap:4px!important;
 }

 #main .matchControls button{
  min-height:20px!important;
  height:20px!important;
  font-size:6px!important;
 }

 #main .proLivePanel{
  grid-column:1!important;
  grid-row:3 / 5!important;
 }

 #main .pitchCard{
  grid-column:2!important;
  grid-row:3!important;
 }

 #main .v47HeatMapDock{
  grid-column:3!important;
  grid-row:2 / 4!important;
  min-height:0!important;
  align-self:stretch!important;
  padding:8px!important;
 }

 #main .v47HeatTitle{
  font-size:24px!important;
  writing-mode:vertical-rl;
  transform:rotate(8deg);
 }

 #main .v47HeatMini{
  height:80px!important;
 }

 #main .proStatsPanel{
  grid-column:2 / 4!important;
  grid-row:4!important;
 }

 #main .pitch{
  min-height:285px!important;
  max-height:340px!important;
 }
}

/* Telemóvel: heat map sai da tela principal para não ocupar espaço */
@media(max-width:760px), (orientation:portrait) and (max-width:1024px){
 #main .v47HeatMapDock{display:none!important}

 #main .matchBoard{
  width:100%!important;
  max-width:100%!important;
 }

 #main .matchScore{
  grid-template-columns:1fr 112px 1fr!important;
 }

 #main .matchScoreline{
  font-size:38px!important;
 }
}


/* =========================================================
STATS V4.8 — LAYOUT COMO NA IMAGEM DO UTILIZADOR
- Marcador encostado em cima à esquerda/centro
- Heat Map em cima à direita
- Arena por baixo
- Lista de minutos à esquerda
========================================================= */

/* Grelha principal em landscape */
@media(min-width:761px) and (orientation:landscape){
 #main.statsShell{
  height:100dvh!important;
  overflow:hidden!important;
 }

 #main .statsMain{
  height:100dvh!important;
  overflow:hidden!important;
  display:grid!important;
  grid-template-columns:230px minmax(420px,1fr) 190px!important;
  grid-template-rows:44px 92px minmax(260px,1fr) 74px!important;
  gap:7px!important;
  padding:7px!important;
  align-content:stretch!important;
 }

 #main .v3TopBar{
  grid-column:1 / -1!important;
  grid-row:1!important;
  height:44px!important;
  min-height:44px!important;
  margin:0!important;
  padding:4px 8px!important;
 }

 /* Marcador na zona branca da imagem: começa depois da lista, antes do Heat Map */
 #main .matchBoard{
  grid-column:2!important;
  grid-row:2!important;
  width:100%!important;
  max-width:none!important;
  height:92px!important;
  min-height:92px!important;
  margin:0!important;
  padding:7px 10px!important;
  display:flex!important;
  flex-direction:column!important;
  justify-content:center!important;
  align-items:center!important;
  gap:4px!important;
  border-radius:14px!important;
 }

 #main .matchScore{
  width:100%!important;
  min-height:56px!important;
  height:56px!important;
  display:grid!important;
  grid-template-columns:1fr 110px 1fr!important;
  align-items:center!important;
  justify-items:center!important;
  gap:8px!important;
  padding:0!important;
 }

 #main .matchTeam{
  min-height:48px!important;
  height:48px!important;
  gap:3px!important;
 }

 #main .matchTeam input{
  max-width:135px!important;
  font-size:8px!important;
 }

 #main .teamGoalBtns{
  display:flex!important;
  flex-direction:row-reverse!important;
  gap:7px!important;
  margin:0!important;
 }

 #main .teamGoalBtns button{
  width:25px!important;
  height:18px!important;
  min-height:18px!important;
  border-radius:6px!important;
  font-size:13px!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  padding:0!important;
  margin:0!important;
 }

 #main .matchCenter{
  min-width:110px!important;
  gap:2px!important;
 }

 #main .matchScoreline{
  font-size:32px!important;
  line-height:.84!important;
 }

 #main .matchTimer,
 #main #tempo{
  font-size:13px!important;
 }

 #main #periodo{
  min-width:78px!important;
  max-width:94px!important;
  font-size:6px!important;
  padding:2px 12px 2px 6px!important;
 }

 #main .matchControls{
  width:100%!important;
  max-width:280px!important;
  display:grid!important;
  grid-template-columns:1fr 1fr 1fr!important;
  gap:4px!important;
  margin:0 auto!important;
 }

 #main .matchControls button{
  min-height:19px!important;
  height:19px!important;
  border-radius:6px!important;
  font-size:6px!important;
  padding:0 3px!important;
 }

 #main #startMini,
 #main #subMini{display:none!important}

 /* Heat Map em cima à direita */
 #main .v47HeatMapDock{
  grid-column:3!important;
  grid-row:2!important;
  display:flex!important;
  height:92px!important;
  min-height:92px!important;
  margin:0!important;
  padding:8px!important;
  border-radius:14px!important;
  align-items:center!important;
  justify-content:center!important;
  overflow:hidden!important;
 }

 #main .v47HeatTitle{
  font-size:25px!important;
  line-height:1!important;
  transform:none!important;
  writing-mode:horizontal-tb!important;
  text-align:center!important;
  white-space:nowrap!important;
 }

 #main .v47HeatMini{
  display:none!important;
 }

 /* Lista esquerda */
 #main .proLivePanel{
  grid-column:1!important;
  grid-row:3 / 5!important;
  padding:8px!important;
  margin:0!important;
  overflow:hidden!important;
 }

 #main .proLiveList{
  max-height:calc(100dvh - 220px)!important;
  overflow-y:auto!important;
 }

 #main .proLiveRow{
  min-height:30px!important;
  grid-template-columns:26px 1fr 44px!important;
  padding:3px 5px!important;
 }

 #main .proLiveIcon{
  width:22px!important;
  height:22px!important;
  font-size:8px!important;
 }

 #main .proLiveName{font-size:8px!important}
 #main .proLiveTime{font-size:7px!important}

 #main .v4MinuteTabs{
  gap:5px!important;
  margin-top:6px!important;
 }

 #main .v4MinuteTabs button{
  min-height:26px!important;
  height:26px!important;
  font-size:7px!important;
 }

 /* Arena por baixo do marcador */
 #main .pitchCard{
  grid-column:2 / 4!important;
  grid-row:3!important;
  padding:8px!important;
  margin:0!important;
  overflow:hidden!important;
 }

 #main .fieldTitleRow{
  margin-bottom:4px!important;
 }

 #main .fieldTitleRow h3{
  font-size:10px!important;
 }

 #main .attackOutsideWrap span{
  font-size:7px!important;
 }

 #main .attackTinyOutside{
  width:30px!important;
  height:28px!important;
  font-size:15px!important;
 }

 #main .pitch{
  height:calc(100dvh - 238px)!important;
  min-height:270px!important;
  max-height:360px!important;
  aspect-ratio:auto!important;
 }

 /* Estatísticas por baixo da arena */
 #main .proStatsPanel{
  grid-column:2 / 4!important;
  grid-row:4!important;
  padding:7px!important;
  margin:0!important;
  overflow:hidden!important;
 }

 #main .proStatsGrid{
  grid-template-columns:repeat(5,1fr)!important;
  gap:5px!important;
 }

 #main .proStatTile{
  min-height:46px!important;
  height:46px!important;
  padding:4px!important;
 }

 #main .proStatTile span{
  font-size:6px!important;
  line-height:1.05!important;
  min-height:14px!important;
 }

 #main .proStatTile b{
  font-size:16px!important;
 }

 #main .proIndividualCard,
 #main .proCollectiveCard,
 #main .v4HeatMapCard,
 #main .proFieldPanel,
 #main .proBenchPanel,
 #main .proActionsPanel,
 #main .proSubsPanel{
  display:none!important;
 }
}

/* PC maior: manter o mesmo conceito, só com medidas maiores */
@media(min-width:1181px){
 #main .statsMain{
  grid-template-columns:280px minmax(560px,1fr) 230px!important;
  grid-template-rows:56px 118px minmax(390px,1fr) 84px!important;
  gap:10px!important;
  padding:10px!important;
 }

 #main .v3TopBar{
  height:56px!important;
  min-height:56px!important;
 }

 #main .matchBoard{
  height:118px!important;
  min-height:118px!important;
 }

 #main .matchScore{
  height:74px!important;
  min-height:74px!important;
  grid-template-columns:1fr 145px 1fr!important;
 }

 #main .matchScoreline{
  font-size:44px!important;
 }

 #main .matchTimer,
 #main #tempo{
  font-size:17px!important;
 }

 #main .matchTeam input{
  font-size:10px!important;
  max-width:170px!important;
 }

 #main .teamGoalBtns button{
  width:32px!important;
  height:23px!important;
  min-height:23px!important;
  font-size:17px!important;
 }

 #main .matchControls{
  max-width:360px!important;
 }

 #main .matchControls button{
  height:25px!important;
  min-height:25px!important;
  font-size:8px!important;
 }

 #main .v47HeatMapDock{
  height:118px!important;
  min-height:118px!important;
 }

 #main .v47HeatTitle{
  font-size:34px!important;
 }

 #main .pitch{
  height:calc(100dvh - 300px)!important;
  min-height:410px!important;
  max-height:560px!important;
 }

 #main .proLiveList{
  max-height:calc(100dvh - 280px)!important;
 }

 #main .proLiveRow{
  min-height:36px!important;
 }

 #main .proStatTile{
  min-height:58px!important;
  height:58px!important;
 }

 #main .proStatTile b{
  font-size:22px!important;
 }
}

/* Telemóvel/vertical mantém layout em coluna */
@media(max-width:760px), (orientation:portrait) and (max-width:1024px){
 #main .v47HeatMapDock{
  display:none!important;
 }

 #main .matchBoard{
  width:100%!important;
  max-width:100%!important;
 }

 #main .matchScore{
  grid-template-columns:1fr 112px 1fr!important;
 }

 #main .matchScoreline{
  font-size:38px!important;
 }
}


/* =========================================================
STATS V4.9 — GITHUB: MARCADOR NO TOPO + HEAT MAP REAL
========================================================= */

@media(min-width:761px) and (orientation:landscape){
 #main.statsShell{height:100dvh!important;overflow:hidden!important}
 #main .statsMain{
  display:grid!important;
  grid-template-columns:230px minmax(420px,1fr) 230px!important;
  grid-template-rows:40px 108px minmax(260px,1fr) 72px!important;
  gap:7px!important;
  padding:5px 8px 8px!important;
  height:100dvh!important;
  overflow:hidden!important;
 }

 #main .v3TopBar{grid-column:1/-1!important;grid-row:1!important;height:40px!important;min-height:40px!important;padding:2px 8px!important;margin:0!important}
 #main .v3Logo{width:28px!important;height:28px!important}
 #main .v3BrandMain{font-size:19px!important}
 #main .v3BrandSub{font-size:6px!important}
 #main .proNavBtn{width:30px!important;height:30px!important;min-height:30px!important}

 #main .matchBoard{
  grid-column:2!important;grid-row:2!important;
  width:100%!important;max-width:none!important;
  height:108px!important;min-height:108px!important;
  padding:7px 10px!important;margin:0!important;
  display:flex!important;flex-direction:column!important;justify-content:center!important;
  gap:5px!important;overflow:visible!important;
 }
 #main .matchScore{
  width:100%!important;height:70px!important;min-height:70px!important;
  display:grid!important;grid-template-columns:1fr 126px 1fr!important;
  gap:10px!important;align-items:center!important;
 }
 #main .matchTeam{min-height:62px!important;gap:5px!important}
 #main .matchTeam input{max-width:150px!important;font-size:9px!important}
 #main .teamGoalBtns{display:flex!important;flex-direction:row-reverse!important;gap:8px!important}
 #main .teamGoalBtns button{width:30px!important;height:22px!important;min-height:22px!important;font-size:16px!important;border-radius:7px!important}
 #main .matchCenter{min-width:126px!important;gap:3px!important}
 #main .matchScoreline{font-size:42px!important;line-height:.86!important}
 #main .matchTimer,#main #tempo{font-size:16px!important}
 #main #periodo{min-width:84px!important;max-width:108px!important;font-size:6.5px!important;padding:2px 12px 2px 7px!important}
 #main .matchControls{max-width:330px!important;grid-template-columns:1fr 1fr 1fr!important;gap:5px!important}
 #main .matchControls button{min-height:23px!important;height:23px!important;font-size:6.5px!important;border-radius:7px!important}
 #main #startMini,#main #subMini{display:none!important}

 #main .proLivePanel{grid-column:1!important;grid-row:3/5!important;padding:7px!important;overflow:hidden!important}
 #main .proLiveList{max-height:calc(100dvh - 215px)!important;overflow:auto!important}
 #main .pitchCard{grid-column:2!important;grid-row:3!important;padding:7px!important;overflow:hidden!important}
 #main .pitch{height:calc(100dvh - 238px)!important;min-height:280px!important;max-height:430px!important;aspect-ratio:auto!important}
 #main .proStatsPanel{grid-column:2/4!important;grid-row:4!important;padding:7px!important}
 #main .proStatsGrid{grid-template-columns:repeat(5,1fr)!important;gap:5px!important}
 #main .proStatTile{height:46px!important;min-height:46px!important;padding:4px!important}
 #main .proStatTile span{font-size:6px!important;line-height:1.05!important}
 #main .proStatTile b{font-size:16px!important}

 #main .v47HeatMapDock{
  grid-column:3!important;grid-row:2/4!important;
  display:flex!important;flex-direction:column!important;
  height:auto!important;min-height:0!important;align-self:stretch!important;
  padding:8px!important;gap:7px!important;overflow:hidden!important;
 }
 #main .v49HeatHeader{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;width:100%!important}
 #main .v49HeatTitle{color:#ff2b37!important;font-size:12px!important;font-weight:950!important;text-transform:uppercase!important;white-space:nowrap!important}
 #main #heatMapFilter{width:auto!important;max-width:104px!important;height:30px!important;margin:0!important;padding:4px 8px!important;border-radius:8px!important;background:rgba(255,255,255,.07)!important;border:1px solid rgba(255,255,255,.14)!important;color:white!important;font-size:8px!important}
 #main #heatMapFilter option{background:#071326!important;color:white!important}
 #main .v49HeatMapBox{flex:1!important;min-height:220px!important;width:100%!important}
 #main .v49HeatPitch{position:relative!important;width:100%!important;height:100%!important;min-height:220px!important;border-radius:10px!important;overflow:hidden!important;background:linear-gradient(135deg,#071326,#10244f)!important;border:1px solid rgba(255,255,255,.18)!important}
 #main .v49HeatLines{position:absolute;inset:6%;border:1.5px solid rgba(255,255,255,.72);z-index:4;pointer-events:none}
 #main .v49HeatMid{position:absolute;left:50%;top:6%;bottom:6%;border-left:1.5px solid rgba(255,255,255,.55);z-index:4;pointer-events:none}
 #main .v49HeatCircle{position:absolute;left:50%;top:50%;width:30%;aspect-ratio:1/1;transform:translate(-50%,-50%);border:1.5px solid rgba(255,255,255,.45);border-radius:50%;z-index:4;pointer-events:none}
 #main .v49HeatGoal{position:absolute;top:42%;width:8%;height:16%;border:1.5px solid rgba(255,255,255,.68);z-index:4;pointer-events:none}
 #main .v49HeatGoal.left{left:6%;border-left:0}
 #main .v49HeatGoal.right{right:6%;border-right:0}
 #main .v49HeatBlob{position:absolute!important;width:var(--s)!important;height:var(--s)!important;transform:translate(-50%,-50%)!important;filter:blur(15px)!important;border-radius:50%!important;z-index:2!important;mix-blend-mode:screen!important}
 #main .v49HeatLegend{display:grid!important;grid-template-columns:auto 1fr auto!important;align-items:center!important;gap:6px!important;color:rgba(255,255,255,.75)!important;font-size:7px!important;width:100%!important}
 #main .v49HeatLegend i{display:block!important;height:8px!important;border-radius:999px!important;background:linear-gradient(90deg,#163c96,#24ce55,#d8e228,#ff8c14,#e51c2b)!important}
 #main .v47HeatTitle,#main .v47HeatMini{display:none!important}

 #main .proIndividualCard,#main .proCollectiveCard,#main .v4HeatMapCard,#main .proFieldPanel,#main .proBenchPanel,#main .proActionsPanel,#main .proSubsPanel{display:none!important}
}

@media(min-width:1181px){
 #main .statsMain{grid-template-columns:280px minmax(620px,1fr) 300px!important;grid-template-rows:54px 138px minmax(420px,1fr) 84px!important;gap:10px!important;padding:10px!important}
 #main .v3TopBar{height:54px!important;min-height:54px!important}
 #main .matchBoard{height:138px!important;min-height:138px!important}
 #main .matchScore{height:88px!important;min-height:88px!important;grid-template-columns:1fr 170px 1fr!important}
 #main .matchScoreline{font-size:56px!important}
 #main .matchTimer,#main #tempo{font-size:22px!important}
 #main .matchTeam input{font-size:12px!important;max-width:200px!important}
 #main .teamGoalBtns button{width:38px!important;height:28px!important;min-height:28px!important;font-size:21px!important}
 #main .matchControls{max-width:430px!important}
 #main .matchControls button{height:29px!important;min-height:29px!important;font-size:8px!important}
 #main .pitch{height:calc(100dvh - 320px)!important;min-height:430px!important;max-height:620px!important}
 #main .v49HeatMapBox,#main .v49HeatPitch{min-height:360px!important}
}

@media(max-width:760px), (orientation:portrait) and (max-width:1024px){
 #main .v47HeatMapDock{display:none!important}
 #main .matchBoard{width:100%!important;max-width:100%!important;overflow:visible!important}
 #main .matchScore{grid-template-columns:1fr 118px 1fr!important}
 #main .matchScoreline{font-size:40px!important}
}


/* =========================================================
STATS V5.0 — MARCADOR SEM CORTES + HEAT MAP MELHORADO
========================================================= */
@media(min-width:761px) and (orientation:landscape){
 #main .matchBoard{overflow:visible!important;box-sizing:border-box!important;min-height:132px!important;height:132px!important;padding:10px 14px!important;align-self:start!important}
 #main .matchScore{overflow:visible!important;box-sizing:border-box!important;height:84px!important;min-height:84px!important;grid-template-columns:minmax(120px,1fr) minmax(150px,170px) minmax(120px,1fr)!important;align-items:center!important}
 #main .matchCenter{overflow:visible!important;min-width:150px!important;height:82px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:5px!important}
 #main .matchScoreline{display:flex!important;align-items:center!important;justify-content:center!important;height:42px!important;min-height:42px!important;line-height:42px!important;font-size:46px!important;padding:0 4px!important;margin:0!important;overflow:visible!important;letter-spacing:-.04em!important}
 #main #gc,#main #gf,#main .matchScoreline span{display:inline-block!important;min-width:36px!important;text-align:center!important;color:#fff!important}
 #main .matchTimer,#main #tempo{display:flex!important;align-items:center!important;justify-content:center!important;height:22px!important;min-height:22px!important;line-height:22px!important;font-size:18px!important;margin:0!important;overflow:visible!important}
 #main .matchPeriodRow{height:20px!important;min-height:20px!important;overflow:visible!important}
 #main #periodo{height:19px!important;min-height:19px!important;line-height:14px!important;display:block!important;font-size:7.5px!important;padding:2px 16px 2px 8px!important}
 #main .matchTeam{height:78px!important;min-height:78px!important;overflow:visible!important}
 #main .matchTeam input{height:18px!important;line-height:18px!important}
 #main .teamGoalBtns button{overflow:visible!important;line-height:1!important}
 #main .matchControls{max-width:380px!important;margin-top:0!important}
 #main .matchControls button{height:27px!important;min-height:27px!important;font-size:7.5px!important;line-height:1!important}
 #main .statsMain{grid-template-rows:40px 132px minmax(260px,1fr) 72px!important}
 #main .pitch{height:calc(100dvh - 262px)!important}
}
@media(min-width:1181px){
 #main .matchBoard{height:158px!important;min-height:158px!important;padding:12px 16px!important}
 #main .matchScore{height:102px!important;min-height:102px!important;grid-template-columns:minmax(160px,1fr) minmax(190px,210px) minmax(160px,1fr)!important}
 #main .matchCenter{min-width:190px!important;height:100px!important}
 #main .matchScoreline{height:56px!important;min-height:56px!important;line-height:56px!important;font-size:62px!important}
 #main #gc,#main #gf,#main .matchScoreline span{min-width:48px!important}
 #main .matchTimer,#main #tempo{height:28px!important;min-height:28px!important;line-height:28px!important;font-size:23px!important}
 #main #periodo{height:22px!important;min-height:22px!important;font-size:8.5px!important}
 #main .matchControls button{height:31px!important;min-height:31px!important;font-size:8.5px!important}
 #main .statsMain{grid-template-rows:54px 158px minmax(420px,1fr) 84px!important}
 #main .pitch{height:calc(100dvh - 344px)!important}
}
#main .v49HeatPitch{background:radial-gradient(circle at 72% 30%,rgba(229,28,43,.72),transparent 13%),radial-gradient(circle at 82% 50%,rgba(229,28,43,.82),transparent 15%),radial-gradient(circle at 80% 72%,rgba(255,135,20,.72),transparent 16%),radial-gradient(circle at 60% 36%,rgba(226,230,38,.68),transparent 15%),radial-gradient(circle at 48% 30%,rgba(36,206,85,.55),transparent 15%),radial-gradient(circle at 44% 72%,rgba(36,206,85,.45),transparent 13%),radial-gradient(circle at 24% 55%,rgba(36,206,85,.40),transparent 15%),linear-gradient(135deg,#071326,#0a1740 45%,#10244f)!important}
#main .v49HeatBlob{filter:blur(18px)!important;opacity:.92!important;mix-blend-mode:screen!important}
#main .v49HeatLines,#main .v49HeatMid,#main .v49HeatCircle,#main .v49HeatGoal{opacity:.95!important}
#main .v49HeatLegend i{height:10px!important;background:linear-gradient(90deg,#132b7b 0%,#1f9f55 32%,#d6e721 55%,#ff8c14 75%,#e51c2b 100%)!important}
.v50DashModal{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.72);backdrop-filter:blur(8px);padding:18px}.v50DashModal.show{display:flex}.v50DashBox{width:min(760px,96vw);max-height:88vh;overflow:auto;border-radius:18px;background:linear-gradient(180deg,#08101d,#03070e);border:1px solid rgba(255,255,255,.16);box-shadow:0 30px 90px rgba(0,0,0,.55);padding:20px;color:white;position:relative}.v50DashClose{position:absolute;right:14px;top:14px;width:38px;height:38px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:white;font-size:24px}.v50DashBox h2{margin:0 0 14px 0;color:#ff2b37;text-transform:uppercase}.v50DashPlayer{font-size:22px;font-weight:950;margin-bottom:14px}.v50DashGrid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.v50DashGrid div{min-height:90px;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}.v50DashGrid span{font-size:10px;color:rgba(255,255,255,.75);text-transform:uppercase;font-weight:900}.v50DashGrid b{font-size:34px}@media(max-width:760px){.v50DashGrid{grid-template-columns:1fr 1fr}}


/* =========================================================
STATS V5.3 — CORREÇÃO FINAL: +/−, ÍCONES E HEAT MAP VISÍVEL
========================================================= */

@media(min-width:761px) and (orientation:landscape){
 #main .matchBoard{
  height:108px!important;
  min-height:108px!important;
  padding:7px 10px!important;
  gap:4px!important;
  overflow:visible!important;
 }

 #main .matchScore{
  height:72px!important;
  min-height:72px!important;
  display:grid!important;
  grid-template-columns:minmax(105px,1fr) 170px minmax(105px,1fr)!important;
  gap:8px!important;
  align-items:center!important;
  overflow:visible!important;
 }

 #main .matchTeam{
  height:54px!important;
  min-height:54px!important;
  gap:2px!important;
  overflow:visible!important;
  position:relative!important;
 }

 #main .matchTeam input{
  max-width:138px!important;
  font-size:8px!important;
  height:14px!important;
  line-height:14px!important;
 }

 #main .matchCenter{
  min-width:170px!important;
  height:70px!important;
  display:flex!important;
  flex-direction:column!important;
  justify-content:center!important;
  align-items:center!important;
  gap:2px!important;
  overflow:visible!important;
  position:relative!important;
 }

 #main .matchScoreline{
  height:32px!important;
  min-height:32px!important;
  line-height:32px!important;
  font-size:34px!important;
  letter-spacing:-.03em!important;
  overflow:visible!important;
 }

 #main #gc,#main #gf,#main .matchScoreline span{
  min-width:26px!important;
  color:white!important;
 }

 /* + e - junto ao resultado, sem esconder */
 #main .teamGoalBtns{
  display:flex!important;
  flex-direction:row!important;
  gap:5px!important;
  align-items:center!important;
  justify-content:center!important;
  visibility:visible!important;
  opacity:1!important;
  pointer-events:auto!important;
  position:absolute!important;
  top:17px!important;
  z-index:80!important;
 }

 #main .matchTeam:first-child .teamGoalBtns{
  right:-46px!important;
 }

 #main .matchTeam:last-child .teamGoalBtns{
  left:-46px!important;
 }

 #main .teamGoalBtns button{
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  width:23px!important;
  height:21px!important;
  min-width:23px!important;
  min-height:21px!important;
  padding:0!important;
  margin:0!important;
  border-radius:7px!important;
  font-size:15px!important;
  font-weight:950!important;
  color:white!important;
  background:linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.035))!important;
  border:1px solid rgba(255,255,255,.25)!important;
 }

 #main .teamGoalBtns button:last-child{
  background:linear-gradient(180deg,#e51c2b,#9d101a)!important;
  border-color:rgba(229,28,43,.75)!important;
 }

 #main .matchTimer,#main #tempo{
  height:15px!important;
  min-height:15px!important;
  line-height:15px!important;
  font-size:13px!important;
 }

 #main #periodo{
  height:15px!important;
  min-height:15px!important;
  line-height:11px!important;
  font-size:5.8px!important;
  padding:1px 10px 1px 6px!important;
  max-width:88px!important;
  min-width:70px!important;
 }

 /* iniciar/pausar/reset: só símbolos, todos em linha horizontal */
 #main .matchControls{
  max-width:98px!important;
  width:98px!important;
  display:grid!important;
  grid-template-columns:1fr 1fr 1fr!important;
  gap:4px!important;
  margin:0 auto!important;
 }

 #main .matchControls button{
  width:30px!important;
  min-width:30px!important;
  height:20px!important;
  min-height:20px!important;
  padding:0!important;
  border-radius:6px!important;
  font-size:0!important;
  color:transparent!important;
  overflow:hidden!important;
 }

 #main #ctrl_start::after{content:"▶";font-size:11px!important;color:white!important}
 #main #ctrl_pause::after{content:"Ⅱ";font-size:11px!important;color:white!important}
 #main #ctrl_reset::after{content:"↻";font-size:11px!important;color:white!important}

 #main #startMini,#main #subMini{display:none!important}

 #main .statsMain{
  grid-template-rows:40px 108px minmax(260px,1fr) 72px!important;
 }

 #main .pitch{
  height:calc(100dvh - 238px)!important;
 }

 /* Heat map: campo volta a aparecer, vertical, mais quadrado */
 #main .v47HeatMapDock{
  grid-column:3!important;
  grid-row:2 / 4!important;
  display:flex!important;
  flex-direction:column!important;
  align-self:stretch!important;
  padding:8px!important;
  gap:7px!important;
  overflow:hidden!important;
 }

 #main .v53HeatHeader{
  display:flex!important;
  flex-direction:column!important;
  gap:6px!important;
  width:100%!important;
 }

 #main .v53HeatTitle{
  font-size:11px!important;
  font-weight:950!important;
  color:#ff2b37!important;
 }

 #main .v53HeatFilters{
  display:grid!important;
  grid-template-columns:1fr 1fr!important;
  gap:5px!important;
 }

 #main .v53HeatFilters select{
  width:100%!important;
  height:28px!important;
  border-radius:8px!important;
  background:rgba(255,255,255,.07)!important;
  border:1px solid rgba(255,255,255,.14)!important;
  color:white!important;
  font-size:7px!important;
  padding:3px 6px!important;
 }

 #main .v53HeatFilters option{
  background:#071326!important;
  color:white!important;
 }

 #main .v53HeatMapBox{
  flex:1!important;
  width:100%!important;
  min-height:230px!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
 }

 #main .v53HeatPitch{
  position:relative!important;
  width:100%!important;
  max-width:260px!important;
  height:100%!important;
  min-height:230px!important;
  max-height:420px!important;
  aspect-ratio:0.72/1!important;
  border-radius:10px!important;
  overflow:hidden!important;
  background:linear-gradient(180deg,#071326,#071a36 55%,#06111f)!important;
  border:1px solid rgba(255,255,255,.18)!important;
 }

 #main .v53HeatPitch.empty{
  background:linear-gradient(180deg,#071326,#071a36 55%,#06111f)!important;
 }

 #main .v53HeatOuter{
  position:absolute!important;
  inset:5%!important;
  border:1.5px solid rgba(255,255,255,.78)!important;
  z-index:4!important;
  pointer-events:none!important;
 }

 #main .v53HeatMid{
  position:absolute!important;
  left:5%!important;
  right:5%!important;
  top:50%!important;
  border-top:1.5px solid rgba(255,255,255,.58)!important;
  z-index:4!important;
  pointer-events:none!important;
 }

 #main .v53HeatCircle{
  position:absolute!important;
  left:50%!important;
  top:50%!important;
  width:42%!important;
  aspect-ratio:1/1!important;
  transform:translate(-50%,-50%)!important;
  border:1.5px solid rgba(255,255,255,.48)!important;
  border-radius:50%!important;
  z-index:4!important;
  pointer-events:none!important;
 }

 #main .v53HeatGoal{
  position:absolute!important;
  left:38%!important;
  width:24%!important;
  height:7%!important;
  border:1.5px solid rgba(255,255,255,.70)!important;
  z-index:4!important;
  pointer-events:none!important;
 }

 #main .v53HeatGoal.top{top:5%!important;border-top:0!important}
 #main .v53HeatGoal.bottom{bottom:5%!important;border-bottom:0!important}

 #main .v53HeatBlob{
  position:absolute!important;
  width:var(--s)!important;
  height:var(--s)!important;
  transform:translate(-50%,-50%)!important;
  filter:blur(16px)!important;
  border-radius:50%!important;
  z-index:2!important;
  mix-blend-mode:screen!important;
  opacity:.95!important;
 }

 #main .v53HeatLegend{
  display:grid!important;
  grid-template-columns:auto 1fr auto!important;
  gap:6px!important;
  align-items:center!important;
  width:100%!important;
  font-size:7px!important;
  color:rgba(255,255,255,.76)!important;
 }

 #main .v53HeatLegend i{
  height:8px!important;
  border-radius:999px!important;
  background:linear-gradient(90deg,#132b7b,#1f9f55,#d6e721,#ff8c14,#e51c2b)!important;
 }

 #main .v49HeatHeader,#main .v49HeatMapBox,#main .v49HeatLegend,
 #main .v47HeatTitle,#main .v47HeatMini{
  display:none!important;
 }
}

@media(min-width:1181px){
 #main .matchBoard{height:126px!important;min-height:126px!important}
 #main .matchScore{height:82px!important;min-height:82px!important;grid-template-columns:minmax(160px,1fr) 190px minmax(160px,1fr)!important}
 #main .matchCenter{min-width:190px!important}
 #main .matchScoreline{font-size:42px!important;height:38px!important;line-height:38px!important}
 #main .matchTeam:first-child .teamGoalBtns{right:-54px!important}
 #main .matchTeam:last-child .teamGoalBtns{left:-54px!important}
 #main .teamGoalBtns button{width:30px!important;height:24px!important;min-height:24px!important;font-size:18px!important}
 #main .matchControls{width:110px!important;max-width:110px!important}
 #main .matchControls button{width:32px!important;min-width:32px!important;height:22px!important;min-height:22px!important}
 #main .statsMain{grid-template-rows:54px 126px minmax(420px,1fr) 84px!important}
 #main .pitch{height:calc(100dvh - 312px)!important}
 #main .v53HeatPitch{max-width:300px!important;min-height:360px!important}
}

@media(max-width:760px), (orientation:portrait) and (max-width:1024px){
 #main .v47HeatMapDock{display:none!important}
 #main .teamGoalBtns{
  display:flex!important;
  position:static!important;
  transform:none!important;
  flex-direction:row!important;
  gap:5px!important;
  opacity:1!important;
  visibility:visible!important;
 }
 #main .teamGoalBtns button{
  display:flex!important;
  width:25px!important;
  height:20px!important;
  min-height:20px!important;
  font-size:14px!important;
 }
 #main .matchControls{
  width:100px!important;
  max-width:100px!important;
 }
 #main .matchControls button{
  width:30px!important;
  min-width:30px!important;
  height:22px!important;
  min-height:22px!important;
  font-size:0!important;
  color:transparent!important;
 }
 #main #ctrl_start::after{content:"▶";font-size:12px!important;color:white!important}
 #main #ctrl_pause::after{content:"Ⅱ";font-size:12px!important;color:white!important}
 #main #ctrl_reset::after{content:"↻";font-size:12px!important;color:white!important}
}


/* =========================================================
STATS V5.4 — CONTROLOS EM VERTICAL
Play / Pausa / Reset ficam um por baixo do outro.
========================================================= */

@media(min-width:761px) and (orientation:landscape){
 /* o marcador ganha uma faixa estreita à direita só para os controlos verticais */
 #main .matchBoard{
  position:relative!important;
  padding-right:48px!important;
  overflow:visible!important;
 }

 #main .matchControls{
  position:absolute!important;
  right:10px!important;
  top:50%!important;
  transform:translateY(-50%)!important;
  width:30px!important;
  max-width:30px!important;
  display:flex!important;
  flex-direction:column!important;
  gap:4px!important;
  margin:0!important;
  z-index:90!important;
 }

 #main .matchControls button{
  width:28px!important;
  min-width:28px!important;
  height:22px!important;
  min-height:22px!important;
  padding:0!important;
  margin:0!important;
  border-radius:7px!important;
  font-size:0!important;
  line-height:1!important;
  color:transparent!important;
  overflow:hidden!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
 }

 #main #ctrl_start::after{
  content:"▶";
  font-size:12px!important;
  color:white!important;
  line-height:1!important;
 }

 #main #ctrl_pause::after{
  content:"Ⅱ";
  font-size:12px!important;
  color:white!important;
  line-height:1!important;
 }

 #main #ctrl_reset::after{
  content:"↻";
  font-size:12px!important;
  color:white!important;
  line-height:1!important;
 }

 #main #startMini,
 #main #subMini{
  display:none!important;
 }

 /* + e - continuam visíveis junto ao resultado */
 #main .teamGoalBtns{
  display:flex!important;
  opacity:1!important;
  visibility:visible!important;
  pointer-events:auto!important;
 }
}

@media(min-width:1181px){
 #main .matchBoard{
  padding-right:54px!important;
 }

 #main .matchControls{
  right:12px!important;
  width:34px!important;
  max-width:34px!important;
  gap:5px!important;
 }

 #main .matchControls button{
  width:32px!important;
  min-width:32px!important;
  height:24px!important;
  min-height:24px!important;
 }

 #main #ctrl_start::after,
 #main #ctrl_pause::after,
 #main #ctrl_reset::after{
  font-size:13px!important;
 }
}

@media(max-width:760px), (orientation:portrait) and (max-width:1024px){
 #main .matchControls{
  width:34px!important;
  max-width:34px!important;
  display:flex!important;
  flex-direction:column!important;
  gap:5px!important;
  margin:0 auto!important;
 }

 #main .matchControls button{
  width:32px!important;
  min-width:32px!important;
  height:24px!important;
  min-height:24px!important;
  font-size:0!important;
  color:transparent!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
 }

 #main #ctrl_start::after{content:"▶";font-size:13px!important;color:white!important}
 #main #ctrl_pause::after{content:"Ⅱ";font-size:13px!important;color:white!important}
 #main #ctrl_reset::after{content:"↻";font-size:13px!important;color:white!important}
}


/* V5.7.2 — só corrige Dashboard Individual; não altera layout, marcador, arena nem heat map */
#individualDashModal .modalContent{max-width:720px!important}
#individualDashPlayers{
 display:grid!important;
 grid-template-columns:repeat(3,1fr)!important;
 gap:8px!important;
}
#individualDashPlayers .pbtn{min-height:44px!important}
.v55DashPage{display:none!important}
@media(max-width:760px){
 #individualDashPlayers{grid-template-columns:1fr 1fr!important}
}

</style></head><body>${body}<script>window.print()<\/script></body></html>`);
 win.document.close();
}

function atualizarTreinoResumo(){
 if($("treinoPresentes"))$("treinoPresentes").innerText=presencasTreino.length+"/"+treinoJogadores.length;
 if($("treinoStaffPresentes"))$("treinoStaffPresentes").innerText=presencasTreinadores.length+"/"+treinoTreinadores.length;
 if($("treinoExercicios"))$("treinoExercicios").innerText=exerciciosTreino.length;
 if($("treinoAcoes"))$("treinoAcoes").innerText=reg.filter(r=>r.tipoRegisto==="treino"||r.exercicioId).length;
}

function iniciarTreino(){
 localStorage.setItem("modo_pasteis","treino");
 localStorage.setItem("tipo_treino_pasteis",tipoTreinoAtual);
 localStorage.setItem("nome_treino_pasteis",$("treinoNome")?.value || "");
 localStorage.setItem("data_treino_pasteis",$("treinoData")?.value || "");
 localStorage.setItem("duracao_treino_pasteis",$("treinoDuracao")?.value || "");
 localStorage.setItem("objetivo_treino_pasteis",$("treinoObjetivo")?.value || "");

 if($("trainingPage"))$("trainingPage").classList.add("hidden");
 $("main").classList.remove("hidden");
 aplicarModoVisual();
}