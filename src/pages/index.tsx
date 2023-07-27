import * as React from 'react';
import { useState, useEffect } from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import OS from '../components/OS';
import Desktop from '../components/Desktop';
import Taskbar from '../components/Taskbar';

const IndexPage: React.FC<PageProps> = () => {
	return (
		<OS>
			<Desktop />
			<Taskbar />
		</OS>
	);
};

export default IndexPage;

const GetFrames = (text: string, shown: number): string[] => {
	const charArray = Array.from(text);
	return charArray.map((_, i) => {
		let frame = charArray.slice(i, i + shown).join('');
		if (frame.length < shown)
			frame += charArray.slice(0, shown - frame.length).join(''); //Wraps around if needed
		return frame;
	});
};

//Add some held frames
const FRAMES = [
	...Array(6).fill('-----RedaOS-----'),
	...GetFrames(
		'-----RedaOS---------------💻---------------👾-----',
		16
	).reverse(),
];
export const Head: HeadFC = () => {
	const [titleIndex, setTitleIndex] = useState(0);
	const [focused, setFocused] = useState(true); //If the page is even in focus

	useEffect(() => {
		const intervalID = setInterval(
			() => setTitleIndex(oldIndex => (oldIndex + 1) % FRAMES.length),
			250
		);

		const focusHandler = () => setFocused(true);
		const blurHandler = () => setFocused(false);
		window.addEventListener('focus', focusHandler);
		window.addEventListener('blur', blurHandler);

		return () => {
			clearInterval(intervalID);
			window.removeEventListener('focus', focusHandler);
			window.removeEventListener('blur', blurHandler);
		};
	}, []);

	return <title>[{focused ? FRAMES[titleIndex] : 'RedaOS'}]</title>;
};
