/* StatS — storage.js
   Módulo separado automaticamente a partir do ficheiro original.
   Carregado antes de app.js.
*/

function saveAll(){localStorage.setItem("jogadores_pasteis",JSON.stringify(jogadores));localStorage.setItem("campo_pasteis",JSON.stringify(campo));localStorage.setItem("banco_pasteis",JSON.stringify(banco));localStorage.setItem("registos_pasteis",JSON.stringify(reg));localStorage.setItem("subs_pasteis",JSON.stringify(subs));localStorage.setItem("jogador_tipos_pasteis",JSON.stringify(jogadorTipos))}

function loadGame(){ if($("casa"))$("casa").value=localStorage.getItem("equipa_casa_pasteis")||"AD Pastéis"; if($("fora"))$("fora").value=localStorage.getItem("equipa_fora_pasteis")||""; $("gc").innerText=casaGoals; $("gf").innerText=foraGoals; renderAttack()}

function saveGame(){ if($("casa"))localStorage.setItem("equipa_casa_pasteis",$("casa").value); localStorage.setItem("equipa_fora_pasteis",$("fora").value)}

function saveNames(){
 let old=[...jogadores];
 let oldTipos={...jogadorTipos};
 jogadores=jogadores.map((j,i)=>$("nome"+i).value||("Jogador "+(i+1)));

 let novosTipos={};
 old.forEach((nomeAntigo,i)=>{
  let novoNome=jogadores[i];
  novosTipos[novoNome]=oldTipos[nomeAntigo]||oldTipos[novoNome]||"jogadora";
 });
 jogadorTipos=novosTipos;
 localStorage.setItem("jogador_tipos_pasteis",JSON.stringify(jogadorTipos));

 reg.forEach(r=>{let idx=old.indexOf(r.jogador);if(idx>=0)r.jogador=jogadores[idx]});
 subs.forEach(s=>{let a=old.indexOf(s.sai),b=old.indexOf(s.entra);if(a>=0)s.sai=jogadores[a];if(b>=0)s.entra=jogadores[b]});
 campo=campo.map(p=>{let i=old.indexOf(p);return i>=0?jogadores[i]:p});
 banco=banco.map(p=>{let i=old.indexOf(p);return i>=0?jogadores[i]:p});
 active=jogadores[0]||"Jogador 1";
 saveAll();
 renderAll();
 renderEditNames();
}

function resetNames(){
 jogadores=[];
 jogadorTipos={};
 for(let i=1;i<=total;i++){
  let nome="Jogador "+i;
  jogadores.push(nome);
  jogadorTipos[nome]="jogadora";
 }
 campo=jogadores.slice(0,inField);
 banco=jogadores.slice(inField);
 active=jogadores[0]||"Jogador 1";
 localStorage.setItem("jogador_tipos_pasteis",JSON.stringify(jogadorTipos));
 saveAll();
 renderAll();
 renderEditNames();
}

function resetTimer(){
 pause();
 time=dur*60;
 updateTimer();
}

