const lblPending = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('h1'); //devuelve la primera etiqueta h1 que encuentre en la pagina
const noMoreAlert = document.querySelector('.alert');
const currentTicketLabel = document.querySelector('small');

const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
  console.log('paso')
  window.location = 'index.html';
  throw new Error('Escritorio es requerido');
}

const deskNumber = searchParams.get('escritorio');
let workingTicket = null;

deskHeader.innerHTML = deskNumber;



function checkTicketCount(currentCount = 0) {
  if (currentCount === 0) {
    noMoreAlert.classList.remove('d-none');
  } else {
    noMoreAlert.classList.add('d-none');
  }
  lblPending.innerHTML = currentCount;

}


async function loadInitialCount() {
  const pendingTickets = await fetch('http://localhost:3000/api/ticket/pending').then(resp => resp.json());
  checkTicketCount(pendingTickets.length);
}

async function getTicket() {
  await finishTicket();
  
  const { status, ticket, message } = await fetch(`/api/ticket/draw/${deskNumber}`).then(resp => resp.json());

  if (status === 'error') {
    currentTicketLabel.innerHTML = message;
    return;
  }
  workingTicket = ticket;
  currentTicketLabel.innerHTML = ticket.number;
}

async function finishTicket() {
  if (!workingTicket) return;

  const { status, ticket, message } = await fetch(`/api/ticket/done/${workingTicket.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'}
  }).then(resp => resp.json());

  if (status === 'error') {
    currentTicketLabel.innerHTML = message;
    return;
  }
  workingTicket = null;
  currentTicketLabel.innerHTML = '';
}

function connectToWebSockets() {
  const socket = new WebSocket( 'ws://localhost:3000/ws' );
  
  socket.onmessage = ( event ) => {
    const { type, payload } = JSON.parse(event.data);

    if (type === 'on-ticket-count-changed') {
      lblPending.innerHTML = payload;
      checkTicketCount(payload);
    }

  };
  
  socket.onclose = ( event ) => {
    console.log( 'Connection closed' );
    setTimeout( () => {
      console.log( 'retrying to connect' );
      connectToWebSockets();
    }, 1500 );
    
  };
  
  socket.onopen = ( event ) => {
    console.log( 'Connected' );
  };
}

//listeners
btnDraw.addEventListener('click', getTicket);
btnDone.addEventListener('click', finishTicket);

loadInitialCount();
connectToWebSockets();
