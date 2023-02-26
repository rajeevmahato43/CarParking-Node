const max_available_time_car = 72;   /// max time in hour
const max_available_time_carBike = 24  // max time in hour
const rate_car = 20 //rate per hour for car
const rate_bike = 10 // rate per hour for bike
const rate_bus = 60;  //rate for bus

// need this [floor:[row1:[],row2:[],row3:[]]]
class ParkingSlots {
  constructor(slotNumber, type) {
    this.slotNumber = slotNumber;
    this.type = type; // can be 'car', 'bike', or 'bus'
    this.vehicle = [null, null]; // initially no vehicle is parked in this slot
  }
  isparkAvaibale(type) {
    if (type == 'bike') {
      let space = false;
      space = !this.vehicle[0]
      if (!space) {
        space = !this.vehicle[1]
      }
      return space;
    } else {
      return !this.vehicle[0] && !this.vehicle[1];
    }
  }
  park(type, vehicle) {
    if (!this.isparkAvaibale(type)) {
      throw new Error(`Slot ${this.slotNumber} is not available`);
    }
    if (type == 'bike') {
      if (this.vehicle[0] == null) {
        this.vehicle[0] = vehicle;
        return this.slotNumber + "/A"
      } else {
        this.vehicle[1] = vehicle;
        return this.slotNumber + "/B"
      }

    } else if (type == 'bus') {
      this.vehicle[0] = vehicle
      this.vehicle[1] = vehicle
      this.type = 'bus'
      return this.slotNumber + '/AB'
    } else {
      this.vehicle[0] = vehicle
      this.vehicle[1] = vehicle
      return this.slotNumber + '/AB'
    }
  }
  unpark(slot) {
    if (slot == 'AB') {
      let vehicle = this.vehicle[0];
      this.vehicle = [null, null]
      if (this.type == 'bus') {
        return "bus-" + vehicle
      } else {
        return "car-" + vehicle
      }
    } else if (slot == 'A') {
      let vehicle = this.vehicle[0];
      this.vehicle[0] = null;
      return "bike-" + vehicle
    } else if (slot == 'B') {
      let vehicle = this.vehicle[1];
      this.vehicle[1] = null
      return "bike-" + vehicle
    } else {
      throw new Error(`Slot ${this.slotNumber} is already empty`);
    }

  }
}
class ParkingFloors {
  constructor(floorNumber, numSlots) {
    this.floorNumber = floorNumber;
    this.slots = [[], [], []];
    let noOfSpace = numSlots / 5;
    let row1 = noOfSpace;   // as per layout single lane parking accepts all
    let row2 = noOfSpace * 2; // as per layout double lane parking accepts all
    let row3 = noOfSpace * 2   // as per layout double lane parking accepts bike only
    for (let i = 1; i <= row1; i++) {
      this.slots[0].push(new ParkingSlots("row1-" + i, 'car'));
    }
    for (let i = 1; i <= row2; i++) {
      this.slots[1].push(new ParkingSlots("row2-" + i, 'car'));
    }
    for (let i = 1; i <= row3; i++) {
      this.slots[2].push(new ParkingSlots("row3-" + i, 'bike'));
    }
  }
  isSlotAvailable(type) {
    if (type == "car" || type == "bus") {
      if (type == 'bus' && this.slots[0].length > 2) {
        for (let i = 0; i < this.slots[0].length; i += 3) {
          if (this.slots[0][i].isparkAvaibale("car") && this.slots[0][i + 1].isparkAvaibale("car") && this.slots[0][i + 2].isparkAvaibale("car")) {
            return true;
          }
        }
        //In mid row we have two column  for bus it will take 3 space. That why check 3 continus sapce in same row. 
        //row2 column 1
        for (let i = 0; i < this.slots[1].length / 2; i += 3) {
          if (this.slots[1][i].isparkAvaibale("car") && this.slots[1][i + 1].isparkAvaibale("car") && this.slots[1][i + 2].isparkAvaibale("car")) {
            return true;
          }

        }
        //row2 column 2
        for (let i = this.slots[1].length / 2; i < this.slots[2].length; i += 3) {
          if (this.slots[1][i].isparkAvaibale("car") && this.slots[1][i + 1].isparkAvaibale("car") && this.slots[1][i + 2].isparkAvaibale("car")) {
            return true;
          }

        }
        return false;

      } else if (type == 'car') {
        for (const row1 of this.slots[0]) {
          if (row1.isparkAvaibale("car")) {
            return true;
          }
        }
        for (const row2 of this.slots[1]) {
          if (row2.isparkAvaibale("car")) {
            return true;
          }
        }
        return false;
      }
    } else if (type == "bike") {
      for (const row3 of this.slots[2]) {
        if (row3.isparkAvaibale("bike")) {
          return true;
        }
      }
      for (const row1 of this.slots[0]) {
        if (row1.isparkAvaibale("bike")) {
          return true;
        }
      }
      for (const row2 of this.slots[1]) {
        if (row2.isparkAvaibale("bike")) {
          return true;
        }
      }
      return false;
    }
  }
  park(type, vehicle) {

    if (type == "bike") {
      for (const row3 of this.slots[2]) {
        if (row3.isparkAvaibale("bike")) {
          let sl = row3.park(type, vehicle)
          return sl
        }
      }
      for (const row1 of this.slots[0]) {
        if (row1.isparkAvaibale("bike")) {
          let sl = row1.park(type, vehicle)
          return sl
        }
      }
      for (const row2 of this.slots[1]) {
        if (row2.isparkAvaibale("bike")) {
          let sl = row2.park(type, vehicle)
          return sl
        }
      }
      return false;
    } else if (type == 'car') {
      for (const row1 of this.slots[0]) {
        if (row1.isparkAvaibale("car")) {
          let sl = row1.park(type, vehicle)
          return sl
        }
      }
      for (const row2 of this.slots[1]) {
        if (row2.isparkAvaibale("car")) {
          let sl = row2.park(type, vehicle)
          return sl
        }
      }
    } else if (type == 'bus' && this.slots[0].length > 2) {
      for (let i = 0; i < this.slots[0].length; i += 3) {
        if (this.slots[0][i].isparkAvaibale("car") && this.slots[0][i + 1].isparkAvaibale("car") && this.slots[0][i + 2].isparkAvaibale("car")) {
          let sl = this.slots[0][i].park(type, vehicle);
          this.slots[0][i + 1].park(type, vehicle);
          this.slots[0][i + 2].park(type, vehicle);
          return sl
        }
      }
      //In mid row we have two column  for bus it will take 3 space. That why check 3 continus sapce in same row. 
      //row2 column 1
      for (let i = 0; i < (this.slots[1].length / 2); i += 3) {
        if (this.slots[1][i].isparkAvaibale("car") && this.slots[1][i + 1].isparkAvaibale("car") && this.slots[1][i + 2].isparkAvaibale("car")) {
          let sl = this.slots[1][i].park(type, vehicle);
          this.slots[1][i + 1].park(type, vehicle);
          this.slots[1][i + 2].park(type, vehicle);
          return sl
        }

      }
      //row2 column 2
      for (let i = (this.slots[1].length / 2); i < this.slots[1].length; i += 3) {
        if (this.slots[1][i].isparkAvaibale("car") && this.slots[1][i + 1].isparkAvaibale("car") && this.slots[1][i + 2].isparkAvaibale("car")) {
          let sl = this.slots[1][i].park(type, vehicle);
          this.slots[1][i + 1].park(type, vehicle);
          this.slots[1][i + 2].park(type, vehicle);
          return sl
        }
      }
      return false;
    }
  }
  unpark(slotNumber) {
    let rows = slotNumber.split("-")
    let vehicle = ''
    if (rows[0] == 'row1') {
      const slot = this.slots[0][rows[1].split('/')[0]-1];
      vehicle = slot.unpark(rows[1].split('/')[1]);
      unparkBus(this.slots[0], rows[1].split('/')[0], rows[1].split('/')[1], vehicle);
    } else if (rows[0] == 'row2') {
      const slot = this.slots[1][rows[1].split('/')[0]-1];
      vehicle = slot.unpark(rows[1].split('/')[1]);
      unparkBus(this.slots[1], rows[1].split('/')[0], rows[1].split('/')[1], vehicle);
    } else if (rows[0] == 'row3') {
      const slot = this.slots[2][rows[1].split('/')[0]-1];
      vehicle = slot.unpark(rows[1].split('/')[1]);
    } else {
      throw new Error(`Invalid slot  ${slotNumber}`);
    }

    return vehicle;
  }
}
function unparkBus(slots, row, slotType, vehicle) {
  let rowid = parseInt(row);
  if (vehicle.split("-")[0] == 'bus') {
    slots[rowid].unpark(slotType);
    slots[rowid + 1].unpark(slotType);
  }
}
class parkingSpace {
  constructor(numFloors, numSlotsPerFloor) {
    if (numSlotsPerFloor % 5 == 0) {
      this.floors = [];
      for (let i = 1; i <= numFloors; i++) {
        this.floors.push(new ParkingFloors(i, numSlotsPerFloor));
      }
    } else {
      console.log("As per parking layout only multiplication of 5 can be supported")
    }
  }
  isAvailable(type) {
    for (const floor of this.floors) {
      if (floor.isSlotAvailable(type)) {
        return true;
      }
    }
    return false;
  }

