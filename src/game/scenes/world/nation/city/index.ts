import { IBuilding } from "~scene/world/entities/building/types";
import { IWorld } from "~scene/world/types";
import { Nation } from "..";
import { PositionAtMatrix } from "~scene/world/level/types";
import { BuildingCityCenter } from "~scene/world/entities/building/variants/citycenter";
import { LEVEL_MAP_PERSPECTIVE, LEVEL_MAP_TILE } from "~scene/world/level/const";

export class City {
    readonly scene: IWorld;

    readonly nation: Nation;
  
    readonly citycenter: BuildingCityCenter;
    
    private buildings: IBuilding[] = [];    

    private _population: number = 1; 

    private _radis: number = 15;  // city radius

    private _name: string;

    constructor(scene: IWorld, nation: Nation, name: string, citycenter: BuildingCityCenter) {
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

    public getRadiusInTile(): number {
        // Assume getImpactRadius() returns the pixel radius of the city's impact area
        const pixelRadius = this.citycenter.getImpactRadius();
    
        // Convert pixel radius to tiles. Since we're dealing with an isometric view, use the width for horizontal radius.
        const radiusInTilesHorizontal = pixelRadius / LEVEL_MAP_TILE.width;
    
        // Adjust the vertical radius for the isometric perspective
        const radiusInTilesVertical = (pixelRadius / LEVEL_MAP_TILE.height) / LEVEL_MAP_PERSPECTIVE;
    
        // For gameplay purposes, you might want to use the average of these two calculations,
        // or choose the smaller to ensure the radius does not overestimate the area.
        return Math.max(radiusInTilesHorizontal, radiusInTilesVertical);
    }
    
    public canHire() {
        return this._population > 10;
    }

    public hireSoldier() {
        if (this.canHire()) {
            this._population -= 1;
        }
    }

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