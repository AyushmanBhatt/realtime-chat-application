const socket=io('http://localhost:8000', {transports: ['websocket']});

//Get DOM elements in their respective javascript variables
const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInp')
const messageContainer=document.querySelector(".container")

//audio that'll play on receiving texts or when someone leaves the chat
var audio = new Audio('videoplayback.m4a');

//Function which will append event info to the container
const append = (message,position)=>{
    const messageElement = document.createElement('div')
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left')
    {
        audio.play();
    }
}

//If the form gets submitted, send the message to the server
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value=''
})

//Ask new user for his/her name and let the server know
const name=prompt("Enter your name to join homie :)");
socket.emit('new-user-joined', name)

//If a new user joins, receive his/her name (the event) from the server
socket.on('user-joined', name=>{
    append(`${name} has entered the chat`, 'right')
})

//If someone in the server sends a message, receive it
socket.on('receive', data=>{
    append(`${data.name}: ${data.message}`, 'left')
})

//If a user leaves the chat, append the info to the container
socket.on('left', name=>{
    append(`${name} has left the chat`, 'left')
})