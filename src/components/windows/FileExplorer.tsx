import React, { useContext, useEffect, useMemo, useState } from 'react';
import { WindowDataContext } from '../Window';
import { useBoundStore } from '../../store';
import Shortcut from '../Shortcut';
import GlitchText from '../GlitchText';
import Marquee from '../Marquee';
import sunImg from '../../images/circle.png';
import trashImg from '../../images/trash.png';

export const FileExplorer = () => {
	const { sysObj, id, setTitle, getWidth } = useContext(
		WindowDataContext
	) ?? {
		sysObj: null,
	};

	if (sysObj === null || 'ext' in sysObj) return null;

	useEffect(() => setTitle(`File Explorer - ${sysObj.name}`), [sysObj]);
	const isTrash = sysObj.name === 'Trash';

	const [traverse, addWindow, deleteWindow, emptyDir] = useBoundStore(
		state => [
			state.traverse,
			state.addWindow,
			state.deleteWindow,
			state.emptyDir,
		]
	);
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
		<>
			<Marquee
				className="sticky top-0 z-20 shrink-0 overflow-hidden border-b-2 border-white-primary bg-yellow-accent"
				innerClass="text-black-primary text-md py-1 px-20 text-center space-x-20"
				panTime={duration}
				steps={250}
			>
				<h3 className="inline">{children.length} Items</h3>
				<h3 className="inline">
					{stored}KB in {sysObj.name}
				</h3>
				<h3 className="inline">175KB Available</h3>
			</Marquee>
			<div className="w-full grow grid-cols-3 pb-24 md:grid md:p-0">
				<ul className="z-10 overflow-x-hidden bg-black-primary text-white-primary outline outline-2 outline-white-primary flex justify-end md:block">
					{parentFolders &&
						parentFolders.map((folder, i) => (
							<li key={folder.name} className="text-nowrap">
								<button
									type="button"
									className="text-md group relative w-full p-2 text-left transition-colors ease-steps md:hover:bg-white-primary md:hover:text-black-primary md:p-4"
									onPointerDown={() => setSelected(i)}
									onClick={() => {
										//Replaces current window (I have 0 clue why this works)
										deleteWindow(id);
										addWindow(folder);
									}}
								>
									<span className="absolute opacity-0 transition-opacity ease-steps md:group-hover:opacity-100">
										&gt;
									</span>
									<span className="block whitespace-nowrap transition-transform ease-steps group-hover:underline md:!no-underline md:group-hover:translate-x-4">
										<GlitchText
											animated={i === selected}
											onComplete={() =>
												i === selected &&
												setSelected(-1)
											}
										>
											{folder.name}
										</GlitchText>
									</span>
								</button>
								<span className="-translate-x-2 inline-block md:hidden">
									►
								</span>
							</li>
						))}
					<li className="text-md w-full p-2 text-left md:p-4 md:bg-purple-watermark">
						{sysObj.name}
					</li>
				</ul>
				<ul className="col-span-2 flex flex-wrap content-start justify-around gap-4 p-12 px-4 md:p-4 md:content-around">
					{children.length === 0 ? (
						<p className="text-md my-auto text-center font-bold text-white-primary">
							{isTrash
								? 'Your trashcan is empty'
								: 'This folder is empty'}
						</p>
					) : (
						children.map(child => (
							<li key={child.name} className="w-24">
								<Shortcut
									sysObj={child}
									overrideClick={
										'ext' in child
											? undefined
											: () => {
													//Replaces current window (I have 0 clue why this works)
													deleteWindow(id);
													addWindow(child);
												}
									}
								/>
							</li>
						))
					)}
				</ul>
				{isTrash && parentFolders && (
					<button
						type="button"
						className="ease-step bottom-20 fixed right-10 m-4 bg-gradient-to-r from-blue-accent to-pink-accent bg-double bg-left px-4 py-2 text-white-primary outline outline-2 outline-white-primary transition-all hover:bg-right active:scale-95 md:bottom-0"
						onClick={() => {
							emptyDir([
								...parentFolders.map(dir => dir.name),
								sysObj.name,
							]);
							setChildren([]);
						}}
					>
						<span className="hidden md:inline">Empty Trash</span>
						<img
							src={trashImg}
							alt="Empty Trash"
							className="w-8 my-2 block md:hidden"
						/>
					</button>
				)}
				<img
					src={sunImg}
					alt="Background graphic"
					className="-bottom-6 right-1/2 translate-x-1/2 absolute -z-10 max-w-none w-[125%] md:bottom-[5%] md:w-auto md:h-3/4 opacity-40 md:opacity-100 md:translate-x-0 md:-right-32"
				/>
			</div>
		</>
	);
};
