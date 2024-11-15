import { IBuilding } from "~scene/world/entities/building/types";
import { IWorld } from "~scene/world/types";
import { Nation } from "..";

export class City {
    readonly scene: IWorld;

    readonly nation: Nation;
  
    private buildings: IBuilding[] = [];

    private citycenter: IBuilding;

    private population: number = 1; 

    private name: string;

    constructor(scene: IWorld, nation: Nation, name: string, citycenter: IBuilding) {
        this.scene = scene;
        this.nation = nation;
        this.name = name;
        this.citycenter = citycenter;
    }
}