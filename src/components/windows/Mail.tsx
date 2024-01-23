import React, { useContext, useState } from 'react';
import phoneImg from '../../images/phone.png';
import gitHubImg from '../../images/github.png';
import linkedInImg from '../../images/linkedIn.png';
import { WindowDataContext } from '../Window';
import sendMessageImg from '../../images/send_message.png';
import triangleImg from '../../images/triangle_outline_blue.png';
import { anticipate, easeInOut, useAnimate } from 'framer-motion';

const Mail = () => {
	const width = useContext(WindowDataContext)?.getWidth() ?? 0;

	const [scope, animate] = useAnimate();
	const offsetPath =
		'path("M32 0C67-38 296.4-106.9 251.4-151.9 189.5-213.8 83.4 81.6 16.4 57.6.4 47.6 9.4 23.6 32 0")';
	const offsetAnchor = 'top right';
	const offsetRotate = 'auto 45deg';

	const [inbox, setInbox] = useState<boolean[]>([]);

	return (
		<div className="w-full flex h-full text-white-primary border-white-primary overflow-hidden flex-col pb-20 md:pb-0 md:flex-row">
			<ul
				className={`overflow-hidden transition-all ease-steps border-white-primary md:border-r-2 md:hover:bg-black-primary md:max-w-14 md:hover:max-w-60 ${
					width > 1200 && 'md:!max-w-60 md:!bg-black-primary'
				} ${width < 400 && 'md:hidden'}`}
			>
				<li>
					<a
						href="tel:2672312928"
						target="_blank"
						className="block border-b-2 whitespace-nowrap p-4 pr-0 group hover:bg-white-primary hover:text-black-primary"
					>
						<img
							src={phoneImg}
							alt="LinkedIn Logo"
							className="inline-block mr-4 h-6 transition-all ease-steps group-hover:invert"
						/>
						<span className="mr-4">267-231-2928</span>
					</a>
				</li>
				<li>
					<a
						href="https://www.linkedin.com/in/reda-elmountassir"
						target="_blank"
						className="block border-b-2 whitespace-nowrap p-4 pr-0 group hover:bg-white-primary hover:text-black-primary"
					>
						<img
							src={linkedInImg}
							alt="LinkedIn Logo"
							className="inline-block mr-4 h-6 transition-all ease-steps group-hover:invert"
						/>
						<span className="mr-4">LinkedIn</span>
					</a>
				</li>
				<li>
					<a
						href="https://github.com/redaelmountassir"
						target="_blank"
						className="block border-b-2 whitespace-nowrap p-4 pr-0 group hover:bg-white-primary hover:text-black-primary"
					>
						<img
							src={gitHubImg}
							alt="GitHub Logo"
							className="inline-block mr-4 h-6 transition-all ease-steps group-hover:invert"
						/>
						<span className="mr-4">GitHub</span>
					</a>
				</li>
			</ul>
			{width >= 600 && (
				<div className="flex-1 border-r-2 flex flex-col relative overflow-hidden">
					<h3 className="text-center p-4 border-b-2 border-white-primary font-bold">
						Inbox
					</h3>
					<ul className="flex-grow overflow-y-auto">
						{"Let's Build Something Together"
							.split(' ')
							.map((val, i) => (
								<li
									key={val}
									className="px-4 py-2 flex gap-4 items-center whitespace-nowrap max-w-full border-b-2 border-light-primary"
								>
									<div
										onClick={e => {
											e.preventDefault();
											const newInbox = [...inbox];
											newInbox[i] = !inbox[i];
											setInbox(newInbox);
										}}
										className={`w-3 h-3 cursor-pointer border-2 border-burgundy-accent ${
											inbox[i] && 'bg-burgundy-accent'
										}`}
									/>
									<span className="flex-1 overflow-hidden overflow-ellipsis">
										{val}
									</span>
									<span className="text-burgundy-accent">
										Feb {i + 27}
									</span>
								</li>
							))}
					</ul>
					<img
						src={triangleImg}
						alt="Background graphic"
						className="top-3/4 -left-20 -translate-y-1/2 absolute -z-10 h-52"
					/>
				</div>
			)}
			<form
				className={`w-full relative p-4 flex-[3] flex flex-col bg-black-primary gap-2 ${
					width < 600 && 'text-sm'
				}`}
				action="mailto:redaelmountassir0@gmail.com"
				method="get"
				encType="text/plain"
				onSubmit={e => {
					animate(
						scope.current,
						{
							offsetDistance: '100%',
							motionDistance: '100%',
							transitionEnd: {
								offsetDistance: 0,
								motionDistance: 0,
							},
						},
						{
							duration: 2,
							ease: progress => {
								progress = easeInOut(progress);
								progress = anticipate(progress);
								return progress < 0 ? 1 + progress : progress;
							},
							type: 'tween',
						}
					);
				}}
			>
				<button
					type="button"
					onClick={() =>
						navigator.clipboard.writeText(
							'redaelmountassir0@gmail.com'
						)
					}
					className="group relative flex items-center p-2 bg-gradient-to-r from-blue-accent/20 to-[50px] to-burgundy-accent/20 whitespace-nowrap transition-all ease-steps outline outline-2 outline-transparent outline-offset-8 hover:outline-offset-0 hover:outline-white-primary focus:outline-offset-0 focus:outline-white-primary"
				>
					<label className="inline-block">To:</label>
					<span className="flex-grow text-left pl-4 overflow-hidden overflow-ellipsis">
						redaelmountassir0@gmail.com
						<span
							className={`absolute pl-2 opacity-0 transition-opacity ease-steps group-hover:opacity-100 group-focus:opacity-0 ${
								width < 350 &&
								'top-0 p-2 right-0 h-full bg-white-primary text-black-primary'
							}`}
						>
							(Copy)
						</span>
						<span
							className={`pl-2 opacity-0 transition-opacity ease-steps group-focus:opacity-100 ${
								width < 350 &&
								'absolute top-0 p-2 right-0 h-full bg-white-primary text-black-primary'
							}`}
						>
							(Copied!)
						</span>
					</span>
				</button>
				<div className="flex items-center p-2 bg-gradient-to-r from-blue-accent/20 to-[65px] to-burgundy-accent/20 whitespace-nowrap transition-all ease-steps outline outline-2 outline-transparent outline-offset-8 hover:outline-offset-0 hover:outline-white-primary focus:outline-offset-0 focus:outline-white-primary">
					<label className="inline-block" htmlFor="subject">
						Subject:
					</label>
					<input
						id="subject"
						name="subject"
						type="text"
						className="flex-grow pl-4 bg-transparent outline-none overflow-hidden overflow-ellipsis"
					/>
				</div>
				<textarea
					name="body"
					className="p-2 bg-transparent bg-gradient-to-r from-blue-accent/20 to-50% to-burgundy-accent/20 outline-none flex-grow resize-none transition-all ease-steps outline outline-2 outline-transparent outline-offset-8 hover:outline-offset-0 hover:outline-white-primary focus:outline-offset-0 focus:outline-white-primary"
				/>
				<button
					type="submit"
					value="send"
					className="flex justify-center items-center text-black-primary bg-white-primary p-2 transition-all ease-steps shadow-[0px_2px] shadow-light-primary hover:translate-y-[2px] hover:shadow-[0_0]"
				>
					<span className="text-left font-bold pr-4 hidden md:block">
						Send Message
					</span>
					<img
						src={sendMessageImg}
						alt="Send Message"
						className="mix-blend-difference h-8"
						style={{
							offsetPath,
							offsetAnchor,
							offsetRotate,
							motionPath: offsetPath,
							offsetRotation: offsetRotate,
							motionRotation: offsetRotate,
						}}
						ref={scope}
					/>
				</button>
			</form>
		</div>
	);
};

export default Mail;
