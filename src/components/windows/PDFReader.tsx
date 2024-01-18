import React, { useContext, useEffect, useRef, useState } from 'react';
import { WindowDataContext } from '../Window';
import throbber from '../../images/throbber.gif';
import { motion } from 'framer-motion';

const PDFReader = () => {
	const { setTitle, sysObj } = useContext(WindowDataContext) ?? {};
	useEffect(() => {
		if (setTitle && sysObj) setTitle(`${sysObj.name}.pdf - PDF Reader`);
	}, [setTitle]);

	return (
		<>
			<object
				data="./resume.pdf"
				type="application/pdf"
				width="100%"
				height="100%"
				className="h-full"
			>
				<iframe
					src="./resume.pdf"
					width="100%"
					height="100%"
					className="border-none h-full"
				>
					<PDFNoSupport />
				</iframe>
			</object>
		</>
	);
};

const PDFNoSupport = () => {
	const downloadLink = useRef<HTMLAnchorElement>(null);
	const [dowloaded, setDowloaded] = useState(false);
	useEffect(() => {
		if (!downloadLink.current) return;
		if (downloadLink.current.clientWidth === 0) return;
		//If all else fails, object and iframe must not be supported, so use default method
		if (dowloaded) return;
		downloadLink.current.click();
		setDowloaded(true); //Prevents double downloads
	}, []);

	return (
		<div className="bg-black-primary flex overflow-hidden w-full h-full">
			<div className="flex-shrink min-w-0 overflow-hidden">
				<motion.div
					className="w-40 bg-repeat-y bg-contain rotate-180 h-full bg-[url('/background_images/grid.png')]"
					animate={{ backgroundPositionY: '160px' }}
					transition={{
						repeat: Infinity,
						duration: 10,
						ease: 'linear',
						type: 'tween',
					}}
				/>
			</div>
			<div className="px-8 flex text-center flex-grow items-center justify-center flex-col">
				<img src={throbber} alt="Throbber" className="w-16" />
				<a
					className="text-md text-white-primary pt-8"
					href="./resume.pdf"
					download="resume.pdf"
					ref={downloadLink}
				>
					Should download soon...
				</a>
			</div>
			<div className="flex-shrink min-w-0 overflow-hidden">
				<motion.div
					className="w-40 bg-repeat-y bg-contain h-full float-right bg-[url('/background_images/grid.png')]"
					animate={{ backgroundPositionY: '160px' }}
					transition={{
						repeat: Infinity,
						duration: 10,
						ease: 'linear',
						type: 'tween',
					}}
				/>
			</div>
		</div>
	);
};
export default PDFReader;
