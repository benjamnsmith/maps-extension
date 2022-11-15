class Vehicle {
    constructor(make, model, mpg, id){
        this.make = make;
        this.model = model;
        this.mpg = mpg;
        this.id = id;
    }

    string(){
        return JSON.stringify(this);
    }

}

export {Vehicle};