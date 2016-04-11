# Global





* * *

## Class: Lobby
Lobby contruct an object that stores all the rooms into a hash map

### Lobby.size() 

Return number of rooms in lobby

**Returns**: `number`

### Lobby.findOrAddRoom(roomId, room) 

Add room to lobby and import existing user tutorial relationship into room storage

**Parameters**

**roomId**: , Add room to lobby and import existing user tutorial relationship into room storage

**room**: , Add room to lobby and import existing user tutorial relationship into room storage

**Returns**: `room`

### Lobby.removeRoom(roomId) 

Remove room with roomId

**Parameters**

**roomId**: , Remove room with roomId

**Returns**: `boolean`

### Lobby.removeAllRooms() 

Remove all rooms in lobby

**Returns**: `boolean`

### Lobby.get(roomId) 

Retrieve room instance with roomId

**Parameters**

**roomId**: , Retrieve room instance with roomId

**Returns**: `Room`, return room instance

### Lobby.getRoomsMap() 

Retrieve the maps of all rooms

**Returns**: `Object | Object`


## Class: Room
Room construct an object that stores all the groups into a hash map

### Room.size() 

Returns size of current Room

**Returns**: `number`

### Room.addGroup(group) 

Add group into current room

**Parameters**

**group**: , Add group into current room

**Returns**: `boolean`

### Room.removeGroup(groupId) 

Remove group according to its groupId

**Parameters**

**groupId**: , Remove group according to its groupId

**Returns**: `boolean`

### Room.registClient(socketClient) 

Regist socketClients to room before active them

**Parameters**

**socketClient**: , Regist socketClients to room before active them

**Returns**: `boolean`

### Room.activeClient(socketClient) 

Renew socketClients

**Parameters**

**socketClient**: , Renew socketClients

**Returns**: `boolean`

### Room.get(groupId) 

Retrieve the group according to its groupId

**Parameters**

**groupId**: , Retrieve the group according to its groupId

**Returns**: `*`

### Room.getGroupsMap() 

Retrieve the Room

**Returns**: `Object | *`

### Room.hasUser(uid) 

Return

**Parameters**

**uid**: , Return

**Returns**: `boolean`

### Room.setActive() 

set room actived


### Room.emit() 

Room emit message



## Class: Group
Group stores socket clients into a hash map

### Group.size() 

Return size of current Group

**Returns**: `number`

### Group.addClient(socketClient) 

Add user socket client into Group

**Parameters**

**socketClient**: , Add user socket client into Group

**Returns**: `boolean`

### Group.removeClient(userId) 

Remove user socket client from Group according to the input user id

**Parameters**

**userId**: , Remove user socket client from Group according to the input user id


### Group.get(userId) 

Retrieve socket client according to its user id

**Parameters**

**userId**: , Retrieve socket client according to its user id

**Returns**: `*`

### Group.getClientsMap() 

Retrieve map of all socket clients

**Returns**: `Object | *`


## Class: SocketClient
Socket Client Wrapper for storing user ID and user socket

### SocketClient.notifyGroupUsersOnUserLeave() 

Notify All user in current room on user leave


### SocketClient.on(evt, callback) 

Socket listener wrapper

**Parameters**

**evt**: , Socket listener wrapper

**callback**: , Socket listener wrapper


### SocketClient.joinRoom(roomId) 

Add Socket Client to a room by its room id

**Parameters**

**roomId**: , Add Socket Client to a room by its room id

**Returns**: `boolean`

### SocketClient.regist(roomId) 

Regist user to the room

**Parameters**

**roomId**: , Regist user to the room

**Returns**: `boolean`

### SocketClient.emit(key, value) 

Socket Emit wrapper

**Parameters**

**key**: , Socket Emit wrapper

**value**: , Socket Emit wrapper


### SocketClient.roomBroadcast(key, value) 

Room Broadcaster

**Parameters**

**key**: , Room Broadcaster

**value**: , Room Broadcaster


### SocketClient.groupBroadcast(name, key, value) 

Group Broadcaster

**Parameters**

**name**: , Group Broadcaster

**key**: , Group Broadcaster

**value**: , Group Broadcaster


### SocketClient.toJSON() 

Stringify Socket Client JSON object

**Returns**: `SocketClient`



* * *










