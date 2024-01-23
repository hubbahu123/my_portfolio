import React, { useEffect } from 'react';
import Shortcut from './Shortcut';
import { useBoundStore } from '../store';
import { graphql, useStaticQuery } from 'gatsby';
import { MediaFile } from '../store/types';

interface ShortcutsAreaProps {
	area: React.RefObject<Element>;
}

const ShortcutsArea: React.FC<ShortcutsAreaProps> = ({ area }) => {
	const [desktop, fillDir] = useBoundStore(state => [
		state.navigate('users/@redaelmountassir/Desktop'),
		state.fillDir,
	]);
	const shortcuts = desktop && 'children' in desktop ? desktop.children : [];

	//Pulls apps from projects jsons
	const data = useStaticQuery(graphql`
		query ProjectsQuery {
			allProjectsJson {
				edges {
					node {
						loc {
							text
							link
						}
						org
						role
						tags
						description
						showcases {
							childImageSharp {
								gatsbyImageData
							}
						}
						logo {
							childImageSharp {
								gatsbyImageData(
									layout: FIXED
									width: 64
									height: 64
								)
							}
						}
						parent {
							... on File {
								name
							}
						}
					}
				}
			}
		}
	`);
	useEffect(
		() =>
			fillDir(
				'users/@redaelmountassir/Desktop/Projects',
				data?.allProjectsJson?.edges?.map(
					(edge: { node: MediaFile }) => {
						// WARNING! ABSYMAL TYPESCRIPT! MY LAZY ASS DID NOT WANNA DEAL WITH
						// GRAPHQL TYPE GEN
						return {
							name: edge.node?.parent?.name ?? 'Unnamed',
							value: edge.node,
							ext: 'png', // TODO: Enable .mp4 as well
						};
					}
				)
			),
		[]
	);

	return (
		<div className="h-full p-4 pb-24 md:pt-20 md:pb-4 absolute top-0 pointer-events-none">
			<ul
				className="h-full grid grid-cols-4 grid-rows-2 xs:grid-cols-5 sm:!grid-cols-6 short:grid-rows-3 average:grid-rows-4 tall:grid-rows-5 md:flex md:items-start"
				style={{ gridAutoRows: 0 }}
			>
				{shortcuts.map(shortcut => (
					<li key={shortcut.name} className="pointer-events-auto">
						<Shortcut sysObj={shortcut} />
					</li>
				))}
			</ul>
		</div>
	);
};

export default ShortcutsArea;
