'use strict';
gsap.registerPlugin(ScrollTrigger);

const Desktop = {
	registerAppElement(app) {
		app.name = app.lastElementChild.textContent;
		app.contentTemplate = app.nextElementSibling;
		app.defaults = interpretBounds(app.contentTemplate.dataset.windowDefaults);
		app.idVal = app.contentTemplate.dataset.windowId;
		app.symbol = app.contentTemplate.dataset.windowSymbol;
		app.content = app.contentTemplate.content;

		if ('windowOnLoad' in app.contentTemplate.dataset)
			new Desktop.Window(
				app,
				app.contentTemplate.dataset.windowBounds
					? interpretBounds(app.contentTemplate.dataset.windowBounds)
					: defaults,
				false
			);

		app.addEventListener(
			'dblclick',
			() => {
				if (Desktop.Window.findWindowIndex(app.name) != -1) return;
				new Desktop.Window(app);
			},
			false
		);

		app.addEventListener(
			'click',
			() => {
				const index = Desktop.Window.findWindowIndex(app.name);
				if (index == -1) return;
				Desktop.Window.windows[index].unminimize();
			},
			false
		);
	},
	shutdown() {
		ComputerEffect.turnOff(() => (location.href = location.origin));
	},
	navFunctionality() {
		document
			.getElementById('shutdown')
			.addEventListener('click', Desktop.shutdown, false);
		document
			.getElementById('restart')
			.addEventListener('click', Desktop.shutdown, false);

		const vfx = document.getElementById('vfx');
		let hideVfx = localStorage.getItem('hideVfx');
		hideVfx && vfx.classList.add('hide');
		document.getElementById('vfx-btn').addEventListener(
			'click',
			() => {
				hideVfx = !hideVfx;
				vfx.classList.toggle('hide');
				localStorage.setItem('hideVfx', hideVfx);
			},
			false
		);

		const audio = document.getElementsByTagName('audio')[0];
		let playAudio = false;
		document
			.getElementById('audio-btn')
			.addEventListener(
				'click',
				() => ((playAudio = !playAudio) ? audio.play() : audio.pause()),
				false
			);

		const clock = document.getElementById('clock');
		function updateClock() {
			let date = new Date(),
				hrs = date.getHours(),
				mins = date.getMinutes(),
				secs = date.getSeconds(),
				period = 'AM';

			if (hrs == 0) hrs = 12;
			else if (hrs >= 12) {
				if (hrs > 12) hrs -= 12;
				period = 'PM';
			}

			hrs = hrs < 10 ? `0${hrs}` : hrs;
			mins = mins < 10 ? `0${mins}` : mins;
			secs = secs < 10 ? `0${secs}` : secs;

			clock.textContent = `${hrs}:${mins}:${secs} ${period}`;
			setTimeout(updateClock, 1000);
		}
		updateClock();
	},
	init() {
		Desktop.apps = gsap.utils.toArray('.app');
		Desktop.app = Desktop.apps[0];
		Desktop.apps.forEach(Desktop.registerAppElement);

		if (customWindows.length > 0) {
			const customAppTemplate = Desktop.app.parentElement.cloneNode(true);
			customAppTemplate.firstElementChild.firstElementChild.src = `${staticPath}/images/txt.png`;
			customAppTemplate.firstElementChild.firstElementChild.alt =
				'txt file icon';
			delete customAppTemplate.lastElementChild.dataset.windowSymbol;
			customAppTemplate.lastElementChild.dataset.windowId = 'u';

			const fragment = document.createDocumentFragment();
			customWindows.forEach(customWindow => {
				const customApp = customAppTemplate.cloneNode(true);
				customApp.firstElementChild.lastElementChild.textContent = `${customWindow.name}.txt`;
				customApp.lastElementChild.dataset.windowDefaults = customWindow.bounds;
				customApp.lastElementChild.dataset.windowOnLoad = true;
				customApp.lastElementChild.content.textContent = customWindow.content;
				Desktop.apps.push(customApp.firstElementChild);
				Desktop.registerApp(customApp.firstElementChild);
				fragment.appendChild(customApp);
			});
			Desktop.apps[0].parentNode.parentNode.appendChild(fragment);
		}

		window.addEventListener(
			'popstate',
			e => Desktop.Window.readHistory(e.state),
			false
		);
		this.navFunctionality();
	}
};

