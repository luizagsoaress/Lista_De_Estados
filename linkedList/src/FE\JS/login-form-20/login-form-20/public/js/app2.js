"use strict"

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, connectAuthEmulator, deleteUser} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDoc, query, where, getDocs} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxx",
  authDomain: "xxxxxxxxxx-xxxxx.firebaseapp.com",
  projectId: "xxxxxxxxxx-xxxxx",
  storageBucket: "xxxxxxxxxx-xxxxx.firebasestorage.app",
  messagingSenderId: "xxxxxxxxxxxx",
  appId: "x:xxxxxxxxxxxx:xxx:xxxxxxxxxxxxxxxxxxxxxx"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let estadosCarregados = false;

onAuthStateChanged(auth, (user) => {
  if (user) {
  if (!estadosCarregados) {
  carregarEstados();
  estadosCarregados = true;
  mostraUsuario();
  }
  } else {
  estadosCarregados = false;
  }
});

async function addDocUsuario(estado, id){
  const user = auth.currentUser; 
  if (!user) return;
  try {
  const q = query(
  collection(db, "users"),
  where("userId", "==", user.uid),
  where("id", "==", id)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
  return;
  }
  const docRef = await addDoc(collection(db, "users"), {
    estado: estado,
    id: id,
    userId: user.uid
  });
  } catch (e) {
  console.error("Erro ao adicionar: ", e);
  }
  }

  async function carregarEstados(){
  const user = auth.currentUser;
  if (!user) return;
  try {
  const q = query(
  collection(db, "users"),
  where("userId", "==", user.uid)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
  const data = doc.data();
  desenharEstadoDiv(data.estado, data.id);
  });
  } catch (e) {
  console.error("Erro:", e);
  }
}
  

function mostraUsuario(){
  const user = auth.currentUser;
  const nome = document.getElementById("nome-usuario");
  if(user){
  const nomeUsuario = (user.displayName || "Usuário").split(" ")[0];
  nome.textContent = nomeUsuario;
  }
  else {
  nome.textContent = "Usuário";
  }
}
 
const form1 = document.getElementById("form1");
const form2 = document.getElementById("form2");

document.addEventListener('DOMContentLoaded', function() {
const btnPlus = document.getElementById("btn-plus");
if (btnPlus && form1 && form2) {
  btnPlus.addEventListener("click", function(event) {
  event.preventDefault();
  form1.style.display = "none";
  form2.style.display = "block";
});
}

function deletarConta(){
  document.getElementById("deletar").addEventListener("click", function() {
  const user = auth.currentUser;
  deleteUser(user).then(() => {
  desenharAlerta("Sua conta foi deletada com sucesso", "sucesso");
  setTimeout(() => {
  window.location.href = "index.html";
  }, 2000);
}).catch((error) => {
  if(error.code === "auth/requires-recent-login"){
  desenharAlerta("Por segurança, faça login novamente antes de deletar a conta.","erro");
  }
  else{
  desenharAlerta("Falha ao deletar conta. Tente novamente.", "erro");
  }
});
});
}
deletarConta();

document.getElementById("btn-mapa").addEventListener("click", function(event) {
  event.preventDefault();
  const modal = new bootstrap.Modal(document.getElementById("mapaModal"));
  modal.show();
  });
});

const estadoSelect = document.getElementById("estados");
 
function chamadaApiOrdenar(){
  const container = document.getElementById("div-desenho");
  const nomes = Array.from(container.children).map(div => div.id);
  fetch("http://xxx.xxx.x.xxx:xxxx/ordenar", {
  method: "POST",
  headers: { "Content-Type": "application/json"},
  body: JSON.stringify({ itens: nomes })
  })
  .then(res => res.json())
  .then(resposta => {
  const container = document.getElementById("div-desenho");
  resposta.forEach(nome => {
  const div = document.getElementById(nome.trim());
  if (div) container.appendChild(div);   
  });
  })
  .catch(erro => console.error("Erro ao ordenar."));
}

