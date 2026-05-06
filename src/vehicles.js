class Vehicle {
    constructor(make, model, mpg, id, fuelType = 'regular'){
        this.make = make;
        this.model = model;
        this.mpg = mpg;
        this.id = id;
        this.fuelType = fuelType;
    }

    string(){
        return JSON.stringify(this);
    }
}

export {Vehicle};
