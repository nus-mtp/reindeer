# Global





* * *

### getAllUserFiles(userID) 

Find all user file information

**Parameters**

**userID**: , Find all user file information

**Returns**: , query_result


### getAllSessionFiles(userID) 

format of return {
     count: <num_of_rows>,
     rows: [{data}]
}

**Parameters**

**userID**: , format of return {
     count: <num_of_rows>,
     rows: [{data}]
}

**Returns**: , query_result


### getFilePath(fileID) 

Get file path using file id

**Parameters**

**fileID**: , Get file path using file id

**Returns**: , one entry or null


### getOwnerOfFile(fileID, userID) 

Check is the user is the owner of the file

**Parameters**

**fileID**: , Check is the user is the owner of the file

**userID**: , Check is the user is the owner of the file

**Returns**: , <boolean>


### getSessionID(fileID) 

Get session ID from fileID

**Parameters**

**fileID**: , Get session ID from fileID

**Returns**: , sessionID



* * *