Desktop.Window = class {
	static windowTemplate = document.getElementById('window-template').content;
	static windowArea = document.getElementById('window-area');
	static windows = [];
	static focused;
	static focusedZ = 1;
	static holdWindows = true;

	//These only exist to make access of the values easier than checking the styles - do not modify these values directly
	//All values stored in pixels
	_storedPos = new Vec2();
	_storedSize = new Vec2();

	constructor(app, bounds = null, addHistory = true) {
		this.app = app;
		this.name = app.name;
		this.id = app.idVal; /*Only used by the api*/

		//A dom fragment that contains the window
		this.windowFragment = Desktop.Window.windowTemplate.cloneNode(true);

		this.windowDomElement = this.windowFragment.firstElementChild;
		this.windowDomElement.addEventListener(
			'pointerdown',
			this.focus.bind(this),
			false
		);

		this.xSetter = gsap.quickSetter(this.windowDomElement, 'x', 'px');
		this.ySetter = gsap.quickSetter(this.windowDomElement, 'y', 'px');
		this.wSetter = gsap.quickSetter(this.windowDomElement, 'width', 'px');
		this.hSetter = gsap.quickSetter(this.windowDomElement, 'height', 'px');
		this.bounds = bounds || app.defaults;
		if (!Desktop.Window.holdWindows) {
			this.x = this.bounds[0] * Desktop.Window.windowAreaRect.width;
			this.y = this.bounds[1] * Desktop.Window.windowAreaRect.height;
			this.w = this.bounds[2] * Desktop.Window.windowAreaRect.width;
			this.h = this.bounds[3] * Desktop.Window.windowAreaRect.height;
		}
		if (app.symbol) this.symbol = parseInt(app.symbol);

		//Window drag functionality
		this.header = this.windowDomElement.firstElementChild;
		dragEvents(
			this.header,
			e => {
				if (this.maximized) {
					this.toggleMaximize();

					this.x =
						e.pos.x -
						Desktop.Window.windowAreaRect.left -
						gsap.utils.mapRange(
							Desktop.Window.windowAreaRect.left,
							Desktop.Window.windowAreaRect.right,
							0,
							this.width,
							e.pos.x
						);
					this.y =
						e.pos.y -
						Desktop.Window.windowAreaRect.top -
						gsap.utils.mapRange(
							Desktop.Window.windowAreaRect.left,
							Desktop.Window.windowAreaRect.right,
							0,
							this.height,
							e.pos.y
						);
				}
				e.startX = this.x;
				e.startY = this.y;
				this.windowDomElement.classList.add('ghost');
			},
			e => {
				this.x = e.startX + e.delta.x;
				this.y = e.startY + e.delta.y;
			},
			() => {
				this.windowDomElement.classList.remove('ghost');
				Desktop.Window.updateHistory();
			},
			Desktop.Window.windowArea
		);

		//Button functionality
		this.header.children[0].addEventListener(
			'click',
			this.close.bind(this),
			false
		);
		this.header.children[1].textContent = this.name;
		this.header.children[2].addEventListener(
			'click',
			this.minimize.bind(this),
			false
		);
		this.maximizeButton = this.header.children[3]; //Maximize button icon changes with the toggle of maximize
		this.maximizeButton.addEventListener(
			'click',
			this.toggleMaximize.bind(this),
			false
		);

		//Body
		this.body = this.windowDomElement.children[1];
		this.body.appendChild(app.content.cloneNode(true));

		//Window resize
		this.resizers = this.windowDomElement.lastElementChild;
		dragEvents(
			this.resizers,
			e => {
				e.startW = this.w;
				e.startH = this.h;
				e.startX = this.x;
				e.startY = this.y;
				switch (e.target.className) {
					case 'n':
						e.resize = e => {
							this.h = e.startH - e.delta.h;
							this.y = e.startY + e.delta.y;
						};
						break;
					case 'ne':
						e.resize = e => {
							this.w = e.startW + e.delta.w;
							this.h = e.startH - e.delta.h;
							this.y = e.startY + e.delta.y;
						};
						break;
					case 'e':
						e.resize = e => (this.w = e.startW + e.delta.w);
						break;
					case 'se':
						e.resize = e => {
							this.w = e.startW + e.delta.w;
							this.h = e.startH + e.delta.h;
						};
						break;
					case 's':
						e.resize = e => (this.h = e.startH + e.delta.h);
						break;
					case 'sw':
						e.resize = e => {
							this.w = e.startW - e.delta.w;
							this.h = e.startH + e.delta.h;
							this.x = e.startX + e.delta.x;
						};
						break;
					case 'w':
						e.resize = e => {
							this.w = e.startW - e.delta.w;
							this.x = e.startX + e.delta.x;
						};
						break;
					case 'nw':
						e.resize = e => {
							this.w = e.startW - e.delta.w;
							this.h = e.startH - e.delta.h;
							this.x = e.startX + e.delta.x;
							this.y = e.startY + e.delta.y;
						};
						break;
				}
				this.windowDomElement.classList.add('ghost');
			},
			e => e.resize(e),
			() => {
				this.windowDomElement.classList.remove('ghost');
				Desktop.Window.updateHistory();
			},
			Desktop.Window.windowArea
		);

		//Add to DOM tree
		Desktop.Window.windows.push(this);
		this.focus(false);
		if (!Desktop.Window.holdWindows) {
			Desktop.Window.addFunctionality(
				this
			); /* Adds any needed code to the body */
			Desktop.Window.windowArea.appendChild(this.windowFragment);
		}
		if (addHistory) Desktop.Window.updateHistory(true);

		//Animations
		//used by create and unminimize
		this.windowDomElement.style.transformOrigin = originFromSecondaryElement(
			this.windowDomElement,
			this.app
		);
		this.introAnim = gsap
			.timeline({
				paused: Desktop.Window.holdWindows,
				defaults: { ease: 'steps(10)' }
			})
			.call(
				() =>
					(this.windowDomElement.style.transformOrigin =
						originFromSecondaryElement(this.windowDomElement, this.app))
			)
			.from(this.windowDomElement, { scale: 0, duration: 0.4 })
			.call(() => {
				this.windowDomElement.classList.remove('ghost');
				if (this.onUsuable) {
					this.onUsuable();
					this.onUsuable = undefined;
				}
			})
			.from(this.windowDomElement, {
				clipPath: 'inset(0 calc(0% - var(--shadow-offset)) 100% 0)',
				clearProps: 'clipPath',
				duration: 0.2
			});

		//used by close and minimize
		this.exitAnim = gsap.to(this.windowDomElement, {
			onStart: () => {
				this.windowDomElement.classList.add('ghost');
				Background.setSymbol();
				this.windowDomElement.style.transformOrigin =
					originFromSecondaryElement(this.windowDomElement, this.app);
			},
			paused: true,
			scale: 0,
			ease: 'steps(10)',
			duration: 0.4
		});

		this.toggleMaximizeAnim = gsap.from(this.windowDomElement, {
			paused: true,
			clipPath: 'inset(0 calc(0% - var(--shadow-offset)) 100% 0)',
			ease: 'steps(10)',
			duration: 0.2
		});
	}

	get x() {
		return this._storedPos.x;
	}
	set x(x) {
		this.xSetter((this._storedPos.x = x));
	}

	get y() {
		return this._storedPos.y;
	}
	set y(y) {
		this.ySetter((this._storedPos.y = y));
	}

	get width() {
		return this._storedSize.w;
	}
	get w() {
		return this.width;
	}
	set width(w) {
		this.wSetter((this._storedSize.w = w));
	}
	set w(w) {
		this.width = w;
	}

	get height() {
		return this._storedSize.h;
	}
	get h() {
		return this.height;
	}
	set height(h) {
		this.hSetter((this._storedSize.h = h));
	}
	set h(h) {
		this.height = h;
	}

	close() {
		Desktop.Window.windows.splice(Desktop.Window.findWindowIndex(this.name), 1);
		Desktop.Window.updateHistory(true);
		this.exitAnim.eventCallback('onComplete', () =>
			this.windowDomElement.remove()
		);
		this.exitAnim.restart();
	}

	minimize() {
		if (this.minimized) return;
		this.minimized = true;
		this.exitAnim.restart();
	}

	unminimize() {
		if (!this.minimized) return;
		this.minimized = false;
		this.focus();
		this.introAnim.restart();
	}

	toggleMaximize() {
		this.maximized = !this.maximized;
		this.toggleMaximizeAnim.restart();
		this.windowDomElement.classList.toggle('maximize');

		if (this.maximized)
			return gsap.set(this.windowDomElement, {
				x: 0,
				y: 0,
				width: '100%',
				height: '100%'
			});

		this.xSetter(this._storedPos.x);
		this.ySetter(this._storedPos.y);
		this.wSetter(this._storedSize.w);
		this.hSetter(this._storedSize.h);
	}

	focus(reorder = true) {
		if (this == Desktop.Window.focused) return;
		Desktop.Window.focused = this;
		this.windowDomElement.style.zIndex = Desktop.Window.focusedZ++;
		Background.setSymbol(this.symbol);
		//Windows list in order from the back to topmost
		if (reorder)
			Desktop.Window.windows.push(
				Desktop.Window.windows.splice(
					Desktop.Window.findWindowIndex(this.name),
					1
				)[0]
			);
	}

	static {
		viewport.target.addEventListener(
			'update',
			this.updateSizes.bind(this),
			false
		);
	}

	static updateSizes() {
		this.windowAreaRect = this.windowArea.getBoundingClientRect();
	}

	static findWindowIndex(windowName) {
		return this.windows.findIndex(window => window.name == windowName);
	}

	static addFunctionality(window) {
		window.body.id = window.id;
		switch (window.id) {
			case 'c':
				contact(window);
				break;
			case 'w':
				myWorks(window);
				break;
			case 'r':
				aboutMe(window);
				break;
			case 'p':
				resume(window);
		}
	}

	static releaseWindows() {
		//Optimizes the api added windows by adding them to the dom all at the same time
		//Also shows the animations when expected
		if (!this.holdWindows) return;
		this.holdWindows = false;

		this.updateSizes();
		const fragment = document.createDocumentFragment();
		this.windows.forEach(window => {
			window.x = window.bounds[0] * Desktop.Window.windowAreaRect.width;
			window.y = window.bounds[1] * Desktop.Window.windowAreaRect.height;
			window.w = window.bounds[2] * Desktop.Window.windowAreaRect.width;
			window.h = window.bounds[3] * Desktop.Window.windowAreaRect.height;
			this.addFunctionality(window);
			fragment.appendChild(window.windowFragment);
			window.introAnim.play();
		});
		this.windowArea.appendChild(fragment);
	}

	static updateHistory(push = false) {
		let newPath = '/',
			newState = null;
		if (this.windows.length > 0) {
			newPath = '/windows?';
			newState = { windows: [] };
			this.windows.forEach((window, i) => {
				const windowObj = {
					id: window.id,
					bounds: [
						window.x / this.windowAreaRect.width,
						window.y / this.windowAreaRect.height,
						window.w / this.windowAreaRect.width,
						window.h / this.windowAreaRect.height
					]
				};
				newPath += `${i != 0 ? '&' : ''}${window.id}=${
					windowObj.bounds[0] * 100
				},${windowObj.bounds[1] * 100},${windowObj.bounds[2] * 100},${
					windowObj.bounds[3] * 100
				}${
					window.id == 'u' ? `,${window.name},${window.body.textContent}` : ''
				}`;

				if (window.id != 'u') windowObj.name = window.name;
				newState.windows.push(windowObj);
			});
		}
		push
			? history.pushState(newState, '', newPath)
			: history.replaceState(newState, '', newPath);
	}

	static readHistory(state = undefined) {
		state = state || history.state;
		if (this.windows) {
			this.windows.forEach(window => window.windowDomElement.remove());
			this.windows = [];
		}
		if (!state) return Background.setSymbol();
		Desktop.apps.forEach(app => {
			if (app.id == 'u') {
				const window = state.windows.find(window => window.name == app.name);
				if (window) new Desktop.Window(app, window.bounds, false);
				return;
			}
			const window = state.windows.find(window => window.id == app.id);
			if (window) new Desktop.Window(app, window.bounds, false);
		});
	}
};

