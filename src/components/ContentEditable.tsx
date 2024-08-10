import { motion, useMotionValue } from 'framer-motion';
import React, { memo, useEffect, useRef } from 'react';

function getCaretPosition() {
	const sel = window.getSelection();
	if (sel && sel.rangeCount > 0) {
		const range = sel.getRangeAt(0);
		const rect = range.getBoundingClientRect();
		return { top: rect.top, left: rect.left };
	}
	return null;
}

function getIndexRelative(
	relativeTo: HTMLElement,
	initPos: number,
	initNode: Node
) {
	let pos = initPos;
	let currentNode = initNode;
	while (true) {
		if (currentNode.previousSibling) {
			currentNode = currentNode.previousSibling;
			switch (currentNode.nodeType) {
				case 3:
					pos += (currentNode.nodeValue ?? '').length;
					break;
				case 1:
				default:
					pos += (currentNode as Element).outerHTML.length;
					break;
			}
		} else if (
			currentNode.parentNode &&
			currentNode.parentNode !== relativeTo
		) {
			currentNode = currentNode.parentNode;
			const element = currentNode as Element;
			const outer = element.outerHTML;
			pos += outer.indexOf(element.innerHTML);
		} else break;
	}
	return pos;
}

function modifySelection(input: HTMLElement, tag: string) {
	const sel = window.getSelection();
	if (!sel || !sel.anchorNode || !sel.focusNode) return;

	let startPos = getIndexRelative(input, sel.anchorOffset, sel.anchorNode);
	let endPos = sel.isCollapsed
		? startPos
		: getIndexRelative(input, sel.focusOffset, sel.focusNode);

	if (endPos < startPos) {
		const temp = startPos;
		startPos = endPos;
		endPos = temp;
	}

	let inner = input.innerHTML;
	const prior = inner.slice(0, startPos);
	const selected = inner.slice(startPos, endPos);
	const after = inner.slice(endPos);

	let newSelected = `<${tag}>${selected}</${tag}>`;
	input.innerHTML = `${prior}${newSelected}${after}`;
}

interface ContentEditableProps
	extends React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLParagraphElement>,
		HTMLParagraphElement
	> {
	value: string;
	onUpdate: (str: string) => void;
}

const ContentEditable: React.FC<ContentEditableProps> = memo(props => {
	const { value, onUpdate, ...rest } = props;
	const display = useMotionValue('none');
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const contentEditableRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		if (!contentEditableRef.current) return;
		contentEditableRef.current.innerHTML = props.value;
		onUpdate(contentEditableRef.current.textContent ?? '');
	}, []);

	useEffect(() => {
		document.addEventListener('selectionchange', () => {
			const pos = getCaretPosition();
			if (!pos) return;
			x.set(pos.left);
			y.set(pos.top);
		});
	}, []);

	return (
		<>
			<motion.div
				className="fixed top-0 left-0 z-50"
				style={{ display, x, y }}
				onFocus={() => display.set('block')}
				onBlur={() => display.set('none')}
			>
				<motion.div className="-translate-x-1/2 -translate-y-[300%] border-2 border-white-primary divide-x-2 divide-white-primary bg-black-primary">
					<button
						className="transition hover:bg-white-primary py-1 hover:text-black-primary ease-steps text-center w-8 font-bold"
						type="button"
						onClick={e => {
							if (!contentEditableRef.current) return;
							e.preventDefault();
							modifySelection(contentEditableRef.current, 'b');
							display.set('none');
						}}
					>
						B
					</button>
					<button
						className="transition hover:bg-white-primary py-1 hover:text-black-primary ease-steps text-center w-8 underline"
						type="button"
						onClick={e => {
							if (!contentEditableRef.current) return;
							e.preventDefault();
							modifySelection(contentEditableRef.current, 'u');
							display.set('none');
						}}
					>
						U
					</button>
					<button
						className="transition hover:bg-white-primary py-1 hover:text-black-primary ease-steps text-center w-8 italic"
						type="button"
						onClick={e => {
							if (!contentEditableRef.current) return;
							e.preventDefault();
							modifySelection(contentEditableRef.current, 'i');
							display.set('none');
						}}
					>
						I
					</button>
				</motion.div>
			</motion.div>
			<p
				{...rest}
				contentEditable
				ref={contentEditableRef}
				onInput={e =>
					onUpdate(
						(e.target as HTMLParagraphElement).textContent ?? ''
					)
				}
				onFocus={() => display.set('block')}
				onBlur={() => display.set('none')}
			/>
		</>
	);
});

export default ContentEditable;
