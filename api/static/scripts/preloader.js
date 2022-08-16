'use strict';

class LoadEvent {
	completed = false;

	constructor(autoSettings = null) {
		//autoSettings provide automatic loading behaviours that dont require you to use the manual complete method
		if (autoSettings) {
			this.autoSettings = autoSettings;
			if (autoSettings.target) {
				autoSettings.target.addEventListener(
					autoSettings.type ? autoSettings.type : 'load',
					(autoSettings.callback = this.complete.bind(this)),
					false
				);
			}
			if (autoSettings.itemsToLoad) this.loadedItems = 0;
		}

		Preloader.loadEvents.push(this);
	}

	complete(e) {
		if (this.completed) return;
		if (
			this.autoSettings.itemsToLoad &&
			++this.loadedItems < this.autoSettings.itemsToLoad
		)
			return;
		if (this.autoSettings.target) {
			this.autoSettings.target.removeEventListener(
				this.autoSettings.type ? this.autoSettings.type : 'load',
				this.autoSettings.callback
			);
			if (this.autoSettings.addCallback) this.autoSettings.addCallback(e);
		}

		this.completed = true;
		Preloader.attemptComplete();
	}
}

const ComputerEffect = {
	ratio: 2400 / 1800,
	screenBounds: {
		x: 980 / 2400,
		y: 342 / 1800,
		w: 812 / 2400,
		h: 583 / 1800
	},
	calcScreen(noChange) {
		//Recalculates a lot of the pixel values for the effect to even work
		const fillHeight = viewport.ratio < ComputerEffect.ratio;
		this.bgImgSize = new Vec2(
			fillHeight ? viewport.size.h * this.ratio : viewport.size.w,
			fillHeight ? viewport.size.h : viewport.size.w / this.ratio
		);
		this.screenBoundsPx = {
			x: this.bgImgSize.w * this.screenBounds.x,
			y: this.bgImgSize.h * this.screenBounds.y,
			w: this.bgImgSize.w * this.screenBounds.w,
			h: this.bgImgSize.h * this.screenBounds.h
		};
		this.bodyScale = fitRectScale(viewport.size, this.screenBoundsPx);
		if (noChange) return;
		//The .9 means the screen will only fill 90% of the available area, effectively padding the screen
		const bodyScalePadded = this.bodyScale * 0.9;

		document.body.style.transform = `translate(${
			this.screenBoundsPx.x +
			(this.screenBoundsPx.w - viewport.size.w * bodyScalePadded) / 2 -
			(this.bgImgSize.w - viewport.size.w) / 2
		}px,
                ${
									this.screenBoundsPx.y +
									(this.screenBoundsPx.h - viewport.size.h * bodyScalePadded) /
										2 -
									(this.bgImgSize.h - viewport.size.h) / 2
								}px) 
                scale(${bodyScalePadded})`;
	},
	turnOn(onComplete) {
		document.body.style.mixBlendMode = 'screen';
		document.body.style.transformOrigin = 'left top';
		this.calcScreen();
		gsap.from(document.body, {
			opacity: 0,
			duration: 3,
			ease: 'power2.out',
			delay: 1,
			onComplete
		});
		this.calcScreen = this.calcScreen.bind(this);
		viewport.target.addEventListener('update', this.calcScreen, false);
	},
	turnOff(onComplete) {
		this.calcScreen(true);
		viewport.target.addEventListener(
			'update',
			() => ComputerEffect.calcScreen(true),
			false
		);
		const SQUARE_SIZE = 40,
			screenFillScale = fillRectScale(this.screenBoundsPx, viewport.size),
			clipper = new GridClipPath(
				document.body,
				Math.round(viewport.size.w / SQUARE_SIZE),
				Math.round(viewport.size.h / SQUARE_SIZE)
			);
		gsap
			.timeline({ defaults: { duration: 1, ease: 'power4.out' } })
			.set(document.documentElement, {
				clearProps: 'backgroundImage',
				backgroundPosition: `
                -${
									(this.screenBoundsPx.x -
										(viewport.size.w * this.bodyScale - this.screenBoundsPx.w) /
											2) *
									screenFillScale
								}px 
                -${
									(this.screenBoundsPx.y -
										(viewport.size.h * this.bodyScale - this.screenBoundsPx.h) /
											2) *
									screenFillScale
								}px`,
				backgroundSize: this.bgImgSize.w * screenFillScale
			})
			.to(clipper, { progress: 1, ease: 'power3.in' })
			.to(document.documentElement, {
				backgroundPosition: `${(viewport.size.w - this.bgImgSize.w) / 2}px ${
					(viewport.size.h - this.bgImgSize.h) / 2
				}px`,
				backgroundSize: `${this.bgImgSize.w}px`,
				clearProps: 'all'
			})
			.call(onComplete, null, '>1');
	},
	zoomInScreen() {
		const SQUARE_SIZE = 40,
			screenFillScale = fillRectScale(this.screenBoundsPx, viewport.size),
			clipper = new GridClipPath(
				document.body,
				Math.round(viewport.size.w / SQUARE_SIZE),
				Math.round(viewport.size.h / SQUARE_SIZE)
			);
		viewport.target.removeEventListener('update', this.calcScreen);
		gsap
			.timeline({ defaults: { duration: 1, ease: 'power4.out' } })
			.to(clipper, { progress: 1, ease: 'power3.in' })
			.to(clipper, { progress: 0, ease: 'power3.out' })
			.to(document.body, { mixBlendMode: 'normal', clearProps: 'all' }, '<')
			.to(document.body, { x: 0, y: 0, scale: 1, duration: 2 }, '0')
			.fromTo(
				document.documentElement,
				{
					backgroundPosition: `${(viewport.size.w - this.bgImgSize.w) / 2}px ${
						(viewport.size.h - this.bgImgSize.h) / 2
					}px`,
					backgroundSize: `${this.bgImgSize.w}px`
				},
				{
					backgroundPosition: `
                    -${
											(this.screenBoundsPx.x -
												(viewport.size.w * this.bodyScale -
													this.screenBoundsPx.w) /
													2) *
											screenFillScale
										}px 
                    -${
											(this.screenBoundsPx.y -
												(viewport.size.h * this.bodyScale -
													this.screenBoundsPx.h) /
													2) *
											screenFillScale
										}px`,
					backgroundSize: this.bgImgSize.w * screenFillScale,
					duration: 2
				},
				'<'
			)
			.set(document.documentElement, { backgroundImage: 'none' });
	}
};

