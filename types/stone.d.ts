/// <reference path="./index.d.ts" />

declare type StoneTypeTraits = {
  prototype: ServerPrototype<StoneTypeTraits>;
  instance: StoneServerInstance;
};

declare namespace StoneServer {
  interface CommandOrigin {
    name: string;
    blockPos: [number, number, number];
    worldPos: [number, number, number];
    entity: EntityObject;
    permissionLevel: 0 | 1 | 2 | 3 | 4;
  }
  type CommandTypes = {
    message: string;
    string: string;
    int: number;
    float: number;
    bool: boolean;
    text: string;
    position: [number, number, number];
    selector: EntityObject[];
    "player-selector": EntityObject<"entity">[];
  };
  interface CommandArgument {
    name: string;
    type: keyof CommandTypes;
    optional?: true;
  }
  interface CommandOverload {
    arguments: CommandArgument[];
    handler: (this: StoneServerInstance, ...args: any[]) => void
  }
}

declare interface StoneServerInstance extends ServerInstance<StoneTypeTraits> {
  /** Broadcast a message (ExtAPI test), should same as broadcastEvent("minecraft:display_chat_event", message)  */
  broadcastMessage(message: string): void;

  /** Get current CommandOrigin inside Command Handler */
  currentCommandOrigin(): StoneServer.CommandOrigin;

  /**
   * Execute command as current command origin
   * @param command Command string (includes the slash)
   * @returns command execution result
   * @deprecated please use `invokeCommand(entity: EntityObject, command: string): string`
   */
  invokeCommand(command: string): string;

  /**
   * Execute command as entity
   * @param entity the origin entity
   * @param command Command string (includes the slash)
   * @returns command execution result
   */
  invokeCommand(entity: EntityObject, command: string): string;

  /**
   * Execute command as console
   * @param name console name
   * @param command Command string (includes the slash)
   * @returns command execution result
   */
  invokeConsoleCommand(name: string, command: string): string;

  /**
   * Execute command as entity (bypass the permission check)
   * @param entity the origin entity
   * @param command Command string (includes the slash)
   * @returns command execution result
   */
  invokePrivilegedCommand(entity: EntityObject, command: string): string;

  /**
   * Register a global command
   * @param name command name
   * @param desc command description
   * @param level command permission level
   * @param overloads command overloads
   */
  registerCommand(
    name: string,
    desc: string,
    level: number,
    overloads: StoneServer.CommandOverload[]
  ): void;

  /**
   * Transfer player to host:port (/transferserver)
   * @param player target player
   * @param host target server hostname
   * @param port target server port
   */
  transferPlayer(player: EntityObject, host: string, port: number): void;
}
