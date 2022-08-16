'use strict';

/* --------------------- Useful classes --------------------- */

//Vec naming convention for preventing collisions with three js library
class Vec2 {
	constructor(x = 0, y = 0) {
		this.set(x, y);
	}

	set(x, y) {
		this.x = x;
		this.y = y;
	}

	copy(vec) {
		this.x = vec.x;
		this.y = vec.y;
	}

	sub(vec, vec2 = null) {
		if (!vec2) {
			this.x -= vec.x;
			this.y -= vec.y;
			return;
		}
		this.x = vec.x - vec2.x;
		this.y = vec.y - vec2.y;
	}

	get magnitude() {
		return Math.hypot(this.x, this.y);
	}

	get width() {
		return this.x;
	}
	get w() {
		return this.x;
	}
	set width(x) {
		this.x = x;
	}
	set w(x) {
		this.x = x;
	}

	get height() {
		return this.y;
	}
	get h() {
		return this.y;
	}
	set height(y) {
		this.y = y;
	}
	set h(y) {
		this.y = y;
	}
}

class GridClipPath {
	_progress = 0;

	constructor(element, divisionsX, divisionsY) {
		this.element = element;
		//Adds one for the invisible column needed offscreen
		this.divisionsX = divisionsX;
		this.divisionsY = divisionsY;
		this.columnW = 100 / this.divisionsX;
		this.rowH = 100 / this.divisionsY;
	}

	get progress() {
		return this._progress;
	}
	set progress(progress) {
		this._progress = progress;

		if (progress == 0) return (this.element.style.clipPath = 'none');
		if (progress == 1) return (this.element.style.visibility = 'hidden');
		this.element.style.visibility = null;

		let x = Math.floor(((progress * this.divisionsY) % 1) * this.divisionsX),
			y = Math.floor(progress * this.divisionsY);

		if (this.x != x || this.y != y) {
			this.x = x;
			this.y = y;

			const topY = this.rowH * y,
				bottomY = this.rowH * (y + 1),
				scanX = this.columnW * x;

			this.element.style.clipPath = `polygon(${scanX}% ${topY}%, 100% ${topY}%, 100% 100%, 0 100%, 0 ${bottomY}%, ${scanX}% ${bottomY}%)`;
		}
	}
}

class Carousel {
	constructor(
		optionsList,
		{ length, leftBtn, rightBtn, countDisplay, autoPlay }
	) {
		this._optionsList = optionsList;
		this._countDisplay = countDisplay;
		this._autoPlay = autoPlay;
		leftBtn?.addEventListener(
			'click',
			(() => this.current--).bind(this),
			false
		);
		rightBtn?.addEventListener(
			'click',
			(() => this.current++).bind(this),
			false
		);
		if (length) this.length = length;
	}

	get length() {
		return this._length;
	}
	set length(length) {
		if (length <= 0 || length >= this._optionsList.length)
			return console.error('invalid length');
		this._length = length;
		this.current = 0;
		this.autoPlay();
	}

	autoPlay() {
		if (this._autoPlay) {
			if (this._interval) clearTimeout(this._interval);
			this._interval = setTimeout(
				(() => this.current++).bind(this),
				this._autoPlay * 1000
			);
		}
	}

	get current() {
		return this._current;
	}
	set current(i) {
		if (!this.length) return;
		i = mod(i, this.length);
		if (this.current !== undefined) {
			if (this.current === i)
				return; /* When the current is identical to the one being set */
			this._optionsList.children[this.current].classList.remove('active');
		}
		this._current = i;
		this._optionsList.children[this.current].classList.add('active');
		this.autoPlay();
		if (this._countDisplay)
			this._countDisplay.textContent = `${this.current + 1}/${this.length}`;
	}
}

/* --------------------- Useful functions --------------------- */

function dragEvents(
	element,
	onStart = null,
	onDrag = null,
	onEnd = null,
	moveToContainer = window
) {
	const eventData = {
		pos: new Vec2(),
		startPos: new Vec2(),
		delta: new Vec2()
		/*Custom properties can also be added in callbacks to carry data across callback functions*/
	};

	let moved = false,
		id,
		lastPos;
	const dragElement = moveToContainer || element,
		preventsPointer =
			dragElement.classList && dragElement.classList.contains('no-pointer');

	function drag(e) {
		eventData.pos.set(e.clientX, e.clientY);

		if (moved) {
			eventData.target = e.target;
			e.preventDefault();
			return eventData.delta.sub(eventData.pos, eventData.startPos);
		}

		eventData.startPos.copy(eventData.pos);
		if (onStart) onStart(eventData);
		if (preventsPointer) dragElement.classList.remove('no-pointer');
		(id = requestAnimationFrame(throttledDrag)), (moved = true);
	}

	function throttledDrag() {
		if (onDrag && lastPos != eventData.pos) onDrag(eventData);
		id = requestAnimationFrame(throttledDrag);
	}

	function end(e) {
		e.preventDefault();
		dragElement.removeEventListener('pointerup', end);
		dragElement.removeEventListener('pointercancel', end);
		dragElement.removeEventListener('pointerleave', end);
		dragElement.removeEventListener('pointermove', drag);

		if (!moved) return;
		cancelAnimationFrame(id);
		eventData.pos.set(e.clientX, e.clientY);
		eventData.delta.sub(eventData.pos, eventData.startPos);
		eventData.target = e.target;
		if (preventsPointer) dragElement.classList.add('no-pointer');
		moved = false;
		if (onEnd) onEnd(eventData);
	}

	element.addEventListener(
		'pointerdown',
		e => {
			eventData.target = e.target;
			dragElement.addEventListener('pointermove', drag, false);
			dragElement.addEventListener('pointerup', end, false);
			dragElement.addEventListener('pointercancel', end, false);
			dragElement.addEventListener('pointerleave', end, false);
		},
		false
	);
}

