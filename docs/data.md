# Data
Documentation for data types and offline storage design.


## Data Types (Schema)

### Users
- user: "". The user's name.
- gpt: "". The GPT's name.

### ChatData
- title: "". The chat's title
- messages: MessageData[]. An ordered list of messages.
- created: DateString. The date the chat was created.

### MessageData

MessageData is currenly only an alias for string that represents a message.


## Offline Storage Design
Store as 1 or a few big JSONs in ...IndexedDB?