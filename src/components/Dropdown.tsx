import { MotionStyle, Variants, motion } from 'framer-motion';
import * as React from 'react';
import { useRef, useState, useEffect, memo } from 'react';
import { easeSteps } from '../utils';

interface DropdownProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	pClassName?: string;
	dClassName?: string;
	children: React.ReactElement;
	dContent: React.ReactElement;
	forcedAlignment?: Alignment;
	noPadding?: boolean;
}

const dropdownVariants: Variants = {
	open: {
		clipPath: 'inset(0 0 0% 0)',
		WebkitClipPath: 'inset(0 0 0% 0)',
		transition: {
			ease: easeSteps(5),
			type: 'tween',
		},
	},
	closed: {
		clipPath: 'inset(0 0 100% 0)',
		WebkitClipPath: 'inset(0 0 100% 0)',
		transition: {
			ease: easeSteps(5),
			type: 'tween',
		},
	},
};

type Alignment = 'left' | 'center' | 'right';

export const Dropdown: React.FC<DropdownProps> = memo(props => {
	const {
		children,
		dContent,
		forcedAlignment,
		noPadding,
		pClassName,
		dClassName,
		...rest
	} = props;

	const [open, setOpen] = useState(false);
	const button = useRef<HTMLButtonElement>(null);
	const dropdown = useRef<HTMLDivElement>(null);
	const [align, setAlign] = useState<Alignment>(forcedAlignment ?? 'left');
	useEffect(() => {
		if (!button.current) return;

		if (forcedAlignment) {
			setAlign(forcedAlignment);
		} else {
			const buttonRect = button.current.getBoundingClientRect();
			const centerX = buttonRect.left + buttonRect.width / 2;
			const windowThird = window.innerWidth / 3;
			// Sets the alignment of a dropdown based on if it falls in the 1st, 2nd, or 3rd area of the screen
			setAlign(
				centerX < windowThird
					? 'left'
					: centerX < windowThird * 2
						? 'center'
						: 'right'
			);
		}

		const clickOut = (e: PointerEvent) => {
			if (
				!dropdown.current ||
				!e.target ||
				!(e.target instanceof Element) ||
				dropdown.current.contains(e.target)
			)
				return;
			setOpen(false);
		};

		document.addEventListener('pointerdown', clickOut);
		return () => document.removeEventListener('pointerdown', clickOut);
	}, [forcedAlignment]);

	const alignmentStyle: MotionStyle = { top: '100%' };
	if (align === 'left') alignmentStyle.left = '0';
	else if (align === 'right') alignmentStyle.right = '0';
	else {
		alignmentStyle.left = '50%';
		alignmentStyle.x = '-50%';
	}

	return (
		<div className={'relative ' + pClassName} ref={dropdown}>
			<button
				{...rest}
				ref={button}
				type="button"
				onClick={e => {
					e.preventDefault();
					setOpen(open => !open);
				}}
			>
				{children}
			</button>
			<motion.div
				className={`absolute border-2 border-t-0 border-white-primary backdrop-blur bg-gradient-to-r from-black-primary/75 to-dark-primary/75 from-25% to-70% -z-10 ${
					!open && 'pointer-events-none'
				} ${!noPadding && 'p-4'} ${dClassName}`}
				style={alignmentStyle}
				animate={open ? 'open' : 'closed'}
				variants={dropdownVariants}
			>
				{dContent}
			</motion.div>
		</div>
	);
});

export default Dropdown;
