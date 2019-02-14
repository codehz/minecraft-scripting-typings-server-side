declare interface ReferenceObject<name extends string> {
  readonly __identifier__: string;
  readonly __type__: name;
}

declare interface ReferenceObjectWithIdentifier<name extends string>
  extends ReferenceObject<name> {
  readonly id: number;
}

declare type EntityType = "entity" | "item_entity";

declare type EntityObject<type extends EntityType = EntityType> = ReferenceObjectWithIdentifier<type>;
declare type ComponentObject = ReferenceObject<"component">;
declare type Query = ReferenceObjectWithIdentifier<"query">;
