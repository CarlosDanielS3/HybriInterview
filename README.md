# HybriInterview
Construa um back-end onde o usuário precise se autenticar para enviar e receber mensagens em tempo real de um chat. Além disso ele pode também curtir as mensagens e receber a atualização em tempo real de mensagens que foram curtidas.   Utilize o Nest com microsserviços simples;  Utilize o Socket.io como biblioteca para o WebSocket.


## 🔥 Running
You can run the application in development mode with the command:

```Powershell
#Run the Server

cd backend

docker compose up

npm i

npm run start:dev

cd ..

cd chat-web

npm i

npm run start

```

##OBS

.env is commited because  the docker compose will up the pg db, so you have the db up and .env configurations to it
