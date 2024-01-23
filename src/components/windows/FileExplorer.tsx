import React, { useContext, useEffect, useMemo, useState } from 'react';
import { WindowDataContext } from '../Window';
import Shortcut from '../Shortcut';
import { useBoundStore } from '../../store';
import GlitchText from '../GlitchText';

export const FileExplorer = () => {
	const { sysObj, id, setTitle, getWidth } = useContext(
		WindowDataContext
	) ?? { sysObj: null };

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
	const [children, setChildren] = useState(sysObj.children);
	useEffect(() => setChildren(sysObj.children), [sysObj.children]);

	//Marquee
	const duration = getWidth() / 15;
	const durationStr = `${duration}s`;
	const delayStr = `-${duration / 2}s`;
	const stored =
		children.reduce((prev, current) => prev + current.name.length, 0) * 12; //Produces a suitably unspecific enough number

	return (
		<>
			<div className="w-full bg-yellow-accent overflow-hidden sticky top-0 group shrink-0 border-b-2 border-white-primary z-10">
				<div
					className="text-black-primary text-md py-1 px-20 text-center animate-pan min-w-fit whitespace-nowrap space-x-20 group-hover:animate-pause"
					style={{
						animationDuration: durationStr,
						MozAnimationDuration: durationStr,
						WebkitAnimationDuration: durationStr,
					}}
				>
					<h3 className="inline">{children.length} Items</h3>
					<h3 className="inline">
						{stored}KB in {sysObj.name}
					</h3>
					<h3 className="inline">175KB Available</h3>
				</div>
				<div
					className="text-black-primary text-md py-1 px-20 text-center animate-pan whitespace-nowrap space-x-20 min-w-full absolute top-0 left-0 group-hover:animate-pause"
					style={{
						animationDuration: durationStr,
						MozAnimationDuration: durationStr,
						WebkitAnimationDuration: durationStr,
						animationDelay: delayStr,
						MozAnimationDelay: delayStr,
						WebkitAnimationDelay: delayStr,
					}}
				>
					<h3 className="inline">{children.length} Items</h3>
					<h3 className="inline">
						{stored}KB in {sysObj.name}
					</h3>
					<h3 className="inline">175KB Available</h3>
				</div>
			</div>
			<div className="w-full grow grid-cols-3 pb-24 md:grid md:p-0">
				<ul className="text-white-primary bg-black-primary overflow-x-hidden outline outline-2 outline-white-primary">
					{parentFolders &&
						parentFolders.map((folder, i) => (
							<li key={folder.name}>
								<button
									type="button"
									className="text-left p-4 w-full text-md transition-colors ease-steps relative group hover:bg-white-primary hover:text-black-primary"
									onPointerDown={() => setSelected(i)}
									onClick={() => {
										//Replaces current window (I have 0 clue why this works)
										deleteWindow(id);
										addWindow(folder);
									}}
								>
									<span className="transition-opacity ease-steps absolute opacity-0 group-hover:opacity-100">
										&gt;
									</span>
									<span className="transition-transform ease-steps block group-hover:translate-x-4">
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
							</li>
						))}
					<li className="text-left p-4 w-full text-md bg-dark-primary">
						{sysObj.name}
					</li>
				</ul>
				<ul className="flex justify-around p-4 col-span-2 flex-wrap gap-4 content-start md:content-around">
					{children.length === 0 ? (
						<p className="text-md font-bold text-white-primary text-center my-auto">
							{isTrash
								? 'Your Trashcan is empty'
								: 'This Folder is Empty'}
						</p>
					) : (
						children.map(child => (
							<li key={child.name} className="w-24">
								<Shortcut
									sysObj={child}
									overrideClick={
										isTrash
											? () => {}
											: 'ext' in child
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
						className="fixed m-4 px-4 py-2 text-white-primary right-10 bottom-0 bg-gradient-to-r bg-double bg-left from-blue-accent to-pink-accent outline outline-2 outline-white-primary transition-all ease-step hover:bg-right active:scale-95"
						onClick={() => {
							emptyDir([
								...parentFolders.map(dir => dir.name),
								sysObj.name,
							]);
							setChildren([]);
						}}
					>
						Empty Trash
					</button>
				)}
			</div>
		</>
	);
};