function originFromSecondaryElement(
	element,
	secondaryElement,
	xOffset = 0.5,
	yOffset = 0.5
) {
	//Gets the transform origin of an element as though it were on the secondary element
	const rect = element.getBoundingClientRect(),
		secondaryRect = secondaryElement.getBoundingClientRect(),
		targetX = secondaryRect.x + secondaryRect.width * xOffset,
		targetY = secondaryRect.y + secondaryRect.height * yOffset;

	return `${((targetX - rect.x) / rect.width) * 100}% ${
		((targetY - rect.y) / rect.height) * 100
	}%`;
}

function splitText(textElement) {
	textElement.style.whiteSpace = 'pre-wrap';
	const text = textElement.textContent,
		fragment = document.createDocumentFragment(),
		letter = document.createElement('span'),
		word = document.createElement('div'),
		letters = [];

	letter.style.display = 'inline-block';
	word.style.display = 'inline-block';
	word.style.whiteSpace = 'nowrap';
	let currentWord = word.cloneNode();
	for (let char of text) {
		const span = letter.cloneNode();
		span.innerText = char;
		letters.push(span);
		if (char != ' ') {
			currentWord.appendChild(span);
			continue;
		}
		fragment.appendChild(currentWord);
		fragment.appendChild(span);
		currentWord = word.cloneNode();
	}
	fragment.appendChild(currentWord);
	textElement.replaceChild(fragment, textElement.firstChild);

	return letters;
}

function fitRectScale(rect1, rect2) {
	//Returns the correct scale for rect1 to fit in rect2
	return Math.min(rect2.w / rect1.w, rect2.h / rect1.h);
}

function fillRectScale(rect1, rect2) {
	//Returns the correct scale for rect1 to fill rect2
	return Math.max(rect2.w / rect1.w, rect2.h / rect1.h);
}

function loadJson(path, onLoad, onError) {
	fetch(path)
		.then(response => response.json())
		.then(data => onLoad(data))
		.catch(err => onError && onError(err));
}

function mod(x, y) {
	return ((x % y) + y) % y;
}

function oneUseEventListener(element, event, callback, options) {
	const cb = e => {
		element.removeEventListener(event, cb, options);
		callback.bind(this)(e);
	};
	element.addEventListener(event, cb, options);
}

function interpretBounds(boundsStr) {
	return boundsStr.split(' ').map(str => parseFloat(str) / 100);
}

/* --------------------- Common functionality --------------------- */

const requestAnimationFrame =
		window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame,
	cancelAnimationFrame =
		window.cancelAnimationFrame || window.mozCancelAnimationFrame,
	AudioContext = window.AudioContext || window.webkitAudioContext;

const viewport = {
	_updated: true,
	size: new Vec2(),
	//A target to watch for events
	target: new EventTarget(),
	init() {
		this.updateViewport();
		window.addEventListener('resize', () => (this._updated = true), false);
	},
	updateViewport() {
		//Throttles the all resize updates
		requestAnimationFrame(this.updateViewport.bind(this));
		if (!this._updated) return;
		this._updated = false;

		this.size.w = window.innerWidth;
		this.size.h = window.innerHeight;
		this.vmin = Math.min(this.size.w, this.size.h);
		this.vmax = Math.max(this.size.w, this.size.h);
		this.ratio = this.size.w / this.size.h;
		this.portrait = this.size.w < this.size.h;

		//This accounts for unwanted vh behaviour on mobile devices: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
		document.documentElement.style.setProperty(
			'--vh',
			`${this.size.h * 0.01}px`
		);

		this.target.dispatchEvent(new Event('update'));
	},
	mapToViewport(vec2) {
		//returns mouse px coords into a negative one to positive one range on the x and y axes
		vec2.x = (vec2.x / this.size.w) * 2 - 1;
		vec2.y = (vec2.y / this.size.h) * 2 - 1;
		return vec2;
	}
};
viewport.init();

//Theme colors for use in code
const docStyle = getComputedStyle(document.documentElement),
	colors = {
		blueAccent: docStyle.getPropertyValue('--blue-accent').trim(),
		purpleAccent: docStyle.getPropertyValue('--purple-accent').trim(),
		burgundyAccent: docStyle.getPropertyValue('--burgundy-accent').trim(),
		pinkAccent: docStyle.getPropertyValue('--pink-accent').trim(),
		yellowAccent: docStyle.getPropertyValue('--yellow-accent').trim(),
		blackPrimary: docStyle.getPropertyValue('--black-primary').trim(),
		darkPrimary: docStyle.getPropertyValue('--dark-primary').trim(),
		lightPrimary: docStyle.getPropertyValue('--light-primary').trim(),
		whitePrimary: docStyle.getPropertyValue('--white-primary').trim()
	};
