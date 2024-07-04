import React, { useContext, useEffect, useRef, useState } from 'react';
import { WindowDataContext } from '../Window';
import throbber from '../../images/throbber.gif';
import { motion } from 'framer-motion';
import { MobileContext } from '../OS';
import { StaticImage } from 'gatsby-plugin-image';

const PDFReader = () => {
	const { setTitle, sysObj } = useContext(WindowDataContext) ?? {};
	useEffect(() => {
		if (setTitle && sysObj) setTitle(`${sysObj.name}.pdf - PDF Reader`);
	}, [setTitle]);

	const mobile = useContext(MobileContext);

	if (mobile) return <PDFNoSupport />;
	return (
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
				className="h-full border-none"
			>
				<PDFNoSupport />
			</iframe>
		</object>
	);
};

const PDFNoSupport = () => {
	const [dowloaded, setDowloaded] = useState(false);

	return (
		<div className="relative select-none h-full w-full overflow-hidden bg-black-primary">
			<a
				href="./resume.pdf"
				download="resume.pdf"
				className={`transition-all ease-out flex items-center justify-center bg-black-primary border-2 border-white-primary text-white-primary text-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 hover:bg-white-primary hover:text-black-primary ${dowloaded ? 'w-28 h-28' : 'w-44 h-16'}`}
				onClick={() => !dowloaded && setDowloaded(true)}
			>
				{dowloaded ? (
					<img src={throbber} alt="Throbber" className="w-16" />
				) : (
					'Tap to download'
				)}
			</a>
			<h3 className="text-white-primary pointer-events-none dlig ss02 font-display text-7xl absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
				{[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i, arr) => (
					<motion.span
						key={i}
						initial={{
							opacity:
								1 - Math.abs(i / (arr.length - 1) - 0.5) * 1.5,
						}}
						animate={{
							opacity: 0.1,
						}}
						transition={{
							repeat: Infinity,
							delay: Math.abs(i / (arr.length - 1) - 0.5) * 4,
							duration: 2,
						}}
					>
						DOWNLOAD <br />
					</motion.span>
				))}
			</h3>
			<StaticImage
				src="../../images/column.png"
				height={450}
				alt="greek column"
				layout="fixed"
				placeholder="none"
				imgClassName="transition-none"
				className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
			/>
			<StaticImage
				src="../../images/dolphin.png"
				alt="dolphin"
				height={112}
				layout="fixed"
				className="-rotate-45 absolute left-1/4 -translate-x-1/2 top-1/4 -translate-y-1/2"
			/>
			<StaticImage
				src="../../images/dolphin.png"
				alt="dolphin"
				height={144}
				layout="fixed"
				className="absolute left-3/4 -translate-x-1/2 top-3/4 -translate-y-1/2"
			/>
		</div>
	);
};
export default PDFReader;