function myWorks({ body }) {
	const fileExplorer = body.firstElementChild,
		loadingSection = body.children[1],
		imgViewer = body.lastElementChild,
		imgData = imgViewer.firstElementChild,
		imgLogo = imgData.children[1],
		imgName = imgData.children[2],
		imgAside = imgData.children[3],
		imgThumbnail = imgData.children[4],
		imgDate = imgAside.firstElementChild.lastElementChild,
		imgLoc = imgAside.children[1].lastElementChild.lastElementChild,
		imgDesc = imgAside.children[2].lastElementChild,
		imgTags = imgAside.lastElementChild.lastElementChild,
		relatedViewer = imgViewer.querySelector('#related-viewer'),
		imgCarousel = relatedViewer.firstElementChild,
		imgCarouselCount = relatedViewer.lastElementChild,
		imgCarouselLeft = imgCarousel.firstElementChild,
		imgCarouselOptions = imgCarousel.children[1],
		imgCarouselRight = imgCarousel.lastElementChild,
		back = imgViewer.lastElementChild.lastElementChild,
		dirSpans = gsap.utils.toArray(fileExplorer.querySelectorAll('span')),
		dirButtons = fileExplorer.querySelectorAll('.dir-nav-arrows button'),
		history = {
			states: [],
			currentState: -1,
			pushState(dir, dirPath) {
				const mostRecentState = this.states.length - 1;
				this.currentState == -1 || this.currentState == mostRecentState
					? this.states.push({ dir, dirPath })
					: this.states.splice(this.currentState + 1, mostRecentState, {
							dir,
							dirPath
					  });
				this.currentState = this.states.length - 1;
				this.updateButtons();
			},
			moveForward() {
				this.currentState += 1;
				const currentState = this.states[this.currentState];
				setActiveDir(currentState.dir, currentState.dirPath, false);
				this.updateButtons();
			},
			moveBackward() {
				this.currentState -= 1;
				const currentState = this.states[this.currentState];
				setActiveDir(currentState.dir, currentState.dirPath, false);
				this.updateButtons();
			},
			updateButtons() {
				dirButtons[0].disabled = this.currentState <= 0;
				dirButtons[1].disabled = this.currentState == this.states.length - 1;
			}
		};
	let activeDir, activePath, activeDirSpan;

	function setActiveDir(dir, dirPath, updateHistory = true) {
		if (activeDir == dir) return;
		activeDir.classList.remove('active');
		activeDir = dir;
		activeDir.classList.add('active');
		activePath = dirPath;
		updateDirSpans();
		if (updateHistory) history.pushState(dir, dirPath);
	}

	function updateDirSpans() {
		activeDirSpan.classList.remove('active');
		activeDirSpan = null;
		dirSpans.forEach((span, i) => {
			if (activeDirSpan) return;
			span.textContent = activePath[i].name;
			if (!activePath[i + 1]) return (activeDirSpan = span);
		});
		activeDirSpan.classList.add('active');
	}

	function getPathFromDir(dir) {
		let path = [];
		for (
			let currentDir = dir;
			currentDir.dataset.dirName;
			currentDir = currentDir.parentElement.parentElement
		)
			path.unshift({ name: currentDir.dataset.dirName, dir: currentDir });
		return path;
	}

	dirButtons[0].addEventListener(
		'click',
		history.moveBackward.bind(history),
		false
	);
	dirButtons[1].addEventListener(
		'click',
		history.moveForward.bind(history),
		false
	);

	const relatedCarousel = new Carousel(imgCarouselOptions, {
		leftBtn: imgCarouselLeft,
		rightBtn: imgCarouselRight,
		countDisplay: imgCarouselCount,
		autoPlay: 10
	});
	function startImgViewer() {
		fileExplorer.classList.remove('active');
		loadingSection.classList.add('active');
	}
	function stopImgViewer() {
		fileExplorer.classList.add('active');
		imgViewer.classList.remove('active');
	}
	back.addEventListener('click', stopImgViewer, false);
	function setImgViewer(
		appName,
		projectName,
		{ date, loc, desc, tags, mockups }
	) {
		let imgsLoaded = 0,
			minTimePassed = false;
		function showImgViewer() {
			loadingSection.classList.remove('active');
			imgViewer.classList.add('active');
			imgViewer.scrollTop = 0;
		}
		setTimeout(() => {
			minTimePassed = true;
			if (imgsLoaded === mockups) showImgViewer();
		}, 1000);
		const addLoaded = () => {
			if (++imgsLoaded !== mockups) return;
			if (minTimePassed) showImgViewer();
		};

		oneUseEventListener(imgLogo, 'load', addLoaded, false);
		imgLogo.src = `${staticPath}/images/${projectName}/logo.png`;
		imgName.textContent = appName;
		imgDate.textContent = date;
		imgLoc.textContent = loc;
		imgDesc.textContent = desc;
		imgTags.textContent = tags;
		imgThumbnail.src = `${staticPath}/images/${projectName}/mockup_1.jpg`;

		for (let i = 2; i <= mockups; i++) {
			const option = imgCarouselOptions.children[i - 2];
			oneUseEventListener(option.firstElementChild, 'load', addLoaded, false);
			option.firstElementChild.src = `${staticPath}/images/${projectName}/mockup_${i}.jpg`;
		}
		relatedCarousel.length = mockups - 1;
	}

	const projectCache = new Map();

	gsap.utils.toArray(body.querySelectorAll('.app')).forEach(app => {
		const appDir = app.nextElementSibling,
			appDirName = appDir ? appDir.dataset.dirName : undefined;

		//Directory apps change to the current directory to show more apps
		if (appDirName) {
			const appDirPath = getPathFromDir(appDir);
			if (appDir.classList.contains('active')) {
				activeDir = appDir;
				activePath = appDirPath;
				activeDirSpan = dirSpans[activePath.length - 1];
				history.pushState(activeDir, activePath);
			}

			return app.addEventListener(
				'dblclick',
				() => setActiveDir(appDir, appDirPath),
				false
			);
		}

		//Desktop apps open windows
		const appName = app.lastElementChild.textContent,
			desktopApp = Desktop.apps.find(
				desktopApp => desktopApp.lastElementChild.textContent == appName
			);
		if (desktopApp)
			return app.addEventListener(
				'dblclick',
				() => {
					if (Desktop.Window.findWindowIndex(appName) != -1) return;
					new Desktop.Window(desktopApp);
				},
				false
			);

		//Everything else is a project (image) which shows a project of mine in the image viewer window
		const appProject = app.dataset.appProject;
		app.addEventListener(
			'dblclick',
			() => {
				startImgViewer();
				const cachedProject = projectCache.get(appProject);
				if (cachedProject)
					return setImgViewer(appName, appProject, cachedProject);
				loadJson(`${staticPath}/jsons/${appProject}.json`, projectJson => {
					projectCache.set(appProject, projectJson);
					setImgViewer(appName, appProject, projectJson);
				});
			},
			false
		);
	});

	dirSpans.forEach((span, i) =>
		span.addEventListener(
			'click',
			() => setActiveDir(activePath[i].dir, activePath.slice(0, i + 1)),
			false
		)
	);
}

