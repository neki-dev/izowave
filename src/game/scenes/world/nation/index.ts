import { IPlayer } from "../entities/player/types";
import { IWorld } from "../types";
import { City } from "./city";

export class Nation {
    readonly scene: IWorld;

    readonly player: IPlayer;
  
    private name: string;

    private cities: City[] = [];
    

    constructor(scene: IWorld, player: IPlayer, name: string) {
        this.scene = scene;
        this.player = player;
        this.name = name;
    }
}