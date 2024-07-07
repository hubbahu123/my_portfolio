import * as React from 'react';
import { Link, HeadFC, PageProps } from 'gatsby';

const NotFoundPage: React.FC<PageProps> = () => {
	return (
		<React.StrictMode>
			<main className="w-full h-full bg-black-primary gap-4 flex justify-center items-center">
				<h1 className="font-display text-white-primary text-9xl">
					404
				</h1>
				<Link to="/" className="text-light-primary text-lg underline">
					Go home ►
				</Link>
			</main>
		</React.StrictMode>
	);
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>Not found</title>;
