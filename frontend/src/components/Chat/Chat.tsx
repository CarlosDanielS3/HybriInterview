import React, { useEffect, useState } from 'react';
import * as uuid from 'uuid';

import io from 'socket.io-client';
import { Container, Content, Card, MyMessage, OtherMessage } from './styles';
import authHeader from '../../services/auth-header'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

interface Message {
    id: string;
    name: string;
    text: string;
    like: boolean;
    senderId: string;
}

interface Payload {
    name: string;
    text: string;
    like: boolean;
    senderId: string;
}

const socketOptions = {
    transportOptions: {
        polling: {
            extraHeaders: {
                Authorization: authHeader(), // 'Bearer h93t4293t49jt34j9rferek...'
            },
        },
    },
};

const socket = io('http://localhost:3001', socketOptions);

const Chat: React.FC = () => {
    const [title] = useState('Chat Web');
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        function receivedMessage(message: Payload) {
            const newMessage: Message = {
                id: uuid.v4(),
                name: message.name,
                text: message.text,
                like: false,
                senderId: message.senderId,
            };

            setMessages([...messages, newMessage]);
        }

        socket.on('msgToClient', (message: Payload) => {
            receivedMessage(message);
        });

        socket.on('likeButtonClient', async (message: Message) => {
            await messages.map((msg) => {
                if (msg.senderId === message.senderId) {
                    msg.like = message.like;
                }
                return msg;
            });
        
            setMessages([...messages]);
        });
    }, [messages, name, text]);

    function validateInput() {
        return name.length > 0 && text.length > 0;
    }

    function sendMessage() {
        if (validateInput()) {
            const message: Payload = {
                name,
                text,
                like: false,
                senderId: uuid.v4()
            };

            socket.emit('msgToServer', message);
            setText('');
        }
  
    }

    function likeMessage(message : Message) {
        message.like = !message.like; 
        socket.emit('likeButtonServer', message);

    }

    return (
        <Container>
            <Content>
                <h1>{title}</h1>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter name..."
                />
                <Card>
                    <ul>
                        {messages.map(message => {
                            if (message.name === name) {
                                return (
                                    <MyMessage key={message.id}>
                                        <span>
                                            {message.name}
                                            {' diz:'}
                                        </span>

                                        <p>{message.text}                                              
                                            <span style={{marginLeft: '10px'}}>
                                                <FormControlLabel checked={message.like} onChange={() => {return false}}
                                                control={<Checkbox icon={<FavoriteBorder />}
                                                    checkedIcon={<Favorite />}
                                                    name="checkedH" />}
                                                label=""/>
                                            </span>
                                        </p>
                                    </MyMessage>
                                );
                            }

                            return (
                                <OtherMessage key={message.id}>
                                    <span>
                                        {message.name}
                                        {' diz:'}
                                    </span>

                                    <p>{message.text}                                            
                                    <span style={{ marginLeft: '10px' }}>
                                        <FormControlLabel checked={message.like} onChange={() => likeMessage(message)}
                                            control={<Checkbox icon={<FavoriteBorder />}
                                                checkedIcon={<Favorite />}
                                                name="checkedH" />}
                                            label=""/>
                                    </span>
                                    </p>
                                </OtherMessage>
                            );
                        })}
                    </ul>
                </Card>
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Enter message..."
                />
                <button type="button" onClick={() => sendMessage()}>
                    Send
                </button>
            </Content>
        </Container>
    );
};

export default Chat;
