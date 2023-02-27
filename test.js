const client = { test: "test" };


let command = await import('./commands/startmc.js');

//if command has a class, call constructor with context
if (command.Command) {


command = new command.Command(client);

console.log(command.execute)