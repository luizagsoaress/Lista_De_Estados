"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, connectAuthEmulator, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, setPersistence, browserSessionPersistence, browserLocalPersistence, inMemoryPersistence, onAuthStateChanged} 
from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

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
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

onAuthStateChanged(auth, (user) => {
  if (user) {
   window.location.href = "principal.html";
  }
});

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
  }, 8000);
  setTimeout(() => {
    div.remove();
  }, 9000);
}

let loginAndamentoGoogle = false;
function loginGoogle(){
if(loginAndamentoGoogle){
    alert("Ops, vá mais devagar...");
    return;
}
loginAndamentoGoogle = true;
signInWithPopup(auth, googleProvider)
.then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    window.location.href = "principal.html";
})
.catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email; 
    const credential = GoogleAuthProvider.credentialFromError(error);
    if(errorCode != "auth/cancelled-popup-request" && errorCode != "auth/popup-closed-by-user"){
        desenharAlerta("Sinto muito, tente novamente. Código de erro:" + errorCode, "erro");
    }
})
.finally(() => {
    loginAndamentoGoogle = false;
});
}

function loginGitHub(){
signInWithPopup(auth, githubProvider)
  .then((result) => {
    const credential = GithubAuthProvider.credentialFromResult(result);
    const user = result.user;
    window.location.href = "principal.html";
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GithubAuthProvider.credentialFromError(error);
    desenharAlerta("Sinto muito, tivemos um problema aqui. Tente novamente mais tarde. Código de erro: " + errorCode, "erro");
  });
}

function loginEmailSenha(email, password){
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    window.location.href = "principal.html";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if(errorCode === "auth/invalid-json-payload-received.-/email-must-be-string"){
    desenharAlerta("E-mail ou senha incorretos", "erro");
    }
    if(errorCode === "auth/invalid-credential"){
    desenharAlerta("E-mail ou senha incorretos.", "erro");
    }
    else{
      desenharAlerta("Sinto muito, ocorreu um erro. Tente novamente mais tarde. Código de erro: " + errorCode, "erro");
    }
  });
}

function criarEmailSenha(email, password){
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    window.location.href = "principal.html";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if(errorCode === "auth/invalid-email"){
    desenharAlerta("E-mail inválido.", "erro");
    }
    if(errorCode === "auth/email-already-in-use"){
    desenharAlerta("E-mail já utilizado, faça login.", "erro");
    }
    if(errorCode === "auth/weak-password"){
    desenharAlerta("A senha precisa ter 6 ou mais digitos.", "erro");
    }
    else{
    desenharAlerta("Sinto muito, ocorreu um erro. Tente novamente mais tarde. Código de erro: " + errorCode, "erro");
    }
  });
}

function resetarSenha(email){
sendPasswordResetEmail(auth, email)
  .then(() => {
    desenharAlerta("E-mail enviado. Caso necessário, verifique sua caixa de spam.", "sucesso");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if (errorCode === "auth/user-not-found") {
    desenharAlerta("Este e-mail não está cadastrado.", "erro");
    }else {
    desenharAlerta("Ops, tivemos um problema por aqui.", "erro");
    } 
  });
}
  
const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastro");
const formRecuperar = document.getElementById("formRecuperar");
const form1 = document.getElementById("form1");
const form2 = document.getElementById("form2");

  document.getElementById("btn-cadastro").addEventListener("click", function(event) {
  event.preventDefault();
  formCadastro.style.display = "block";
  formLogin.style.display = "none";
  document.getElementById("titulo-principal").textContent = "Crie uma conta";
  });

  document.getElementById("btn-voltar-login").addEventListener("click", function(event) {
  event.preventDefault();
  formCadastro.style.display = "none";
  formRecuperar.style.display = "none";
  formLogin.style.display = "block";
  document.getElementById("titulo-principal").textContent = "Faça login";
  });

  document.getElementById("btn-voltar-login-2").addEventListener("click", function(event) {
  event.preventDefault();
  formCadastro.style.display = "none";
  formRecuperar.style.display = "none";
  formLogin.style.display = "block";
  document.getElementById("titulo-principal").textContent = "Faça login";
  });
  
  
  document.getElementById("esqueci-senha").addEventListener("click", function(event) {
  event.preventDefault();
  formLogin.style.display = "none";
  formCadastro.style.display = "none";
  formRecuperar.style.display = "block";
  document.getElementById("titulo-principal").textContent = "Recuperar senha";
  });

  document.getElementById("btn-recuperar-ok").addEventListener("click", function (event) {
  event.preventDefault();
  const email = document.getElementById("input-email-recuperar").value;
  resetarSenha(email);
  });
  
document.addEventListener('DOMContentLoaded', function() {

  document.getElementById("formLogin").addEventListener("submit", function(event) {
  event.preventDefault();
  const email = document.getElementById("input-email-login").value.trim();
  const password = document.getElementById("password-field-login").value.trim();
  loginEmailSenha(email, password);
  });
 
  document.getElementById("formCadastro").addEventListener("submit", function(event) {
  event.preventDefault();
  const email = document.getElementById("input-email-cadastro").value.trim();
  const password = document.getElementById("password-field-cadastro").value.trim();
  criarEmailSenha(email, password);
  });
});

window.loginGoogle = loginGoogle;
window.loginGitHub = loginGitHub;
window.loginEmailSenha = loginEmailSenha;