let lblUltimoTicket = document.querySelector('#lbl-new-ticket');

leerUltimoTicket();

async function leerUltimoTicket() {
  const ultimoTicket = await fetch('http://localhost:3000/api/ticket/last').then(resp => resp.json());
  lblUltimoTicket.innerHTML = `Ultimo ticket ingresado: ${ultimoTicket}`;
}

async function nuevoTicket() {
  const resp = await fetch ('http://localhost:3000/api/ticket/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'}
  }).then(resp => resp.json());

  leerUltimoTicket();

}