function contact({ body }) {
	const link = body.querySelector('#mail-area a'),
		letters = splitText(link.firstElementChild),
		plane = body.querySelector('#plane');

	gsap.set(plane, { autoAlpha: 0 });
	link.addEventListener(
		'pointerenter',
		e => {
			gsap
				.timeline()
				.fromTo(
					letters,
					{ rotateY: 0 },
					{ rotateY: 360, duration: 1, stagger: 0.05, ease: 'steps(5)' }
				)
				.fromTo(
					plane,
					{
						xPercent: -50,
						yPercent: -50,
						x: e.offsetX,
						y: e.offsetY,
						rotate: 0,
						autoAlpha: 1
					},
					{
						rotate: '+=random(-60, 60)',
						x: '+=300',
						y: '-=300',
						autoAlpha: 0,
						duration: 2,
						ease: 'steps(25)'
					},
					'<'
				);
		},
		false
	);
}

function aboutMe(window) {
	const spaceSection = window.body.querySelector('.bg-outrun'),
		spaceParallax = e => {
			const x = gsap.utils.mapRange(
					window.x,
					window.x + window.w,
					1,
					-1,
					e.clientX
				),
				y = gsap.utils.mapRange(
					window.y,
					window.y + window.h,
					1,
					-1,
					e.clientY
				);
			gsap
				.timeline({ defaults: { duration: 1, ease: 'power2.out' } })
				.to(spaceSection.children[0], { x: x * 2, y: y * 2 })
				.to(spaceSection.children[1], { x: x * 10, y: y * 10 }, '<')
				.to(spaceSection.children[2], { x: x * 30, y: y * 30 }, '<');
		},
		spaceCenter = () =>
			gsap.to(spaceSection.children, {
				x: 0,
				y: 0,
				duration: 1,
				ease: 'power2.out'
			});
	gsap
		.timeline({ defaults: { duration: 2, ease: 'power2.out' }, delay: 0.6 })
		.call(() => spaceSection.children[2].classList.add('play'))
		.fromTo(
			spaceSection.children[0],
			{ xPercent: 100, yPercent: -200, rotation: -90 },
			{ xPercent: -40, yPercent: -50, rotation: 90 }
		)
		.fromTo(
			new GridClipPath(spaceSection.children[1], 14, 19),
			{ progress: 1 },
			{ progress: 0 },
			'<'
		)
		.call(() => {
			spaceSection.addEventListener('pointermove', spaceParallax, false);
			spaceSection.addEventListener('pointerout', spaceCenter, false);
		});

	const imgWindows = window.body.querySelectorAll('.img-container'),
		imgButton = window.body.querySelector('.grad-btn'),
		imgArea = imgWindows[0].parentElement;

	let highestZIndex = 2,
		focusedImg = imgWindows[imgWindows.length - 1];
	imgWindows.forEach(imgWindow => {
		imgWindow.popupAnim = gsap.from(imgWindow, {
			scale: 0,
			autoAlpha: 0,
			paused: true,
			stagger: 0.1,
			duration: 0.4,
			ease: 'steps(5)',
			onStart() {
				imgWindow.dataset.opened = true;
				gsap.set(imgWindow, { pointerEvents: 'all' });
			},
			onReverseComplete() {
				imgWindow.dataset.opened = false;
				gsap.set(imgWindow, { pointerEvents: 'none' });
			}
		});

		gsap.set(imgWindow, { xPercent: -50, yPercent: -50 });
		const xSetter = gsap.quickSetter(imgWindow, 'x', 'px'),
			ySetter = gsap.quickSetter(imgWindow, 'y', 'px');
		let x = 0,
			y = 0;
		dragEvents(
			imgWindow,
			e => {
				e.startX = x;
				e.startY = y;
				imgWindow.classList.add('ghost');
			},
			e => {
				x = e.startX + e.delta.x;
				y = e.startY + e.delta.y;
				xSetter(x);
				ySetter(y);
			},
			() => imgWindow.classList.remove('ghost'),
			imgArea
		);

		imgWindow.addEventListener('pointerdown', () => {
			if (focusedImg == imgWindow) return;
			focusedImg = imgWindow;
			imgWindow.style.zIndex = highestZIndex++;
		});

		imgWindow.firstElementChild.lastElementChild.addEventListener(
			'click',
			() => imgWindow.popupAnim.reverse(),
			false
		);
	});

	imgButton.addEventListener(
		'click',
		() => {
			imgWindows.forEach(imgWindow => {
				if (imgWindow.dataset.opened == 'true') return;
				x = 0;
				y = 0;
				gsap.set(imgWindow, {
					left: 'random(0, 100)%',
					top: 'random(0, 100)%',
					x,
					y
				});
				imgWindow.popupAnim.play();
			});
		},
		false
	);

	const terminal = window.body.querySelector('#terminal');
	let terminalLine = terminal.lastElementChild,
		terminalLineInput = terminalLine.lastElementChild,
		skills,
		categories;

	loadJson(`${staticPath}/jsons/skills.json`, json => {
		skills = json.skills;
		categories = json.categories.sort();
	});

	window.onUsuable = () => {
		gsap.fromTo(
			new GridClipPath(terminal, 10, 10),
			{ progress: 1 },
			{
				progress: 0,
				duration: 1,
				ease: 'none',
				scrollTrigger: {
					scroller: window.body,
					trigger: terminal,
					start: 'center bottom',
					end: 'center top',
					onEnter: () => terminalLineInput.focus({ preventScroll: true }),
					onEnterBack: () => terminalLineInput.focus({ preventScroll: true })
				}
			}
		);

		const meAgain = document.getElementById('me-again');
		gsap.fromTo(
			new GridClipPath(meAgain, 14, 19),
			{ progress: 1 },
			{
				progress: 0,
				ease: 'none',
				duration: 1,
				scrollTrigger: {
					scroller: window.body,
					trigger: meAgain,
					start: 'center bottom'
				}
			},
			'<'
		);

		gsap.utils.toArray(window.body.querySelectorAll('h2')).forEach(h2 => {
			const letters = splitText(h2);
			gsap.fromTo(
				letters,
				{ rotateY: 0 },
				{
					rotateY: 360,
					duration: 0.5,
					stagger: 0.05,
					ease: 'steps(5)',
					scrollTrigger: {
						scroller: window.body,
						trigger: h2,
						start: 'center center'
					}
				}
			);
		});
	};

	function submitLine(e) {
		if (e.key != 'Enter') return;
		const newLine = terminalLine.cloneNode(true);
		terminalLineInput.readOnly = true;
		terminalLineInput.removeEventListener('keydown', submitLine);

		readInput(terminalLineInput.value);

		terminalLine = newLine;
		terminalLineInput = newLine.lastElementChild;
		terminalLineInput.addEventListener('keydown', submitLine, false);
		terminalLineInput.value = '';
		terminal.appendChild(newLine);
		terminalLineInput.focus();
	}

	function readInput(input) {
		const output = document.createElement('output');
		let spansText = [],
			span = document.createElement('span'),
			[command, argument] = input.split(' '),
			combine = false; //Used by compact command

		command = command.toLowerCase();
		argument = argument ? argument.toLowerCase() : '';
		switch (command) {
			case 'help':
				output.textContent = 'All commands available:';
				output.appendChild(span);

				spansText = [
					"'help' - provides a list of commands that can be used in the console",
					"'list <category>' - lists all skills in the specified category (if no category is specified, defaults to 'all')",
					"'compact <category>' - works the same way as list but shows skills on the same line",
					"'categories' - lists all categories",
					"'check <skill>' - returns whether a skill is present or not, and all categories it belongs to"
				];
				break;
			case 'compact':
				combine = true;
			case 'list':
				if (!skills) {
					output.textContent =
						'skills have yet to load; please try again later';
					break;
				}

				let skillsList = skills;
				if (categories.includes(argument))
					skillsList = skillsList.filter(skill =>
						skill.categories.includes(argument)
					);
				else if (argument !== '' && argument !== 'all') {
					output.textContent = `${argument} is not a valid category; use 'categories' to see all available categories`;
					break;
				}

				skillsList = skillsList.map(skill => `[${skill.skill}]`).sort();
				combine
					? (output.textContent = skillsList.join(' '))
					: (spansText = skillsList);
				break;
			case 'categories':
				if (!categories) {
					output.textContent =
						'categories have yet to load; please try again later';
					break;
				}
				spansText = categories.map(
					category =>
						`[${category.charAt(0).toUpperCase()}${category.slice(1)}]`
				);
				break;
			case 'check':
				if (!skills) {
					output.textContent =
						'skills have yet to load; please try again later';
					break;
				}
				if (argument == '') {
					output.textContent = "'check' requires a skill argument";
					break;
				}
				const skill = skills.find(
					skill => skill.skill.toLowerCase() === argument
				);
				output.textContent = skill
					? `found!${
							skill.categories.length
								? ` it includes the categories: ${skill.categories
										.sort()
										.join(', ')}`
								: ''
					  }`
					: `no skill of type ${argument} was found`;
				break;
			case 'easter':
				if (argument === 'egg') {
					alert(
						'Wow you found me! Was it worth it? I doubt it. But here enjoy this egg 🥚'
					);
					break;
				}

			default:
				output.textContent = `'${command}' is not a valid command. Use 'help' for a list of all available commands.`;
		}

		spansText.forEach(spanText => {
			span = span.cloneNode(true);
			span.textContent = spanText;
			output.appendChild(span);
		});

		if (output.children.length >= 1)
			gsap.from(output.children, {
				visibility: 'hidden',
				clearProps: 'all',
				stagger: 0.1,
				duration: 0.1
			});
		terminal.appendChild(output);
	}

	terminal.addEventListener('click', e => terminalLineInput.focus(), false);
	terminalLineInput.addEventListener('keydown', submitLine, false);
}

