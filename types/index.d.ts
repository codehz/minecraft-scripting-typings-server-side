/// <reference path="./common.d.ts" />
/// <reference path="./components.d.ts" />
/// <reference path="./events.d.ts" />

declare type DefaultTypeTraits = {
  prototype: ServerPrototype<DefaultTypeTraits>;
  instance: ServerInstance<DefaultTypeTraits>;
};

declare type CallbackObject<traits extends DefaultTypeTraits> = (
  this: traits["instance"]
) => void;
declare type EventCallbackObject<traits extends DefaultTypeTraits, T> = (
  this: traits["instance"],
  param: T
) => void;

declare type TemplateIdentifier = string;
declare type ComponentIdentifier = string;
declare type EventIdentifier = string;
declare type ComponentData = object;
declare type EventData = object;

declare type MCRange = [number, number];

declare interface ServerPrototype<traits extends DefaultTypeTraits> {
  /**
   * This is the first method that gets called immediately after the system is registered. It will run as soon as the script loads at world start.
   *
   * You can use this to set up the environment for your script: register custom components and events, sign up event listeners, etc. This will run BEFORE the world is ready and the player has been added to it, so you shouldn't try to spawn any entities here!
   */
  initialize?: CallbackObject<traits>;

  /**
   * This method gets called once every game tick. The server and client tick at 20 times per second. This is a good place to get, check, and react to component changes.
   */
  update?: CallbackObject<traits>;

  /**
   * This method gets called when the Minecraft Script Engine is shutting down. For the client this is when they leave the world; for the server this is after the last player has exited the world.
   */
  shutdown?: CallbackObject<traits>;

  [key: string]: any;
}

declare interface ServerInstance<traits extends DefaultTypeTraits> {
  /**
   * Creates an empty entity with no components and does not place it in the world.
   * @returns `EntityObject` An EntityObject representing the newly created entity
   * @returns `null` Something went wrong when creating the entity
   */
  createEntity(): EntityObject | null;

  /**
   * Creates an empty entity with no components and does not place it in the world.
   * @param type Specifies the type of the entity that is being created by the template. Valid inputs are `entity` and `item_entity`
   * @param template This can be any of the entity identifiers from the applied Behavior Packs. For example specifying minecraft:cow here will make the provided entity a cow as defined in JSON
   * @returns `EntityObject` An EntityObject representing the newly created entity
   * @returns `null` Something went wrong when creating the entity
   */
  createEntity(
    type: EntityType,
    template: TemplateIdentifier
  ): EntityObject | null;

  /**
   * Destroys an entity identified by the EntityObject. If the entity exists in the world this will remove it from the world and destroy it. This also makes the EntityObject no longer valid - you should only destroy an entity after you are done with it and no longer need to reference it again. This does NOT kill the entity. There won't be an event for its death: it will be removed.
   * @param entity The EntityObject that was retrieved from a call to createEntity() or retrieved from an event
   * @returns `true` The entity was successfully destroyed
   * @returns `null` Something went wrong when destroying the entity
   */
  destroyEntity(entity: EntityObject): true | null;

  /**
   * Checks if the given EntityObject corresponds to a valid entity.
   * @param entity The EntityObject that was retrieved from a call to createEntity() or retrieved from an event
   * @returns `true` The entity is in the Script Engine's database of entities
   * @returns `false` The entity is not in the Script Engine's database of entities
   * @returns `null` Something went wrong when validating the entity
   */
  isValidEntity(entity: EntityObject): boolean | null;

  /**
   * Creates a custom component that only exists in script. It can be then added, removed, and updated from entities. These custom components only exist while the Script Engine is running.
   * @param identifier The identifier of the custom component. It is required to use a namespace so you can uniquely refer to it later without overlapping a name with a built-in component: for example 'myPack:myCustomComponent'
   * @param data A JavaScript Object that defines the name of the fields and the data each field holds inside the component.
   * @returns `true` The component was successfully registered
   * @returns `null` Something went wrong when registering the component
   */
  registerComponent(
    identifier: ComponentIdentifier,
    data: ComponentData
  ): true | null;

