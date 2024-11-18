import { IBuilding } from "~scene/world/entities/building/types";
import { IWorld } from "~scene/world/types";
import { Nation } from "..";
import { PositionAtMatrix } from "~scene/world/level/types";

export class City {
    readonly scene: IWorld;

    readonly nation: Nation;
  
    readonly citycenter: IBuilding;
    
    private buildings: IBuilding[] = [];    

    private _population: number = 1; 

    private _radis: number = 5;  // city radius

    private _name: string;

    constructor(scene: IWorld, nation: Nation, name: string, citycenter: IBuilding) {
        this.scene = scene;
        this.nation = nation;
        this.citycenter = citycenter;
        this._name = name;        
    }

    // Population growth
    public growPopulation() {
        if (this._population < this.getMaxPopulation()) {
            this._population++;
        }        
    }

    public getPopulation() { return this._population; }

    public getRadius() { return this._radis; }

    public getMaxPopulation() {
        let totalFoodProduction = 0;
        this.buildings.forEach(building => {
            totalFoodProduction += building.getFoodProduction();
        });
        return totalFoodProduction;
    }

    public distanceTo(pos: PositionAtMatrix) {
        return Math.abs(this.citycenter.positionAtMatrix.x - pos.x) + Math.abs(this.citycenter.positionAtMatrix.y - pos.y);
    }

    public addBuilding(building: IBuilding) {
        this.buildings.push(building);
    }
}