function desenharAlerta(texto, tipo) {
  const div = document.createElement("div");
  div.style.position = "fixed";
  div.style.left = "50%";
  div.style.top = "20%";
  div.style.width = "50%";
  div.style.maxWidth = "500px";
  div.style.maxHeight = "250px";
  div.style.minWidth = "400px";
  div.style.minHeight = "80px";
  div.style.height = "10%";
  div.style.borderRadius = "30px";
  div.style.padding = "15px 25px";
  div.style.lineHeight = '30px';
  div.style.color = "#fff";
  div.style.fontWeight = "bold";
  div.style.display = "flex";
  div.style.textAlign = "center";
  div.style.justifyContent = "center";
  div.style.alignItems = "center";
  div.textContent = texto;
  div.style.boxShadow = "0 3px 10px rgba(0, 0, 0, 0.1)";
  div.style.transition = "opacity 1s ease-in-out, transform 1s ease-in-out";
  div.style.opacity = "0";
  div.style.transform = "translate(-50%, -50%) scale(0.9)";
  if(window.innerWidth < 992){
  div.style.fontSize = "4vw";
  }
  if (tipo === "sucesso") {
  div.style.backgroundColor = "#4CAF50";
  } else if (tipo === "erro") {
  div.style.backgroundColor = "#f44336";
  }
  document.body.appendChild(div);
  setTimeout(() => {
  div.style.opacity = 1;
  div.style.transform = "translate(-50%, -60%) scale(0.9)";
  }, 10);
  setTimeout(() => {
  div.style.opacity = 0;
  div.style.transform = "translate(-50%, -60%) scale(0.9)";
  }, 2000);
  setTimeout(() => {
  div.remove();
  }, 3000);
}

function desenharEstadoDiv(estado){
  const btn = document.createElement("button");
  btn.id = `${estado}`;
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.margin = "20px auto";
  btn.style.width = "90vw";
  btn.style.height = "13vh";
  btn.style.border = "2px solid black";
  btn.style.backgroundColor = "white";
  btn.style.boxShadow = "0px 0px 10px rgb(250, 146, 11)";
  btn.textContent = estado;
  btn.style.fontWeight = "bold";
  const divDesenho = document.getElementById("div-desenho");
  divDesenho.appendChild(btn); 
  addDocUsuario(estado, btn.id);

btn.addEventListener("click", function(event) {
  event.preventDefault();
  fetch("info.json")
  .then(response => response.json())
  .then(data => {
  const info = data.categorias[estado];

  document.getElementById("subtitleModal").textContent = info.subtitulo; 
  document.getElementById("textCapitalModal").textContent = info.descricao.capital;
  document.getElementById("textGovernadorModal").textContent = info.descricao.governador;
    
  document.getElementById("textPopulacaoUltimoCensoModal").textContent = info.descricao.populacao.populacao_ultimo_censo;
  document.getElementById("textPopulacaoEstimadaModal").textContent = info.descricao.populacao.populacao_estimada;
  document.getElementById("textDensidadeDemograficaModal").textContent = info.descricao.populacao.densidade_demografica;
  document.getElementById("textTotalDeVeiculosModal").textContent = info.descricao.populacao.total_de_veiculos;

  document.getElementById("textIdebAnosIniciaisModal").textContent = info.descricao.educacao.ideb_anos_iniciais;
  document.getElementById("textIdebAnosFinaisModal").textContent = info.descricao.educacao.ideb_anos_finais;
  document.getElementById("textMatriculasFudamentalModal").textContent = info.descricao.educacao.matriculas_fundamental;
  document.getElementById("textMatriculasEnsinoMedioModal").textContent = info.descricao.educacao.matriculas_ensino_medio;
  document.getElementById("textDocentesEnsinoFundamentalModal").textContent = info.descricao.educacao.docentes_ensino_fundamental;
  document.getElementById("textDocentesEnsinoMedioModal").textContent = info.descricao.educacao.docentes_ensino_medio;
  document.getElementById("textNumeroEstabelecimentoFundamentalModal").textContent = info.descricao.educacao.numero_estabelecimento_fundamental;
  document.getElementById("textNumeroEstabelecimentoMedioModal").textContent = info.descricao.educacao.numero_estabelecimento_medio;

  document.getElementById("textRendimentoNominalModal").textContent = info.descricao.rendimento_nominal;
  document.getElementById("textPessoas16oumaisOcupadasSemanaReferenciaModal").textContent = info.descricao.trabalho_e_rendimento.pessoas_16oumais_ocupadas_semana_referencia;
  document.getElementById("textPessoas16oumaisTrabalhoFormalModal").textContent = info.descricao.trabalho_e_rendimento.pessoas_16oumais_trabalho_formal;
  document.getElementById("textPessoas14oumaisOcupadasSemanaReferenciaModal").textContent = info.descricao.trabalho_e_rendimento.pessoas_14oumais_ocupadas_semana_referencia;
  document.getElementById("textRendimentoRealMedioModal").textContent = info.descricao.trabalho_e_rendimento.rendimento_real_medio;
  document.getElementById("textPessoalOcupadoAdministracaoModal").textContent = info.descricao.trabalho_e_rendimento.pessoal_ocupado_administracao;

  document.getElementById("textIndiceDesenvolvimentoHumanoModal").textContent = info.descricao.economia.indice_desenvolvimento_humano;
  document.getElementById("textTotalReceitaBrutaModal").textContent = info.descricao.economia.total_receita_bruta;
  document.getElementById("textTotalReceitaEmpenhadasModal").textContent = info.descricao.economia.total_receita_empenhadas;
  document.getElementById("textNumeroAgenciaModal").textContent = info.descricao.economia.numero_agencia;
  document.getElementById("textDepositosPrazoModal").textContent = info.descricao.economia.depositos_prazo;
  document.getElementById("textDepositosVistaModal").textContent = info.descricao.economia.depositos_vista;

  document.getElementById("textNumeroMunicipiosModal").textContent = info.descricao.territorio.numero_municipios;
  document.getElementById("textAreaUnidadeTerritorialModal").textContent = info.descricao.territorio.area_unidade_territorial;
  document.getElementById("textAreaUrbanizadaModal").textContent = info.descricao.territorio.area_urbanizada;
    
  const modal = new bootstrap.Modal(document.getElementById("infoModal"));
  modal.show();
  })
  .catch(error => {
  desenharAlerta("Erro ao acessar as informações.", "erro");
  });
});

}