  /**
   * Creates the specified component and adds it to the entity. This should only be used with custom components which need to be registered first. If the entity already has the component, this will retrieve the component already there instead.
   * @param entity The EntityObject that was retrieved from a call to createEntity() or retrieved from an event
   * @param identifier The identifier of the component to add to the entity. This is either the identifier of a built-in component (check the Script Components section) or a custom component created with a call to registerComponent()
   * @returns `ComponentObject` An object with the following fields, and additionally, all the fields as defined in the component
   * @returns `null` Something went wrong when creating the component
   */
  createComponent<IdentifierType extends keyof Components.ComponentMap>(
    entity: EntityObject,
    identifier: IdentifierType
  ): Components.ComponentMap[IdentifierType] | null;

  createComponent(
    entity: EntityObject,
    identifier: string
  ): ComponentObject | null;

  /**
   * Checks if the given entity has the specified component.
   * @param entity The EntityObject that was retrieved from a call to createEntity() or retrieved from an event
   * @param identifier The identifier of the component to check on the entity. This is either the identifier of a built-in component (check the Script Components section) or a custom component created with a call to registerComponent()
   * @returns `true` The EntityObject has the component
   * @returns `false` The EntityObject doesn't have the component
   * @returns `null` An unknown component was passed in or something else went wrong when checking if the EntityObject had the component
   */
  hasComponent(
    entity: EntityObject,
    identifier: ComponentIdentifier
  ): boolean | null;

  /**
   * Looks for the specified component in the entity. If it exists, retrieves the data from the component and returns it.
   * @param entity The EntityObject that was retrieved from a call to createEntity() or retrieved from an event
   * @param identifier The identifier of the component to retrieve from the entity. This is either the identifier of a built-in component (check the Script Components section) or a custom component created with a call to registerComponent()
   * @returns `ComponentObject` An object with the following fields, and additionally, all the fields as defined in the component
   * @returns `null` The entity did not have the component or something went wrong when getting the component
   */
  getComponent<IdentifierType extends keyof Components.ComponentMap>(
    entity: EntityObject,
    identifier: IdentifierType
  ): Components.ComponentMap[IdentifierType] | null;
  getComponent(
    entity: EntityObject,
    identifier: ComponentIdentifier
  ): ComponentData | null;

  /**
   * Applies the component and any changes made to it in script back to the entity. What this means for each component can be slightly different: it makes the component reload on the entity with the new data as if it had just been added to the entity.
   * @param entity The entity object that we are applying the component changes to
   * @param component The component object retrieved from the entity that was returned by either createComponent() or getComponent()
   * @returns `true` The component was successfully updated
   * @returns `null` Something went wrong when updating the component
   */
  applyComponentChanges(
    entity: EntityObject,
    component: ComponentObject
  ): true | null;

  /**
   * Removes the specified component from the given entity. If the entity has the component, it will be removed. Currently this only works with custom components and can't be used to remove components defined for an entity in JSON.
   * @param entity The EntityObject that was retrieved from a call to createEntity() or retrieved from an event
   * @param identifier The identifier of the component to remove from the entity. This is either the identifier of a built-in component (check the Script Components section) or a custom component created with a call to registerComponent()
   * @returns `true` The component was successfully removed from the entity
   * @returns `null` The entity did not have the component or something went wrong when removing the component
   */
  destroyComponent(
    entity: EntityObject,
    identifier: ComponentIdentifier
  ): true | null;

  /**
   * Allows you to trigger an event with the desired data from script. Anything that signed up to listen for the event will be notified and the given data delivered to them.
   * @param identifier This is the identifier of the event we want to react to. Can be the identifier of a built-in event or a custom one from script
   * @param data The data for the event. You can create a new JavaScript Object with the parameters you want to pass in to the listener and the engine will take care of delivering the data to them
   */
  broadcastEvent<Identifier extends keyof Events.Triggerable>(
    identifier: Identifier,
    data: Events.Triggerable[Identifier]
  ): true | null;
  broadcastEvent(identifier: EventIdentifier, data: EventData): true | null;

