/**
 * Copyright 2023 ROU Technology
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import dayjs from 'dayjs'; // optional library for date formatting
import relativeTime from 'dayjs/plugin/relativeTime'; // optional plugin for date formatting
import { io } from 'socket.io-client';

dayjs.extend(relativeTime);

interface Props {
  socket: Socket;
  messages: Message[];
}

interface Message {
  id: string;
  sender: string;
  message: string;
  receiver: string;
  senderEmail: string;
  receiverEmail: string;
  createdAt: string;
  updatedAt: string;
  messageId: string;
  room: string;
  roomId: string;
  files?: string[];
}

export const Message = (props: Props) => {
  // return the message in a list item with the sender's name and the message content, style it with tailwindcss
  return (
    <div className='flex flex-col h-full overflow-y-scroll'>
      {props.messages.length > 0 ? (
        props.messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))
      ) : (
        <div className='text-gray-500 text-center py-4'>No messages yet</div>
      )}
    </div>
  );
};

const MessageComponent = ({ message }: { message: Message }) => {
  const isSent = message.senderEmail === 'user@example.com'; // change to match sender's email
  const date = dayjs(message.createdAt).fromNow(); // optional date formatting

  return (
    <div
      className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} mb-4`}
    >
      <div
        className={`rounded-lg px-4 py-2 max-w-xs break-all ${
          isSent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        {message.message}
      </div>
      <div
        className={`text-sm ${
          isSent ? 'text-right' : 'text-left'
        } text-gray-500 mt-1`}
      >
        {date}
      </div>
    </div>
  );
};

export const ChatInputBox = ({
  onSubmit,
}: {
  onSubmit: (message: string) => void;
}) => {
  const [message, setMessage] = useState('');

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    onSubmit(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-row items-center border-t border-gray-200 px-4 pt-4'>
        <input
          type='text'
          placeholder='Type a message...'
          value={message}
          onChange={handleChange}
          className='flex-grow outline-none px-4 py-2 mr-4 rounded-full border border-gray-300 focus:border-blue-500'
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200'
        >
          Send
        </button>
      </div>
    </form>
  );
};

export const ChatScreen = () => {
  const socket = io('ws://localhost:3000', {
    extraHeaders: {
      Authorization:
        'Beara eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMzIyNDU1Yi00ZTVhLTQzMzctOWFiMS00Y2FiZWY0ZDExNDciLCJlbWFpbCI6IjA4MTA5MjE2MzY4Iiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNjgwNzg3MDY0LCJleHAiOjE2ODA5NTk4NjR9.fE15QYEC6H65cKUMZfkpVw-vhYxtinHVpYEBpFQ60rI',
    },
  });
  const [message, setMessage] = useState([] as Message[]);
  const [roomDetails, setRoomDetails] = useState(
    {} as {
      room: string;
      roomId: string;
    }
  );

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      console.log(data);
      setMessage((message) => [...message, data.data]);
    });
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('joinedRoom', (data) => {
      console.log(data);
      setMessage(data.messages);
      setRoomDetails({
        room: data.room,
        roomId: data.roomId,
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    test();
  }, []);

  const test = () => {
    socket.emit(
      'room',
      {
        room: 'testing',
        users: [
          {
            id: 'b322455b-4e5a-4337-9ab1-4cabef4d1147',
            email: 'raheemolalekanusman84@gmail.com',
            name: null,
            phone: '08109216368',
            state: null,
            latitude: null,
            longitude: null,
            role: 'customer',
            month: 'january',
            year: '2021',
          },
          {
            id: 'f22f0e7e-d7ee-4e5a-8fe0-9d31c18d521c',
            email: 'raheemolalekanusman14@gmail.com',
            name: null,
            phone: '23409061931459',
            state: null,
            latitude: null,
            longitude: null,
            role: 'customer',
            month: 'january',
            year: '2021',
          },
        ],
      },
      (data: any) => {
        console.log(data);
        setMessage(data.messages);
        setRoomDetails({
          room: data.roomName,
          roomId: data.roomId,
        });
      }
    );
  };

  const handleSubmit = (msg: string) => {
    socket.emit('sendMessage', {
      room: roomDetails.room,
      roomId: roomDetails.roomId,
      message: msg,
      sender: 'Olalekan',
      receiver: 'Blessing',
      senderEmail: 'raheemolalekanusman84@gmail.com',
      receiverEmail: 'raheemolalekanusman14@gmail.com',
    });
  };

  return (
    <div>
      <Message socket={socket} messages={message} />
      <ChatInputBox onSubmit={handleSubmit} />
    </div>
  );
};
