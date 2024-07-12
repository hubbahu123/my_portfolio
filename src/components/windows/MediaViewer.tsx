import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { WindowDataContext } from '../Window';
import { motion, useAnimate, useScroll, useTransform } from 'framer-motion';
import { GatsbyImage, IGatsbyImageData, getImage } from 'gatsby-plugin-image';
import { Throbber } from '../Throbber';
import { easeSteps } from '../../utils';
import { useBoundStore } from '../../store';
import ScrollMarquee from '../ScrollMarquee';
import GlitchText from '../GlitchText';
import Follow from '../Follow';
import Tag from '../Tag';
import Marquee from '../Marquee';
import infoImg from '../../images/info.png';
import glassImg from '../../images/glass.png';
import mapImg from '../../images/map_watermark.png';
import shapeGif from '../../images/icohedron.gif';
import handsGif from '../../images/hands.gif';
import throbber from '../../images/throbber.gif';
import { MobileContext } from '../OS';

export const MediaViewer = () => {
	const isMobile = useContext(MobileContext);
	const { setTitle, sysObj, setBasicWindow, id } =
		useContext(WindowDataContext) ?? {};
	if (
		!sysObj ||
		!('ext' in sysObj) ||
		!sysObj.value ||
		typeof sysObj.value === 'string'
	)
		return null;
	useEffect(() => {
		if (setTitle && sysObj && setBasicWindow) {
			setTitle(`${sysObj.name}.${sysObj.ext} - Media Viewer`);
			setBasicWindow(true);
		}
	}, [setTitle, sysObj]);

	const projectData = sysObj.value;

	// Animation Stuff
	const [scrollContainer, animate] = useAnimate();
	const scrollTarget = useRef(null);
	const { scrollYProgress, scrollY } = useScroll({
		target: scrollTarget,
		container: scrollContainer,
	});
	let onChange: (latestValue: number) => void;
	useEffect(() => {
		if (!scrollContainer.current) return;
		let topHalf = true;
		const blinkAnim = animate(
			'#main-showcase',
			{
				maskPosition: ['0% 0%', '0% 100%', '0% 0%'],
				webkitMaskPosition: ['0% 0%', '0% 100%', '0% 0%'],
			},
			{
				duration: 0.75,
				type: 'tween',
				autoplay: false,
				ease: easeSteps(25),
			}
		);

		onChange = async function (val: number) {
			if (!scrollContainer.current) return;
			if (!topHalf && val < 0.35) {
				topHalf = true;

				blinkAnim.play();
				animate(
					'#main-showcase',
					{ position: 'absolute', maskSize: '100% 4700%' },
					{ delay: 0.375, type: 'tween' }
				);
			} else if (topHalf && val > 0.45) {
				if (!topHalf) return;
				topHalf = false;

				blinkAnim.play();
				animate(
					'#main-showcase',
					{ position: 'relative', maskSize: '200% 4700%' },
					{ delay: 0.375, type: 'tween' }
				);
			}
		};
		const unsub = scrollYProgress.on('change', onChange);

		return unsub;
	}, [scrollYProgress]);

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

	// Title anim
	const title = sysObj.name.replaceAll('_', ' ');
	const titleAnimated = useMemo<React.JSX.Element[]>(
		() =>
			sysObj.name?.split('_').map((str, i) => (
				<span key={i} className="-mt-4 block overflow-hidden">
					<motion.span
						initial={{ y: '100%' }}
						whileInView={{ y: 0 }}
						transition={{
							delay: (i + 2) * 0.5,
							type: 'tween',
							ease: 'circOut',
							duration: 1,
						}}
						viewport={{
							once: true,
							root: scrollContainer,
						}}
						className="block pt-2"
					>
						{(i + 1) % 2 == 0 ? `• ${str}` : str}
					</motion.span>
				</span>
			)),
		[sysObj.name]
	);

	const intialShowcases =
		projectData.showcases.length < 3
			? []
			: projectData.showcases.slice(1, 3);
	const restShowcases = projectData.showcases.slice(
		projectData.showcases.length < 3 ? 1 : 3
	);

	//Next project
	const [traverse, addWindow, deleteWindow] = useBoundStore(state => [
		state.traverse,
		state.addWindow,
		state.deleteWindow,
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
	const loadingRef = useRef<HTMLDivElement>(null);
	const gotoNext = () => {
		if (!loadingRef.current || !scrollContainer.current) return;
		animate(
			loadingRef.current,
			{ opacity: [0, 1, 1, 0] },
			{ type: 'tween', duration: 4, ease: 'circInOut' }
		);
		setTimeout(() => {
			if (!scrollContainer.current) return;
			deleteWindow(id);
			addWindow(nextProject);
			scrollContainer.current.scrollTo(0, 0);
			if (typeof onChange === 'function') onChange(0);
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
				className="relative h-full overflow-y-auto overflow-x-hidden"
			>
				<div
					className="mx-4 md:mt-12 h-[200%] min-h-[1500px] text-white-primary"
					ref={scrollTarget}
				>
					<div className="sticky top-0 md:top-12 mb-14 flex gap-4">
						<div className="z-10 basis-0 md:flex-1 min-w-0">
							<div
								id="main-showcase"
								className="pixel-mask darken-bottom group absolute h-full w-full cursor-none border-2 border-white-primary"
							>
								<Showcase
									src={projectData.showcases[0]}
									imgClassName="!transition ease-out group-hover:scale-110"
									className="scale-by-height !h-full !w-full"
									project={title}
								/>
							</div>
							<h3 className="md:inline hidden dlig ss02 pointer-events-none absolute -bottom-12 left-7 overflow-visible whitespace-nowrap font-display text-7xl uppercase leading-[0.95] shadow-black-primary/25 [text-shadow:_-5px_5px_5px_var(--tw-shadow-color)]">
								{titleAnimated}
							</h3>
						</div>
						<div className="w-full min-w-0 flex-1">
							<div className="mb-4 w-full border-2 border-white-primary bg-black-primary p-4 py-6">
								<h3 className="mb-2 text-center font-display text-6xl">
									<img
										src={infoImg}
										className="mr-4 inline-block h-12 align-top"
										alt=""
									/>
									Info
								</h3>

								<ul className="mb-8 min-w-0 divide-y-2">
									<li className="flex justify-between gap-2 py-4 flex-col md:flex-row">
										<h4>Categories</h4>
										<div className="md:text-right text-light-primary">
											{projectData.categories.map(cat => (
												<p key={cat}>{cat}</p>
											))}
										</div>
									</li>
									<li className="flex justify-between gap-2 py-4 flex-col md:flex-row">
										<h4>Roles</h4>
										<div className="md:text-right text-light-primary">
											{projectData.roles.map(role => (
												<p key={role}>{role}</p>
											))}
										</div>
									</li>
									<li className="flex justify-between gap-2 py-4 flex-col md:flex-row">
										<h4>Date</h4>
										<div className="md:text-right text-light-primary">
											{projectData.date.toLocaleDateString()}
										</div>
									</li>
									{projectData.org && (
										<li className="flex justify-between gap-2 py-4 flex-col md:flex-row">
											<h4>Organization</h4>
											<div className="md:text-right text-light-primary">
												{projectData.org}
											</div>
										</li>
									)}
									{projectData.loc && (
										<li className="flex justify-between gap-2 py-4 flex-col md:flex-row">
											<h4>Location</h4>
											{projectData.loc.link === '#' ? (
												<span className="flex-1 overflow-hidden text-ellipsis md:text-right text-light-primary">
													{projectData.loc.text}
												</span>
											) : (
												<a
													className="flex-1 cursor-pointer overflow-hidden text-ellipsis md:text-right text-pink-accent underline"
													href={projectData.loc.link}
													target="_blank"
												>
													{projectData.loc.text} &#16;
												</a>
											)}
										</li>
									)}
								</ul>
							</div>
							<div className="w-full border-2 border-white-primary bg-black-primary p-4 py-1">
								<img
									src={shapeGif}
									alt="spinning shape"
									className="h-28 w-full object-contain"
								/>
							</div>
						</div>
					</div>
				</div>
				<h3 className="text-center p-4 pb-1 xs:pb-0 mb-10 dlig ss02 font-display text-6xl xs:text-7xl uppercase leading-[0.95] bg-white-primary text-black-primary md:hidden">
					{title}
				</h3>
				<div className="mx-4 mb-4 flex gap-4">
					<div className="relative w-10 shrink-0 border-2 border-white-primary">
						<ScrollMarquee
							vertical
							scroll={scrollY}
							panSpeed={2}
							scrollStrength={0.0025}
							innerClass="w-full content-center"
							className="!absolute h-full w-full bg-white-primary text-black-primary"
						>
							<p className="mb-8 font-bold uppercase tracking-[1em]">
								{title} ♦️♣♠♥
							</p>
						</ScrollMarquee>
					</div>
					<div className="relative h-auto overflow-hidden border-2 border-white-primary bg-black-primary p-24 md:p-32 md:px-6 px-6 text-white-primary">
						<GlitchText
							onScroll
							scrollRoot={scrollContainer}
							decayRate={0.5}
							className="ss02 dlig pointer-events-none absolute -bottom-9 -right-12 select-none font-display md:text-[12.5rem] text-[8rem] uppercase text-purple-watermark"
						>
							ABOUT
						</GlitchText>
						<p className="relative mb-6">
							{projectData.description}
						</p>
						<div className="flex flex-wrap gap-4">
							{projectData.tags.map(tag => (
								<Tag bg="random" key={tag} className="relative">
									{tag}
								</Tag>
							))}
						</div>
					</div>
				</div>
				{intialShowcases.length && (
					<div className="mx-4 mb-4 grid h-[150%] md:h-full grid-cols-1 grid-rows-[1fr_150px_auto_2fr] md:grid-cols-2 md:grid-rows-[50%_1fr_auto] gap-4">
						<motion.div
							initial={{
								maskPosition: '0% 100%',
								WebkitMaskPosition: '0 100%',
							}}
							whileInView={{
								maskPosition: '0% 0%',
								WebkitMaskPosition: '0% 0%',
							}}
							transition={{
								duration: 0.75,
								type: 'tween',
								ease: easeSteps(25),
							}}
							viewport={{
								root: scrollContainer,
								once: true,
								amount: 0.6,
							}}
							className="pixel-mask group relative cursor-none border-2 border-white-primary"
						>
							<Showcase
								src={intialShowcases[1]}
								imgClassName="!transition ease-out group-hover:scale-110"
								className="scale-by-height !h-full !w-full"
								project={title}
							/>
						</motion.div>
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
						<motion.div
							initial={{
								maskPosition: '0% 100%',
								WebkitMaskPosition: '0 100%',
							}}
							whileInView={{
								maskPosition: '0% 0%',
								WebkitMaskPosition: '0% 0%',
							}}
							transition={{
								duration: 0.75,
								type: 'tween',
								ease: easeSteps(25),
							}}
							viewport={{
								root: scrollContainer,
								once: true,
								amount: 0.27,
							}}
							className="pixel-mask group relative md:col-start-2 md:row-span-3 md:row-start-1 cursor-none border-2 border-white-primary"
						>
							<Showcase
								src={intialShowcases[0]}
								imgClassName="!transition ease-out group-hover:scale-110"
								className="scale-by-height !h-full !w-full"
								project={title}
							/>
						</motion.div>
					</div>
				)}
				<div className="mx-4">
					{restShowcases.map((showcase, i) => (
						<motion.div
							key={i}
							initial={{
								maskPosition: '0% 100%',
								WebkitMaskPosition: '0 100%',
							}}
							whileInView={{
								maskPosition: '0% 0%',
								WebkitMaskPosition: '0% 0%',
							}}
							transition={{
								duration: 0.75,
								type: 'tween',
								ease: easeSteps(25),
							}}
							viewport={{
								root: scrollContainer,
								once: true,
							}}
							className="pixel-mask group relative mb-4 w-full cursor-none border-2 border-white-primary"
						>
							<Showcase
								src={showcase}
								imgClassName="!relative !transition ease-out group-hover:scale-110"
								className="scale-by-height !h-auto !w-full"
								project={title}
							/>
						</motion.div>
					))}
				</div>
				<div className="mt-12 h-[300%]" ref={scrollTarget2}>
					<div
						className="sticky top-0 h-1/3 cursor-pointer bg-black-primary text-white-primary outline outline-2 outline-white-primary"
						onClick={gotoNext}
					>
						<motion.div
							className="h-full w-full"
							style={{ clipPath }}
						>
							<Showcase
								src={nextProject.value.showcases[0]}
								imgClassName="!transition ease-out group-hover:scale-110"
								className="scale-by-height !h-full !w-full"
								project={nextProject.name}
							/>
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

const Showcase: React.FC<{
	src: string | IGatsbyImageData;
	project: string;
	className?: string;
	imgClassName?: string;
	style?: React.CSSProperties;
}> = ({ src, className, imgClassName, style, project }) => {
	if (typeof src === 'string') {
		return (
			<video muted autoPlay className={className}>
				<source src={src} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		);
	}

	const img = getImage(src);
	if (!img) return <Throbber />;

	//TODO
	return (
		<>
			<img
				src={throbber}
				alt="Throbber"
				className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
			/>
			<GatsbyImage
				alt={`Showcase for ${project}`}
				image={img}
				className={`${className} flicker z-10 bg-black-primary`}
				imgClassName={imgClassName}
				style={{ ...style, animationDelay: `${-Math.random()}s` }}
				objectFit="cover"
			/>
			<Follow>
				<img
					alt="magnifying glass"
					src={glassImg}
					width={75}
					height={75}
					className="pointer-events-none z-10 -translate-x-1/2 -translate-y-1/2"
				/>
			</Follow>
		</>
	);
};