  /**
   * Allows you to register a JavaScript object that gets called whenever the specified event is broadcast. The event can either be a built-in event or an event specified in script.
   * @param identifier This is the identifier of the event to which we want to react. Can be the identifier of a built-in event or a custom one from script
   * @param callback The JavaScript object that will get called whenever the event is broadcast
   * @returns `true` Successfully registered to listen for the event
   * @returns `null` Something went wrong when registering the event for listening
   */
  listenForEvent<Identifier extends keyof Events.Listening>(
    identifier: Identifier,
    callback: EventCallbackObject<traits, Events.Listening[Identifier]>
  ): true | null;
  listenForEvent(
    identifier: EventIdentifier,
    callback: EventCallbackObject<traits, any>
  ): true | null;

  /**
   * Allows you to register a query. A query will contain all entities that meet the filter requirement. No filters are added by default when you register a query so it will capture all entities.
   * @returns `Query` An object containing the ID of the query
   * @returns `null` Something went wrong when creating the query
   */
  registerQuery(): Query | null;

  /**
   * Allows you to register a query that will only show entities that have the given component and define which fields of that component will be used as a filter when getting the entities from the query.
   * @param identifier This is the identifier of the component that will be used to filter entities when
   * @param field1 This is the name of the first field of the component that we want to filter entities by. By default this is set to x. If the component you used doesn't have the field you defined here, the field will be ignored
   * @param field2 This is the name of the second field of the component that we want to filter entities by. By default this is set to y. If the component you used doesn't have the field you defined here, the field will be ignored
   * @param field3 This is the name of the third field of the component that we want to filter entities by. By default this is set to z. If the component you used doesn't have the field you defined here, the field will be ignored
   * @returns `Query` An object containing the ID of the query
   * @returns `null` Something went wrong when creating the query
   */
  registerQuery(
    identifier: ComponentIdentifier,
    field1?: string,
    field2?: string,
    field3?: string
  ): Query | null;

  /**
   * By default no filters are added. This will allow queries to capture all entities.
   * @param query The object containing the ID of the query that you want to apply the filter to
   * @param identifier This is the identifier of the component that will be added to the filter list. Only entities that have that component will be listed in the query
   */
  addFilterToQuery(query: Query, identifier: ComponentIdentifier): void;

  /**
   * Allows you to fetch the entities captured by a query.
   * @param query This is the query you registered earlier using registerQuery()
   * @returns `EntityObject[]` An array of EntityObjects representing the entities found within the query
   * @returns `null` Something went wrong when creating the entity
   */
  getEntitiesFromQuery(query: Query): EntityObject[] | null;

  /**
   * Allows you to fetch the entities captured by a query that was created with a component filter built-in. The only entities that will be returned are those entities that have the component that was defined when the query was registered and that have a value in the three fields on that component that were defined in the query within the values specified in the call to getEntitiesFromQuery.
   * @param query This is the query you created earlier using registerQuery(...)
   * @param field1_min The minimum value that the first component field needs to be on an entity for that entity to be included in the query
   * @param field2_min The minimum value that the second component field needs to be on an entity for that entity to be included in the query
   * @param field3_min The minimum value that the third component field needs to be on an entity for that entity to be included in the query
   * @param field1_max The maximum value that the first component field needs to be on an entity for that entity to be included in the query
   * @param field2_max The maximum value that the second component field needs to be on an entity for that entity to be included in the query
   * @param field3_max The maximum value that the third component field needs to be on an entity for that entity to be included in the query
   * @returns `EntityObject[]` An array of EntityObjects representing the entities found within the query
   * @returns `null` Something went wrong when creating the entity
   */
  getEntitiesFromQuery(
    query: Query,
    field1_min: number,
    field2_min: number,
    field3_min: number,
    field1_max: number,
    field2_max: number,
    field3_max: number
  ): EntityObject[] | null;
}

declare class Server {
  /**
   * Print something to console
   * @param args Somthing to print
   */
  log<A extends any[]>(...args: A): void;

  /**
   * Register the system
   * @param majorVersion This is major version of the Minecraft Script Engine your script was designed to work with
   * @param minorVersion This is the revision of the Minecraft Script Engine your script was designed to work with
   * @returns returns ServerPrototype
   */
  registerSystem<traits extends DefaultTypeTraits = DefaultTypeTraits>(
    majorVersion: number,
    minorVersion: number
  ): traits["prototype"];
}

declare var server: Server;
