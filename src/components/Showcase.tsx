import { GatsbyImage, IGatsbyImageData, getImage } from 'gatsby-plugin-image';
import glassImg from '../images/glass.png';
import throbber from '../images/throbber.gif';
import Follow from './Follow';
import React from 'react';

const Showcase: React.FC<{
	src: string | IGatsbyImageData;
	project: string;
	className?: string;
	imgClassName?: string;
	style?: React.CSSProperties;
}> = ({ src, className, imgClassName, style, project }) => {
	if (typeof src === 'string') {
		return (
			<>
				<img
					src={throbber}
					alt="Throbber"
					className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
				/>
				<video
					muted
					autoPlay
					playsInline
					loop
					className={`${className} z-10 relative bg-black-primary object-cover`}
				>
					<source src={src} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
				<Follow>
					<img
						alt="magnifying glass"
						src={glassImg}
						width={75}
						height={75}
						className="pointer-events-none z-10 -translate-x-1/2 -translate-y-1/2"
					/>
				</Follow>
			</>
		);
	}

	const img = getImage(src);
	if (!img)
		return (
			<img
				src={throbber}
				alt="Throbber"
				className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
			/>
		);

	return (
		<>
			<img
				src={throbber}
				alt="Throbber"
				className="absolute left-1/2 top-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
			/>
			<GatsbyImage
				alt={`Showcase for ${project}`}
				image={img}
				className={`${className} flicker z-10 bg-black-primary`}
				imgClassName={imgClassName}
				style={{ ...style, animationDelay: `${-Math.random()}s` }}
				objectFit="cover"
			/>
			<Follow>
				<img
					alt="magnifying glass"
					src={glassImg}
					width={75}
					height={75}
					className="pointer-events-none z-10 -translate-x-1/2 -translate-y-1/2"
				/>
			</Follow>
		</>
	);
};

export default Showcase;
