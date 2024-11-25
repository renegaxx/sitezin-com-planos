import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import { app, db } from './script.js'; // Certifique-se de que o caminho está correto

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid); // Busca documento do usuário pelo uid
        getDoc(userRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    // Exibe as informações do usuário
                    document.getElementById("fullName").innerText = userData.fullName;
                    document.getElementById("username").innerText = userData.username;
                    document.getElementById("user-email").innerText = userData.email;

                    // Verifica se o usuário é um Criador e exibe
                    if (userData.criador) {
                        document.getElementById("criador-status").innerText = "Status: Criador";
                    } else if (userData.status === "colaborador") {
                        document.getElementById("criador-status").innerText = "Status: Colaborador";
                    } else {
                        document.getElementById("criador-status").innerText = "Status: Não Definido";
                    }
                } else {
                    console.log("Usuário não encontrado no Firestore");
                }
            })
            .catch((error) => {
                console.log("Erro ao recuperar dados do Firestore:", error);
            });
    } else {
        console.log("Usuário não está logado.");
        window.location.href = "LoginCadastro.html"; // Redireciona caso não esteja logado
    }
});

// Função para atualizar o papel do usuário no Firestore e redirecionar
function updateUserRole(role) {
    const user = auth.currentUser;
    if (!user) {
        console.error("Usuário não está logado.");
        alert("Por favor, faça login para continuar.");
        return;
    }

    const userRef = doc(db, "users", user.uid);

    getDoc(userRef)
        .then((docSnap) => {
            if (!docSnap.exists()) {
                console.error("Documento do usuário não encontrado no Firestore.");
                alert("Dados do usuário não encontrados.");
                return;
            }

            const userData = docSnap.data();
            console.log("Dados do usuário recuperados:", userData);
            

            // Define o campo correto para atualizar
            const updateData = role === "criador" ? { criador: true } : { status: "colaborador" };

            // Atualiza o Firestore
            updateDoc(userRef, updateData)
                .then(() => {
                    alert(`Você agora é ${role === "criador" ? "Criador" : "Colaborador"}!`);
                    console.log("Dados do usuário atualizados com sucesso no Firestore.");

                    // Redireciona após salvar com sucesso
                    window.location.href = "PaginaVendas.html";
                })
                .catch((error) => {
                    console.error("Erro ao atualizar o Firestore:", error);
                    alert("Erro ao salvar as alterações. Tente novamente mais tarde.");
                });
        })
        .catch((error) => {
            console.error("Erro ao verificar o status do usuário no Firestore:", error);
        });
}

// Adiciona o evento de clique ao botão
document.getElementById("confirm-btn").addEventListener("click", () => {
    console.log("Botão 'Sim, quero ser Criador' clicado.");
    updateUserRole("criador");
});


// Clique no botão "Download" (definir como Colaborador)
document.getElementById("download").addEventListener("click", () => updateUserRole("colaborador"));


// ANIMAÇÃO DAS JANELAS DE BOAS VINDAS
document.addEventListener("DOMContentLoaded", function () {
    // Animar o título de boas-vindas
    const welcomeMessage = document.getElementById("welcome-message");

    // Quando a animação terminar, vamos mover o conteúdo para o topo
    welcomeMessage.addEventListener("animationend", function () {
        // Adiciona a classe para mover o conteúdo para o topo
        document.getElementById("welcome-container").classList.add("animated");
    });

    // Clique no botão "Colaborador"
    document.getElementById("collaborator-btn").addEventListener("click", function () {
        // Esconde todos os elementos de seleção de função
        document.getElementById("role-selection").style.display = "none";

        // Exibe a nova div personalizada com animação
        const customContainer = document.getElementById("custom-container");
        customContainer.style.display = "flex";  // Exibe o contêiner

        // Adiciona a classe para ativar a animação de deslizar para cima
        setTimeout(() => {
            customContainer.classList.add("show");
        }, 10); // Um pequeno delay para garantir que o display esteja definido como 'flex' antes de animar
    });

    // Fecha a div personalizada quando o botão de fechar é clicado
    document.getElementById("close-btn").addEventListener("click", function () {
        // Remove a classe para animar de volta para baixo
        const customContainer = document.getElementById("custom-container");
        customContainer.classList.remove("show");

        // Espera a animação de fechamento para esconder o contêiner
        setTimeout(() => {
            customContainer.style.display = "none";  // Esconde a div personalizada

            // Exibe novamente os botões de seleção de função com opacidade e transição ajustadas
            const roleSelection = document.getElementById("role-selection");
            roleSelection.style.display = "flex";
            roleSelection.style.opacity = "1";
            roleSelection.style.visibility = "visible";
        }, 500); // Tempo de duração da animação
    });

    // Seleciona os elementos para o criador
    const creatorBtn = document.getElementById("creator-btn");
    const roleSelection = document.getElementById("role-selection");
    const confirmationScreen = document.getElementById("confirmation-screen");
    const confirmBtn = document.getElementById("confirm-btn");
    const cancelBtn = document.getElementById("cancel-btn");

    // Evento de clique para o botão "Criador"
    creatorBtn.addEventListener("click", function () {
        // Esconde a tela de seleção de papel
        roleSelection.style.display = "none";
        // Exibe a tela de confirmação
        confirmationScreen.style.display = "block";
    });


    // Evento de clique para o botão de cancelar
    cancelBtn.addEventListener("click", function () {
        // Volta para a tela de seleção de papel com a opacidade e a visibilidade ajustadas
        confirmationScreen.style.display = "none";
        roleSelection.style.display = "flex";
        roleSelection.style.opacity = "1";
        roleSelection.style.visibility = "visible";
    });
});



// Função para atualizar os gostos no Firestore
async function updateGostosUsuario(gostosSelecionados) {
    const user = auth.currentUser;
    if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userRef, { gostos: gostosSelecionados });
            console.log("Gostos atualizados:", gostosSelecionados);
        } catch (error) {
            console.error("Erro ao atualizar gostos:", error);
        }
    } else {
        console.log("Usuário não autenticado.");
    }
}

// Adiciona evento de clique para cada item
document.querySelectorAll(".gosto-item").forEach((item) => {
    item.addEventListener("click", async (e) => {
        e.preventDefault();

        // Alterna a seleção
        item.classList.toggle("selected");

        // Coleta os gostos selecionados
        const gostosSelecionados = Array.from(document.querySelectorAll(".gosto-item.selected"))
            .map(el => el.getAttribute("data-gosto"));

        // Atualiza os gostos no Firestore
        await updateGostosUsuario(gostosSelecionados);
    });
});