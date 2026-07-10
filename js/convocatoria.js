/* StatS — convocatoria.js
   Módulo separado automaticamente a partir do ficheiro original.
   Carregado antes de app.js.
*/

function saveConvocatoria(){
 convocatoria.adversario=($("convAdversario")?.value||"").trim();
 convocatoria.competicao=($("convCompeticao")?.value||"").trim();
 convocatoria.data=$("convData")?.value||"";
 convocatoria.horaJogo=$("convHoraJogo")?.value||"";
 convocatoria.obs=($("convObs")?.value||"").trim();
 localStorage.setItem("convocatoria_pasteis",JSON.stringify(convocatoria));
}

function openConvocatoria(){
 pause();

 if($("landingPage"))$("landingPage").classList.add("hidden");
 if($("menuPage"))$("menuPage").classList.add("hidden");
 if($("main"))$("main").classList.add("hidden");
 if($("trainingPage"))$("trainingPage").classList.add("hidden");
 if($("settingsPage"))$("settingsPage").classList.add("hidden");
 if($("convocatoriaPage"))$("convocatoriaPage").classList.remove("hidden");

 loadConvocatoria();
 renderConvocatoria();
}

function closeConvocatoria(){
 saveConvocatoria();

 if($("convocatoriaPage"))$("convocatoriaPage").classList.add("hidden");
 if($("menuPage"))$("menuPage").classList.remove("hidden");
}

function loadConvocatoria(){
 if($("convAdversario"))$("convAdversario").value=convocatoria.adversario||"";
 if($("convCompeticao"))$("convCompeticao").value=convocatoria.competicao||"";
 if($("convData"))$("convData").value=convocatoria.data||"";
 if($("convHoraJogo"))$("convHoraJogo").value=convocatoria.horaJogo||"";
 if($("convObs"))$("convObs").value=convocatoria.obs||"";
}

function renderConvocatoria(){renderConvHoras();renderConvLocais();renderConvJogadoras();renderConvTecnica();renderConvPreview()}

function addHoraConv(){convocatoria.horas.push("");saveConvocatoria();renderConvHoras();renderConvPreview()}

function updateHoraConv(i,v){convocatoria.horas[i]=v;saveConvocatoria();renderConvPreview()}

function removeHoraConv(i){convocatoria.horas.splice(i,1);saveConvocatoria();renderConvHoras();renderConvPreview()}

function renderConvHoras(){
 let box=$("convHorasLista");if(!box)return;
 if(!convocatoria.horas.length){box.innerHTML="<div class='log'>Ainda não adicionaste horas de concentração.</div>";return}
 box.innerHTML=convocatoria.horas.map((h,i)=>`<div class="convListItem"><input type="time" value="${h||""}" onchange="updateHoraConv(${i},this.value)"><button onclick="removeHoraConv(${i})">🗑️</button></div>`).join("");
}

function addLocalConv(){convocatoria.locais.push("");saveConvocatoria();renderConvLocais();renderConvPreview()}

function updateLocalConv(i,v){convocatoria.locais[i]=v;saveConvocatoria();renderConvPreview()}

function removeLocalConv(i){convocatoria.locais.splice(i,1);saveConvocatoria();renderConvLocais();renderConvPreview()}

function renderConvLocais(){
 let box=$("convLocaisLista");if(!box)return;
 if(!convocatoria.locais.length){box.innerHTML="<div class='log'>Ainda não adicionaste localizações.</div>";return}
 box.innerHTML=convocatoria.locais.map((l,i)=>`<div class="convListItem"><input placeholder="Localização" value="${String(l||"").replace(/"/g,"&quot;")}" oninput="updateLocalConv(${i},this.value)"><button onclick="removeLocalConv(${i})">🗑️</button></div>`).join("");
}

function toggleConvocada(nome){convocatoria.convocadas=convocatoria.convocadas.includes(nome)?convocatoria.convocadas.filter(x=>x!==nome):[...convocatoria.convocadas,nome];saveConvocatoria();renderConvJogadoras();renderConvPreview()}

function renderConvJogadoras(){
 let box=$("convJogadorasLista");if(!box)return;let lista=jogadores&&jogadores.length?jogadores:treinoJogadores;
 box.innerHTML=lista.map(j=>{
  let tipo=tipoJogador(j);
  return `<button class="convCheck ${convocatoria.convocadas.includes(j)?"active":""}" onclick="toggleConvocada('${esc(j)}')">${convocatoria.convocadas.includes(j)?"☑":"☐"} ${j}<br><span class="convSmallText">${tipo==="gr"?"Guarda-redes":"Jogadora"}</span></button>`;
 }).join("");
}

function selecionarTodasConv(){let lista=jogadores&&jogadores.length?jogadores:treinoJogadores;convocatoria.convocadas=[...lista];saveConvocatoria();renderConvJogadoras();renderConvPreview()}

function limparConvocadas(){convocatoria.convocadas=[];saveConvocatoria();renderConvJogadoras();renderConvPreview()}

