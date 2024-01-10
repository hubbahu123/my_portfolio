import React, { useEffect, useRef, useState } from 'react';
import { Path } from '../../store/types';
import { useBoundStore, useSettingsStore } from '../../store';

interface HistoryItem {
	text: string;
	mod?: 'Warning' | 'Error' | 'Success';
	location?: Path; //Only applies to inputs
}

const INTRO = `
   ___         __     ____  ____
  / _ \\___ ___/ /__ _/ __ \\/ __/
 / , _/ -_) _  / _ \`/ /_/ /\\ \\
/_/|_|\\__/\\_,_/\\_,_/\\____/___/
Copyright (C) Paradox Corporation. All rights reserved.
Version 1.0.2

  `;

//Removes any .. in path
function reducePath(path: Path) {
	const reducedPath = path.reduce((acc, curr) => {
		curr === '..' ? acc.length > 1 && acc.pop() : acc.push(curr);
		return acc;
	}, [] as Path);
	return reducedPath;
}

export const Console = () => {
	const [history, setHistory] = useState<HistoryItem[]>([{ text: INTRO }]);
	const [navigate, toPath, addWindow, deleteWindow] = useBoundStore(state => [
		state.navigate,
		state.toPath,
		state.addWindow,
		state.deleteWindow,
	]);
	const shutdown = useSettingsStore(state => state.shutdown);
	const [location, setLocation] = useState<Path>([
		'C:',
		'users',
		'@redaelmountassir',
	]);
	const [input, setInput] = useState('');
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const consoleRef = useRef<HTMLDivElement>(null);
	const getInputs = () =>
		history
			.filter(item => 'location' in item)
			.filter((val, i, arr) => arr[i - 1]?.text !== val.text);

	useEffect(() => {
		consoleRef.current && (consoleRef.current.scrollTop = 9e20); //Big number wow
	}, [history]);

	const focusInput = () => inputRef.current?.focus();
	useEffect(focusInput, [inputRef]);

	const quickSelect = useRef({ i: -1, lastVal: '' });

	const exec = (input: string, bangSearch: number = 1): HistoryItem => {
		console.log(input, bangSearch);
		if (input.includes('!!')) {
			const inputs = getInputs();
			return exec(
				input.replace(
					'!!',
					inputs[inputs.length - bangSearch]?.text ?? ''
				),
				bangSearch + 1
			);
		}

		const executed: HistoryItem = { text: '' };
		const parts = input.trim().split(' ');
		switch (parts[0].toLowerCase()) {
			case 'help':
				break;
			case 'shutdown':
				const delay = parseFloat(parts[1] ?? '') * 1000;
				isNaN(delay) ? shutdown() : setTimeout(shutdown, delay);
				executed.text = `Shutting down ${
					isNaN(delay) ? 'now.' : `in ${delay} seconds.`
				}`;
				executed.mod = 'Warning';
				break;
			case 'echo':
				executed.text = parts[1] ?? '';
				//@ts-ignore
				executed.mod = parts[2]; // Bad code but fast code :)
				break;
			case 'window':
				const objGoal = parts[1];
				if (!objGoal) {
					executed.text = `Please provide a path as your 2nd argument.`;
					executed.mod = 'Error';
					break;
				}
				const obj = navigate(
					reducePath([...location, ...toPath(objGoal)])
				);
				if (!obj) {
					executed.text = `'${objGoal}' is not a real path.`;
					executed.mod = 'Error';
					break;
				}
				addWindow(obj);

				executed.text = 'Opened window.';
				executed.mod = 'Success';
				break;
			case 'exit':
				break;
			case 'ls':
				const navigated = navigate(location);
				if (
					!navigated ||
					!('children' in navigated) ||
					!navigated.children.length
				)
					break;
				executed.text = `\nName\n----\n${navigated.children
					.map(sysObj =>
						'ext' in sysObj
							? `${sysObj.name}.${sysObj.ext}`
							: sysObj.name
					)
					.join('\n')}\n\n`;
				break;
			case 'cd':
				const goal = parts[1];
				if (!goal) {
					setLocation(['C:', 'users', '@redaelmountassir']);
					break;
				}

				const newLoc = reducePath([...location, ...toPath(goal)]);

				const endObj = navigate(newLoc);
				if (!endObj) {
					executed.text = `'${goal}' is not a real path.`;
					executed.mod = 'Error';
					break;
				}
				if ('ext' in endObj) {
					executed.text = `'${goal}' is a file and cannot be navigated to.`;
					executed.mod = 'Error';
					break;
				}

				setLocation(newLoc);
				break;
			case 'clear':
				setHistory([]);
				break;
			default:
				executed.text = `'${parts[0]}' is not a valid command. Use 'help' to check what commands are available.`;
				executed.mod = 'Error';
				break;
		}
		return executed;
	};

	return (
		<div
			className={`flex-1 relative bg-black-primary text-sm p-2 pb-[10%] text-white-primary [text-shadow:_0_0_1rem_#f5f9ff9c] break-all whitespace-break-spaces overflow-x-hidden overflow-y-auto`}
			ref={consoleRef}
			onPointerUp={e => {
				e.preventDefault();
				focusInput();
			}}
		>
			{history.map(({ text, mod, location }, i) => (
				<div
					className={`${
						mod === 'Error' &&
						`text-burgundy-accent [text-shadow:_0_0_1rem_#920075]`
					} ${
						mod === 'Warning' &&
						`text-yellow-accent [text-shadow:_0_0_1rem_#f9c80e]`
					} ${
						mod === 'Success' &&
						`text-blue-accent [text-shadow:_0_0_1rem_#023788]`
					}`}
					key={i}
				>
					{location && <LocationText location={location} />}
					{text}
				</div>
			))}
			<div>
				<textarea
					ref={inputRef}
					value={input}
					autoCapitalize="off"
					autoComplete="off"
					autoCorrect="off"
					spellCheck={false}
					className="opacity-0 pointer-events-none absolute peer"
					onChange={e => setInput(e.target.value)}
					onKeyDown={e => {
						let dir = 0;
						if (inputRef.current) {
							inputRef.current.selectionStart = input.length;
							inputRef.current.selectionEnd = input.length;
						}
						switch (e.key) {
							case 'Enter':
								e.preventDefault();
								if (e.ctrlKey) {
									setInput(input + '\n');
									return;
								}

								setHistory(prevHistory => [
									...prevHistory,
									{ text: input, location },
									...input.split('\n').map(val => exec(val)),
								]);

								setInput('');
								quickSelect.current = { i: -1, lastVal: '' };
								return;
							case 'ArrowLeft':
							case 'ArrowRight':
								e.preventDefault();
								return;
							case 'ArrowUp':
								dir = -1;
								break;
							case 'ArrowDown':
								dir = 1;
								break;
							default:
								quickSelect.current = { i: -1, lastVal: '' };
								return;
						}

						const inputs = getInputs();

						let newInput = '';
						if (quickSelect.current.i === -1) {
							//If no history item is selected
							if (dir === 1) return; //Can't go into the future
							quickSelect.current.i = inputs.length - 1;
							if (quickSelect.current.i === -1) {
								quickSelect.current.i = -1;
								return;
							}
							quickSelect.current.lastVal = input;
							newInput = inputs[quickSelect.current.i].text;
						} else {
							quickSelect.current.i += dir;
							if (quickSelect.current.i === -1) {
								quickSelect.current.i = 0;
								return;
							}
							newInput = inputs[quickSelect.current.i]?.text;
							if (newInput === undefined) {
								newInput = quickSelect.current.lastVal;
								quickSelect.current.i = -1;
							}
						}

						setInput(newInput);
						if (!inputRef.current) return;
					}}
				/>
				<LocationText location={location} />
				{input.replaceAll('\n', '\n$ ')}
				<span className="font-bold invisible peer-focus:visible animate-blink">
					_
				</span>
			</div>
		</div>
	);
};

const LocationText = (props: { location: Path }) => {
	return <span className="">{props.location.join('/')}$ </span>;
};
