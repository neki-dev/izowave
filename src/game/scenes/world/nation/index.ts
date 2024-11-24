import { IPlayer } from "../entities/player/types";
import { IWorld } from "../types";
import { City } from "./city";
import { PositionAtMatrix } from "../level/types";

export class Nation {
    readonly scene: IWorld;

    readonly player: IPlayer;
  
    private _name: string;

    private cities: City[] = [];
    

    constructor(scene: IWorld, player: IPlayer, name: string) {
        this.scene = scene;
        this.player = player;
        this._name = name;
    }

    public addCity(city: City) {
        this.cities.push(city);
    }

    public getCityNum() { return this.cities.length; }
    
    public getCityContainingPos(pos: PositionAtMatrix) {
        // get the city list sorted by distance 
        const sortedCities = this.cities.sort((a, b) => {
            return a.distanceTo(pos) - b.distanceTo(pos);
        });

        // Check if the tile is within the radius of a city
        return sortedCities.find(city => city.distanceTo(pos) <= city.getRadiusInTile());
    }

    public isPosContainedByCity(pos: PositionAtMatrix) {
        return this.cities.some(city => city.distanceTo(pos) <= city.getRadiusInTile());
    }


}