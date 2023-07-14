import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import OS from '../components/OS';
import Desktop from '../components/Desktop';
import Taskbar from '../components/Taskbar';

const IndexPage: React.FC<PageProps> = () => {
	return (
		<OS>
			<Desktop />
			<Taskbar />
		</OS>
	);
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
