
const casilleros = [
  {lblNumTicket: document.querySelector('#lbl-ticket-01'), lblDeskTicket: document.querySelector('#lbl-desk-01')},
  {lblNumTicket: document.querySelector('#lbl-ticket-02'), lblDeskTicket: document.querySelector('#lbl-desk-02')},
  {lblNumTicket: document.querySelector('#lbl-ticket-03'), lblDeskTicket: document.querySelector('#lbl-desk-03')},
  {lblNumTicket: document.querySelector('#lbl-ticket-04'), lblDeskTicket: document.querySelector('#lbl-desk-04')}
];


async function initWorkingOnTickets() {
  const tickets = await loadCurrentTickets();

  if (!tickets) return;

  renderTickets(tickets);
}

async function loadCurrentTickets() {
  const woTickets = await fetch('http://localhost:3000/api/ticket/working-on').then(resp => resp.json());
  return woTickets;
}

function renderTickets(tickets) {
  console.log('entro en tickets')
  let cont = 0;

  tickets.forEach(ticket => {
    casilleros.at(cont).lblNumTicket.innerHTML = `Ticket: ${ticket.number}`;
    casilleros.at(cont).lblDeskTicket.innerHTML = ticket.handleAtDesk;

    cont += 1;
  });
}


function connectToWebSockets() {
  const socket = new WebSocket( 'ws://localhost:3000/ws' );
  
  socket.onmessage = ( event ) => {
    console.log(event)
    const { type, payload } = JSON.parse(event.data);

    if (type === 'on-working-changed') {
      if (!payload) return;

      renderTickets(payload);
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

connectToWebSockets();
initWorkingOnTickets();



