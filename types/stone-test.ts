/// <reference path="./stone.d.ts" />

const stone = server.registerServer<StoneTypeTraits>(0,0);
stone.initialize = function() {
  // this.listenForEvent("minecraft:entity_created", function() {

  // })
  // const component = this.createComponent({} as EntityObject, "minecraft:inventory");
  // // component.
  this.broadcastEvent("minecraft:display_chat_event", "test");
  this.broadcastMessage("test");
  this.registerCommand("test", "test.command", 0, [{
    "arguments": [{
      type: "message",
      name: "test"
    }],
    handler(test) {
      //
    }
  }]);
}