declare type FilterSubject = "self" | "other" | "parent" | "player" | "target";
declare type FilterOperator =
  | "equals"
  | "not"
  | "=="
  | "!="
  | "<>"
  | "<"
  | ">"
  | "<="
  | ">=";

declare interface CommonFilter<Name, T> {
  test: Name;
  subject?: FilterSubject;
  operator?: FilterOperator;
  value: T;
}
declare type CommonFilterOptinal<Name> = CommonFilter<Name, boolean | null>;

declare interface CommonFilterWithDomain<Name, D, T> {
  test: Name;
  subject?: FilterSubject;
  operator?: FilterOperator;
  domain?: D;
  value: T;
}

declare type Filter =
  | {
      all_of: Filter[];
    }
  | {
      any_of: Filter[];
    }
  | CommonFilter<"is_daytime", boolean | null>
  | CommonFilter<"hourly_clock_time", number>
  | CommonFilterWithDomain<"is_game_rule", string, boolean | null>
  | CommonFilter<"is_underwater", boolean | null>
  | CommonFilter<"clock_time", number>
  | CommonFilter<"moon_intensity", number>
  | CommonFilter<"in_water", boolean | null>
  | CommonFilter<"moon_phase", number>
  | CommonFilter<"distance_to_nearest_player", number>
  | CommonFilterWithDomain<
      "has_equipment",
      "any" | "feet" | "hand" | "armor" | "torso" | "head" | "leg",
      string
    >
  | CommonFilter<"is_underground", boolean | null>
  | CommonFilter<"in_water_or_rain", boolean | null>
  | CommonFilter<"on_ground", boolean | null>
  | CommonFilter<"is_brightness", number>
  | CommonFilter<"is_humid", boolean | null>
  | CommonFilter<"in_lava", boolean | null>
  | CommonFilter<"is_mark_variant", number>
  | CommonFilter<"is_color", string>
  | CommonFilter<"in_clouds", boolean | null>
  | CommonFilter<"on_ladder", boolean | null>
  | CommonFilter<"has_component", string>
  | CommonFilter<"is_family", string>
  | CommonFilter<"is_sneaking", boolean | null>
  | CommonFilter<
      "has_ability",
      | "worldbuilder"
      | "invulnerable"
      | "flying"
      | "instabuild"
      | "flySpeed"
      | "lightning"
      | "walkSpeed"
      | "noclip"
      | "mayfly"
      | "mute"
    >
  | CommonFilter<
      "has_damage",
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
      | "fly_into_wall"
    >
  | CommonFilter<"is_owner", boolean | null>
  | CommonFilter<"is_target", boolean | null>
  | CommonFilter<"is_immobile", boolean | null>
  | CommonFilter<"is_altitude", boolean | null>
  | CommonFilter<"is_moving", boolean | null>
  | CommonFilter<"is_climbing", boolean | null>
  | CommonFilter<"is_riding", boolean | null>
  | CommonFilter<"in_caravan", boolean | null>
  | CommonFilter<"is_leashed", boolean | null>
  | CommonFilter<"is_variant", boolean | null>
  | CommonFilter<"has_tag", string>
  | CommonFilter<"is_difficulty", "peaceful" | "easy" | "normal" | "hard">
  | CommonFilter<
      "is_biome",
      | "ice"
      | "forest"
      | "extreme_hills"
      | "beach"
      | "jungle"
      | "desert"
      | "flat"
      | "the_nether"
      | "mesa"
      | "plain"
      | "mushroom_island"
      | "ocean"
      | "river"
      | "savanna"
      | "stone_beach"
      | "swamp"
      | "taiga"
      | "the_end"
    >
  | CommonFilter<"has_biome_tag", string>
  | CommonFilter<"is_snow_covered", boolean | null>
  | CommonFilter<"is_temperature_type", "ocean"|"cold"|"mild"|"warm">
  | CommonFilter<"is_temperature_value", number>;
