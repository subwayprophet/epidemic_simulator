class Outbreak {
	constructor(people, startingSusceptiblePopulationPercent, rNought) {
		this.people = people;
		let startingPopulation = people.length;
		this._startingSusceptiblePopulation = startingPopulation * startingSusceptiblePopulationPercent / 100;
		this.rNought = rNought;
		this.rEffective = rNought; //starting value
	}

	infectSomePeople(countToInfect) {
		for(let i=0; i<countToInfect; i++) {
			let personToInfect = this.peopleNotInfected[i];
			personToInfect.infect();
		}
		console.log('seed people now infected: ')
		console.log(this.peopleInfected);
	}

	get currentPopulation() {
		return this.peopleAlive.length;
	}

	get SN() {
		return this.populationSusceptible / this.currentPopulation;
	}

	get rEffective() {
		return this.rNought * this.SN;
	}

	set rEffective(newReffective) {
		this._rEffective = newReffective;
	}

	get peopleAlive() {
		return this.people.filter(person => { return person.isAlive });
	}

	get peopleSusceptible() {
		return this.people.filter(person => { return person.isSusceptible && person.isAlive});
	}

	get peopleInfected() {
		return this.people.filter(person => { return person.isInfected});
	}

	get peopleInfectedAndAlive() {
		return this.people.filter(person => { return person.isInfected && person.isAlive});
	}

	get peopleNotInfected() {
		return this.people.filter(person => { return !person.isInfected});
	}

	get peopleDead() {
		return this.people.filter(person => { return !person.isAlive});
	}

	get peopleRecovered() {
		return this.people.filter(person => { return person.isRecovered});
	}

	get populationAlive() {
		return this.peopleAlive.length;
	}

	get populationDead() {
		return this.peopleDead.length;
	}

	get populationSusceptible() {
		return this.peopleSusceptible.length;
	}

	playOut() {
		console.log('simulating...');
		let o = this;
		let outbreakOver = false;
		let maxSteps = 1000;
		let steps = 0;
		while(!outbreakOver && steps < maxSteps) {
			outbreakOver = o.step();
			steps++;
		}
		if(outbreakOver) {
			console.log('steps needed for outbreak to end: ' + steps);
		} else {
			console.log('steps attempted before giving up: ' + steps);
		}
	}

	step() {
		//console.log('starting with this many infected: ' + this.peopleInfected.length);
		//console.log('rNought is ' + this.rNought);
		//console.log('SN is: ' + this.SN);

		//console.log('susceptible people: ' + this.populationSusceptible);

		//spread the disease
		//console.log('rEffective is ' + this.rEffective);
		let tempPeopleInfected = deepCloneArray(this.peopleInfectedAndAlive);
		let everyoneIsInfected = false;
		for(let i=0; i<tempPeopleInfected.length; i++) {
			if(everyoneIsInfected) break;
			let person = tempPeopleInfected[i];
			if(person.isInfected) {
				for(let j=0; j<this.rEffective; j++) { //get the rEffective right dude
					//console.log('infecting another person');
					try {
						let newPersonToInfect = this.peopleSusceptible[j];
						// console.log('about to infect this person:');
						// console.log(newPersonToInfect);
						newPersonToInfect.infect();
						// console.log('result: ');
						// console.log(newPersonToInfect);
					}
					catch(err) {
						console.log('everyone is already infected');
						everyoneIsInfected = true;
						break;
					}
				}
			}
		}
		//try to live another day
		this.people.forEach(person => {
			person.tryToLiveAnotherStep();
		});
		let isOver = this.populationAlive === 0 || this.populationSusceptible === 0;
		if(isOver) {
			let nowAlive = this.populationAlive;
			let nowDead = this.populationDead;
			console.log('OUTBREAK RESULTS: ');
			console.log('now infected-living count is: ' + this.peopleInfectedAndAlive.length);
			console.log('population alive: ' + nowAlive);
			console.log('population dead: ' + nowDead);
			console.log('recovered count: ' + this.peopleRecovered.length);
			console.log('susceptible count is: ' + this.populationSusceptible);
			console.log('SN is: ' + this.SN);
			console.log('pct of population that died: ' + 100*nowDead/(nowAlive+nowDead) + '%');

		}
		return isOver;
	}


}

function deepCloneArray(inputArr) {
	retArr = [];
	inputArr.forEach(arr => { retArr.push(arr)});
	return retArr;
}