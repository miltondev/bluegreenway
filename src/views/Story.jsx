import * as React from 'react';
import moment from 'moment';

import DateRange from '../components/DateRange';
import MapLayersPicker from '../components/MapLayersPicker';
import MapOverlay from '../components/MapOverlay';
import PageHeader from '../components/PageHeader';

export default class Story extends React.Component {

	constructor (props) {
		super(props);

		this.onStateChange = this.onStateChange.bind(this);
		this.unsubscribeStateChange = props.store.subscribe(this.onStateChange);
	}

	onStateChange () {
		let storeState = this.props.store.getState();
		this.setState(storeState);
	}

	componentWillUpdate (nextProps, nextState) {
		var urlMode = this.state.mode;
		var appMode = nextProps.store.getState().mode;
		var storyTitle = this.props.params.title || nextProps.store.getState().stories.selectedStory.title;
		// console.log(this.state, nextProps.store.getState(), nextState);
		// for when the app loads with the URL of a specific story
		if (urlMode !== appMode) {
			this.updateModeUrl(appMode, storyTitle);
		}
		// for when the app loads with the URL of a specific story
		if (this.state.stories.data.items !== nextState.stories.data.items &&
			!this.props.store.getState().stories.selectedStory) {
			const idx = storyTitle.lastIndexOf('_');
			const storyId = +storyTitle.substring(idx).replace('_', '');
			this.updateSelectedStory(storyId, nextState.stories.data.items);
		}
	}

	updateSelectedStory (id, stories) {
		stories.forEach((story, index) => {
			if (story.id === id) {
				this.props.actions.updateSelectedStory({
					id,
					index,
					title: `${story.title.replace(/ /g, '-')}_${id}`
				});
			}
		});
	}

	updateModeUrl (mode, title) {
		if (mode && title) {
			this.props.history.push(`/stories/${mode}/${title}`);
		} else if (mode && !title) {
			this.props.history.push(`/stories/${mode}`);
		} else {
			this.props.history.push('*');
		}
	}

	componentWillMount (){
		if (!this.props.store.getState().stories.data.items.length) {
			this.props.actions.fetchStoriesData();
		}
		this.onStateChange();
	}

	componentDidMount () {
		//
	}

	componentWillUnmount () {
		this.unsubscribeStateChange();
	}

	componentDidUpdate () {
		//
	}

	handleRangeChange (range) {
		if (range[0]) {
			this.props.actions.storiesMinDateChanged(range[0]);
		}
		if (range[1]) {
			this.props.actions.storiesMaxDateChanged(range[1]);
		}
	}

	renderStoryContent (story) {
		if (story) {

		}
	}

	renderPageView () {
		const appState = this.props.store.getState();
		if (!appState.stories.data.items.length || !appState.stories.selectedStory) {
			 return false;
		}
		const storiesData = this.props.store.getState().stories;
		const stories = storiesData.data.items;
		const selectedStory = storiesData.selectedStory;
		const storyData = storiesData.data.items[selectedStory.index];

		console.log(selectedStory.title);

		return (
			<div className='grid-container'>
				<div className='row'>
					<div className='eight columns story-post' dangerouslySetInnerHTML={{ __html: storyData.body}} />
				</div>
			</div>
		);
	}

	renderMapView () {
		return (
			<div className='stories-map-overlay two columns'>
				<MapOverlay collapsible={true}>
					<MapLayersPicker
						layers={this.state.mapLayersPicker.layers}
						onLayerChange={this.props.actions.mapLayersPickerLayerChange}
						transportation={this.state.mapLayersPicker.transportation}
						onTransportationChange={this.props.actions.mapLayersPickerTransportationChange}
						/>
				</MapOverlay>
				<MapOverlay collapsible={true}>
					<DateRange
						minDate={moment('1/1/2016', 'M/D/YYYY')}
						maxDate={moment()}
						initialStartDate={this.state.stories.startDate}
						initialEndDate={this.state.stories.endDate}
						onRangeChange={(range) => this.handleRangeChange(range)} />
				</MapOverlay>
			</div>
		);
	}

	render () {
		return (
			<div id="story">
				{ this.state.mode === 'page' ? this.renderPageView() : this.renderMapView() }
			</div>
		);
	}
}