/// <reference path="./common.d.ts" />
/// <reference path="./filters.d.ts" />

declare namespace Components {
  /** This component controls the Attack Damage attribute from the entity. It allows you to change the current minimum and maximum values. Once the changes are applied, the current attack of the entity will be reset to the minimum specified. With the minimum and maximum changed to the values specified. Any buffs or debuffs will be left intact. */
  interface AttackComponent extends ComponentObject {
    /** Range of the random amount of damage the melee attack deals. A negative value can heal the entity instead of hurting it */
    damage: MCRange;
    /** Identifier of the status ailment to apply to an entity attacked by this entity's melee attack */
    effect_name: string;
    /**
     * Duration in seconds of the status ailment applied to the damaged entity
     * @default 0.0
     */
    effect_duration?: number;
  }

  /** Controls the collision box of the entity. When changes to the component are applied the entity's collision box is immediately updated to reflect the new dimensions. WARNING: If the change of the collision box dimensions would cause the entity to be inside a block, the entity might become stuck there and start suffocating. */
  interface CollisionBoxComponent extends ComponentObject {
    /**
     * Width and Depth of the collision box in blocks. A negative value will be assumed to be 0
     * @default 1.0
     */
    width?: number;
    /**
     * Height of the collision box in blocks. A negative value will be assumed to be 0
     * @default 1.0
     */
    height?: number;
  }

  interface EventMatcher {
    filters: Filter;
    event: string;
  }

  /** Defines an array of damages and how the entity reacts to them - including whether the entity ignores that damage or not. Currently Minecraft triggers can't be properly serialized so any existing triggers will be completely replaced when applyComponentChanges(). */
  interface DamageSensorComponent extends ComponentObject {
    /** List of triggers with the events to call when taking this specific kind of damage, allows specifying filters for entity definitions and events */
    on_damage?: Array<EventMatcher> | EventMatcher;
    /**
     * If true, the damage dealt to the entity will take away health from it, set to false to make the entity ignore that damage
     * @default true
     */
    deals_damage?: boolean;
    /** Type of damage that triggers this set of events */
    cause?:
      | "all"
      | "contact"
      | "none"
      | "lava"
      | "attack"
      | "override"
      | "projectile"
      | "suffocation"
      | "fall"
      | "starve"
      | "fire"
      | "fatal"
      | "fire_tick"
      | "drowning"
      | "block_explosion"
      | "entity_explosion"
      | "void"
      | "suicide"
      | "magic"
      | "wither"
      | "anvil"
      | "thorns"
      | "falling_block"
      | "piston"
      | "fly_into_wall";
  }

  interface SlotDropChance {
    slot:
      | "slot.weapon.offhand"
      | "slot.weapon.mainhand"
      | "slot.armor"
      | "slot.inventory";
    drop_chance: number;
  }

  /** Defines the loot table the entity uses to defines its equipment. Once the changes are applied, the equipment is re-rolled and a new set of equipment is chosen for the entity. */
  interface EquipmentComponent extends ComponentObject {
    /** The file path to the equipment table, relative to the behavior pack's root */
    table: string;
    /** A list of slots with the chance to drop an equipped item from that slot */
    slot_drop_chance: SlotDropChance[];
  }

  /** Defines how many and what items the entity can be equipped with  */
  interface EquippableComponent extends ComponentObject {
    /** The list of items that can go in this slot */
    accepted_items?: string[];
    /** Text to be displayed when the entity can be equipped with this item when playing with Touch-screen controls */
    interact_text?: string;
    /** Identifier of the item that can be equipped for this slot */
    item?: string;
    /** Event to trigger when this entity is equipped with this item */
    on_equip?: string;
    /** Event to trigger when this item is removed from this entity */
    on_unequip?: string;
    /**
     * The slot number of this slot
     * @default 0
     */
    slot?: number;
  }

  /** Controls the entity's explosion, timer until the explosion, and whether the timer is counting down or not. */
  interface ExplodeComponent extends ComponentObject {
    /**
     * The range for the random amount of time the fuse will be lit before exploding, a negative value means the explosion will be immediate
     * @default 0.0
     */
    fuseLength?: MCRange;
    /**
     * The radius of the explosion in blocks and the amount of damage the explosion deals
     * @default 3.0
     */
    power?: number;
    /**
     * A blocks explosion resistance will be capped at this value when an explosion occurs
     * @default Infinity
     */
    maxResistance?: number;
    /**
     * If true, the fuse is already lit when this component is added to the entity
     * @default false
     */
    fuseLit?: boolean;
    /**
     * If true, blocks in the explosion radius will be set on fire
     * @default false
     */
    causesFire?: boolean;
    /**
     * If true, the explosion will destroy blocks in the explosion radius
     * @default true
     */
    breaks_blocks?: boolean;
    /**
     * If true, whether the explosion causes fire is affected by the mob griefing game rule
     * @default false
     */
    fireAffectedByGriefing?: boolean;
    /**
     * If true, whether the explosion breaks blocks is affected by the mob griefing game rule
     * @default false
     */
    destroyAffectedByGriefing?: boolean;
  }

