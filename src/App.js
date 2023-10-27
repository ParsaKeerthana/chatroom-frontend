import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io.connect('http://localhost:3001');

function App() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off('message');
        }
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (name && message) {
            socket.emit('message', { name, message });
            setMessage('');
        }
    };

    return (
        <div className="App">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.name === name ? 'myMessage' : 'otherMessage'}>
                        <strong>{msg.name}: </strong>{msg.message}
                    </div>
                ))}
            </div>
            <div className="inputSection">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <br />
                <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default App;
