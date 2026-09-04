"use client";

import Image from "next/image";
import posthog from "posthog-js";

const isPostHogConfigured = Boolean(
	process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

const ExploreBtn = () => {
	const handleExplore = () => {
		if (isPostHogConfigured) {
			posthog.capture("events_explored");
		}

		console.log("Click");
	};

	return (
		<button
			type="button"
			id="explore-btn"
			className="mt-7 mx-auto"
			onClick={handleExplore}>
			<a href="#events">
				Explore Events
				<Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
			</a>
		</button>
	);
};

export default ExploreBtn;