  /** Defines how the entity can be healed by the player. This doesn't control how much health the entity can have; you must use the Health component for that instead. */
  interface HealableComponent extends ComponentObject {
    /**
     * Determines if item can be used regardless of entity being at full health
     * @default false
     */
    force_use?: boolean;
    /** The filter group that defines the conditions for this trigger */
    filters: Filter;
    /** The array of items that can be used to heal this entity */
    items: Array<{
      /** Item identifier that can be used to heal this entity */
      item: String;
      /** The amount of health this entity gains when fed this item */
      heal_amount: number;
      /** The filter group that defines the conditions for using this item to heal the entity */
      filters: Filter;
    }>;
  }

  /** Defines the current and maximum possible health of the entity. Upon applying the component back to the entity the health will change. If it reaches 0 or below the entity will die. */
  interface HealthComponent extends ComponentObject {
    /**
     * Current health of the entity
     * @default 1
     */
    value?: number;
    /**
     * The maximum health the entity can heal
     * @default 10
     */
    max?: number;
  }

  interface LootTable {
    /** File path, relative to the behavior pack's path, to the loot table file */
    table: string;
  }

  /** Defines the ways the player can interact with the entity to which this component is applied. */
  interface InteractComponent extends ComponentObject {
    /** An array of entity identifiers to spawn when the interaction occurs */
    spawn_entities?: string[];
    /** An event identifier to fire when the interaction occurs */
    on_interact?: string;
    /** Particle effect that will be triggered at the start of the interaction */
    particle_on_start?: {
      /** The type of particle that will be spawned */
      particle_type: string;
      /**
       * Will offset the particle this amount in the y direction
       * @default 0.0
       */
      particle_y_offset: number;
      /**
       * Whether or not the particle will appear closer to who performed the interaction
       * @default false
       */
      particle_offset_towards_interactor: boolean;
    };
    /**
     * Time in seconds before this entity can be interacted with again
     * @default 0.0
     */
    cooldown?: number;
    /**
     * If true, the player will do the 'swing' animation when interacting with this entity
     * @default false
     */
    swing?: boolean;
    /**
     * If true, the interaction will use an item
     * @default false
     */
    use_item?: boolean;
    /**
     * The amount of damage the item will take when used to interact with this entity. A value of 0 means the item won't lose durability
     * @default 0
     */
    hurt_item?: number;
    /** Text to show when the player is able to interact in this way with this entity when playing with Touch-screen controls */
    interact_text?: string;
    /** Loot table with items to add to the player's inventory upon successful interaction */
    add_items?: LootTable;
    /** Loot table with items to drop on the ground upon successful interaction */
    spawn_items?: LootTable;
    /** The item used will transform to this item upon successful interaction. Format: itemName:auxValue */
    transform_to_item?: string;
    /** An array of sound identifiers to play when the interaction occurs */
    play_sounds?: string | string[];
  }

  interface InventoryComponent extends ComponentObject {
    /**
     * Type of container this entity has. Can be horse, minecart_chest, minecart_hopper, inventory, container or hopper
     * @default none
     */
    container_type?:
      | "horse"
      | "minecart_chest"
      | "minecart_hopper"
      | "inventory"
      | "container"
      | "hopper";
    /**
     * Number of slots the container has
     * @default 5
     */
    inventory_size?: number;
    /**
     * If true, the contents of this inventory can be removed by a hopper
     * @default false
     */
    can_be_siphoned_from?: boolean;
    /**
     * If true, only the entity can access the inventory
     * @default false
     */
    private?: boolean;
    /**
     * If true, the entity's inventory can only be accessed by its owner or itself
     * @default false
     */
    restrict_to_owner?: boolean;
    /**
     * Number of slots that this entity can gain per extra strength
     * @default 0
     */
    additional_slots_per_strength?: number;
  }

  /** Makes the entity look at another entity. Once applied, if an entity of the specified type is nearby and can be targeted the entity will turn towards it. */
  interface LookAtComponent extends ComponentObject {
    /** Defines the entities that can trigger this component */
    filters?: Filter;
    /**
     * The range for the random amount of time during which the entity is 'cooling down' and won't get angered or look for a target
     * @default [0.0, 0.0]
     */
    look_cooldown?: MCRange;
    /** The event identifier to run when the entities specified in filters look at this entity */
    look_event?: string;
    /**
     * If true, invulnerable entities (e.g. Players in creative mode) are considered valid targets
     * @default false
     */
    mAllowInvulnerable?: boolean;
    /**
     * Maximum distance this entity will look for another entity looking at it
     * @default 10.0
     */
    searchRadius?: number;
    /**
     * If true, this entity will set the attack target as the entity that looked at it
     * @default true
     */
    setTarget?: boolean;
  }

