import React, { useEffect, useRef } from 'react';
import Shortcut from './Shortcut';
import { useBoundStore } from '../store';
import { graphql, useStaticQuery } from 'gatsby';
import { MediaFile } from '../store/types';
import { Variants, motion } from 'framer-motion';

const itemVariants: Variants = {
	unloaded: {
		opacity: 0,
		scale: 2,
	},
	loaded: {
		opacity: 1,
		scale: 1,
	},
};

const listVariants: Variants = {
	loaded: {
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.25,
		},
	},
};

const ShortcutsArea = () => {
	const [desktop, fillDir] = useBoundStore(state => [
		state.navigate('users/@redaelmountassir/Desktop'),
		state.fillDir,
	]);
	const shortcuts = desktop && 'children' in desktop ? desktop.children : [];

	// TODO
	const tempRef = useRef<HTMLUListElement>(null);
	useEffect(() => {
		if (tempRef.current) {
			Array.from(tempRef.current.children).forEach(
				({ firstElementChild }) => {
					if (!firstElementChild || !('click' in firstElementChild))
						return;
					firstElementChild.click();
				}
			);
		}
	}, [tempRef.current]);

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
						roles
						date
						categories
						tags
						description
						showcases {
							childImageSharp {
								gatsbyImageData(layout: FIXED)
							}
						}
						logo {
							childImageSharp {
								gatsbyImageData(
									layout: FIXED
									placeholder: NONE
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
						edge.node.date = new Date(edge.node.date);
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
		<motion.ul
			className="pointer-events-none w-full absolute top-0 h-full p-4 pt-20 pb-24 grid justify-items-center grid-cols-3 grid-rows-2 sm:!grid-cols-6 md:flex md:items-start md:pb-4 xs:grid-cols-5 short:grid-rows-3 average:grid-rows-4 tall:grid-rows-5"
			style={{ gridAutoRows: 0 }}
			variants={listVariants}
			ref={tempRef}
		>
			{shortcuts.map((shortcut, i) => (
				<motion.li
					key={i}
					variants={itemVariants}
					className="pointer-events-auto"
				>
					<Shortcut sysObj={shortcut} />
				</motion.li>
			))}
		</motion.ul>
	);
};

export default ShortcutsArea;
