import infoImg from '../images/info.png';
import shapeGif from '../images/icohedron.gif';
import { AnimationScope, motion, Transition } from 'framer-motion';
import { useContext, useMemo, useRef } from 'react';
import { File } from '../store/types';
import React from 'react';
import Showcase from './Showcase';
import { MobileContext } from './OS';
import { ease25Steps, ease5Steps } from '../utils';
import { StaticImage } from 'gatsby-plugin-image';

interface MainShowcaseProps {
	file: File;
	scrollContainer: AnimationScope<any>;
	inTop: boolean;
	skipSection?: React.MouseEventHandler<HTMLDivElement>;
}

const transition: Transition = {
	ease: ease25Steps,
};

const MainShowcase: React.FC<MainShowcaseProps> = ({
	file,
	scrollContainer,
	inTop,
	skipSection,
}) => {
	if (typeof file.value === 'string' || !file.value) return;
	const projectData = file.value;

	const isMobile = useContext(MobileContext);

	// Title anim
	const titleAnimated = useMemo<React.JSX.Element[]>(
		() =>
			file.name.split('_').map((str, i) => (
				<span key={i} className="-mt-4 block overflow-hidden">
					<motion.span
						initial={{ y: '100%' }}
						whileInView={{ y: 0 }}
						transition={{
							delay: (i + 2) * 0.25,
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
		[file.name]
	);

	const maskUnsupported = useMemo(
		() =>
			!(
				'mask' in window.document.documentElement.style ||
				'webkitMask' in window.document.documentElement.style
			),
		[]
	);

	const mainShowcaseRef = useRef<HTMLDivElement>(null);

	return (
		<div className="sticky top-0 md:top-12 mb-14 flex gap-4">
			<div className="z-10 basis-0 md:flex-1 min-w-0">
				<motion.div
					ref={mainShowcaseRef}
					initial={'mobileTop'}
					animate={`${isMobile || maskUnsupported ? 'mobile' : ''}${inTop ? 'Top' : 'Bottom'}`}
					variants={{
						Top: {
							maskPosition: ['0 0%', '0 100%', '0 0%'],
							WebkitMaskPosition: ['0 0%', '0 100%', '0 0%'],
							z: [0, 1],
							transition,
						},
						Bottom: {
							maskPosition: ['0 0%', '0 100%', '0 0%'],
							WebkitMaskPosition: ['0 0%', '0 100%', '0 0%'],
							z: [0, 1],
							transition,
						},
						mobileTop: {
							clipPath: [
								'inset(0 0% 0 0)',
								'inset(0 100% 0 0)',
								'inset(0 0% 0 0)',
							],
							z: [0, 1],
						},
						mobileBottom: {
							clipPath: [
								'inset(0 0% 0 0)',
								'inset(0 100% 0 0)',
								'inset(0 0% 0 0)',
							],
							z: [0, 1],
						},
					}}
					transition={{
						duration: 0.75,
						type: 'tween',
						ease: ease5Steps,
					}}
					onUpdate={({ z }) => {
						if (!mainShowcaseRef.current) return;

						// Z is not actually being animated
						// just a value I'm using to hackily get the progress of an animation
						const time = z as number;
						if (time >= 0.5) {
							const newPos = inTop ? 'absolute' : 'relative';
							if (
								mainShowcaseRef.current.style.position ===
								newPos
							)
								return;
							mainShowcaseRef.current.style.position = newPos;
							const newSize = inTop ? '100% 2500%' : '200% 2500%';
							mainShowcaseRef.current.style.maskSize = newSize;
							mainShowcaseRef.current.style.webkitMaskSize =
								newSize;
						}
						if (mainShowcaseRef.current.style.maskImage !== '') {
							mainShowcaseRef.current.style.maskImage = '';
							mainShowcaseRef.current.style.webkitMaskImage = '';
						}
					}}
					onAnimationComplete={() => {
						if (
							!mainShowcaseRef.current ||
							isMobile ||
							maskUnsupported
						)
							return;

						// If you leave the mask, even on an all-white mask-image, it will still make it slightly see-through
						mainShowcaseRef.current.style.maskImage = 'none';
						mainShowcaseRef.current.style.webkitMaskImage = 'none';
					}}
					className="pixel-mask darken-bottom group absolute h-full w-full cursor-none border-2 border-white-primary"
				>
					<Showcase
						src={projectData.showcases[0]}
						imgClassName="!transition ease-out group-hover:scale-110"
						className="scale-by-height !h-full !w-full"
						project={file.name}
					/>
					<div
						className={`absolute top-6 right-3 z-20 animate-bounce cursor-pointer transition delay-1000 md:top-auto md:bottom-3 ${!inTop && 'opacity-0 pointer-events-none !delay-0'}`}
						onClick={skipSection}
					>
						<StaticImage
							src="../images/scroll_down.png"
							alt="scroll down"
							layout="fixed"
							width={16}
							className="scale-[300] origin-top-right md:origin-bottom-right md:scale-[4]"
						/>
					</div>
				</motion.div>
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
				<img
					src={shapeGif}
					alt="spinning shape"
					className="p-4 py-1 h-28 w-full object-contain border-2 border-white-primary bg-black-primary"
				/>
			</div>
		</div>
	);
};
export default MainShowcase;
