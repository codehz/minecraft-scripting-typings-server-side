/// <reference path="./stone.d.ts" />

'use strict'
const system = server.registerSystem<StoneTypeTraits>(0, 0);

const buffer = new ArrayBuffer(4);
const view = new Int32Array(buffer);
view[0] = 5443;

// throw new Error("tet");
server.log(Object.getOwnPropertyNames(globalThis));
const db = new SQLite3(":memory:")
server.log(db.valid)
db.exec("create table test (data blob not null)");
db.exec("insert into test values (X'00')");
db.exec("insert into test values (X'0ACC')");
server.log(db.exec("select * from test", x => server.log("!!", JSON.stringify(x))));
server.log(JSON.stringify(db.update("insert into test values ($data)", { $data: buffer })));
server.log(JSON.stringify(db.query("select * from test", [])));

const alias = function (name: string, desc: string, level: number, command: string) {
  this.registerCommand(name, desc, level, [{
    arguments: [],
    handler() {
      return this.invokeCommand(command);
    }
  }])
};

system.initialize = function () {
  this.registerCommand("alias", "custom.commands.alias", 1, [{
    arguments: [{
      name: "name",
      type: "string"
    }, {
      name: "desc",
      type: "string"
    }, {
      name: "level",
      type: "int"
    }, {
      name: "command",
      type: "string"
    }],
    handler(name, desc, level, command) {
      alias.call(this, name, desc, level, command);
    }
  }]);

  this.registerCommand("broadcast", "custom.command.broadcast", 1, [{
    arguments: [{
      name: "string",
      type: "string"
    }],
    handler(string) {
      this.broadcastMessage(string);
    }
  }]);

  this.registerCommand("transferserver", "commands.transferserver.description", 1, [{
    arguments: [{
      name: "target",
      type: "player-selector"
    }, {
      name: "host",
      type: "string"
    }, {
      name: "port",
      type: "int",
      optional: true
    }],
    handler(target, host, port) {
      target.forEach(x => this.transferPlayer(x, host, port || 19132));
      return "commands.transferserver.successful"
    }
  }]);

  this.registerCommand("id", "custom.command.id", 0, [{
    arguments: [],
    handler() {
      return JSON.stringify(this.currentCommandOrigin());
    }
  }]);

  this.registerCommand("proxy", "custom.command.proxy", 0, [{
    arguments: [{
      name: "command",
      type: "string"
    }],
    handler(command) {
      return this.invokeCommand(this.currentCommandOrigin().entity, command);
    }
  }]);

  this.registerCommand("sudo", "custom.command.sudo", 0, [{
    arguments: [{
      name: "command",
      type: "string"
    }],
    handler(command) {
      return this.invokePrivilegedCommand(this.currentCommandOrigin().entity, command);
    }
  }])

  this.registerCommand("string", "custom.command.string", 0, [{
    arguments: [{
      name: "string",
      type: "string"
    }],
    handler(string) {
      return "string: " + string;
    }
  }]);

  this.registerCommand("string", "custom.command.string", 0, [{
    arguments: [{
      name: "string",
      type: "string"
    }],
    handler(string) {
      return "string: " + string;
    }
  }]);
  this.registerCommand("int", "custom.command.int", 0, [{
    arguments: [{
      name: "int",
      type: "int",
      optional: true
    }],
    handler(int) {
      return "int: " + int;
    }
  }]);
  this.registerCommand("float", "custom.command.float", 0, [{
    arguments: [{
      name: "float",
      type: "float"
    }],
    handler(float) {
      return "float: " + float;
    }
  }]);
  this.registerCommand("bool", "custom.command.bool", 0, [{
    arguments: [{
      name: "bool",
      type: "bool"
    }],
    handler(bool) {
      return "bool: " + bool;
    }
  }]);
  this.registerCommand("text", "custom.command.text", 0, [{
    arguments: [{
      name: "text",
      type: "text"
    }],
    handler(text) {
      return "text: " + text;
    }
  }]);
  this.registerCommand("position", "custom.command.position", 0, [{
    arguments: [{
      name: "position",
      type: "position"
    }],
    handler(position) {
      return "position: " + (position && JSON.stringify(position));
    }
  }]);

  this.registerCommand("complex", "custom.command.complex", 0, [{
    arguments: [{
      name: "bool",
      type: "bool"
    }, {
      name: "position",
      type: "position"
    }],
    handler(bool, position) {
      return ":: " + bool + ", " + (position && JSON.stringify(position));
    }
  }]);

  this.registerCommand("selector", "custom.command.selector", 0, [{
    arguments: [{
      name: "selector",
      type: "selector"
    }],
    handler(selector) {
      return "selector: " + JSON.stringify(selector);
    }
  }]);

  this.registerCommand("player-selector", "custom.command.player-selector", 0, [{
    arguments: [{
      name: "player-selector",
      type: "player-selector"
    }],
    handler(players) {
      return "players: " + JSON.stringify(players);
    }
  }]);
  this.broadcastEvent("minecraft:display_chat_event", "test");
  this.listenForEvent("minecraft:entity_created", data => {
    const str = JSON.stringify(data);
    server.log(str, this.isValidEntity(JSON.parse(str).entity));
  });
}

system.shutdown = function () {
  this.broadcastEvent("minecraft:execute_command", "/say bye");
}