const Preloader = {
	domElement: document.getElementById('preloader'),
	loadEvents: [],
	init() {
		ComputerEffect.turnOn(() => {
			//This ensures that the logo animates AFTER the screen fades in
			if (this.logo) return this.logo.classList.add('play');
			this.animateLogo = true;
		});
		new LoadEvent({
			target: window,
			addCallback: () => {
				this.logo = this.domElement.firstElementChild;
				if (this.animateLogo) this.logo.classList.add('play');
				new LoadEvent({ target: this.logo, type: 'transitionend' });
			}
		});
	},
	attemptComplete() {
		const complete = this.loadEvents.every(loadEvent => loadEvent.completed);
		if (!complete) return;

		gsap
			.timeline({ defaults: { duration: 1.5, ease: 'power2.out' } })
			.call(ComputerEffect.zoomInScreen.bind(ComputerEffect))
			.set(this.domElement, { display: 'none' }, '>1')
			.from(
				Background.triangles.map(triangle => triangle.rotation),
				{ x: Math.PI / -2, z: Math.PI, stagger: 0.25 }
			)
			.from(
				Background.triangles.map(triangle => triangle.position),
				{ z: '+=1500', stagger: 0.3 },
				'<'
			)
			.from(Background.activeSymbol.position, { z: '+=1500' }, '<.6')
			.from(Background.activeSymbol.rotation, { y: -3 * Math.PI }, '<')
			.from(
				Desktop.apps,
				{
					yPercent: 50,
					opacity: 0,
					stagger: 0.15,
					duration: 0.5,
					ease: 'steps(10)'
				},
				'>'
			)
			.from(
				'nav',
				{ opacity: 0, yPercent: -100, duration: 0.25, ease: 'steps(5)' },
				'<'
			)
			.call(Desktop.Window.releaseWindows.bind(Desktop.Window), null, '<');
	}
};
Preloader.init();