  /** Nameable component describes an entity's ability to be named using a nametag and whether the name shows up or not once applied. Additionally, scripting allows setting the name of the entity directly with the property 'name'. */
  interface NameableCompoent {
    /** Describes the special names for this entity and the events to call when the entity acquires those names */
    name_actions?: {
      /** Event to be called when this entity acquires the name specified in 'name_filter' */
      on_named: string;
      /** List of special names that will cause the events defined in 'on_named' to fire */
      name_filter: string | string[];
    };
    /** Trigger to run when the entity gets named */
    default_trigger?: string;
    /**
     * If true, the name will always be shown
     * @default false
     */
    alwaysShow?: boolean;
    /**
     * If true, this entity can be renamed with name tags
     * @default true
     */
    allowNameTagRenaming?: boolean;
    /** The current name of the entity, empty if the entity hasn't been named yet, making this non-empty will apply the name to the entity */
    name?: string;
  }

  /** This component allows you to control an entity's current position in the world. Once applied the entity will be teleported to the new position specified. */
  interface PositionComponent extends ComponentObject {
    /** Position along the X-Axis (east-west) of the entity */
    x?: number;
    /** Position along the Y-Axis (height) of the entity */
    y?: number;
    /** Position along the Z-Axis (north-south) of the entity */
    z?: number;
  }

  /** This component allows you to control an entity's current rotation in the world as well as the entity's head rotation. Once applied, the entity will be rotated as specified. */
  interface RotationComponent extends ComponentObject {
    /** Controls the head rotation looking up and down */
    x?: number;
    /** Controls the body rotation parallel to the floor */
    y?: number;
  }

  /** Defines the entity's ranged attacks. This doesn't allow the entity to use a ranged attack: it only defines what kind of projectile it shoots. */
  interface ShooterComponent extends ComponentObject {
    /** Entity identifier to use as projectile for the ranged attack. The entity must have the projectile component to be able to be shot as a projectile */
    def: string;
    /**
     * ID of the Potion effect to be applied on hit
     * @default -1
     */
    auxVal?: number;
  }

  /** Controls the entity's ability to spawn an entity or an item. This is similar to the chicken's ability to lay eggs after a set amount of time. */
  interface SpawnEntityComponent extends ComponentObject {
    /**
     * Minimum amount of time to randomly wait in seconds before another entity is spawned
     * @default 300
     */
    min_wait_time?: number;
    /**
     * Maximum amount of time to randomly wait in seconds before another entity is spawned
     * @default 600
     */
    max_wait_time?: number;
    /**
     * Identifier of the sound effect to play when the entity is spawned
     * @default "plop"
     */
    spawn_sound?: string;
    /**
     * Item identifier of the item to spawn
     * @default egg
     */
    spawn_item?: string;
    /** Identifier of the entity to spawn, leave empty to spawn the item defined above instead */
    spawn_entity?: string;
    /**
     * Method to use to spawn the entity
     * @default "burn"
     */
    spawn_method?: "born" | "summon";
    /**
     * Event to call when the entity is spawned
     * @default "minecraft:entity_born"
     */
    spawn_event?: string;
  }

  /** This controls the entity's ability to teleport itself (similar to the Enderman). If you wish to teleport the entity once use the Position component instead. */
  interface TeleportComponent extends ComponentObject {
    /**
     * Modifies the chance that the entity will teleport if the entity is in darkness
     * @default 0.01
     */
    darkTeleportChance?: number;
    /**
     * Modifies the chance that the entity will teleport if the entity is in daylight
     * @default 0.01
     */
    lightTeleportChance?: number;
    /**
     * Maximum amount of time in seconds between random teleports
     * @default 20.0
     */
    maxRandomTeleportTime?: number;
    /**
     * Minimum amount of time in seconds between random teleports
     * @default 0.0
     */
    minRandomTeleportTime?: number;
    /**
     * Entity will teleport to a random position within the area defined by this cube
     * @default [32.0, 16.0, 32.0]
     */
    randomTeleportCube?: [number, number, number];
    /**
     * If true, the entity will teleport randomly
     * @default true
     */
    randomTeleports?: boolean;
    /**
     * Maximum distance the entity will teleport when chasing a target
     * @default 16.0
     */
    targetDistance?: number;
    /**
     * The chance that the entity will teleport between 0.0 and 1.0. 1.0 means 100%
     * @default 1.0
     */
    target_teleport_chance?: number;
  }

  type ComponentMap = {
    "minecraft:attack": AttackComponent;
    "minecraft:collision_box": CollisionBoxComponent;
    "minecraft:damage_sensor": DamageSensorComponent;
    "minecraft:equipment": EquipmentComponent;
    "minecraft:equippable": EquippableComponent;
    "minecraft:explode": ExplodeComponent;
    "minecraft:healable": HealableComponent;
    "minecraft:health": HealthComponent;
    "minecraft:interact": InteractComponent;
    "minecraft:inventory": InventoryComponent;
    "minecraft:lookat": LookAtComponent;
    "minecraft:nameable": NameableCompoent;
    "minecraft:position": PositionComponent;
    "minecraft:rotation": RotationComponent;
    "minecraft:shooter": ShooterComponent;
    "minecraft:spawn_entity": SpawnEntityComponent;
    "minecraft:teleport": ExplodeComponent;
  };
}