function toggleTecnicaConv(nome){convocatoria.tecnica=convocatoria.tecnica.includes(nome)?convocatoria.tecnica.filter(x=>x!==nome):[...convocatoria.tecnica,nome];saveConvocatoria();renderConvTecnica();renderConvPreview()}

function renderConvTecnica(){
 let box=$("convTecnicaLista");if(!box)return;
 if(!treinoTreinadores.length){box.innerHTML="<div class='log'>Adiciona primeiro membros da Equipa Técnica na página Treino.</div>";return}
 box.innerHTML=treinoTreinadores.map(m=>`<button class="convCheck ${convocatoria.tecnica.includes(m.nome)?"active":""}" onclick="toggleTecnicaConv('${esc(m.nome)}')">${convocatoria.tecnica.includes(m.nome)?"☑":"☐"} ${m.nome}<br><span class="convSmallText">${m.funcao||"Equipa Técnica"}</span></button>`).join("");
}

function selecionarTodaTecnicaConv(){convocatoria.tecnica=treinoTreinadores.map(m=>m.nome);saveConvocatoria();renderConvTecnica();renderConvPreview()}

function limparTecnicaConv(){convocatoria.tecnica=[];saveConvocatoria();renderConvTecnica();renderConvPreview()}

function formatarDataConv(data){if(!data)return "-";let p=data.split("-");if(p.length!==3)return data;return `${p[2]}/${p[1]}/${p[0]}`}

function renderConvPreview(){
 let box=$("convPreview");if(!box)return;
 let adv=convocatoria.adversario||"Adversário",comp=convocatoria.competicao||"Futebol Praia",data=formatarDataConv(convocatoria.data),hora=convocatoria.horaJogo||"-";
 let horas=(convocatoria.horas||[]).filter(Boolean),locais=(convocatoria.locais||[]).filter(Boolean);
 box.innerHTML=`<div class="convPreview"><div class="convPreviewTitle">AD PASTÉIS</div><div class="convPreviewSub">DIA DE JOGO · FUTEBOL PRAIA</div><div class="convPreviewBox" style="text-align:center"><b>AD Pastéis vs ${adv}</b><br>${comp}<br>${data} · ${hora}</div><div class="convPreviewBox"><b>Concentração</b><br>${horas.length?horas.map(h=>"🕒 "+h).join("<br>"):"-"}</div><div class="convPreviewBox"><b>Localizações</b><br>${locais.length?locais.map(l=>"📍 "+l).join("<br>"):"-"}</div><div class="convPreviewBox"><b>Convocadas</b><br><div class="convTwoCols">${(convocatoria.convocadas||[]).length?convocatoria.convocadas.map(j=>"• "+j).join("<br>"):"-"}</div></div><div class="convPreviewBox"><b>Equipa Técnica</b><br>${(convocatoria.tecnica||[]).length?convocatoria.tecnica.map(n=>{let m=treinoTreinadores.find(t=>t.nome===n);return "• "+n+(m&&m.funcao?" — "+m.funcao:"")}).join("<br>"):"-"}</div>${convocatoria.obs?`<div class="convPreviewBox"><b>Observações</b><br>${convocatoria.obs}</div>`:""}</div>`;
}

function textoConvocatoria(){
 let temp=document.createElement("div");renderConvPreview();
 let adv=convocatoria.adversario||"Adversário",comp=convocatoria.competicao||"Futebol Praia",data=formatarDataConv(convocatoria.data),hora=convocatoria.horaJogo||"-";
 let horas=(convocatoria.horas||[]).filter(Boolean).map(h=>`🕒 ${h}`).join("\\n");
 let locais=(convocatoria.locais||[]).filter(Boolean).map(l=>`📍 ${l}`).join("\\n");
 let convs=(convocatoria.convocadas||[]).map(j=>`• ${j}`).join("\\n");
 let tec=(convocatoria.tecnica||[]).map(n=>{let m=treinoTreinadores.find(t=>t.nome===n);return `• ${n}${m&&m.funcao?` — ${m.funcao}`:""}`}).join("\\n");
 return `AD PASTÉIS\\nDIA DE JOGO\\n\\nAD Pastéis vs ${adv}\\n${comp}\\n${data} · ${hora}\\n\\n${horas?`CONCENTRAÇÃO\\n${horas}\\n\\n`:""}${locais?`LOCALIZAÇÕES\\n${locais}\\n\\n`:""}CONVOCADAS\\n${convs||"-"}\\n\\nEQUIPA TÉCNICA\\n${tec||"-"}\\n\\n${convocatoria.obs?`OBSERVAÇÕES\\n${convocatoria.obs}`:""}`;
}

function copiarConvocatoriaWhatsApp(){saveConvocatoria();let texto=textoConvocatoria();if(navigator.clipboard){navigator.clipboard.writeText(texto).then(()=>alert("Texto da convocatória copiado para WhatsApp."))}else{alert(texto)}}