// Set up promise polyfill for isomorphic-fetch
import { polyfill } from 'es6-promise';
polyfill();

import fetch from 'isomorphic-fetch';
import { get } from 'lodash';

// dataUrls_tmp.json = for use while working offline
// dataUrls.json = for use in production
import dataUrls from '../static/dataUrls.json';

export const MENU_HIDDEN = 'MENU_HIDDEN';
export const MENU_TOGGLED = 'MENU_TOGGLED';

export const SET_STATE = 'SET_STATE';
// export const MODE_CHANGED = 'MODE_CHANGED';
export const MAP_MOVED = 'MAP_MOVED';
export const MAP_LAYERS_PICKER_LAYERS_CHANGED = 'MAP_LAYERS_PICKER_LAYERS_CHANGED';
export const MAP_LAYERS_PICKER_TRANSPORTATION_CHANGED = 'MAP_LAYERS_PICKER_TRANSPORTATION_CHANGED';
export const MAP_LAYERS_PICKER_STORIES_CHANGED = 'MAP_LAYERS_PICKER_STORIES_CHANGED';
export const MAP_LAYERS_PICKER_EVENTS_CHANGED = 'MAP_LAYERS_PICKER_EVENTS_CHANGED';
export const MAP_LAYERS_PICKER_PROJECTS_CHANGED = 'MAP_LAYERS_PICKER_PROJECTS_CHANGED';
export const MAP_LAYERS_PICKER_STORY_CATEGORIES_CHANGED = 'MAP_LAYERS_PICKER_STORY_CATEGORIES_CHANGED';
export const MAP_LAYERS_PICKER_EVENT_TYPES_CHANGED = 'MAP_LAYERS_PICKER_EVENT_TYPES_CHANGED';
export const ITEM_SELECTED = 'ITEM_SELECTED';
export const EVENTS_START_DATE_CHANGED = 'EVENTS_START_DATE_CHANGED';
export const EVENTS_END_DATE_CHANGED = 'EVENTS_END_DATE_CHANGED';
export const EVENTS_AGE_RANGE_CHANGED = 'EVENTS_AGE_RANGE_CHANGED';
export const EVENTS_COST_CHANGED = 'EVENTS_COST_CHANGED';
export const EVENTS_TYPE_CHANGED = 'EVENTS_TYPE_CHANGED';
export const EVENTS_LOCATION_CHANGED = 'EVENTS_LOCATION_CHANGED';
export const AGE_RANGES_CHANGED = 'AGE_RANGES_CHANGED';
export const COSTS_CHANGED = 'COSTS_CHANGED';
export const EVENT_TYPES_CHANGED = 'EVENT_TYPES_CHANGED';
export const EVENT_LOCATIONS_CHANGED = 'EVENT_LOCATIONS_CHANGED';
export const STORY_CATEGORY_CHANGE = 'STORY_CATEGORY_CHANGE';
export const STORY_CATEGORIES_CHANGE = 'STORY_CATEGORIES_CHANGE';
export const EVENTS_DATA_REQUEST = 'EVENTS_DATA_REQUEST';
export const EVENTS_DATA_RESPONSE = 'EVENTS_DATA_RESPONSE';
export const EVENTS_DATA_ERROR_RESPONSE = 'EVENTS_DATA_ERROR_RESPONSE';

export const STORIES_DATA_REQUEST = 'STORIES_DATA_REQUEST';
export const STORIES_DATA_RESPONSE = 'STORIES_DATA_RESPONSE';
export const STORIES_DATA_ERROR_RESPONSE = 'STORIES_DATA_ERROR_RESPONSE';
export const STORIES_START_DATE_CHANGED = 'STORIES_START_DATE_CHANGED';
export const STORIES_END_DATE_CHANGED = 'STORIES_END_DATE_CHANGED';
export const UPDATE_SELECTED_STORY = 'UPDATE_SELECTED_STORY';

