import React, { useContext, useEffect, useMemo, useState } from 'react';
import { WindowDataContext } from '../Window';
import { useBoundStore } from '../../store';
import Shortcut from '../Shortcut';
import GlitchText from '../GlitchText';
import Marquee from '../Marquee';
import { useAudio } from '../../utils';
import trashAudio from '../../audio/trash.mp3';
import sunImg from '../../images/circle.png';
import trashImg from '../../images/trash.png';
import { StaticImage } from 'gatsby-plugin-image';

export const FileExplorer = () => {
	const { sysObj, id, setTitle, getWidth } = useContext(
		WindowDataContext
	) ?? {
		sysObj: null,
	};

	if (sysObj === null || 'ext' in sysObj) return null;

	useEffect(() => setTitle(`File Explorer - ${sysObj.name}`), [sysObj]);
	const isTrash = sysObj.name === 'Trash';

	// Set view type
	const [tileMode, setTileMode] = useState(true);

	const [traverse, replaceWindow, emptyDir] = useBoundStore(state => [
		state.traverse,
		state.replaceWindow,
		state.emptyDir,
	]);
	const parentFolders = useMemo(() => traverse(sysObj), [sysObj]);
	const [selected, setSelected] = useState(-1);
	//sysObj itself will not react to updates, requires state. This solution is both criminal and poorly designed
	let [children, setChildren] = useState(sysObj.children);
	useEffect(() => setChildren(sysObj.children), [sysObj.children]);
	children = children.filter(child => !child.hidden);

	//Marquee
	const duration = getWidth() / 15;
	const stored =
		children.reduce((prev, current) => prev + current.name.length, 0) * 12; //Produces a suitably unspecific enough number

	return (
		<div className="relative md:mt-[34px] md:grid grid-cols-3 flex-1 overflow-y-auto overflow-x-hidden">
			<Marquee
				className="!sticky md:!fixed md:top-10 z-20 overflow-hidden border-b-2 border-white-primary bg-yellow-accent"
				innerClass="text-black-primary text-md py-1 px-20 text-center whitespace-pre"
				panTime={duration}
				steps={250}
			>
				{`${children.length} Items       ${stored}KB in ${sysObj.name}       175KB Available`}
			</Marquee>
			<ul className="z-20 flex-1 hidden-scrollbar relative overflow-x-hidden md:bg-black-primary text-white-primary border-b-2 border-white-primary flex justify-end md:border-b-0 md:border-r-2 md:flex-col md:justify-start">
				{parentFolders &&
					parentFolders.map((folder, i) => (
						<li key={folder.name} className="text-nowrap">
							<button
								type="button"
								className="text-md group relative w-full p-2 text-left transition-colors ease-steps2 md:hover:bg-white-primary md:hover:text-black-primary md:p-4"
								onPointerDown={() => setSelected(i)}
								onClick={() => replaceWindow(id, folder)}
							>
								<span className="absolute opacity-0 transition-opacity ease-steps2 md:group-hover:opacity-100">
									&gt;
								</span>
								<GlitchText
									className="block whitespace-nowrap transition-transform ease-steps2 group-hover:underline md:!no-underline md:group-hover:translate-x-4"
									animated={i === selected}
									onComplete={() =>
										i === selected && setSelected(-1)
									}
								>
									{folder.name}
								</GlitchText>
							</button>
							<span className="-translate-x-2 inline-block md:hidden">
								►
							</span>
						</li>
					))}
				<li className="text-md w-full p-2 text-left md:p-4 md:bg-purple-watermark md:mb-2">
					{sysObj.name}
				</li>
				<button
					type="button"
					onClick={() => setTileMode(tileMode => !tileMode)}
					className="m-2 hidden self-start relative mt-auto border-white-primary border-2 whitespace-nowrap md:flex"
				>
					<StaticImage
						src="../../images/tile_mode.png"
						layout="fixed"
						className="m-2"
						alt="tile mode"
					/>
					<StaticImage
						src="../../images/list_mode.png"
						layout="fixed"
						className="m-2"
						alt="list mode"
					/>
					<div
						className={`w-1/2 h-full bg-purple-watermark absolute -z-10 transition ease-out ${!tileMode && 'translate-x-full'}`}
					/>
				</button>
			</ul>
			<ul
				className={`relative z-10 col-span-2 p-12 px-4 md:p-4 xs:px-6 ${tileMode ? 'gap-2 grid justify-around grid-cols-[repeat(auto-fill,minmax(min-content,100px))]' : ''}`}
			>
				{children.length === 0 ? (
					<p className="text-md my-auto text-center font-bold text-white-primary">
						{isTrash
							? 'Your trashcan is empty'
							: 'This folder is empty'}
					</p>
				) : (
					children.map(child => (
						<li
							key={child.name}
							className={tileMode ? 'w-24' : 'w-full'}
						>
							<Shortcut
								sysObj={child}
								overrideClick={
									'ext' in child
										? undefined
										: () => replaceWindow(id, child)
								}
								tile={tileMode}
							/>
						</li>
					))
				)}
			</ul>
			{isTrash && parentFolders && (
				<TrashBtn
					onClick={() => {
						emptyDir([
							...parentFolders.map(dir => dir.name),
							sysObj.name,
						]);
						setChildren([]);
					}}
				/>
			)}
			<img
				src={sunImg}
				alt="Background graphic"
				className="-bottom-6 right-1/2 translate-x-1/2 absolute md:-z-10 max-w-none w-[125%] md:bottom-[5%] md:w-auto md:h-3/4 opacity-40 md:opacity-100 md:translate-x-0 md:-right-32"
			/>
		</div>
	);
};

const TrashBtn: React.FC<{ onClick: Function }> = ({ onClick }) => {
	const [playTrash] = useAudio(trashAudio, 0.25);

	return (
		<button
			type="button"
			className="ease-step z-10 bottom-20 fixed right-10 m-4 bg-gradient-to-r from-blue-accent to-pink-accent bg-double bg-left px-4 py-2 text-white-primary outline outline-2 outline-white-primary transition-all hover:bg-right active:scale-95 md:bottom-0"
			onClick={() => {
				playTrash();
				onClick();
			}}
		>
			<span className="hidden md:inline">Empty Trash</span>
			<img
				src={trashImg}
				alt=""
				width={32}
				height={32}
				className="my-2 block md:hidden"
			/>
		</button>
	);
};

export default FileExplorer;
