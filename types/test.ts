/// <reference path="./index.d.ts" />

const system = server.registerServer(0,0);
system.initialize = function() {
  // this.listenForEvent("minecraft:entity_created", function() {

  // })
  const component = this.createComponent({} as EntityObject, "minecraft:attack");
  // // component.
  this.broadcastEvent("minecraft:display_chat_event", "test");
}