let original = [];

document.getElementById("btn-adicionar").addEventListener("click", function(){
  const divId = document.getElementById("estados").options[document.getElementById("estados").selectedIndex].text;
  if(document.getElementById(divId)){
  desenharAlerta("Você já adicionou este estado.", "erro");
  return;
  }
  const divs = Array.from(document.getElementById("div-desenho").children);
  original = divs.map(d => d.id); 
  let estadoSelect = document.getElementById("estados").value;
  if(!estadoSelect){
  document.getElementById("alert-danger").style.display = "block";
  setTimeout(() => {
  document.getElementById("alert-danger").style.display = "none";
  }, 3000);
  }else{
  form2.style.display = "none";
  estadoSelect = document.getElementById("estados").options[document.getElementById("estados").selectedIndex].text;
  form1.style.display = "block";
  desenharEstadoDiv(estadoSelect);
  chamadaApiOrdenar();
}
}); 

document.getElementById("btn-inverse").addEventListener("click", function(){
  const container = document.getElementById("div-desenho");
  const divs = Array.from(container.children);
  divs.reverse().forEach(div => container.appendChild(div));
}); 

document.getElementById("sobre").addEventListener("click", function(event) {
  event.preventDefault();
  fetch("sobre.json")
  .then(response => response.json())
  .then(data => {
  document.getElementById("sobreModal").style.display = "block";
  document.getElementById("textModal").textContent = data.descricao;
})
  .catch(error => console.log("Erro ao abrir arquivo JSON."));
});

document.getElementById("sair").addEventListener("click", function(event) {
  event.preventDefault();
  deslogar();
});

function deslogar(){
  signOut(auth).then(() => {
  window.location.href = "index.html";
}).catch((error) => {
  alert("Erro ao sair. Tente novamente.");
})
}



