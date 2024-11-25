import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import { app, db } from './script.js'; // Certifique-se de que o caminho está correto

const auth = getAuth(app);

// Função para atualizar o plano do usuário no Firestore
function updatePlanoUsuario(planoSelecionado) {
    const user = auth.currentUser;
    if (user) {
        const userRef = doc(db, "users", user.uid);
        updateDoc(userRef, { plano: planoSelecionado })
            .then(() => {
                console.log(`Plano do usuário atualizado para ${planoSelecionado}`);
                // Atualiza a interface com o selo correspondente
                updateSelo(planoSelecionado);
                window.location.href = "PaginaVendas.html"; // Redireciona após atualizar o plano
            })
            .catch((error) => {
                console.error("Erro ao atualizar plano:", error);
            });
    } else {
        console.log("Usuário não autenticado.");
    }
}

// Função para exibir o selo de acordo com o plano
function updateSelo(plano) {
    const selo = document.getElementById("selo");  // Elemento onde o selo será mostrado

    // Remover quaisquer selos existentes
    selo.innerHTML = '';

    // Adicionar o selo correspondente
    let seloImg;
    if (plano === "básico") {
        seloImg = "<img src='PlanoBasico.png' alt='Selo Básico'>";
    } else if (plano === "avançado") {
        seloImg = "<img src='PlanoAvancado.png' alt='Selo Avançado'>";
    } else if (plano === "premium") {
        seloImg = "<img src='PlanoPremium.png' alt='Selo Premium'>";
    } else {
        console.error("Plano inválido:", plano);
        return;
    }

    // Adicionar a imagem do selo ao HTML
    selo.innerHTML = seloImg;
}

// Adiciona o evento de clique ao botão de assinatura de cada plano
document.getElementById("AssinarIniciante").addEventListener("click", () => updatePlanoUsuario("iniciante"));
document.getElementById("AssinarBasico").addEventListener("click", () => updatePlanoUsuario("básico"));
document.getElementById("AssinarAvancado").addEventListener("click", () => updatePlanoUsuario("avançado"));
document.getElementById("AssinarPremium").addEventListener("click", () => updatePlanoUsuario("premium"));


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