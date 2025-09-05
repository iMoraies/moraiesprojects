const form = document.getElementById("whatsappForm");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.getElementById("progressBar");
const statusMsg = document.getElementById("statusMsg");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();
    const arquivo = document.getElementById("arquivo").files[0];

    // Validação simples
    if (!nome || !telefone || !mensagem) {
        statusMsg.textContent = "⚠️ Preencha todos os campos obrigatórios.";
        return;
    }
    if (!/^\d{10,13}$/.test(telefone)) {
        statusMsg.textContent = "⚠️ Informe um telefone válido (somente números com DDD).";
        return;
    }

    let arquivoUrl = "";

    if (arquivo) {
        const data = new FormData();
        data.append("file", arquivo);
        data.append("upload_preset", "meu_preset"); // seu preset
        data.append("cloud_name", "dptxyzc9i"); // seu cloud name

        progressContainer.style.display = "block";
        progressBar.style.width = "0%";
        statusMsg.textContent = "⬆️ Enviando arquivo...";

        try {
            const resposta = await fetch("https://api.cloudinary.com/v1_1/dptxyzc9i/auto/upload", {
                method: "POST",
                body: data
            });

            // Simulação do progresso (fetch não tem progress nativo)
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(res => setTimeout(res, 80));
                progressBar.style.width = i + "%";
            }

            const resultado = await resposta.json();
            arquivoUrl = resultado.secure_url;

            statusMsg.textContent = "✅ Arquivo enviado com sucesso!";
        } catch (err) {
            statusMsg.textContent = "❌ Erro ao enviar o arquivo.";
            console.error(err);
            return;
        }
    }

    let texto = `Oi, tudo bem!? Meu nome é: ${nome}.\n\nTelefone: ${telefone}\nMensagem: ${mensagem}`;
    if (arquivoUrl) {
        texto += `\n📎 Arquivo anexado: ${arquivoUrl}`;
    }

    const numero = "5521990456868"; // substitua pelo seu número real
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");

    form.reset();
    progressContainer.style.display = "none";
    progressBar.style.width = "0%";
    statusMsg.textContent = "";
});