function csvVal(v){
 let s=String(v??"").replace(/"/g,'""');
 return `"${s}"`;
}

function csvLine(arr){
 return arr.map(csvVal).join(";")+"\\n";
}



function getGuardaRedesLista(){
 let lista=[];
 if(window.convocatoria && Array.isArray(convocatoria.guardaRedes))lista=lista.concat(convocatoria.guardaRedes);
 lista=lista.concat(["Jamila","Crespo"]);
 return [...new Set(lista.map(x=>String(x||"").toLowerCase().trim()).filter(Boolean))];
}

function isGuardaRedesDashboard(nome){
 let n=String(nome||"").toLowerCase().trim();
 if(!n)return false;
 let lista=getGuardaRedesLista();
 return lista.includes(n) || n.includes("(gr)") || n.includes(" gr") || n.includes("guarda-redes") || n.includes("guarda redes");
}

function defesaDashboard(r){
 return r && r.acao==="Defesa" && isGuardaRedesDashboard(r.jogador);
}

function titularesIniciais(){
 let saved=JSON.parse(localStorage.getItem("titulares_iniciais_pasteis")||"null");
 if(saved && Array.isArray(saved) && saved.length)return saved;
 saved=campo.slice();
 localStorage.setItem("titulares_iniciais_pasteis",JSON.stringify(saved));
 return saved;
}

function guardarTitularesIniciais(){
 localStorage.setItem("titulares_iniciais_pasteis",JSON.stringify(campo.slice()));
}

function garantirTitularesIniciais(){
 if(!localStorage.getItem("titulares_iniciais_pasteis")){
  guardarTitularesIniciais();
 }
}

function ladoAtaquePeriodo(periodo){
 let eventos=reg.filter(r=>r.periodo===periodo && r.attackSide);
 if(!eventos.length)return attackSide||"right";
 let left=eventos.filter(r=>r.attackSide==="left").length;
 let right=eventos.filter(r=>r.attackSide==="right").length;
 return left>right?"left":"right";
}

function csvVal(v){
 let s=String(v??"").replace(/"/g,'""');
 return `"${s}"`;
}

function csvLine(arr){
 return arr.map(csvVal).join(";")+"\\n";
}

function exportBackupJSON(){
 let backup={
  versao:"1.0",
  exportadoEm:new Date().toLocaleString("pt-PT"),
  sessoes:getSessoes(),
  atual:{
   modo:modoAtual(),
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
   treino:{tipo:tipoTreinoAtual,nome:localStorage.getItem("nome_treino_pasteis")||"",data:localStorage.getItem("data_treino_pasteis")||"",duracao:localStorage.getItem("duracao_treino_pasteis")||"",objetivo:localStorage.getItem("objetivo_treino_pasteis")||"",jogadores:treinoJogadores,exercicios:exerciciosTreino,presencas:presencasTreino,treinadores:treinoTreinadores,presencasTreinadores:presencasTreinadores,medico:departamentoMedico}
  }
 };
 let blob=new Blob([JSON.stringify(backup,null,2)],{type:"application/json;charset=utf-8"});
 let url=URL.createObjectURL(blob);
 let a=document.createElement("a");
 a.href=url;
 a.download="backup_stats_adpasteis.json";
 a.click();
 URL.revokeObjectURL(url);
}

function importBackupJSON(event){
 let file=event.target.files[0];
 if(!file)return;
 let reader=new FileReader();
 reader.onload=function(e){
  try{
   let backup=JSON.parse(e.target.result);
   if(!backup.sessoes && !backup.atual){alert("Ficheiro inválido.");return;}
   if(!confirm("Importar este backup?"))return;
   if(Array.isArray(backup.sessoes))setSessoes(backup.sessoes);
   if(backup.atual){
    let s=backup.atual;
    localStorage.setItem("modo_pasteis",s.modo||"jogo");
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
   }
   alert("Backup importado.");
   localStorage.setItem("abrir_direto_pasteis","1");
   location.reload();
  }catch(err){
   alert("Erro ao importar backup.");
  }
 };
 reader.readAsText(file);
}

function fullReset(){if(confirm("Apagar tudo e repor a aplicação?")){localStorage.clear();location.reload()}}

function exportCSV(){
 let casa=($("casa")?$("casa").value:"AD Pastéis")||"AD Pastéis";
 let fora=($("fora")?$("fora").value:"Adversário")||"Adversário";
 let jogo=casa+" vs "+fora;
 let resultado=casaGoals+"-"+foraGoals;
 let det=localStorage.getItem("detalhes_jogo_pasteis")||"";
 let resumo=calcularResumoJogo();
 let minutos=calcularMinutosJogadores();
 let periodos=periodoOrdem();

 let csv="\ufeff";

 csv+="RESUMO\\n";
 csv+=csvLine(["Jogo",jogo]);
 csv+=csvLine(["Resultado",resultado]);
 csv+=csvLine(["Detalhes",det]);
 csv+=csvLine(["Golos",resumo.totalGolos]);
 csv+=csvLine(["Golos sofridos",resumo.totalGolosSofridos]);
 csv+=csvLine(["Remates",resumo.totalRemates]);
 csv+=csvLine(["Assistências",resumo.totalAssist]);
 csv+=csvLine(["Defesas GR",resumo.totalDefesas]);
 csv+=csvLine(["Passes falhados",resumo.totalPassesFalhados]);
 csv+=csvLine(["Recuperações",resumo.totalRecuperacoes]);
 csv+=csvLine(["Perdas de bola",resumo.totalPerdas]);
 csv+=csvLine(["Expulsões",resumo.totalExpulsoes]);
 csv+=csvLine(["Eficácia",resumo.eficacia+"%"]);
 csv+=csvLine(["MVP sugerido",resumo.mvp]);
 csv+="\\n";

 csv+="EVENTOS POR PERÍODO\\n";
 csv+=csvLine(["Período","Tempo","Jogador","Ação","Emoji","Zona","X","Y","Lado ataque","Relacionado","Data"]);
 periodoOrdem().forEach(p=>{
  reg.filter(r=>r.periodo===p).forEach(r=>{
   csv+=csvLine([
    r.periodo,
    r.tempo,
    r.jogador,
    r.acao,
    r.emoji||acaoObj(r.acao).emoji,
    zonaEvento(r),
    r.x||"",
    r.y||"",
    r.attackSide==="left"?"Ataque esquerda":"Ataque direita",
    r.relacionadaCom||"",
    r.data
   ]);
  });
 });
 csv+="\\n";

 csv+="ESTATÍSTICAS POR JOGADORA\\n";
 csv+=csvLine(["Jogadora","Golos","Remates","Assistências","Defesas GR","Passes falhados","Recuperações","Perdas","Expulsões","Total ações"]);
 Object.entries(resumo.porJogador).forEach(([j,s])=>{
  csv+=csvLine([j,s.golos,s.remates,s.assist,s.defesas,s.passesFalhados,s.recuperacoes,s.perdas,s.expulsoes,s.total]);
 });
 csv+="\\n";

 csv+="SUBSTITUIÇÕES\\n";
 csv+=csvLine(["Período","Tempo","Sai","Entra","Data"]);
 subs.slice().reverse().forEach(s=>{
  csv+=csvLine([s.periodo,s.tempo,s.sai,s.entra,s.data]);
 });
 csv+="\\n";

 csv+="MINUTOS JOGADOS\\n";
 csv+=csvLine(["Atleta",...periodos,"Total"]);
 Object.entries(minutos).forEach(([j,m])=>{
  csv+=csvLine([j,...periodos.map(p=>minutosTexto(m[p]||0)),minutosTexto(m.total||0)]);
 });

 let blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
 let url=URL.createObjectURL(blob);
 let a=document.createElement("a");
 a.href=url;
 a.download="excel_"+casa+"_vs_"+fora+".csv";
 a.click();
 URL.revokeObjectURL(url);
}