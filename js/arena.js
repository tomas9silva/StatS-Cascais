/* StatS — arena.js
   Módulo separado automaticamente a partir do ficheiro original.
   Carregado antes de app.js.
*/

function actionIconHTML(nome,emoji){
 let cls="iconGoal",txt="G";
 if(nome==="Golo"){cls="iconGoal";txt="G";}
 else if(nome==="Remate"){cls="iconShot";txt="R";}
 else if(nome==="Assistência"){cls="iconAssist";txt="A";}
 else if(nome==="Defesa"){cls="iconDefense";txt="D";}
 else if(nome==="Recuperação de bola"){cls="iconRecover";txt="REC";}
 else if(nome==="Perda de bola"){cls="iconLoss";txt="PER";}
 else if(nome==="Passe falhado"){cls="iconFail";txt="PF";}
 else if(nome==="Expulsão"){cls="iconRed";txt="EXP";}
 else if(String(nome).startsWith("Golo")){cls=nome==="Golo sofrido"?"iconRed":"iconGoal";txt=nome==="Golo sofrido"?"GS":"G";}
 else if(String(nome).startsWith("Remate")){cls="iconShot";txt="R";}
 return `<span class="actionLabel"><span class="iconBadge ${cls}">${txt}</span><span>${nome}</span></span>`;
}

function pickMap(e){
 let pitch=$("pitch");
 if(!pitch)return;

 let r=pitch.getBoundingClientRect();

 flow={
  x:Math.round(((e.clientX-r.left)/r.width)*100),
  y:Math.round(((e.clientY-r.top)/r.height)*100),
  jogador:null,
  acao:null,
  step:"player"
 };

 abrirPopupJogadores();
 renderMap();
}

function chooseActionPrincipal(tipo){
 flow.tipoPrincipal=tipo;

 if(tipo==="Golo"){
  abrirPopupTiposGolo();
  return;
 }

 if(tipo==="Remate"){
  abrirPopupTiposRemate();
  return;
 }

 flow.acao=tipo;
 flow.emoji=acaoObj(tipo).emoji;
 confirmarAcaoRapida();
}

function chooseAction(a){
 flow.acao=a;
 confirmarAcaoRapida();
}

function desenharCampoEventos(eventos){
 let html='<div class="miniPitch"><div class="miniQuarter q1"></div><div class="miniQuarter q3"></div><div class="miniArea leftMini"></div><div class="miniArea rightMini"></div>';

 eventos.forEach(obj=>{
  let r=obj.r || obj;
  let idx=obj.regIndex;
  let click = idx!==undefined ? `onclick="openStatEvent(${idx})"` : "";
  let zona=(r.x!==""&&r.x!==undefined&&r.y!==""&&r.y!==undefined)?getZonaCampo(Number(r.x),Number(r.y),r.attackSide||attackSide):"-";

  html+=`<span class="miniEmoji" ${click} style="left:${r.x}%;top:${r.y}%" title="${r.jogador} - ${r.acao} · ${zona}">${r.emoji||acaoObj(r.acao).emoji}</span>`;
 });

 html+='</div>';
 return html;
}

function zonaCampo(x){
 if(x<33)return "Zona defensiva";
 if(x<66)return "Meio-campo";
 return "Zona ofensiva";
}

function getZonaCampo(x,y,ladoAtaque){
 x=Number(x);
 y=Number(y);
 ladoAtaque=ladoAtaque||"right";

 let corredor=y<50?"Esquerda":"Direita";
 let faixa;

 if(ladoAtaque==="right"){
  if(x<25)faixa="Defesa";
  else if(x<50)faixa="Construção";
  else if(x<75)faixa="Criação";
  else faixa="Finalização";
 }else{
  if(x<25)faixa="Finalização";
  else if(x<50)faixa="Criação";
  else if(x<75)faixa="Construção";
  else faixa="Defesa";
 }

 return faixa+" "+corredor;
}

function zonaMaisUsada(){
 let eventos=reg.filter(r=>r.x!==""&&r.x!==undefined);
 let zonas={"Zona defensiva":0,"Meio-campo":0,"Zona ofensiva":0};
 eventos.forEach(r=>zonas[zonaCampo(Number(r.x))]++);
 let top=Object.entries(zonas).sort((a,b)=>b[1]-a[1])[0];
 return top&&top[1]>0?`${top[0]} (${top[1]})`:"-";
}

function zonaEvento(r){
 if(!r || r.x==="" || r.x===undefined || r.y==="" || r.y===undefined)return "-";
 if(typeof getZonaCampo==="function")return getZonaCampo(Number(r.x),Number(r.y),r.attackSide||attackSide);
 return `X:${r.x}% Y:${r.y}%`;
}

function ladoAtaquePeriodo(periodo){
 let eventos=reg.filter(r=>r.periodo===periodo && r.attackSide);
 if(!eventos.length)return attackSide||"right";
 let left=eventos.filter(r=>r.attackSide==="left").length;
 let right=eventos.filter(r=>r.attackSide==="right").length;
 return left>right?"left":"right";
}

function pickMiniArenaIndividual(event,exId){
 let rect=event.currentTarget.getBoundingClientRect();

 treinoIndividualTemp={
  exercicioId:exId,
  x:Math.round(((event.clientX-rect.left)/rect.width)*100),
  y:Math.round(((event.clientY-rect.top)/rect.height)*100),
  jogador:null
 };

 openIndividualJogador(exId);
}

function pickMiniArena(event,exId){
 let rect=event.currentTarget.getBoundingClientRect();
 treinoAcaoTemp={
  exercicioId:exId,
  x:Math.round(((event.clientX-rect.left)/rect.width)*100),
  y:Math.round(((event.clientY-rect.top)/rect.height)*100)
 };
 escolherAcaoMiniArena(exId);
}

function escolherAcaoMiniArena(exId){
 let ex=exerciciosTreino.find(e=>e.id===exId);
 if(!ex)return;
 let modal=$("quickModal");
 let title=$("quickTitle");
 let content=$("quickContent");

 title.innerHTML=ex.nome;

 content.innerHTML="<div class='grid'>"+
  acoes.map(a=>`<button class="actionBtn dark" onclick="addTreinoActionComPonto(${exId},'${esc(a.nome)}')">${a.emoji} ${a.nome}</button>`).join("")+
 "</div>";

 modal.classList.add("show");
}

function shortcutArenaAction(tipo){
 if(!flow.x || !flow.y){
  alert("Clica primeiro no local da arena e depois escolhe a ação.");
  return;
 }
 if(!flow.jogador){
  abrirPopupJogadores();
  return;
 }
 chooseActionPrincipal(tipo);
}