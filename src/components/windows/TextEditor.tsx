import React, { useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { WindowDataContext } from '../Window';
import { easeSteps, pickRand, randRange } from '../../utils';
import NameCard from '../NameCard';
import ScrollMarquee from '../ScrollMarquee';
import GlitchText from '../GlitchText';
import ContentEditable from '../ContentEditable';
import camImg from '../../images/cam.png';
import img1 from '../../images/about/cenote.jpg';
import img2 from '../../images/about/chichen_itza.jpg';
import img3 from '../../images/about/cupcakes.jpg';
import img4 from '../../images/about/donkey.jpg';
import img5 from '../../images/about/istanbul.jpg';
import img6 from '../../images/about/marrakesh.jpg';
import img7 from '../../images/about/muffins.jpg';
import img8 from '../../images/about/new_york.jpg';
import img9 from '../../images/about/paris.jpg';
import img10 from '../../images/about/philly_1.jpg';
import img11 from '../../images/about/philly_2.jpg';
import img12 from '../../images/about/philly_3.jpg';
import img13 from '../../images/about/quebec.jpg';
import img14 from '../../images/about/rabat.jpg';
import img15 from '../../images/about/soccer.jpg';
import Float from '../Float';

function countSentences(str: string) {
	const sentences = str.split(/[.!?]/);

	const nonEmptySentences = sentences.filter(
		sentence => sentence.trim() !== ''
	);

	return nonEmptySentences.length;
}

const countWords = (str: string) => str.trim().split(/\s+/).length;

const imgs = [
	{ alt: 'Jumping into a exican cenote', src: img1 },
	{ alt: 'One of the wonders of the world: chichen itza', src: img2 },
	{ alt: 'My cupcakes', src: img3 },
	{ alt: 'Me riding a donkey', src: img4 },
	{ alt: 'Istanbul, Turkey', src: img5 },
	{ alt: 'My favorite Moroccan city: Marrakesh', src: img6 },
	{ alt: 'My muffins', src: img7 },
	{ alt: 'New York', src: img8 },
	{ alt: 'Paris, France', src: img9 },
	{ alt: 'Just a bit of Philly', src: img10 },
	{ alt: 'Some more Philly', src: img11 },
	{ alt: 'I love Philly', src: img12 },
	{ alt: 'Quebec, Canada', src: img13 },
	{ alt: 'Rabat, Morocco', src: img14 },
	{ alt: 'My favorite sport soccer', src: img15 },
];

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

	const [currentImg, setCurrentImg] = useState(pickRand(imgs));

	return (
		<>
			<div className="w-full pr-10 z-10 fixed bottom-0">
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
				<div className="clearfix p-20 py-32 relative pl-6 gap-6 text-white-primary bg-[repeating-linear-gradient(transparent,transparent_2em,#f5f9ff10_2em,#f5f9ff10_4em)]">
					<div>
						<div
							className={
								getWidth() <= 800
									? 'hidden'
									: 'group h-full cursor-pointer transition relative flicker ease-steps w-2/5 float-right duration-1000 ml-8 mb-7'
							}
							onClick={() => {
								let newImg = null;
								while (
									newImg === null ||
									newImg === currentImg
								) {
									newImg = pickRand(imgs);
								}
								setCurrentImg(newImg);
							}}
						>
							{currentImg && (
								<Float>
									<img
										src={img1}
										alt="sizing image"
										className="w-full h-full border-2 invisible"
									/>
									<AnimatePresence>
										<motion.img
											src={currentImg.src}
											alt={currentImg.alt}
											key={currentImg.alt}
											initial={{
												maskPosition: '0 100%',
											}}
											animate={{
												maskPosition: '0 0%',
											}}
											exit={{ scale: 0.999 }}
											transition={{
												duration: 0.5,
												type: 'tween',
												ease: easeSteps(25),
											}}
											className="absolute transition ease-steps top-0 w-full h-full contain pixel-mask border-2 border-white-primary grayscale group-hover:grayscale-0"
										/>
									</AnimatePresence>
								</Float>
							)}
							<img
								src={camImg}
								alt="camera"
								className="absolute bottom-0 right-0 -rotate-45 translate-x-1/3 w-24 animate-blink"
							/>
						</div>
						<h3 className="font-display mb-7 leading-[0.95] uppercase text-7xl whitespace-pre">
							†{' '}
							<GlitchText
								onScroll
								scrollRoot={scrollContainer}
								decayRate={0.5}
							>
								{'ABOUT   ME'}
							</GlitchText>
						</h3>
						<ContentEditable
							className="pl-7 ml-5 border-l-2 border-white-primary bg-transparent leading-8 outline-none border-y-0 border-r-0 min-h-96 w-full resize-none"
							value={text}
							onUpdate={text => {
								setText(text);
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default TextEditor;
