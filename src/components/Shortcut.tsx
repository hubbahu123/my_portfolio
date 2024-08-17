import React from 'react';
import type { SystemObject } from '../store/types';
import Icon from './Icon';
import { useBoundStore } from '../store';
import { useContext } from 'react';
import { MobileContext } from './OS';

interface ShortcutPros {
	sysObj: SystemObject;
	overrideClick?: React.MouseEventHandler<HTMLButtonElement>;
	tile?: boolean;
}

const Shortcut: React.FC<ShortcutPros> = ({
	sysObj,
	overrideClick,
	tile = true,
}) => {
	const [addWindow] = useBoundStore(state => [state.addWindow]);
	const isMobile = useContext(MobileContext);

	return (
		<button
			className={`group flex items-center w-24 max-h-full h-auto outline-2 outline-transparent outline-offset-8 transition-all ease-steps2 md:p-4 md:outline hover:outline-white-primary hover:outline-offset-0 md:active:outline-white-primary md:active:outline-offset-0 md:active:shadow-[inset_0_0_70px] p-2 ${tile ? 'flex-col gap-2' : 'w-full gap-6 md:gap-4 md:py-2'}`}
			type="button"
			onDoubleClick={
				overrideClick
					? e => !isMobile && overrideClick(e)
					: e =>
							!isMobile &&
							addWindow({
								...sysObj,
								htmlElement:
									e.target instanceof HTMLElement
										? e.target
										: undefined,
							})
			}
			onClick={
				overrideClick
					? e => isMobile && overrideClick(e)
					: e =>
							isMobile &&
							addWindow({
								...sysObj,
								htmlElement:
									e.target instanceof HTMLElement
										? e.target
										: undefined,
							})
			}
		>
			<Icon
				className={`pointer-events-none ${tile ? 'md:mb-4 w-16 h-16' : 'w-10 h-10 xs:w-16 xs:h-16 shrink-0 md:w-10 md:h-10'}`}
				sysObj={sysObj}
			/>
			<p
				className={`p-2 max-w-[175%] leading-none break-words select-none text-white-primary transition-all ease-steps2 ${tile ? 'shadow-[inset_0_0_40px] shadow-black-primary md:group-active:shadow-none text-center text-sm' : 'flex-1 text-left overflow-hidden text-nowrap text-ellipsis text-sm xs:text-base md:text-sm'}`}
			>
				{sysObj.name}
				{'ext' in sysObj && sysObj.ext !== 'exe'
					? `.${sysObj.ext}`
					: ''}
			</p>
		</button>
	);
};

export default Shortcut;
