export enum ResourceType {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
}

export type ResourceColor = Record<ResourceType, number>;

export type Resources = Partial<Record<ResourceType, number>>;
