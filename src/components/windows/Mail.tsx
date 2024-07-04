import React, { useContext, useState } from 'react';
import phoneImg from '../../images/phone.png';
import gitHubImg from '../../images/github.png';
import linkedInImg from '../../images/linkedIn.png';
import { WindowDataContext } from '../Window';
import { anticipate, easeInOut, useAnimate } from 'framer-motion';
import emailjs from '@emailjs/browser';
import sendMessageImg from '../../images/send_message.png';
import triangleImg from '../../images/triangle_outline_blue.png';
import triangle2Img from '../../images/triangle_gradient.png';

const Mail = () => {
	const width = useContext(WindowDataContext)?.getWidth() ?? 0;

	const [scope, animate] = useAnimate();
	const [scope2, animate2] = useAnimate();
	const offsetPath =
		'path("M32 0C67-38 296.4-106.9 251.4-151.9 189.5-213.8 83.4 81.6 16.4 57.6.4 47.6 9.4 23.6 32 0")';
	const offsetAnchor = 'top right';
	const offsetRotate = 'auto 45deg';

	const [inbox, setInbox] = useState<boolean[]>([]);

	return (
		<div className="w-full flex h-full text-white-primary border-white-primary overflow-hidden flex-col pb-20 md:pb-0 md:flex-row">
			<ul
				className={`overflow-hidden transition-all ease-steps flex md:block border-white-primary md:border-r-2 md:hover:bg-black-primary md:max-w-14 md:hover:max-w-60 ${
					width > 1200 && 'md:!max-w-60 md:!bg-black-primary'
				} ${width < 400 && 'md:hidden'}`}
			>
				<li className="grow">
					<a
						href="tel:2672312928"
						target="_blank"
						className="block border-b-2 text-center md:text-left whitespace-nowrap p-4 md:pr-0 group hover:bg-white-primary hover:text-black-primary"
					>
						<img
							src={phoneImg}
							alt="LinkedIn Logo"
							className="inline-block xs:mr-4 h-6 transition-all ease-steps group-hover:invert"
						/>
						<span className="mr-4 hidden xs:inline">
							267-231-2928
						</span>
					</a>
				</li>
				<li className="grow">
					<a
						href="https://www.linkedin.com/in/reda-elmountassir"
						target="_blank"
						className="block border-b-2 text-center md:text-left whitespace-nowrap p-4 md:pr-0 group hover:bg-white-primary hover:text-black-primary"
					>
						<img
							src={linkedInImg}
							alt="LinkedIn Logo"
							className="inline-block xs:mr-4 h-6 transition-all ease-steps group-hover:invert"
						/>
						<span className="mr-4 hidden xs:inline">LinkedIn</span>
					</a>
				</li>
				<li className="grow">
					<a
						href="https://github.com/redaelmountassir"
						target="_blank"
						className="block border-b-2 text-center md:text-left whitespace-nowrap p-4 md:pr-0 group hover:bg-white-primary hover:text-black-primary"
					>
						<img
							src={gitHubImg}
							alt="GitHub Logo"
							className="inline-block xs:mr-4 h-6 transition-all ease-steps group-hover:invert"
						/>
						<span className="mr-4 hidden xs:inline">GitHub</span>
					</a>
				</li>
			</ul>
			{width >= 600 && (
				<div className="flex-1 border-r-2 md:flex flex-col relative overflow-hidden hidden">
					<h3 className="text-center min-h-[59px] p-4 border-b-2 border-white-primary font-bold">
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
						src={triangle2Img}
						alt="Background graphic"
						className="top-[80%] left-2 -translate-y-1/2 absolute -z-10 h-52"
					/>
					<img
						src={triangleImg}
						alt="Background graphic"
						className="top-3/4 -left-20 -translate-y-1/2 absolute -z-10 h-52"
					/>
				</div>
			)}
			<form
				ref={scope}
				className={`w-full relative overflow-hidden p-4 flex-[3] flex flex-col bg-black-primary gap-2 ${
					width < 600 && 'text-sm'
				}`}
				onSubmit={e => {
					e.preventDefault();

					const form = e.target as HTMLFormElement;
					if (form['_honeypot'].value) return;
					let incomplete = false;
					['email', 'subject', 'message'].forEach(field => {
						if (form[field].value.length > 4) return;
						incomplete = true;
						animate(
							`#${field}-container`,
							{
								x: [-10, 10, -10, 0],
							},
							{ duration: 0.2 }
						);
					});
					if (incomplete) return;

					emailjs
						.sendForm('service_qli1ok3', 'template_gssdksr', form, {
							publicKey: '-NFyAGI2XinGMKaFG',
						})
						.then(
							() => {
								animate2(
									scope2.current,
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
											return progress < 0
												? 1 + progress
												: progress;
										},
										type: 'tween',
										onComplete: form.reset,
									}
								);
							},
							err => {
								animate(
									'#warning',
									{ y: ['-100%', '0%', '0%', '-100%'] },
									{ duration: 3, times: [0, 0.01, 0.75, 1] }
								);
								console.log('FAILED...', err.text);
							}
						);
				}}
			>
				<div
					id="warning"
					className="w-full absolute top-0 left-0 py-2 -translate-y-full whitespace-nowrap text-center bg-yellow-accent font-bold text-black-primary overflow-hidden border-b-2 border-white-primary"
				>
					Failed to send...
				</div>
				<div
					id="email-container"
					className="flex items-center p-2 bg-gradient-to-r from-blue-accent/20 to-[65px] to-burgundy-accent/20 whitespace-nowrap  transition-[outline] ease-steps outline outline-2 outline-transparent outline-offset-8 hover:outline-offset-0 hover:outline-white-primary focus:outline-offset-0 focus:outline-white-primary"
				>
					<label className="inline-block" htmlFor="email">
						From:
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						autoComplete="off"
						className="flex-grow pl-4 bg-transparent outline-none overflow-hidden overflow-ellipsis"
					/>
				</div>
				<button
					type="button"
					onClick={() =>
						navigator.clipboard.writeText(
							'redaelmountassir0@gmail.com'
						)
					}
					className="group relative flex items-center p-2 bg-gradient-to-r from-blue-accent/20 to-[50px] to-burgundy-accent/20 whitespace-nowrap transition-[outline] ease-steps outline outline-2 outline-transparent outline-offset-8 hover:outline-offset-0 hover:outline-white-primary focus:outline-offset-0 focus:outline-white-primary"
				>
					<p className="inline-block">To:</p>
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
				<div
					id="subject-container"
					className="flex items-center p-2 bg-gradient-to-r from-blue-accent/20 to-[65px] to-burgundy-accent/20 whitespace-nowrap  transition-[outline] ease-steps outline outline-2 outline-transparent outline-offset-8 hover:outline-offset-0 hover:outline-white-primary focus:outline-offset-0 focus:outline-white-primary"
				>
					<label className="inline-block" htmlFor="subject">
						Subject:
					</label>
					<input
						id="subject"
						name="subject"
						type="text"
						required
						className="flex-grow pl-4 bg-transparent outline-none overflow-hidden overflow-ellipsis"
					/>
				</div>
				<textarea
					id="message-container"
					name="message"
					required
					className="p-2 bg-transparent bg-gradient-to-r from-blue-accent/20 to-50% to-burgundy-accent/20 outline-none flex-grow resize-none transition-[outline] ease-steps outline outline-2 outline-transparent outline-offset-8 hover:outline-offset-0 hover:outline-white-primary focus:outline-offset-0 focus:outline-white-primary"
				/>
				{/* Honeypot */}
				<input
					className="absolute opacity-0 w-0 h-0 left-0 top-0"
					autoComplete="off"
					type="email"
					id="honeypot"
					name="_honeypot"
					placeholder="Your e-mail here"
				/>
				<button
					id="submit"
					type="submit"
					value="send"
					className="flex justify-center items-center text-black-primary bg-white-primary p-2 transition-all ease-steps shadow-[0px_2px] shadow-light-primary hover:translate-y-[2px] hover:shadow-[0_0]"
				>
					<span className="text-left font-bold pr-4 hidden md:block">
						Send Message
					</span>
					<img
						ref={scope2}
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
					/>
				</button>
			</form>
		</div>
	);
};

export default Mail;
