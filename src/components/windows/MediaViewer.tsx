import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { WindowDataContext } from '../Window';
import {
	motion,
	useAnimate,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from 'framer-motion';
import { MobileContext } from '../OS';
import { ease5Steps } from '../../utils';
import { useBoundStore } from '../../store';
import ScrollMarquee from '../ScrollMarquee';
import GlitchText from '../GlitchText';
import Tag from '../Tag';
import Marquee from '../Marquee';
import mapImg from '../../images/map_watermark.png';
import handsGif from '../../images/hands.gif';
import throbber from '../../images/throbber.gif';
import Showcase from '../Showcase';
import MainShowcase from '../MainShowcase';
import Follow from '../Follow';
import throbberGif from '../../images/throbber.gif';

export const MediaViewer = () => {
	const isMobile = useContext(MobileContext);
	const { setTitle, sysObj, id } = useContext(WindowDataContext) ?? {};
	if (
		!sysObj ||
		!('ext' in sysObj) ||
		!sysObj.value ||
		typeof sysObj.value === 'string'
	)
		return null;
	useEffect(() => {
		if (!setTitle || !sysObj) return;
		setTitle(`${sysObj.name}.${sysObj.ext} - Media Viewer`);
	}, [setTitle, sysObj]);

	const projectData = sysObj.value;
	const title = sysObj.name.replaceAll('_', ' ');

	// Scroll-based animation
	const [scrollContainer, animate] = useAnimate<HTMLDivElement>();
	const scrollTarget = useRef(null);
	const { scrollYProgress, scrollY } = useScroll({
		target: scrollTarget,
		container: scrollContainer,
	});
	const [inTop, setInTop] = useState(true);
	useMotionValueEvent(scrollYProgress, 'change', latest => {
		if (!scrollContainer.current) return;
		if (!inTop && latest < 0.25) setInTop(true);
		else if (inTop && latest > 0.45) setInTop(false);
	});
	const scrollToTitle = useRef<HTMLHeadingElement>(null);
	const onViewportEnter = (e: IntersectionObserverEntry | null) => {
		if (!e) return;
		(e.target as HTMLDivElement).style.clipPath = 'inset(0 0 0% 0)';
	};

	const scrollTarget2 = useRef(null);
	const { scrollYProgress: scrollYProgress2 } = useScroll({
		target: scrollTarget2,
		container: scrollContainer,
	});
	const clipPath = useTransform(
		scrollYProgress2,
		[0, 1],
		isMobile
			? ['inset(5rem 5rem)', 'inset(0rem 0rem)']
			: ['inset(5rem 12rem)', 'inset(0rem 0rem)']
	);

	// Seperates showcases into the two sections (or less depending on quantity)
	const intialShowcases =
		projectData.showcases.length < 3
			? []
			: projectData.showcases.slice(1, 3);
	const restShowcases = projectData.showcases.slice(
		projectData.showcases.length < 3 ? 1 : 3
	);

	//Next project
	const [traverse, replaceWindow] = useBoundStore(state => [
		state.traverse,
		state.replaceWindow,
	]);
	const nextProject = useMemo(() => {
		const parentFolders = traverse(sysObj);
		if (!parentFolders || parentFolders.length == 0) return;
		const projects = parentFolders[parentFolders.length - 1].children;
		let i = projects.findIndex(obj => obj.name === sysObj.name);
		i += 1;
		if (i == projects.length) i = 0;
		return projects[i];
	}, [sysObj]);
	if (
		!nextProject ||
		!('ext' in nextProject) ||
		!nextProject.value ||
		typeof nextProject.value === 'string' ||
		!id
	)
		return;
	const loadingRef = useRef<HTMLImageElement>(null);
	const gotoNext = () => {
		if (!loadingRef.current || !scrollContainer.current) return;
		animate(
			loadingRef.current,
			{ opacity: [0, 1, 1, 0] },
			{
				type: 'tween',
				duration: 3,
				times: [0, 0.2, 0.8, 1],
				ease: ease5Steps,
			}
		);
		setInTop(true);
		setTimeout(() => {
			replaceWindow(id, nextProject);
			scrollContainer.current?.scrollTo(0, 0);
		}, 2000);
	};
	useEffect(
		() => scrollYProgress2.on('change', val => val > 0.999 && gotoNext()),
		[sysObj]
	);

	return (
		<>
			<div
				ref={loadingRef}
				className="pointer-events-none absolute z-10 h-full w-full bg-black-primary opacity-0"
			>
				<img
					src={throbber}
					alt="Throbber"
					className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
				/>
			</div>
			<div
				ref={scrollContainer}
				className="relative flex-1 overflow-y-auto overflow-x-hidden"
			>
				<div
					className="mx-4 md:mt-12 h-[150%] min-h-[1250px] text-white-primary"
					ref={scrollTarget}
				>
					<MainShowcase
						file={sysObj}
						scrollContainer={scrollContainer}
						inTop={inTop}
						skipSection={() => {
							if (isMobile) {
								scrollToTitle.current?.scrollIntoView({
									block: 'end',
									behavior: 'smooth',
								});
								return;
							}
							scrollContainer.current?.scrollTo({
								top: 450,
								behavior: 'smooth',
							});
						}}
					/>
				</div>
				<h3
					ref={scrollToTitle}
					className="text-center p-4 pb-1 xs:pb-0 mb-10 dlig ss02 font-display text-6xl xs:text-7xl uppercase leading-[0.95] bg-white-primary text-white-primary md:hidden"
				>
					<GlitchText
						onScroll
						scrollRoot={scrollContainer}
						decayRate={0.5}
						className="absolute text-black-primary w-full left-0 px-4 pb-1 xs:pb-0"
					>
						{title}
					</GlitchText>
					{title}
				</h3>
				<div className="mx-4 mb-4 flex gap-4">
					<ScrollMarquee
						vertical
						scroll={scrollY}
						panSpeed={2}
						flexMode
						scrollStrength={0.0025}
						innerClass="w-full content-center mb-8 font-bold uppercase tracking-[1em]"
						className="!h-auto bg-white-primary text-black-primary relative w-10 shrink-0 border-2 border-white-primary"
					>
						{title} ♦️♣♠♥
					</ScrollMarquee>
					<div className="relative overflow-hidden flex-grow flex flex-wrap gap-4 border-2 border-white-primary bg-black-primary p-24 md:p-32 md:px-6 px-6 text-white-primary">
						<GlitchText
							onScroll
							scrollRoot={scrollContainer}
							decayRate={0.5}
							className="ss02 dlig pointer-events-none absolute -bottom-9 -right-12 select-none font-display md:text-[12.5rem] text-[8rem] uppercase text-purple-watermark"
						>
							ABOUT
						</GlitchText>
						<p className="relative mb-2 w-full">
							{projectData.description}
						</p>
						{projectData.tags.map(tag => (
							<Tag bg="random" key={tag} className="relative">
								{tag}
							</Tag>
						))}
					</div>
				</div>
				{intialShowcases.length && (
					<div className="mx-4 mb-4 grid overflow-hidden h-[150%] md:h-full grid-cols-1 grid-rows-[1fr_150px_auto_2fr] md:grid-cols-2 md:grid-rows-[50%_1fr_auto] gap-4">
						<div className="min-h-0 relative border-2 border-white-primary bg-black-primary">
							<img
								src={throbberGif}
								alt="Throbber"
								className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
							/>
							<motion.div
								onViewportEnter={onViewportEnter}
								viewport={{
									root: scrollContainer,
								}}
								style={{ clipPath: 'inset(0 0 100% 0)' }}
								className="h-full relative cursor-none transition-all duration-1000 ease-steps10"
							>
								<Showcase src={intialShowcases[1]} />
								{!isMobile && <Follow />}
							</motion.div>
						</div>
						<div className="relative overflow-hidden border-2 border-white-primary bg-black-primary">
							<img
								src={mapImg}
								alt="map watermark"
								className="absolute h-full w-full object-contain"
							/>
							<img
								src={handsGif}
								alt="spinning shape"
								className="absolute h-full w-full scale-75 object-contain"
							/>
						</div>
						<Marquee
							className="relative shrink-0 border-x-2 border-white-primary bg-white-primary text-4xl font-bold text-black-primary"
							panTime={1000}
							steps={10000}
							pauseOnHover={false}
						>
							▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
						</Marquee>
						<div className="min-h-0 relative border-2 border-white-primary bg-black-primary md:col-start-2 md:row-span-3 md:row-start-1">
							<img
								src={throbberGif}
								alt="Throbber"
								className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
							/>
							<motion.div
								onViewportEnter={onViewportEnter}
								viewport={{
									root: scrollContainer,
								}}
								style={{ clipPath: 'inset(0 0 100% 0)' }}
								className="h-full relative cursor-none transition-all duration-1000 ease-steps10"
							>
								<Showcase src={intialShowcases[0]} />
								{!isMobile && <Follow />}
							</motion.div>
						</div>
					</div>
				)}
				{restShowcases.map((showcase, i) => (
					<div
						key={i}
						className="relative m-4 mt-0 border-2 border-white-primary bg-black-primary"
					>
						<img
							src={throbberGif}
							alt="Throbber"
							className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
						/>
						<motion.div
							onViewportEnter={onViewportEnter}
							viewport={{
								root: scrollContainer,
							}}
							style={{ clipPath: 'inset(0 0 100% 0)' }}
							className="relative w-full h-full cursor-none transition-all duration-1000 ease-steps10"
						>
							<Showcase src={showcase} autoHeight />
							{!isMobile && <Follow />}
						</motion.div>
					</div>
				))}
				<div className="mt-12 h-[300%]" ref={scrollTarget2}>
					<div
						className="sticky top-0 h-1/3 cursor-pointer bg-black-primary text-white-primary outline outline-2 outline-white-primary"
						onClick={gotoNext}
					>
						<motion.div
							className="h-full w-full"
							style={{ clipPath }}
						>
							<Showcase src={nextProject.value.showcases[0]} />
						</motion.div>
						<div className="absolute top-0 flex h-full w-full flex-col justify-center gap-4 bg-black-primary/45 px-8 pb-12">
							<GlitchText
								onScroll
								scrollRoot={scrollContainer}
								decayRate={0.5}
								className="xs:mb-12 text-lg font-bold"
							>
								next →
							</GlitchText>
							<h3 className="dlig ss02 whitespace-pre font-display text-5xl xs:text-7xl uppercase leading-[0.95]">
								{nextProject.name
									.split('_')
									.map((str, i) =>
										(i + 1) % 2 == 0 ? `\n• ${str}` : str
									)}
							</h3>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MediaViewer;