function resume(window) {
	const resumeButton = window.body.querySelector('a'),
		letters = splitText(resumeButton),
		circle = window.body.querySelector('#circle-2'),
		david = window.body.querySelector('#david');

	window.body.addEventListener(
		'pointermove',
		e => {
			const x = gsap.utils.mapRange(
					window.x,
					window.x + window.w,
					1,
					-1,
					e.clientX
				),
				y = gsap.utils.mapRange(
					window.y,
					window.y + window.h,
					1,
					-1,
					e.clientY
				);
			gsap
				.timeline({ defaults: { duration: 1, ease: 'power2.out' } })
				.to(circle, { x: x * 5, y: y * 5 })
				.to(david, { x: x * 10, y: y * 10 }, '<')
				.to(resumeButton, { x: x * 2, y: y * 2 }, '<');
		},
		false
	);
	window.body.addEventListener(
		'pointerout',
		() =>
			gsap.to([resumeButton, circle, david], {
				x: 0,
				y: 0,
				duration: 1,
				ease: 'power2.out'
			}),
		false
	);
	resumeButton.addEventListener(
		'pointerenter',
		() =>
			gsap.fromTo(
				letters,
				{ rotateY: 0 },
				{ rotateY: 360, duration: 1, stagger: 0.05, ease: 'steps(5)' }
			),
		false
	);
}

Desktop.init();
