// carregar dados salvos
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

// salvar no navegador
function salvarDados() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

// adicionar cliente
function adicionarCliente() {
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const valor = document.getElementById("valor").value;
  const vencimento = document.getElementById("vencimento").value;

  if (!nome || !telefone || !valor || !vencimento) {
    alert("Preencha todos os campos");
    return;
  }

  const cliente = {
    id: Date.now(),
    nome,
    telefone,
    valor,
    vencimento,
    status: "pendente"
  };

  clientes.push(cliente);
  salvarDados();
  renderizar();

  // limpar campos
  document.getElementById("nome").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("vencimento").value = "";
}

// renderizar lista
function renderizar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  clientes.forEach((c) => {
    const hoje = new Date().getDate();

    if (hoje > c.vencimento && c.status !== "pago") {
      c.status = "atrasado";
    }

    const div = document.createElement("div");
    div.classList.add("cliente");

    div.innerHTML = `
      <p><strong>${c.nome}</strong></p>
      <p>Valor: R$ ${c.valor}</p>
      <p>Vencimento: dia ${c.vencimento}</p>
      <p class="${c.status}">Status: ${c.status}</p>

      <button onclick="marcarPago(${c.id})">Pagar</button>
      <button onclick="cobrar(${c.id})">Cobrar</button>
    `;

    lista.appendChild(div);
  });
}

// marcar como pago
function marcarPago(id) {
  const cliente = clientes.find(c => c.id === id);
  cliente.status = "pago";

  salvarDados();
  renderizar();
}

// cobrar via WhatsApp
function cobrar(id) {
  const cliente = clientes.find(c => c.id === id);

  const mensagem = `Olá, ${cliente.nome}! 👋

Sua mensalidade está em aberto.
Valor: R$ ${cliente.valor}
Vencimento: dia ${cliente.vencimento}

Por favor, realize o pagamento.`;

  const telefone = cliente.telefone.replace(/\D/g, "");
  const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}

// iniciar sistema
renderizar();