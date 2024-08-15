import * as React from 'react';
import type { SystemObject } from '../store/types';
import Icon from './Icon';
import { useBoundStore } from '../store';
import { useContext } from 'react';
import { MobileContext } from './OS';

interface ShortcutPros {
	sysObj: SystemObject;
	overrideClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Shortcut: React.FC<ShortcutPros> = ({ sysObj, overrideClick }) => {
	const [addWindow] = useBoundStore(state => [state.addWindow]);
	const isMobile = useContext(MobileContext);

	return (
		<button
			className="group flex flex-col items-center p-2 w-24 max-h-full h-auto outline-2 outline-transparent outline-offset-8 transition-all ease-steps md:p-4 md:outline hover:outline-white-primary hover:outline-offset-0 md:active:outline-white-primary md:active:outline-offset-0 md:active:shadow-[inset_0_0_70px]"
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
				className="w-16 h-16 mb-2 pointer-events-none md:mb-4"
				sysObj={sysObj}
			/>
			<p className="p-2 text-center max-w-[175%] leading-none break-words select-none text-sm text-white-primary shadow-[inset_0_0_40px] transition-all ease-steps shadow-black-primary md:group-active:shadow-none">
				{sysObj.name}
				{'ext' in sysObj && sysObj.ext !== 'exe'
					? `.${sysObj.ext}`
					: ''}
			</p>
		</button>
	);
};

export default Shortcut;
