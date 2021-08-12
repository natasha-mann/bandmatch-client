import React from "react";
import { useQuery } from "@apollo/client";

import "./Collaborate.css";
import Header from "../../components/Header";
import CardsCarousel from "../../components/Carousel";
import FilterStrip from "../../components/FilterStrip";
import constructCards from "../../utils/constructCards";
import Button from "../../components/Button";

import { COLLABORATE, COLLABORATE_CAROUSEL } from "../../graphql/queries";
import { useUserContext } from "../../contexts/UserProvider";
import renderCards from "../../utils/renderCardsLogic";

const Collaborate = (props) => {
	const { state } = useUserContext();

	const filters = {
		genre: state.userFilters.genre,
		instruments: state.userFilters.instruments,
		lookingFor: state.userFilters.lookingFor,
		experienceLevel: state.userFilters.experienceLevel,
		userType: state.userFilters.userType,
	};

	const { data: collaborateData, loading, error } = useQuery(COLLABORATE, {
		variables: {
			collaborateFilters: filters,
		},
	});

	const {
		data: carouselData,
		loading: carouselLoading,
		error: carouselError,
	} = useQuery(COLLABORATE_CAROUSEL);

	if (loading) {
		return (
			<div>
				<h1>Loading...</h1>
			</div>
		);
	}

	if (error) {
		console.log(error);
		return <div>Error</div>;
	}

	if (carouselLoading) {
		return (
			<div>
				<h1>Loading...</h1>
			</div>
		);
	}

	if (carouselError) {
		console.log(carouselError);
		return <div>Error</div>;
	}

	let carouselCards;
	if (carouselData) {
		carouselCards = renderCards(carouselData.collaborate);
	}

	let collaborateCards;
	if (collaborateData) {
		collaborateCards = renderCards(collaborateData.collaborate);
	}

	return (
		<div className="collaborate-container">
			<Header className="pt-3" title="Collaborate with other musicians" />
			<div className="see-through-background-90 mt-20 ">
				<p className="title gutter">NEW KIDS ON THE BLOCK</p>
				<CardsCarousel cards={carouselCards} />
			</div>
			<FilterStrip title="FIND YOUR COLLABORATORS" />
			<div className="see-through-background-90 text-align-center">
				<div className="cards-container">
					{constructCards(collaborateCards)}
				</div>
				<Button label="LOAD MORE" size="medium" mode="primary" />
			</div>
		</div>
	);
};

export default Collaborate;