  park(type, vehicle) {
    for (const floor of this.floors) {
      if (floor.isSlotAvailable(type)) {
        const slotNumber = floor.park(type, vehicle);
        const floorNumber = floor.floorNumber;
        return { floorNumber, slotNumber };
      }
    }
    throw new Error(`No available slot of type ${type}`);
  }
  unpark(floorNumber, slotNumber) {
    if (floorNumber <= 0 || floorNumber > this.floors.length) {
      throw new Error(`Invalid floor number: ${floorNumber}`);
    }
    const floor = this.floors[floorNumber - 1];
    const vehicle = floor.unpark(slotNumber);
   const amount= generateInvoice(vehicle);
    return vehicle +" Unparked Invoce:"+Math.round(amount);
  }
}
function generateInvoice(vehicle) {
  vehicle = vehicle.split('-')

  const duration = (Date.now() - vehicle[1]) / 3600000; // convert from milliseconds to hours
  let rate;
  switch (vehicle[0]) {
    case 'car':
      rate = rate_car;
      if (duration > max_available_time_car) {
        rate *= 1.5;
        rate=rate*Math.round(duration)
      }
      break;
    case 'bike':
      rate = rate_bike;
      if (duration > max_available_time_carBike) {
        rate *= 1.5;
        rate=rate*Math.round(duration)
      }
      break;
    case 'bus':
      rate = rate_bus;
      if (duration > max_available_time_carBike) {
        rate *= 1.5;
        rate=rate*Math.round(duration)
      }
      break;
    default:
      throw new Error(`Invalid vehicle type: ${this.type}`);
  }
  return rate 
}
//parkingSpace(no of floor per buildng , no of total parking slots as per layout)
let newPark = new parkingSpace(1, 15);
let x = newPark.isAvailable("bus");
  let bus1 = newPark.park("bus", Date.now());
  let bus2 = newPark.park("bus", Date.now());
  let car = newPark.park("car", Date.now());
  let bike1 = newPark.park("bike", Date.now());
  let bike2 = newPark.park("bike", Date.now());
  console.log("Bus 1 FloorNumber: " + bus1.floorNumber + " SlotsNumber: " + bus1.slotNumber);
  console.log("Bus 2 FloorNumber: " + bus2.floorNumber + " SlotsNumber: " + bus2.slotNumber);
  console.log("Car 1 FloorNumber: " + car.floorNumber + " SlotsNumber: " + car.slotNumber);
  console.log("Bike 1 FloorNumber: " + bike1.floorNumber + " SlotsNumber: " + bike1.slotNumber);
  console.log("Bike 2 FloorNumber: " + bike2.floorNumber + " SlotsNumber: " + bike2.slotNumber);
  let unpark1=newPark.unpark(bus1.floorNumber, bus1.slotNumber);
  let unpark2=newPark.unpark(bike1.floorNumber, bike1.slotNumber);
  let unpark3=newPark.unpark(car.floorNumber, car.slotNumber);
  console.log(unpark1);
  console.log(unpark2);
  console.log(unpark3);
  let bike3 = newPark.park("bike", Date.now());
  console.log("Bike 3 FloorNumber: " + bike3.floorNumber + " SlotsNumber: " + bike3.slotNumber);


