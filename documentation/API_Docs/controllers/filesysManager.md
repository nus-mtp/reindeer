# Global





* * *

### dirExists(directory) 

Check if a directory exists

**Parameters**

**directory**: , path

**Returns**: `boolean`


### createDirectory(directory) 

Create directory

Create directory, do nothing if directory already exists

**Parameters**

**directory**: , path

**Returns**: , void


### removeFileOrDirectory(directory) 

Remove Directory

**Parameters**

**directory**: , path

**Returns**: , void


### removeUserFile(fileID) 

Remove a file from user directory (Cannot be recovered)
return a boolean indicate if the file been successfully removed
Ownership check will be enforced for each remove.

**Parameters**

**fileID**: , Remove a file from user directory (Cannot be recovered)
return a boolean indicate if the file been successfully removed
Ownership check will be enforced for each remove.

**Returns**: , boolean


### isOwnerOfFile(userID, fileID) 

Check if user has permission to remove the file

**Parameters**

**userID**: , Check if user has permission to remove the file

**fileID**: , Check if user has permission to remove the file



### isValidFileTypeUpload(mimeType) 

File filter

**Parameters**

**mimeType**: , File filter

**Returns**: , boolean


### isPDF(mimeType) 

Check is pdf

**Parameters**

**mimeType**: , Check is pdf

**Returns**: , boolean


### saveFileInfoToDatabase(userID) 

Save File to database

**Parameters**

**userID**: , Save File to database

**Returns**: , void


### getAllUserFiles(userID) 

Get all the files user have

**Parameters**

**userID**: , Get all the files user have

**Returns**: , queryResult


### getFilePath(fileID) 

Get file path on disc

**Parameters**

**fileID**: , Get file path on disc

**Returns**: , filepath


### getFilePageData(queryResult, FileDataList) 

Form file page data returned to view

**Parameters**

**queryResult**: , Form file page data returned to view

**FileDataList**: , Form file page data returned to view



### FileDataList() 

File Page Data Model



### addFile(id, fileList) 

Add file data to file page data

**Parameters**

**id**: , Add file data to file page data

**fileList**: , Add file data to file page data



### generateSessionDirPath(sessionID) 

Generate session folder path

**Parameters**

**sessionID**: , Generate session folder path

**Returns**: , session folder path


### createSessionDirectory(sessionID) 

Create the session folder if not exist

**Parameters**

**sessionID**: , Create the session folder if not exist

**Returns**: , sessionFileFolder


### getSessionDirectory(sessionID) 

Get session file folder
Initialize if not exist

**Parameters**

**sessionID**: , Get session file folder
Initialize if not exist

**Returns**: , session folder path


### initializeSessionDirectory(sessionDirPath, sessionID) 

Initialize session folder
Create the folder if not exist
Create presentation folder inside

**Parameters**

**sessionDirPath**: , Initialize session folder
Create the folder if not exist
Create presentation folder inside

**sessionID**: , Initialize session folder
Create the folder if not exist
Create presentation folder inside

**Returns**: , void


### removeSessionDirectory(sessionID) 

Remove session file folder

**Parameters**

**sessionID**: , Remove session file folder

**Returns**: , void


### getAllSessionFiles(sessionID) 

Get all the files user have

**Parameters**

**sessionID**: `String`, Get all the files user have

**Returns**: `Promise`


### getPresentationFileFolder(fileID) 

Return the session file folder for storing image file
Create the folder if not exist.
The folder would exist inside the tutorial session folder.

**Parameters**

**fileID**: , Return the session file folder for storing image file
Create the folder if not exist.
The folder would exist inside the tutorial session folder.

**Returns**: , presentation folder path


### generatePresentationFileFolderPath(fileID, sessionID) 

Generate the presentation folder path

**Parameters**

**fileID**: , Generate the presentation folder path

**sessionID**: , Generate the presentation folder path

**Returns**: , presentation file folder path


### createPresentationFolder(sessionID) 

Create presentation folder

**Parameters**

**sessionID**: , Create presentation folder

**Returns**: , presentation folder path


### generatePresentationFolderPath(sessionID) 

Generate session folder path

**Parameters**

**sessionID**: , Generate session folder path

**Returns**: , sessionFolderPath


### assert() 

Customize assert




* * *










