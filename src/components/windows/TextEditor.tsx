import React, { useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { WindowDataContext } from '../Window';
import { easeSteps, pickRand, randRange } from '../../utils';
import NameCard from '../NameCard';
import ScrollMarquee from '../ScrollMarquee';
import GlitchText from '../GlitchText';
import ContentEditable from '../ContentEditable';
import camImg from '../../images/cam.png';
import Float from '../Float';
import { StaticImage } from 'gatsby-plugin-image';
import { randInt } from 'three/src/math/MathUtils';

function countSentences(str: string) {
	const sentences = str.split(/[.!?]/);

	const nonEmptySentences = sentences.filter(
		sentence => sentence.trim() !== ''
	);

	return nonEmptySentences.length;
}

const countWords = (str: string) => str.trim().split(/\s+/).length;

const TextEditor = () => {
	const { setTitle, sysObj, setBasicWindow, getWidth } =
		useContext(WindowDataContext) ?? {};
	if (
		!sysObj ||
		!('ext' in sysObj) ||
		!getWidth ||
		typeof sysObj.value !== 'string'
	)
		return;
	useEffect(() => {
		if (setTitle && sysObj && setBasicWindow)
			setTitle(`${sysObj.name}.${sysObj.ext} - Text Editor`);
	}, [setTitle, sysObj]);

	const scrollContainer = useRef(null);
	const { scrollY } = useScroll({
		container: scrollContainer,
	});

	const [text, setText] = useState(sysObj.value);
	const wordCount = countWords(text);
	const sentenceCount = countSentences(text);

	const imgs = [
		<StaticImage
			height={500}
			alt="Jumping into a exican cenote"
			src="../../images/about/cenote.jpg"
		/>,
		<StaticImage
			height={500}
			alt="One of the wonders of the world: chichen itza"
			src="../../images/about/chichen_itza.jpg"
		/>,
		<StaticImage
			height={500}
			alt="My cupcakes"
			src="../../images/about/cupcakes.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Me riding a donkey"
			src="../../images/about/donkey.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Istanbul, Turkey"
			src="../../images/about/istanbul.jpg"
		/>,
		<StaticImage
			height={500}
			alt="My favorite Moroccan city: Marrakesh"
			src="../../images/about/marrakesh.jpg"
		/>,
		<StaticImage
			height={500}
			alt="My muffins"
			src="../../images/about/muffins.jpg"
		/>,
		<StaticImage
			height={500}
			alt="New York"
			src="../../images/about/new_york.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Paris, France"
			src="../../images/about/paris.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Just a bit of Philly"
			src="../../images/about/philly_1.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Some more Philly"
			src="../../images/about/philly_2.jpg"
		/>,
		<StaticImage
			height={500}
			alt="I love Philly"
			src="../../images/about/philly_3.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Quebec, Canada"
			src="../../images/about/quebec.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Rabat, Morocco"
			src="../../images/about/rabat.jpg"
		/>,
		<StaticImage
			height={500}
			alt="My favorite sport soccer"
			src="../../images/about/soccer.jpg"
		/>,
	];
	const [currentImg, setCurrentImg] = useState(randInt(0, imgs.length - 1));

	return (
		<>
			<div className="hidden md:block w-full pr-10 z-10 fixed bottom-0">
				<p className="text-center whitespace-pre overflow-hidden bg-white-primary text-black-primary p-1">
					{[
						`${wordCount} word${wordCount > 1 ? 's' : ''}`,
						`${text.length} character${text.length > 1 ? 's' : ''}`,
						`${sentenceCount} sentence${sentenceCount > 1 ? 's' : ''}`,
					].join('    ')}
				</p>
			</div>
			<div
				className="relative overflow-y-auto overflow-x-hidden w-full h-full"
				ref={scrollContainer}
			>
				<NameCard />
				<ScrollMarquee
					scroll={scrollY}
					panSpeed={2}
					className="w-full bg-yellow-accent border-y-2 border-white-primary text-black-primary"
				>
					<p className="font-bold py-1 whitespace-pre">
						{[
							'Developer',
							'Hackerman',
							'UI/UX',
							'Design',
							'Vaporwave',
							'Gaming',
							'Since 2006',
							'',
						].join('  ►  ')}
					</p>
				</ScrollMarquee>
				<div className="clearfix p-8 py-16 md:py-32 relative md:pl-6 gap-6 text-white-primary bg-[repeating-linear-gradient(transparent,transparent_2em,#f5f9ff10_2em,#f5f9ff10_4em)]">
					<div
						className={`w-auto cursor-pointer ${
							getWidth() <= 800
								? 'md:hidden xs:ml-32 ml-0 mb-14'
								: 'group md:block h-full transition relative flicker ease-steps w-2/5 md:float-right duration-1000 ml-8 mb-7'
						}`}
						onClick={() =>
							setCurrentImg(old => (old + 1) % imgs.length)
						}
					>
						<Float className="group">
							{imgs.map((img, i) => (
								<motion.div
									key={i}
									animate={
										currentImg === i ? 'shown' : 'hidden'
									}
									variants={{
										shown: {
											maskPosition: '0 0%',
											WebkitMaskPosition: '0 0%',
										},
										hidden: {
											maskPosition: '0 100%',
											WebkitMaskPosition: '0 100%',
										},
									}}
									transition={{
										duration: 0.5,
										type: 'tween',
										ease: easeSteps(25),
									}}
									className={`transition bg-black ease-steps top-0 pixel-mask border-2 border-white-primary grayscale group-hover:grayscale-0 ${i > 0 && 'absolute'}`}
								>
									{img}
								</motion.div>
							))}
						</Float>
						<img
							src={camImg}
							alt="camera"
							className="hidden md:block absolute bottom-0 right-0 -rotate-45 translate-x-1/3 w-24 animate-blink"
						/>
					</div>
					<h3 className="font-display mb-7 static leading-[0.95] uppercase text-7xl origin-bottom-left w-full whitespace-nowrap z-10 rotate-0 top-16 xs:rotate-90 xs:absolute md:!rotate-0 md:!static">
						<span className="hidden xs:inline">† </span>
						<GlitchText
							onScroll
							scrollRoot={scrollContainer}
							decayRate={0.5}
						>
							ABOUT
						</GlitchText>
					</h3>
					<ContentEditable
						className="md:pl-7 md:ml-5 md:border-l-2 border-white-primary bg-transparent leading-8 outline-none border-y-0 border-r-0 min-h-96 resize-none"
						value={text}
						onUpdate={text => {
							setText(text);
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default TextEditor;
