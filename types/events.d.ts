/// <reference path="./common.d.ts" />
declare namespace Events {
  interface EntityEventParameters {
    /** The entity */
    entity: EntityObject<"entity">;
  }
  /** This event is triggered whenever an entity is added to the world. */
  interface EntityCreatedParameters extends EntityEventParameters {}
  /** This event is triggered whenever an entity dies. This won't be triggered when an entity is removed (such as when using destroyEntity). */
  interface EntityDeathParameters extends EntityEventParameters {}
  /** This event is triggered whenever an entity becomes a rider on another entity. */
  interface EntityStartRidingParameters extends EntityEventParameters {
    /** The entity being ridden */
    ride: EntityObject<"entity">;
  }
  /** This event is triggered whenever an entity stops riding another entity. */
  interface EntityStopRidingParameters extends EntityEventParameters {
    /** If true, the rider stopped riding by their own decision */
    exit_from_rider: boolean;
    /** If true, the rider stopped riding because they are now dead */
    entity_is_being_destroyed: boolean;
    /** If true, the rider stopped riding because they are now riding a different entity */
    switching_rides: boolean;
  }
  /** This event is triggered whenever an entity is ticked. This event will not fire when a player is ticked. */
  interface EntityTick extends EntityEventParameters {}
  /** This event is triggered whenever a player attacks an entity. */
  interface PlayerAttackedActor {
    /** The player that attacked an entity */
    player: EntityObject<"entity">;
    /** The entity that was attacked by the player */
    attacked_entity: EntityObject<"entity">;
  }

  /** The following Minecraft events are events the Script Engine is listening for and to which you can react in scripts. */
  type Listening = {
    "minecraft:entity_created": EntityCreatedParameters;
    "minecraft:entity_death": EntityDeathParameters;
    "minecraft:entity_start_riding": EntityStartRidingParameters;
    "minecraft:entity_stop_riding": EntityStopRidingParameters;
    "minecraft:entity_tick": EntityTick;
    "minecraft:player_attacked_actor": PlayerAttackedActor;
  };

  /** The following Minecraft events can be triggered from scripting and the game will respond, accordingly. */
  type Triggerable = {
    /** This event is used to send a chat message from the server to the players. The event data is the message being sent as a string. Special formatting is supported the same way it would be if a player was sending the message. */
    "minecraft:display_chat_event": string;
    /** This event is used to execute a slash command on the server with the World Owner permission level. The event data contains the slash command as a string. The slash command will be processed and will run after the event is sent. */
    "minecraft:execute_command": string;
    /** This event is used to create a particle effect that will follow an entity around. This particle effect is visible to all players. Any effect defined in a JSON file (both in your resource pack and in Minecraft) can be used here. MoLang variables defined in the JSON of the effect can then be used to control that effect by changing them in the entity to which it is attached. */
    "minecraft:spawn_particle_attached_entity": {
      /** The identifier of the particle effect you want to attach to the entity. This is the same name you gave the effect in its JSON file */
      effect: string;
      /** The entity object you want to attach the effect to */
      entity: EntityObject;
      /** The offset from the entity's "center" where you want to spawn the effect */
      offset: [number, number, number];
    };
  };
}