export const ZONE_GEODATA_REQUEST = 'ZONE_GEODATA_REQUEST';
export const ZONE_GEODATA_RESPONSE = 'ZONE_GEODATA_RESPONSE';
export const ZONE_GEODATA_ERROR_RESPONSE = 'ZONE_GEODATA_ERROR_RESPONSE';
export const PROJECTS_GEODATA_REQUEST = 'PROJECTS_GEODATA_REQUEST';
export const PROJECTS_GEODATA_RESPONSE = 'PROJECTS_GEODATA_RESPONSE';
export const PROJECTS_GEODATA_ERROR_RESPONSE = 'PROJECTS_GEODATA_ERROR_RESPONSE';

export const PROJECTS_DATA_REQUEST = 'PROJECTS_DATA_REQUEST';
export const PROJECTS_DATA_RESPONSE = 'PROJECTS_DATA_RESPONSE';
export const PROJECTS_DATA_ERROR_RESPONSE = 'PROJECTS_DATA_ERROR_RESPONSE';
export const UPDATE_SELECTED_PROJECT = 'UPDATE_SELECTED_PROJECT';

export default function (store) {

	return {

		menuToggled () {
			store.dispatch({
				type: MENU_TOGGLED
			});
		},

		menuHidden () {
			store.dispatch({
				type: MENU_HIDDEN
			});
		},

		setState (state) {
			store.dispatch({
				type: SET_STATE,
				state
			});
		},

		/*
		modeChanged (value) {
			// Only allow map or page modes
			value = (value in ['map', 'page'] ? value : 'page');
			store.dispatch({
				type: MODE_CHANGED,
				value: value
			});
		},
		*/

		mapMoved (mapState) {
			store.dispatch({
				type: MAP_MOVED,
				value: mapState
			});
		},

		itemSelected (value) {
			store.dispatch({
				type: ITEM_SELECTED,
				value: value
			});
		},

		// current filter
		eventsMinDateChanged (date) {
			store.dispatch({
				type: EVENTS_START_DATE_CHANGED,
				value: date
			});
		},

		// current filter
		eventsMaxDateChanged (date) {
			store.dispatch({
				type: EVENTS_END_DATE_CHANGED,
				value: date
			});
		},

		// current filter
		eventsAgeRangeChange (age) {
			store.dispatch({
				type: EVENTS_AGE_RANGE_CHANGED,
				value: age
			});
		},

		// current filter
		eventsCostChange (costs) {
			store.dispatch({
				type: EVENTS_COST_CHANGED,
				value: costs
			});
		},

		// current filter
		eventsTypeChange (type) {
			store.dispatch({
				type: EVENTS_TYPE_CHANGED,
				value: type
			});
		},

		// current filter
		eventsLocationChange (location) {
			store.dispatch({
				type: EVENTS_LOCATION_CHANGED,
				value: location
			});
		},

		// filter options
		ageRangesChange (ageRanges) {
			store.dispatch({
				type: AGE_RANGES_CHANGED,
				value: ageRanges
			});
		},

		// filter options
		costsChange (costs) {
			store.dispatch({
				type: COSTS_CHANGED,
				value: costs
			});
		},

		// filter options
		eventTypesChange (eventTypes) {
			store.dispatch({
				type: EVENT_TYPES_CHANGED,
				value: eventTypes
			});
		},

		// filter options
		eventLocationsChange (locations) {
			store.dispatch({
				type: EVENT_LOCATIONS_CHANGED,
				value: locations
			});
		},

		// current filter
		storyCategoryChange (category) {
			store.dispatch({
				type: STORY_CATEGORY_CHANGE,
				value: category
			});
		},

		// filter options
		storyCategoriesChange (categories) {
			store.dispatch({
				type: STORY_CATEGORIES_CHANGE,
				value: categories
			});
		},

		// visibility of additional map layers, e.g. "recreation" (icons)
		mapLayersPickerLayerChange (key, value) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_LAYERS_CHANGED,
				key,
				value
			});
		},

		// visibility of transportation map layer
		mapLayersPickerTransportationChange (key, value) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_TRANSPORTATION_CHANGED,
				key,
				value
			});
		},

		// visibility of stories map marker layer
		mapLayersPickerStoriesChange (value) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_STORIES_CHANGED,
				value
			});
		},

		// visibility of events map marker layer
		mapLayersPickerEventsChange (value) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_EVENTS_CHANGED,
				value
			});
		},

		// visibility of projects map geojson layer
		mapLayersPickerProjectsChange (value) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_PROJECTS_CHANGED,
				value
			});
		},

		// visible story categories
		mapLayersPickerStoryCategoriesChange (key, checked, allCategories=null) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_STORY_CATEGORIES_CHANGED,
				key,
				checked,
				allCategories
			});
		},

		// visible event types
		mapLayersPickerEventTypesChange (key, checked, allTypes=null) {
			store.dispatch({
				type: MAP_LAYERS_PICKER_EVENT_TYPES_CHANGED,
				key,
				checked,
				allTypes
			});
		},

		//
		// Events data actions.
		//
		// Only fetchEventsData should be dispatched directly:
		// requestEventsData, receiveEventsData, and receiveEventsDataError are
		// invoked by fetchEventsData as necessary
		//
		requestEventsData () {
			return {
				type: EVENTS_DATA_REQUEST
			};
		},

		receiveEventsData (json) {
			return {
				type: EVENTS_DATA_RESPONSE,
				items: json.nodes
			};
		},

		receiveEventsDataError (error) {
			return {
				type: EVENTS_DATA_ERROR_RESPONSE,
				error
			};
		},

		fetchEventsData () {
			store.dispatch(dispatch => {
				dispatch(this.requestEventsData());
				return fetch(dataUrls.events)
					.then(response => response.json())
					.then(json => dispatch(this.receiveEventsData(json)))
					.catch(error => dispatch(this.receiveEventsDataError(error)));
			});
		},

		//
		// Stories data actions.
		//
		// Only fetchStoriesData should be dispatched directly:
		// requestStoriesData, receiveStoriesData, and receiveStoriesDataError are
		// invoked by fetchStoriesData as necessary
		//
		requestStoriesData () {
			return {
				type: STORIES_DATA_REQUEST
			};
		},

		receiveStoriesData (json) {
			return {
				type: STORIES_DATA_RESPONSE,
				items: json.nodes
			};
		},

		receiveStoriesDataError (error) {
			return {
				type: STORIES_DATA_ERROR_RESPONSE,
				error
			};
		},

		fetchStoriesData () {
			store.dispatch(dispatch => {
				dispatch(this.requestStoriesData());
				return fetch(dataUrls.stories)
					.then(response => response.json())
					.then(json => dispatch(this.receiveStoriesData(json)))
					.catch(error => dispatch(this.receiveStoriesDataError(error)));
			});
		},

		storiesMinDateChanged (date) {
			store.dispatch({
				type: STORIES_START_DATE_CHANGED,
				value: date
			});
		},

		storiesMaxDateChanged (date) {
			store.dispatch({
				type: STORIES_END_DATE_CHANGED,
				value: date
			});
		},

		updateSelectedStory (story) {
			store.dispatch({
				type: UPDATE_SELECTED_STORY,
				story
			});
		},

		//
		// Projects actions
		//
		// Only fetchProjectsData should be dispatched directly:
		// requestProjectData, receiveProjectData, and receiveProjectDataErrors are
		// invoked by fetchProjectsData as necessary
		//

		requestProjectsData () {
			return {
				type: PROJECTS_DATA_REQUEST
			};
		},

		receiveProjectsData (json) {
			return {
				type: PROJECTS_DATA_RESPONSE,
				items: json.nodes
			};
		},

		receiveProjectsDataError (error) {
			return {
				type: PROJECTS_DATA_ERROR_RESPONSE,
				error
			};
		},

		fetchProjectsData () {
			store.dispatch(dispatch => {
				dispatch(this.requestProjectsData());
				return fetch(dataUrls.projects)
					.then(response => response.json())
					.then(json => dispatch(this.receiveProjectsData(json)))
					.catch(error => dispatch(this.receiveProjectsDataError(error)));
			});
		},

		updateSelectedProject (project) {
			store.dispatch({
				type: UPDATE_SELECTED_PROJECT,
				project
			});
		},

		//
		// GeoData actions
		//
		requestZoneGeoData () {
			return {
				type: ZONE_GEODATA_REQUEST
			};
		},

		receiveZoneGeoData (geojson) {
			// console.log("zones geojson:", geojson.features);
			
			return {
				type: ZONE_GEODATA_RESPONSE,
				geojson
			};
		},

		receiveZoneGeoDataError (error) {
			return {
				type: ZONE_GEODATA_ERROR_RESPONSE,
				error
			};
		},

		fetchZoneGeoData () {
			store.dispatch(dispatch => {
				dispatch(this.requestZoneGeoData());
				return fetch(dataUrls.zones)
					.then(response => response.json())
					.then(json => dispatch(this.receiveZoneGeoData(json)))
					.catch(error => dispatch(this.receiveZoneGeoDataError(error)));
			});
		},

		requestProjectsGeoData () {
			return {
				type: PROJECTS_GEODATA_REQUEST
			};
		},

		receiveProjectsGeoData (geojson) {
			// log all the project names and ids, sorted by id:
			// console.log("projects geojson:", geojson.features.sort((a, b) => +a.properties.bgw_id - +b.properties.bgw_id).map(f => `[${ f.properties.bgw_id }] ${ f.properties.name }`));
			
			return {
				type: PROJECTS_GEODATA_RESPONSE,
				geojson
			};
		},

		receiveProjectsGeoDataError (error) {
			return {
				type: PROJECTS_GEODATA_RESPONSE,
				error
			};
		},

		fetchProjectsGeoData () {
			store.dispatch(dispatch => {
				dispatch(this.requestProjectsGeoData());
				return fetch(dataUrls.projectsGeoData)
					.then(response => response.json())
					.then(json => dispatch(this.receiveProjectsGeoData(json)))
					.catch(error => dispatch(this.receiveProjectsGeoDataError(error)));
			});
		},

		// Utility functions that are not actions, but pull data from the store.
		utils: {

			// ---------------------------------------- //
			// Zones-related data from various sources:
			// zones geojson:
			// 	"cartodb_id": 1,
			// 	"name": "Mission Bay/ Mission Rock",
			// 	"description": null,
			// 	"map_id": "mb"
			//
			// projects CMS:
			// 	"BGW Zone": "Mission Bay/Mission Rock",
			//
			// store.zoneConfigs:
			// 	id: 'mb',
			// 	slug: 'mission_bay_mission_rock',
			// 	bgwZoneId: 'Mission Bay/Mission Rock'
			// ---------------------------------------- //

			/**
			 * @param id {String} short string used in zones geojson file
			 * 		  and client code, but not present in CMS data.
			 * @return {Object} Zone geojson
			 */
			getZoneById (id) {

				let zoneGeodata = get(store.getState().geodata, 'zones.geojson.features');
				return zoneGeodata ? zoneGeodata.find(z => z.properties.map_id === id) : null;

			},

			/**
			 * @param slug {String} slugified zone id used in BGW URLs.
			 * @return {Object} Zone geojson
			 */
			getZoneBySlug (slug) {

				let zoneConfig = store.getState().zoneConfigs.find(z => z.slug === slug);
				return zoneConfig ? this.getZoneById(zoneConfig.id) : null;

			},

			/**
			 * @param bgwId {String} Long, descriptive string from projects CMS.
			 * 		  This string is created and managed by CMS, and appears to be the
			 * 		  only Zone identifier in the CMS, so *should* be safe for use.
			 * @return {Object} Zone geojson.
			 */
			getZoneByBGWId (bgwId) {

				// TODO: map zoneId to zoneName, then return getZoneByBGWId(zoneName)
				// below is untested, semi-psuedocode
				let zone = store.getState().zones.find(z => z.bgwZoneId === bgwId);
				return zone ? this.getZoneById(zoneConfig.id) : null;

			},

			getProjectsInZone (projects, zone) {

				let zoneConfig = store.getState().zoneConfigs.find(z => z.id === zone.properties.map_id);
				return projects.filter(p => p.BGWZone === zoneConfig.bgwZoneId);

			}

		}
	};
};
