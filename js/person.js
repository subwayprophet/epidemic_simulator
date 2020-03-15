class Person {
	constructor(age, susceptibilityPercent, daysTillResolution) { //susceptibilityPercent == S/N * 100
		this.age = age;
		this.statusLife = 'alive';
		this.SN = susceptibilityPercent / 100; //epidemiological concept
		this.isSusceptible = Math.random() < this.SN;
		this._statusInfected = 'never infected';
		this.daysSick = 0;
		this._daysTillResolution = daysTillResolution;
	}

	get isAlive() {
		return this.statusLife !== 'dead';
	}

	get isRecovered() {
		return this.statusInfected === 'recovered';
	}

	set isRecovered(isRecovered) {
		if(isRecovered) {
			this.statusInfected = 'recovered';
			this.isSusceptible = false;
		}
	}

	get isInfected() {
		return this.statusInfected === 'infected';
	}

	set isInfected(isInfected) {
		if(isInfected) {
			//console.log('legit marking as infected');
			this.statusInfected = 'infected';
			this.isSusceptible = false; // otherwise calculations are wrong
		}
	}

	get statusInfected() {
		return this._statusInfected;
	}

	set statusInfected(statusInfected) {
		this._statusInfected = statusInfected;
	}

	// set statusInfected(newStatusInfected) {
	// 	if(newStatusInfected === 'recovered') {
	// 		this.isInfected = false;
	// 		this.isSusceptible = false;
	// 	} else if (newStatusInfected === 'infected') {
	// 		this.isInfected = true;
	// 	}
	// }

	infect() {
		this.isInfected = true;
	}

	maybeInfect() {
		this.isInfected = this.isSusceptible;
	}

	die() {
		this.statusLife = 'dead';
		this.isSusceptible = false;
	}

	liveAnotherDay() {
		this.daysSick++;
	}

	get likelihoodOfDying() {
		return 0.034;
	}

	get likelihoodOfNotDyingAndNotRecovering() {
		return (this.daysTillResolution - this.daysSick)/this.daysTillResolution;
	}

	get likelihoodOfRecovering() {
		return 1 - (this.likelihoodOfDying + this.likelihoodOfNotDyingAndNotRecovering); //this is WRONG WRONG WRONG. PEOPLE CONTINUE TO LIVE
	}

	get daysTillResolution() {
		return this._daysTillResolution;
	}

	tryToLiveAnotherStep() {
		// console.log('gonna try to live another step');
		let p = this;
		let willDie = this.isInfected && Math.random() <= this.likelihoodOfDying;
		let willRecover = this.isInfected && Math.random() <= this.likelihoodOfRecovering;
		// console.log('willDie: ' + willDie);
		// console.log('willRecover: ' + willRecover);
		if(willDie) {
			p.die();
		} else if(willRecover) {
			p.recover();
		} else {
			p.liveAnotherDay();
			//console.log('just staying alive');
			//do nothing
		}
	}

	recover() {
		this.isRecovered = true;
	}

	contactPerson(person) {
		if(this.isInfected) {
			console.log('this.SN: ' + this.SN);
			person.maybeInfect();
			console.log(person.statusInfected)
		}
	}

}