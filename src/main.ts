import { push, update } from "firebase/database";
import { dbRef, setDbRef } from "./modules/firebaseApp";
import { Loginhandler } from "./modules/LoginHandler";
import { UserFormHandler } from "./modules/UserFormHandler";
import { showForum } from "./modules/displayHandler";

// DOM elements
const forumButtons = document.querySelectorAll(".forum-btn");
const user:HTMLHeadingElement = document.querySelector('.user');
const messInput:HTMLInputElement = document.querySelector("#message");
const addMessBtn:HTMLButtonElement = document.querySelector("#add-message-btn");

// Testing adding logo png to DOM for GitHub pages
// const imgUrl = new URL('img/conversation_128.png', import.meta.url);
// const img = document.createElement('img');
// img.src = imgUrl.href;
// document.body.append(img);

new Loginhandler();
new UserFormHandler();

// When page is loaded (later when user is logged in) show default forum
showForum('travel-forum');

// Event listener for sidebar to choose forum-topic
forumButtons.forEach((btn) => {
    btn.addEventListener("click", (event:Event) => {
        const target = event.target as HTMLElement;
        const forum:string = target.id;
        showForum(forum);
    });
});

// Event listener for add-message-button
addMessBtn.addEventListener('click', e => {
    e.preventDefault();
    setDbRef();

    // Create timestamp in message
    const timestamp = Date.now();
    const date = new Date(timestamp);
    const pad = (n) => {   
        return n<10 ? '0'+n : n;
    }
    const messTimestamp = pad(date.getDate())+
        "-"+pad(date.getMonth()+1)+
        "-"+date.getFullYear()+
        ", "+pad(date.getHours())+
        ":"+pad(date.getMinutes());

    if (messInput.value == ''){
        alert('Enter text to post!');
    } else {
        // Create new message-object
        const messToAdd = {
            message: messInput.value,
            username: user.innerText,
            timestamp: messTimestamp,
            userId: user.id
        }

        messInput.value = '';

        // Update database with new message
        const newKey:string = push(dbRef).key;
        const newMessage = {};
        newMessage[newKey] = messToAdd;

        update(dbRef, newMessage);
    }
});
